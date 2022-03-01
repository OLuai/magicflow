using IA.MagicSuite.MagicShared;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using IA.MagicSuite.MagicData.Dtos;
using IA.MagicSuite.Dto;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Authorization;
using Abp.Extensions;
using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using IA.MagicSuite.MagicData;
using Abp.Dapper.Repositories;
using IA.MagicSuite.MagicSys;
using Abp.Domain.Entities;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Abp.Domain.Uow;
using System.Dynamic;
using Abp.MultiTenancy;
using Abp.Configuration.Startup;
using Abp.UI;
using Abp.Runtime.Security;
using IA.MagicSuite.Authorization.Users;
using Abp.Linq.Expressions;
using Abp.Organizations;
using System.Data.Common;
using System.Globalization;
using IA.MagicSuite.MagicSys.Dtos;

namespace IA.MagicSuite.MagicData
{
    /// <summary>
    /// Permet de determiner le type d'opération à réaliser
    /// </summary>
    enum OperationType
    {
        Get,
        Insert,
        Update,
        Delete,
        Schema,
    }

    /// <summary>
    /// Service de données principal de l'application permettant la gestion des Entities
    /// </summary>
    [AbpAuthorize]
    public class MagicDataAppService : MagicSuiteAppServiceBase, IMagicDataAppService
    {
		private readonly IRepository<MagicEntity, string> _magicEntityRepository;
        private readonly IRepository<MagicEntityFieldGroup, string> _magicEntityFieldGroupRepository;
        private readonly IRepository<MagicEntityField, string> _magicEntityFieldRepository;
        private readonly IRepository<MagicEntityRelation, string> _magicEntityRelationRepository;
        private readonly IRepository<MagicEntityVariable, string> _magicEntityVariableRepository;
        private readonly IRepository<MagicSolutionConnection, string> _magicSolutionConnectionRepository;
        private readonly IRepository<MagicSolution, string> _magicSolutionRepository;
        private readonly IRepository<MagicSolutionAdministrator, long> _magicSolutionAdministratorRepository;
        private readonly IRepository<MagicDataOwnerShip, string> _magicDataOwnerShipRepository;
        private readonly IRepository<OrganizationUnit, long> _organizationUnitRepository;
        //private readonly IDapperRepository<Entity> _dapperEntityIntRepository;
        private readonly IAbpStartupConfiguration _config;
        private readonly ITenantCache _tenantCache;
        private readonly IPermissionChecker _pChecker;
        private readonly UserManager _userManager;


        /// <summary>
        /// Exécuté lors de la création de la l'objet a partir de la classe
        /// </summary>
        /// <param name="pChecker">Injecter le controleur de permission utilisateur</param>
        /// <param name="tenantCache">Injecter le gestionnaire de cache du tenant</param>
        /// <param name="config">Injecter le fichier config de l'application pour pouvoir utiliser les paramètres de configuration serveur si nécessaire</param>
        /// <param name="magicEntityRepository">Injecter le dépot des entités</param>
        /// <param name="magicEntityFieldGroupRepository">Injecter le dépot des groupes des champs - entités</param>
        /// <param name="magicEntityFieldRepository">Injecter le dépot des champs - entités</param>
        /// <param name="magicEntityRelationRepository">Injecter le dépot des relations - entités</param>
        /// <param name="magicEntityVariableRepository">Injecter le dépot des champs - variables entité</param>
        /// <param name="magicSolutionRepository">Injecter le dépot des solutions</param>
        /// <param name="magicSolutionAdministratorRepository">Injecter le dépot des administrateurs de solution pour le controle des privilèges spécifiques aux solutions</param>
        /// <param name="magicSolutionConnectionRepository">Injecter le dépot des connections de solution pour accéder à la bonne base si nécessaire</param>
        /// <param name="magicDataOwnerShipRepository"></param>
        /// <param name="organizationUnitRepository">Injecter le dépot des organizationUnit pour accéder à la bonne base si nécessaire</param>
        /// <param name="userManager">Gestionnaire des utilisateurs</param>
        public MagicDataAppService(IPermissionChecker pChecker, ITenantCache tenantCache, IAbpStartupConfiguration config, IRepository<MagicEntity, string> magicEntityRepository, IRepository<MagicEntityFieldGroup, string> magicEntityFieldGroupRepository,IRepository<MagicEntityField, string> magicEntityFieldRepository, IRepository<MagicEntityRelation, string> magicEntityRelationRepository, IRepository<MagicEntityVariable, string> magicEntityVariableRepository, IRepository<MagicSolution, string> magicSolutionRepository, IRepository<MagicSolutionAdministrator, long> magicSolutionAdministratorRepository, IRepository<MagicSolutionConnection, string> magicSolutionConnectionRepository, IRepository<MagicDataOwnerShip, string> magicDataOwnerShipRepository, IRepository<OrganizationUnit, long> organizationUnitRepository, UserManager userManager) 
		  {
            _config = config;
            _magicEntityRepository = magicEntityRepository;
            _magicEntityFieldGroupRepository = magicEntityFieldGroupRepository;
            _magicEntityFieldRepository = magicEntityFieldRepository;
            _magicDataOwnerShipRepository = magicDataOwnerShipRepository;
			_magicSolutionRepository = magicSolutionRepository;
            _magicSolutionAdministratorRepository = magicSolutionAdministratorRepository;
            _magicSolutionConnectionRepository = magicSolutionConnectionRepository;
            _organizationUnitRepository = organizationUnitRepository;
            _magicEntityVariableRepository = magicEntityVariableRepository;
            _magicEntityRelationRepository = magicEntityRelationRepository;

            //_dapperEntityIntRepository = dapperEntityIntRepository;
            _tenantCache = tenantCache;
            _pChecker = pChecker;
            _userManager = userManager;
        }


