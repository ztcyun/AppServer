
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ASC.Api.Core.Middleware
{
    public class CustomExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            context.Result = new ObjectResult(ApiError.FromException(context.Exception))
            {
                StatusCode = 500
            };
            context.ExceptionHandled = true;
        }
    }
}