using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Security;
using System.Threading.Tasks;
using Microsoft.VisualBasic;
using System.Data.Common;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;
using System.Data.SqlClient;
using Npgsql;

namespace IA.MagicSuite.MagicShared
{
    public class DBUtils
    {

        public static Dictionary<string, object> SaveDictionaryWithDataApdaterAndDataSet(Dictionary<string, object> dicoDAandDS, string tableName)
        {

            //Récupérer la table soujacente
            DbDataAdapter da = (DbDataAdapter)dicoDAandDS["DA"];
            //Récupérer la table soujacente
            DataSet ds = (DataSet)dicoDAandDS["DS"];

            try
            {
                //Enregistrer les modfications de la table
                da.Update(ds, tableName);
            }
            catch
            {
                throw;
            }
            

            return dicoDAandDS;
        }

        /// <summary>
        /// Permet de créer et retourner un Dictionnaire contenant 2 éléments DA: DbDataAdater et DS: DataSet pour le facilter la réalisation d'opération CRUD dans la BD depuis une requète SQL select
        /// Adaptée à la création automatique des commandes CRUD
        /// </summary>
        /// <param name="selectSQL">SQL de sélection sans jointure</param>
        /// <param name="connectionObject">Objet de connexion à la base de données</param>
        /// <param name="tableName">Nom de la table dans le dataSet</param>
        /// <param name="dicoOfParameters">Dictionnaire des paramètres existants dans le selectSQL avec leurs valeurs de remplacement</param>
        /// <returns></returns>
        public static Dictionary<string,object> GetDictionaryWithDataApdaterAndDataSetForCRUD(string selectSQL, System.Data.Common.DbConnection connectionObject, string tableName, Dictionary<string, object> dicoOfParameters = null)
        {
            //Créer le dictionnaire à retourner
            Dictionary<string, object> dicoDAandDS = new Dictionary<string, object>();

            //Créer le DbDataAdapter et l'intégrer dans le dictionnaire
            DbDataAdapter DA = GetDataAdapteur(selectSQL, connectionObject, dicoOfParameters, true);            
            dicoDAandDS.Add("DA", DA);

            //Créer le dataSet
            DataSet DS = new DataSet();

            try{
                //Vérifier l'état de la connexion et l'ouvrir si nécessaire
                if (connectionObject.State == ConnectionState.Closed){
                    try
                    {
                        connectionObject.Open();
                    }
                    catch
                    {
                    }
                }

                //remplir le dataset
                DA.Fill(DS, tableName);

                //Intégrer le Dataset au dictionnaire.
                dicoDAandDS.Add("DS", DS);

            } catch {
                throw;
            }

            //Retourner le dictionnaire contenant le DataAdapter et le DataSet avec la table recherchée
            return dicoDAandDS;
        }

        /// <summary>
        /// Permet de générer automatiquement les commandes Insert, Update et Delete a partir de la commande Select du DataAdapter Passé en paramètre
        /// </summary>
        /// <param name="myDataAdapter"></param>
        /// <returns></returns>
        public static bool CreateDataAdapteurCRUDCommands(DbDataAdapter myDataAdapter)
        {
            try
            {
                               
                DbCommandBuilder maCommand;
                // vérifier le type du adapteur pour créer le type adéquat de commande
                if (myDataAdapter is SqlDataAdapter adapter2)
                {
                    maCommand = new SqlCommandBuilder(adapter2);                    
                    // maCommand.SetAllValues = True
                    
                }
                else if (myDataAdapter is NpgsqlDataAdapter adapter3)
                {
                    
                    maCommand = new NpgsqlCommandBuilder(adapter3);
                    
                    //// Mettre a jour le nom des parametres
                    //foreach (Common.DbParameter param in monDataAdapteur.UpdateCommand.Parameters)
                    //    param.ParameterName = string.Format("@{0}", param.SourceColumn);
                    //// Mettre a jour le nom des parametres
                    //foreach (Common.DbParameter param in monDataAdapteur.InsertCommand.Parameters)
                    //    param.ParameterName = string.Format("@{0}", param.SourceColumn);
                    
                }
                else if (myDataAdapter is OracleDataAdapter adapter)
                {                   
                     maCommand = new OracleCommandBuilder(adapter);                    
                }
                else if (myDataAdapter is System.Data.Odbc.OdbcDataAdapter adapter1)
                {
                    maCommand = new System.Data.Odbc.OdbcCommandBuilder(adapter1);                    
                }                
                else
                {
                    maCommand = new MySql.Data.MySqlClient.MySqlCommandBuilder((MySql.Data.MySqlClient.MySqlDataAdapter)myDataAdapter)
                    {
                        QuotePrefix = "`",
                        QuoteSuffix = "`"
                    };
                }

                maCommand.ConflictOption = ConflictOption.OverwriteChanges;

                // Prendre les commandes de mise à jour générée automatiquement
                myDataAdapter.UpdateCommand = maCommand.GetUpdateCommand(true);
                myDataAdapter.InsertCommand = maCommand.GetInsertCommand(true);
                myDataAdapter.DeleteCommand = maCommand.GetDeleteCommand(true);
            }
            catch 
            {
                return false;
            }


            return true;
        }


