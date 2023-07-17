using System.Threading.Tasks;
using Microsoft.Graph;
using Jpf.NgResume.Api.MicrosoftGraph;
using System.Linq;
using Jpf.NgResume.Api.Models;

namespace Jpf.NgResume.Api.Auth
{
    /// <summary>
    /// Extension methods for working with Microsoft Graph Users.
    /// </summary>
    public static class UserHelpers
    {
        /// <summary>
        /// Returns a User object populated with Groups to which it is a member.
        /// </summary>
        /// <param name="graphClient">API client</param>
        /// <param name="userId">User id of the User to return.</param>
        /// <returns>A User object populated with Groups to which it belongs.</returns>
        public static async Task<Models.User> GetUser(GraphServiceClient graphClient, string userId)
        {
            var user = await graphClient.Users[userId].Request()
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

            var appUser = user.FromMicrosoftGraph(groups);

            return appUser;
        }
    }
}