using System;
using System.Linq;
using System.Net;
using System.Runtime.Caching;
using System.Threading.Tasks;
using Jpf.NgResume.Api.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Identity.Web;

#nullable enable
namespace Jpf.NgResume.Api.Auth
{

    public static class AuthorizationHelpers
    {
        private const double CACHE_EXPIRATION_SECONDS = 120.0;
        private static readonly MemoryCache memoryCache;

        static AuthorizationHelpers()
        {
            memoryCache = new MemoryCache("userCache");
        }

        public static async Task<(bool, HttpResponseData?, Models.User?)> AuthenticateThenAuthorizeWithGroup(
            this HttpRequestData request,
            FunctionContext functionContext,
            GraphServiceClient graphClient,
            ILogger log,
            string groupName
        )
        {
            var (authenticated, authenticationResponse, principal) = 
                await request.AuthenticationHelperAsync(functionContext, log);
            if (!authenticated) return (authenticated, authenticationResponse, null);

            var (authorized, authorizationResponse, user) = 
                await request.AuthorizeWithGroup( 
                    graphClient, 
                    log, 
                    principal.GetObjectId(), 
                    groupName);
            if(!authorized) return (authorized, authorizationResponse, null);

            return (authorized, null, user);
        }

        public static async Task<(bool, HttpResponseData?, Models.User?)> AuthorizeWithGroup(
            this HttpRequestData request,
            GraphServiceClient graphClient,
            ILogger log,
            string userId,
            string groupName
        )
        {
            var user = memoryCache.Get(userId) as Models.User;
            if (user == null) {
                user = await GetUser(graphClient, userId);

                var cacheItem = new CacheItem(userId, user);
                var cacheItemPolicy = new CacheItemPolicy  
                {  
                    AbsoluteExpiration = DateTimeOffset.Now.AddSeconds(CACHE_EXPIRATION_SECONDS)  
                };
                memoryCache.Add(cacheItem, cacheItemPolicy);
            }

            var authorized = user.MemberOf.Any(group => group.DisplayName == groupName);
            if (authorized) {
                return (authorized, null, user);
            }
            else {
                var resp = request.CreateResponse();
                await resp.WriteAsJsonAsync(new CustomProblemDetails
                {
                    Title = "Authorization failed.",
                    Detail = "User was not a member of an authorized group."
                });
                resp.StatusCode = HttpStatusCode.Unauthorized;

                return (false, resp, null);
            }
        }

        private static async Task<Models.User> GetUser(GraphServiceClient graphClient, string userId)
        {
            var me = await graphClient.Users[userId].Request()
                .Select(u => new
                {
                    u.Id,
                    u.DisplayName,
                    u.Mail
                })
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
#nullable disable