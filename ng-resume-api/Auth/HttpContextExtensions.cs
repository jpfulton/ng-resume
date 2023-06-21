using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

#nullable enable
namespace Jpf.NgResume.Api.Auth
{
    public static class HttpContextExtensions
    {
        /// <summary>
        /// Enables Bearer authentication for an API for use in Azure Functions.
        /// </summary>
        /// <param name="httpContext">The current HTTP Context, such as req.HttpContext.</param>
        /// <returns>A task indicating success or failure. In case of failure <see cref="Microsoft.Identity.Web.UnauthorizedObjectResult"/>.</returns>
        public static async Task<(bool, IActionResult?)> AuthenticateAzureFunctionApiAsync(this HttpContext httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException("Parameter httpContext cannot be null.");
            }

            AuthenticateResult? result =
                await httpContext.AuthenticateAsync(
                    CustomJwtBearerConstants.DefaultScheme
                    ).ConfigureAwait(false);
            
            if (result.Succeeded)
            {
                httpContext.User = result.Principal;
                return (true, null);
            }
            else
            {
                return (false, new UnauthorizedObjectResult(new CustomProblemDetails {
                    Title = "Authorization failed.",
                    Detail = result.Failure?.Message
                }));
            }
        }
    }

    public class CustomProblemDetails : ProblemDetails
    {
        new private IDictionary<string, object?>? Extensions { get; }
    }
}
#nullable disable