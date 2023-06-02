using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Models;

namespace Jpf.NgResume.Api.DataStore
{
    public class WorkHistoryDataStore : BaseDataStore<Guid, WorkHistory>
    {
        private static readonly string JSON_EMBEDDED_RESOURCE = "api.resources.workhistory.json";

        public WorkHistoryDataStore() : base()
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

        public async Task<IList<WorkHistory>> GetAllWorkHistoriesAsync()
        {
            if (!IsInitialized) await Initialize();
            return this.GetMap().Values.ToList<WorkHistory>();
        }

        public async Task<WorkHistory> GetWorkHistoryAsync(Guid id)
        {
            if (!IsInitialized) await Initialize();
            return this.GetMap()[id];
        }
    }
}
