using IA.MagicSuite.MagicShared;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Data;

namespace IA.MagicSuite.MagicData
{
    public class MagicDataObjectRequest
    {

        /// <summary>
        /// Créer une nouvelle demande d'objet magic Data depuis l'identifiant de l'entité uniqement. 
        /// Idéal pour retourner tous les enregistrements d'une entité ne nécessitant aucun parametre pour sa restitution ou exécution.
        /// </summary>
        /// <param name="EntityId">Identitifant de l'entité (objet) data a rechercher pour traitement</param>
        /// <remarks></remarks>
        public MagicDataObjectRequest(long EntityId)
        {
            _EntityId = EntityId;
        }

        /// <summary>
        ///Créer une nouvelle demande d'objet magic Data depuis le nom de la solution et de l'entité
        ///Idéal pour retourner tous les enregistrements d'une entité ne nécessitant aucun parametre pour sa restitution ou exécution.
        /// </summary>
        /// <param name="SolutionName">Nom de la solution à laquelle appatient l'entité</param>
        /// <param name="EntityName">Nom de l'entité demandée</param>
        /// <remarks></remarks>
        public MagicDataObjectRequest(string EntityUniqueName)
        {
            _EntityUniqueName = EntityUniqueName;
        }

        /// <summary>
        ///Créer une nouvelle demande d'objet magic Data depuis le nom de la solution et de l'entité
        ///Idéal pour retourner tous les enregistrements d'une entité ne nécessitant aucun parametre pour sa restitution ou exécution.
        /// </summary>
        /// <param name="SolutionName">Nom de la solution à laquelle appatient l'entité</param>
        /// <param name="EntityName">Nom de l'entité demandée</param>
        /// <remarks></remarks>
        public MagicDataObjectRequest(string SolutionName, string EntityName)
        {
            _SolutionName = SolutionName;
            _EntityName = EntityName;
        }


        /// <summary>
        /// Créer une nouvelle demande d'objet magic Data depuis l'identifiant de l'entité et en passant les autres paramètres avancés
        /// </summary>
        /// <param name="EntityId">Identitifant de l'entité (objet) data a rechercher pour traitement</param>
        /// <param name="DataId">Identifiant de l'enregistrement recherché si c'est un enregistrement spécifique qui est attendu</param>
        /// <param name="KeyValuePairString">Chaine de la forme key:valeur ou nom:valeur urlencodé passé pour donner les valeurs des paramètres nécessaires pour rechercher ou mettre a jour les données</param>
        /// <param name="FilterExpression">Expression de filtre complémentaire pouvant etre utilisé pour affiner la selection des données telque paramétré pour l'entité.</param>
        /// <param name="DatatableString">Chaine contenant les données qui seront converties en DataTable utilisé pour les CRUD opérations sur des données list</param>
        public MagicDataObjectRequest(long EntityId, object DataId, string KeyValuePairString, string FilterExpression, string DatatableString)
        {            
            _EntityId = EntityId;
            _DataId = DataId;
            _KeyValuePairString = KeyValuePairString;
            _FilterExpression = FilterExpression;
            _DatatableString = DatatableString;
        }


        /// <summary>
        /// Créer une nouvelle demande d'objet magic Data depuis le nom de la solution et de l'entité en passant les autres paramètres avancés
        /// </summary>
        /// <param name="SolutionName">Nom de la solution à laquelle appatient l'entité</param>
        /// <param name="EntityName">Nom de l'entité demandée</param>
        /// <param name="DataId">Identifiant de l'enregistrement recherché si c'est un enregistrement spécifique qui est attendu</param>
        /// <param name="KeyValuePairString">Chaine de la forme key:valeur ou nom:valeur urlencodé passé pour donner les valeurs des paramètres nécessaires pour rechercher ou mettre a jour les données</param>
        /// <param name="FilterExpression">Expression de filtre complémentaire pouvant etre utilisé pour affiner la selection des données telque paramétré pour l'entité.</param>
        /// <param name="DatatableString">Chaine contenant les données qui seront converties en DataTable utilisé pour les CRUD opérations sur des données list</param>
        public MagicDataObjectRequest(string SolutionName, string EntityName, object DataId, string KeyValuePairString, string FilterExpression, string DatatableString)
        {
            _SolutionName = SolutionName;
            _EntityName = EntityName;
            _DataId = DataId;
            _KeyValuePairString = KeyValuePairString;
            _FilterExpression = FilterExpression;
            _DatatableString = DatatableString;
        }

        

