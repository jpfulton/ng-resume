using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Primitives;

#nullable enable
namespace Jpf.NgResume.Api.Auth
{
    public static class HttpRequestDataExtensions
    {
        public static async Task<(bool, HttpResponseData?)> AuthenticateAzureFunctionApiAsync(
            this HttpRequestData requestData,
            FunctionContext functionContext
            )
        {
            if (requestData == null)
            {
                throw new ArgumentNullException("Parameter requestData cannot be null.");
            }

            var contextFactory = new DefaultHttpContextFactory(functionContext.InstanceServices);
            var featureCollection = new FeatureCollection();

            var httpRequestFeature = new HttpRequestFeature();
            foreach(var header in requestData.Headers) {
                string[] values = header.Value.ToArray();
                httpRequestFeature.Headers.Add(header.Key, new StringValues(values));
            }
            featureCollection.Set<IHttpRequestFeature>(httpRequestFeature);

            var httpResponseFeature = new HttpResponseFeature();
            featureCollection.Set<IHttpResponseFeature>(httpResponseFeature);

            var httpContext = contextFactory.Create(featureCollection);

            AuthenticateResult? result =
                await httpContext.AuthenticateAsync(
                    CustomJwtBearerConstants.DefaultScheme
                    ).ConfigureAwait(false);
            
            if (result.Succeeded)
            {
                // httpContext.User = result.Principal;
                return (true, null);
            }
            else
            {
                /*
                return (false, new UnauthorizedObjectResult(new CustomProblemDetails {
                    Title = "Authorization failed.",
                    Detail = result.Failure?.Message
                }));
                */

                var resp = requestData.CreateResponse(HttpStatusCode.Unauthorized);
                await resp.WriteAsJsonAsync(new CustomProblemDetails {
                    Title = "Authorization failed.",
                    Detail = result.Failure?.Message
                });

                return (false, resp);
            }
        }
    }
}
#nullable disable