        /// <summary>
        /// Permet de mettre a jour les colonnes du datatable selon la configuration du entity et les privilèges de l'utilisateur.
        /// </summary>
        /// <param name="input">input en provenance du service de données</param>
        /// <param name="sEntity">Entity concerné par l'opération</param>
        /// <param name="dt">datatable contenant les enregistrements à retourner, modifier ou supprimer etc.</param>
        /// <param name="opType">Type d'opération à réaliser Get, Insert, Update, Delete, etc.</param>
        /// <returns></returns>
        private async Task UpdateDataTableColumns(MagicData.MagicDataObjectRequestInput input , MagicEntity sEntity, DataTable dt, OperationType opType)
        {
            //
            var configColumns = await _magicEntityFieldRepository.GetAll().Where(eField => eField.EntityId == sEntity.Id).ToListAsync();

            //Ajout des colonnes calculées
            var configCalcColumns = configColumns.FindAll(eField => !eField.CalculationFormula.IsNullOrEmpty());

            //Parcourir les colonnes calculées à créer
            for (var i = 0; i < configCalcColumns.Count; i++)
            {
                MagicEntityField myField = configCalcColumns[i];
                string formula = myField.CalculationFormula;
                //retourner le type de la colonne depuis le type configuré
                //myField.EntityFieldDataTypeId

                var fieldName = !myField.DbFieldName.IsNullOrEmpty() ? myField.DbFieldName : myField.Name;
                //Vérifier si la colonne existe
                if (!dt.Columns.Contains(fieldName))
                {
                    dt.Columns.Add(fieldName, typeof(string), formula);
                }
                else
                {
                    dt.Columns[fieldName].Expression = formula;
                }
            }

            //Essayer de créer une nouvelle colonne pour le KeyField au cas ou il est calculé de façon précise dans la requestObject ce qui override tout calcul précédent
            if (!sEntity.IdFieldName.IsNullOrEmpty() && sEntity.IdFieldName.ToString().Trim().StartsWith("="))
            {
                var formula = sEntity.IdFieldName.ToString().Trim().Substring(1);

                if (!dt.Columns.Contains("iamCalculatedKey"))
                {
                    dt.Columns.Add("iamCalculatedKey", typeof(string), formula);
                }
                else
                {
                    dt.Columns["iamCalculatedKey"].Expression = formula;
                }
            }

            //Essayer de créer une nouvelle colonne pour le KeyField au cas ou il est calculé de façon précise dans la requestObject ce qui override tout calcul précédent
            if (!sEntity.DisplayFieldName.IsNullOrEmpty() && sEntity.DisplayFieldName.ToString().Trim().StartsWith("="))
            {
                var formula = sEntity.DisplayFieldName.ToString().Trim().Substring(1);

                if (!dt.Columns.Contains("iamCalculatedDisplayName"))
                {
                    dt.Columns.Add("iamCalculatedDisplayName", typeof(string), formula);
                }
                else
                {
                    dt.Columns["iamCalculatedDisplayName"].Expression = formula;
                }
            }


            //Gérer le paramétrage des colonnes, si un paramétrage existe ou l'utilisateur a demandé une sélection spécifique
            if (configColumns.Count > 0)
            {
                for (var i = dt.Columns.Count - 1; i > -1; i--)
                {
                    if (configColumns.Count > 0 && sEntity.UseSelectedFieldsOnly && input.Select == null && input.Select.Count == 0)
                    {

                        //Supprimer la colonne de la table si elle n'existe pas dans liste paramétrée
                        if (configColumns.Exists(col => col.DbFieldName == dt.Columns[i].ColumnName || col.Name == dt.Columns[i].ColumnName) == false) dt.Columns.RemoveAt(i);
                        continue;
                    }
                    else
                    {
                        var col = configColumns.Find(col => col.DbFieldName == dt.Columns[i].ColumnName || col.Name == dt.Columns[i].ColumnName);

                        if (col != null)
                        {
                            //Permission sur la colonne
                            var ColPermissionName = "";

                            switch (opType)
                            {
                                
                                case OperationType.Get:
                                    {
                                        ColPermissionName = Utils.SafeData(col.ReadPermissionValue).Trim();
                                        break;
                                    }

                                case OperationType.Insert:
                                    {
                                        ColPermissionName = Utils.SafeData( col.CreatePermissionValue ?? col.ReadPermissionValue).Trim();
                                        break;
                                    }

                                case OperationType.Update:
                                    {
                                        ColPermissionName = Utils.SafeData(col.UpdatePermissionValue ?? col.ReadPermissionValue).Trim();
                                        break;
                                    }


                            }

                            //Vérifier s'il y'a une permission sur le read du champ et le retirer des colonnes
                            if (ColPermissionName != "")
                            {
                                if (await _pChecker.IsGrantedAsync(ColPermissionName) == false)
                                {
                                    dt.Columns.RemoveAt(i);
                                    continue;
                                }
                            }


                            if (col.IsEntityKey)
                            {
                                dt.Columns[i].Unique = true;
                                dt.PrimaryKey = new DataColumn[] { dt.Columns[i] };
                            }
                        }


                    }
                }
            }
        }

        /// <summary>
        /// Permet d'adapter les types de données des paramètres et de controler les validations et regex de chaque paramètre
        /// </summary>
        /// <param name="sEntity"></param>
        /// <param name="dicoParams"></param>
        /// <returns></returns>
        private DynamicParameters GetEntityParametersForQuery(MagicEntity sEntity , Dictionary<string, object> dicoParams)
        {
            var parameters = new DynamicParameters(dicoParams);

            //S'il n'ya pas de paramètres alors sortir
            if (dicoParams.Count() == 0) return parameters;

            bool tenantHasBeenUpdated = false;

            //prendre la liste des variables configurées sur l'entité
            var variables = _magicEntityVariableRepository.GetAll().Where(v => v.EntityId == sEntity.Id);

            if (variables != null && variables.Count() >0)
            {
                foreach(var variable in variables){
                    if (variable.Name.ToLower() == "tenantid")
                    {
                        parameters.Add("@"+ variable.Name, (int?)AbpSession.TenantId, DbType.Int32, ParameterDirection.Input);
                        tenantHasBeenUpdated = true;
                    }
                    else
                    {
                        var value= dicoParams.ContainsKey(variable.Name)? dicoParams[variable.Name]: (Utils.ConvertToEntityTypeValue(variable.DataTypeId,null));
                        parameters.Add("@" + variable.Name, value, Utils.ConvertEntityTypeToDbType(variable.DataTypeId), ParameterDirection.Input);
                    }
                    
                }
            }

            if (dicoParams.ContainsKey("tenantId") && tenantHasBeenUpdated ==false)
            {                
                parameters.Add("@tenantId", (int?) AbpSession.TenantId, DbType.Int32, ParameterDirection.Input);
            }

            return parameters;
        }

        /// <summary>
        /// Retourne les informations du schema d'un entity. Attention il est important de bien configurer un entity pour pouvoir profiter de cette fonction
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<MagicDataObjectResult> GetEntitySchema( EntityDto<string> input)
        {
            //Rechercher l'entité dont le unique name a été passé
            var sEntity = await GetEntityById(input.Id, false, OperationType.Schema);

            //Créer l'objet MagicDataObjectResult (resultat à retourner à l'utilisateur)
            MagicDataObjectResult res = new MagicDataObjectResult();

            //Ajouter les groupes des fields de l'entité
            var fieldGroups = await _magicEntityFieldGroupRepository.GetAll().Where(eField => eField.EntityId == sEntity.Id).ToListAsync();

            if (fieldGroups != null && fieldGroups.Count() > 0)
            {
                res.FieldGroups = new List<MagicEntityFieldGroupDto>();
                foreach (var f in fieldGroups)
                {
                    res.FieldGroups.Add(ObjectMapper.Map<MagicEntityFieldGroupDto>(f));
                }
            }

            //Ajouter les fields de l'entité
            var fields = await _magicEntityFieldRepository.GetAll().Where(eField => eField.EntityId == sEntity.Id).ToListAsync();

            if (fields != null && fields.Count() > 0)
            {
                res.Fields = new List<MagicEntityFieldDto>();
                foreach (var f in fields)
                {
                    res.Fields.Add(ObjectMapper.Map<MagicEntityFieldDto>(f));
                }
            }

            //Ajouter les relations de l'entité
            var relations = await _magicEntityRelationRepository.GetAll().Where(r => r.EntityId == sEntity.Id || r.ChildEntityId == sEntity.Id).ToListAsync();

            if (relations != null && relations.Count() > 0)
            {
                res.Relations = new List<MagicEntityRelationDto>();
                foreach (var r in relations)
                {
                    res.Relations.Add(ObjectMapper.Map<MagicEntityRelationDto>(r));
                }
            }

            res.KeyFieldName = sEntity.IdFieldName;
            res.DisplayNameFieldName = sEntity.DisplayFieldName;
            res.ImageFieldName = sEntity.ImageFieldName;

            //Ajouter les variables dans le data
            var MagicEntityVariables = _magicEntityVariableRepository.GetAll()
                        .Where(e => e.EntityId == input.Id && e.IsActive == true);

            res.Data = MagicEntityVariables.ToList<MagicEntityVariable>();

            //retourner le data object result
            return res;
        }

