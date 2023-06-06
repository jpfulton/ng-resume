using System;
using System.Collections.Generic;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.OpenApi.Models;

namespace Jpf.NgResume.Api
{
    public class OpenApiConfigurationOptions : IOpenApiConfigurationOptions
    {
        public OpenApiInfo Info { get; set; } =
          new OpenApiInfo
          {
              Title = "ng-resume API Documentation",
              Version = "1.0",
              Contact = new OpenApiContact()
              {
                  Name = "J. Patrick Fulton",
                  Url = new Uri("https://github.com/jpfulton/"),
              },
              License = new OpenApiLicense()
              {
                  Name = "MIT",
                  Url = new Uri("http://opensource.org/licenses/MIT"),
              }
          };

        public List<OpenApiServer> Servers { get; set; } = new();

        public OpenApiVersionType OpenApiVersion { get; set; } = OpenApiVersionType.V2;

        public bool IncludeRequestingHostName { get; set; } = false;
        public bool ForceHttp { get; set; } = false;
        public bool ForceHttps { get; set; } = false;
        public List<IDocumentFilter> DocumentFilters { get; set; } = new();
    }
}
