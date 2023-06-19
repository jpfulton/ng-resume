

using Microsoft.Extensions.DependencyInjection;

namespace Jpf.NgResume.Api
{
    public interface IServiceDescriptorService {
        public IServiceCollection GetServiceCollection();
    }

    public class ServiceDescriptorService : IServiceDescriptorService
    {
        private IServiceCollection serviceDescriptors;

        public ServiceDescriptorService(IServiceCollection serviceDescriptors) {
            this.serviceDescriptors = serviceDescriptors;
        }

        public IServiceCollection GetServiceCollection()
        {
            return serviceDescriptors;
        }
    }
}