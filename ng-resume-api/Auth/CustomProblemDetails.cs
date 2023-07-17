using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

#nullable enable
namespace Jpf.NgResume.Api.Auth
{
    /// <summary>
    /// Extends the ProblemDetails class for better JSON serialization.
    /// </summary>
    public class CustomProblemDetails : ProblemDetails
    {
        new private IDictionary<string, object?>? Extensions { get; }
    }
}
#nullable disable