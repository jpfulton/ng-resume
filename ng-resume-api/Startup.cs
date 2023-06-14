using System;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Logging;

[assembly: FunctionsStartup(typeof(Jpf.NgResume.Api.Startup))]

namespace Jpf.NgResume.Api
{
    public class Startup : FunctionsStartup
    {
        public Startup()
        {
        }

        public override void Configure(IFunctionsHostBuilder builder)
        {
            var configuration = builder.GetContext().Configuration;

            builder.Services.AddFunctionAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = "Bearer";
                sharedOptions.DefaultChallengeScheme = "Bearer";
            })
            .AddMicrosoftIdentityWebApi(configuration)
            .EnableTokenAcquisitionToCallDownstreamApi()
            .AddInMemoryTokenCaches();
        }
    }
}