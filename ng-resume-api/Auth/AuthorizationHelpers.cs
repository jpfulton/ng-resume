using System;
using System.Linq;
using System.Net;
using System.Runtime.Caching;
using System.Security.Claims;
using System.Threading.Tasks;
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

        public static async Task<(bool, HttpResponseData?)> AuthenticateThenAuthorizeWithGroup(
            this HttpRequestData request,
            FunctionContext functionContext,
            GraphServiceClient graphClient,
            ILogger log,
            string groupName
        )
        {
            var (authenticated, authenticationResponse, principal) = 
                await request.AuthenticationHelperAsync(functionContext, log);
            if (!authenticated) return (authenticated, authenticationResponse);

            var (claimAuthorized, claimAuthorizationResponse) =
                await request.AuthorizeWithClaimsPrincipal(principal!, log, groupName);
            if(claimAuthorized) 
                return (claimAuthorized, null);

            var userId = principal != null ? principal.GetObjectId()! : "";
            var (graphAuthorized, graphAuthorizationResponse, _) = 
                await request.AuthorizeWithMsGraphGroup( 
                    graphClient, 
                    log, 
                    userId, 
                    groupName);
            if(!graphAuthorized) return (graphAuthorized, graphAuthorizationResponse);

            return (graphAuthorized, null);
        }

        public static async Task<(bool, HttpResponseData?)> AuthorizeWithClaimsPrincipal(
            this HttpRequestData request,
            ClaimsPrincipal principal,
            ILogger log,
            string groupName
        )
        {
            var groupMemberships = principal != null ? principal.GetGroupMemberships() : new string[0];
            var authorized = 
                string.IsNullOrEmpty(groupName) ||
                groupMemberships.Any(group => group.Equals(groupName));

            if (authorized) {
                return (authorized, null);
            }
            else {
                var resp = request.CreateResponse();
                await resp.WriteAsJsonAsync(new CustomProblemDetails
                {
                    Title = "Authorization failed.",
                    Detail = "User was not a member of an authorized group."
                });
                resp.StatusCode = HttpStatusCode.Unauthorized;

                return (false, resp);
            }
        }

        public static async Task<(bool, HttpResponseData?, Models.User?)> AuthorizeWithMsGraphGroup(
            this HttpRequestData request,
            GraphServiceClient graphClient,
            ILogger log,
            string userId,
            string groupName
        )
        {
            var user = memoryCache.Get(userId) as Models.User;
            if (user == null) {
                user = await UserHelpers.GetUser(graphClient, userId);

                var cacheItem = new CacheItem(userId, user);
                var cacheItemPolicy = new CacheItemPolicy  
                {  
                    AbsoluteExpiration = DateTimeOffset.Now.AddSeconds(CACHE_EXPIRATION_SECONDS)  
                };
                memoryCache.Add(cacheItem, cacheItemPolicy);
            }

            var authorized = 
                string.IsNullOrEmpty(groupName) ||
                user.MemberOf.Any(group => group.DisplayName == groupName);
                
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
    }
}
#nullable disable