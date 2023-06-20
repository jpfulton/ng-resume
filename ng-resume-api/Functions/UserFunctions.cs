using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;

namespace Jpf.NgResume.Api.Functions {

    public class UserFunctions {
        private readonly GraphServiceClient graphServiceClient;

        public UserFunctions(GraphServiceClient graphServiceClient) {
            this.graphServiceClient = graphServiceClient;
        }

        [Function("UsersGetAll")]
        public async Task<IActionResult> GetAllAsync(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "users"
                )
            ]
            HttpRequest req,
            ILogger log)
        {
            var usersResponse = await graphServiceClient.Users.GetAsync();
            return new OkObjectResult(usersResponse.Value);
        }
    }

}