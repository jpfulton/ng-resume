using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Auth;
using Jpf.NgResume.Api.MicrosoftGraph;
using Jpf.NgResume.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Graph;
using Microsoft.OpenApi.Models;

namespace Jpf.NgResume.Api.Functions
{

    public class UserFunctions {
        private readonly GraphServiceClient graphClient;

        public UserFunctions(GraphServiceClient graphClient) {
            this.graphClient = graphClient;
        }

        [Function("UsersGetAll")]
        [OpenApiOperation(operationId: "GetAll", tags: new[] { "users" })]
        [OpenApiSecurity(
            "Bearer", 
            SecuritySchemeType.Http, 
            Scheme = OpenApiSecuritySchemeType.Bearer, 
            BearerFormat = "JWT",
            In = OpenApiSecurityLocationType.Header)]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType:  "application/json; charset=utf-8",
            bodyType: typeof(List<Models.User>),
            Description = "A user representing the current user's profile."
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.Unauthorized,
            contentType:  "application/problem+json; charset=utf-8",
            bodyType: typeof(CustomProblemDetails),
            Description = "Problem details of an unauthorized access result."
        )]
        public async Task<HttpResponseData> GetAllAsync(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "users"
                )
            ]
            HttpRequestData request,
            FunctionContext functionContext)
        {
            var log = functionContext.GetLogger<TestFunctions>();

            var (authorized, authorizationResponse) =
                await request.AuthenticateThenAuthorizeWithGroup(
                    functionContext,
                    graphClient,
                    log,
                    "SiteOwners");
            if (!authorized) return authorizationResponse;

            var users = await graphClient.Users
                    .Request()
                    .SelectUserProperties()
                    .GetAsync();

            // Iterate over all the users in the directory
            var pageIterator = PageIterator<Microsoft.Graph.User>
                .CreatePageIterator(
                    graphClient,
                    users,
                    // Callback executed for each user in the collection
                    (user) =>
                    {
                        // users.Add(user);
                        return true;
                    }
                    /*
                    // Used to configure subsequent page requests
                    (req) =>
                    {
                        return req;
                    }
                    */
                );

            await pageIterator.IterateAsync();

            var appUsers = new List<Models.User>();
            users.ToList().ForEach(user =>
            {
                appUsers.Add(user.FromMicrosoftGraph());
            });

            var response = request.CreateResponse();
            await response.WriteAsJsonAsync(appUsers);

            return response;
        }
    }
}