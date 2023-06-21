using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Auth;
using Jpf.NgResume.Api.Diagnostics;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Host.Bindings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Logging;

var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults(builder => {
                    builder.UseDefaultWorkerMiddleware();

                    /*
                    var executionContextOptions = builder.Services.BuildServiceProvider()
                        .GetService<IOptions<ExecutionContextOptions>>().Value;

                    var currentDirectory = executionContextOptions.AppDirectory;
                    */

                    //var currentDirectory = Environment.CurrentDirectory;
                    //var currentDirectory = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

                    // Get the original configuration provider from the Azure Function
                    var configuration = builder.Services.BuildServiceProvider().GetService<IConfiguration>();
                    
                    // Create a new IConfigurationRoot and add our configuration along with Azure's original configuration 
                    var newConfig = new ConfigurationBuilder()
                        //.SetBasePath(currentDirectory)
                        .AddConfiguration(configuration) // Add the original function configuration 
                        //.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                        .AddEnvironmentVariables() // include settings from the environment
                        .Build();

                    // Replace the Azure Function configuration with our new one
                    builder.Services.AddSingleton(newConfig);

                })
                .ConfigureAppConfiguration((_, builder) => builder
                    .AddJsonFile("appsettings.json", optional: false)
                    .AddJsonFile("local.settings.json", true)
                    .Build()
                )
                .ConfigureServices(services => {
                    var configuration = services.BuildServiceProvider().GetService<IConfiguration>();

                    services.Configure<JsonSerializerOptions>(options =>
                    {
                        options.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                        options.PropertyNameCaseInsensitive = true;
                        #if DEBUG
                        options.WriteIndented = true;
                        #endif
                    });

                    /*
                    services.AddApplicationInsightsTelemetry(config =>
                    {
                        config.ConnectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
                    });
                    */

                    services.AddLogging(options =>
                    {
                        options.AddApplicationInsights();
                    });

                    services.AddAuthentication(options =>
                    {
                        options.DefaultScheme = CustomJwtBearerConstants.DefaultScheme;
                        options.DefaultChallengeScheme = CustomJwtBearerConstants.DefaultScheme;
                    })
                    .AddMicrosoftIdentityFunctionApi(
                        configuration,
                        "AzureAdB2C",
                        jwtBearerScheme: CustomJwtBearerConstants.DefaultScheme,
                        subscribeToJwtBearerMiddlewareDiagnosticsEvents: true)
                    .EnableTokenAcquisitionToCallDownstreamApi()
                    .AddMicrosoftGraph(configuration.GetSection("DownstreamApi"))
                    .AddInMemoryTokenCaches();

                    // services.AddAuthorization();

                    #if DEBUG
                    IdentityModelEventSource.ShowPII = true;
            
                    services.AddSingleton<IServiceDescriptorService>(
                        new ServiceDescriptorService(services)
                        );
                    #endif
                })
                .Build();

host.Run();

/*
namespace Jpf.NgResume.Api
{
    public class Program
    {
        private static IConfiguration Configuration { get; set; }
        
        public static async Task Main()
        {
#if DEBUG
            Debugger.Launch();
#endif

            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .Build();

            await host.RunAsync();

            /*
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults(builder => {

                    // Get the azure function application directory. 'C:\whatever' for local and 'd:\home\whatever' for Azure
                    // var executionContextOptions = builder.Services.BuildServiceProvider()
                    //    .GetService<IOptions<ExecutionContextOptions>>().Value;

                    // var currentDirectory = executionContextOptions.AppDirectory;

                    // Get the original configuration provider from the Azure Function
                    var configuration = builder.Services.BuildServiceProvider().GetService<IConfiguration>();
                    
                    // Create a new IConfigurationRoot and add our configuration along with Azure's original configuration 
                    Configuration = new ConfigurationBuilder()
                        //.SetBasePath(currentDirectory)
                        .AddConfiguration(configuration) // Add the original function configuration 
                        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                        .AddEnvironmentVariables() // include settings from the environment
                        .Build();

                    // Replace the Azure Function configuration with our new one
                    builder.Services.AddSingleton(Configuration);
                })
                .ConfigureServices(services =>
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
                })
                .Build();

            await host.RunAsync();
            
        }
    }
}
*/