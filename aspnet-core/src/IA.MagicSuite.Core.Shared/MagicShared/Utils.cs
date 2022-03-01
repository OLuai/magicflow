using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

namespace IA.MagicSuite.MagicShared
{
    public static class Utils
    {

        /// <summary>
        /// Permet de rechercher si un mot entier est contenu dans une chaine
        /// </summary>
        /// <param name="TextToSearchIn">Expression dans laquelle rechercher le mot</param>
        /// <param name="wordToFind">Mot à rechercher dans le texte</param>
        /// <param name="regOptions">Options regex pour ignorer ou prendre en compte la casse</param>
        /// <returns></returns>
        public static bool HasWholeWord(string TextToSearchIn,string wordToFind, RegexOptions regOptions = RegexOptions.IgnoreCase)
        {

            if (Regex.Match(TextToSearchIn, @"\b" + Regex.Escape(wordToFind) + @"\b", regOptions).Success)
            {
                return true;
            };

            return false;
        }

        /// <summary>
        /// renvoie la représentation en chaine de caractère de l'objet 'data', "" pour 'DBNull.Value' et 'Nothing'
        /// </summary>
        /// <param name="data">objet à convertir en chaine de caractère</param>
        /// <returns>la représentation en chaine de caractère de l'objet data</returns>
        /// <remarks></remarks>
        public static string SafeData(object data, string @default = "")
        {
            if (data != null && data != DBNull.Value)
                return data.ToString();
            else
                return @default;
        }

        /// <summary>
        /// Retourne true si le texte passé en paramètre est un nombre, false sinon
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static bool IsNumeric (string data)
        {
            return double.TryParse(data, out _);
        }



        #region "Fonctions de convertion de données" 


        /// <summary>
        /// Crée une table à partir d'un objet.
        /// les colonnes de la table son créées la base des propriétés de l'objet
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static DataTable CreateTable<T>( bool ignoreTenantId=false)
        {
            Type entityType = typeof(T);
            DataTable table = new DataTable(entityType.Name);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

            foreach (PropertyDescriptor prop in properties)

                //Ne pas créer la colonne tenantId se cela est demandé
                if (ignoreTenantId && prop.Name.ToLower() == "tenantid")
                {
                }
                else
                {
                    if (prop.PropertyType.Name.ToLower().StartsWith("nullable"))
                    {
                        table.Columns.Add(prop.Name, typeof(long));
                    }
                    else
                    {
                         table.Columns.Add(prop.Name, prop.PropertyType);
                    }
                }

               
               

            return table;
        }

        /// <summary>
        ///  Convertir un DataRow en objet de type T
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="row"></param>
        /// <returns></returns>
        public static T CreateItem<T>(DataRow row)
        {
            T obj = default(T);
            if (row != null)
            {
                obj = Activator.CreateInstance<T>();

                foreach (DataColumn column in row.Table.Columns)
                {
                    PropertyInfo prop = obj.GetType().GetProperty(column.ColumnName);
                    try
                    {
                        object value = row[column.ColumnName];
                        prop.SetValue(obj, value, null);
                    }
                    catch
                    {
                    }
                }
            }

            return obj;
        }


        /// <summary>
        ///     Convertir un IList (of T) en Datatable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
        /// <returns></returns>
        /// <remarks></remarks>
        public static DataTable ConvertTo<T>(IList<T> list)
        {
            //Créer les colonnes de la table sur la base des propriétés du type d'objet
            DataTable table = CreateTable<T>();
            Type entityType = typeof(T);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

            //Parcourir les éléments de la liste
            foreach (T item in list)
            {
                //Créer un datarow pour chaque item
                DataRow row = table.NewRow();

                foreach (PropertyDescriptor prop in properties)
                    row[prop.Name] = prop.GetValue(item);

                table.Rows.Add(row);
            }

            return table;
        }


        /// <summary>
        /// Convertir un IList of DataRows en IList of object de type T
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="rows"></param>
        /// <returns></returns>
        public static IList<T> ConvertTo<T>(IList<DataRow> rows)
        {
            IList<T> list = null;

            if (rows != null)
            {
                list = new List<T>();

                foreach (DataRow row in rows)
                {
                    T item = CreateItem<T>(row);
                    list.Add(item);
                }
            }

            return list;
        }