        /// <summary>
        /// Permet de créer et retourner un dataAdapteur adéquat en fonction du type de de l'objet connexion passé
        /// </summary>
        /// <param name="selectSQL">SQL de sélection des données qui sera utilisée par le DataAdapter</param>
        /// <param name="connectionObject">Objet de connexion à la base de données (DBConnection)</param>
        /// <param name="createCRUDCommands">Si True alors les commandes Update, Insert et Delete sont automatiquement générées en fonction du selectSQL fourni</param>
        /// <returns></returns>
        public static System.Data.Common.DbDataAdapter GetDataAdapteur(string selectSQL, System.Data.Common.DbConnection connectionObject, Dictionary<string, object> dicoOfParameters = null, bool createCRUDCommands = false)
        {
            System.Data.Common.DbDataAdapter myDataAdapter;

            //PostgreSQL
            if (connectionObject is NpgsqlConnection connection1)
            {
                // Créer un adapteur PostgreSQL
                myDataAdapter = new NpgsqlDataAdapter(selectSQL, connection1);
                //Vérifier si un dictionnaire de paramètre existants dans le selectSQL a été fourni
                if (dicoOfParameters != null && dicoOfParameters.Count > 0)
                {
                    //Ajouter les paramètres pour pouvoir lancer la requète.
                    myDataAdapter.SelectCommand.Parameters.AddRange(dicoOfParameters.Select(x => new NpgsqlParameter($"@x.Key", x.Value)).ToArray());
                }
            }
            else if (connectionObject is SqlConnection connection2)
            {//SQL Server
                myDataAdapter = new SqlDataAdapter(selectSQL, connection2);
                if (dicoOfParameters != null && dicoOfParameters.Count > 0)
                {
                    myDataAdapter.SelectCommand.Parameters.AddRange(dicoOfParameters.Select(x => new SqlParameter($"@x.Key", x.Value)).ToArray());
                }
            }
            else if (connectionObject is OracleConnection connection3)
            {
                myDataAdapter = new OracleDataAdapter(selectSQL, connection3);
                if (dicoOfParameters != null && dicoOfParameters.Count > 0)
                {
                    myDataAdapter.SelectCommand.Parameters.AddRange(dicoOfParameters.Select(x => new OracleParameter($"@x.Key", x.Value)).ToArray());
                }
            }
            else if (connectionObject is System.Data.Odbc.OdbcConnection connection4)
            {
                myDataAdapter = new System.Data.Odbc.OdbcDataAdapter(selectSQL, connection4);
                if (dicoOfParameters != null && dicoOfParameters.Count > 0)
                {
                    myDataAdapter.SelectCommand.Parameters.AddRange(dicoOfParameters.Select(x => new System.Data.Odbc.OdbcParameter($"@x.Key", x.Value)).ToArray());
                }
            }
            else
            {
                // MysQL
                myDataAdapter = new MySql.Data.MySqlClient.MySqlDataAdapter(selectSQL, (MySql.Data.MySqlClient.MySqlConnection)connectionObject);
                if (dicoOfParameters != null && dicoOfParameters.Count > 0)
                {
                    myDataAdapter.SelectCommand.Parameters.AddRange(dicoOfParameters.Select(x => new MySql.Data.MySqlClient.MySqlParameter($"@x.Key", x.Value)).ToArray());
                }
            }
                       

            if (createCRUDCommands){
                CreateDataAdapteurCRUDCommands(myDataAdapter);
            }

            // Retourner le dataAdapteur
            return myDataAdapter;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="selectSQL">SQL de sélection des données qui sera utilisée par le DataAdapter</param>
        /// <param name="connectionString">Chaine de connexion à la base de données</param>
        /// <returns></returns>
        public static System.Data.Common.DbDataAdapter GetDataAdapteur(string selectSQL, string connectionString, Dictionary<string, object> dicoOfParameters = null, bool createCRUDCommands = false)
        {
            System.Data.Common.DbConnection myCon = GetConnectionFromConnectionString(connectionString);
            
            // Retourner le dataAdapteur
            return GetDataAdapteur(selectSQL, myCon, dicoOfParameters, createCRUDCommands);
        }

        /// <summary>
        /// Retourne un dictionnaire contenant la liste des paramètres (@NomParametre) contenus dans une chaine SQL
        /// </summary>
        /// <param name="StringWithParameters"></param>
        /// <returns></returns>
        public static Dictionary<string, object> GetDbParametersFromString(string StringWithParameters)
        {
            Dictionary<string, object> dico = new Dictionary<string, object>();

            var rxPattern = @"(?<=\= |\=)@\w*";
            foreach (System.Text.RegularExpressions.Match item in System.Text.RegularExpressions.Regex.Matches(StringWithParameters, rxPattern))
            {                
                
                //N'ajouter le paramètre que s'il n'existe pas encore
                if (dico.ContainsKey(item.Value.Replace("@", "")) == false){
                    dico.Add(item.Value.Replace("@", ""), null);
                }
            }

            return dico;
        }

        /// <summary>
        /// Permet de définir si oui ou non la chaine passée en argument contient des paramètre de base de donnée SQL "@"
        /// </summary>
        /// <param name="StringWithParameters"></param>
        /// <returns>True si oui, ou False si elle ne contient pas de paramètres</returns>
        public static bool hasDbParameters(string StringWithParameters)
        {

            if (StringWithParameters.Contains("@")) return true;

            return false;
        }

        /// <summary>
        /// Ajuste les paramètres globaux de mysql pour faciliter les enregistrements des données volumineuses et autres
        /// </summary>
        public static void mySQL_parametrage_variables_globales(DbConnection maCon)
        {
            try
            {
                // max_allowed_packet
                string monSQL = "SET GLOBAL max_allowed_packet = 100000000 ;";

                maCon.Open();
                var cmd = maCon.CreateCommand();
                cmd.CommandText = monSQL;
                cmd.ExecuteNonQuery();
                maCon.Close();
            }
            catch
            {
                try
                {
                    if (maCon.State == ConnectionState.Open)
                        maCon.Close();
                }
                catch
                {
                }
            }
        }

        /// <summary>
        /// Permet de retourner le type de connexion : SQLSERVER, ORACLE, MYSQL, POSTGRESQL, ODBC
        /// </summary>
        /// <param name="ChaineConnexion">Chaine de connexion a la base de données</param>
        /// <param name="encryptionKey">Clé d'encryptage de la chaine de connexion si elle est cryptée, sinon laisser chaine vide</param>
        /// <returns></returns>
        public static string GetConnectionTypeFromConnectionString(string ChaineConnexion, string encryptionKey = "")
        {

            // Si la chaine de connexion est vide, lancer la recherche de la chaine
            var ConnectionStr = "";

            if (ChaineConnexion == "")
                throw new Exception() { Source = "Chaine de connexion à l'application non valide!" };
            else if (string.IsNullOrEmpty(encryptionKey))
                ConnectionStr = ChaineConnexion;
            else
                ConnectionStr = SecurityUtils.Decrypt(ChaineConnexion, encryptionKey);

            // Vérifier la nature du provider. le provider est toujours oledb sauf pour mySQL
            if (ConnectionStr.Trim().ToUpper().Contains("Server=") && ConnectionStr.Trim().ToUpper().Contains("Uid="))
            {
                // Base MySQL
                return "MYSQL";
            }
            else if (ConnectionStr.Contains("(SERVICE_NAME=") || ConnectionStr.Contains("TORCL;"))
                return "ORACLE";
            else if (ConnectionStr.Trim().ToUpper().Contains("DATASOURCE=") || ConnectionStr.Trim().ToUpper().Contains("DATA SOURCE="))
                // SQL server natif
                return "SQLSERVER";
            else if (ConnectionStr.Trim().ToUpper().Contains("DSN=") || ConnectionStr.Trim().ToUpper().Contains("DRIVER={"))
                // ODBC
                return "ODBC";
            else
            {
                // Base PostGre
                return "POSTGRESQL";
            }

        }

        /// <summary>
        /// Permet de retournre un objet DbConnection depuis la chaine de connexion passé en paramètre
        /// </summary>
        /// <param name="ChaineConnexion">Chaine de connexion a la base de données</param>
        /// <param name="encryptionKey">Clé d'encryptage de la chaine de connexion si elle est cryptée, sinon laisser chaine vide</param>
        /// <returns></returns>
        public static DbConnection GetConnectionFromConnectionString(string ChaineConnexion, string encryptionKey = "")
        {
            DbConnection MaCon = null;

            // Si la chaine de connexion est vide, lancer la recherche de la chaine
            var ConnectionStr = "";

            if (ChaineConnexion == "")
                throw new Exception() { Source = "Chaine de connexion à l'application non valide!" };
            else if (string.IsNullOrEmpty(encryptionKey))
                ConnectionStr = ChaineConnexion;
            else
                ConnectionStr = SecurityUtils.Decrypt(ChaineConnexion, encryptionKey);

            // Vérifier la nature du provider. le provider est toujours oledb sauf pour mySQL
            if (ConnectionStr.Trim().ToUpper().Contains("Server=") && ConnectionStr.Trim().ToUpper().Contains("Uid="))
            {
                // Base MySQL
                MaCon = new MySql.Data.MySqlClient.MySqlConnection(ConnectionStr);
                mySQL_parametrage_variables_globales(MaCon);
            }
            else if (ConnectionStr.Contains("(SERVICE_NAME=") || ConnectionStr.Contains("TORCL;"))
                MaCon = new OracleConnection(ConnectionStr);
            else if ((ConnectionStr.Trim().ToUpper().Contains("SERVER=") && ConnectionStr.Trim().ToUpper().Contains("TRUSTED_CONNECTION")) || ConnectionStr.Trim().ToUpper().Contains("DATASOURCE =") || ConnectionStr.Trim().ToUpper().Contains("DATA SOURCE=") )
                // SQL server natif
                MaCon = new System.Data.SqlClient.SqlConnection(ConnectionStr);
            else if (ConnectionStr.Trim().ToUpper().Contains("DSN=") || ConnectionStr.Trim().ToUpper().Contains("DRIVER={"))
                // SQL server natif
                MaCon = new System.Data.Odbc.OdbcConnection(ConnectionStr);
            else
            {
                // Base PostGre
                MaCon = new Npgsql.NpgsqlConnection(ConnectionStr);
            }

            // Retourner l'objet de connection principal
            return MaCon; // mainConnection
        }

        /// <summary>
        /// Permet de retourner la chaine de connexion depuis le nom de la chaine de connexion passée en paramètre
        /// </summary>
        /// <param name="nomConnexion">Nom de la connexion recherchée dans la liste de connectionStrings disponibles pour l'application</param>
        /// <param name="encryptionKey">Clé d'encryptage de la chaine de connexion si elle est cryptée, sinon laisser chaine vide</param>
        /// <returns></returns>
        public static string GetConnectionStringFromAppSettings(IConfiguration configuration, string nomConnexion= "Default", string encryptionKey = "")
        {
            string ChaineConnexion = "";

            IConfigurationSection database = null;

            if (nomConnexion != "")
            {
                ChaineConnexion = configuration.GetSection("ConnectionStrings")[nomConnexion];
                if (Utils.SafeData(ChaineConnexion) == "")
                {
                    ChaineConnexion = configuration.GetSection("LinkedDatabases")[nomConnexion];
                }
            }
            else
            {
                database = configuration.GetSection("ConnectionStrings").GetChildren().First();
                //Prendre la chaine de connexion depuis la variable environnement
                ChaineConnexion = database.Value;
            }

            if (string.IsNullOrEmpty(encryptionKey))
                return ChaineConnexion;
            else
                return SecurityUtils.Decrypt(ChaineConnexion, encryptionKey);

        }

        //retourner la chaine de connexion de MagicID
        static string GetMagicIDConnectionString(IConfiguration Configuration, string encryptionKey = "")
        {
            string connectionString = Configuration.GetSection("Databases")["MagicID"];

            //Si une connexion MagicID n'existe pas dans le système, prendre la première connexion dans Databases
            if (Utils.SafeData(connectionString) == "")
            {
                connectionString = Configuration.GetSection("Databases").GetChildren().First().Value;
            }
            //retourner la chaine de connexion
            if (string.IsNullOrEmpty(encryptionKey))
                return connectionString;
            else
                return SecurityUtils.Decrypt(connectionString, encryptionKey);

        }

        /// <summary>
        /// Permet de retourner la chaine de connexion du Workflow engine. 
        /// </summary>
        /// <param name="encryptionKey">Clé d'encryptage de la chaine de connexion si elle est cryptée, sinon laisser chaine vide</param>
        /// <returns></returns>
        public static string GetWFEConnectionStringFromAppSettings(IConfiguration configuration, string encryptionKey = "")
        {
            string ChaineConnexion = "";

            IConfigurationSection database = null;

            ChaineConnexion = configuration.GetSection("LinkedDatabases")["WorkflowEngine"];
            if (Utils.SafeData(ChaineConnexion) == "")
            {
                database = configuration.GetSection("Databases").GetChildren().First();
                ChaineConnexion = database.Value;
            }
            else
            {
                List<string> myDbNameList = DatabasesGetNameList(configuration);
                {
                    if (myDbNameList.Contains(ChaineConnexion))
                    {
                        ChaineConnexion = configuration.GetSection("Databases")[ChaineConnexion];
                    }
                }

                myDbNameList.Clear();
                myDbNameList = null;

            }

            if (string.IsNullOrEmpty(encryptionKey))
                return ChaineConnexion;
            else
                return SecurityUtils.Decrypt(ChaineConnexion, encryptionKey);

        }


        /// <summary>
        /// Permet la creation de template utilisateur
        /// </summary>
        /// <param name="ChaineConnexion">Chaine de connexion a la base de données</param>
        /// <param name="encryptionKey">Clé d'encryptage de la chaine de connexion si elle est cryptée, sinon laisser chaine vide</param>
        /// <returns></returns>
        public static DbConnection GetConnectionFromAppSettings(string nomConnexion, IConfiguration configuration, string encryptionKey = "")
        {
            string ChaineConnexion = GetConnectionStringFromAppSettings(configuration, nomConnexion, encryptionKey);

            //retourner l'objet connexion a partir de la chaine déjà décryptée            
            return GetConnectionFromConnectionString(ChaineConnexion, "");
        }


        /// <summary>
        /// Permet de retourner la liste des noms de connexion liées et utilisables dans les formulaires de magic suite(disponibles dans la rubrique LinkedDatabases des fichiers de config)
        /// </summary>
        /// <param name="configuration">Objet de configuration ASPNET Core</param>
        /// <param name="addNullValue">Permet d'insérer la première valeur comme NULL pour permet l'annulation de sélection si nécessaire pour les controles.</param>
        /// <returns></returns>
        public static List<string> LinkedDatabasesGetNameList(IConfiguration configuration, Boolean addNullValue = false)
        {
            List<string> maList = new List<string>();
            var linkedDBs = configuration.GetSection("LinkedDatabases").GetChildren();

            //ajouter Null si nécessaire
            if (addNullValue) maList.Add(String.Empty);

            for (var i = 0; i < linkedDBs.Count(); i++)
            {
                maList.Add(linkedDBs.ElementAt(i).Key);
            }

            return maList;
        }

        /// <summary>
        /// Permet de retourner la liste des noms de connexion de bases et utilisables comme environnement dans magic suite(disponibles dans la rubrique Databases des fichiers de config)
        /// </summary>
        /// <param name="configuration">Objet de configuration ASPNET Core</param>
        /// <param name="addNullValue">Permet d'insérer la première valeur comme NULL pour permet l'annulation de sélection si nécessaire pour les controles.</param>
        /// <returns></returns>
        public static List<string> DatabasesGetNameList(IConfiguration configuration, Boolean addNullValue = false)
        {
            List<string> maList = new List<string>();
            var DBs = configuration.GetSection("ConnectionStrings").GetChildren();

            //ajouter Null si nécessaire
            if (addNullValue) maList.Add(String.Empty);

            for (var i = 0; i < DBs.Count(); i++)
            {
                maList.Add(DBs.ElementAt(i).Key);
            }

            return maList;
        }



    }

}