        /// <summary>
        /// Récupérer une entité
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<MagicDataObjectResult> Get(GetMagicDataInput input)
         {
                      
			  //Rechercher l'entité dont le unique name a été passé
               var sEntity = await GetEntityById(input.EntityId, false, OperationType.Get);

            //Recupérer la chaine de connexion
            string conStr = await GetEntityConnectionString(sEntity);


            string sql = "";
            string filterString = "";
            var automatiqueFilterColumns = new List<string>();
            Dictionary<string, object> dicoParams = null;

            //Configurant l'ensemble des variables permettant de lancer la requete vers le serveur
            ConfigureEntityQueryElements(input, sEntity, ref sql, ref filterString, automatiqueFilterColumns, ref dicoParams, false, OperationType.Get);
                        
            //Créer les paramètres dapper
            var parameters = GetEntityParametersForQuery(sEntity, dicoParams);
                
            using (System.Data.Common.DbConnection myCon =DBUtils.GetConnectionFromConnectionString(conStr) )
            {
                    //var res = await myCon.QueryAsync<ExpandoObject>(sql, parameters);
                    //return new m res.ToList();

                    //Créer un datable
                using (DataTable dt = new DataTable(sEntity.Id))
                    {

                    try
                     {
                                                                       
                        //charger les données de la base
                        if (DBUtils.hasDbParameters(sql))
                        {
                            dt.Load(await myCon.ExecuteReaderAsync(sql, parameters));
                        }
                        else
                        {
                            //Pas de paramètres alors exécuter simplement le SQL
                            dt.Load(await myCon.ExecuteReaderAsync(sql));
                        }

                        //mettre a jour les colonnes du datatable selon la configuration du entity et les privilèges de l'utilisateur.
                        await UpdateDataTableColumns(input ,sEntity, dt, OperationType.Get);
                                                        

                            var tbToSend = dt;

                            //Filtrer si nécessaire et ne retourner que les colonnes dans la liste "Select" spécifiée dans le requestObject de l'utilisateur.
                            if (!input.FilterExpression.IsNullOrEmpty())
                            {
                                dt.DefaultView.RowFilter = input.FilterExpression;
                                if (input.Select != null && input.Select.Count > 0)
                                {
                                    tbToSend = dt.DefaultView.ToTable(dt.TableName, false, input.Select.ToArray());
                                }
                                else
                                {
                                    tbToSend = dt.DefaultView.ToTable(dt.TableName);
                                }
                            }
                            else
                            {
                                if (input.Select != null && input.Select.Count > 0)
                                {
                                    tbToSend = dt.DefaultView.ToTable(dt.TableName, false, input.Select.ToArray());
                                }
                            }


                            //Ordonner les enregistrements si cela a été demandé
                        if (!input.OrderBy.IsNullOrEmpty())
                        {
                            //Est de la forme "ItemIndex ASC, ItemValue DESC"
                            tbToSend.DefaultView.Sort = input.OrderBy;

                            tbToSend = tbToSend = dt.DefaultView.ToTable();                            
                        }

                        //Prendre le top si cela a été demandé pour limiter les enregistrements à retourner
                        if (input.Top.HasValue)
                        {
                            tbToSend = tbToSend.AsEnumerable().Take((int)input.Top).CopyToDataTable();                            
                        }
                        

                        //Créer l'objet MagicDataObjectResult (resultat à retourner à l'utilisateur)
                        MagicDataObjectResult res = new MagicDataObjectResult(tbToSend);

                            //Mettre à jour le keyFieldName lorsqu'il n'est pas calculé et qu'il est spécifié sur l'entity
                        if (!sEntity.IdFieldName.IsNullOrEmpty() && !sEntity.IdFieldName.ToString().Trim().StartsWith("=")) res.KeyFieldName = sEntity.IdFieldName;

                            //Mettre à jour le DisplayFieldName lorsqu'il n'est pas calculé et qu'il est spécifié sur l'entity
                        if (!sEntity.DisplayFieldName.IsNullOrEmpty() && !sEntity.DisplayFieldName.ToString().Trim().StartsWith("=")) res.DisplayNameFieldName = sEntity.DisplayFieldName;

                        //Vérifier si le schema de l'entité est demandé
                        if (input.AddSchema)
                        {
                            //Ajouter les groupes des fields de l'entité
                            var fieldGroups = await _magicEntityFieldGroupRepository.GetAll().Where(eField => eField.EntityId == sEntity.Id).ToListAsync();

                            if (fieldGroups != null && fieldGroups.Count() > 0)
                            {
                                res.FieldGroups = new List<MagicEntityFieldGroupDto>();
                                foreach (var f in fieldGroups)
                                {
                                    res.FieldGroups.Add(ObjectMapper.Map<MagicEntityFieldGroupDto>(f));
                                }
                            }

                            //Ajouter les fields de l'entité
                            var fields = await _magicEntityFieldRepository.GetAll().Where(eField => eField.EntityId == sEntity.Id).ToListAsync();

                            if (fields != null && fields.Count() >0)
                            {
                                res.Fields = new List<MagicEntityFieldDto>();
                                foreach (var f in fields)
                                {
                                    res.Fields.Add(ObjectMapper.Map<MagicEntityFieldDto>(f));
                                }
                            }

                            //Ajouter les relations de l'entité
                            var relations = await _magicEntityRelationRepository.GetAll().Where(r => r.EntityId == sEntity.Id || r.ChildEntityId == sEntity.Id).ToListAsync();

                            if (relations != null && relations.Count() > 0)
                            {
                                res.Relations = new List<MagicEntityRelationDto>();
                                foreach (var r in relations)
                                {
                                    res.Relations.Add(ObjectMapper.Map<MagicEntityRelationDto>(r));
                                }
                            }

                        }
                        
                        //Retourner le resultat                            
                        return res;

                    }
                    catch 
                    {
                            throw ;
                    }
                }
                                
             }            
                       
		}

        /// <summary>
        /// Permet de mettre à jour les informations des colonnes d'une ligne de données.
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="cols"></param>
        /// <param name="clientDr"></param>
        /// <param name="columnsToIgnore"></param>
        /// <param name="culture"></param>
        private void UpdateDataRowFromClientData(DataRow dr, List<DataColumn> cols, DataRow clientDr, List<string> columnsToIgnore, IFormatProvider culture = null)
        {
            var activeColName = "";

            dr.BeginEdit();
            for (var j = 0; j < dr.Table.Columns.Count; j++)
            {
                //Prendre le nom de la colonne active
                activeColName = dr.Table.Columns[j].ColumnName;

                //Passer à la colonne suivante, si la colonne actuelle doit être ignorée dans l'opération
                if (columnsToIgnore.Contains(activeColName)) continue;

                if (cols.Exists(x => x.ColumnName.ToLower() == activeColName.ToLower()))
                {
                    var col = cols.Find(x => x.ColumnName.ToLower() == activeColName.ToLower());
                    switch (activeColName.ToLower())
                    {
                        case "tenantid":
                            {
                                if (Utils.SafeData(dr[j]).Trim() == "") dr[j] = (int?)AbpSession.TenantId;
                                break;
                            }
                        case "userid":
                            {
                                dr[j] = AbpSession.UserId;
                                break;
                            }
                        case "creatoruserid":
                            {
                                if (Utils.SafeData(dr[j]).Trim() == "") dr[j] = AbpSession.UserId;
                                break;
                            }
                        case "creationtime":
                            {
                                if (Utils.SafeData(dr[j]).Trim() == "") dr[j] = DateTime.Now;
                                break;
                            }
                        case "lastmodifieruserid":
                            {
                                dr[j] = AbpSession.UserId;
                                break;
                            }
                        case "lastmodificationtime":
                            {
                                dr[j] = DateTime.Now;
                                break;
                            }
                        default:
                            {
                                //vérifier le cas des null et chaines vides
                                if (clientDr[col.ColumnName] == null || Utils.SafeData(clientDr[col.ColumnName]).Trim() == "")
                                {
                                    dr[j] = DBNull.Value;
                                }
                                else
                                {
                                    var valeur = clientDr[col.ColumnName];

                                    if (Utils.UpdateObjectByDbDataType(dr[j], dr.Table.Columns[j].DataType.ToString(), valeur, culture) == false)
                                    {
                                        //il y'a eu erreur lors de la mise à jour du champ
                                        throw new Exception(string.Format(L("ErrorSavingData"), col.ColumnName));
                                    }                                    
                                }
                                break; 
                            }
                        
                    }
                    

                }

            }
            dr.EndEdit();
        }

        /// <summary>
        /// Permet de retourner la liste des champs à ignorer suivant l'opération de modification à réaliser
        /// </summary>
        /// <param name="opType">Type d'opération Insert, Update</param>
        /// <param name="sEntity">Entité</param>
        /// <returns></returns>
        private List<string> GetCRUDOperationsIgnoreFields(OperationType opType, MagicEntity sEntity)
        {
            //Liste des colonnes à ignorer dans la modification des données
            List<string> columnsToIgnore = new List<string>();
            if (opType == OperationType.Insert && Utils.SafeData(sEntity.InsertOnlyIgnoreFields).Trim() != "")
            {
                columnsToIgnore.AddRange(sEntity.InsertOnlyIgnoreFields.Split(","));
            }
            else
            {
                if (opType == OperationType.Update && Utils.SafeData(sEntity.UpdateOnlyIgnoreFields).Trim() != "")
                {
                    columnsToIgnore.AddRange(sEntity.UpdateOnlyIgnoreFields.Split(","));
                }
            }
            if (Utils.SafeData(sEntity.CrudIgnoreFields).Trim() != "")
            {
                columnsToIgnore.AddRange(sEntity.CrudIgnoreFields.Split(","));
            }

            return columnsToIgnore;
        }


        

