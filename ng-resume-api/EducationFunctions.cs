using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

using Jpf.NgResume.Api.DataStore;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Collections.Generic;
using Jpf.NgResume.Api.Models;

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

        [FunctionName("EducationGetAll")]
        [OpenApiOperation(operationId: "EducationGetAll", tags: new[] { "education" })]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json; charset=utf-8",
            bodyType: typeof(IList<Education>),
            Description = "An array of all education items."
        )]
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

        [FunctionName("EducationGetById")]
        [OpenApiOperation(operationId: "EducationGetById", tags: new[] { "education" })]
        [OpenApiParameter(
            name: "id", 
            Required = true, 
            In = ParameterLocation.Path, 
            Type = typeof(Guid))]
        [OpenApiResponseWithBody(
            statusCode: HttpStatusCode.OK,
            contentType: "application/json; charset=utf-8",
            bodyType: typeof(Education),
            Description = "An education item by its id property."
        )]
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
            if ( string.IsNullOrEmpty(id))
                throw new ArgumentNullException("id", "Id is a required parameter.");

            Guid idAsGuid;
            try {
                idAsGuid = Guid.Parse(id);
            }
            catch (FormatException fe) {
                throw new ArgumentException("Id parameter is not in the form of a guid.", "id", fe);
            }
            
            var data = await dataStore.GetEducationAsync(idAsGuid);
            return new OkObjectResult(data);
        }
    }
}