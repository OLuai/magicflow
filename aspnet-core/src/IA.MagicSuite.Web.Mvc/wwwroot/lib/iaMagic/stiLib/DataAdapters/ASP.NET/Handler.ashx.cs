using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;

namespace AspNetDataAdapters
{
    #region Result
    [DataContract]
    public class Result
    {
        [DataMember(Name = "success")]
        public bool Success { get; set; }

        [DataMember(Name = "notice")]
        public string Notice { get; set; }

        [DataMember(Name = "columns")]
        public string[] Columns { get; set; }

        [DataMember(Name = "rows")]
        public string[][] Rows { get; set; }

        [DataMember(Name = "types")]
        public string[] Types { get; set; }
    }
    #endregion

    #region Command
    [DataContract]
    public class CommandJson
    {
        [DataMember(Name = "command")]
        public string Command { get; set; }

        [DataMember(Name = "connectionString")]
        public string ConnectionString { get; set; }

        [DataMember(Name = "database")]
        public string Database { get; set; }

        [DataMember(Name = "event")]
        public string Event { get; set; }

        [DataMember(Name = "preventDefault")]
        public bool PreventDefault { get; set; }

        [DataMember(Name = "rnd")]
        public double Rnd { get; set; }

        [DataMember(Name = "queryString")]
        public string QueryString { get; set; }

        [DataMember(Name = "timeout")]
        public int Timeout { get; set; }
    }
    #endregion

    /// <summary>
    /// Summary description for Handler
    /// </summary>
    public class Handler : IHttpHandler
    {
        #region Helpers
        private static string ROT13(string input)
        {
            return string.Join("", input.Select(x => char.IsLetter(x) ? (x >= 65 && x <= 77) || (x >= 97 && x <= 109) ? (char)(x + 13) : (char)(x - 13) : x));
        }
        #endregion

        #region Process request
        public void ProcessRequest(HttpContext context)
        {
            var inputStream = context.Request.InputStream;
            var result = new Result();

            try
            {
                var reader = new StreamReader(context.Request.InputStream);
                var inputText = reader.ReadToEnd();
                if (!string.IsNullOrEmpty(inputText) && inputText[0] != '{')
                {
                    var buffer = Convert.FromBase64String(ROT13(inputText));
                    inputStream = new MemoryStream(buffer);
                }
                
                var deserializer = new DataContractJsonSerializer(typeof(CommandJson));
                var command = (CommandJson)deserializer.ReadObject(inputStream);

                switch (command.Database)
                {
                    case "MySQL": result = MySQLAdapter.Process(command); break;
                    case "Firebird": result = FirebirdAdapter.Process(command); break;
                    case "MS SQL": result = MSSQLAdapter.Process(command); break;
                    case "PostgreSQL": result = PostgreSQLAdapter.Process(command); break;
                    case "Oracle": result = OracleAdapter.Process(command); break;
                    default: result.Success = false; result.Notice = $"Unknown database type [{command.Database}]"; break;
                }
            }
            catch (Exception e)
            {
                result.Success = false;
                result.Notice = e.Message;
            }
            finally
            {
                if (inputStream != context.Request.InputStream)
                    inputStream.Close();
            }

            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Engaged-Auth-Token");
            context.Response.Headers.Add("Cache-Control", "no-cache");
            context.Response.ContentType = "application/json";

            var serializer = new DataContractJsonSerializer(typeof(Result));
            serializer.WriteObject(context.Response.OutputStream, result);

            context.Response.OutputStream.Flush();
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        #endregion
    }
}