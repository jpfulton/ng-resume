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
    //[OpenApiExample(typeof(User))]
    public class User
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Mail { get; set; }
        public List<string> MemberOf { get; set; } = new();

        public static User FromMicrosoftGraphUser(
            Microsoft.Graph.User graphUser,
            List<Microsoft.Graph.Group> groups) 
        {
            var user = new User()
            {
                Id = graphUser.Id,
                DisplayName = graphUser.DisplayName,
                Mail = graphUser.Mail
            };

            groups.ForEach((group) => user.MemberOf.Add(group.DisplayName));

            return user;
        }
    }   
}