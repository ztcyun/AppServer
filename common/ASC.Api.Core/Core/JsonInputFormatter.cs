using System.IO;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc.Formatters;

using Utf8Json;

namespace ASC.Api.Core
{
    public class JsonInputFormatter : IInputFormatter
    {
        private readonly IJsonFormatterResolver resolver;

        public JsonInputFormatter() : this(null)
        {
        }

        public JsonInputFormatter(IJsonFormatterResolver resolver)
        {
            this.resolver = (resolver ?? JsonSerializer.DefaultResolver);
        }

        public bool CanRead(InputFormatterContext context)
        {
            return true;
        }

        public async Task<InputFormatterResult> ReadAsync(InputFormatterContext context)
        {
            using var memoryStream = new MemoryStream();
            await context.HttpContext.Request.Body.StreamCopyToAsync(memoryStream);
            var obj = JsonSerializer.NonGeneric.Deserialize(context.ModelType, memoryStream, resolver);
            return await InputFormatterResult.SuccessAsync(obj);
        }
    }
}
