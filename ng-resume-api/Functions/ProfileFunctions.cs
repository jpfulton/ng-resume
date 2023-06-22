using System.Net;
using System.Threading.Tasks;
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
        private readonly GraphServiceClient graphServiceClient;

        public ProfileFunctions(GraphServiceClient graphServiceClient)
        {
            this.graphServiceClient = graphServiceClient;
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
            bodyType: typeof(User),
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
            var (status, resp, user) = await AuthenticationHelpers.AuthenticationHelperAsync(request, functionContext, log);
            if (!status) return resp;

            // var me = await graphServiceClient.Me.GetAsync();
            
            var userId = user.GetObjectId();
            var me = await graphServiceClient.Users[userId].GetAsync();
            var appUser = User.FromMicrosoftGraphUser(me);

            var response = request.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(appUser);

            return response;
        }
    }
}
