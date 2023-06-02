using System;
using Newtonsoft.Json;

namespace Jpf.NgResume.Api.Models
{
    /// <summary>
    /// Model class to represent work history items.
    /// </summary>
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore)]
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
