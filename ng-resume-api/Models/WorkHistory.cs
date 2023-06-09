using System;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Resolvers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Jpf.NgResume.Api.Models
{
    /// <summary>
    /// Model class to represent work history items.
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore, NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    [OpenApiExample(typeof(WorkHistoryExample))]
    public class WorkHistory
    {
        [OpenApiProperty(Description = "Id property for the work history item.")]
        public Guid Id {get; set;}

        [OpenApiProperty(Description = "Starting year for the work history item.")]
        public int StartYear {get; set;}

        [OpenApiProperty(Description = "Ending year for the work history item.", Nullable = true)]
        public int? EndYear {get; set;}

        [OpenApiProperty(Description = "Role title for the work history item.")]
        public string Title {get; set;}

        [OpenApiProperty(Description = "Organization of the work history item.")]
        public string Organization {get; set;}

        [OpenApiProperty(Description = "URL for the organization of the work history item.", Nullable = true)]
        public string OrganizationURL {get; set;}

        [OpenApiProperty(Description = "Array of bullets to display with the work history item.")]
        public string[] Bullets {get; set;}

        [OpenApiProperty(Description = "Array of skills exercised with the role in the work history item.")]
        public string[] Skills {get; set;}
    }

    public class WorkHistoryExample : OpenApiExample<WorkHistory>
    {
        public override IOpenApiExample<WorkHistory> Build(NamingStrategy namingStrategy = null)
        {
            this.Examples.Add(
                OpenApiExampleResolver.Resolve(
                    "WorkHistoryExample",
                    new WorkHistory()
                    {
                        Id = new Guid(),
                        StartYear = 2020,
                        EndYear = 2023,
                        Title = "Software Engineer",
                        Organization = "Software Tech, Inc.",
                        OrganizationURL = "https://www.google.com",
                        Bullets = new string[] {
                            "List an accomplishment or responsibility here.",
                            "List another accomplishment or responsibility here."
                        },
                        Skills = new string[] {
                            "C#",
                            "Technical Leadership",
                            "Git"
                        }
                    }
                )
            );

            return this;
        }
    }
}
