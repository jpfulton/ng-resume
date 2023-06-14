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

namespace Jpf.NgResume.Api
{
    /// <summary>
    /// Host class for test functions.
    /// </summary>
    public static class MessageTestFunction
    {
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
        public static IActionResult GetTest(
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
        public static IActionResult PostTest(
            [HttpTrigger(
                AuthorizationLevel.Function, 
                "post", 
                Route = "test"
                )
            ]
            Test test,
            ILogger log)
        {
            test.Id = Guid.NewGuid();
            test.Message = test.Message + " (Recieved by API.)";

            return new OkObjectResult(test);
        }
    }
}
