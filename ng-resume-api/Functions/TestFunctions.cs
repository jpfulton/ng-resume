using Microsoft.AspNetCore.Mvc;
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
using Microsoft.Identity.Web.Resource;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Reflection;
using System.Linq;
using System.Collections;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Jpf.NgResume.Api.Auth;
using Microsoft.Identity.Web;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.AspNetCore.Authentication;

#if DEBUG
using Jpf.NgResume.Api.Diagnostics;
#endif

namespace Jpf.NgResume.Api.Functions
{
    /// <summary>
    /// Host class for test functions.
    /// </summary>
    public class TestFunctions
    {
#if DEBUG
        private static readonly string ARROW = "--> ";
        private readonly IConfiguration configuration;
        private readonly IServiceDescriptorService serviceDescriptorService;

        public TestFunctions(
            IConfiguration configuration,
            IServiceDescriptorService serviceDescriptorService
            ) 
        {
            this.configuration = configuration;
            this.serviceDescriptorService = serviceDescriptorService;
        }
#else
        public TestFunctions() 
        {
        }
#endif

        /// <summary>
        /// Simple GET message processing function for API tests.
        /// </summary>
        /// <param name="req"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        [Function("TestGet")]
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
        public HttpResponseData GetTest(
            [HttpTrigger(
                AuthorizationLevel.Anonymous, 
                "get", 
                Route = "test"
                )
            ] 
            HttpRequestData req,
            ILogger log)
        {
            string name = req.Query["name"];

            string responseMessage = string.IsNullOrEmpty(name)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

            response.WriteString(responseMessage);

            return response;
        }

        /// <summary>
        /// Simple POST message processing function for API tests.
        /// </summary>
        /// <param name="req"></param>
        /// <param name="log"></param>
        /// <returns></returns>
        [Function("TestPost")]
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
        public async Task<HttpResponseData> PostTestAsync(
            [HttpTrigger(
                AuthorizationLevel.Anonymous, 
                "post", 
                Route = "test"
                )
            ]
            HttpRequestData request,
            FunctionContext functionContext)
        {
            var log = functionContext.GetLogger<TestFunctions>();

            var (status, response, user) = await request.AuthenticateAsync(functionContext, log);
            if (!status) return response;

            var displayName = user.GetDisplayName();
            var userId = user.GetObjectId();

            var test = await JsonSerializer.DeserializeAsync<Test>(request.Body);

            test.Id = Guid.NewGuid();
            test.Message = test.Message + $" (Recieved by API from user: {displayName} [{userId}])";

            var resp = request.CreateResponse(HttpStatusCode.OK);
            await resp.WriteAsJsonAsync(test);

            return resp;
        }

#if DEBUG
        [Function("TestLoggerDiagnosticsGet")]
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
            var line = $"{prefix}({objType.FullName}) {name} = \"{obj}\"";
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
                catch (TargetParameterCountException) {
                    data.AppendLine(line + "<TargetParameterCountException> (requires an index).");
                    continue; 
                }

                if (value == null) {
                    data.AppendLine(line + "[null]");
                    continue;
                }
                else {
                    data.AppendLine($"{line} \"{value}\"");
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

                    while (valueEnumerator != null && valueEnumerator.MoveNext())
                    {
                        var dataValue = valueEnumerator.Current;
                        RenderProperties(property.Name, dataValue, data, prefix + ARROW, depth + 1);
                    }
                }
            }
        }

        [Function("TestConfigurationGet")]
        public async Task<HttpResponseData> GetConfigurationValues(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "test/configuration"
                )
            ]
            HttpRequestData req)
        {
            var data = new Dictionary<string, string>();

            foreach(KeyValuePair<string, string> pair in configuration.AsEnumerable()) {
                data.Add(pair.Key, pair.Value);
            }

            var resp = req.CreateResponse(HttpStatusCode.OK);
            await resp.WriteAsJsonAsync(data);

            return resp;

            /*
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
            */
        }

        [Function("TestServiceDescriptorsGet")]
        public HttpResponseData GetServiceDescriptors(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "test/services"
                )
            ]
            HttpRequestData req,
            ILogger log)
        {
            var stringBuilder = new StringBuilder();

            foreach (var service in serviceDescriptorService.GetServiceCollection()) {

                if (service.ServiceType.Equals(typeof(JwtBearerHandler))) {
                    break;
                }

                stringBuilder.AppendLine(
                    $"[{service.ServiceType.FullName}] ({service.Lifetime})"
                );
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

            response.WriteString(stringBuilder.ToString());

            return response;
        }
#endif
    }
}
