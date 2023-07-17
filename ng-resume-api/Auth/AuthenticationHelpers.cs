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
        public static async Task<(bool, HttpResponseData?, ClaimsPrincipal?)> AuthenticationHelperAsync(
            this HttpRequestData req,
            FunctionContext functionContext, 
            ILogger log)
        {
            var (status, response, principal) = await req.AuthenticateAzureFunctionApiAsync(functionContext);
            if (!status)
            {
                log.LogWarning($"Unauthorized bearer token submitted.");
            }

            return (status, response, principal);
        }
    }

}
#nullable disable