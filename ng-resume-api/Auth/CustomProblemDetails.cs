using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

#nullable enable
namespace Jpf.NgResume.Api.Auth
{
    public class CustomProblemDetails : ProblemDetails
    {
        new private IDictionary<string, object?>? Extensions { get; }
    }
}
#nullable disable