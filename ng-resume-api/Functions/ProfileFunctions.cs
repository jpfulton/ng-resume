using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Azure.Core;
using Azure.Identity;
using Jpf.NgResume.Api.Auth;
using Jpf.NgResume.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;

namespace Jpf.NgResume.Api.Functions
{

    public class ProfileFunctions
    {
        private readonly GraphServiceClient graphClient;

        public ProfileFunctions(
            GraphServiceClient graphClient
            )
        {
            this.graphClient = graphClient;
        }

        [Function("ProfileGet")]
        [OpenApiOperation(operationId: "Get", tags: new[] { "profile" })]
        [OpenApiSecurity(
            "Bearer", 
            SecuritySchemeType.Http, 
            Scheme = OpenApiSecuritySchemeType.Bearer, 
            BearerFormat = "JWT",
            In = OpenApiSecurityLocationType.Header)]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType:  "application/json; charset=utf-8",
            bodyType: typeof(Models.User),
            Description = "A user representing the current user's profile."
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.Unauthorized,
            contentType:  "application/problem+json; charset=utf-8",
            bodyType: typeof(CustomProblemDetails),
            Description = "Problem details of an unauthorized access result."
        )]
        public async Task<HttpResponseData> GetAsync(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "profile"
                )
            ]
            HttpRequestData request,
            FunctionContext functionContext)
        {
            var log = functionContext.GetLogger<TestFunctions>();

            var (authorized, authorizationResponse, user) =
                await request.AuthenticateThenAuthorizeWithGroup(
                    functionContext,
                    graphClient,
                    log,
                    null);
            if (!authorized) return authorizationResponse;

            var response = request.CreateResponse();
            await response.WriteAsJsonAsync(user);

            return response;
        }
    }
}
