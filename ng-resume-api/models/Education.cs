using System;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Resolvers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Jpf.NgResume.Api.Models
{
    /// <summary>
    /// Model class to represent education objects.
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore)]
    [OpenApiExample(typeof(EducationExample))]
    public class Education
    {
        [OpenApiProperty(Description = "Id property for education item.")]
        public Guid Id {get; set;}

        [OpenApiProperty(Description = "Title of the degree or certification.")]
        public string Title {get; set;}

        [OpenApiProperty(Description = "Subtitle of the degree or certification.")]
        public string Subtitle {get; set;}

        [OpenApiProperty(Description = "Issuing organization for the education item.")]
        public string Organization {get; set;}
    }

    public class EducationExample : OpenApiExample<Education>
    {
        public override IOpenApiExample<Education> Build(NamingStrategy namingStrategy = null)
        {
            this.Examples.Add(
                OpenApiExampleResolver.Resolve(
                    "EducationExample",
                    new Education()
                    {
                        Id = new Guid(),
                        Title = "Bachelor of Science in Business Administration, Computer Information Systems",
                        Organization = "Univerity of Louisville"
                    }
                )
            );

            return this;
        }
    }
}
