/// <reference path="../../../../../lib/iamagic/dxlib/js/jquery.min.js" />
/// <reference path="../../../../../lib/iamagic/iamlib/ia-common.js" />

(function () {
    $(function () {

        var _$magicAppsGrid = $('#MagicAppsGrid');        
        var _magicAppsService = abp.services.app.magicApps;
        var _magicDataService = abp.services.app.magicData;
        var _entityTypeFullName = 'IA.MagicSuite.MagicSys.MagicApp';
        var selectedRowData = null;
        var _gridData;
               
        
        moment.locale(abp.localization.currentLanguage.name);

        //Créer le right panel pour les quickCreate/quickforms
        iamShared.ui.rightPanelCreate(null, false, null);
        iamShared.ui.wizardPopupHtmlCreate();

        $('.date-picker').datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });

        var _permissions = {
            create: abp.auth.hasPermission('Pages.MagicApps.Create'),
            edit: abp.auth.hasPermission('Pages.MagicApps.Edit'),
            'delete': abp.auth.hasPermission('Pages.MagicApps.Delete')
        };

       
		        var _entityTypeHistoryModal = app.modals.EntityTypeHistoryModal.create();
		        function entityHistoryIsEnabled() {
            return abp.auth.hasPermission('Pages.Administration.AuditLogs') &&
                abp.custom.EntityHistory &&
                abp.custom.EntityHistory.IsEnabled &&
                _.filter(abp.custom.EntityHistory.EnabledEntities, entityType => entityType === _entityTypeFullName).length === 1;
        }

        var getDateFilter = function (element) {
            if (element.data("DateTimePicker").date() == null) {
                return null;
            }
            return element.data("DateTimePicker").date().format("YYYY-MM-DDT00:00:00Z"); 
        }
        
        var getMaxDateFilter = function (element) {
            if (element.data("DateTimePicker").date() == null) {
                return null;
            }
            return element.data("DateTimePicker").date().format("YYYY-MM-DDT23:59:59Z"); 
        }

        function getMagicApps() {

            //prendre les filtres
            let myFilter = {
                filter: $('#MagicAppsTableFilter').val(),
                nameFilter: $('#NameFilterId').val(),
                uniqueNameFilter: $('#UniqueNameFilterId').val(),
                descriptionFilter: $('#DescriptionFilterId').val(),
                activeVersionFilter: $('#ActiveVersionFilterId').val(),
                colorOrClassNameFilter: $('#ColorOrClassNameFilterId').val(),
                useDefaultIconFilter: $('#UseDefaultIconFilterId').val(),
                systemIconFilter: $('#SystemIconFilterId').val(),
                iconUrlFilter: $('#IconUrlFilterId').val(),
                isActiveFilter: $('#IsActiveFilterId').val(),
                isSystemAppFilter: $('#IsSystemAppFilterId').val(),
                magicSolutionNameFilter: $('#MagicSolutionNameFilterId').val(),
                magicAppTypeNameFilter: $('#MagicAppTypeNameFilterId').val(),
                magicAppStatusNameFilter: $('#MagicAppStatusNameFilterId').val()
            };

            _magicAppsService.getAll(myFilter).done(function (data) {

                //recuppérer le tableau de données retourné
                _gridData = data.items.map(item => {
                    let o = item.magicApp;
                    return {
                        id: o.id,
                        name: o.name,                       
                        fullName: o.name + " (" + o.id + ")",
                        appTypeName: o.typeName,
                        solutionName: item.magicSolutionName,
                        creationTime: o.creationTime,
                        lastModificationTime: o.lastModificationTime,
                        isSystemApp: o.isSystemApp,
                        isActive: o.isActive
                    }
                });

                _$magicAppsGrid.dxDataGrid({
                    dataSource: _gridData,
                    hoverStateEnabled: true,
                    keyExpr:"id",
                    columnFixing: { enabled: false },
                    columns: [
                        {

                            dataField: "id",
                            visible: false
                        },
                        {
                            dataField: "fullName",
                            caption: app.localize("FullName")
                           
                        },
                        {
                            dataField: "solutionName",
                            caption: app.localize("SolutionName"),
                            width: 150
                        },
                        {
                            dataField: "appTypeName",
                            caption: app.localize("AppTypeName"),
                            width: 80
                        }
                        ,
                        {
                            dataField: "creationTime",
                            caption: app.localize("CreationTime"),
                            format: 'dd/MM/yyyy',
                            dataType: "date",
                            width: 100
                        },
                        {
                            dataField: "lastModificationTime",
                            caption: app.localize("LastModificationTime"),
                            format: 'dd/MM/yyyy',
                            dataType: "date",
                            width: 100
                        },
                        {
                            dataField: "isSystemApp",
                            caption: app.localize("IsSystemApp"),
                            dataType: "boolean",
                            width: 80
                        },
                        {
                            dataField: "isActive",
                            caption: app.localize("IsActive"),
                            dataType: "boolean",
                            width: 80
                        }
                        
                    ],

                    focusedRowEnabled: true,
                    onFocusedRowChanged: function (e) {
                        selectedRowData = e.data;
                    },

                    //Gérer le double click sur les lignes du grid
                    onRowDblClick: function (e) {
                        
                        let viewUrl = abp.appPath + 'App/MagicApps/AppBuilder?id=' + e.data.id;
                        window.location.href = viewUrl;
                    },

                    //modifier la couleur des lignes impaires/paires
                    rowAlternationEnabled: true,

                    showBorders: true,
                    showColumnHeaders: true,
                    showRowLines: true
                });
            });
        }

        function deleteMagicApp(magicApp) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _magicAppsService.delete({
                            id: magicApp.id
                        }).done(function () {
                            getMagicApps(true);
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        }

		$('#ShowAdvancedFiltersSpan').click(function () {
            $('#ShowAdvancedFiltersSpan').hide();
            $('#HideAdvancedFiltersSpan').show();
            $('#AdvacedAuditFiltersArea').slideDown();
        });

        $('#HideAdvancedFiltersSpan').click(function () {
            $('#HideAdvancedFiltersSpan').hide();
            $('#ShowAdvancedFiltersSpan').show();
            $('#AdvacedAuditFiltersArea').slideUp();
        });

        //afficher le panneau de creation d'une nouvelle app
        $('#CreateNewMagicAppButton').click(function () {
            iamShared.ui.rightPanelShow();
                       
            iamQF.createForm(iamQFObjects.appCreate, null, false, null, true, app, _magicDataService, true, true, null);
        });        

        abp.event.on('app.createOrEditMagicAppModalSaved', function () {
            getMagicApps();
        });

		$('#GetMagicAppsButton').click(function (e) {
            e.preventDefault();
            getMagicApps();
        });

		$(document).keypress(function(e) {
		  if(e.which === 13) {
			getMagicApps();
		  }
		});
		
        getMagicApps();


        var iamQFObjects = {
                      
            appCreate: {
                AutoCreateEditors: false,
                Id: "iamQFAppCreate",
                Name: "CreateMagicApp",
                DisplayName: null,
                PositionId: "rightpanel",

                //fonction exécutée quand le quickform est globalement validé (terminé).   
                OnValidated: function (data) {
                    abp.ui.setBusy('body');
                    _magicAppsService.createOrEdit(
                        data
                    ).done(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        abp.event.trigger('app.createOrEditMagicAppModalSaved');

                        //Recharger la liste des apps
                        getMagicApps();
                        iamShared.ui.activeQuickFormHide();

                    }).always(function () {
                        abp.ui.clearBusy('body');
                    });
                },
                //Liste des sources utilisables par les items
                //donner le nom de la source a la propriété "ListDataSourceName" pour la voir utiliser sur l'item
                DataSources: [
                    {
                        Name: "MagicSolutionSelect",
                        EntityRequestObject: {
                            EntityId: 'MagicSolutionSelect', //nom unique de l'entité
                            KeyValuePairs: null, //objet des paramètres nécessaires pour sélectionner les données de l'entité
                            DataId: null, // Valeur du champ Id lorsqu'on recherche un enregistrement unique spécifique
                            FilterExpression: null //expression de filtre complémentaire possible dans les cas spécifiques ex: [champ1]='valeurText1' AND [champ2]=valeurNumerique2 etc.
                        }
                    }, 

                    {
                        Name: "UserSelect",
                        EntityRequestObject: {
                            EntityId: 'UserSelect', //nom unique de l'entité
                            KeyValuePairs: null, //objet des paramètres nécessaires pour sélectionner les données de l'entité
                            DataId: null, // Valeur du champ Id lorsqu'on recherche un enregistrement unique spécifique
                            FilterExpression: null //expression de filtre complémentaire possible dans les cas spécifiques ex: [champ1]='valeurText1' AND [champ2]=valeurNumerique2 etc.
                        }
                    }, 
                ],
                Data: null,
                IgnoreStepsOrderNumber: false, //Ignore le numéro d'ordre attribué et ordonne par ordre de position dans le tableau des steps
                IgnoreItemsOrderNumber: true,
                /*New: {
                    Name: null, Id: null, Description: null, ActiveVersion: null, ColorOrClassName: null, UseDefaultIcon: false, SystemIcon: null, IconUrl: null,
                    IsActive: true, IsSystemApp: false, UseDefaultIcon: false, AppTypeId: 'DUAL', AppStatusId: null, SolutionId: null
                },*/
                Steps: [
                    {
                        Id: "0001",
                        Name: "Identification",
                        DisplayName: app.localize("Identification").toUpperCase(),
                        DenyBack: false,
                        OrderNumber: 1
                    },
                    {
                        Id: "0002",
                        Name: "Style",
                        DisplayName: app.localize("Style").toUpperCase(),
                        DenyBack: false,
                        OrderNumber: 2
                    }
                ],
                Items: [
                    {
                        Id: "item_Name",
                        StepId: "0001",
                        OrderNumber: 1,
                        DataField: "Name",
                        DisplayName: null,
                        IsRequired: true,
                        EditorType: "dxTextBox",
                        ValidationRules: [
                            {
                                type: 'pattern', //require, email,compare,range,stringLength
                                pattern: '^[0-9A-Za-z_ ]+$',
                                message: app.localize("InvalidDataInput")
                            }
                        ],
                    },
                    {
                        Id: "item_Id",
                        StepId: "0001",
                        OrderNumber: null,
                        ColSpan: null,
                        CssClass: null,
                        DataField: "id",
                        DisplayName: null,
                        IsRequired: true,
                        ReadOnly: true,
                        EditorType: "dxTextBox",
                        Formula: `IF({tenantId}=NULL;convertToPascalCase({Name}); CONCATENATE("t";{tenantId};"_";convertToPascalCase({Name})))`
                    },
                    {
                        Id: "item_AppTypeId",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "AppTypeId",
                        DisplayName: app.localize("AppType"),
                        DefaultValue: "DUAL",
                        IsRequired: true,
                        EditorType: "dxSelectBox",

                        //Spécifique pour les objets liste ou  les tableaux immediats automatique pour un dxTextBox avec bouton rechercher
                        ListValueExpression: null, // Spécifier le champ de valeur retournée
                        ListDisplayExpression: null, //Spécifier le champ affiché
                        ListSystemIconExpression: null, //Spécifier le champ utilisé pour afficher des images système
                        ListIconUrlExpression: null, //Spécifier le champ utilisé pour afficher des images depuis les Url
                        ListImageExpression: null, //spécifier  le champ utilisé pour afficher des images (base64 ou byteaarray)
                        EntityRequestObject: {
                            EntityId: 'MagicAppType', //nom unique de l'entité
                            KeyValuePairs: null, //objet des paramètres nécessaires pour sélectionner les données de l'entité
                            DataId: null, // Valeur du champ Id lorsqu'on recherche un enregistrement unique spécifique
                            FilterExpression: null //expression de filtre complémentaire possible dans les cas spécifiques ex: [champ1]='valeurText1' AND [champ2]=valeurNumerique2 etc.
                        }
                    },
                    {
                        Id: "item_SolutionId",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "SolutionId",
                        DisplayName: null,
                        IsRequired: true,
                        ReadOnly: false,
                        EditorType: "dxTextBox",
                        ListDataSourceName: "MagicSolutionSelect"////le nom de la source de données dans la propriété Datasources du quickForm
                    },
                    {
                        Id: "item_OwnerId",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "OwnerId",
                        DisplayName: null,
                        IsRequired: true,
                        ReadOnly: false,
                        EditorType: "dxNumberBox",
                        ListDataSourceName: "UserSelect",////le nom de la source de données dans la propriété Datasources du quickForm
                        DefaultValue: iamPageVariables.userId
                    },
                    {
                        Id: "item_Description",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "Description",
                        DisplayName: null,
                        IsRequired: false,
                        EditorType: "dxTextArea"
                    },
                    {
                        Id: "item_IsActive",
                        StepId: "0001",
                        OrderNumber: 3,
                        DataField: "IsActive",
                        DisplayName: null,
                        IsRequired: false,
                        EditorType: "dxCheckBox",
                        DefaultValue: true
                    },
                    {
                        Id: "item_IsSystemApp",
                        StepId: "0001",
                        OrderNumber: 3,
                        DataField: "IsSystemApp",
                        DisplayName: null,
                        IsRequired: false,
                        EditorType: "dxCheckBox",
                        DefaultValue: false
                    },
                    
                    {
                        Id: "item_ColorOrClassName",
                        StepId: "0002",
                        OrderNumber: 4,
                        DataField: "ColorOrClassName",
                        DisplayName: null,
                        IsRequired: false,
                        EditorType: "dxTextBox"
                    },
                    {
                        Id: "item_UseDefaultIcon",
                        StepId: "0002",
                        OrderNumber: 4,
                        DataField: "UseDefaultIcon",
                        DisplayName: null,
                        IsRequired: false,
                        EditorType: "dxCheckBox",
                        DefaultValue: false
                    },
                    {
                        Id: "item_SystemIcon",
                        StepId: "0002",
                        OrderNumber: 5,
                        DataField: "SystemIcon",
                        DisplayName: null,
                        IsRequired: false,
                        EditorType: "dxTextBox"
                    },
                    {
                        Id: "item_IconUrl",
                        StepId: "0002",
                        OrderNumber: 6,
                        DataField: "IconUrl",
                        DisplayName: null,
                        IsRequired: false,
                        EditorType: "dxTextBox"
                    }
                ]
            },

        };
    });
})();
