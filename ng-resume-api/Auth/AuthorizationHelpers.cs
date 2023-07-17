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

    /// <summary>
    /// Authorization extension methods.
    /// </summary>
    public static class AuthorizationHelpers
    {
        /// <summary>
        /// Default cache expiration interval.
        /// </summary>
        private const double CACHE_EXPIRATION_SECONDS = 120.0;

        /// <summary>
        /// Memory cache to store users to prevent repeat API calls.
        /// </summary>
        private static readonly MemoryCache memoryCache;

        static AuthorizationHelpers()
        {
            memoryCache = new MemoryCache("userCache");
        }

        /// <summary>
        /// Authenticate against an HttpRequestData object containing a JWT bearer token
        /// in the header then authorize the user against group membership in a specified
        /// group name.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="functionContext"></param>
        /// <param name="graphClient"></param>
        /// <param name="log"></param>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public static async Task<(bool, HttpResponseData?)> AuthenticateThenAuthorizeWithGroup(
            this HttpRequestData request,
            FunctionContext functionContext,
            GraphServiceClient graphClient,
            ILogger log,
            string groupName
        )
        {
            // authenticate
            var (authenticated, authenticationResponse, principal) = 
                await request.AuthenticateAsync(functionContext, log);
            if (!authenticated) return (authenticated, authenticationResponse);

            // attempt authorization with a token claim
            var (claimAuthorized, _) =
                await request.AuthorizeWithClaimsPrincipal(principal!, log, groupName);
            if(claimAuthorized) 
                return (claimAuthorized, null);

            // fall back to authorization using the ms graph api
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

        /// <summary>
        /// Authorize based on group membership using claims in the JWT token.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="principal"></param>
        /// <param name="log"></param>
        /// <param name="groupName"></param>
        /// <returns></returns>
        private static async Task<(bool, HttpResponseData?)> AuthorizeWithClaimsPrincipal(
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

        /// <summary>
        /// Authorize based on group membership using MS Graph API query.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="graphClient"></param>
        /// <param name="log"></param>
        /// <param name="userId"></param>
        /// <param name="groupName"></param>
        /// <returns></returns>
        private static async Task<(bool, HttpResponseData?, Models.User?)> AuthorizeWithMsGraphGroup(
            this HttpRequestData request,
            GraphServiceClient graphClient,
            ILogger log,
            string userId,
            string groupName
        )
        {
            // attempt getting the user from the memory cache
            var user = memoryCache.Get(userId) as Models.User;
            if (user == null) {
                // user is not cached, retrieve it from the ms graph api
                user = await UserHelpers.GetUser(graphClient, userId);

                // add user to memory cache
                var cacheItem = new CacheItem(userId, user);
                var cacheItemPolicy = new CacheItemPolicy  
                {  
                    AbsoluteExpiration = DateTimeOffset.Now.AddSeconds(CACHE_EXPIRATION_SECONDS)  
                };
                memoryCache.Add(cacheItem, cacheItemPolicy);
            }

            // check for group membership
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