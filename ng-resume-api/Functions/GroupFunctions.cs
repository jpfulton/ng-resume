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

    public class GroupFunctions {
        private readonly GraphServiceClient graphClient;

        public GroupFunctions(GraphServiceClient graphClient) {
            this.graphClient = graphClient;
        }

        [Function("GroupsGetAll")]
        [OpenApiOperation(operationId: "GetAll", tags: new[] { "groups" })]
        [OpenApiSecurity(
            "Bearer", 
            SecuritySchemeType.Http, 
            Scheme = OpenApiSecuritySchemeType.Bearer, 
            BearerFormat = "JWT",
            In = OpenApiSecurityLocationType.Header)]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType:  "application/json; charset=utf-8",
            bodyType: typeof(List<Models.Group>),
            Description = "A list of application groups."
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
                Route = "groups"
                )
            ]
            HttpRequestData request,
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

            var groups = await graphClient.Groups
                .Request()
                .SelectGroupProperties()
                .GetAsync();

            // Iterate over all the groups in the directory
            var pageIterator = PageIterator<Microsoft.Graph.Group>
                .CreatePageIterator(
                    graphClient,
                    groups,
                    // Callback executed for each group in the collection
                    (group) =>
                    {
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

            var appGroups = new List<Models.Group>();
            groups.ToList().ForEach(group =>
            {
                appGroups.Add(group.FromMicrosoftGraph());
            });

            var response = request.CreateResponse();
            await response.WriteAsJsonAsync(appGroups);

            return response;
        }
    }
}