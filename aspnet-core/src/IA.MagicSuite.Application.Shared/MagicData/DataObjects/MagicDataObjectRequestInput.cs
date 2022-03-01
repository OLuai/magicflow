using IA.MagicSuite.MagicShared;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace IA.MagicSuite.MagicData
{
    public class MagicDataObjectRequestInput
    {
        public MagicDataObjectRequestInput()
        {
            _KeyValuePairs = new Dictionary<string, object>();
            //_Select = new List<string>();
        }

                
        /// <summary>
        ///Nom unique de l'entity (objet) qui represente une source de données modifiable ou non selon ses caractéristiques de paramétrage. 
        ///C'est un objet de ce type (type du entityName) ou sa liste qui seront retournés à l'utilisateur ou mise à jour depuis le service
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string EntityId
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
        private string _EntityId;

        /// <summary>
        /// True pour ajouter les informations sur la structure de l'entité, les fields et les relations
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public Boolean AddSchema
        {
            get
            {
                return _AddSchema;
            }
            set
            {
                _AddSchema = value;
            }
        }
        private Boolean _AddSchema;


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
        public string KeyValuePairsString
        {
            get
            {
                return _KeyValuePairsString;
            }
            set
            {
                _KeyValuePairsString = value;

                if (value != null)
                {
                    _KeyValuePairs = JsonConvert.DeserializeObject<Dictionary<string, object>>(value);
                }
                    
            }
        }
        private string _KeyValuePairsString;

        /// <summary>
        ///Chaine de la forme key:valeur ou nom:valeur urlencodé passé pour donner les valeurs des paramètres nécessaires pour rechercher ou mettre a jour les données
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public Dictionary<string, object> KeyValuePairs
        {
            get
            {
                
                return _KeyValuePairs;
            }
            set
            {
                if (value == null)
                {
                    _KeyValuePairs = new Dictionary<string, object>();
                }
                else
                {
                    _KeyValuePairs = value;
                }
                
            }
        }
        private Dictionary<string,object> _KeyValuePairs;


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
        ///Liste des noms de colonne à retourner
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public List<string> Select
        {
            get
            {
                return _Select;
            }
            set
            {
                
                if (value != null && value.Count == 1 && value[0] == null)
                {
                    _Select = null;
                }
                else
                {
                    _Select = value;
                }
            }
        }
        private List<string> _Select;

        /// <summary>
        ///Chaine(liste des champs avec ASC ou DESC pour chaque champ) permettant d'ordonner les données à retourner à l'utilisateur
        /// </summary>
        /// <value>Est de la forme "ItemIndex ASC, ItemValue DESC"</value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string OrderBy
        {
            get
            {
                return _OrderBy;
            }
            set
            {
                _OrderBy = value;
            }
        }
        private string _OrderBy;

        /// <summary>
        ///Nombre maximum d'éléments à retourner permettant de limiter les données à retourner à l'utilisateur
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public short? Top
        {
            get
            {
                return _Top;
            }
            set
            {
                _Top = value;
            }
        }
        private short? _Top;

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
            catch (Exception)
            {
            }

            return null/* TODO Change to default(_) if this is not a reference type */;
        }
    }
}
