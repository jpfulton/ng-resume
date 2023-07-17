using System.Linq;
using System.Security.Claims;

namespace Jpf.NgResume.Api.Auth
{
    /// <summary>
    /// Extensions for working with claims principals.
    /// </summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Returns an array of group names to which the user belongs from
        /// the "extensions_GroupMembership" claim.
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public static string[] GetGroupMemberships(
            this ClaimsPrincipal principal
        )
        {
            var claim =
                principal.Claims.FirstOrDefault(claim => claim.Type == "extensions_GroupMembership");
            if (claim == null) return new string[0];

            return claim.Value.Split(",");
        }
    }
}