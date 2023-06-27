using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Azure.Core;
using Azure.Identity;
using Jpf.NgResume.Api.Auth;
using Jpf.NgResume.Api.MicrosoftGraph;
using Jpf.NgResume.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

namespace Jpf.NgResume.Api.Functions
{

    public class TokenEnrichmentFunctions
    {
        private readonly IConfiguration configuration;
        private readonly GraphServiceClient graphClient;

        public TokenEnrichmentFunctions(
            IConfiguration configuration,
            GraphServiceClient graphClient
            )
        {
            this.configuration = configuration;
            this.graphClient = graphClient;
        }

        [Function("TokenEnrichmentWithGroupsPost")]
        public async Task<HttpResponseData> PostAsync(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "post",
                Route = "token/enrichwithgroups"
                )
            ]
            HttpRequestData request,
            FunctionContext functionContext)
        {
            var log = functionContext.GetLogger<TokenEnrichmentFunctions>();

            // Check HTTP basic authorization
            if (!AuthorizeViaBasic(request, log)) {
                log.LogWarning("HTTP basic authentication validation failed.");

                var errorResponse = request.CreateResponse(HttpStatusCode.Unauthorized);
                return errorResponse;
            }

            // get the request body
            string body = "";
            using (var reader = new StreamReader(request.Body)) {
                body = await reader.ReadToEndAsync();
            }
            dynamic requestData = JsonConvert.DeserializeObject(body);

            // If input data is null, show block page
            if (requestData == null)
            {
                var errorData = new B2cResponseContent("ShowBlockPage", "There was a problem with your request.");

                var errorResponse = request.CreateResponse();
                await errorResponse.WriteAsJsonAsync(errorData);
                return errorResponse;
            }

            // validate request, objectId is sent by default
            if (requestData.objectId == null || requestData.objectId.ToString() == "") {
                var errorData = new B2cResponseContent("ShowBlockPage", "ObjectId is mandatory.");

                var errorResponse = request.CreateResponse();
                await errorResponse.WriteAsJsonAsync(errorData);
                return errorResponse;
            }

            // get the objectId from the request
            string objectId = requestData.objectId.ToString();

            // get the user and member groups from the graph client
            Models.User appUser = null;
            try
            {
                var user = await graphClient.Users[objectId].Request()
                    .SelectUserProperties()
                    .GetAsync();

                var memberships = await graphClient.Users[objectId]
                    .MemberOf
                    .Request()
                    .GetAsync();

                var groups = memberships
                    .Where(p => p.GetType() == typeof(Microsoft.Graph.Group))
                    .Cast<Microsoft.Graph.Group>()
                    .ToList();

                appUser = user.FromMicrosoftGraph(groups);
            }
            catch (Exception e) {
                log.LogError(e, "Exception while querying MS Graph for user during token enrichment.");

                var errorData = new B2cResponseContent("ShowBlockPage", "No user exists for the objectId.");

                var errorResponse = request.CreateResponse();
                await errorResponse.WriteAsJsonAsync(errorData);
                return errorResponse;
            }

            // create a comma separated list of groups this user belongs to
            var groupMembership = string.Join(",", appUser.MemberOf.Select(group => group.DisplayName).ToArray());

            // send a success response with the group membership populated
            var responseData = new B2cResponseContent()
            {
                extension_GroupMembership = groupMembership
            };
            var response = request.CreateResponse();
            await response.WriteAsJsonAsync(responseData);

            return response;
        }

        private bool AuthorizeViaBasic(HttpRequestData req, ILogger log)
        {
            // Get the environment's credentials 
            // string username = System.Environment.GetEnvironmentVariable("BASIC_AUTH_USERNAME", EnvironmentVariableTarget.Process);
            // string password = System.Environment.GetEnvironmentVariable("BASIC_AUTH_PASSWORD", EnvironmentVariableTarget.Process);
            
            string username = configuration.GetValue<string>("AdB2c_Enrichment_Basic_Auth_Username");
            string password = configuration.GetValue<string>("AdB2c_Enrichment_Basic_Auth_Password");

            // Returns unauthorized if the username is empty or not exists.
            if (string.IsNullOrEmpty(username))
            {
                log.LogInformation("HTTP basic authentication is not set.");
                return false;
            }

            // Check if the HTTP Authorization header exist
            if (!req.Headers.Any(pair => pair.Key.Equals("Authorization")))
            {
                log.LogWarning("Missing HTTP basic authentication header.");
                return false;
            }

            // Read the authorization header
            // var auth = req.Headers["Authorization"].ToString();
            var auth = req.Headers.GetValues("Authorization").FirstOrDefault();

            log.LogInformation($"Authorization Header Value: '{auth}'"); // REMOVE ME LATER

            // Ensure the type of the authorization header id `Basic`
            if (!auth.StartsWith("Basic "))
            {
                log.LogWarning("HTTP basic authentication header must start with 'Basic '.");
                return false;
            }

            // Get the the HTTP basinc authorization credentials
            var cred = System.Text.UTF8Encoding.UTF8.GetString(Convert.FromBase64String(auth.Substring(6))).Split(':');

            // Evaluate the credentials and return the result
            return (cred[0] == username && cred[1] == password);
        }
    }

    public class B2cResponseContent
    {
        public const string ApiVersion = "1.0.0";

        public B2cResponseContent()
        {
            this.version = B2cResponseContent.ApiVersion;
            this.action = "Continue";
        }

        public B2cResponseContent(string action, string userMessage)
        {
            this.version = B2cResponseContent.ApiVersion;
            this.action = action;
            this.userMessage = userMessage;
            if (action == "ValidationError")
            {
                this.status = "400";
            }
        }

        public string version { get; }
        public string action { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string userMessage { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string status { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string extension_GroupMembership { get; set; }
    }

}