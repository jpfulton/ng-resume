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
    /// <summary>
    /// Collection of Http triggered functions implementing the education
    /// noun in a RESTful API.
    /// </summary>
    public static class EducationFunctions
    {
        private static readonly EducationDataStore dataStore;

        static EducationFunctions()
        {
            dataStore = new EducationDataStore();
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
            var data = await dataStore.GetAllEducationsAsync();
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
            var data = await dataStore.GetEducationAsync(idAsGuid);
            return new OkObjectResult(data);
        }
    }
}