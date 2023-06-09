using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Models;

namespace Jpf.NgResume.Api.DataStore
{
    /// <summary>
    /// In-memory store of Work History items keyed by their Id property.
    /// </summary>
    public class WorkHistoryDataStore : BaseDataStore<Guid, WorkHistory>
    {
        private static readonly string JSON_EMBEDDED_RESOURCE = "api.resources.workhistory.json";

        public WorkHistoryDataStore() : base()
        {
        }

        protected override async Task InitializeAsync()
        {
            var dataList = await this.GetDataFromEmbeddedJsonResource(JSON_EMBEDDED_RESOURCE);

            foreach (var item in dataList)
            {
                this.Data.Add(item.Id, item);
            }

            this.IsInitialized = true;
        }

        /// <summary>
        /// Returns a list of all work history items in the store ordered
        /// by start year descending.
        /// </summary>
        /// <returns>List of work history items.</returns>
        public async Task<IList<WorkHistory>> GetAllWorkHistoriesAsync()
        {
            if (!IsInitialized) await InitializeAsync();
            return this.Data.Values
                .OrderByDescending(item => item.StartYear)
                .ToList<WorkHistory>();
        }

        /// <summary>
        /// Returns a single work history item from the store by Id.
        /// </summary>
        /// <param name="id">Key of the work history item</param>
        /// <returns>A work history item</returns>
        public async Task<WorkHistory> GetWorkHistoryAsync(Guid id)
        {
            if (!IsInitialized) await InitializeAsync();
            return this.Data[id];
        }
    }
}
