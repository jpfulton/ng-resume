using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Models;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Jpf.NgResume.Api.DataStore
{
    public class EducationDataStore
    {
        private static readonly string JSON_EMBEDDED_RESOURCE = "api.resources.education.json";

        private bool isInitialized = false;
        private IDictionary<Guid, Education> educationMap;

        public EducationDataStore()
        {
            this.educationMap = new Dictionary<Guid, Education>();
        }

        public bool IsInitialized()
        {
            return this.isInitialized;
        }

        public async Task Initialize(ILogger log)
        {
            using (
                Stream stream = Assembly
                    .GetExecutingAssembly()
                    .GetManifestResourceStream(JSON_EMBEDDED_RESOURCE)
            )
            using (
                StreamReader reader = new StreamReader(stream)
            )
            {
                var jsonFileContent = await reader.ReadToEndAsync();
                var educationList = JsonConvert.DeserializeObject<IList<Education>>(jsonFileContent);

                foreach (var item in educationList)
                {
                    educationMap.Add(item.Id, item);
                }
            }

            this.isInitialized = true;
        }

        public async Task<IList<Education>> GetAllEducationsAsync(ILogger log)
        {
            if (!isInitialized) await Initialize(log);
            return educationMap.Values.ToList<Education>();
        }

        public async Task<Education> GetEducationAsync(Guid id, ILogger log)
        {
            if (!isInitialized) await Initialize(log);
            return educationMap[id];
        }
    }
}