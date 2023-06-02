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
    public static class EducationFunctions
    {
        private static readonly EducationDataStore educationDataStore;

        static EducationFunctions()
        {
            educationDataStore = new EducationDataStore();
        }

        [FunctionName("GetAllEducation")]
        public static async Task<IActionResult> GetAllEducation(
            [HttpTrigger(
                AuthorizationLevel.Anonymous, 
                "get",
                Route = "education"
                )
            ] HttpRequest request,
            ILogger log)
        {
            var data = await educationDataStore.GetAllEducationsAsync(log);
            return new OkObjectResult(data);
        }

        [FunctionName("GetEducationById")]
        public static async Task<IActionResult> GetEducation(
            [HttpTrigger(
                AuthorizationLevel.Anonymous, 
                "get",
                Route = "education/{id}"
                )
            ] HttpRequest request,
            string id, 
            ILogger log)
        {
            var idAsGuid = Guid.Parse(id);
            var data = await educationDataStore.GetEducationAsync(idAsGuid, log);
            return new OkObjectResult(data);
        }
    }
}