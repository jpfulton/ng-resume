using System;
using System.Linq.Expressions;
using Microsoft.Graph;

namespace Jpf.NgResume.Api.MicrosoftGraph
{
    public static class GroupExtensions {

        public static IGraphServiceGroupsCollectionRequest SelectGroupProperties(
            this IGraphServiceGroupsCollectionRequest groups
        )
        {
            return groups.Select(SelectGroup());
        }

        public static IGroupRequest SelectGroupProperties(
            this IGroupRequest groups
        )
        {
            return groups.Select(SelectGroup());
        }

        private static Expression<Func<Group, object>> SelectGroup() {
            Expression<Func<Group, object>> f = g => new
            {
                g.Id,
                g.DisplayName,
                g.SecurityEnabled
            };

            return f;
        }

    }
}