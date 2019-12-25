using System;
using System.Runtime.Serialization;

namespace ASC.Api.Core.Middleware
{
    [DataContract]
    public class ApiError
    {
        [DataMember]
        public string Message { get; set; }

        [DataMember]
        public Type Type { get; set; }

        [DataMember]
        public string Stack { get; set; }

        [DataMember]
        public int Hresult { get; set; }

        public static ApiError FromException(Exception exception)
        {
            return new ApiError
            {
                Message = exception.Message,
                Type = exception.GetType(),
                Stack = exception.StackTrace,
                Hresult = exception.HResult
            };
        }
    }
}
