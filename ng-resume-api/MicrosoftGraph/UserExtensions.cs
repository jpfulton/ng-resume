using System;
using System.Linq.Expressions;
using Microsoft.Graph;

namespace Jpf.NgResume.Api.MicrosoftGraph
{
    public static class UserExtensions {

        public static IGraphServiceUsersCollectionRequest SelectUserProperties(
            this IGraphServiceUsersCollectionRequest users
        )
        {
            return users.Select(u => SelectUser());
        }

        public static IUserRequest SelectUserProperties(
            this IUserRequest users
        )
        {
            return users.Select(u => SelectUser());
        }

        private static Func<User, object> SelectUser() {
            return new Func<User, object>(u => new
            {
                u.Id,
                u.UserPrincipalName,
                u.DisplayName,
                u.Identities,
                u.GivenName,
                u.Surname
            });
        }

    }
}