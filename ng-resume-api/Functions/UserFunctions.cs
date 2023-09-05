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
            Description = "A list of application users."
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
            var log = functionContext.GetLogger<UserFunctions>();

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

        [Function("UsersGetUserGroupMembership")]
        [OpenApiOperation(operationId: "GetUserGroupMembership", tags: new[] { "users" })]
        [OpenApiSecurity(
            "Bearer",
            SecuritySchemeType.Http,
            Scheme = OpenApiSecuritySchemeType.Bearer,
            BearerFormat = "JWT",
            In = OpenApiSecurityLocationType.Header)]
        [OpenApiParameter(
            "userId",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "Id of the user."
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json; charset=utf-8",
            bodyType: typeof(List<Models.Group>),
            Description = "A list of application groups."
        )]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.Unauthorized,
            contentType: "application/problem+json; charset=utf-8",
            bodyType: typeof(CustomProblemDetails),
            Description = "Problem details of an unauthorized access result."
        )]
        public async Task<HttpResponseData> GetUserGroupMembershipAsync(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "users/{userId}/groups"
                )
            ]
            HttpRequestData request,
            string userId,
            FunctionContext functionContext)
        {
            var log = functionContext.GetLogger<GroupFunctions>();

            var (authorized, authorizationResponse) =
                await request.AuthenticateThenAuthorizeWithGroup(
                    functionContext,
                    graphClient,
                    log,
                    "SiteOwners");
            if (!authorized) return authorizationResponse;

            var memberships = await graphClient.Users[userId]
                .MemberOf
                .Request()
                .GetAsync();

            var graphGroups = memberships
                .Where(p => p.GetType() == typeof(Microsoft.Graph.Group))
                .Cast<Microsoft.Graph.Group>()
                .ToList();

            var groups = new List<Models.Group>();
            graphGroups.ForEach((msGroup) =>
            {
                groups.Add(msGroup.FromMicrosoftGraph());
            });

            var response = request.CreateResponse();
            await response.WriteAsJsonAsync(groups);

            return response;
        }
    }
}