        /// <summary>
        /// Convertir un dataTable en IList (Of T)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="table"></param>
        /// <returns></returns>
        public static IList<T> ConvertTo<T>(DataTable table)
        {
            if (table == null)
                return null;

            List<DataRow> rows = new List<DataRow>();

            foreach (DataRow row in table.Rows)
                rows.Add(row);

            return ConvertTo<T>(rows);
        }


        /// <summary>
        /// Permet la conversion d'un datatable en list of Dynamic.ExpandoObject pour faciliter l'utilisation les objets dynamique
        /// </summary>
        /// <param name="maTable"></param>
        /// <returns></returns>
        public static List<System.Dynamic.ExpandoObject> ConvertirDataTableToListOfDynamicObjects(DataTable maTable)
        {
            if (maTable == null) return null;

            var dynamicList = new List<System.Dynamic.ExpandoObject>();

            foreach (DataRow dr in maTable.Rows)
            {
                var myObj = new System.Dynamic.ExpandoObject();
                var p = myObj as IDictionary<string, object>;
                foreach (DataColumn macol in maTable.Columns)
                    p[macol.ColumnName.Replace(" ", "").Replace("-", "")] = dr[macol.ColumnName];

                dynamicList.Add((System.Dynamic.ExpandoObject)p);
            }

            return dynamicList;
        }


