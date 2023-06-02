using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Jpf.NgResume.Api.DataStore
{
    public abstract class BaseDataStore<Tkey, Tvalue>
    {
        private IDictionary<Tkey, Tvalue> map;

        protected bool IsInitialized { get; set; }

        protected BaseDataStore() {
            this.map = new Dictionary<Tkey, Tvalue>();
        }

        protected IDictionary<Tkey, Tvalue> GetMap()
        {
            return this.map;
        }

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

        public abstract Task Initialize();
    }
}
