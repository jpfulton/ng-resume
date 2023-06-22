using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Resolvers;
using Microsoft.Graph;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Jpf.NgResume.Api.Models
{
    /// <summary>
    /// Model class to represent application users.
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore, NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    //[OpenApiExample(typeof(Group))]
    public class Group
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public bool? SecurityEnabled { get; set; }
    }

    public static class GroupExtensions {
        public static Group FromMicrosoftGraph(
            this Microsoft.Graph.Group graphGroup
            )
        {
            var group = new Group()
            {
                Id = graphGroup.Id,
                DisplayName = graphGroup.DisplayName,
                SecurityEnabled = graphGroup.SecurityEnabled
            };

            return group;
        }
    }   
}