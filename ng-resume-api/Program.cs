using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Jpf.NgResume.Api.Auth;
#if DEBUG
using Jpf.NgResume.Api.Diagnostics;
#endif
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Logging;

var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults(builder => {
                    builder.UseDefaultWorkerMiddleware();

                    builder
                        .AddApplicationInsights()
                        .AddApplicationInsightsLogger();

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

                    // You will need extra configuration because above will only log per default Warning (default AI configuration) and above because of following line:
                    // https://github.com/microsoft/ApplicationInsights-dotnet/blob/main/NETCORE/src/Shared/Extensions/ApplicationInsightsExtensions.cs#L427
                    // This is documented here:
                    // https://github.com/microsoft/ApplicationInsights-dotnet/issues/2610#issuecomment-1316672650
                    // So remove the default logger rule (warning and above). This will result that the default will be Information.
                    services.Configure<LoggerFilterOptions>(options =>
                    {
                        var toRemove = options.Rules.FirstOrDefault(rule => rule.ProviderName
                            == "Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider");

                        if (toRemove is not null)
                        {
                            options.Rules.Remove(toRemove);
                        }
                    });

                    services.AddApplicationInsightsTelemetry(config =>
                    {
                        config.ConnectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
                    });

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
                .ConfigureLogging((hostingContext, logging) =>
                {
                    // Make sure the configuration of the appsettings.json file is picked up.
                    logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                })
                .Build();

await host.RunAsync();
