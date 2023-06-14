using System;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Resolvers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Jpf.NgResume.Api.Models
{
    /// <summary>
    /// Model class to work with test functions.
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore, NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    [OpenApiExample(typeof(TestExample))]
    public class Test
    {
        [OpenApiProperty(Description = "Id property for test item.")]
        public Guid Id {get; set;}

        [OpenApiProperty(Description = "A message.")]
        public string Message { get; set; }
    }

    public class TestExample : OpenApiExample<Test>
    {
        public override IOpenApiExample<Test> Build(NamingStrategy namingStrategy = null)
        {
            this.Examples.Add(
                OpenApiExampleResolver.Resolve(
                    "TestExample",
                    new Test()
                    {
                        Id = new Guid(),
                        Message = "An example message."
                    }
                )
            );

            return this;
        }
    }
}