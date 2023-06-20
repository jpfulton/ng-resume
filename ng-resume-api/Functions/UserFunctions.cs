using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;

namespace Jpf.NgResume.Api.Functions {

    public class UserFunctions {
        private readonly GraphServiceClient graphServiceClient;

        public UserFunctions(GraphServiceClient graphServiceClient) {
            this.graphServiceClient = graphServiceClient;
        }

        [FunctionName("UsersGetAll")]
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