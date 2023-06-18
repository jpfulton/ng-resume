using System;
using System.Reflection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;

namespace Jpf.NgResume.Api {

    public static class FunctionAuthenticationBuilderExtensions {

        public static MicrosoftIdentityWebApiAuthenticationBuilderWithConfiguration AddMicrosoftIdentityFunctionApi(
            this AuthenticationBuilder builder,
            IConfigurationSection configurationSection,
            string jwtBearerScheme = JwtBearerDefaults.AuthenticationScheme,
            bool subscribeToJwtBearerMiddlewareDiagnosticsEvents = false)
        {
            var builderWithConfiguration = builder.AddMicrosoftIdentityWebApi(
                configurationSection, 
                jwtBearerScheme, 
                subscribeToJwtBearerMiddlewareDiagnosticsEvents);

            // do stuff

            return builderWithConfiguration;

            /*
            Action<JwtBearerOptions> bearerOptions = options => configurationSection.Bind(options);
            Action<MicrosoftIdentityOptions> identityOptions = options => configurationSection.Bind(options);

            var builderWithConfiguration = (MicrosoftIdentityWebApiAuthenticationBuilderWithConfiguration)
                typeof(MicrosoftIdentityWebApiAuthenticationBuilderWithConfiguration)
                    .GetConstructor(
                        BindingFlags.NonPublic | BindingFlags.Instance,
                        new Type[] {
                            typeof(IServiceCollection),
                            typeof(string),
                            typeof(Action<JwtBearerOptions>),
                            typeof(Action<MicrosoftIdentityOptions>),
                            typeof(IConfigurationSection)
                        }
                ).Invoke(
                    new object[] {
                        builder.Services,
                        jwtBearerScheme,
                        bearerOptions,
                        identityOptions,
                        configurationSection
                    }
                );

            return builderWithConfiguration;
            */
        }
    }
}