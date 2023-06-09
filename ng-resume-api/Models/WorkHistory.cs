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
    public class WorkHistory
    {
        public Guid Id {get; set;}
        public int StartYear {get; set;}
        public int EndYear {get; set;}
        public string Title {get; set;}
        public string Organization {get; set;}
        public string OrganizationURL {get; set;}
        public string[] Bullets {get; set;}
        public string[] Skills {get; set;}
    }
}
