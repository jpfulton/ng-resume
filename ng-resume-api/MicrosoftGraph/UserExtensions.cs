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
            return users.Select(SelectUser());
        }

        public static IUserRequest SelectUserProperties(
            this IUserRequest users
        )
        {
            return users.Select(SelectUser());
        }

        private static Expression<Func<User, object>> SelectUser() {
            Expression<Func<User, object>> f = u => new
            {
                u.Id,
                u.UserPrincipalName,
                u.DisplayName,
                u.Identities,
                u.GivenName,
                u.Surname
            };

            return f;
        }

    }
}