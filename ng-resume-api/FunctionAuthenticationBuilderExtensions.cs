using System;
using System.Linq;
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
            IConfiguration configuration,
            string configurationSectionName,
            // IConfigurationSection configurationSection,
            string jwtBearerScheme = JwtBearerDefaults.AuthenticationScheme,
            bool subscribeToJwtBearerMiddlewareDiagnosticsEvents = false)
        {

            /*
            var builderWithConfiguration = builder.AddMicrosoftIdentityWebApi(
                configurationSection, 
                jwtBearerScheme, 
                subscribeToJwtBearerMiddlewareDiagnosticsEvents);
            */

            builder.AddScheme<JwtBearerOptions, CustomJwtBearerHandler>(
                CustomJwtBearerConstants.DefaultScheme,
                CustomJwtBearerConstants.DefaultScheme,
                options => configuration.GetSection(configurationSectionName).Bind(options)
            );

            var builderWithConfiguration = builder.AddMicrosoftIdentityWebApi(
                configuration,
                configurationSectionName, 
                jwtBearerScheme,
                subscribeToJwtBearerMiddlewareDiagnosticsEvents);

            builderWithConfiguration.Services.Configure<JwtBearerOptions>(
                CustomJwtBearerConstants.DefaultScheme,
                configuration,
                options => configuration.GetSection("AzureAdB2C").Bind(options)
                );

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