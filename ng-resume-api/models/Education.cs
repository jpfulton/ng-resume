using System;
using Newtonsoft.Json;

namespace Jpf.NgResume.Api.Models
{
    /// <summary>
    /// Model class to represent education objects.
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore)]
    public class Education
    {
        public Guid Id {get; set;}
        public string Title {get; set;}
        public string Subtitle {get; set;}
        public string Organization {get; set;}
    }
}