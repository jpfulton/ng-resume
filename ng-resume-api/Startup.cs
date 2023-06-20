using System;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Logging;
using Microsoft.Azure.WebJobs.Host.Bindings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Jpf.NgResume.Api.Auth;
using Microsoft.Identity.Web;

#if DEBUG
using Jpf.NgResume.Api.Diagnostics;
#endif

[assembly: FunctionsStartup(typeof(Jpf.NgResume.Api.Startup))]

namespace Jpf.NgResume.Api
{
    public class Startup : FunctionsStartup
    {
        public Startup()
        {
        }

        IConfiguration Configuration { get; set; }

        public override void Configure(IFunctionsHostBuilder builder)
        {
            // Get the azure function application directory. 'C:\whatever' for local and 'd:\home\whatever' for Azure
            var executionContextOptions = builder.Services.BuildServiceProvider()
                .GetService<IOptions<ExecutionContextOptions>>().Value;

            var currentDirectory = executionContextOptions.AppDirectory;

            // Get the original configuration provider from the Azure Function
            var configuration = builder.Services.BuildServiceProvider().GetService<IConfiguration>();

            // Create a new IConfigurationRoot and add our configuration along with Azure's original configuration 
            Configuration = new ConfigurationBuilder()
                .SetBasePath(currentDirectory)
                .AddConfiguration(configuration) // Add the original function configuration 
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables() // include settings from the environment
                .Build();

            // Replace the Azure Function configuration with our new one
            builder.Services.AddSingleton(Configuration);

            ConfigureServices(builder.Services);
        }

        private void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry(config =>
            {
                config.ConnectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
            });

            services.AddLogging(options =>
            {
                options.AddApplicationInsights();
            });

            services.AddFunctionAuthentication(options =>
            {
                options.DefaultScheme = CustomJwtBearerConstants.DefaultScheme;
                options.DefaultChallengeScheme = CustomJwtBearerConstants.DefaultScheme;
            })
            .AddMicrosoftIdentityFunctionApi(
                Configuration,
                "AzureAdB2C",
                jwtBearerScheme: CustomJwtBearerConstants.DefaultScheme,
                subscribeToJwtBearerMiddlewareDiagnosticsEvents: true)
            .EnableTokenAcquisitionToCallDownstreamApi()
            .AddMicrosoftGraph(Configuration.GetSection("DownstreamApi"))
            .AddInMemoryTokenCaches();

            // from DarkLoop package, required for current Microsoft.Identity.Web
            services.AddFunctionsAuthorization();

#if DEBUG
            IdentityModelEventSource.ShowPII = true;
            
            services.AddSingleton<IServiceDescriptorService>(
                new ServiceDescriptorService(services)
                );
#endif
        }
    }
}