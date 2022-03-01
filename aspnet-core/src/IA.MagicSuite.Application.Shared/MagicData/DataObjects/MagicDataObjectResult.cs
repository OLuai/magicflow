using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace IA.MagicSuite.MagicData
{
    public class MagicDataObjectResult
    {

        /// <summary>
        /// Liste des groupes des champs (fields) de l'entité
        /// </summary>
        public List<MagicSys.Dtos.MagicEntityFieldGroupDto> FieldGroups
        {
            get
            {
                return _FieldGroups;
            }
            set
            {
                _FieldGroups = value;
            }
        }
        private List<MagicSys.Dtos.MagicEntityFieldGroupDto> _FieldGroups;

        /// <summary>
        /// Liste des champs (Fields) de l'entité avec leur caratéristiques
        /// </summary>
        public List<MagicSys.Dtos.MagicEntityFieldDto> Fields
        {
            get
            {
                return _Fields;
            }
            set
            {
                _Fields = value;
            }
        }
        private List<MagicSys.Dtos.MagicEntityFieldDto> _Fields;

        /// <summary>
        /// Liste des relations de l'entité avec les autres entités
        /// </summary>
        public List<MagicSys.Dtos.MagicEntityRelationDto> Relations
        {
            get
            {
                return _Relations;
            }
            set
            {
                _Relations = value;
            }
        }
        private List<MagicSys.Dtos.MagicEntityRelationDto> _Relations;


        #region Fonctions d'initialisation

        /// <summary>
        /// Créer un nouvel objet vierge à retourner vers le client
        /// </summary>
        /// <remarks></remarks>
        public MagicDataObjectResult()
        {
        }

        /// <summary>
        /// Créer un nouvel objet avec message d'erreur à retourner vers le client
        /// </summary>
        /// <param name="message_erreur">Message d'erreur à présenter à l'utilisateur</param>
        /// <remarks></remarks>
        public MagicDataObjectResult(string message_erreur)
        {
            if (message_erreur != null)
                _ErrorMessage = message_erreur;

            _TotalCount = 0;
        }

        /// <summary>
        /// Créer un nouvel objet en utilisant un datatable comme objet "Data" à retourner au client
        /// </summary>
        /// <param name="maTable">Table des valeurs à retourner à l'utilisateur</param>
        /// <remarks></remarks>
        public MagicDataObjectResult(DataTable maTable)
        {
            if (maTable != null)
            {
                _Data = maTable;
                _TotalCount = maTable.Rows.Count;

                //Prise en compte du KeyFieldName
                if (maTable.Columns.Contains("iamCalculatedKey"))
                {
                    _KeyFieldName = "iamCalculatedKey";
                }
                else
                {
                    if (maTable.PrimaryKey != null && maTable.PrimaryKey.Length > 0)
                    {
                        _KeyFieldName = maTable.PrimaryKey[0].ColumnName;
                    }
                    else
                    {
                        if (maTable.Columns.Contains("Id"))
                        {
                            _KeyFieldName = "Id";
                        }
                        else
                        {
                            if (maTable.Columns.Contains("UniqueName"))
                            {
                                _DisplayNameFieldName = "UniqueName";
                            }
                            else
                            {
                                _KeyFieldName = maTable.Columns[0].ColumnName;
                            }
                        }
                    }
                }

                //Prise en compte du displayName
                if (maTable.Columns.Contains("iamCalculatedDisplayName"))
                {
                    _DisplayNameFieldName = "iamCalculatedDisplayName";
                }
                else
                {

                    if (maTable.Columns.Contains("DisplayName"))
                    {
                        _DisplayNameFieldName = "DisplayName";
                    }
                    else
                    {
                        if (maTable.Columns.Contains("Name"))
                        {
                            _DisplayNameFieldName = "Name";
                        }
                        else
                        {
                            if (maTable.Columns.Count > 1)
                            {
                                _DisplayNameFieldName = maTable.Columns[1].ColumnName;
                            }
                            else
                            {
                                _DisplayNameFieldName = maTable.Columns[0].ColumnName;
                            }
                        }
                    }
                }



                //Prise en compte du champ Image
                if (maTable.Columns.Contains("Image"))
                {
                    _ImageFieldName = "Image";
                }
                else
                {
                    if (maTable.Columns.Contains("Photo"))
                    {
                        _ImageFieldName = "Photo";
                    }

                }

                //Prise en compte du champ IconUrl
                if (maTable.Columns.Contains("IconUrl"))
                {
                    _IconUrlFieldName = "IconUrl";
                }
                else
                {
                    if (maTable.Columns.Contains("Icon"))
                    {
                        _IconUrlFieldName = "Icon";
                    }
                }

                //Prise en compte du champ SystemIcon
                if (maTable.Columns.Contains("SystemIcon"))
                {
                    _SystemIconFieldName = "SystemIcon";
                }
                else
                {
                    if (maTable.Columns.Contains("FontIcon"))
                    {
                        _SystemIconFieldName = "FontIcon";
                    }
                }
            }

            else
                _TotalCount = 0;
        }


        /// <summary>
        /// Créer un nouvel objet avec le Data à retourner au client.
        /// </summary>
        /// <param name="data">Liste d'objet a retourner</param>
        /// <param name="is_data"></param>
        public MagicDataObjectResult(List<object> MyData, bool is_data)
        {
            _TotalCount = 0;
            if (is_data)
            {
                if (MyData != null)
                {
                    _Data = MyData;
                    _TotalCount = MyData.Count;

                }
            }

        }


        /// <summary>
        /// Créer un nouvel objet avec un message d'information pour le client.
        /// </summary>
        /// <param name="data"></param>
        /// <param name="is_data"></param>
        public MagicDataObjectResult(string data, bool is_data)
        {
            _TotalCount = 0;
            if (is_data)
            {

            }
            else
                _InformationMessage = data;
        }




        #endregion



        /// <summary>
        ///     ''' Identifiant de l'Enregistrement contenu dans Data si nécessaire.
        ///     ''' </summary>
        ///     ''' <value></value>
        ///     ''' <returns></returns>
        ///     ''' <remarks></remarks>
        public string DataId
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
        private string _DataId;


        /// <summary>
        ///     ''' Donnée arbritaire de toute nature pouvant être retournée au client
        ///     ''' </summary>
        ///     ''' <value></value>
        ///     ''' <returns></returns>
        ///     ''' <remarks></remarks>
        public Object Data
        {
            get
            {
                return _Data;
            }
            set
            {
                _Data = value;
            }
        }
        private Object _Data;

        /// <summary>
        ///     ''' Nom de l'objet dont les données devront être mises à jours.
        ///     ''' </summary>
        ///     ''' <value></value>
        ///     ''' <returns></returns>
        ///     ''' <remarks></remarks>
        public string NomObjet
        {
            get
            {
                return _NomObjet;
            }
            set
            {
                _NomObjet = value;
            }
        }
        private string _NomObjet;

        /// <summary>
        /// Nom du champ Identifiant des données retournée si CRUD attendu.
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string KeyFieldName
        {
            get
            {
                return _KeyFieldName;
            }
            set
            {
                _KeyFieldName = value;
            }
        }
        private string _KeyFieldName;

        /// <summary>
        /// Nom du champ affichant les données visible (non retournée) pour les combos et autres simple lists
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string DisplayNameFieldName
        {
            get
            {
                return _DisplayNameFieldName;
            }
            set
            {
                _DisplayNameFieldName = value;
            }
        }
        private string _DisplayNameFieldName;

        /// <summary>
        /// Nom du champ affichant une image système
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string SystemIconFieldName
        {
            get
            {
                return _SystemIconFieldName;
            }
            set
            {
                _SystemIconFieldName = value;
            }
        }
        private string _SystemIconFieldName;

        /// <summary>
        /// Nom du champ affichant une image depuis une URL
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string IconUrlFieldName
        {
            get
            {
                return _IconUrlFieldName;
            }
            set
            {
                _IconUrlFieldName = value;
            }
        }
        private string _IconUrlFieldName;

        /// <summary>
        /// Nom du champ affichant une image système
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string ImageFieldName
        {
            get
            {
                return _ImageFieldName;
            }
            set
            {
                _ImageFieldName = value;
            }
        }
        private string _ImageFieldName;


        /// <summary>
        /// Nombre total déléments retournés
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public Int64 TotalCount
        {
            get
            {
                return _TotalCount;
            }
            set
            {
                _TotalCount = value;
            }
        }
        private Int64 _TotalCount;

        /// <summary>
        ///     ''' Message d'erreur en cas de problème identifié coté serveur lors du traitement de la demande
        ///     ''' </summary>
        ///     ''' <value></value>
        ///     ''' <returns></returns>
        ///     ''' <remarks></remarks>
        public string ErrorMessage
        {
            get
            {
                return _ErrorMessage;
            }
            set
            {
                _ErrorMessage = value;
            }
        }
        private string _ErrorMessage;

        /// <summary>
        ///     ''' Message d'information à afficher a l'utilisateur pour l'informer de la fin de processus ou autre, ou de l'informer sur quelque chose
        ///     ''' </summary>
        ///     ''' <value></value>
        ///     ''' <returns></returns>
        ///     ''' <remarks></remarks>
        public string InformationMessage
        {
            get
            {
                return _InformationMessage;
            }
            set
            {
                _InformationMessage = value;
            }
        }
        private string _InformationMessage;

        /// <summary>
        /// Javascript à passér au client pour être exécuté par une fonction Eval ou exploitée par le client
        /// </summary>
        /// <value></value>
        /// <returns></returns>
        /// <remarks></remarks>
        public string ClientJs
        {
            get
            {
                return _ClientJs;
            }
            set
            {
                _ClientJs = value;
            }
        }
        private string _ClientJs;

        /// <summary>
        /// Fonction permettant de retourner une réprésentation Json de l'objet actuel
        /// </summary>
        /// <returns></returns>
        /// <remarks></remarks>
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

    }
}
