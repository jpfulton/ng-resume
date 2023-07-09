using System.Threading.Tasks;
using Microsoft.Graph;
using Jpf.NgResume.Api.MicrosoftGraph;
using System.Linq;
using Jpf.NgResume.Api.Models;

namespace Jpf.NgResume.Api.Auth
{
    public static class UserHelpers
    {
        public static async Task<Models.User> GetUser(GraphServiceClient graphClient, string userId)
        {
            var me = await graphClient.Users[userId].Request()
                .SelectUserProperties()
                .GetAsync();

            var memberships = await graphClient.Users[userId]
                .MemberOf
                .Request()
                .GetAsync();

            var groups = memberships
                .Where(p => p.GetType() == typeof(Microsoft.Graph.Group))
                .Cast<Microsoft.Graph.Group>()
                .ToList();

            var appUser = me.FromMicrosoftGraph(groups);

            return appUser;
        }
    }
}