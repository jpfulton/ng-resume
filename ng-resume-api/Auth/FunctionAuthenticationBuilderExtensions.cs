using System.Linq;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;

namespace Jpf.NgResume.Api.Auth
{

    public static class FunctionAuthenticationBuilderExtensions {

        public static MicrosoftIdentityWebApiAuthenticationBuilderWithConfiguration AddMicrosoftIdentityFunctionApi(
            this AuthenticationBuilder builder,
            IConfiguration configuration,
            string configurationSectionName,
            string jwtBearerScheme = JwtBearerDefaults.AuthenticationScheme,
            bool subscribeToJwtBearerMiddlewareDiagnosticsEvents = false)
        {

            // call AddMicrosoftIdentityWebApi to work its internal magic to
            // wire up authentication and authorization services and handlers
            var builderWithConfiguration = builder.AddMicrosoftIdentityWebApi(
                configuration,
                configurationSectionName, 
                jwtBearerScheme,
                subscribeToJwtBearerMiddlewareDiagnosticsEvents);

            // find and remove the JwtBearerHandler that was registered above
            var jwtService = builderWithConfiguration.Services
                .FirstOrDefault(service => service.ServiceType.Equals(typeof(JwtBearerHandler)));
            builderWithConfiguration.Services.Remove(jwtService);

            // replace the JwtBearerHandler with a CustomJwtBearerHandler that will
            // trade out header values to move the tokens for each use case:
            //  - Azure and function host alls to the fuction app to manage it
            //  - Calls from the client application to be authenticated/authorized via application logic
            var customJwtService = new ServiceDescriptor(
                typeof(JwtBearerHandler),
                typeof(CustomJwtBearerHandler),
                ServiceLifetime.Transient
            );
            builder.Services.Add(customJwtService);

            // return the results of AddMicrosoftIdentityWebApi with our modifications
            return builderWithConfiguration;
        }
    }
}