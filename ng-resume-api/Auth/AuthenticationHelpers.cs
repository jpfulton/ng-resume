using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

#nullable enable
namespace Jpf.NgResume.Api.Auth {

    public static class AuthenticationHelpers
    {
        public static async Task<(bool, IActionResult?)> AuthenticationHelperAsync(HttpRequest req, ILogger log) {
            var (status, response) = await req.HttpContext.AuthenticateAzureFunctionApiAsync();
            if (!status)
            {
                log.LogWarning($"Unauthorized bearer token submitted.");
            }

            return (status, response);
        }

        public static async Task<(bool, HttpResponseData?)> AuthenticationHelperAsync(
            HttpRequestData req,
            FunctionContext functionContext, 
            ILogger log) 
        {
            var (status, response) = await req.AuthenticateAzureFunctionApiAsync(functionContext);
            if (!status)
            {
                log.LogWarning($"Unauthorized bearer token submitted.");
            }

            return (status, response);
        }
    }

}
#nullable disable