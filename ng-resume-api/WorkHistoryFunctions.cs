using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

using Jpf.NgResume.Api.DataStore;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using System.Net;
using System.Collections.Generic;
using Jpf.NgResume.Api.Models;
using Microsoft.OpenApi.Models;

namespace Jpf.NgResume.Api
{
    /// <summary>
    /// A collection of Http triggered functions implementing the work history
    /// noun in a RESTful API.
    /// </summary>
    public static class WorkHistoryFunctions
    {
        private static readonly WorkHistoryDataStore dataStore;

        static WorkHistoryFunctions()
        {
            dataStore = new WorkHistoryDataStore();
        }

        [FunctionName("WorkHistoryGetAll")]
        [OpenApiOperation(operationId: "WorkHistoryGetAll", tags: new[] { "workhistory" })]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json; charset=utf-8",
            bodyType: typeof(IList<WorkHistory>),
            Description = "An array of all work history items."
        )]
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

        [FunctionName("WorkHistoryGetById")]
        [OpenApiOperation(operationId: "WorkHistoryGetById", tags: new[] { "workhistory" })]
        [OpenApiParameter(
            name: "id", 
            Required = true, 
            In = ParameterLocation.Path, 
            Type = typeof(Guid))]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json; charset=utf-8",
            bodyType: typeof(WorkHistory),
            Description = "A work history item by its id property."
        )]
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
            if ( string.IsNullOrEmpty(id))
                throw new ArgumentNullException("id", "Id is a required parameter.");

            Guid idAsGuid;
            try {
                idAsGuid = Guid.Parse(id);
            }
            catch (FormatException fe) {
                throw new ArgumentException("Id parameter is not in the form of a guid.", "id", fe);
            }
            
            var data = await dataStore.GetWorkHistoryAsync(idAsGuid);
            return new OkObjectResult(data);
        }
    }
}