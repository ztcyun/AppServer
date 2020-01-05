using System.IO;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc.Formatters;

using Utf8Json;

namespace ASC.Api.Core
{
    public class JsonOutputFormatter : IOutputFormatter //, IApiResponseTypeMetadataProvider
    {
        const string ContentType = "application/json";

        readonly IJsonFormatterResolver resolver;

        public JsonOutputFormatter()
            : this(null)
        {

        }
        public JsonOutputFormatter(IJsonFormatterResolver resolver)
        {
            this.resolver = resolver ?? JsonSerializer.DefaultResolver;
        }

        //public IReadOnlyList<string> GetSupportedContentTypes(string contentType, Type objectType)
        //{
        //    return SupportedContentTypes;
        //}

        public bool CanWriteResult(OutputFormatterCanWriteContext context)
        {
            return true;
        }

        public Task WriteAsync(OutputFormatterWriteContext context)
        {
            context.HttpContext.Response.ContentType = ContentType;

            // when 'object' use the concrete type(object.GetType())
            if (context.ObjectType == typeof(object))
            {
                return JsonSerializer.NonGeneric.SerializeAsync(context.HttpContext.Response.BodyWriter.AsStream(), context.Object, resolver);
            }
            else
            {
                return JsonSerializer.NonGeneric.SerializeAsync(context.ObjectType, context.HttpContext.Response.BodyWriter.AsStream(), context.Object, resolver);
            }
        }
    }

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