        public long EntityId
        {
            get
            {
                return _EntityId;
            }
            set
            {
                _EntityId = value;
            }
        }
        private long _EntityId;

        /// <summary>
        ///Nom unique de l'entity (objet) qui represente une source de données modifiable ou non selon ses caractéristiques de paramétrage. 
        ///C'est un objet de ce type (type du entityName) ou sa liste qui seront retournés à l'utilisateur ou mise à jour depuis le service
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string EntityUniqueName
        {
            get
            {
                return _EntityUniqueName;
            }
            set
            {
                _EntityUniqueName = value;
            }
        }
        private string _EntityUniqueName;

        /// <summary>
        /// Name de la solution(domaine de gestion des données d'une application ou d'un interfacage etc) 
        /// Les données sont organisées en projet pour faciliter la gestion et maîtriser la sécurité
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string SolutionName
        {
            get
            {
                return _SolutionName;
            }
            set
            {
                _SolutionName = value;
            }
        }
        private string _SolutionName;

        /// <summary>
        ///Nom du entity (objet) qui represente une source de données modifiable ou non selon ses caractéristiques de paramétrage. 
        ///C'est un objet de ce type (type du entityName) ou sa liste qui seront retournés à l'utilisateur ou mise à jour depuis le service
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string EntityName
        {
            get
            {
                return _EntityName;
            }
            set
            {
                _EntityName = value;
            }
        }
        private string _EntityName;


        /// <summary>
        /// Identifiant de l'enregistrement de l'objet demandé si non vide
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public object DataId
        {
            get
            {
                return _DataId;
            }
            set
            {
                _DataId = value;
            }
        }
        private object _DataId;

        /// <summary>
        ///Chaine de la forme key:valeur ou nom:valeur urlencodé passé pour donner les valeurs des paramètres nécessaires pour rechercher ou mettre a jour les données
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string KeyValuePairString
        {
            get
            {
                return _KeyValuePairString;
            }
            set
            {
                _KeyValuePairString = value;
            }
        }
        private string _KeyValuePairString;


        /// <summary>
        /// Expression de filtre complémentaire pouvant etre utilisé pour affiner la selection des données telque paramétré pour l'entité.
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string FilterExpression
        {
            get
            {
                return _FilterExpression;
            }
            set
            {
                _FilterExpression = value;
            }
        }
        private string _FilterExpression;

        
        /// <summary>
        /// Données qui seront converties en DataTable utilisé pour les CRUD opérations sur des données list
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string DatatableString
        {
            get
            {
                return _DatatableString;
            }
            set
            {
                _DatatableString = value;
            }
        }
        private string _DatatableString;

        /// <summary>
        /// Retourne l'objet datatable depuis la chaine de representation datatable_string
        /// </summary>
        /// <returns></returns>
        /// <remarks></remarks>
        public DataTable GetDataTableFromSTring()
        {
            if (IA.MagicSuite.MagicShared.Utils.SafeData(_DatatableString) == "")
                return null/* TODO Change to default(_) if this is not a reference type */;

            try
            {
                DataTable Table = new DataTable();

                Table = JsonConvert.DeserializeObject<DataTable>(_DatatableString);

                return Table;
            }
            catch (Exception ex)
            {
            }

            return null/* TODO Change to default(_) if this is not a reference type */;
        }
    }
}
