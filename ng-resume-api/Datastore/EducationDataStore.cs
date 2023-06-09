using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Models;

namespace Jpf.NgResume.Api.DataStore
{
    /// <summary>
    /// An in-memory store of education items.
    /// </summary>
    public class EducationDataStore : BaseDataStore<Guid, Education>
    {
        private static readonly string JSON_EMBEDDED_RESOURCE = "api.resources.education.json";

        public EducationDataStore() : base()
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
        /// Returns all eduction items in the store ordered by title.
        /// </summary>
        /// <returns>A list of education items.</returns>
        public async Task<IList<Education>> GetAllEducationsAsync()
        {
            if (!IsInitialized) await InitializeAsync();
            return this.Data.Values
                .OrderBy(item => item.Title)
                .ToList<Education>();
        }

        /// <summary>
        /// Returns an education item from the store by its Id property.
        /// </summary>
        /// <param name="id">Key of the education item.</param>
        /// <returns>An eduction item.</returns>
        public async Task<Education> GetEducationAsync(Guid id)
        {
            if (!IsInitialized) await InitializeAsync();
            return this.Data[id];
        }
    }
}