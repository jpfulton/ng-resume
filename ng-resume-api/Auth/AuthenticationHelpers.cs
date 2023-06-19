using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

#nullable enable
namespace Jpf.NgResume.Api.Auth {

    public static class AuthenticationHelpers
    {
        public static async Task<(bool, IActionResult?)> AuthenticationHelperAsync(HttpRequest req, ILogger log) {
            var (status, response) = await req.HttpContext.AuthenticateAzureFunctionApiAsync();
            if (!status)
            {
                var token = req.Headers[CustomJwtBearerConstants.HeaderName][0];
                log.LogWarning($"Unauthorized bearer token submitted: [{token}]");
            }

            return (status, response);
        }
    }

}
#nullable disable