        /// <summary>
        /// Permet de retourner la chaine de connexion adéquate en fonction du paramétrage de l'entité passée en argument
        /// </summary>
        /// <param name="sEntity"></param>
        /// <returns></returns>
        private async Task<string> GetEntityConnectionString(MagicEntity sEntity)
        {
            string conStr = "";

            if (Utils.SafeData(sEntity.ConnectionName).Trim() != "")
            {
                //Recupérer la chaine de connection si l'entité est liée à une connexion autre que la principale du tenant
                var solCon = await _magicSolutionConnectionRepository.FirstOrDefaultAsync(item => item.Id == sEntity.ConnectionName && item.SolutionId == sEntity.SolutionId);

                if (solCon != null) conStr = SimpleStringCipher.Instance.Decrypt(solCon.ConnectionString);
            }
            else
            {
                if (Utils.SafeData(AbpSession.TenantId).Trim() == "")
                {
                    //Recupérer la chaine de connexion du host qui est la connexion par défaut de l'application
                    conStr = _config.DefaultNameOrConnectionString;// DBUtils.GetConnectionStringFromAppSettings(_config);
                }
                else
                {
                    //Si l'entity ne doit etre visible que par le host retourner erreur accès interdit!
                    if (sEntity.IsHostEntity)
                    {
                        throw new UnauthorizedAccessException();
                    }

                    //Recupérer la chaine de connexion du tenant
                    var tenantCacheItem = _tenantCache.Get(AbpSession.TenantId.Value);
                    if (tenantCacheItem.ConnectionString.IsNullOrEmpty())
                    {
                        //Le Tenant n'a pas de connexion dédiée donc utiliser celle du host qui est la connexion par défaut de l'application
                        conStr = _config.DefaultNameOrConnectionString; // DBUtils.GetConnectionStringFromAppSettings(_config);
                    }
                    else
                    {
                        conStr = tenantCacheItem.ConnectionString;
                    }
                }

            }

            //Retourner la chaine de connexion
            return conStr;
        }

