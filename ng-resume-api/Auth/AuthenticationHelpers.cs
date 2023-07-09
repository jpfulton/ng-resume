using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

#nullable enable
namespace Jpf.NgResume.Api.Auth {

    public static class AuthenticationHelpers
    {
        public static async Task<(bool, IActionResult?)> AuthenticationHelperAsync(
            this HttpRequest req, 
            ILogger log) 
        {
            var (status, response) = await req.HttpContext.AuthenticateAzureFunctionApiAsync();
            if (!status)
            {
                log.LogWarning($"Unauthorized bearer token submitted.");
            }

            return (status, response);
        }

        public static async Task<(bool, HttpResponseData?, ClaimsPrincipal?)> AuthenticationHelperAsync(
            this HttpRequestData req,
            FunctionContext functionContext, 
            ILogger log) 
        {
            var (status, response, user) = await req.AuthenticateAzureFunctionApiAsync(functionContext);
            if (!status)
            {
                log.LogWarning($"Unauthorized bearer token submitted.");
            }

            return (status, response, user);
        }
    }

}
#nullable disable