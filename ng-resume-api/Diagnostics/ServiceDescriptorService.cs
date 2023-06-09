#if DEBUG
using Microsoft.Extensions.DependencyInjection;

namespace Jpf.NgResume.Api.Diagnostics
{
    public interface IServiceDescriptorService {
        public IServiceCollection GetServiceCollection();
    }

    public class ServiceDescriptorService : IServiceDescriptorService
    {
        private readonly IServiceCollection serviceDescriptors;

        public ServiceDescriptorService(IServiceCollection serviceDescriptors) {
            this.serviceDescriptors = serviceDescriptors;
        }

        public IServiceCollection GetServiceCollection()
        {
            return serviceDescriptors;
        }
    }
}
#endif
