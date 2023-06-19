using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

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
            Logger.LogInformation("Using custom JwtBearerHandler.");

            var standardAuthToken = Request.Headers["Authoization"];

            if (string.IsNullOrEmpty(standardAuthToken))
            {
                var token = Request.Headers[CustomJwtBearerConstants.HeaderName];
                Request.Headers.Add("Authorization", token);
            }

            return base.HandleAuthenticateAsync();
        }

    }
}