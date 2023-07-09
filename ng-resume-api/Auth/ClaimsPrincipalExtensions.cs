using System.Linq;
using System.Security.Claims;

namespace Jpf.NgResume.Api.Auth
{
    public static class ClaimsPrincipalExtensions
    {
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