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
    /// Model class to represent application user identity.
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore, NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    //[OpenApiExample(typeof(Identity))]
    public class Identity
    {
        public string Issuer { get; set; }
        public string IssuerAssignedId { get; set; }
        public string SignInType { get; set; }

    }

    public static class IdentityExtensions {
        public static Identity FromMicrosoftGraph(
            this Microsoft.Graph.ObjectIdentity graphIdentity
            ) 
        {
            var identity = new Identity()
            {
                Issuer = graphIdentity.Issuer,
                IssuerAssignedId = graphIdentity.IssuerAssignedId,
                SignInType = graphIdentity.SignInType,
            };

            return identity;
        }
    }   
}