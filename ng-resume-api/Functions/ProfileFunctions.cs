using System.Net;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Auth;
using Jpf.NgResume.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.OpenApi.Models;

namespace Jpf.NgResume.Api.Functions
{

    public class ProfileFunctions
    {
        private readonly GraphServiceClient graphServiceClient;

        public ProfileFunctions(GraphServiceClient graphServiceClient)
        {
            this.graphServiceClient = graphServiceClient;
        }

        [FunctionName("ProfileGet")]
        [OpenApiOperation(operationId: "Get", tags: new[] { "profile" })]
        [OpenApiSecurity(
            "Bearer", 
            SecuritySchemeType.Http, 
            Scheme = OpenApiSecuritySchemeType.Bearer, 
            BearerFormat = "JWT",
            In = OpenApiSecurityLocationType.Header)]
        [OpenApiRequestBody(
            contentType: "application/json; charset=utf-8",
            bodyType: typeof(User)
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType:  "application/json; charset=utf-8",
            bodyType: typeof(User),
            Description = "A user representing the current user's profile."
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.Unauthorized,
            contentType:  "application/problem+json; charset=utf-8",
            bodyType: typeof(CustomProblemDetails),
            Description = "Problem details of an unauthorized access result."
        )]
        public async Task<IActionResult> GetAsync(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "profile"
                )
            ]
            HttpRequest req,
            ILogger log)
        {
            var me = await graphServiceClient.Me.GetAsync();
            var user = User.FromMicrosoftGraphUser(me);

            return new OkObjectResult(user);
        }
    }
}