        /// <summary>
        /// Permet de mettre à jour la valeur de l'objet "objectToUpdate" depuis l'objet "value" en adaptant la valeur selon le type "dbType" de "objectToUpdate".
        /// </summary>
        /// <param name="objectToUpdate"></param>
        /// <param name="dbType"></param>
        /// <param name="value"></param>
        /// <param name="culture"></param>
        /// <returns>True si aucune erreur n'a eu lieu lors de la mise à jour des valeurs et false en cas d'erreur de mise à jour de l'objet</returns>
        public static Boolean UpdateObjectByDbDataType(object objectToUpdate, string dbType, object value, IFormatProvider culture = null)
        {
            try
            {
                switch (dbType)
                {
                    case "System.String":
                        {
                            objectToUpdate = value;
                            break;
                        }
                    case "System.Boolean":
                        {
                            if (value.GetType() == typeof(Boolean))
                            {
                                if ((Boolean)value)
                                {
                                    objectToUpdate = Convert.ToInt32(1);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToInt32(0);
                                }
                            }
                            else
                            {
                                if (Utils.IsNumeric(value.ToString()))
                                {
                                    if (Convert.ToInt16(value) > 0)
                                    {
                                        objectToUpdate = true;
                                    }
                                    else
                                    {
                                        objectToUpdate = false;
                                    }
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToBoolean(value.ToString());
                                }
                            }
                            break;
                        }
                    case "System.Int64":
                        {
                            if (value.GetType() == typeof(Boolean))
                            {
                                if ((Boolean)value)
                                {
                                    objectToUpdate = Convert.ToInt64(1);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToInt64(0);
                                }
                            }
                            else
                            {
                                if (value.ToString().StartsWith("#"))
                                {
                                    objectToUpdate = Convert.ToInt64(value.ToString().Replace("#", ""), 16);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToInt64(value.ToString().Replace(",", "."), new CultureInfo("en-US"));
                                }
                            }
                            break;
                        }
                    case "System.Int32":
                        {
                            if (value.GetType() == typeof(Boolean))
                            {
                                if ((Boolean)value)
                                {
                                    objectToUpdate = Convert.ToInt32(1);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToInt32(0);
                                }
                            }
                            else
                            {
                                if (value.ToString().StartsWith("#"))
                                {
                                    objectToUpdate = Convert.ToInt32(value.ToString().Replace("#", ""), 16);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToInt32(value.ToString().Replace(",", "."), new CultureInfo("en-US"));
                                }
                            }
                            break;
                        }

                    case "System.Int16":
                        {
                            if (value.GetType() == typeof(Boolean))
                            {
                                if ((Boolean)value)
                                {
                                    objectToUpdate = Convert.ToInt16(1);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToInt16(0);
                                }
                            }
                            else
                            {
                                if (value.ToString().StartsWith("#"))
                                {
                                    objectToUpdate = Convert.ToInt16(value.ToString().Replace("#", ""), 16);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToInt16(value.ToString().Replace(",", "."), new CultureInfo("en-US"));
                                }
                            }
                            break;
                        }
                    case "System.SByte":
                        {
                            if (value.GetType() == typeof(Boolean))
                            {
                                if ((Boolean)value)
                                {
                                    objectToUpdate = Convert.ToByte(1);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToByte(0);
                                }


                            }
                            else
                            {
                                objectToUpdate = Convert.ToByte(value);
                            }
                            break;
                        }
                    case "System.Byte":
                        {
                            if (value.GetType() == typeof(Boolean))
                            {
                                if ((Boolean)value)
                                {
                                    objectToUpdate = Convert.ToByte(1);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToByte(0);
                                }
                            }
                            else
                            {
                                objectToUpdate = Convert.ToByte(value);
                            }
                            break;
                        }
                    case "System.TimeSpan":
                        {
                            try
                            {
                                if (culture == null)
                                {
                                    objectToUpdate = new DateTimeOffset(Convert.ToDateTime(value)).ToUnixTimeSeconds();
                                }
                                else
                                {
                                    objectToUpdate = new DateTimeOffset(Convert.ToDateTime(value, culture)).ToUnixTimeSeconds();
                                }
                            }
                            catch
                            {
                                try
                                {
                                    objectToUpdate = new DateTimeOffset(DateTime.Parse((string)value, null, System.Globalization.DateTimeStyles.RoundtripKind)).ToUnixTimeSeconds();
                                }
                                catch { }
                            }
                            break;
                        }
                    case "System.DateTime":
                        {
                            try
                            {
                                if (culture == null)
                                {
                                    objectToUpdate = Convert.ToDateTime(value);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToDateTime(value, culture);
                                }
                            }
                            catch
                            {
                                try
                                {
                                    objectToUpdate = DateTime.Parse((string)value, null, System.Globalization.DateTimeStyles.RoundtripKind);
                                }
                                catch { }
                            }
                            break;
                        }
                    case "System.Decimal":
                        {
                            if (value.GetType() == typeof(Boolean))
                            {
                                if ((Boolean)value)
                                {
                                    objectToUpdate = Convert.ToDecimal(1);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToDecimal(0);
                                }
                            }
                            else
                            {
                                if (value.ToString().StartsWith("#"))
                                {
                                    objectToUpdate = Convert.ToDecimal(value.ToString().Replace("#", "").Replace(",", "."), new CultureInfo("en-US"));
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToDecimal(value.ToString().Replace(",", "."), new CultureInfo("en-US"));
                                }
                            }
                            break;
                        }
                    case "System.Double":
                        {
                            if (value.GetType() == typeof(Boolean))
                            {
                                if ((Boolean)value)
                                {
                                    objectToUpdate = Convert.ToDouble(1);
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToDouble(0);
                                }
                            }
                            else
                            {
                                if (value.ToString().StartsWith("#"))
                                {
                                    objectToUpdate = Convert.ToDouble(value.ToString().Replace("#", "").Replace(",", "."), new CultureInfo("en-US"));
                                }
                                else
                                {
                                    objectToUpdate = Convert.ToDouble(value.ToString().Replace(",", "."), new CultureInfo("en-US"));
                                }
                            }
                            break;
                        }
                    //"System.Byte[]" ByteArray
                    case "System.Byte[]":
                        {
                            if (value.GetType() == typeof(byte[]))
                            {
                                objectToUpdate = value;
                            }
                            else
                            {
                                objectToUpdate = Convert.FromBase64String((string)value);
                            }
                            break;
                        }
                    default:
                        {
                            objectToUpdate = value;
                            break;
                        }


                }
            }
            catch
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Permet de créer des EntityTypes depuis les noms des types de données en provenance de base de données "DbType"
        /// </summary>
        /// <param name="dbType"></param>
        /// <param name="maxLength"></param>
        /// <returns></returns>
        public static string ConvertDbTypeToEntityType(string dbType, int maxLength)
        {
            /*
             * BIGINT	BIG INTEGER (INT64)	Int 64 for currency and big numbers		
BINARYMAX	BINARYMAX	Data for object and files		
BIT	BIT	Bit 0 or 1		
BOOL	BOOLEAN	True or False		
DATE	DATE	Show date only		
DATETIME	DATE AND TIME	Show date and time		
FLOAT	FLOAT	Double, Decimal or float. also for very big numbers		
INT	INTEGER	Int32 standard integer	
SMALLINT   Int16
LONGTEXT	LONGTEXT	NVARCHARMAX for very big strings		
SHORTTEXT	SHORT TEXT(50)	Small text, max length 50		
SMALLTEXT	SMALL TEXT(120)	Short text for names, captions and labels etc. max length 120		
TEXT	TEXT(400)	ordinary text, max length 400		
TIME	TIME	Show time only		
TINYINT	TINYINT	Small number from 0 to 10		
             */
            switch (dbType)
            {
                case "System.String":
                    {
                        if (maxLength == -1) return "TEXT";

                        if (maxLength <= 50) return "SHORTTEXT";

                        if (maxLength > 50 && maxLength <= 120 ) return "SMALLTEXT";

                        if (maxLength > 120 && maxLength <= 400) return "TEXT";

                        return "LONGTEXT";
                    }
                case "System.Boolean":
                    {
                        return "BOOL";
                    }
                case "System.Int64":
                    {
                        return "BIGINT";
                    }
                case "System.Int32":
                    {
                        return "INT";                        
                    }
                
                case "System.Int16":
                    {
                        return "SMALLINT"; //a intégrer
                    }
                case "System.SByte":
                    {
                        if (maxLength == -1) return "SMALLINT";
                        if (maxLength == 1) return "BIT";
                        if (maxLength > 1 && maxLength <= 10) return "TINYINT";
                        return "SMALLINT";
                    }
                case "System.Byte":
                    {
                        if (maxLength == -1) return "SMALLINT";
                        if (maxLength == 1) return "BIT";
                        if (maxLength > 1 && maxLength <= 10) return "TINYINT";
                        return "SMALLINT";
                    }
                case "System.TimeSpan":
                    {
                        return "TIMESPAN"; //a intégrer
                    }
                case "System.DateTime":
                    {
                        return "DATETIME";
                    }
                case "System.Decimal":
                    {
                        return "FLOAT";
                    }
                case "System.Double":
                    {
                        return "FLOAT";
                    }
                //"System.Byte[]"
                case "System.Byte[]":
                    {
                        return "BINARYMAX";
                    }
                default:
                    {
                        return "TEXT";
                    }
            }

        }

        /// <summary>
        /// Permet de retourner le null du type de donnée correspondant à l'entityType passé en paramètre
        /// </summary>
        /// <param name="entityType"></param>
        /// <returns></returns>
        public static object GetEntityTypeNull(string entityType)
        {

            switch (entityType)
            {
                case "SHORTTEXT":
                case "SMALLTEXT":
                case "LONGTEXT":
                case "TEXT":
                    {
                        return (string)null ;
                    }
                case "BOOL":
                    {
                        return (bool?)null;
                    }
                case "BIGINT":
                    {
                        return (Int64?)null;
                    }
                case "INT":
                    {
                        return (int?)null;
                    }

                case "SMALLINT":
                    {
                        return (Int16?)null;
                    }

                case "BIT":
                case "TINYINT":
                    {
                        return (byte?)null;
                    }
                case "TIME":
                    {
                        return DbType.Time;
                    }
                case "DATETIME":
                    {
                        return (DateTime?)null;
                    }
                case "FLOAT":
                    {
                        return (double?)null;
                    }

                //"System.Byte[]"
                case "BINARYMAX":
                    {
                        return null;
                    }
                default:
                    {
                        return null;
                    }
            }

        }

        /// <summary>
        /// Permet de retourner le null du type de donnée correspondant à l'entityType passé en paramètre
        /// </summary>
        /// <param name="entityType"></param>
        /// <returns></returns>
        public static object ConvertToEntityTypeValue(string entityType, object value)
        {

            if (value == null) return GetEntityTypeNull(entityType);

            switch (entityType)
            {
                case "SHORTTEXT":
                case "SMALLTEXT":
                case "LONGTEXT":
                case "TEXT":
                    {
                        return (string)value;
                    }
                case "BOOL":
                    {
                        return (bool?)value;
                    }
                case "BIGINT":
                    {
                        return (Int64?)null;
                    }
                case "INT":
                    {
                        return (int?)null;
                    }

                case "SMALLINT":
                    {
                        return (Int16?)null;
                    }

                case "BIT":
                case "TINYINT":
                    {
                        return (byte?)null;
                    }
                case "TIME":
                    {
                        return DbType.Time;
                    }
                case "DATETIME":
                    {
                        return (DateTime?)null;
                    }
                case "FLOAT":
                    {
                        return (double?)null;
                    }

                //"System.Byte[]"
                case "BINARYMAX":
                    {
                        return null;
                    }
                default:
                    {
                        return null;
                    }
            }

        }

        /// <summary>
        /// Permet de retourner le DBType correspondant à l'entityType passé en paramètre
        /// </summary>
        /// <param name="entityType"></param>
        /// <returns></returns>
        public static DbType ConvertEntityTypeToDbType(string entityType)
        {
           
            switch (entityType)
            {
                case "SHORTTEXT":
                case "SMALLTEXT":
                case "LONGTEXT":
                case "TEXT":
                    {
                        return DbType.String;
                    }
                case "BOOL":
                    {
                        return DbType.Boolean;
                    }
                case "BIGINT":
                    {
                        return DbType.Int64 ;
                    }
                case "INT":
                    {
                        return DbType.Int32;
                    }

                case "SMALLINT":
                    {
                        return DbType.Int16 ; 
                    }
               
                case "BIT":
                case "TINYINT":
                    {
                        return  DbType.Byte;
                    }
                case "TIME":
                    {
                        return DbType.Time;
                    }
                case "DATETIME":
                    {
                        return DbType.DateTime ;
                    }
                case "FLOAT":
                    {
                        return DbType.Double;
                    }
                
                //"System.Byte[]"
                case "BINARYMAX":
                    {
                        return DbType.Binary;
                    }
                default:
                    {
                        return DbType.String;
                    }
            }

        }


        /// <summary>
        /// Permet de lire un System.IO.Stream et de retourner le texte contenu
        /// </summary>
        /// <param name="StringAConvertir"></param>
        /// <param name="Encodage">Encodage utilisé par défaut est le UTF-8</param>
        /// <returns></returns>
        public static Stream ConvertStringToStream(string StringAConvertir, string Encodage = "")
        {
            System.IO.MemoryStream myStream ;
            try
            {

                // Créer un tableau de bite à partir de la chaine de caratère
                byte[] bytes;

                switch (Encodage.ToLower())
                {
                    case "iso-8859-1":
                    case "28591":
                    case "latin1":
                        {
                            bytes = System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(StringAConvertir);
                            break;
                        }

                    case "utf32":
                        {
                            bytes = System.Text.Encoding.UTF32.GetBytes(StringAConvertir);
                            break;
                        }

                    case "utf8":
                        {
                            bytes = System.Text.Encoding.UTF8.GetBytes(StringAConvertir);
                            break;
                        }

                    case "ascii":
                        {
                            bytes = System.Text.Encoding.ASCII.GetBytes(StringAConvertir);
                            break;
                        }

                    default:
                        {
                            bytes = System.Text.Encoding.Unicode.GetBytes(StringAConvertir);
                            break;
                        }
                }

                // Créer un stream et le garder en mémoire
                myStream = new System.IO.MemoryStream(bytes);
                myStream.Position = 0;
            }
            catch (Exception ex)
            {
                throw;
            }

            return myStream;
        }


        /// <summary>
        ///  Permet de lire un System.IO.Stream et de retourner le texte contenu. (Encodage utilisé par défaut est le UTF-8)
        /// </summary>
        /// <param name="monStream"></param>
        /// <param name="cheminFichier"></param>
        /// <returns></returns>
        public static string ConvertStreamToString(System.IO.Stream monStream, string cheminFichier = "")
        {
            string maChaineARetourner = "";

            try
            {
                if (cheminFichier.Trim() == "")
                {
                    // mettre le curseur au debut
                    monStream.Position = 0;

                    // monStream.Flush()
                    // Create new StreamReader instance with Using block.
                    using (System.IO.StreamReader reader = new System.IO.StreamReader(monStream, true)) // , System.Text.Encoding.UTF32, True)
                    {
                        // lire tout le contenu
                        maChaineARetourner = reader.ReadToEnd();
                    }
                }
                else
                {
                    // Charger le fichier depuis le chemin
                    FileStream newStream = new FileStream(cheminFichier, FileMode.Open);
                    using (System.IO.StreamReader reader = new System.IO.StreamReader(newStream, true)) // , System.Text.Encoding.UTF32, True)
                    {
                        // lire tout le contenu
                        maChaineARetourner = reader.ReadToEnd();
                    }

                    // Fermer le fichier s'il est toujours en mode ouvert
                    try
                    {
                        newStream.Close();
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }


            return maChaineARetourner;
        }


        #endregion





    }
}
