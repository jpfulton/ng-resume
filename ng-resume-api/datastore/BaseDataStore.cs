using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Jpf.NgResume.Api.DataStore
{
    /// <summary>
    /// Abstract base class for in-memory data stores genereated by JSON files
    /// stored as embedded resources in the currently executing assembly.
    /// </summary>
    /// <typeparam name="Tkey">Key type for the data store</typeparam>
    /// <typeparam name="Tvalue">Value type for the data store</typeparam>
    public abstract class BaseDataStore<Tkey, Tvalue>
    {
        protected IDictionary<Tkey, Tvalue> Data { get; private set; }

        protected bool IsInitialized { get; set; }

        protected BaseDataStore() {
            Data = new Dictionary<Tkey, Tvalue>();
        }

        /// <summary>
        /// Utility method for loading objects from a JSON embedded resource. Note that
        /// embedded resource names use dots not slashes to represent the directory
        /// structure. (e.g. "api.resources.somefile.json")
        /// </summary>
        /// <param name="resourceName">Name of the embbedded resource</param>
        /// <returns>An IList of obects of the value type.</returns>
        protected async Task<IList<Tvalue>> GetDataFromEmbeddedJsonResource(string resourceName)
        {
            using (
                Stream stream = Assembly
                    .GetExecutingAssembly()
                    .GetManifestResourceStream(resourceName)
            )
            using (
                StreamReader reader = new StreamReader(stream)
            )
            {
                var jsonFileContent = await reader.ReadToEndAsync();
                var dataList = JsonConvert.DeserializeObject<IList<Tvalue>>(jsonFileContent);

                return dataList;
            }
        }

        /// <summary>
        /// Initializes this data store.
        /// </summary>
        /// <returns></returns>
        protected abstract Task InitializeAsync();
    }
}
