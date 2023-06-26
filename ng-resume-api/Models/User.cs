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
        public string UserPrincipalName { get; set; }
        public string DisplayName { get; set; }
        public string GivenName { get; set; }
        public string Surname { get; set; }
        public string FederatedIssuer { get; set; }
        public List<Identity> Identities { get; set; } = new();
        public List<Group> MemberOf { get; set; } = new();
    }

    public static class UserExtensions {

        public static User FromMicrosoftGraph(
            this Microsoft.Graph.User graphUser
        )
        {
            return graphUser.FromMicrosoftGraph(new List<Microsoft.Graph.Group>());
        }

        public static User FromMicrosoftGraph(
            this Microsoft.Graph.User graphUser,
            List<Microsoft.Graph.Group> groups) 
        {
            var user = new User()
            {
                Id = graphUser.Id,
                UserPrincipalName = graphUser.UserPrincipalName,
                DisplayName = graphUser.DisplayName,
                GivenName = graphUser.GivenName,
                Surname = graphUser.Surname
            };

            graphUser.Identities.ToList().ForEach((identity) => user.Identities.Add(identity.FromMicrosoftGraph()));
            user.FederatedIssuer = user.Identities.FirstOrDefault((ident) => ident.SignInType.Equals("federated")).Issuer;

            groups.ForEach((group) => user.MemberOf.Add(group.FromMicrosoftGraph()));

            return user;
        }
    }   
}