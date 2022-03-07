/// <reference path="../../../../../lib/iamagic/dxlib/js/jquery.min.js" />
/// <reference path="../../../../../lib/iamagic/iamlib/ia-common.js" />


(function () {
    $(function () {

        var _$magicFlowsGrid = $('#MagicFlowsGrid');
        var _magicFlowService = abp.services.app.magicFlow;
        var _magicDataService = abp.services.app.magicData;
        var _entityTypeFullName = 'IA.MagicSuite.MagicSys.MagicFlow';
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

        function getFlows() {

            //prendre les filtres
            let myFilter = {
                filter: $('#MagicFlowsTableFilter').val(),
                nameFilter: $('#NameFilterId').val(),
                descriptionFilter: $('#DescriptionFilterId').val(),
                flowTypeFilter: $('#FlowTypeId').val(),
                isActiveFilter: $('#IsActiveFilterId').val(),
            };

            _magicFlowService.getMagicFlows(myFilter).done(function (data) {

                //recuppérer le tableau de données retourné
                _gridData = data.items.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        flowTypeId: item.flowTypeId,
                        magicFlowType: item.magicFlowType,
                        tenantId: item.tenantId,
                        isActive: item.isActive
                    }
                });

                _$magicFlowsGrid.dxDataGrid({
                    dataSource: _gridData,
                    hoverStateEnabled: true,
                    keyExpr: "id",
                    columnFixing: { enabled: false },
                    columns: [
                        {

                            dataField: "id",
                            visible: false
                        },
                        {

                            dataField: "tenantId",
                            visible: false
                        },
                        {
                            dataField: "name",
                            caption: app.localize("Name")

                        },
                        {
                            dataField: "description",
                            caption: app.localize("Description"),
                            width: 150
                        },
                        {
                            dataField: "magicFlowType",
                            caption: app.localize("FlowType"),
                            width: 150
                        },
                        {
                            dataField: "isActive",
                            caption: app.localize("IsActive"),
                            dataType: "boolean",
                            width: 80
                        },
                        {
                            type: 'buttons',
                            width: 110,
                            buttons: [
                                {
                                    hint: 'Edit',
                                    icon: 'edit',
                                    visible(e) {
                                        return !e.row.isEditing;
                                    },
                                    disabled(e) {
                                        return isChief(e.row.data.Position);
                                    },
                                    onClick(e) {
                                        iamShared.ui.rightPanelShow();

                                        iamQF.createForm(iamQFObjects.appCreate, e.row.data, false, null, true, app, _magicDataService, true, true, null);

                                    },
                                },
                                {
                                    hint: 'Remove',
                                    icon: 'remove',
                                    visible(e) {
                                        return !e.row.isEditing;
                                    },
                                    disabled(e) {
                                        return isChief(e.row.data.Position);
                                    },
                                    onClick(e) {
                                        console.log("id", e.row.data.id);
                                        deleteFlow(e.row.data.id);
                                    },
                                }
                            ],

                        },
                    ],

                    focusedRowEnabled: true,
                    focusedRowKey: -1,
                    onFocusedRowChanged: function (e) {
                        selectedRowData = e.data;
                    },
                    onRowClick: function (e) {
                        //console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-", e.data);
                        //iamShared.ui.rightPanelShow();

                        //iamQF.createForm(iamQFObjects.appCreate, e.data, false, null, true, app, _magicDataService, true, true, null);
                    },
                    //Gérer le double click sur les lignes du grid
                    onRowDblClick: function (e) {

                        let viewUrl = abp.appPath + 'App/MagicFlow/Editor?id=' + e.data.id;
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

        function deleteFlow(id) {
            abp.message.confirm(
                '',
                app.localize('AreYouSure'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        _magicFlowService.deleteMagicFlow({ id }).done(function () {
                            getFlows(true);
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

        //afficher le panneau de creation d'un nouveau flow
        $('#CreateNewMagicFlowButton').click(function () {
            iamShared.ui.rightPanelShow();

            iamQF.createForm(iamQFObjects.appCreate, null, false, null, true, app, _magicDataService, true, true, null);
        });

        abp.event.on('app.createOrEditMagicAppModalSaved', function () {
            getFlows();
        });

        $('#getFlowsButton').click(function (e) {
            e.preventDefault();
            getFlows();
        });

        $(document).keypress(function (e) {
            if (e.which === 13) {
                getFlows();
            }
        });

        getFlows();


        var iamQFObjects = {

            appCreate: {
                AutoCreateEditors: false,
                Id: "iamQFAppCreate",
                Name: "Create New Flow",
                DisplayName: null,
                PositionId: "rightPanel",

                //fonction exécutée quand le quickform est globalement validé (terminé).   
                OnValidated: function (data) {
                    console.log(data);

                    _magicFlowService.createOrEditMagicFlow(
                        data
                    ).done(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        //abp.event.trigger('app.createOrEditMagicAppModalSaved');

                        //Recharger la liste des apps
                        getFlows();
                        //iamShared.ui.activeQuickFormHide();

                    }).always(function () {
                        abp.ui.clearBusy('body');
                    });
                },
                //Liste des sources utilisables par les items
                //donner le nom de la source a la propriété "ListDataSourceName" pour la voir utiliser sur l'item
                DataSourceOriginal: [
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
                DataSource: [
                    {
                        Name: "FlowTypeSelect",
                        EntityRequestObject: {
                            EntityId: 'FlowTypeSelect', //nom unique de l'entité
                            KeyValuePairs: null, //objet des paramètres nécessaires pour sélectionner les données de l'entité
                            DataId: null, // Valeur du champ Id lorsqu'on recherche un enregistrement unique spécifique
                            FilterExpression: null //expression de filtre complémentaire possible dans les cas spécifiques ex: [champ1]='valeurText1' AND [champ2]=valeurNumerique2 etc.
                        }
                    },

                    {
                        Name: "TenantSelect",
                        EntityRequestObject: {
                            EntityId: 'TenantSelect', //nom unique de l'entité
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
                        Name: "",
                        DisplayName: app.localize("Identification").toUpperCase(),
                        DenyBack: false,
                        OrderNumber: 1
                    },
                    //{
                    //    Id: "0002",
                    //    Name: "Style",
                    //    DisplayName: app.localize("Style").toUpperCase(),
                    //    DenyBack: false,
                    //    OrderNumber: 2
                    //}
                ],
                Items: [
                    {
                        Id: "item_Id",
                        StepId: "0001",
                        OrderNumber: null,
                        ColSpan: null,
                        CssClass: null,
                        DataField: "id",
                        DisplayName: "Id",
                        IsRequired: true,
                        ReadOnly: true,
                        EditorType: "dxTextBox",
                        Formula: `IF({tenantId}=NULL;convertToPascalCase({name}); CONCATENATE("t";{tenantId};"_";convertToPascalCase({name})))`
                    },
                    {
                        Id: "item_Name",
                        StepId: "0001",
                        OrderNumber: 1,
                        DataField: "name",
                        DisplayName: "Name",
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
                        Id: "item_Description",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "description",
                        DisplayName: "Description",
                        IsRequired: false,
                        EditorType: "dxTextArea",
                    },
                    {
                        Id: "item_FlowType",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "flowTypeId",
                        DisplayName: "Flow Type",//app.localize("AppType"),
                        DefaultValue: "DUAL",
                        IsRequired: false,
                        EditorType: "dxTextBox",// "dxSelectBox",

                        //ListDataSourceName: "FlowTypeSelect"
                    },
                    {
                        Id: "item_TenantID",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "tenantId",
                        DisplayName: "Tenant",//app.localize("AppType"),
                        DefaultValue: "DUAL",
                        IsRequired: false,
                        EditorType: "dxTextBox",// "dxSelectBox",

                        //ListDataSourceName: "TenantSelect"
                    },
                    {
                        Id: "item_IsActive",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "isActive",
                        DisplayName: "IsActive",
                        IsRequired: false,
                        EditorType: "dxCheckBox",
                        DefaultValue: true
                    },
                ],
                Item: [
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
