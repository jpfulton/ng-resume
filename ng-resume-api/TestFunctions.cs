using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using System.Net;
using Microsoft.OpenApi.Models;
using Jpf.NgResume.Api.Models;
using System.Threading.Tasks;
using System;
using System.Text.Json;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Reflection;
using System.Linq;
using System.Collections;

namespace Jpf.NgResume.Api
{
    /// <summary>
    /// Host class for test functions.
    /// </summary>
    public class TestFunctions
    {
        private static readonly string ARROW = "--> ";
        private IConfiguration configuration;
        
        public TestFunctions(IConfiguration configuration) {
            this.configuration = configuration;
        }

        /// <summary>
        /// Simple GET message processing function for API tests.
        /// </summary>
        /// <param name="req"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        [FunctionName("TestGet")]
        [OpenApiOperation(operationId: "Get", tags: new[] { "test" })]
        [OpenApiParameter(
            name: "name", 
            Required = false, 
            In = ParameterLocation.Query, 
            Type = typeof(string))]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "text/plain; charset=utf-8",
            bodyType: typeof(string),
            Description = "A formatted test string."
        )]
        public IActionResult GetTest(
            [HttpTrigger(
                AuthorizationLevel.Anonymous, 
                "get", 
                Route = "test"
                )
            ] 
            HttpRequest req,
            ILogger log)
        {
            string name = req.Query["name"];

            string responseMessage = string.IsNullOrEmpty(name)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

            return new OkObjectResult(responseMessage);
        }

        /// <summary>
        /// Simple POST message processing function for API tests.
        /// </summary>
        /// <param name="req"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        [FunctionName("TestPost")]
        [OpenApiOperation(operationId: "Add", tags: new[] { "test" })]
        [OpenApiSecurity(
            "Bearer", 
            SecuritySchemeType.Http, 
            Scheme = OpenApiSecuritySchemeType.Bearer, 
            BearerFormat = "JWT",
            In = OpenApiSecurityLocationType.Header)]
        [OpenApiRequestBody(
            contentType: "application/json; charset=utf-8",
            bodyType: typeof(Test)
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType:  "application/json; charset=utf-8",
            bodyType: typeof(Test),
            Description = "A response with a formatted message string and assigned Id property."
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.Unauthorized,
            contentType:  "application/problem+json; charset=utf-8",
            bodyType: typeof(CustomProblemDetails),
            Description = "Problem details of an unauthorized access result."
        )]
        public async Task<IActionResult> PostTestAsync(
            [HttpTrigger(
                AuthorizationLevel.Function, 
                "post", 
                Route = "test"
                )
            ]
            Test test,
            HttpRequest req,
            ILogger log)
        {
            var (status, response) = await req.HttpContext.AuthenticateAzureFunctionAsync();
            if (!status)
            {
                var token = req.Headers["Authorization"][0];
                log.LogWarning($"Unauthorized bearer token submitted: [{token}]");
                
                return response;
            }

            var scopes = new string[] {"test.write"};
            req.HttpContext.VerifyUserHasAnyAcceptedScope(scopes);

            var user = req.HttpContext.User;
            var displayName = user.GetDisplayName();
            var userId = user.GetObjectId();

            test.Id = Guid.NewGuid();
            test.Message = test.Message + $" (Recieved by API from user: {displayName} [{userId}])";

            return new OkObjectResult(test);
        }

        [FunctionName("TestLoggerDiagnosticsGet")]
        public IActionResult GetLoggerDiagnostics(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "test/logger"
                )
            ]
            HttpRequest req,
            ILogger log)
        {
            var data = new StringBuilder();

            var logType = log.GetType();
            var logTypeName = logType.AssemblyQualifiedName;

            data.AppendLine($"ILogger Concrete Implementation [{logTypeName}]");
            data.AppendLine();

            RenderProperties("log", log, data);

            return new OkObjectResult(data.ToString());
        }

        private static void RenderProperties(
            string name,
            object obj, 
            StringBuilder data, 
            string prefix = "", 
            int depth = 0)
        {
            var objType = obj.GetType();
            var line = $"{prefix}({objType.FullName}) {name} = \"{obj.ToString()}\"";
            data.AppendLine(line);

            if (depth > 10) return;

            if (objType.IsPrimitive || 
                objType.Equals(typeof(string)) ||
                objType.Equals(typeof(Type)) ||
                objType.Name.Equals("RuntimeType") ||
                objType.FullName.StartsWith("System.Reflection")
                )
            {
                return;
            }

            prefix = prefix + ARROW;

            var properties = objType.GetProperties(
                            BindingFlags.Instance |
                            BindingFlags.Static |
                            BindingFlags.Public |
                            BindingFlags.NonPublic
                        );
            foreach (var property in properties)
            {
                line = $"{prefix}({property.PropertyType.FullName}) {property.Name} = ";
                object value;
                try
                {
                    value = property.GetValue(obj);
                }
                catch (Exception) {
                    data.AppendLine(line + "<exception>");
                    continue; 
                }

                if (value == null) {
                    data.AppendLine(line + "[null]");
                    continue;
                }
                else {
                    data.AppendLine($"{line} \"{value.ToString()}\"");
                }

                var valueType = value.GetType();
                if (valueType.Equals(typeof(string)))
                {
                    continue;
                }

                if (valueType.GetMethods().Any(m => m.Name.Equals("GetEnumerator")))
                {
                    var enumeratorMethod = valueType.GetMethod("GetEnumerator");

                    var valueEnumerator = enumeratorMethod.Invoke(value, null) as IEnumerator;
                    if (valueEnumerator == null) valueEnumerator = enumeratorMethod.Invoke(value, null) as IEnumerator<object>;

                    while (valueEnumerator.MoveNext())
                    {
                        var dataValue = valueEnumerator.Current;
                        RenderProperties(property.Name, dataValue, data, prefix + ARROW, depth + 1);
                    }
                }
            }
        }

#if DEBUG
        [FunctionName("TestConfigurationGet")]
        public async Task<IActionResult> GetConfigurationValues(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "test/configuration"
                )
            ]
            HttpRequest req,
            ILogger log)
        {
            var data = new Dictionary<string, string>();

            foreach(KeyValuePair<string, string> pair in configuration.AsEnumerable()) {
                data.Add(pair.Key, pair.Value);
            }

            var stream = new MemoryStream();
            var options = new JsonSerializerOptions()
            {
                WriteIndented = true
            };
            await JsonSerializer.SerializeAsync<Dictionary<string, string>>(stream, data, options);

            stream.Position = 0;
            using (StreamReader reader = new StreamReader(stream, Encoding.UTF8))
            {
                return new OkObjectResult(await reader.ReadToEndAsync());
            }
        }
#endif
    }
}
