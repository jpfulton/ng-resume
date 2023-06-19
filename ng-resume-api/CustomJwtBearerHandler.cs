using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Jpf.NgResume.Api
{
    public class CustomJwtBearerHandler : JwtBearerHandler {

        public CustomJwtBearerHandler(
            IOptionsMonitor<JwtBearerOptions> options, 
            ILoggerFactory logger, 
            UrlEncoder encoder, 
            ISystemClock clock) : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync() {
            Logger.LogInformation("Using CustomJwtBearerHandler.");

            // Incoming request from Azure or the function host use this
            // header to bear the Jwt token
            var standardAuthToken = Request.Headers["Authorization"];
            var token = Request.Headers[CustomJwtBearerConstants.HeaderName];

            if (!string.IsNullOrEmpty(token))
            {
                // if the Custom header token is present, we are working with the client
                // which uses a sepearate header to bear its Jwt tokens.
                Logger.LogInformation("Request incoming from client application.");
                Logger.LogInformation($"Bearer token: {token}");

                // place that token into the "standard" header for processing inside
                // the base JwtBearerHandler implementation which offers no configurable
                // mechanism to specific the header to use at time of writing (6/19/2023)
                Request.Headers.Remove("Authorization"); // remove if present
                Request.Headers.Add("Authorization", token); // add custom header token value
            }
            else {
                Logger.LogInformation("Request incoming from Azure or function host.");
                Logger.LogInformation($"Bearer token: {standardAuthToken}");
            }

            // call base implementation to address authentication on token
            return base.HandleAuthenticateAsync();
        }

    }
}