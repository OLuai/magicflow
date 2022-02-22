/// <reference path="../dxlib/js/jquery.min.js" />
/// <reference path="ia-common.js" />

var iamApp = {

    //Objets pour faire fonctionner le builder même hors ligne. listes des arrays stratégiques utilisés dans le builder
    offlineDataEntityArrays:[], //liste de toutes les données offline qu'on peut utiliser dans le builder. chaque élément est de la forme {entityId:, data:}
    rootPath: null,
    viewerMode:false,

    //Objets actifs de l'application active à manipuler
    appObject: null,
    appVersionHistoryData:null,
    appVersionObject: null,
    appEntities:null, //liste des entités de l'application
    appPages: null, //liste des pages de l'application
    appAdditionnalElements: null, //liste des éléments additionnels de l'application
    cardTemplateHtml: `
            <div class="col-12 col-sm-6 p-1" >
                <div class="row filecard p-2 m-0" id="{id}" data-id="{dataId}" data-type="{typeId}">
                    <div class="col-4 p-0 filecard-icon">
                        <i class="{imageClassName}"></i>
                    </div>
                    <div class="col-8 p-0 filecard-details">
                        <div class="d-flex flex-column justify-content-between" style="height:100%">
                            <div class="d-flex justify-content-between">
                                <div>
                                    {displayName}
                                </div>
                                <div class="filecard-checkbox">
                                    <label class="checkbox checkbox-outline checkbox-success">
                                        <input type="checkbox" name="{id}_Checkbox" />
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <div class=" text-muted">
                                {description}
                            </div>
                        </div>

                    </div>
                </div>
            </div>`,
    pageTypesIdArray: [{ name: "FORM", imageClassName: "fa fa-clipboard-list" }, { name: "REPORT", imageClassName: "fa fa-file-invoice" }, { name: "DASHBOARD", imageClassName: "fa fa-tachometer-alt" }, { name: "CALENDAR", imageClassName: "fa fa-calendar-alt" }, { name: "PORTAL", imageClassName: "fa fa-home" }, { name: "DATAGRID", imageClassName: "fa fa-table" }, { name: "CODE", imageClassName: "fa fa-file-code" }, { name: "QUICKFORM", imageClassName: "fa fa-pen-square" }],

    //Intègre dans la page principale les evenements nécessaire au fonctionnement du builder de l'application
    createAppBuilderEvents: function () {

        $(document).on("dblclick", "#iamAppAccordion .filecard", function (e) {
            e.stopPropagation();
            e.preventDefault();

            //Récupérer l'identifiant de l'élément surlequel on a cliqué
            var itemId = $(this).data("id");
            var itemTypeId = $(this).data("type");

            if (itemTypeId == "ENTITY") {
                //Lancer la page de configuration du entity
            } else {
                //Lancer le designer de la page
                iamShared.ui.designersShowPopupByPageId(app,itemId);
            }
                        
        });
    },

    //exporter la version dont le nom est spécifiée de l'application
    exportApp: function (appService,appVersionService, exportFullAppData, toZip) {

    },

    //exporter la version dont le nom est spécifiée de l'application
    exportAppVersion: function (appVersionService, versionName, toZip) {

    },
    //Exporter version active de l'application
    exportAppActiveVersion: function (appVersionService, toZip) {

    },
    //importer fichier d'une version particulière de l'application
    importAppVersion: function (appVersionService, versionName) {

    },
    //importer fichier dans la version active de l'application
    importAppActiveVersion: function (appVersionService) {

    },

    //Enregistrer la configuration et l'objet JSON de l'application activation
    saveAppObject: function (appService) {

    },

    //Enregistrer la configuration et l'objet JSON dans la version active de l'application
    saveAppVersionObject: function (appVersionService) {
        if (this.appVersionObject == null) return;

        //afficher le busy
        abp.ui.setBusy('body');

        var that = this;

        //Mettre a jour la propriété versionObject de la ligne appVersionHistoryData
        that.appVersionHistoryData.versionObject = JSON.stringify(that.appVersionObject);
        
        //Lancer le service AppVersionHistory et exécuter la fonction CreateOrEdit pour enregistrer les modifications à l'objet appVersionHistoryData
        appVersionService.createOrEdit(
            that.appVersionHistoryData
        ).done(function (data) {

            //console.log(data);
            that.appVersionHistoryData = data.magicAppVersionHistory;

            abp.event.trigger('app.createOrEditMagicAppHistorySaved');

        }).always(function () {
            abp.ui.clearBusy('body');
        });
    },

    //Créer une nouvelle version de l'application en prenant la version active comme configuration de départ
    createNewAppVersion: function (appVersionService) {

    },

    //Charger l'objet de la version de l'application passé en paramètre. Si aucune version n'est passée, la version active de l'application est utilisée.
    getAppVersionObject: function (appVersionService, versionName) {

        var that = this;

        abp.ui.setBusy('body');
        appVersionService.getMagicAppVersionHistoryByAppIdAndVersionName(
            { appId: that.appObject.id, versionName: (versionName || that.appObject.activeVersion) }
        ).done(function (data) {

            let createDefaultMenuItems = false;
            let viewerMode = iamApp.viewerMode;

            //Conserver les infos de AppVersionHistory dans la propriété globale créée à cet effet
            that.appVersionHistoryData = data.magicAppVersionHistory;
            //Vérifier si un objet de paramétrage de la version existe déjà
            if (that.appVersionHistoryData.versionObject) {
                //Oui il existe alors générer l'objet depuis sa sérialisation précédente (JSON)
                that.appVersionObject = JSON.parse(that.appVersionHistoryData.versionObject);
                //console.log(that.appVersionObject);
            } else {
                //Non, il n'existe pas encore, alors créer un nouvel objet
                that.appVersionObject = { menuItems: [] };
                if (viewerMode == false)  createDefaultMenuItems = true;
            }
            //Prendre la version comme version active si aucune version active n'a été spécifiée dans l'appObject
            if (!that.appObject.activeVersion) that.appObject.activeVersion = that.appVersionHistoryData.versionName;

            //Conserver la liste des menusItems dans la propriété menuItems du sous objet de menu contenant toutes les fonctions relatives au menu.
            iamApp.appMenu.menuItems = iamApp.appVersionObject.menuItems;

            //Vérifier si les nouveaux menus par défaut doivent être créés
            if (createDefaultMenuItems) {
                //Créer les éléments par défaut pour une nouvelle application
                iamApp.appMenu.createDefaultMenuItems();
            } else {
                //créer les items depuis la source chargée
                iamApp.appMenu.rebuildAppMenu(null, viewerMode);
            }

            //Charger les entities de l'app
            iamApp.reloadAppEntities();

            //Charger les pages de l'app
            iamApp.reloadAppPages(true, null);

            //abp.event.trigger('app.createOrEditMagicAppModalSaved');
        }).always(function () {
            abp.ui.clearBusy('body');
        });
    },

    //Charger l'objet de la version active de l'application.
    getAppActiveVersionObject: function (appVersionService) {

        this.getAppVersionObject(appVersionService, this.appObject.activeVersion);
       
    },

    //Ajouter une entity à l'application
    addAppEntity: function (appEntityService, entityId, appId, reloadEntitiesArray) {

        var that = this;
                
        //Prendre l'identifiant de l'application active si aucun identifiant d'application n'est passé en paramètre
        if (!appId) appId = that.appObject.id;

        if (entityId) {
            abp.ui.setBusy('body');
            appEntityService.createOrEdit(
                { appId: appId, entityId: entityId }
            ).done(function (data) {                  
                that.reloadAppEntities(true);

            }).always(function () {
                abp.ui.clearBusy('body');
            });
        } else {

            //Afficher un popup pour sélectionner l'entité à charger
            iamShared.ui.popupShowDataServiceEntitySelection(null, "MagicEntitySelect", null, null, app, null, null, false, function (selectedItems) {     
                
                that.addAppEntity(appEntityService, selectedItems[0]["id"], appId, reloadEntitiesArray);
                
            }, null, null, null);
            return;
        }

        //Vérifier s'il a été demandé de recharger la liste des Entities de magic dans son tableau offline.
        if (reloadEntitiesArray) {
            //Charger le service magic Data pour la liste des entités
            var magicDataSvc = abp.services.app.magicData;
            var magicDataObjectRequest = {EntityId: "MagicEntitySelect", KeyValuePairs:null, FilterExpression:null, DataTable:null};
            
            iamShared.magicData.get(
                magicDataSvc,
                magicDataObjectRequest, //objet JS ordinaire de requete vers magic data
                true, //True si l'objet de requete est brute (Objet JS sans les transformations avec les propriétés complexes en string)
                null, //Data, données source pouvant être utilisée dans les formules de calcul et fonction dynamique pour l'une des propriétés de magicDataObjectRequest. c'est généralement un objet avec des fiels/propriété pouvant être utilisé dans le calcul de la caleur de certaines propriétés de magicDataObjectRequest
                null, //Variables, Tableau de variables pouvant être utilisée dans les formules de calcul et fonction dynamique pour l'une des propriétés de magicDataObjectRequest. c'est généralement un objet avec des fiels/propriété pouvant être utilisé dans le calcul de la caleur de certaines propriétés de magicDataObjectRequest
                function (data) {
                    //console.log(data);
                    iamShared.arrays.updatePropertiesByKey(that.offlineDataEntityArrays, "id", "MagicEntitySelect", { name: "MagicEntitySelect", data: data }, true);                  
                
                    return;
                },
                null, //timeout
                true //showBusy. Afficher l'image busy pour montrer qu'un travail est en cours
            );
           
            return;
        }

        

    },

    //Ajouter une entity à l'application
    addAppPage: function (appPageService, pageId, pageTypeId, appId, reloadAppPagesArray) {

        var that = this;
                
        //Prendre l'identifiant de l'application active si aucun identifiant d'application n'est passé en paramètre
        if (!appId) appId = that.appObject.id;

        if (pageId) {
            abp.ui.setBusy('body');
            appPageService.createOrEdit(
                { appId: appId, pageId: pageId }
            ).done(function (data) {

                console.log("appPageService.createOrEdit result");
                console.log(data);
                that.reloadAppPages(true, pageTypeId);

            }).always(function () {
                abp.ui.clearBusy('body');
            });
        } else {

            //Afficher un popup pour sélectionner la page à charger
            iamShared.ui.popupShowDataServiceEntitySelection(null, "MagicPageSelectForHostAndTenantByPageType", { pageTypeId: pageTypeId }, null, app, null, null, false, function (selectedItems) {
                console.log("MagicPageSelectForHostAndTenantByPageType selectedItems");
                console.log(selectedItems);
                that.addAppPage(appPageService, selectedItems[0]["id"], pageTypeId, appId, reloadAppPagesArray);

            }, null, null, null);
            return;
        }

        //Vérifier s'il a été demandé de recharger la liste des Entities de magic dans son tableau offline.
        if (reloadAppPagesArray) {
            //Charger le service magic Data pour la liste des entités
                        
            var magicDataSvc = abp.services.app.magicData;
            var magicDataObjectRequest = { EntityId: "MagicAppPageSelect", KeyValuePairs: null, FilterExpression: null, DataTable: null };

            iamShared.magicData.get(
                magicDataSvc,
                magicDataObjectRequest, //objet JS ordinaire de requete vers magic data
                true, //True si l'objet de requete est brute (Objet JS sans les transformations avec les propriétés complexes en string)
                null, //Data, données source pouvant être utilisée dans les formules de calcul et fonction dynamique pour l'une des propriétés de magicDataObjectRequest. c'est généralement un objet avec des fiels/propriété pouvant être utilisé dans le calcul de la caleur de certaines propriétés de magicDataObjectRequest
                null, //Variables, Tableau de variables pouvant être utilisée dans les formules de calcul et fonction dynamique pour l'une des propriétés de magicDataObjectRequest. c'est généralement un objet avec des fiels/propriété pouvant être utilisé dans le calcul de la caleur de certaines propriétés de magicDataObjectRequest
                function (data) {
                    console.log(data);
                    iamShared.arrays.updatePropertiesByKey(that.offlineDataEntityArrays, "id", "MagicAppPageSelect", { name: "MagicEntitySelect", data: data }, true);

                    return;
                },
                null, //timeout
                true //showBusy. Afficher l'image busy pour montrer qu'un travail est en cours
            );

            return;
        }



    },

    //Recharger la liste des entités de l'application
    reloadAppEntities: function (expandList) {
        var that = this;
        var entitiesSvc = abp.services.app.magicAppEntities;
        abp.ui.setBusy('body');
        entitiesSvc.getAppEntitiesByAppId(that.appObject.id).done(function (data) {            

            that.appEntities = [];

            if (!data || data.totalCount == 0) {

            } else {
                that.appEntities = data.items.map(function (item) { return { id: item.appEntity.id, dataId: item.appEntity.entityId, entityId: item.appEntity.entityId, appId: item.appEntity.appId, displayName: item.magicEntityDisplayName, typeId:"ENTITY" } });                
            }
            

            //Adapter le titre de la liste des entités
            $("#AppEntitiesContainerTitle").text(app.localize("Entities") + " (" + data.totalCount.toString() + ")");

            var tpl = iamApp.cardTemplateHtml.replace("{imageClassName}", "fa fa-database");

            //Créer les cartes des entités liées
            iamShared.ui.buildHtmlTemplate("AppEntitiesContainer", tpl, that.appEntities, true);

            if (expandList) $('#collapseEntities').collapse('show');

            return;

        }).always(function () {
            abp.ui.clearBusy('body');
        });

        return;
    },

    //Recharger la liste des pages de l'app.
    //Si pageTypeId est null, alors toutes les listes de type d'app sont actualisé dans le UI. sinon après le chargement des appPages, seul le type de page = pageTypeId est actualisé dans le UI
    reloadAppPages: function (expandList, pageTypeId) {
        
        var that = this;
        var appPagesSvc = abp.services.app.magicAppPages;
        abp.ui.setBusy('body');
        appPagesSvc.getAppPagesByAppId(that.appObject.id).done(function (data) {

            that.appPages = [];

            if (!data || data.totalCount == 0) {

            } else {
                //Charger la liste des appPages en adaptant le nom des propriétés à celle de notre template de visualisation : {id:, entityId:, appId:, displayName:, typeId:}
                that.appPages = data.items.map(function (item) { return { id: item.magicAppPage.id, dataId: item.magicAppPage.pageId,  entityId: item.magicAppPage.entityId, appId: item.magicAppPage.appId, displayName: item.magicPageName, typeId: item.magicPageTypeId } });

                //console.log(data);

                //console.log(that.appPages);
            }

            //Vérifier si un type de page a été demandé
            if (pageTypeId) {

                var pageTypePluralName = "Forms";
                switch (pageTypeId) {
                    case "DASHBOARD": {
                        pageTypePluralName = "Dashboards";
                        break;
                    }
                    default:
                        pageTypePluralName = iamShared.strings.convertToPascalCase(pageTypeId) + "s";
                        break;
                }

                var typePages = DevExpress.data.query(that.appPages)
                    .filter(["typeId", "=", pageTypeId]);
                //.sortBy("displayName");

                var item = iamShared.arrays.findByKey(that.pageTypesIdArray, "name", pageTypeId);

                var tpl = iamApp.cardTemplateHtml.replace("{imageClassName}", ((item)?item.imageClassName:""));

                //Adapter le titre de la liste du type de page
                $("#App" + pageTypePluralName + "ContainerTitle").text(app.localize(pageTypePluralName) + " (" + typePages.count().toString() + ")");

                //Créer les cartes du type de page liées
                iamShared.ui.buildHtmlTemplate("App" + pageTypePluralName + "Container", tpl, typePages.toArray(), true);

                //Déplier la liste correspondante si cela a été demandé
                if (expandList) $('#collapse' + pageTypePluralName).collapse('show');

            } else {

                //Aucun type de page n'a été demandé alors parcourir tous les types de pages
                that.pageTypesIdArray.forEach(function (item) {

                    //Prendre le nom pluriel du type de page en PascalCase
                    var pageTypePluralName = "Forms";
                    switch (item.name) {
                        case "DASHBOARD": {
                            pageTypePluralName = "Dashboards";
                            break;
                        }
                        default:
                            pageTypePluralName = iamShared.strings.convertToTitleCase(item.name) + "s";
                            break;
                    }
                                        
                    //Si le type de page n'existe pas dans les types à afficher dans la page alors ne rien faire et passer au prochain type
                    if ($("#App" + pageTypePluralName + "ContainerTitle").length > 0) {
                        //Filtrer pour avoir uniquement les éléments du type recherché
                        var typePages = DevExpress.data.query(that.appPages)
                            .filter(["typeId", "=", item.name]);
                                                
                        typePages.count().done(
                            function (value) {
                                //Adapter le titre de la liste du type de page en fonction du nombre d'éléments
                                $("#App" + pageTypePluralName + "ContainerTitle").text(app.localize(pageTypePluralName) + " (" + value  + ")");
                            }
                        );

                        var tpl = iamApp.cardTemplateHtml.replace("{imageClassName}", item.imageClassName);

                        //Créer les cartes du type de page liées
                        iamShared.ui.buildHtmlTemplate("App" + pageTypePluralName + "Container", tpl, typePages.toArray(), true);
                    }

                    
                });
            }
            

            return;

        }).always(function () {
            abp.ui.clearBusy('body');
        });

        return;
    },

    //Objet qui gère les fonctions et élement du menu principal de l'application
    appMenu: {

        //Identifiant du Ul du menu principal de l'app dans lequel insérer les items
        mainMenuUlId: 'iam_MainNavMenuUl',

        activeMenuItem: null,

        menuItems: [],

        //retourne un tableau contenant la liste des name/displayName
        menuGroupsGet: function () {
            return DevExpress.data.query(this.menuItems)
                .filter(["itemType", "=", "menugroup"])
                .sortBy("name")
                .toArray();
        },
        //Créer les menus par défaut à générer pour une nouvelle App
        createDefaultMenuItems: function () {

            this.createMenuGroup("Create", null, "fas fa-plus-square", null, null, true, true);
            this.createMenuGroup("UsefulLists", null, "fas fa-list-ol", null, null, true, true);
            this.createMenuGroup("Administration", null, "fas fa-cog", null, null, true, true);
            this.createMenuGroup("Dashboards", null, "fas fa-chart-line", null, null, true, true);
            this.createMenuGroup("Reports", null, "fas fa-file-invoice", null, null, true, true);

        },

        //Retourne l'objet js de l'item (menuItem ou menuGroup) depuis son nom
        getItemByName: function (itemName) {
            return iamShared.arrays.findByKey(this.menuItems, "name", itemName);
        },

        //Rendre l'item dont le nom est passé actif
        setActiveItem: function (itemName) {

            //Rétirer l'ancien élément actif mais ne pas toucher les goupes
            $('li[class*="menu-item-active"]').not('[class*="menu-item-open"]').removeClass('menu-item-active');

            //ajouter la classe active seulement pour les menuItem
            $(`li[data-menu-item-name="${itemName}"]`).not('[class*="menu-item-open"]').addClass('menu-item-active');

            //conserver l'objet item actif
            this.activeMenuItem = this.getItemByName(itemName);

            return this.activeMenuItem;
        },

        //Permet de retourner la liste des items masqués. Si returnNamesOnly=true alors retourne un array ne contenant que les noms des objets masqués
        getHiddenItems:function(returnNamesOnly=false){
            let hiddenItems = this.menuItems.filter(function (item){
                return iamShared.utils.eval(item.visible) == false;
            });

            if (hiddenItems && returnNamesOnly) {
                let hI =hiddenItems.map(function (item) {
                    return item.name;
                });

                return hI;
            }

            return hiddenItems;
        },

        //Permet de retourner la liste des items adapté au popup de sélection name, displayName
        getHiddenItemsPopupSelectionList: function () {
            let hiddenItems = this.getHiddenItems();

            if (hiddenItems) {
                hiddenItems = hiddenItems.map(function (item) {
                    return { name: item.name, displayName: (item.displayName || app.localize(item.name))}
                });
            }
            return hiddenItems;
        },

        //Retourner le proxy pour le propertyGrid d'un item
        getItemPropertyGridProxy: function (item) {
            if (!item) item = this.activeMenuItem;

            //Si l'item est toujours vide alors sortir
            if (!item) return;

            //retourner le proxy
            return new Proxy(item, this.propertyGridProxyValidatorHandler);
        },

        //Handler proxy qui sera utiliser pour gérer la validation et la mise à jour des interfaces en fonction de la modification des propriétés des items
        propertyGridProxyValidatorHandler: {

            set: function (obj, prop, value) {
                //Prendre l'ancienne valeur
                let oldval = obj[prop];

                //Vérifier les conditions de validité sur le nom
                if (prop === 'name' && (oldval != value)) {

                    if (!value) {
                        throw new ReferenceError( app.localize('EmptyNameForbidden'));
                        return false;
                    }
               
                }
            

                // The default behavior to store the value
                obj[prop] = value;
                      
                if (prop === 'name') {
                    //Renommer dans le html
                    $(`[data-menu-item-name="${oldval}"]`).attr('data-menu-item-name', value);

                    if (!obj.displayName) {
                        //Modifier le text
                        $(`li[data-menu-item-name="${obj.name}"]`).find('span[class="menu-text"]').not('[data-menu-item-new="true"]').text(`${app.localize(value)}`);
                    }

                    //Changer le nom chez les items enfants si c'est un group
                    if (obj.itemType == 'menugroup')
                        iamShared.arrays.updateItemsPropertiesByPropertyName(iamApp.appMenu.menuItems, "parentMenuGroupName", oldval, { parentMenuGroupName: value });
                } else {

                    if (prop === 'iconUrl' || prop === 'systemIcon') {
                        //Modifier l'icone dans le html
                        $(`li[data-menu-item-name="${obj.name}"]`).find('span[class="menu-icon"]').not('[data-menu-item-new="true"]').html(`${(obj.iconUrl) ? '<img class="menu-link-icon" src="' + obj.iconUrl + '"/>' : '<i class="menu-link-icon ' + obj.systemIcon + '"></i>'}`);
                    } else {

                        if (prop === 'displayName' ) {
                            //Modifier le text
                            $(`li[data-menu-item-name="${obj.name}"]`).find('span[class="menu-text"]').not('[data-menu-item-new="true"]').text(`${value || app.localize(obj.name)}`);
                        }
                    }
                }

                if (prop === 'visible') {
                    let visible = true

                    //Renommer dans le html
                    if (value.toString().toLowerCase() == 'false') {
                        visible = false;
                    }

                    if (visible) {
                        //Modifier le text
                        $(`li[data-menu-item-name="${obj.name}"]`).show();
                    } else {
                        $(`li[data-menu-item-name="${obj.name}"]`).hide();
                    }                               
                } 
            
                // Indicate success
                return true;
            }
        },

    
        //Permet de créer ou recréer les items du menu de l'app
        rebuildAppMenu: function (items) {

            var viewerMode = iamApp.viewerMode;

            //remplacer les items du menu si une liste d'élément est passée
            if (items) this.menuItems = items;

            //vider le Ul des items
            $("#" + this.mainMenuUlId).empty();

            let self = this;
            var allowDragAndDrop = true;
            if (viewerMode) allowDragAndDrop = false;

            //Parcourir la liste des items et les créer
            this.menuItems.forEach(function (item) {               

                if (item.itemType == "menuitem") {
                    self.createMenuItem(item.name, item.displayName, item.systemIcon, item.iconUrl, item.parentMenuGroupName, null, false, allowDragAndDrop);
                } else {
                    //itemName, displayName, systemIcon, iconUrl, insertBeforItemName, insertInItemsArray = true, allowDragAndDrop = true
                    
                    self.createMenuGroup(item.name, item.displayName, item.systemIcon, item.iconUrl, null, false, allowDragAndDrop);
                }
            });

            return;
        },

        //Supprimer l'item actif
        deleteItem: function (itemName) {
            let item;
            if (!itemName) {
                if (!this.activeMenuItem) {
                    iamShared.messages.showErrorMsg(app.localize("EmptySelection"));
                    return
                }
                item = this.activeMenuItem;
                itemName = item.name;
            } else {
                item = this.getItemByName(itemName);
            }

            if (item.itemType == "menugroup") {

                let enfants = iamShared.arrays.filterByItemProperty(iamApp.appMenu.menuItems, "parentMenuGroupName", itemName);
                        
                if (enfants && enfants.length > 0) {
                    iamShared.messages.showErrorMsg(app.localize("CannotDeleteMenuGroupWithItems"));
                    return;
                }

                //demander confirmation
                let result = DevExpress.ui.dialog.confirm(`<i>${app.localize("Continue")}</i>`, app.localize("ConfirmDeletion"));
                result.done(function (dialogResult) {
                    if (dialogResult) {
                        //supprimer dans la liste
                        iamShared.arrays.deleteByKey(iamApp.appMenu.menuItems, "name", itemName);
                        //supprimer dans le html
                        $('li[data-menu-item-name="' + item.name + '"]').add($('li[data-menu-item-name="' + item.name + '"]').next()).add($('li[data-menu-item-name="' + item.name + '"]').prev()).remove();
                        iamApp.appMenu.showItemInPropertyGrid(null);
                        return;
                    }
                });

            } else {
                //demander confirmation
                let result = DevExpress.ui.dialog.confirm(`<i>${app.localize("Continue")}</i>`, app.localize("ConfirmDeletion"));
                result.done(function (dialogResult) {
                    if (dialogResult) {
                        //supprimer dans la liste
                        iamShared.arrays.deleteByKey(iamApp.appMenu.menuItems, "name", itemName);
                        //supprimer dans le html
                        $('li[data-menu-item-name="' + item.name + '"]').add($('li[data-menu-item-name="' + item.name + '"]').next()).add($('li[data-menu-item-name="' + item.name + '"]').prev()).remove();
                        iamApp.appMenu.showItemInPropertyGrid(null);
                        return;
                    }
                });
            }
        },

        //Charger la page liée à l'item ou exécuter l'action du lien.
        launchMenuItemLink: function (menuItem, isMobileDevice=false) {

            //menuItem est de la forme : { name: itemName, displayName: displayName, itemType: "menuitem", systemIcon: systemIcon, iconUrl: iconUrl, parentMenuGroupName: parentMenuGroupName, visibility: null, actionType:null, actionValue:null }

            //Sortir si le type n'est pas un menuitem
            if (menuItem.itemType != "menuitem" ) return;

            if (!menuItem.actionValue) {
                iamShared.messages.showWarningMsg(((app && app.localize) ? app.localize("NoLinkOrActionSpecifiedForThisItem") : iamShared.strings.convertToTitleCase("NoLinkOrActionSpecifiedForThisItem")));
                return;
            }

            var path = null;

            switch (menuItem.actionType){
                case "ENTITY":
                    
                    break;
                case "WEB RESOURCE":
                    break;
                case "URL":
                    break;

                default: {
                    //lancer la page
                    path = iamApp.rootPath + 'Viewers/Page?uniqueName=' + menuItem.actionValue;

                    //Vérifier si c'est un périphérique mobile sur l'app mobile qui lance la page
                    if (isMobileDevice) {

                    } else {
                        //charger le lien dans le Iframe principal de l'app
                        $('#iamMainIF').attr('src', path);
                    }
                   
                    break;
                }
            }
        },

        //Permet de créer les interactions du mode design sur les items du menus ainsi que le drag and drop
        activateViewerMode: function () {

            var that = this;

            //Lancer la page ou l'action lors du click sur un item
            $(document).on('click', 'li[class*="menu-item-submenu"]', function (e) {
                //Empecher la propagation de l'évènement vers les éléments supérieurs
                e.stopPropagation();

                let menuGrpName = $(this).attr("data-menu-group-name");

                //Prendre le nom de l'item
                let itemName = $(this).attr("data-menu-item-name");

                var menuItem;
                if (!itemName) {
                    //Sortir si l'item n'est pas retrouvé
                    return;
                } else {
                    iamApp.appMenu.setActiveItem(itemName)
                    //Retrouver l'item lié au menu link sur lequel on a cliqué
                    menuItem = iamApp.appMenu.getItemByName(itemName);

                    //lancer la page ou l'action configurer
                    that.launchMenuItemLink(menuItem);
                }

            });

                        
        },

        //Permet de créer les interactions du mode design sur les items du menus ainsi que le drag and drop
        activateDesignMode: function () {

            //Permettre la création d'un nouvel item au click sur new item interne
            $(document).on('click', 'a[data-menu-item-new="true"]', function (e) {
                //Empecher la propagation de l'évènement vers les éléments supérieurs
                e.stopPropagation();

                let menuGrpName = $(this).attr("data-menu-group-name");
                let itemName = "item_" + iamShared.utils.guidString().replaceAll("-", "");

                let newItem = iamApp.appMenu.createMenuItem(itemName, "New Item", null, null, menuGrpName, null, true, true);

                if (newItem) iamApp.appMenu.showItemInPropertyGrid(itemName);
            });

            //Afficher le menuItem dans les propriétés et l'activer visuellement
            $(document).on('mousedown', 'li[class*="menu-item-submenu"]', function (e) {
                //Empecher la propagation de l'évènement vers les éléments supérieurs
                e.stopPropagation();

                //sortir en cas de clic sur l'item de création des sous éléments "New Item" de chaque groupe
                if ($(this).attr("data-menu-item-new")) return;

                //Prendre le nom de l'item
                let itemName = $(this).attr("data-menu-item-name");

                //Afficher dans le propertyGrid
                iamApp.appMenu.showItemInPropertyGrid(itemName);
            });

            //Par defaut, il est impossible de déposer un élément sur un autre donc cette fonction active la possibilité
            $(document).on('dragover', 'li[droppable="true"]', function (e) {
                e.stopPropagation();
                e.preventDefault();

                let $item;

                if ($(this).is('li')) {
                    $item = $(this);
                } else {
                    if ($(this).is('a')) {
                        $item = $(this).parent();
                    } else {
                        //c'est le span du libellé ou de l'image                    
                        $item = $(this).parent().parent();
                    }
                }

                let item = iamApp.appMenu.getItemByName($item.attr("data-menu-item-name"));

                //Si l'objet est sur lui même sortir
                if (iamApp.appMenu.activeMenuItem && $item.attr("data-menu-item-name") == iamApp.appMenu.activeMenuItem.name) return;

                //gérer l'apparence pour le menu Group
                if (!item || (item && item.itemType == "menugroup")) {
                    if (!$item.hasClass("ia-appmenu-group-dragover")) $item.addClass("ia-appmenu-group-dragover");
                    return;
                }

                //sortir si l'objet a déjà la classe
                if ($item.hasClass("ia-appmenu-item-dragover")) return;

                $item.addClass("ia-appmenu-item-dragover");
            });

            //signaler de façon visuel la possibilité de drop dans cette zone
            $(document).on('dragover', 'li[data-menu-item-type="menuitem"]', function (e) {
                //Empecher la propagation de l'évènement vers les éléments supérieurs
                e.stopPropagation();

                let $item;

                if ($(this).is('li')) {
                    $item = $(this);
                } else {
                    if ($(this).is('a')) {
                        $item = $(this).parent();
                    } else {
                        //c'est le span du libellé ou de l'image                    
                        $item = $(this).parent().parent();
                    }
                }
                let item = iamApp.appMenu.getItemByName($item.attr("data-menu-item-name"));

                //Sortir si l'objet sur lequel on est est un menu Group
                if (!item || (item && item.itemType == "menugroup")) return;

                //Si l'objet est sur lui même sortir
                if (iamApp.appMenu.activeMenuItem && $item.attr("data-menu-item-name") == iamApp.appMenu.activeMenuItem.name) return;

                //sortir si l'objet a déjà la classe
                if ($item.hasClass("ia-appmenu-item-dragover")) return;

                $item.addClass("ia-appmenu-item-dragover");
            });

            //Reprendre l'aspect normal de la zone
            $(document).on('dragleave', 'li[data-menu-item-type*="menu"]', function (e) {
                //Empecher la propagation de l'évènement vers les éléments supérieurs
                e.stopPropagation();

                //retirer la classe du over
                if ($(this).hasClass("ia-appmenu-item-dragover")) $(this).removeClass("ia-appmenu-item-dragover");
                if ($(this).hasClass("ia-appmenu-group-dragover")) $(this).removeClass("ia-appmenu-group-dragover");
            });

            //gérer le déposer sur la zone
            $(document).on('drop', 'li .ia-appmenu-droppable-separator', function (e) {

                e.preventDefault();
                e.stopPropagation();

                if ($(this).hasClass("ia-appmenu-droppable-separator-dragover")) $(this).removeClass("ia-appmenu-droppable-separator-dragover");

                let next = $(this).next();

                //vérifier si le prochain sibling est un seperator
                if (next.hasClass('ia-appmenu-droppable-separator')) {
                    let insertBeforItemName = next.next().attr('data-menu-item-name');                
                    iamApp.appMenu.repositionItemOrGroup(null, insertBeforItemName, null, next, false);
                    return;
                }

                //vérifier si le prochain sibling est un item
                if (next.hasClass('menu-item-submenu')) {
                    let insertBeforItemName = next.attr('data-menu-item-name');
                    alert("next is item " +  insertBeforItemName);
                    iamApp.appMenu.repositionItemOrGroup(null, insertBeforItemName, null, $(this), false);
                    return;
                }

                //aucun sibling donc positionner l'élément en bas
                let insertAfterItemName = $(this).prev().attr('data-menu-item-name');
                iamApp.appMenu.repositionItemOrGroup(null, insertAfterItemName, null,$(this), true);
                return;

            });

       
            //gérer le déposer sur un groupe
            $(document).on('drop', 'li[class*="menu-item-submenu"] [droppable="true"]', function (e) {
                        
                e.preventDefault();
                e.stopPropagation();
                       
                //Prendre le nom de l'item
                let itemName;
                let $item;

                if ($(this).is('li')) {
                    $item = $(this);
                } else {
                    if ($(this).is('a')) {
                        $item = $(this).parent();
                    } else {
                        //c'est le span du libellé ou de l'image                    
                        $item = $(this).parent().parent();
                    }
                }

                itemName = $item.attr("data-menu-item-name");

                if ($item.attr("data-menu-item-type") == "menugroup") {
                    //repositionner l'item actif dans le groupe
                    iamApp.appMenu.repositionItemOrGroup(null, null, itemName);
                } else {
                    //repositionner l'item actif au dessus de l'item en cours
                    iamApp.appMenu.repositionItemOrGroup(null, itemName, null, $item);

                    //retirer la classe du over
                    if ($item.hasClass("ia-appmenu-item-dragover")) $item.removeClass("ia-appmenu-item-dragover");
                }
                     
            });


        },

        //Permet d'afficher l'item dont le nom est passé dans le propertyGrid
        showItemInPropertyGrid : function (itemName) {
            //Afficher les propriété de l'item
            let item = (itemName) ? iamApp.appMenu.setActiveItem(itemName): null;

            if (item) {
                let objectConfigurationName = (item.itemType == "menuitem") ? "menuItemConfiguration" : "menuGroupConfiguration";
                let configArray = (item.itemType == "menuitem") ? iamApp.appMenu.configurationData.menuItemConfiguration : iamApp.appMenu.configurationData.menuGroupConfiguration;

                //
                iamQF.showObjectProperties(iamApp.appMenu.getItemPropertyGridProxy(item), objectConfigurationName, configArray, "iamPropertyGridContainer", true);
            } else {
                iamQF.showObjectProperties(null, "menuItemConfiguration", iamApp.appMenu.configurationData.menuItemConfiguration, "iamPropertyGridContainer", true);
            }

            return;
        },

        //Fonction de création des menus 
        repositionItemOrGroup: function (itemName, insertBeforOrAfterItemName, parentMenuGroupName, jQueryNewPositionElement, insertAfter=false) {
        
            var item;
            if (!itemName) {
                item = iamApp.appMenu.activeMenuItem;
            } else {
                item = iamApp.appMenu.getItemByName(itemName);
            }

            //Sortir si l'item est non retrouvé
            if (!item) {
                return;
            }

            //let $topLi = $('li[data-menu-item-name="' + item.name + '"]').prev();
            //let $bottomLi = $('li[data-menu-item-name="' + item.name + '"]').next();
            let $item = $('li[data-menu-item-name="' + item.name + '"]');

            //Si vérifier si le nouvel élément doit être inséré avant un item existant
            if (!insertBeforOrAfterItemName) {

                //Déplacer au dessus du parentMenuGroupName
                if (item.itemType == "menugroup") {
                
                    //Repositionner le groupe dans le array
                    iamShared.arrays.repositionItemBeforeByKey(this.menuItems, "name", item.name, parentMenuGroupName);
                     //déplacer le html de l'item
                    $('li[data-menu-item-name="' + parentMenuGroupName + '"]').before($item);

                } else {
                    //intégrer en dernière position dans le groupe parentMenuGroupName               
                    let lastItem = iamShared.arrays.findLastItemByPropertyName(this.menuItems, "parentMenuGroupName", parentMenuGroupName);
                    item.parentMenuGroupName = parentMenuGroupName;
                                
                    if (lastItem) {
                        iamShared.arrays.repositionItemAfterByKey(this.menuItems, "name", item.name, lastItem.name);
                        $('li[data-menu-item-name="' + lastItem.name + '"]').after($item);
                    } else {
                        //Pas de lastItem donc group de destination vide (sans item). déplacer dans le groupe
                        iamShared.arrays.repositionItemAfterByKey(this.menuItems, "name", item.name, parentMenuGroupName);
                        $('ul[data-menu-item-name="' + parentMenuGroupName + '"]').append($item);
                    }
                }

            } else {

                let insertBeforOrAfterItem = this.getItemByName(insertBeforOrAfterItemName);

                //Déplacer au dessus du parentMenuGroupName
                if (item.itemType == "menugroup") {

                    if (insertBeforOrAfterItem.parentMenuGroupName) {
                        iamShared.messages.showErrorMsg(app.localize("CannotInsertMenuGroupIntoMenuGroup"));
                    } else {

                        if (insertAfter) {
                            iamShared.arrays.repositionItemAfterByKey(this.menuItems, "name", item.name, insertBeforOrAfterItem.name);
                            if (jQueryNewPositionElement) {     
                            
                                jQueryNewPositionElement.after($item);
                            }
                        } else {

                            iamShared.arrays.repositionItemBeforeByKey(this.menuItems, "name", item.name, insertBeforOrAfterItem.name);
                            if (jQueryNewPositionElement) {
                                jQueryNewPositionElement.before($item);
                           
                            }
                        }
                    
                    }                

                } else {
                    //Récupérer le groupe parentMenuGroupName de l'élément avant qui insérer
                    item.parentMenuGroupName = insertBeforOrAfterItem.parentMenuGroupName;

                    if (insertAfter) {
                    
                        iamShared.arrays.repositionItemAfterByKey(this.menuItems, "name", item.name, insertBeforOrAfterItem.name);
                        if (jQueryNewPositionElement) {
                        
                            jQueryNewPositionElement.after($item);
                            //jQueryNewPositionElement.html("<span>After</span>");
                        }

                    } else {
                                   
                        iamShared.arrays.repositionItemBeforeByKey(this.menuItems, "name", item.name, insertBeforOrAfterItem.name);
                        if (jQueryNewPositionElement) {
                            jQueryNewPositionElement.before($item);  
                            //jQueryNewPositionElement.html("<span>before</span>");
                        }
                    }
                
                
                }
            }

            return;
        },

        //Fonction de création des menus 
        createMenuItem: function (itemName, displayName, systemIcon, iconUrl, parentMenuGroupName, insertBeforItemName, insertInItemsArray = true, allowDragAndDrop = true) {

            if (!iconUrl && !systemIcon) systemIcon = "flaticon-more";

            let menuUlId = this.mainMenuUlId;

            let itemTemplate =
                `
                <li data-menu-item-type="menuitem" data-menu-item-name="${itemName}" class="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover"  droppable="${allowDragAndDrop}" draggable="${allowDragAndDrop}">
                    <a class="menu-link" role="menuitem" aria-haspopup="true" aria-expanded="false" droppable="${allowDragAndDrop}">
                        <span class="menu-item-here"></span>
                        <span class="menu-icon" droppable="${allowDragAndDrop}">
                            ${(iconUrl) ? '<img class="menu-link-icon" src="' + iconUrl + '"/>' : '<i class="menu-link-icon ' + systemIcon + '"></i>'}
                        </span>
                        <span class="menu-text" droppable="${allowDragAndDrop}">
                            ${displayName || app.localize(itemName)}
                        </span>
                    </a>
                </li>
           
                `;

            var newItem = { name: itemName, displayName: displayName, itemType: "menuitem", systemIcon: systemIcon, iconUrl: iconUrl, parentMenuGroupName: parentMenuGroupName, visibility: null, actionType:null, actionValue:null };
               
            //Si vérifier si le nouvel élément doit être inséré avant un item existant
            if (!insertBeforItemName) {
                //Insérer en fin de liste du parent
                if (insertInItemsArray) this.menuItems.push(newItem);

                //Ajouter dans le Html
                if (!parentMenuGroupName) {
                    //Insérer dans le menu principal
                    $("#" + menuUlId).append(itemTemplate);

                } else {
                    $('ul[data-menu-item-name="' + parentMenuGroupName + '"]').append(itemTemplate);
                }

            } else {

                //Insérer juste avant l'item adéquat
                if (insertInItemsArray) iamShared.arrays.insertBeforeElementByKey(this.menuItems, "name", insertBeforItemName, newItem);

                //Insérer le html au dessus du li de l'item insertBeforItemName
                $('li[data-menu-item-name="' + insertBeforItemName + '"]').before(itemTemplate);

            }

            //prendre le nouvel élément comme item actif
            if (insertInItemsArray) this.activeMenuItem = newItem;
            return newItem;

        },

        //Fonction de création des menus 
        createMenuGroup: function (itemName, displayName, systemIcon, iconUrl, insertBeforItemName, insertInItemsArray = true, allowDragAndDrop = true) {

            if (!iconUrl && !systemIcon) systemIcon = "flaticon2-down";

            let menuUlId = this.mainMenuUlId;

            let itemTemplate =
                `<li data-menu-item-type="menugroup" data-menu-item-name="${itemName}" class="menu-item menu-item-submenu  " aria-haspopup="true" data-menu-toggle="hover" draggable="${allowDragAndDrop}" droppable="${allowDragAndDrop}">
                    <a href="#" class="menu-link menu-toggle" role="menuitem" aria-haspopup="true" aria-expanded="false" tabindex="-1" droppable="${allowDragAndDrop}">
                        <span class="menu-item-here"></span>
                        <span class="menu-icon" droppable="${allowDragAndDrop}">
                            ${(iconUrl) ? '<img class="menu-link-icon" src="' + iconUrl + '"/>' : '<i class="menu-link-icon ' + systemIcon + '"></i>'}
                        </span>
                        <span class="menu-text" droppable="${allowDragAndDrop}">
                            ${displayName || app.localize(itemName)}
                        </span>
                        <i class="menu-arrow"></i>
                    </a>
                    <nav class="menu-submenu">
                        <span class="menu-arrow"></span>
                        <ul data-menu-item-name="${itemName}" class="menu-subnav" role="menu">				        
                             <li data-menu-item-new="true" class="menu-item menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover">
                                <a data-menu-item-new="true" data-menu-group-name="${itemName}" role="menuitem" aria-haspopup="true" aria-expanded="false" tabindex="1" class="menu-link" >
                                    <span class="menu-item-here"></span>
                                    <span data-menu-item-new="true" class="menu-icon" >
                                        <i class="menu-link-icon flaticon2-plus"></i>
                                    </span>
                                    <span data-menu-item-new="true" class="menu-text" style="color:blue">
                                        ${app.localize("AddMenuItem")}
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </li>           
                `;

            //Utiliser un template sans ajout de nouvel élément pour le mode viewzer
            if (iamApp.viewerMode) {
                itemTemplate =
                    `<li data-menu-item-type="menugroup" data-menu-item-name="${itemName}" class="menu-item menu-item-submenu  " aria-haspopup="true" data-menu-toggle="hover" draggable="${allowDragAndDrop}" droppable="${allowDragAndDrop}">
                    <a href="#" class="menu-link menu-toggle" role="menuitem" aria-haspopup="true" aria-expanded="false" tabindex="-1" droppable="${allowDragAndDrop}">
                        <span class="menu-item-here"></span>
                        <span class="menu-icon" droppable="${allowDragAndDrop}">
                            ${(iconUrl) ? '<img class="menu-link-icon" src="' + iconUrl + '"/>' : '<i class="menu-link-icon ' + systemIcon + '"></i>'}
                        </span>
                        <span class="menu-text" droppable="${allowDragAndDrop}">
                            ${displayName || app.localize(itemName)}
                        </span>
                        <i class="menu-arrow"></i>
                    </a>
                    <nav class="menu-submenu">
                        <span class="menu-arrow"></span>
                        <ul data-menu-item-name="${itemName}" class="menu-subnav" role="menu">			        
                             
                        </ul>
                    </nav>
                </li>           
                `;
            }

            var newItem = { name: itemName, displayName: displayName, itemType: "menugroup", systemIcon: systemIcon, iconUrl: iconUrl, parentMenuGroupName: null, visibility: null };

            //Si vérifier si le nouvel élément doit être inséré avant un item existant
            if (!insertBeforItemName) {
                //Insérer en fin de liste du parent
                if (insertInItemsArray) this.menuItems.push(newItem);

                //Insérer dans le menu principal
                $("#" + menuUlId).append(itemTemplate);

            } else {
                if (insertInItemsArray) iamShared.arrays.insertBeforeElementByKey(this.menuItems, "name", insertBeforItemName, newItem);

                //Insérer le html au dessus du li de l'item insertBeforItemName
                $('li[data-menu-item-name="' + insertBeforItemName + '"]').before(itemTemplate);
            }

            //prendre le nouvel élément comme item actif
            if (insertInItemsArray) this.activeMenuItem = newItem;
            return newItem;
        },

        //Objet gérant les  configurations des différents types de controles devant être actualisé via le propertyGrid.
        configurationData:{
            menuItemConfiguration: [
                { "Id": "config_itemType", "Name": "itemType", "Type": "String", "Default": "menuitem", "ReadOnly": true, "AcceptedValues": ["menuitem"], "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "General", "IsRequired": true, "EditorType": null, "EditorOptions": null},

                { "Id": "config_name", "Name": "name", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": null, "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "General", "IsRequired": true, "EditorType": null, "EditorOptions": null},

                { "Id": "config_displayName", "Name": "displayName", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": null, "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "General", "IsRequired": false, "EditorType": null, "EditorOptions": null},

                { "Id": "config_actionType", "Name": "actionType", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": ["ENTITY", "DASHBOARD", "REPORT", "FORM", "CODE", "WEB RESOURCE", "URL"], "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "Action", "IsRequired": false, "EditorType": "dxSelectBox", "EditorOptions": null},

                {
                    "Id": "config_actionValue", "Name": "actionValue", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": function (pGrid, pageWindow) {

                        //Recupérer la valeur de la propriété "actionType" dans le propertyGrid
                        let actionType = pGrid.getPropertyValue("actionType");                    
                        switch (actionType) {
                            case "ENTITY":
                                iamShared.ui.popupShowDataServiceEntitySelection(null, "MagicEntitySelect", null, null, app, null, null, false, function (selectedItems) {
                                    //Modifier la valeur de la propriété "actionValue" dans le propertyGrid depuis la premiere ligne (ligne [0]) de la sélection en utilisant la valeur de la colonne "uniqueName"
                                    pGrid.setPropertyValue("actionValue", selectedItems[0]["uniqueName"])
                                    //console.log(selectedItems);
                                }, null, null, null);
                                break;
                            case "CODE":
                                break;
                            case "WEB RESOURCE":
                                break;
                            case "URL":
                                break;
                            default:
                                iamShared.ui.popupShowDataServiceEntitySelection(null, "MagicPageSelectForHostAndTenantByPageType", { pageTypeId: actionType }, null, app, null, null, false, function (selectedItems) {
                                    //Modifier la valeur de la propriété "actionValue" dans le propertyGrid depuis la premiere ligne (ligne [0]) de la sélection en utilisant la valeur de la colonne "uniqueName"
                                    pGrid.setPropertyValue("actionValue", selectedItems[0]["uniqueName"]);                                
                                }, null, null, null);
                                break;
                        }
                    }, "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "Action", "IsRequired": false, "EditorType": null, "EditorOptions": null
                },

                { "Id": "config_parentMenuGroupName", "Name": "parentMenuGroupName", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": this.menuGroupsGet, "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "General", "IsRequired": false, "EditorType": null, "EditorOptions": null},


                { "Id": "config_systemIcon", "Name": "systemIcon", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": "iamSystemIcon", "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "Style", "IsRequired": false },

                { "Id": "config_iconUrl", "Name": "iconUrl", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": null, "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "Style", "IsRequired": false  },                        

                { "Id": "config_visible", "Name": "visible", "Type": "Boolean | String | function()", "Default": null, "ReadOnly": false, "AcceptedValues": [true, false], "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "Advanced", "IsRequired": false }
            ],

            menuGroupConfiguration: [
                {
                    "Id": "config_itemType", "Name": "itemType", "Type": "String", "Default": "menugroup", "ReadOnly": true, "AcceptedValues": ["menugroup"], "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "General", "IsRequired": true, "EditorType": null, "EditorOptions": null},

                { "Id": "config_name", "Name": "name", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": null, "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "General", "IsRequired": true, "EditorType": null, "EditorOptions": null},

                { "Id": "config_displayName", "Name": "displayName", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": null, "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "General", "IsRequired": false, "EditorType": null, "EditorOptions": null},


                { "Id": "config_systemIcon", "Name": "systemIcon", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": "iamSystemIcon", "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "Style", "IsRequired": false, "EditorType": null, "EditorOptions": null},

                { "Id": "config_iconUrl", "Name": "iconUrl", "Type": "String", "Default": null, "ReadOnly": false, "AcceptedValues": null, "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "Style", "IsRequired": false, "EditorType": null, "EditorOptions": null},

                { "Id": "config_visible", "Name": "visible", "Type": "Boolean | String | function()", "Default": null, "ReadOnly": false, "AcceptedValues": [true, false], "Url": null, "localizationDescriptionName": null, "Description": null, "Category": null, "localizationCategoryName": "Advanced", "IsRequired": false, "EditorType": null, "EditorOptions": null}
            ],


        }
    }

};