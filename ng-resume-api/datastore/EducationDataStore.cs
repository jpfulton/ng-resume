using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Models;

namespace Jpf.NgResume.Api.DataStore
{
    public class EducationDataStore : BaseDataStore<Guid, Education>
    {
        private static readonly string JSON_EMBEDDED_RESOURCE = "api.resources.education.json";

        public EducationDataStore() : base()
        {
        }

        public override async Task Initialize()
        {
            var dataList = await this.GetDataFromEmbeddedJsonResource(JSON_EMBEDDED_RESOURCE);

            foreach (var item in dataList)
            {
                this.GetMap().Add(item.Id, item);
            }

            this.IsInitialized = true;
        }

        public async Task<IList<Education>> GetAllEducationsAsync()
        {
            if (!IsInitialized) await Initialize();
            return this.GetMap().Values.ToList<Education>();
        }

        public async Task<Education> GetEducationAsync(Guid id)
        {
            if (!IsInitialized) await Initialize();
            return this.GetMap()[id];
        }
    }
}