        /// <summary>
        /// Configurer les différente variable nécessaire à lancer la requète vers le serveur
        /// </summary>
        /// <param name="requestInput"></param>
        /// <param name="sEntity"></param>
        /// <param name="sql"></param>
        /// <param name="filterString"></param>
        /// <param name="automatiqueFilterColumns"></param>
        /// <param name="dicoParams"></param>
        /// <param name="forEntitySourceColumnsInfo"></param>
        /// <param name="opType">Type d'opération : Get, Insert, Update ...</param>
        private void  ConfigureEntityQueryElements(object requestInput, MagicEntity sEntity, ref string sql, ref string filterString, List<string> automatiqueFilterColumns, ref Dictionary<string, object> dicoParams, bool forEntitySourceColumnsInfo, OperationType opType)
        {
                        
            //Impossible de retourner les données d'un entité ne contenant aucune valeur pour DbTableOrViewName and DefaultSelectSql. Sortir
            if (Utils.SafeData(sEntity.DefaultSelectSql) == "" && Utils.SafeData(sEntity.DbTableOrViewName) == "") throw new UserFriendlyException(L("EntityDbTableOrViewNameAndDefaultSelectSqlNull"));

            //Récupérer le sQL de sélection
            var tableOrViewName = sEntity.DbTableOrViewName;
            //Vérifier si le nom de la table ou vue nécessite une adaptation
            if (Utils.SafeData(tableOrViewName) != "")
            {
                if (tableOrViewName.StartsWith("\"") || tableOrViewName.StartsWith("[") || tableOrViewName.Contains("."))
                {
                    //ne rien faire car le nom contient déja un encadreur ou le schema aussi
                }
                else
                {
                    tableOrViewName = "\"" + tableOrViewName + "\"";
                }
            }
            sql = (Utils.SafeData(sEntity.DefaultSelectSql) != "") ? sEntity.DefaultSelectSql : string.Format("select * from {0} ", tableOrViewName );

            //Vérifier si un autre sal doit être utilisé suivant l'opération demandée
            if (opType != OperationType.Get)
            {
                //Vérifier si sql spécifique est utilisé pour la génération des commandes CRUD
                if (Utils.SafeData(sEntity.AutoGenCrudSelectSql).Trim() != "" && sEntity.AutoGenCrudSql)
                {
                    sql = sEntity.AutoGenCrudSelectSql;
                }

                switch (opType)
                {
                    case OperationType.Insert:
                        {
                            if (Utils.SafeData(sEntity.InsertSql).Trim() != "")
                            {
                                sql = sEntity.InsertSql;
                            }
                            break;
                        }
                    case OperationType.Update:
                        {
                            if (Utils.SafeData(sEntity.UpdateSql).Trim() != "")
                            {
                                sql = sEntity.UpdateSql;
                            }
                            break;
                        }
                    case OperationType.Delete:
                        {
                            if (Utils.SafeData(sEntity.DeleteSql).Trim() != "")
                            {
                                sql = sEntity.DeleteSql;
                            }
                            else
                            {
                                sql = string.Format("delete * from {0} ", tableOrViewName);
                            }
                            break;
                        }
                }
            }
            

            filterString = "";
            dicoParams = DBUtils.GetDbParametersFromString(sql);
            
            var input =(requestInput.GetType() == typeof (GetEntitySourceColumnsInfoMagicDataInput))? ( new GetMagicDataInput() { EntityId= sEntity.Id }) : (GetMagicDataInput)requestInput;

            //Mettre à jour les paramètres du SQL depuis les valeurs envoyées
            if (forEntitySourceColumnsInfo == false)
            {
                
                if (input.KeyValuePairs != null && input.KeyValuePairs.Count > 0)
                {
                    for (var i = 0; i < dicoParams.Count; i++)
                    {
                        var item = dicoParams.ElementAt(i);
                        if (input.KeyValuePairs.ContainsKey(item.Key)) dicoParams[item.Key] = input.KeyValuePairs[item.Key];
                    }
                }
            }
            


            if (!sEntity.IsDefaultSelectSqlSP)
            {
                //filtrer suivant le tenant si nécessaire
                if (sEntity.MayHaveTenant)
                {
                    if (dicoParams.ContainsKey("tenantId"))
                    {
                        dicoParams["tenantId"] = (int?)AbpSession.TenantId;
                    }
                    else
                    {
                        dicoParams.Add("tenantId", (int?)AbpSession.TenantId);

                        //ajouter la colonne de filtre automatique
                        automatiqueFilterColumns.Add("tenantid");
                        //Ajouter le filtre de tenant dans la requète
                        if (AbpSession.TenantId != null)
                        {
                            filterString = String.IsNullOrEmpty(filterString) ? " TenantId=@tenantId " : " AND TenantId=@tenantId ";
                        }
                        else
                        {
                            filterString = String.IsNullOrEmpty(filterString) ? " TenantId IS NULL " : " AND TenantId IS NULL ";
                        }

                    }
                }

                //Vérifier si on l'identifiant d'un enregistrement spécifique est fourni
                if (Utils.SafeData(input.DataId).Trim() != "" && Utils.SafeData(sEntity.IdFieldName).Trim() != "")
                {
                    //si le dictionnaire contient une variable égale au nom du champ Id alors l'utiliser
                    if (dicoParams.ContainsKey(sEntity.IdFieldName))
                    {
                        dicoParams[sEntity.IdFieldName] = input.DataId;
                    }
                    else
                    {
                        dicoParams.Add("iamDataId", input.DataId);

                        //ajouter la colonne de filtre automatique
                        automatiqueFilterColumns.Add(sEntity.IdFieldName);

                        var IdFieldNameCorrectedForSQL = sEntity.IdFieldName;
                        if (IdFieldNameCorrectedForSQL.StartsWith("\"") || IdFieldNameCorrectedForSQL.StartsWith("[") || IdFieldNameCorrectedForSQL.Contains("."))
                        {
                            //ne rien faire car le nom contient déja un encadreur ou le schema aussi
                        }
                        else
                        {
                            IdFieldNameCorrectedForSQL = "\"" + IdFieldNameCorrectedForSQL + "\"";
                        }

                        //filtrer suivant l'identifiant
                        filterString = String.IsNullOrEmpty(filterString) ? " " + IdFieldNameCorrectedForSQL + "=@iamDataId " : " AND " + IdFieldNameCorrectedForSQL + "=@iamDataId ";

                    }
                    
                }

                if (forEntitySourceColumnsInfo ==false)
                {
                    ////Filtrer suivant le niveau de sécurité
                    //if (sEntity.UseSecurityLevel && !sEntity.SecurityLevelFieldName.IsNullOrEmpty())
                    //{

                    //    dicoParams.Add("userSecurityLevel", (int?)AbpSession.TenantId);
                    //    filterString = String.IsNullOrEmpty(filterString) ? $" {sEntity.SecurityLevelFieldName}= @userSecurityLevel " : $" AND {sEntity.SecurityLevelFieldName}=@userSecurityLevel ";
                    //}


                    //Filtrer pour donner accès aux informations confidentielles
                    if (sEntity.UseConfidentiality && !sEntity.ConfidentialityFieldName.IsNullOrEmpty())
                    {

                    }

                }

                //recupérer le user actif
                var user =  _userManager.GetUserById(AbpSession.UserId.Value);
                
                //Filtrer les données pour limiter les accès
                switch (sEntity.DataOwnerShipId)
                {
                    case "ORGINIZATION_UNIT"://les éléments rattaché au service/direction de l'utilisateur et aux services/directions enfants
                        {
                            
                            var organizationUnits =  _userManager.GetOrganizationUnits(user);
                            var organizationUnitCodes = organizationUnits.Select(ou => ou.Code).ToList();

                            var predicate = PredicateBuilder.New<OrganizationUnit>();
                            foreach (var code in organizationUnitCodes)
                            {
                                predicate = predicate.Or(ou => ou.Code.StartsWith(code));
                            }

                            var organizationUnitIds =  _organizationUnitRepository.GetAll().Where(predicate).Select(ou => ou.Id).ToList();

                            if (dicoParams.ContainsKey("organizationUnitId"))
                            {
                                dicoParams["organizationUnitId"] = organizationUnitIds;
                            }
                            else
                            {
                                //ajouter la colonne de filtre automatique. tout en miniscule
                                automatiqueFilterColumns.Add("organizationunitid");

                                dicoParams.Add("organizationUnitId", organizationUnitIds);
                                if (AbpSession.UserId != null)
                                {

                                    filterString = String.IsNullOrEmpty(filterString) ? " OrganizationUnitId IN @organizationUnitId " : " AND OrganizationUnitId IN @organizationUnitId ";
                                }
                                else
                                {
                                    filterString = String.IsNullOrEmpty(filterString) ? " OrganizationUnitId IS NULL " : " AND OrganizationUnitId IS NULL ";
                                }
                            }
                            break;
                        }
                    case "TEAM":
                        {
                            //if (dicoParams.ContainsKey("teamId"))
                            //{
                            //    dicoParams["teamId"] = AbpSession.UserId;
                            //}
                            //else
                            //{
                            //    //ajouter la colonne de filtre automatique
                            //    automatiqueFilterColumns.Add("teamId");

                            //    dicoParams.Add("teamId", AbpSession.UserId);
                            //    if (AbpSession.UserId != null)
                            //    {

                            //        filterString = String.IsNullOrEmpty(filterString) ? " TeamId=@teamId " : " AND TeamId=@teamId ";
                            //    }
                            //    else
                            //    {
                            //        filterString = String.IsNullOrEmpty(filterString) ? " TeamId IS NULL " : " AND TeamId IS NULL ";
                            //    }
                            //}
                            break;
                        }
                    case "USER":
                        {
                            if (dicoParams.ContainsKey("userId"))
                            {
                                dicoParams["userId"] = AbpSession.UserId;
                            }
                            else
                            {
                                //ajouter la colonne de filtre automatique
                                automatiqueFilterColumns.Add("userid");

                                dicoParams.Add("userId", AbpSession.UserId);
                                if (AbpSession.UserId != null)
                                {

                                    filterString = String.IsNullOrEmpty(filterString) ? " UserId=@userId " : " AND UserId=@userId ";
                                }
                                else
                                {
                                    filterString = String.IsNullOrEmpty(filterString) ? " UserId IS NULL " : " AND UserId IS NULL ";
                                }
                            }


                            break;
                        }
                    default:
                        break;
                }

            }
            else
            {

                //filtrer suivant le tenant si nécessaire
                if (sEntity.MayHaveTenant)
                {

                    if (dicoParams.ContainsKey("tenantId") == false)
                    {
                        if (AbpSession.TenantId != null)
                        {
                            dicoParams["tenantId"] = (int?)AbpSession.TenantId;
                        }
                        else
                        {
                            dicoParams["tenantId"] = (int?)null;
                        }

                    }
                    else
                    {

                        if (AbpSession.TenantId != null)
                        {
                            dicoParams.Add("tenantId", (int?)AbpSession.TenantId);
                        }
                        else
                        {
                            dicoParams.Add("tenantId", (int?)null);
                        }
                    }
                }
            }

            //gestion des informations liées à l'utilisateur
            if (dicoParams.ContainsKey("userId"))
            {
                dicoParams["userId"] = AbpSession.UserId;
            }
            if (dicoParams.ContainsKey("tenantId"))
            {
                if (AbpSession.TenantId != null)
                {
                    dicoParams["tenantId"] = (int?)AbpSession.TenantId;
                }
                else
                {
                    dicoParams["tenantId"] = (int?)null;
                }

            }



            if (Utils.SafeData(filterString) == "")
            {
                //Encapsuler le SQL dans un select afin d'éviter les problèmes
                if (forEntitySourceColumnsInfo)
                {
                    sql = "SELECT * FROM (" + sql + ") AS DATA WHERE 1=2 ";
                }
                
            }
            else
            {
                //Vérifier que les colonnes automatiques dans le filterString sont aussi dans le sql
                var isAutomaticColumnInSQL = true;

                for (var i = 0; i < automatiqueFilterColumns.Count; i++)
                {
                    if (sql.ToLower().Contains(automatiqueFilterColumns[i]) == false)
                    {
                        isAutomaticColumnInSQL = false;
                        break;
                    }
                }

                if (isAutomaticColumnInSQL)
                {
                    //Encapsuler le SQL dans un select afin d'éviter les problèmes
                    if (forEntitySourceColumnsInfo)
                    {
                        sql = "SELECT * FROM (" + sql + ") AS DATA WHERE 1=2 AND " + filterString;
                    }
                    else
                    {
                        sql = "SELECT * FROM (" + sql + ") AS T WHERE " + filterString;
                    }

                }
                else
                {
                    //certaines colonnes automatiques n'existent pas dans le sql. If faut donc directement completer le sql source en concatenant le filtre

                    //Vérifier si la condition WHERE existe déjà dans le SQL
                    if (forEntitySourceColumnsInfo)
                    {
                        //On ne doit retourner qu'un enregistrement vide en vue de récupérer la configuration des colonnes
                        if (Utils.HasWholeWord(sql, "where", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                        {
                            //Condition Where exite dans le sql donc ajouter "AND3
                            sql += " AND 1=2 AND " + filterString;
                        }
                        else
                        {
                            //condition where non existante dans le sql donc ajouter WHERE
                            sql += " WHERE 1=2 AND " + filterString;
                        }
                    }
                    else
                    {
                        if (Utils.HasWholeWord(sql, "where", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                        {
                            //Condition Where exite dans le sql donc ajouter "AND3
                            sql += " AND " + filterString;
                        }
                        else
                        {
                            //condition where non existante dans le sql donc ajouter WHERE
                            sql += " WHERE " + filterString;
                        }
                    }

                }
            }
            

        }

        /// <summary>
        /// Permet de retourner l'entité recherchée depuis son id mais aussi vérifie si l'utilisateur a les privilèges d'accéder à cet entité
        /// </summary>
        /// <param name="id">Identifiant de l'entité</param>
        /// <param name="checkUserEntityModificationAbility">Doit être false pour les fonctions de lecture des données de l'entité et true pour les fonctions de modification de la structure de l'entité</param>
        /// <param name="opType">Type d'opération : Get, Insert, Update ...</param>
        /// <returns></returns>
        private async Task<MagicEntity> GetEntityById(string id, bool checkUserEntityModificationAbility, OperationType opType)
        {
            //Rechercher l'entité dont le unique name a été passé
            var sEntity = await _magicEntityRepository.FirstOrDefaultAsync(entity => entity.Id == id);

            if (sEntity == null) throw new EntityNotFoundException();

                       
            if (checkUserEntityModificationAbility)
            {
                //Vérifier que l'utilisateur à le droit de modifier la configuration de cette entité (il est donc owner ou administrateur de la solution à laquelle appartient l'entité 
                if (await _magicSolutionRepository.CountAsync(s => s.Id == sEntity.SolutionId && s.OwnerId == AbpSession.UserId) == 0 && await _magicSolutionAdministratorRepository.CountAsync(sa => sa.SolutionId == sEntity.SolutionId && sa.UserId == AbpSession.UserId) == 0)
                {
                    throw new UnauthorizedAccessException();
                }
            }

            //Vérifier les droits(permissions de l''utilisateur)                
            if (!sEntity.AccessPermissionName.IsNullOrEmpty() && sEntity.DataOwnerShipId != "PUBLIC")
            {
                var isGranted = await _pChecker.IsGrantedAsync(sEntity.AccessPermissionName);
                //l'utilisateur n'a pas accès a cet entity alors sortir en signifiant l'erreur
                if (isGranted == false) throw new UnauthorizedAccessException();
            }

            //Vérifier les droits(permissions de l''utilisateur) en cas de création d'enregistrement
            switch (opType)
            {
                case OperationType.Insert:
                    {

                        //l'insertion est interdite sur l'entité donc sortir en signifiant l'erreur
                        if (!sEntity.AllowInsert) throw new UnauthorizedAccessException();

                        if (!sEntity.CreatePermissionName.IsNullOrEmpty())
                        {
                            var isGranted = await _pChecker.IsGrantedAsync(sEntity.CreatePermissionName);
                            //l'utilisateur n'a pas accès a cet entity alors sortir en signifiant l'erreur
                            if (isGranted == false) throw new UnauthorizedAccessException();
                        
                        }
                        else
                        {
                                //vérifier la permission d'edition si elle existe
                                if (!sEntity.EditPermissionName.IsNullOrEmpty())
                                {
                                    var isGranted = await _pChecker.IsGrantedAsync(sEntity.EditPermissionName);
                                    //l'utilisateur n'a pas accès a cet entity alors sortir en signifiant l'erreur
                                    if (isGranted == false) throw new UnauthorizedAccessException();
                                }
                        }
                        break;
                    }

                case OperationType.Update:
                    {
                        //l'insertion est interdite sur l'entité donc sortir en signifiant l'erreur
                        if (!sEntity.AllowUpdate) throw new UnauthorizedAccessException();

                        if (!sEntity.EditPermissionName.IsNullOrEmpty())
                        {
                            var isGranted = await _pChecker.IsGrantedAsync(sEntity.EditPermissionName);
                            //l'utilisateur n'a pas accès a cet entity alors sortir en signifiant l'erreur
                            if (isGranted == false) throw new UnauthorizedAccessException();
                        }
                        break;
                    }

                case OperationType.Delete:
                    {
                        //l'insertion est interdite sur l'entité donc sortir en signifiant l'erreur
                        if (!sEntity.AllowDelete) throw new UnauthorizedAccessException();

                        if (!sEntity.DeletePermissionName.IsNullOrEmpty())
                        {
                            var isGranted = await _pChecker.IsGrantedAsync(sEntity.DeletePermissionName);
                            //l'utilisateur n'a pas accès a cet entity alors sortir en signifiant l'erreur
                            if (isGranted == false) throw new UnauthorizedAccessException();
                        }
                        else
                        {
                            //vérifier la permission d'edition si elle existe
                            if (!sEntity.EditPermissionName.IsNullOrEmpty())
                            {
                                var isGranted = await _pChecker.IsGrantedAsync(sEntity.EditPermissionName);
                                //l'utilisateur n'a pas accès a cet entity alors sortir en signifiant l'erreur
                                if (isGranted == false) throw new UnauthorizedAccessException();
                            }
                        }
                        break;
                    }

            }
            
            return sEntity;
        }

        /// <summary>
        /// Permet de retourner la liste des colonnes disponibles dans la source de données liées à un entity généralement pour la configuration des fields
        /// </summary>
        /// <param name="input">UniqueName de l'entity recherché</param>
        /// <returns></returns>
        public async Task<MagicDataObjectResult> GetEntitySourceColumnsInfo(GetEntitySourceColumnsInfoMagicDataInput input)
        {

            //Rechercher l'entité dont le unique name a été passé
            var sEntity = await GetEntityById(input.EntityId, true, OperationType.Get);        

            //Recupérer la chaine de connexion
            string conStr =  await GetEntityConnectionString(sEntity);

            string sql = "";
            string filterString = "";
            var automatiqueFilterColumns = new List<string>();
            Dictionary<string, object> dicoParams = null;

            //Configurant l'ensemble des variables permettant de lancer la requete vers le serveur
            ConfigureEntityQueryElements(input, sEntity, ref sql, ref filterString, automatiqueFilterColumns, ref dicoParams, true, OperationType.Get);

            //Créer les paramètres dapper
            var parameters = new DynamicParameters(dicoParams);

            using (System.Data.Common.DbConnection myCon = DBUtils.GetConnectionFromConnectionString(conStr))
            {
                //var res = await myCon.QueryAsync<ExpandoObject>(sql, parameters);
                //return new m res.ToList();

                //Créer un datable
                using (DataTable dt = new DataTable(sEntity.Id))
                {

                    try
                    {                        
                        //charger les données de la base
                        if (DBUtils.hasDbParameters(sql))
                        {
                            dt.Load(await myCon.ExecuteReaderAsync(sql, parameters));
                        }
                        else
                        {
                            //Pas de paramètres alors exécuter simplement le SQL
                            dt.Load(await myCon.ExecuteReaderAsync(sql));
                        }

                        //Essayer de créer une nouvelle colonne pour le KeyField au cas ou il est calculé de façon précise dans la requestObject ce qui override tout calcul précédent
                        if (!sEntity.IdFieldName.IsNullOrEmpty() && sEntity.IdFieldName.ToString().Trim().StartsWith("="))
                        {
                            var formula = sEntity.IdFieldName.ToString().Trim().Substring(1);

                            if (!dt.Columns.Contains("iamCalculatedKey"))
                            {
                                dt.Columns.Add("iamCalculatedKey", typeof(string), formula);
                            }
                            else
                            {
                                dt.Columns["iamCalculatedKey"].Expression = formula;
                            }
                        }

                        //Essayer de créer une nouvelle colonne pour le KeyField au cas ou il est calculé de façon précise dans la requestObject ce qui override tout calcul précédent
                        if (!sEntity.DisplayFieldName.IsNullOrEmpty() && sEntity.DisplayFieldName.ToString().Trim().StartsWith("="))
                        {
                            var formula = sEntity.DisplayFieldName.ToString().Trim().Substring(1);

                            if (!dt.Columns.Contains("iamCalculatedDisplayName"))
                            {
                                dt.Columns.Add("iamCalculatedDisplayName", typeof(string), formula);
                            }
                            else
                            {
                                dt.Columns["iamCalculatedDisplayName"].Expression = formula;
                            }
                        }



                        DataTable tbToSend = new DataTable("EntitySchema");
                        tbToSend.Columns.Add(new DataColumn("columnName", typeof(string)));
                        tbToSend.Columns.Add(new DataColumn("dataType", typeof(string)));
                        tbToSend.Columns.Add(new DataColumn("readOnly", typeof(bool)));
                        tbToSend.Columns.Add(new DataColumn("required", typeof(bool)));
                        tbToSend.Columns.Add(new DataColumn("maxLength", typeof(int)));
                        tbToSend.Columns.Add(new DataColumn("autoIncrement", typeof(bool)));
                        tbToSend.Columns.Add(new DataColumn("unique", typeof(bool)));

                        //Parcourir les colonnes du SQL de l'entity afin de récupérer leurs caractéristiques
                        for (var i = 0; i < dt.Columns.Count ; i++)
                        {
                            //Créer la ligne des infos de  la colonne
                            DataRow dr = tbToSend.NewRow();

                            dr["columnName"] = dt.Columns[i].ColumnName;
                            dr["dataType"] = dt.Columns[i].DataType.ToString();
                            dr["readOnly"] = dt.Columns[i].ReadOnly;
                            dr["required"] = !dt.Columns[i].AllowDBNull;//prendre la valeur opposée
                            dr["maxLength"] = dt.Columns[i].MaxLength;
                            dr["autoIncrement"] = dt.Columns[i].AutoIncrement;
                            dr["unique"] = dt.Columns[i].Unique;

                            if (dt.Columns[i].ColumnName == "iamCalculatedKey" || dt.Columns[i].ColumnName == "iamCalculatedDisplayName")
                            {
                                dr["readOnly"] = true;
                            }

                            //Ajouter la ligne a la table à renvoyer a l'utilisateur
                            tbToSend.Rows.Add(dr);
                        }

                        //Créer l'objet MagicDataObjectResult (resultat à retourner à l'utilisateur)
                        MagicDataObjectResult res = new MagicDataObjectResult(tbToSend);
                        res.TotalCount = tbToSend.Rows.Count;

                        //Mettre à jour le keyFieldName lorsqu'il n'est pas calculé et qu'il est spécifié sur l'entity
                        if (!sEntity.IdFieldName.IsNullOrEmpty() && !sEntity.IdFieldName.Trim().StartsWith("=")) res.KeyFieldName = sEntity.IdFieldName;

                        //Mettre à jour le DisplayFieldName lorsqu'il n'est pas calculé et qu'il est spécifié sur l'entity
                        if (!sEntity.DisplayFieldName.IsNullOrEmpty() && !sEntity.DisplayFieldName.ToString().Trim().StartsWith("=")) res.DisplayNameFieldName = sEntity.DisplayFieldName;

                        //Vérifier si l'on doit mettre à jour la liste des fields de l'entité directement
                        if (input.UpdateEntityFields)
                        {

                            //Prendre la liste des fields de l'entity qui existent déjà.
                            var configFields = await _magicEntityFieldRepository.GetAll().Where(eField => eField.EntityId == sEntity.Id).ToListAsync();

                            //Parcourir les lignes des informations sur les colonnes de la source
                            for (var i = 0; i < tbToSend.Rows.Count; i++)
                            {
                                DataRow dr = tbToSend.Rows[i];
                                string colName = dr["columnName"].ToString();

                                //Vérifier si la colonne existe déjà dans les élements configurés
                                if (configFields.Any(x => x.DbFieldName == colName) == false)
                                {
                                    MagicEntityField newField = new MagicEntityField() {Id= sEntity.Id + "_" + colName, EntityId = sEntity.Id, RequirementId = "O", DbFieldName = colName, Name = colName, LocalizationName = colName, DataTypeId = Utils.ConvertDbTypeToEntityType(dr["columnName"].ToString(), (int)dr["maxLength"]), IsEntityKey = false, IsSearchable = true, ShowInAdvancedSearch = false, ReadOnly = (bool)dr["readOnly"] };

                                    if ((bool)dr["required"]) newField.RequirementId = "R";//Required
                                    if (colName.ToLower() == res.KeyFieldName.ToLower()) newField.IsEntityKey = true;

                                    if (AbpSession.TenantId != null)
                                    {
                                        newField.TenantId = (int?)AbpSession.TenantId;
                                    }
                                    //Ajouter le newField dans la base
                                    await _magicEntityFieldRepository.InsertAsync(newField);
                                }

                            }

                            CurrentUnitOfWork.SaveChanges();
                        }
                        
                        //Retourner le resultat
                        return res;

                    }
                    catch 
                    {
                        throw ;
                    }
                }

            }


        }

        /// <summary>
        /// Retourne la liste des variables liées à l'entité dont l'id est passée en paramètre.
        /// </summary>
        /// <param name="input"> objet contenant la propriété Id = Identifiant de l'entity contenant les Fields</param>
        /// <returns></returns>
        public async Task<MagicDataObjectResult> GetEntityVariables(EntityDto<string> input)
        {
            var MagicEntityVariables = _magicEntityVariableRepository.GetAll()                        
                        .Where(e => e.EntityId == input.Id && e.IsActive == true);
           

            var totalCount = await MagicEntityVariables.CountAsync();

            MagicDataObjectResult res = new MagicDataObjectResult() { Data = MagicEntityVariables.ToList<MagicEntityVariable>(), TotalCount = totalCount, KeyFieldName = "Name", DisplayNameFieldName = "Name" };
            return res;
        }

        /// <summary>
        /// Retourne la liste des variables inclus dans le sql d'une entité. Attention les variables tenantId et userId ne sont pas retourner ni créées comme variables 
        /// car elles sont  automatiquement attribuées par le sytème et il n'est donc pas nécessaire de les demander à l'utilisateur ou comme argurment de MagicData
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<MagicDataObjectResult> GetEntitySourceVariablesInfo(GetEntitySourceVariablesInfoMagicDataInput input)
        {
            //Rechercher l'entité dont le unique name a été passé
            var sEntity = await GetEntityById(input.EntityId, true, OperationType.Get);

            var res = new MagicDataObjectResult();

            if (Utils.SafeData(sEntity.DefaultSelectSql) == "")
            {
                res.InformationMessage = L("NoVariablesForThisEntity");
                return res;
            }

            //Récupérer la liste des variables de la requète s'il y'en a
            Dictionary<string, object>  dicoParams = DBUtils.GetDbParametersFromString(sEntity.DefaultSelectSql);
            
            if (dicoParams != null && dicoParams.Count > 0)
            {
                var variablesList = new List<MagicEntityVariable>();
                //Charger la configuration des colonnes sources pour déterminer les types de données des paramètres
                GetEntitySourceColumnsInfoMagicDataInput colInfosInput = new GetEntitySourceColumnsInfoMagicDataInput() { EntityId = sEntity.Id, UpdateEntityFields = false };
                MagicDataObjectResult columnsInfosRes = await GetEntitySourceColumnsInfo(colInfosInput);
                
                //parcourir la liste des paramètres
                foreach (var key in dicoParams.Keys)
                {
                    if (key != "tenantId" && key != "userId")
                    {
                        var variableId = sEntity.Id + "_" + key;
                        MagicEntityVariable variable = new MagicEntityVariable() { Id = variableId, Name = key, EntityId = sEntity.Id, IsActive = true, IsRequired = false, DataTypeId = "SMALLTEXT" };

                        if (AbpSession.TenantId != null)
                        {
                            variable.TenantId = (int?)AbpSession.TenantId;
                        }

                        if (columnsInfosRes.Data != null)
                        {
                            DataTable tbToSend = (DataTable)columnsInfosRes.Data;

                            //Parcourir les lignes des informations sur les colonnes de la source
                            for (var i = 0; i < tbToSend.Rows.Count; i++)
                            {
                                DataRow dr = tbToSend.Rows[i];
                                string colName = dr["columnName"].ToString();

                                //Vérifier si la colonne existe déjà dans les élements configurés
                                if (key.ToLower() == colName.ToLower())
                                {
                                    variable.DataTypeId = Utils.ConvertDbTypeToEntityType(dr["columnName"].ToString(), (int)dr["maxLength"]);
                                    if ((bool)dr["required"]) variable.IsRequired = true;//Required                                                                
                                }
                            }
                        }

                        if (input.UpdateEntityVariables)
                        {
                            //Désactiver le filtre des soft delete
                            CurrentUnitOfWork.DisableFilter(AbpDataFilters.SoftDelete);

                            //Ajouter seulement si la variable n'existe pas déjà dans la base pour l'entité
                            if (_magicEntityVariableRepository.Count(v => v.Id == variableId ) == 0)
                            {
                                //Ajouter la variable dans la base
                                await _magicEntityVariableRepository.InsertAsync(variable);
                            }
                            else
                            {
                                
                                var softDeletedVariable = await _magicEntityVariableRepository.GetAsync(variableId);
                                softDeletedVariable.IsDeleted = false;                                
                                softDeletedVariable.DeletionTime = null;
                                softDeletedVariable.DeleterUserId = null;

                                softDeletedVariable.IsActive = true;
                                softDeletedVariable.DataTypeId = variable.DataTypeId;
                                softDeletedVariable.IsRequired = variable.IsRequired;

                                await _magicEntityVariableRepository.UpdateAsync(softDeletedVariable);
                            }
                                
                        }

                        //Ajouter la variable a la liste
                        variablesList.Add(variable);
                    }
                    
                }

                if (input.UpdateEntityVariables)
                {
                    //Accepter les modifications dans la base
                    CurrentUnitOfWork.SaveChanges();

                    //Reactiver le filtre des soft delete
                    CurrentUnitOfWork.EnableFilter(AbpDataFilters.SoftDelete);
                }                

                res.Data = variablesList;
            }
            else
            {
                res.InformationMessage = L("NoVariablesForThisEntity");
            }

            return res;
        }

        /// <summary>
        /// Recupérer une liste de plusieurs entité en une seule fois
        /// </summary>
        /// <param name="input">Liste de magicDataRequestObject </param>
        /// <returns></returns>
        public async Task<List<MagicDataObjectResult>> GetEntities(GetEntitiesMagicDataInput input)
        {
            var myList = new List<MagicDataObjectResult>();
            var entities = (List<GetMagicDataInput>)input.Entities;

            for(var i=0; i< entities.Count; i++)
            {
                try
                {
                    myList.Add(await Get(entities[i]));
                }
                catch
                {
                    if (input.RejectAllOnError)
                    {
                        throw ;
                    }
                    else
                    {
                        myList.Add( new MagicDataObjectResult( string.Format(L("ErrorGettingEntity"), entities[i].EntityId)));
                    }
                    
                }
            }
            //Retourner la liste des objets
            return myList;
        }


        /// <summary>
        /// Permet la création ou la modification des données d'un enregistrement d'une entité
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<MagicDataObjectResult> CreateOrEdit(CreateOrEditMagicDataInput input)
        {
            
            //Rechercher l'entité dont le unique name a été passé
            var sEntity = await GetEntityById(input.EntityId, false, OperationType.Insert);

            //Recupérer la chaine de connexion
            string conStr = await GetEntityConnectionString(sEntity);

            string sql = "";
            string filterString = "";
            var automatiqueFilterColumns = new List<string>();
            Dictionary<string, object> dicoParams = null;

            OperationType opType = OperationType.Insert;
            if (Utils.SafeData(input.DataId).Trim() == "")
            {
               //Insert
            }
            else
            {
                opType = OperationType.Update;
            }

            //Configurant l'ensemble des variables permettant de lancer la requete vers le serveur
            ConfigureEntityQueryElements(input, sEntity, ref sql, ref filterString, automatiqueFilterColumns, ref dicoParams, false, opType);


            using (System.Data.Common.DbConnection myCon = DBUtils.GetConnectionFromConnectionString(conStr))
            {

                try
                {

                    //Créer le dictionnaire à retourner
                    Dictionary<string, object> dicoDAandDS;

                    //charger les données de la base
                    if (DBUtils.hasDbParameters(sql))
                    {
                        dicoDAandDS = DBUtils.GetDictionaryWithDataApdaterAndDataSetForCRUD(sql, myCon, sEntity.Id, dicoParams);
                    }
                    else
                    {
                        dicoDAandDS = DBUtils.GetDictionaryWithDataApdaterAndDataSetForCRUD(sql, myCon, sEntity.Id, null);
                    }

                    //Récupérer la table soujacente
                    DataSet ds = (DataSet)dicoDAandDS["DS"];
                    DataTable dt = ds.Tables[0];

                    //mettre a jour les colonnes du datatable selon la configuration du entity et les privilèges de l'utilisateur.
                    await UpdateDataTableColumns(input, sEntity, dt, OperationType.Insert);

                    DataTable clientDT = input.GetDataTableFromSTring();

                    if (clientDT == null)
                    {
                        throw new Exception(L("NoDataToSave"));
                    }

                    //Liste des colonnes à ignorer dans la modification des données
                    List<string> columnsToIgnore = GetCRUDOperationsIgnoreFields(opType, sEntity);

                    //Créer un objet list depuis la collection de colonne pour pouvoir utiliser linq pour les recherches rapides
                    List<DataColumn> cols = dt.Columns.ToDynamicList<DataColumn>();

                    for (var i = 0; i < clientDT.Rows.Count; i++)
                    {
                        if (opType == OperationType.Insert)
                        {
                            //Créer l'enregistrement
                            DataRow dr = dt.NewRow();

                            //Mettre à jour les colonnes de la ligne
                            UpdateDataRowFromClientData(dr, cols, clientDT.Rows[i], columnsToIgnore);

                            //Ajouter la ligne à la table
                            dt.Rows.Add(dr);
                        }
                        else
                        {
                            //update

                        }
                        
                    }

                    //Enregistrer les données vers la base de données
                    DBUtils.SaveDictionaryWithDataApdaterAndDataSet(dicoDAandDS, sEntity.Id);

                    //Retourner l'enregistrement créé dans la base de données
                    return await Get(new GetMagicDataInput { DataId = input.DataId, EntityId = input.EntityId, KeyValuePairs = input.KeyValuePairs, FilterExpression = input.FilterExpression, Select = input.Select });

                }
                catch
                {
                    throw;
                }


            }
        }


        /// <summary>
        /// Modifier un enregistrement existant
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async  Task<MagicDataObjectResult> Update(CreateOrEditMagicDataInput input)
        {            
            return await CreateOrEdit(input);
        }

        /// <summary>
        /// Supprimer un enregistrement
        /// </summary>
        /// <param name="input"></param>
        public async Task Delete(DeleteMagicDataInput input)
        {

            //Rechercher l'entité dont le unique name a été passé
            var sEntity = await GetEntityById(input.EntityId, false, OperationType.Insert);

            //Recupérer la chaine de connexion
            string conStr = await GetEntityConnectionString(sEntity);

            string sql = "";
            string filterString = "";
            var automatiqueFilterColumns = new List<string>();
            Dictionary<string, object> dicoParams = null;

            OperationType opType = OperationType.Delete;
            
            //Configurant l'ensemble des variables permettant de lancer la requete vers le serveur
            ConfigureEntityQueryElements(input, sEntity, ref sql, ref filterString, automatiqueFilterColumns, ref dicoParams, false, opType);

            //Créer les paramètres dapper
            var parameters = GetEntityParametersForQuery(sEntity, dicoParams);

            using (System.Data.Common.DbConnection myCon = DBUtils.GetConnectionFromConnectionString(conStr))
            {

                try
                {
                                       
                    //Exécuter le SQL de suppression
                    if (DBUtils.hasDbParameters(sql))
                    {
                        await myCon.ExecuteReaderAsync(sql, parameters);
                    }
                    else
                    {
                        await myCon.ExecuteReaderAsync(sql);
                    }
                   

                }
                catch
                {
                    throw;
                }


            }

        }


        /// <summary>
        /// Permet de retourner un dictionnaire contenant les éléments provenant d'un objet JSON précédement encodé pour avoir les différentes valeurs des propriétés de l'objet
        ///et accéder facilement a chaque valeur grace au dictionnaire dans C#
        /// </summary>
        /// <param name="JsonProprieteValeur"></param>
        /// <returns></returns>
        public Dictionary<string, object> GetDicoNomObjetValeurFromJSONString(string JsonProprieteValeur)
		{
			try
			{
				JsonProprieteValeur = System.Net.WebUtility.UrlEncode(JsonProprieteValeur);
				var DicoNomObjetValeur = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonProprieteValeur);

				return DicoNomObjetValeur;
			}
			catch
			{
				return null;
			}
		}

        /// <summary>
        /// Permet de créer 
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<MagicDataObjectResult> Create(CreateOrEditMagicDataInput input)
        {
            //Supprimer le dataId pour forcer le insert.
            input.DataId = null;
            return await CreateOrEdit(input);
        }
    }
}