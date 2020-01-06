using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;

using Utf8Json;

namespace ASC.Api.Core
{
    public class JsonOutputFormatter : TextOutputFormatter
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
            SupportedEncodings.Add(Encoding.UTF8);
            SupportedEncodings.Add(Encoding.Unicode);
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("application/json").CopyAsReadOnly());
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/json").CopyAsReadOnly());
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("application/*+json").CopyAsReadOnly());
        }

        public override bool CanWriteResult(OutputFormatterCanWriteContext context)
        {
            return true;
        }

        public async override Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            context.HttpContext.Response.ContentType = ContentType;

            // when 'object' use the concrete type(object.GetType())
            if (context.Object is QueryResult q)
            {
                await JsonSerializer.NonGeneric.SerializeAsync(context.HttpContext.Response.Body, q.Result, resolver);
                return;
            }

            if (context.ObjectType == typeof(object))
            {
                await JsonSerializer.NonGeneric.SerializeAsync(context.HttpContext.Response.BodyWriter.AsStream(), context.Object, resolver);
            }
            else
            {
                await JsonSerializer.NonGeneric.SerializeAsync(context.ObjectType, context.HttpContext.Response.BodyWriter.AsStream(), context.Object, resolver);
            }
        }
    }

    public class JsonInputFormatter : TextInputFormatter
    {
        private readonly IJsonFormatterResolver resolver;

        public JsonInputFormatter() : this(null)
        {
        }

        public JsonInputFormatter(IJsonFormatterResolver resolver)
        {
            this.resolver = (resolver ?? JsonSerializer.DefaultResolver);
            SupportedEncodings.Add(Encoding.UTF8);
            SupportedEncodings.Add(Encoding.Unicode);
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("application/json").CopyAsReadOnly());
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/json").CopyAsReadOnly());
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("application/*+json").CopyAsReadOnly());
        }

        public override bool CanRead(InputFormatterContext context)
        {
            return true;
        }

        public async override Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context, Encoding encoding)
        {
            using var memoryStream = new MemoryStream();
            await context.HttpContext.Request.Body.StreamCopyToAsync(memoryStream);
            var obj = JsonSerializer.NonGeneric.Deserialize(context.ModelType, memoryStream, resolver);
            return await InputFormatterResult.SuccessAsync(obj);
        }
    }

    public class QueryResult
    {
        public IQueryable Result { get; set; }
    }
}
