using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Logging;
using Microsoft.Graph;
using Azure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;

#if DEBUG
using Jpf.NgResume.Api.Diagnostics;
#endif

var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults(builder => {
                    builder.UseDefaultWorkerMiddleware();

                    builder
                        .AddApplicationInsights()
                        .AddApplicationInsightsLogger();

                })
                .ConfigureAppConfiguration((_, builder) => builder
                    .AddJsonFile("appsettings.json", optional: false)
                    .AddJsonFile("local.settings.json", true)
                    .AddEnvironmentVariables()
                    .Build()
                )
                .ConfigureServices(services => {
                    var configuration = services.BuildServiceProvider().GetService<IConfiguration>();

                    services.Configure<JsonSerializerOptions>(options =>
                    {
                        options.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                        options.PropertyNameCaseInsensitive = true;
                        options.WriteIndented = true;
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
                        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    })
                    .AddMicrosoftIdentityWebApi(
                        configuration,
                        "AzureAdB2C",
                        jwtBearerScheme: JwtBearerDefaults.AuthenticationScheme,
#if DEBUG
                        subscribeToJwtBearerMiddlewareDiagnosticsEvents: true
#else
                        subscribeToJwtBearerMiddlewareDiagnosticsEvents: false
#endif
                        );

                    services.AddTransient<GraphServiceClient>((_) =>
                    {
                        var scopes = new[] { "https://graph.microsoft.com/.default" };
                        var clientSecretCredential = 
                            new ClientSecretCredential(
                                configuration.GetValue<string>("MicrosoftGraph:TenantId"),
                                configuration.GetValue<string>("MicrosoftGraph:AppId"),
                                configuration.GetValue<string>("MicrosoftGraph_ClientSecret")
                            );

                        var graphClient = new GraphServiceClient(clientSecretCredential, scopes);

                        return graphClient;
                    });

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
