using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

#nullable enable
namespace Jpf.NgResume.Api.Auth
{
    public static class HttpRequestDataExtensions
    {
        public static async Task<(bool, HttpResponseData?, ClaimsPrincipal?)> AuthenticateAsync(
            this HttpRequestData requestData,
            FunctionContext functionContext,
            ILogger log
            )
        {
            if (requestData == null)
            {
                throw new ArgumentNullException("Parameter requestData cannot be null.");
            }

            var httpContext = GetHttpContext(requestData, functionContext);

            AuthenticateResult? result =
                await httpContext.AuthenticateAsync().ConfigureAwait(false);

            if (result.Succeeded)
            {
                return (true, null, result.Principal);
            }
            else
            {
                log.LogWarning("Unauthorized bearer token submitted.");

                var resp = requestData.CreateResponse();
                await resp.WriteAsJsonAsync(new CustomProblemDetails
                {
                    Title = "Authentication failed.",
                    Detail = result.Failure?.Message
                });
                resp.StatusCode = HttpStatusCode.Unauthorized;

                return (false, resp, null);
            }
        }

        private static HttpContext GetHttpContext(
            HttpRequestData requestData, 
            FunctionContext functionContext
            )
        {
            var contextFactory = new DefaultHttpContextFactory(functionContext.InstanceServices);
            var featureCollection = new FeatureCollection();

            var httpRequestFeature = new HttpRequestFeature();
            foreach (var header in requestData.Headers)
            {
                string[] values = header.Value.ToArray();
                httpRequestFeature.Headers.Add(header.Key, new StringValues(values));
            }
            featureCollection.Set<IHttpRequestFeature>(httpRequestFeature);

            var httpResponseFeature = new HttpResponseFeature();
            featureCollection.Set<IHttpResponseFeature>(httpResponseFeature);

            var httpContext = contextFactory.Create(featureCollection);
            return httpContext;
        }
    }
}
#nullable disable