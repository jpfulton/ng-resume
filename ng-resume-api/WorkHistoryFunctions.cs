using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

using Jpf.NgResume.Api.DataStore;

namespace Jpf.NgResume.Api
{
    public static class WorkHistoryFunctions
    {
        private static readonly WorkHistoryDataStore dataStore;

        static WorkHistoryFunctions()
        {
            dataStore = new WorkHistoryDataStore();
        }

        [FunctionName("GetAllWorkHistory")]
        public static async Task<IActionResult> GetAllWorkHistory(
            [HttpTrigger(
                AuthorizationLevel.Anonymous, 
                "get",
                Route = "workhistory"
                )
            ] HttpRequest request,
            ILogger log)
        {
            var data = await dataStore.GetAllWorkHistoriesAsync();
            return new OkObjectResult(data);
        }

        [FunctionName("GetWorkHistoryById")]
        public static async Task<IActionResult> GetWorkHistory(
            [HttpTrigger(
                AuthorizationLevel.Anonymous, 
                "get",
                Route = "workhistory/{id}"
                )
            ] HttpRequest request,
            string id, 
            ILogger log)
        {
            var idAsGuid = Guid.Parse(id);
            var data = await dataStore.GetWorkHistoryAsync(idAsGuid);
            return new OkObjectResult(data);
        }
    }
}