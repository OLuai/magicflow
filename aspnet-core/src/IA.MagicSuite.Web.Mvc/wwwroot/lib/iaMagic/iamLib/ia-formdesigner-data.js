// A typical mobile device will report it's width as 320px - 400px. On the screen of a typical computer, an emulated device of this width will look far too big compared to the real, physical device. So we scale all the devices a little bit. Scaling keeps same "width" and "height" so the media queries still work inside the iframes, but they're displayed as smaller.
const scaleModifier = 1;
// A list of devices that we need + a default device. The devicePixelRatio for each device must be looked up on the webs...
const devices = {
    galaxyTab: {
        resX: 800,
        resY: 1280,
        devicePixelRatio: 1
    },
    galaxyS8: {
        resX: 1440,
        resY: 2960,
        devicePixelRatio: 4
    },
    ipad: {
        resX: 1536,
        resY: 2048,
        devicePixelRatio: 2
    },
    iphone7Plus: {
        resX: 1080,
        resY: 1920,
        devicePixelRatio: 3
    },
    iphone4: {
        resX: 640,
        resY: 980,
        devicePixelRatio: 2
    },
    defaultDevice: {
        resX: 640,
        resY: 980,
        devicePixelRatio: 2
    }
};

//iaMagic.UI.ConnectionsComboOption = {
//    dataSource: iaMagic.Data['LinkedDatabases']
//    , showClearButton: true
//    , stylingMode: "outlined"
//    , placeholder: "connection"
//};

var iamImagesPath = "../images/"; //iamPageVariables.path.imagesPath;

//Objet principal permettant de construire la page finale de destination ou de sauvegarder le paramétrage
var iamHForm = {
    //Identifiant du formulaire
    idFormulaire: "test",
    //Nom du formulaire
    nomFormulaire: "test",
    // nom généralement de l'objet edité pour un formulaire de saisir. Il est affiché comme titre dans la barre d'outil du formulaire. Si vide alors le nomFormulaire est affiché comme titre
    nomLiaison: null,
    //type de formulaire
    idType: "HForm",
    //sous type du formulaire. Permet à un formulaire de saisir d'etre par exemple utilisé comme dashboard etc.
    idsType: 'saisir',
    //contenu html de la page pour les templates et autre html personnalisés
    htmlPage: null,
    //contenu js de la page pour les fonctions personnalisées et autres objets spécifiques personnalisée js de la page
    jsPage: null,
    //contenu de la page css de l'utilisateur
    cssPage: null,
    //liste des objets créés dans le formulaire avec leur paramètre
    objectsList: [],
    //contient les différentes vues du formulaire
    views: [],
    //Premet les liaisons des propriétés ou réalisation des formules de calcule
    bindings: [],
    //tableau contenant les actions du formulaire
    actions: [],
    //tableau contenant les fichiers spécifiques du formulaire
    files: [],

    //fonction permettant de retourner la liste des items du form Layout du formulaire
    getFormItems: function (page) {
        //rechercher l'objet "iamContentFormLayout" dans objectsList
        var ligneObj = page.objectsList.find(function (el) {
            return el.nom_objet == "iamContentFormLayout";
        });

        //Retourner un tableau vide si un layout n'est pas trouvé
        if (ligneObj == null) return [];

        var frmOption = ligneObj.option_objet;

        //Retourner un tableau vide si un layout n'est pas trouvé
        if (frmOption == null) return [];

        //retourner les items
        return frmOption.items;
    }

},

    //Variable qui contient la selection faite sur le popup TreeSelector
    iamTreeSelectorSelectedItem = null,

    //Objet de configuration du popup tree de sélection.
    iamTreeSelectorOption = {
        dataStructure: "plain",
        items: [],
        keyExpr: "name",
        parentIdExpr: "id_parent",
        displayExpr: "text",
        searchEnabled: false,
        width: "100%",
        onItemClick: function (e) {
            iamTreeSelectorSelectedItem = e.itemData;
        }
    },

    //function dynamique qui s'exécute lorsqu'on clique sur un item du menu contextuel dynamique
    iamDynamicContentContextMenuCallbackFunction,
    iamDynamicContentContextMenuElementItem,

    //objet de configuration du menu contextuel dynamique
    iamDynamicContentContextMenuOption = {
        disabled: true
        , items: []
        , target: null
        , position: { offset: '0 25' }
        , onHidden: function (e) {
            e.component.option("disabled", true);
            return;
        }
        , onItemClick: function (e) {
            if (e.itemData.action && e.itemData.action === 'function') {
                e.itemData.action(e.itemData);
            } else {
                if (iamDynamicContentContextMenuCallbackFunction) iamDynamicContentContextMenuCallbackFunction(e.itemData);
            }

            return;
        }
    },

    iamDynamicContentContextMenuItemsArrays = {
        iamHFDDataSources: [
            { id: "generer_objets", text: "Générer objets", icon: "far fa-th-list", beginGroup: true }
            , { id: "charger_offline_schema", text: "Charger 'schema' hors ligne", icon: "fas fa-database", beginGroup: true }
            , { id: "charger_sample_data", text: "Charger échantillon de données", icon:"fas fa-table", beginGroup: false }
            , { id: "charger_offline_new_object", text: "Charger 'Objet Nouveau' hors ligne", icon: "fas fa-wifi-slash", beginGroup: false }
        ]
        , iamHFDDataSourcesCallBackFunction: function (itemMenu) {
            if (iamDynamicContentContextMenuElementItem) {

                switch (itemMenu.id) {
                    case "generer_objets": {
                        toolsDataSourceGenererObjets(iamDynamicContentContextMenuElementItem.name, iamDynamicContentContextMenuElementItem.type_controle);
                        break;
                    }
                    case "charger_offline_schema": {
                        toolsDataSourceChargerOfflineSchema(iamDynamicContentContextMenuElementItem.name, iamDynamicContentContextMenuElementItem.type_controle);
                        break;
                    }
                    case "charger_sample_data": {
                        toolsDataSourceChargerSampleData(iamDynamicContentContextMenuElementItem.name, iamDynamicContentContextMenuElementItem.type_controle);
                        break;
                    }
                    case "charger_offline_new_object": {
                        toolsDataSourceChargerOfflineNewObject(iamDynamicContentContextMenuElementItem.name, iamDynamicContentContextMenuElementItem.type_controle);
                        break;
                    }
                }

                //vider le contenu de la sélection
                iamDynamicContentContextMenuElementItem = null;
            }
            return;
        }
    },

    
    //Objet de configuration du grid affiché dans l'edition des sources masterDetails du formulaire
    iamMasterDetailsGridOption = {
        dataSource: null,
        //repaintChangesOnly: true,
        //keyExpr: "nom_table",
        showBorders: true,
        height:"100%",
        paging: {
            enabled: false
        },
        editing: {
            refreshMode: "reshape",
            mode: "batch",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            selectTextOnEditStart: true,
            startEditAction: "click"
        },
        wordWrapEnabled: true,
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;

            e.toolbarOptions.items.unshift(
                {
                    location: "before",
                    widget: "dxButton",
                    options: {
                        icon: iamImagesPath + "general/charger_offline_schema_24.png",
                        hint: "Charger 'schema' hors ligne",
                        onClick: function () {
                            toolsDataSourceChargerOfflineSchema(null, null);
                        }
                    }
                }
                , {
                    location: "before",
                    widget: "dxButton",
                    options: {
                        icon: iamImagesPath + "general/charger_sample_data_24.png",
                        hint: "Charger échantillon de données",
                        onClick: function () {
                            toolsDataSourceChargerSampleData(null, null);
                        }
                    }
                }
                , {
                    location: "before",
                    widget: "dxButton",
                    options: {
                        icon: iamImagesPath + "general/charger_offline_new_object_24.png",
                        hint: "Charger 'Objet Nouveau' hors ligne",
                        onClick: function () {
                            toolsDataSourceChargerOfflineNewObject(null, null);
                        }
                    }
                }
                , {
                    location: "before",
                    widget: "dxButton",
                    options: {
                        icon: "far fa-th-list",
                        hint: "Générer objets",
                        onClick: function () {
                            toolsDataSourceGenererObjets(null, null);
                        }
                    }
                }
            );
        },
        columns: [
            { type: "buttons" },
            {
                dataField: "nom_table",
                caption: "NOM TABLE",
                width: 100
            },
            {
                dataField: "champ_id",
                caption: "CHAMP ID",
                width: 100
            },
            {
                dataField: "champ_id_parent",
                caption: "CHAMP ID PARENT",
                width: 100
            },
            {
                dataField: "deny_insert",
                dataType: 'boolean',
                caption: "REFUSER INSERT",
                width: 90
            },
            {
                dataField: "deny_update",
                dataType: 'boolean',
                caption: "REFUSER UPDATE",
                width: 90
            },
            {
                dataField: "deny_delete",
                dataType: 'boolean',
                caption: "REFUSER DELETE",
                width: 90
            },
            {
                dataField: "select_override",
                caption: "SELECT OVERRIDE",
                width: 200
            },
            {
                dataField: "insert_override",
                caption: "INSERT OVERRIDE",
                width: 200
            },
            {
                dataField: "update_override",
                caption: "UPDATE OVERRIDE",
                width: 200
            },
            {
                dataField: "delete_override",
                caption: "UPDATE OVERRIDE",
                width: 200
            },
            {
                dataField: "offline_schema",
                caption: "OFFLINE SCHEMA",
                width: 300
            },
            {
                dataField: "offline_new_object",
                caption: "OFFLINE NEW OBJECT",
                width: 300
            },
            {
                dataField: "sample_data",
                caption: "SAMPLE DATA",
                width: 550
            }
        ]
    },

    //objet de configuration du grid pour la génération des controles depuis un tableau
    iamGenererObjetsGridOption = {
        dataSource: [],
        showBorders: true,
        paging: {
            enabled: false
        },
        editing: {
            refreshMode: "reshape",
            mode: "batch",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            selectTextOnEditStart: true,
            startEditAction: "click"
        },
        wordWrapEnabled: true,
        width: "100%",
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;

            e.toolbarOptions.items.unshift(
                {
                    location: "before",
                    widget: "dxButton",
                    options: {
                        icon: iamImagesPath + "general/charger_offline_schema_24.png",
                        hint: "Remplacer les objets de la page par la liste des objets du tableau",
                        onClick: function () {
                            toolsDataSourceRemplacerObjetsPage(dataGrid.option("dataSource"));
                        }
                    }
                }
                , {
                    location: "before",
                    widget: "dxButton",
                    options: {
                        icon: iamImagesPath + "general/charger_sample_data_24.png",
                        hint: "Ajouter les objets à ceux existants dans la page",
                        onClick: function () {
                            toolsDataSourceAjouterObjetsPage(dataGrid.option("dataSource"));
                        }
                    }
                }                
            );
        },
        columns: ["nom_champ", "nom_controle"
            , {
                dataField: "type_controle",
                lookup: {
                    dataSource: function () {
                        return iamDesignerControlesTypeItems.filter(function (item) {
                            return item["id_categorie"] != 'FORM ITEMS';
                        });
                    },
                    valueExpr: "type_controle",
                    displayExpr: "nom_controle"
                }
            }
            , {
                dataField: "bindings_property"                
            }
            , {
                dataField: "bindings_value"                
            }
        ]
    },

    //Items des boutons de la barre d'outils pour changer la vue active
    iamHFDToolbarViewsItems = [
        {
            icon: "far fa-window",
            value: "designer",
            hint: "Afficher la vue d'edition dynamique de l'interface utilisateur"
        },
        {
            icon: "far fa-code",
            value: "code",
            hint: "Afficher la zone de code pour editer les fichiers HTML, CSS, et Js liés."
        },
        {
            icon: "far fa-play",
            value: "preview",
            hint: "Afficher la page en mode test"
        }
    ],

    //Items des boutons de la barre d'outils le device actif pour simuler la presentation sur mobile et tablette
    iamHFDToolbarDevicesItems = [
        {
            icon: "far fa-desktop-alt",
            value: "",
            hint: "Desktop"
        },
        {
            icon: "far fa-tablet-alt",
            value: "ipad",
            hint: "Tablette"
        },
        {
            icon: "far fa-mobile-alt",
            value: "iphone7Plus",
            hint: "Smartphone"
        }
    ],



    //SAMPLE DATA *********************************************************************************************************************************************
    //Modèle de données hiérarchique plate avec id_parent
    iamFlatTreeSampleData = [
        { id: "node_1", text: "node 1", details: 'details node 1', id_parent: null }
        , { id: "node_1_1", text: "node 1_1", details: 'details node 1_1', id_parent: "node_1", icon: 'far fa-ellipsis-h' }
        , { id: "node_1_2", text: "node 1_2", details: 'details node 1_2', id_parent: "node_1", icon: 'far fa-minus' }
        , { id: "node_2", text: "node 2", details: 'details node 2', id_parent: null }
        , { id: "node_2_1", text: "node 2_1", details: 'details node 2_1', id_parent: "node_2" }
    ],

    //données test
    iamSampleData = [{ group: "Groupe1", text: "Item1", title: "Item1 Title", value: "15", date: new Date(), icon: 'far fa-ellipsis-h' }, { group: "Groupe1", text: "Item2", title: "Item2 Title", value: "10", date: iamShared.dates.dateAddDays(new Date(), 2), icon: 'far fa-plus' }, { group: "Groupe2", text: "Item3", title: "Item3 Title", value: "6", date: iamShared.dates.dateAddDays(new Date(), 6), icon: 'far fa-minus' }],

    //Données test du diagramme de gantt
    iamSampleDataGantt = [
        { id: 't1', orderId: 1, parentId: null, start: iamShared.dates.dateAddDays(new Date(), -2), end: iamShared.dates.dateAddDays(new Date(), 2), title: "tache1", percentComplete: 75, summary: false, expanded: true }
        , { id: 't2', orderId: 1, parentId: null, start: iamShared.dates.dateAddDays(new Date(), -1), end: iamShared.dates.dateAddDays(new Date(), 10), title: "tache 2 (résumé)", percentComplete: 10, summary: true, expanded: true }
        , { id: 't3', orderId: 1, parentId: 't2', start: iamShared.dates.dateAddDays(new Date(), -1), end: iamShared.dates.dateAddDays(new Date(), 6), title: "tache 3", percentComplete: 20, summary: false, expanded: true }
        , { id: 't4', orderId: 1, parentId: 't2', start: iamShared.dates.dateAddDays(new Date(), 3), end: iamShared.dates.dateAddDays(new Date(), 10), title: "tache 4", percentComplete: 0, summary: false, expanded: true }
    ],

    //Données test des dépendances du diagramme de gantt
    iamSampleDataGanttDependencies = [{ id: "1", predecessorId: 't1', successorId: 't2', type: 1 }],

    //FIN SAMPLE DATA -----------------------------------------------------------------------------------------------------------------------------------------------------------


    //Eléments du moore (plus...) du menu du designer
    iamDesignerMenuTransfererItems = [

        { id: "iamexport_page_zip", text: "Expoter page entière Zip", icon: "fas fa-file-archive" },
        { id: "iamexport_page_json", text: "Exporter page entière JSON", icon: "far fa-file-code"},
        { id: "iamexport_html", text: "Exporter code HTML", icon: "far fa-file-code", beginGroup: true },
        { id: "iamexport_css", text: "Exporter code CSS", icon:  "fas fa-css3-alt" },
        { id: "iamexport_js", text: "Exporter code Js", icon: "fas fa-js" },
        { id: "iamimport_page_zip", text: "Importer page entière Zip", icon: "fas fa-file-archive", beginGroup: true },
        { id: "iamimport_page_json", text: "Importer page entière JSON", icon: "far fa-file-code" },
        { id: "iamfusion_page_zip", text: "Fusionner page entière Zip", icon: "fas fa-file-archive", beginGroup: true },
        { id: "iamfusion_page_json", text: "Fusionner page entière JSON", icon: "far fa-file-code" },
        { id: "iamfusion_html", text: "Fusionner code Html", icon: "far fa-file-code", beginGroup: true },
        { id: "iamfusion_css", text: "Fusionner code CSS", icon: "fas fa-css3-alt" },
        { id: "iamfusion_js", text: "Fusionner code Js", icon: "fas fa-js" }
    ],

    // This is the customTypes object that describes additionnal types, and their renderers (optional)
    iamDesignerPropertyGridCustomTypes = {
        ref: { // name of custom type
            html: function (elemId, name, value, meta) { // custom renderer for type (required)
                var onclick = '';
                valueHTML = value + ' <i class="fa fa-external-link" onclick="selectRef(\'' + value + '\')"></i>';
                return valueHTML;
            },
            valueFn: false // value-return function (optional). If unset, default will be "function() { return $('#' + elemId).val(); }", set to false to disable it
            // You can also put a makeValueFn function (taking elemId, name, value, meta parameters) to create value-return function on the fly (it will override valuefn setting), returning non-function will disable getting value for this property
        },
        datasource: { // name of custom type
            html: function (elemId, name, value, meta) { // custom renderer for type (required)
                var onclick = '';
                valueHTML = "<button class='ui-button ui-widget ui-corner-all' onclick=\"propertyGridButtonClick('datasource','" + value + "')\">Edit...</button>";
                return valueHTML;
            },
            valueFn: false // value-return function (optional). If unset, default will be "function() { return $('#' + elemId).val(); }", set to false to disable it
            // You can also put a makeValueFn function (taking elemId, name, value, meta parameters) to create value-return function on the fly (it will override valuefn setting), returning non-function will disable getting value for this property
        },
        sqlSources: { // name of custom type
            html: function (elemId, name, value, meta) { // custom renderer for type (required)
                var onclick = '';
                valueHTML = "<button class='ui-button ui-widget ui-corner-all' onclick=\"propertyGridButtonClick('sqlSources','" + value + "')\">Edit...</button>";
                return valueHTML;
            },
            valueFn: false
        },
        name: {
            html: function (elemId, name, value, meta) { // custom renderer for type (required)
                var onclick = '';
                valueHTML = "<button class='ui-button ui-widget ui-corner-all' onclick=\"propertyGridButtonClick('name','" + value + "')\">...</button><span> " + value + "</span>";
                return valueHTML;
            },
            valueFn: false
        },
        buttonEdit: {
            html: function (elemId, name, value, meta) { // custom renderer for type (required)
                var onclick = '';
                valueHTML = "<button class='ui-button ui-widget ui-corner-all' onclick=\"propertyGridButtonEditClick('" + elemId + "','" + name + "','" + value + "')\">...</button><span> " + value + "</span>";
                return valueHTML;
            },
            valueFn: false
        },
        readonly: { // name of custom type
            html: function (elemId, name, value, meta) { // custom renderer for type (required)
                var onclick = '';
                valueHTML = "<span>" + value + "</span>";
                return valueHTML;
            },
            valueFn: false // value-return function (optional). If unset, default will be "function() { return $('#' + elemId).val(); }", set to false to disable it
            // You can also put a makeValueFn function (taking elemId, name, value, meta parameters) to create value-return function on the fly (it will override valuefn setting), returning non-function will disable getting value for this property
        }
    },

    //Options du propertyGrid
    iamDesignerPropertyGridOptions = {
        meta: null,
        customTypes: iamDesignerPropertyGridCustomTypes,
        // default help "icon" is text in brackets, can also provide FontAwesome HTML for an icon (see examples)
        helpHtml: '[?]',
        callback: null,
        // Allow collapsing property group. default to false.
        isCollapsible: true,
        // Sort properties, accept boolean or a sort function. default to false.
        sort: true,
    },

    //Tabpanel de configuration et controles
    iamTabPanelItems = [{
        title: 'Propriétés',
        html: '<div id="iamDesignerPropertyGrid"></div>',
        name: 'iamDesignerPropertyGridTabPanelItem',
        icon: 'far fa-grip-vertical'
    }, {
        title: 'Outils',
        html: '<div id="iamDesignerAccordion" ></div>',
        name: 'iamDesignerAccordionTabPanelItem',
        icon: 'far fa-tools'
    }, {
        title: 'Dictionnaire',
        html: '<div id="iamDesignerDictionnaire"></div>',
        name: 'iamDesignerDictionnaireTabPanelItem',
        icon: 'far fa-project-diagram'
    }],

    

//Eléments du menu du designer
iamDesignerMenuItems = [                    
                    {
                        text: "Codes barre"
                        , items: [
                            { id: "kendoBarcode", text: "Barcode", icon:null},
                            { id: "kendoQRCode", text: "QRCode" }
                        ]
                    },                   
                    
                    {
                        text: "Divers", beginGroup: true
                        , items: [
                            { id: "kendoMediaPlayer", text: "MediaPlayer", icon: null }
                        ]
                    }
],

//Elements du menu contextuel du form layout
iamContentFormLayoutContextMenuItems = [
    { id: "customize_tree", text: "Arbre de personnalisation", icon: "far fa-folder-tree" },
    { id: "text_show_hide", text: "Afficher/Masquer Texte", icon: "far fa-eye-slash", beginGroup: true },
    {
        id: "text_location", text: "Emplacement texte", icon: "far fa-arrows",
        items: [
            { id: "text_location_left", text: "A gauche", icon: "spinleft" },
            { id: "text_location_right", text: "A droite", icon: "spinright" },
            { id: "text_location_top", text: "Au dessus", icon: "spinup" }
        ]
    },
    { id: "required", text: "obligatoire *", icon: "far fa-haykal", beginGroup: true },
    { id: "span_more", text: "Elargir (colSpan +)", icon: "far fa-expand-alt", beginGroup: true },
    { id: "span_less", text: "réduire (colSpan -)", icon: "far fa-compress-alt" },

    { id: "create_group", text: "Grouper", icon: "far fa-object-group", beginGroup: true },
    { id: "ungroup", text: "Dissocier", icon: "far fa-object-ungroup" },
    { id: "create_tab", text: "Créer tabulation", icon: null, beginGroup: true },
    { id: "add_tabitem", text: "Ajouter onglet", icon: "fas fa-folder-plus" },
    { id: "add_empty_item", text: "Créer élément vide", icon: "far fa-expand-wide", beginGroup: true },

    { id: "edit_form_properties", text: "Editer propriété Form", icon: "fas fa-wpforms", beginGroup: true },
    { id: "edit_item_properties", text: "Editer propriété item", icon:"far fa-rectangle-wide"},
    { id: "edit_controle_properties", text: "Editer propriété objet lié", icon: "far fa-puzzle-piece" },
    { id: "delete_item", text: "Supprimer Objet/Item", icon: "fas fa-trash", beginGroup: true }
],

//Elements du menu contextuel du form layout
iamContentFormLayoutDesignerPopupMenuItems = [
    { id: "add_object", text: "Ajouter Objet", items: iamDesignerMenuItems, icon: "plus", beginGroup: true },
    { id: "required", text: "obligatoire *", beginGroup: true },
    { id: "span_more", text: "Elargir (colSpan +)", icon: "fas fa-arrows-alt-h", beginGroup: true },
    { id: "span_less", text: "réduire (colSpan -)", icon: "fas fa-compress-alt" },

    { id: "create_group", text: "Grouper", icon: "fas fa-object-group", beginGroup: true },
    { id: "ungroup", text: "Dissocier", icon: "fas fa-object-ungroup" },
    { id: "create_tab", text: "Créer tabulation", icon: "fas fa-tags", beginGroup: true },
    { id: "add_tabitem", text: "Ajouter onglet", icon: "fas fa-folder-plus" },
    { id: "add_empty_item", text: "Créer Elément vide", icon: "fas fa-rectangle-wide", beginGroup: true },

    { id: "delete_item", text: "Supprimer Objet/Item", icon: "fas fa-trash", beginGroup: true }
],


//Liste des catégories des controles
iamDesignerControlesCategories = [
    { id_categorie: 'CONTAINERS', title:'CONTENEURS'}
    , { id_categorie: 'COMMON', title: 'COMMUN' }
    , { id_categorie: 'NAVIGATION', title: 'NAVIGATION' }
    , { id_categorie: 'DATASOURCES', title: 'SOURCES DE DONNEES' }
    , { id_categorie: 'EDITORS', title: 'EDITEURS' }
    , { id_categorie: 'DATA - LISTS', title: 'DONNEES ET LISTES' }
    , { id_categorie: 'DATA VISUALIZATION', title: 'ANALYSE ET STATISTIQUE' }
    , { id_categorie: 'PLANNING', title: 'PLANIFICATION' }
    , { id_categorie: "OTHERS", title: 'AUTRES' }
],

//liste des types d'objets possible à créer
iamDesignerControlesTypeItems = [
    //FormItems
    {
        type_controle: 'dxSimpleItem',
        nom_controle: 'ControlItem',
        tooltip_controle: 'FormLayout Item qui peut contenir les controles',
        id_categorie: 'FORM ITEMS',
        createOptions: function (objID) { return { name: objID,  iaType: 'dxSimpleItem'}},
        getHtml: false,
        createWidget: null,
        getInternalObjectOption: false,
        icon:null,
        meta: dxSimpleItemConfiguration       
    },
    {
        type_controle: 'dxEmptyItem',
        nom_controle: 'EmptyItem',
        tooltip_controle: 'FormLayout Item vide ne peut pas contenir les controles',
        id_categorie: 'FORM ITEMS',
        createOptions: function (objID) { return { name: objID,  iaType: 'dxEmptyItem' }},
        getHtml: false,
        createWidget: null,
        getInternalObjectOption: false,
        icon: null,
        meta: dxEmptyItemConfiguration
    },
    {
        type_controle: 'dxGroupItem',
        nom_controle: 'GroupItem',
        tooltip_controle: "FormLayout Item qui permet de regrouper d'autres FormLayout items",
        id_categorie: 'FORM ITEMS',
        createOptions: function (objID) { return { name: objID,  iaType: 'dxGroupItem' }},
        getHtml: false,
        createWidget: null,
        getInternalObjectOption: false,
        icon: null,
        meta: dxGroupItemConfiguration
    },    
    {
        type_controle: 'dxTabItem',
        nom_controle: 'TabItem',
        tooltip_controle: "FormLayout Item qui représente un onglet spécifique dans une tabulation en onglets",
        id_categorie: 'FORM ITEMS',
        createOptions: function (objID) { return { name: objID, iaType: 'dxTabItem' } },
        getHtml: false,
        createWidget: null,
        getInternalObjectOption: false,
        icon: null,
        meta: dxTabItemConfiguration
    },
    {
        type_controle: 'dxtabbedItem',
        nom_controle: 'ControlItem',
        tooltip_controle: 'FormLayout Item qui permet de créer des onglets à partir des GroupItem',
        id_categorie: 'FORM ITEMS',
        createOptions: function (objID) { return { name: objID,  iaType: 'dxtabbedItem' }},
        getHtml: false, //signifie de ne pas utiliser cet élément du tout
        createWidget: null,
        getInternalObjectOption: false,
        icon: null,
        meta: dxTabbedItemConfiguration
    },

    //Conteneurs
    {
        type_controle: 'dxFieldSet',
        nom_controle: 'FieldSet',
        tooltip_controle: 'Form Html simplifié pour smart device',        
        id_categorie: 'CONTAINERS',
        createOptions: function (objID) { return { name: objID, iaType: 'dxFieldSet', dictionnaire_id_categorie: "iamHFDControls" ,items:[], width: "100%" } },
        getHtml: function (objID, objOptions) { return '<div id="'+ objID + '"></div>'; },
        createWidget: function (objID, objOptions) {
            return $("#" + objID);
        },
        getWidget: null,
        getInternalObjectOption: null,
        icon: iamImagesPath + 'controles_medium_white/Fieldset_medium_white.png',
        hide_item_text: true,
        meta: dxFormConfiguration
    }    
    ,{
        type_controle: 'dxForm',
        nom_controle: 'FormLayout',
        tooltip_controle: 'Conteneur de formulaire avec positionnement dynamique',
        id_categorie: 'CONTAINERS',
        createOptions: function (objID) { return { name: objID, iaType: 'dxForm', dictionnaire_id_categorie: "iamHFDControls", width: "100%", showColonAfterLabel: false, labelLocation: "top", minColWidth: 300, colCount: 2, items: [] } },
        getHtml: function (objID, objOptions) { return '<div id="iamContentFormLayout" style="min-height: 100px;"></div>'; }, //elle permet de retourner le html de création du l'objet
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions(); //dupliquer le modèle d'option
            return $("#" + objID).dxForm(objOptions).dxForm("instance");
        },
        getWidget: function (objID, objOptions, removeHtml) { return $("#" + objID).dxForm("instance"); }, //fonction permettant de retourner le widget. est fonction du type de widget
        getInternalObjectOption:null, //utiliser le modèle de base
        deleteWidget: function (objID, objOptions) { //fonction permettant de supprimer le widget
            objOptions = null; $("#" + objID).dxForm("dispose")
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
        }, 
        icon: iamImagesPath + 'controles_medium_white/Form_medium_white.png',
        meta: dxFormConfiguration       
    }
    
    //NAVIGATION
    ,
    {
        type_controle: 'dxActionSheet',
        nom_controle: 'ActionSheet',
        tooltip_controle: "Popup liste de boutons action verticaux",
        id_categorie: 'NAVIGATION',
        //Paramètres de création. Tableau de paramètres permettant de définir des propriétés lors de la création de l'objet depuis un prompt/popup form.
        // function () { return [{ propertyName: "Nom de la propritété a passer en paramètre", promptDisplayText: "Texte affiché à l'utilisateur pour saisir la valeur", propertyValue: valeur par défaut affichée, propertyValueType: type de la propriété.('string','number','date','array','object','function'. si rien n'est spécifé string est utilisé) }]; },
        creationParameters:false, 
        createOptions: function (objID) { return { name: objID, iaType: 'dxActionSheet', dictionnaire_id_categorie: "iamHFDControls", items: iamSampleData }},
        getHtml: function (objID, objOptions) { return '<div id="' + objID  + '"></div>'; }, //elle permet de retourner le html de création du l'objet
        createWidget: function (objID, objOptions) { // fonction exécutée après la création du HTML. permet d'executer un script pour mettre en forme le widget si nécessaire et le retourne
            if (objOptions == null) objOptions = this.createOptions(); //créer le modèle d'option
            return $("#" + objID).dxActionSheet(objOptions).dxActionSheet("instance"); //créer et retourner le widget
        }, 
        getWidget: function (objID, objOptions) { //fonction permettant de retourner le widget. Obligatoire, ne peut etre null ou false
            return $("#" + objID).dxActionSheet("instance");
        },
        getInternalObjectOption: function (objID, objOptions) {//fonction qui permet de retourner le widget telqu'il existe en interne dans le widget. il peut etre différent de l'objet option disponible dans la liste des objets
            this.getWidget(objID, objOptions).option();
        },
        deleteWidget: function (objID, objOptions, removeHtml) {//fonction permettant de supprimer le widget
            //vider l'objet option s'il existe toujours
            objOptions = null;
            //Supprimer les modification typiques de dx du html
            $("#" + objID).dxActionSheet("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        }, 
        setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {//fonction pour mettre à jour une propriété du widget et de son option rattachée. donner null pour laisser l'applicatoin utiliser le modèle ci-dessous par défaut. donner false pour ne pas gérer cette fonctionalité.

            //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
            if (objOptions != null)  objOptions[propertyName] = propertyValue;
            if (recreate) {
                //Supprimer l'objet sans retirer le div de la balise HTML
                this.deleteWidget(objID, objOptions, false);
                //Recréer le widget depuis l'option
                this.createWidget(objID, objOptions);
            } else {
                //mettre à jour les propriété du widget par la fonction option ()
                widget.option(propertyName, propertyValue);
            }
            return;
        },
        icon: '../images/controles_medium_white/ActionSheet_medium_white.png',
        hide_item_text: true,
        meta: dxActionSheetConfiguration

    }
    , {
        type_controle: 'dxButtonGroup',
        nom_controle: 'ButtonGroup',
        tooltip_controle: 'Groupe de bouton action en ligne',
        id_categorie: 'NAVIGATION',
        createOptions: function (objID) { return { name: objID, iaType: 'dxButtonGroup', dictionnaire_id_categorie: "iamHFDControls", items: iamSampleData }},
        getHtml: null, //null donc utiliser la fonction par défaut. Pour annuler complètement l'utilisation de html, donner la valeur 'false'
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxButtonGroup(objOptions).dxButtonGroup("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxButtonGroup("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxButtonGroup("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty:null, // donner null pour laisser l'application gérer cela (uniquement pour les objets internes magic suite)
        icon: '../images/controles_medium_white/ButtonGroup_medium_white.png',
        hide_item_text:true,
        meta: dxButtonGroupConfiguration

    }
    ,{
        type_controle: 'dxButton',
        nom_controle: 'Button',
        tooltip_controle: 'Bouton action',
        id_categorie: 'NAVIGATION',
        createOptions: function (objID) { return { name: objID, iaType: 'dxButton', dictionnaire_id_categorie: "iamHFDControls", enable: true, text: "Button", icon: "", type: "default" } },
        getHtml: null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxButton(objOptions).dxButton("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxButton("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxButton("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/Button_medium_white.png',
        hide_item_text: true,
        meta:dxButtonConfiguration
                
    }
    , {
        type_controle: "dxDropDownButton",
        nom_controle: 'ButtonList',
        tooltip_controle: 'Bouton avec liste déroulante',
        id_categorie: 'NAVIGATION',
        creationParameters: false,
        createOptions: function (objID) { return { name: objID, iaType: 'dxDropDownButton', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, displayExpr: "name", keyExpr: "id", text: "DROPDOWN BUTTON", useSelectMode: true, width: 200 } },
        getHtml: null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxDropDownButton(objOptions).dxDropDownButton("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxDropDownButton("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxDropDownButton("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/DropDownButton_medium_white.png',
        hide_item_text: true,
        meta: dxDropDownButtonConfiguration
    }
      
    , {
        type_controle: "dxSpeedDialAction",
        nom_controle: 'FloatButton',
        tooltip_controle: "Bouton flottant d'action rapide",
        id_categorie: 'NAVIGATION',
        creationParameters: false,
        createOptions: function (objID) { return { name: objID, iaType: 'dxSpeedDialAction', dictionnaire_id_categorie: "iamHFDControls", icon: "far fa-ellipsis-h", hint:"Aide contextuelle du bouton" } },
        getHtml: null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxSpeedDialAction(objOptions).dxSpeedDialAction("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxSpeedDialAction("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxSpeedDialAction("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/FloatingActionButton_medium_white.png',
        hide_item_text: true,
        meta: dxSpeedDialActionConfiguration
        
    }
    , {
        type_controle: "dxContextMenu",
        nom_controle: 'ContextMenu',
        tooltip_controle: 'Menu contextuel',
        id_categorie: 'NAVIGATION',
        creationParameters: function () { return [{propertyName:"target", promptDisplayText:"Objet source", propertyValue:null, propertyValueType:'string'}];}, //parametres prompt avant création
        createOptions: function (objID) { return { name: objID, iaType: 'dxContextMenu', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, width:200} },
        getHtml: null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxContextMenu(objOptions).dxContextMenu("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxContextMenu("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxContextMenu("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/ContextMenu_medium_white.png',
        hide_item_text: true,
        meta: dxContextMenuConfiguration
    }
    , {
        type_controle: "dxTreeView",
        nom_controle: 'TreeView',
        tooltip_controle: 'Arborescence',
        id_categorie: 'NAVIGATION',
        creationParameters: false,
        createOptions: function (objID) { return { name: objID, iaType: 'dxTreeView', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamFlatTreeSampleData, dataStructure: "plain", displayExpr:"text", keyExpr:"id", parentIdExpr:"id_parent", height:"500px", width:"100%" } },
        getHtml: null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxTreeView(objOptions).dxTreeView("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxTreeView("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxTreeView("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/TreeView_medium_white.png',
        hide_item_text: true,
        meta: dxTreeViewConfiguration
    }
    , {
        type_controle: "dxAccordion",
        nom_controle: 'Accordion',
        tooltip_controle: 'Accordéon',
        id_categorie: 'NAVIGATION',
        creationParameters: false,
        createOptions: function (objID) { return { name: objID, iaType: 'dxAccordion', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, collapsible: true, multiple: true, height: "500px", width: "100%"}},
        getHtml: null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxAccordion(objOptions).dxAccordion("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxAccordion("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxAccordion("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/Accordion_medium_white.png',
        hide_item_text: true,
        meta: dxAccordionConfiguration
    }

    //DATASOURCES
    , {
        type_controle: 'iaMasterDetailsDS',
        nom_controle: 'MasterDetails',
        tooltip_controle: 'Source principale de données en Master simple ou Master-Details',
        id_categorie: 'DATASOURCES',
        createOptions: function (objID) { return { name: objID, iaType: 'iaMasterDetailsDS', dictionnaire_id_categorie: "iamHFDDataSources", sqlSources: [], connection: null} },
        getHtml: false,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return window[objID];
        },
        getWidget: function (objID, objOptions) { return window[objID]; },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; delete window[objID];            
            return;
        },
        setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {
            //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
            if (objOptions != null) objOptions[propertyName] = propertyValue;
            if (recreate) {
                //Supprimer l'objet sans retirer le div de la balise HTML
                this.deleteWidget(objID, objOptions, false);
                //Recréer le widget depuis l'option
                this.createWidget(objID, objOptions);            
            }
            return;
        },
        icon: '../images/controles_medium_white/iaMasterDetailsDS_medium_white.png',
        meta: iaMasterDetailsDS
    }
    , {
        type_controle: 'iaDirectSQLDS',
        nom_controle: 'DirectSQL',
        tooltip_controle: 'Source de données avec expression SQL directement spécifiée',
        id_categorie: 'DATASOURCES',
        createOptions: function (objID) { return { name: objID, iaType: 'iaDirectSQLDS', dictionnaire_id_categorie: "iamHFDDataSources", sql:null , connection:null } },
        getHtml: false,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return window[objID];
        },
        getWidget: function (objID, objOptions) { return window[objID]; },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; delete window[objID];
            return;
        },
        setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {
            //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
            if (objOptions != null) objOptions[propertyName] = propertyValue;
            if (recreate) {
                //Supprimer l'objet sans retirer le div de la balise HTML
                this.deleteWidget(objID, objOptions, false);
                //Recréer le widget depuis l'option
                this.createWidget(objID, objOptions);
            }
            return;
        },
        icon: '../images/controles_medium_white/iaDirectSQL_medium_white.png',
        meta: iaDirectSQLDS
    }, {
        type_controle: 'dxDataSource',
        nom_controle: 'MFDataSource',
        tooltip_controle: "Source de données MultiFonction (MF) permettant d'organiser (grouper, filtrer, ordonner et transformer) les données de différentes origines (JSON service, localStore, array, OData, BreezeJS, etc.)",
        id_categorie: 'DATASOURCES',
        createOptions: function (objID) { return { name: objID, iaType: 'dxDataSource', dictionnaire_id_categorie: "iamHFDDataSources", paginate: false , filter: null , sort: null} },
        getHtml: false,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return window[objID];
        },
        getWidget: function (objID, objOptions) { return window[objID]; },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; delete window[objID];
            return;
        },
        setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {
            //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
            if (objOptions != null) objOptions[propertyName] = propertyValue;
            if (recreate) {
                //Supprimer l'objet sans retirer le div de la balise HTML
                this.deleteWidget(objID, objOptions, false);
                //Recréer le widget depuis l'option
                this.createWidget(objID, objOptions);
            }
            return;
        },
        icon: '../images/controles_medium_white/DataSource_medium_white.png',
        //meta: iaMasterDetailsDS
    }


    //COMMON
    ,{
        type_controle: 'dxProgressBar',
        nom_controle: 'ProgressBar',
        tooltip_controle: 'Barre de progression',
        id_categorie: 'COMMON',
        createOptions: function (objID) { return { name: objID, iaType: 'dxProgressBar', dictionnaire_id_categorie: "iamHFDControls", min: 0, max: 100, showStatus: true } },
        getHtml: null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxProgressBar(objOptions).dxProgressBar("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxProgressBar("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxProgressBar("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/ProgressBar_medium_white.png',
        meta:dxProgressBarConfiguration
     }
    ,{
        type_controle: 'HtmlString',
        nom_controle: "Html",
        createOptions: function (objID) { return { name: objID, iaType: 'HtmlString', dictionnaire_id_categorie: "iamHFDControls", htmlString:"" } },
        tooltip_controle: "Chaine Html pouvant contenir n'importe quelle struture html valide",
        getHtml:null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).html(objOptions.htmlString);
        },
        getWidget: function (objID, objOptions) { return $("#" + objID); },
        getInternalObjectOption: false,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {
            //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
            if (objOptions != null) objOptions[propertyName] = propertyValue;
            if (recreate) {
                //Supprimer l'objet sans retirer le div de la balise HTML
                this.deleteWidget(objID, objOptions, false);
                //Recréer le widget depuis l'option
                this.createWidget(objID, objOptions);
            } else {
                if (propertyName == 'htmlString') {
                    $("#" + objID).empty().append(propertyValue);
                }
            }
            return;
        },
        id_categorie: 'COMMON',
        icon: '../images/controles_medium_white/Html_medium_white.png'
    }
    , {
        type_controle: 'HtmlFrame',
        nom_controle: "HtmlIFrame",
        createOptions: function (objID) { return { name: objID, iaType: 'HtmlFrame', dictionnaire_id_categorie: "iamHFDControls", height:"500px", src: "" ,width:"100%" } },
        tooltip_controle: "Iframe HTML pour afficher le contenu d'une URL",
        getHtml: function (objID, objOptions) { return '<div id="' + objID + '"><iframe id="#Frame_' + objID + '" src="" style="border:none"></iframe></div>'; },
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();

            //Prendre les propriétés spécifiées dans le config
            Object.keys(objOptions).forEach(function (key) {
                if (key != 'iaType' ) {
                    $("#Frame_" + objID).attr(key, objOptions[key]);
                }
            });
            return $("#Frame_" + objID);
        },
        getWidget: function (objID, objOptions) { return $("#Frame_" + objID) },
        getInternalObjectOption: false,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; //Retirer la balise html si cela à été demandé
            $("#Frame_" + objID).remove();
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        //fonction pour mettre à jour une propriété du widget et de son option rattachée. donner null pour laisser l'applicatoin utiliser le modèle ci-dessous par défaut. false pour ne pas gérer cette fonctionalité.
        setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {

            //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
            if (objOptions != null) objOptions[propertyName] = propertyValue;
            if (recreate) {
                //Supprimer l'objet sans retirer le div de la balise HTML
                this.deleteWidget(objID, objOptions, false);
                //Recréer le widget depuis l'option
                this.createWidget(objID, objOptions);
            } else {
                //mettre à jour les propriété du iframe dans l'attribut
                $("#Frame_" + objID).attr(propertyName, propertyValue);
            }
            return;
        },
        id_categorie: 'COMMON',
        icon: '../images/controles_medium_white/Iframe_medium_white.png'
    }

    //Editors
    , {
        type_controle: 'dxTextBox',
        nom_controle: 'TextBox',
        tooltip_controle: 'Zone de saisie de texte',
        id_categorie: 'EDITORS',
        createOptions: function (objID) { return { name: objID, iaType: 'dxTextBox', dictionnaire_id_categorie: "iamHFDControls", width: "100%"} },
        getHtml: null,
        createWidget: function (objID, objOptions) {
            if (objOptions == null) objOptions = this.createOptions();
            return $("#" + objID).dxTextBox(objOptions).dxTextBox("instance");
        },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxTextBox("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxTextBox("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/TextBox_medium_white.png',
        meta: dxTextBoxConfiguration
    }, {
        type_controle: 'dxAutocomplete',
        nom_controle: 'Autocomplete',
        tooltip_controle: "Zone de saisie de texte avec une liste de suggestion affichée à mesure que l'utilisateur tape",
        id_categorie: 'EDITORS',
        createOptions: function (objID) { return { name: objID, iaType: 'dxAutocomplete', dictionnaire_id_categorie: "iamHFDControls", showClearButton: true, width: "100%" } },
        getHtml: null,
        createWidget: function (objID, objOptions) { return $("#" + objID).dxAutocomplete(objOptions).dxAutocomplete("instance"); },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxAutocomplete("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxAutocomplete("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/Autocomplete_medium_white.png',
        meta: dxTextBoxConfiguration
    }
    , {
        type_controle: 'dxNumberBox',
        nom_controle: 'NumberBox',
        tooltip_controle: 'Zone de saisie numérique',
        id_categorie: 'EDITORS',
        createOptions: function (objID) { return { name: objID, iaType: 'dxNumberBox', dictionnaire_id_categorie: "iamHFDControls", showSpinButtons: true, width: "100%" } },
        getHtml: null,
        createWidget: function (objID, objOptions) { return $("#" + objID).dxNumberBox(objOptions).dxNumberBox("instance"); },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxNumberBox("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxNumberBox("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/NumberBox_medium_white.png',
        meta: dxNumberBoxConfiguration
    }
    , {
        type_controle: 'dxDateBox',
        nom_controle: 'DateBox',
        tooltip_controle: 'Zone de saisie de date et heure',
        id_categorie: 'EDITORS',
        createOptions: function (objID) { return { name: objID, iaType: 'dxDateBox', dictionnaire_id_categorie: "iamHFDControls", type: "datetime", pickerType: "rollers", displayFormat: "dd/MM/yyyy HH:mm", width: "100%" } },
        getHtml: null,
        createWidget: function (objID, objOptions) { return $("#" + objID).dxDateBox(objOptions).dxDateBox("instance"); },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxDateBox("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxDateBox("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/DateBox_medium_white.png',
        meta: dxDateBoxConfiguration
    }
    , {
        type_controle: 'dxSelectBox',
        nom_controle: 'SelectBox',
        tooltip_controle: 'Liste de sélection',
        id_categorie: 'EDITORS',
        createOptions: function (objID) { return { name: objID, iaType: 'dxSelectBox', dictionnaire_id_categorie: "iamHFDControls", displayExpr: "text", valueExpr: "value", dataSource: iamSampleData, width: "100%" } },
        getHtml: null,
        createWidget: function (objID, objOptions) { return $("#" + objID).dxSelectBox(objOptions).dxSelectBox("instance"); },
        getWidget: function (objID, objOptions) { return $("#" + objID).dxSelectBox("instance"); },
        getInternalObjectOption: null,
        deleteWidget: function (objID, objOptions, removeHtml) {
            objOptions = null; $("#" + objID).dxSelectBox("dispose");
            //Retirer la balise html si cela à été demandé
            if (removeHtml) $("#" + objID).remove();
            return;
        },
        setWidgetWidgetProperty: null,
        icon: '../images/controles_medium_white/SelectBox_medium_white.png'
    }
     , {
         type_controle: 'dxCheckBox',
         nom_controle: 'CheckBox',
         tooltip_controle: 'Case à cocher',
         id_categorie: 'EDITORS',
         createOptions: function (objID) { return { name: objID, iaType: 'dxCheckBox', dictionnaire_id_categorie: "iamHFDControls", value: undefined, text: 'text'  } },
         getHtml: null,
         createWidget: function (objID, objOptions) { return $("#" + objID).dxCheckBox(objOptions).dxCheckBox("instance"); },
         getWidget: function (objID, objOptions) { return $("#" + objID).dxCheckBox("instance"); },
         getInternalObjectOption: null,
         deleteWidget: function (objID, objOptions, removeHtml) {
             objOptions = null; $("#" + objID).dxCheckBox("dispose");
             //Retirer la balise html si cela à été demandé
             if (removeHtml) $("#" + objID).remove();
             return;
         },
         setWidgetWidgetProperty: null,
         hide_item_text: true,
         icon: '../images/controles_medium_white/CheckBox_medium_white.png'
     }
     , {
         type_controle: 'dxSwitch',
         nom_controle: 'Switch',
         tooltip_controle: 'Switch',
         id_categorie: 'EDITORS',
         createOptions: function (objID) { return { name: objID, iaType: 'dxSwitch', dictionnaire_id_categorie: "iamHFDControls" } },
         getHtml: null,
         createWidget: function (objID, objOptions) { return $("#" + objID).dxSwitch(objOptions).dxSwitch("instance"); },
         getWidget: function (objID, objOptions) { return $("#" + objID).dxSwitch("instance"); },
         getInternalObjectOption: null,
         deleteWidget: function (objID, objOptions, removeHtml) {
             objOptions = null; $("#" + objID).dxSwitch("dispose");
             //Retirer la balise html si cela à été demandé
             if (removeHtml) $("#" + objID).remove();
             return;
         },
         setWidgetWidgetProperty: null,
         icon: '../images/controles_medium_white/Switch_medium_white.png'
     }
     , {
         type_controle: 'dxRadioGroup',
         nom_controle: 'RadioGroup',
         tooltip_controle: "Groupe d'option radio",
         id_categorie: 'EDITORS',
         createOptions: function (objID) { return { name: objID, iaType: 'dxRadioGroup', dictionnaire_id_categorie: "iamHFDControls", displayExpr: "text", valueExpr: "value", layout: "horizontal", dataSource: iamSampleData, width: "100%" } },
         getHtml: null,
         createWidget: function (objID, objOptions) { return $("#" + objID).dxRadioGroup(objOptions).dxRadioGroup("instance"); },
         getWidget: function (objID, objOptions) { return $("#" + objID).dxRadioGroup("instance"); },
         getInternalObjectOption: null,
         deleteWidget: function (objID, objOptions, removeHtml) {
             objOptions = null; $("#" + objID).dxRadioGroup("dispose");
             //Retirer la balise html si cela à été demandé
             if (removeHtml) $("#" + objID).remove();
             return;
         },
         setWidgetWidgetProperty: null,
         icon: '../images/controles_medium_white/RadioGroup_medium_white.png'
     }
      , {
          type_controle: 'dxTagBox',
          nom_controle: 'TagBox',
          tooltip_controle: "Selection multiple avec affichage en ligne",
          id_categorie: 'EDITORS',
          createOptions: function (objID) { return { name: objID, iaType: 'dxTagBox', dictionnaire_id_categorie: "iamHFDControls", showSelectionControls: true, applyValueMode: "useButtons", displayExpr: "text", valueExpr: "value", layout: "horizontal", dataSource: iamSampleData, width: "100%" } },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxTagBox(objOptions).dxTagBox("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxTagBox("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxTagBox("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/TagBox_medium_white.png'
      }
       , {
           type_controle: 'dxColorBox',
           nom_controle: 'ColorBox',
           tooltip_controle: "Selection de couleur",
           id_categorie: 'EDITORS',
           createOptions: function (objID) { return { name: objID, iaType: 'dxColorBox', dictionnaire_id_categorie: "iamHFDControls"} },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxColorBox(objOptions).dxColorBox("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxColorBox("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxColorBox("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/ColorBox_medium_white.png'
       }
        , {
             type_controle: 'dxTextArea',
             nom_controle: 'TextArea',
             tooltip_controle: "Saisie de zone multiligne (memo)",
             id_categorie: 'EDITORS',
            createOptions: function (objID) { return { name: objID, iaType: 'dxTextArea', dictionnaire_id_categorie: "iamHFDControls", height: 90, width: "100%" } },
             getHtml: null,
             createWidget: function (objID, objOptions) { return $("#" + objID).dxTextArea(objOptions).dxTextArea("instance"); },
             getWidget: function (objID, objOptions) { return $("#" + objID).dxTextArea("instance"); },
             getInternalObjectOption: null,
             deleteWidget: function (objID, objOptions, removeHtml) {
                 objOptions = null; $("#" + objID).dxTextArea("dispose");
                 //Retirer la balise html si cela à été demandé
                 if (removeHtml) $("#" + objID).remove();
                 return;
             },
             setWidgetWidgetProperty: null,
             icon: '../images/controles_medium_white/TextArea_medium_white.png',
             meta:dxTextAreaConfiguration
        }
         //,
         //{
         //    type_controle: 'dxHtmlEditor',
         //    nom_controle: 'HtmlEditor',
         //    tooltip_controle: "Editeur HTML",
         //    id_categorie: 'EDITORS',
         //    createOptions: function (objID) { return { name: objID,  iaType: 'dxHtmlEditor', height: 90, width: "100%" } },
         //    getHtml: null,
         //    createWidget: function (objID, objOptions) { return $("#" + objID).dxHtmlEditor(objOptions).dxHtmlEditor("instance"); },
         //    getWidget: function (objID, objOptions) { return $("#" + objID).dxHtmlEditor("instance"); },
         //    getInternalObjectOption: null,
         //    deleteWidget: function (objID, objOptions, removeHtml) {
         //        objOptions = null; $("#" + objID).dxHtmlEditor("dispose");
         //        //Retirer la balise html si cela à été demandé
         //        if (removeHtml) $("#" + objID).remove();
         //        return;
         //    },
         //    setWidgetWidgetProperty: null,
         //    icon: '../images/controles_medium_white/HtmlEditor_medium_white.png',
         //    hide_item_text: true,
         //    meta: dxHtmlEditorConfiguration
         //}
         ,
         {
             type_controle: 'kendoEditor',
             nom_controle: 'Editor',
             tooltip_controle: "Memo/Editeur HTML",
             id_categorie: 'EDITORS',
             createOptions: function (objID) { return { name: objID, iaType: 'kendoEditor', dictionnaire_id_categorie: "iamHFDControls", iaHeight: "260px", tools: ["bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "createLink", "unlink", "insertImage", "createTable", "addColumnLeft", "addColumnRight", "addRowAbove", "addRowBelow", "deleteRow", "deleteColumn", "foreColor", "backColor"], width: "100%" } },
             getHtml: function (objID, objOptions) { return '<div id="' + objID + '" style="height:260px"></div>'; },
             createWidget: function (objID, objOptions) { return $("#" + objID).kendoEditor(objOptions).data("kendoEditor"); },
             getWidget: function (objID, objOptions) { return $("#" + objID).kendoEditor(objOptions).data("kendoEditor"); },
             getInternalObjectOption: function (objID, objOptions) {//fonction qui permet de retourner le widget telqu'il existe en interne dans le widget. il peut etre différent de l'objet option disponible dans la liste des objets
                 this.getWidget(objID, objOptions).options();
             },
             deleteWidget: function (objID, objOptions, removeHtml) {
                 objOptions = null;
                 try {
                     $("#" + objID).kendoEditor().data("kendoEditor").destroy();
                 } catch (x) {
                     showErreurMsg(x.message);
                 }                 
                 //Retirer la balise html si cela à été demandé
                 if (removeHtml) $("#" + objID).remove();
                 return;
             },
             setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {//fonction pour mettre à jour une propriété du widget et de son option rattachée. donner null pour laisser l'applicatoin utiliser le modèle ci-dessous par défaut. donner false pour ne pas gérer cette fonctionalité.

                 //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
                 if (objOptions != null) objOptions[propertyName] = propertyValue;
                 if (recreate) {
                     //Supprimer l'objet sans retirer le div de la balise HTML
                     this.deleteWidget(objID, objOptions, false);
                     //Recréer le widget depuis l'option
                     this.createWidget(objID, objOptions);
                 } else {
                     //mettre à jour les propriété du widget par la fonction option ()
                     widget.options(propertyName, propertyValue);
                 }
                 return;
             },
             icon: '../images/controles_medium_white/HtmlEditor_medium_white.png',
             hide_item_text: true,
             //meta: dxHtmlEditorConfiguration
         }

     //DONNEES ET LISTES
      , {
          type_controle: 'dxDataGrid',
          nom_controle: 'DataGrid',
          tooltip_controle: "Tableau de données",
          id_categorie: 'DATA - LISTS',
          createOptions: function (objID) { return { name: objID, iaType: 'dxDataGrid', dictionnaire_id_categorie: "iamHFDControls", allowColumnReordering: true, allowColumnResizing: true, columnAutoWidth: true, columnChooser: { allowSearch: true, enabled: true }, dataSource: iamSampleData, editing: { mode: "batch" }, export: { enabled: true, excelFilterEnabled: true, fileName: "DataGrid" }, filterRow: { applyFilter: "auto", visible: false }, grouping: { contextMenuEnabled: true }, groupPanel: { allowColumnDragging: true, visible: true }, headerFilter: { allowSearch: true, visible: true }, hoverStateEnabled: true, paging: { enabled: false, pageSize: 100 }, remoteOperations: false, rowAlternationEnabled: true, searchPanel: { visible: true, width: 200 }, selection: { allowSelectAll: true, deferred: false, mode: "single", selectAllMode: "allPages", showCheckBoxesMode: "onClick" }, showBorders: true, showColumnHeaders: true, showColumnLines: true, showRowLines: false, summary: { totalItems: [] }, width: "100%", wordWrapEnabled: true } },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxDataGrid(objOptions).dxDataGrid("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxDataGrid("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxDataGrid("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/DataGrid_medium_white.png',
          hide_item_text: true,
          meta: dxDataGridConfiguration
      }

      , {
          type_controle: 'dxTreeList',
          nom_controle: 'TreeList',
          tooltip_controle: "Arborescence tabulaire",
          id_categorie: 'DATA - LISTS',
          createOptions: function (objID) { return { name: objID, iaType: 'dxTreeList', dictionnaire_id_categorie: "iamHFDControls", columns: ["text", "details"], dataSource: iamFlatTreeSampleData, keyExpr: "id", parentIdExpr: "id_parent", width: "100%" }; },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxTreeList(objOptions).dxTreeList("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxTreeList("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxTreeList("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/TreeList_medium_white.png',
          hide_item_text: true,
          meta: dxTreeListConfiguration
      }
      , {
          type_controle: 'dxList',
          nom_controle: 'List',
          tooltip_controle: "Liste",
          id_categorie: 'DATA - LISTS',
          createOptions: function (objID) { return { name: objID, iaType: 'dxList', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, searchEnabled: true, width: "100%" }; },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxList(objOptions).dxList("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxList("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxList("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/List_medium_white.png',
          hide_item_text: true,
          meta: dxListConfiguration
      }, {
          type_controle: 'dxGallery',
          nom_controle: 'Gallery',
          tooltip_controle: "Gallerie d'image",
          id_categorie: 'DATA - LISTS',
          createOptions: function (objID) { return { name: objID, iaType: 'dxGallery', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, searchEnabled: true, width: "100%" }; },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxGallery(objOptions).dxGallery("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxGallery("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxGallery("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/Gallery_medium_white.png',
          hide_item_text: true,
          meta: dxGalleryConfiguration
      }, {
          type_controle: 'dxTileView',
          nom_controle: 'TileView',
          tooltip_controle: "Tuile d'image",
          id_categorie: 'DATA - LISTS',
          createOptions: function (objID) { return { name: objID, iaType: 'dxTileView', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, baseItemHeight: 130, baseItemWidth: 180, width: "100%" }; },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxTileView(objOptions).dxTileView("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxTileView("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxTileView("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/TileView_medium_white.png',
          hide_item_text: true,
          meta: dxTileViewConfiguration
      }


      //DATA VISUALIZATION
      , {
          type_controle: 'dxChart',
          nom_controle: 'Chart',
          tooltip_controle: "Graphique",
          id_categorie: 'DATA VISUALIZATION',
          createOptions: function (objID) { return { name: objID, iaType: 'dxChart', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, commonSeriesSettings: { argumentField: "text", type: "bar"}, series: [{ valueField: "value" }], width: "100%" }; },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxChart(objOptions).dxChart("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxChart("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxChart("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/Chart_medium_white.png',
          hide_item_text: true,
          meta: dxChartConfiguration
      }
      , {
          type_controle: 'dxPieChart',
          nom_controle: 'PieChart',
          tooltip_controle: "Secteur",
          id_categorie: 'DATA VISUALIZATION',
          createOptions: function (objID) { return { name: objID, iaType: 'dxPieChart', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, commonSeriesSettings: { argumentField: "text", type: "bar" }, series: [{ valueField: "value" }], width: "100%" }; },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxPieChart(objOptions).dxPieChart("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxPieChart("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxPieChart("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/PieChart_medium_white.png',
          hide_item_text: true,
          meta: dxPieChartConfiguration
      }
      , {
          type_controle: 'dxPolarChart',
          nom_controle: 'PolarChart',
          tooltip_controle: "Graphique polaire",
          id_categorie: 'DATA VISUALIZATION',
          createOptions: function (objID) { return { name: objID, iaType: 'dxPolarChart', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, commonSeriesSettings: { argumentField: "text", type: "bar" }, series: [{ valueField: "value" }], width: "100%" }; },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxPolarChart(objOptions).dxPolarChart("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxPolarChart("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxPolarChart("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/PolarChart_medium_white.png',
          hide_item_text: true,
          meta: dxPolarChartConfiguration
      }
      , {
          type_controle: 'dxFunnel',
          nom_controle: 'Funnel',
          tooltip_controle: "Graphique en entonnoire",
          id_categorie: 'DATA VISUALIZATION',
          createOptions: function (objID) { return { name: objID, iaType: 'dxFunnel', dictionnaire_id_categorie: "iamHFDControls", dataSource: iamSampleData, argumentField: "text", valueField: "value", width: "100%" }; },
          getHtml: null,
          createWidget: function (objID, objOptions) { return $("#" + objID).dxFunnel(objOptions).dxFunnel("instance"); },
          getWidget: function (objID, objOptions) { return $("#" + objID).dxFunnel("instance"); },
          getInternalObjectOption: null,
          deleteWidget: function (objID, objOptions, removeHtml) {
              objOptions = null; $("#" + objID).dxFunnel("dispose");
              //Retirer la balise html si cela à été demandé
              if (removeHtml) $("#" + objID).remove();
              return;
          },
          setWidgetWidgetProperty: null,
          icon: '../images/controles_medium_white/Funnel_medium_white.png',
          hide_item_text: true,
          meta: dxFunnelConfiguration
      }
       , {
           type_controle: 'dxCircularGauge',
           nom_controle: 'CircularGauge',
           tooltip_controle: "Jauge circulaire",
           id_categorie: 'DATA VISUALIZATION',
           createOptions: function (objID) { return { name: objID, iaType: 'dxCircularGauge', dictionnaire_id_categorie: "iamHFDControls", title: { text: "Titre", verticalAlignment: "bottom" }, scale: { startValue: 0, endValue: 100 }, rangeContainer: { ranges: [{ startValue: 0, endValue: 75 }, { startValue: 75, endValue: 90 }, { startValue: 90, endValue: 100 }] }, value: 70, width: "100%" }; },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxCircularGauge(objOptions).dxCircularGauge("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxCircularGauge("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxCircularGauge("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/CircularGauge_medium_white.png',
           hide_item_text: true,
           meta: dxCircularGaugeConfiguration
       }
       , {
           type_controle: 'dxLinearGauge',
           nom_controle: 'LinearGauge',
           tooltip_controle: "Jauge linéaire",
           id_categorie: 'DATA VISUALIZATION',
           createOptions: function (objID) { return { name: objID, iaType: 'dxLinearGauge', dictionnaire_id_categorie: "iamHFDControls", title:{text:"Titre"}, scale: { startValue: 0, endValue: 100 }, rangeContainer: { ranges: [{ startValue: 0, endValue: 75 }, { startValue: 75, endValue: 90 }, { startValue: 90, endValue: 100 }] }, value: 70, width: "100%" }; },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxLinearGauge(objOptions).dxLinearGauge("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxLinearGauge("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxLinearGauge("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/LinearGauge_medium_white.png',
           hide_item_text: true,
           meta: dxLinearGaugeConfiguration
       }, {
           type_controle: 'dxBarGauge',
           nom_controle: 'BarGauge',
           tooltip_controle: "Jauge circulaire multiple",
           id_categorie: 'DATA VISUALIZATION',
           createOptions: function (objID) { return { name: objID, iaType: 'dxBarGauge', dictionnaire_id_categorie: "iamHFDControls", title: { text: "Titre", verticalAlignment: "bottom" }, values: [21.3, 54.1, 30.9, 45.2, 89.41], width: "100%" }; },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxBarGauge(objOptions).dxBarGauge("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxBarGauge("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxBarGauge("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/BarGauge_medium_white.png',
           hide_item_text: true,
           meta: dxBarGaugeConfiguration
       }, {
           type_controle: 'dxBullet',
           nom_controle: 'Bullet',
           tooltip_controle: "Graphique bullet",
           id_categorie: 'DATA VISUALIZATION',
           createOptions: function (objID) { return { name: objID, iaType: 'dxBullet', dictionnaire_id_categorie: "iamHFDControls", startScaleValue: 0, endScaleValue: 100, value: 60, target: 75, width: "100%" }; },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxBullet(objOptions).dxBullet("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxBullet("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxBullet("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/Bullet_medium_white.png',
           hide_item_text: true,
           meta: dxBulletConfiguration
       }, {
           type_controle: 'dxPivotGrid',
           nom_controle: 'PivotGrid',
           tooltip_controle: "Tableau dynamique croisé",
           id_categorie: 'DATA VISUALIZATION',
           createOptions: function (objID) { return { name: objID, iaType: 'dxPivotGrid', dictionnaire_id_categorie: "iamHFDControls", dataSource: { store: { type: "array", data: iamSampleData }, fields: [{ area: "column", dataField: "date", dataType: "date" }, { area: "row", dataField: "group" }, { area: "row", dataField: "text" }, { area: "data", summaryType: "value" }] }, fieldChooser: { allowSearch: true, applyChangesMode: "instantly", enabled: true, height: 600, layout: 0, texts: {}, width: 500 }, width: "100%" }; },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxPivotGrid(objOptions).dxPivotGrid("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxPivotGrid("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxPivotGrid("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/PivotGrid_medium_white.png',
           hide_item_text: true,
           meta: dxPivotGridConfigudration
       }, {
           type_controle: 'dxRangeSelector',
           nom_controle: 'RangeSelector',
           tooltip_controle: "Sélecteur plage de valeur",
           id_categorie: 'DATA VISUALIZATION',
           createOptions: function (objID) {
               return { name: objID, iaType: 'dxRangeSelector', dictionnaire_id_categorie: "iamHFDControls", scale: {startValue: new Date(2011, 0, 1),endValue: new Date(2011, 5, 1),tickInterval: { days: 7 }}, width: "100%"};
           },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxRangeSelector(objOptions).dxRangeSelector("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxRangeSelector("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxRangeSelector("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/RangeSelector_medium_white.png',
           hide_item_text: true,
           meta: dxRangeSelectorConfiguration
       }

       //PLANNING
       , {
           type_controle: 'dxCalendar',
           nom_controle: 'Calendar',
           tooltip_controle: "Calendrier de sélection de date",
           id_categorie: 'PLANNING',
           createOptions: function (objID) { return { name: objID, iaType: 'dxCalendar', dictionnaire_id_categorie: "iamHFDControls" } },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxCalendar(objOptions).dxCalendar("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxCalendar("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxCalendar("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/Calendar_medium_white.png',
           meta: dxCalendarConfiguration
       }, {
           type_controle: 'dxScheduler',
           nom_controle: 'Scheduler',
           tooltip_controle: "Calendrier d'affichage d'evènement, travaux, rencontres...",
           id_categorie: 'PLANNING',
           createOptions: function (objID) { return { name: objID, iaType: 'dxScheduler', dictionnaire_id_categorie: "iamHFDControls"} },
           getHtml: null,
           createWidget: function (objID, objOptions) { return $("#" + objID).dxScheduler(objOptions).dxScheduler("instance"); },
           getWidget: function (objID, objOptions) { return $("#" + objID).dxScheduler("instance"); },
           getInternalObjectOption: null,
           deleteWidget: function (objID, objOptions, removeHtml) {
               objOptions = null; $("#" + objID).dxScheduler("dispose");
               //Retirer la balise html si cela à été demandé
               if (removeHtml) $("#" + objID).remove();
               return;
           },
           setWidgetWidgetProperty: null,
           icon: '../images/controles_medium_white/Scheduler_medium_white.png',
           meta: dxSchedulerConfiguration
       }, 
         {
             type_controle: 'kendoGantt',
             nom_controle: 'Gantt',
             tooltip_controle: "Diagramme de Gantt",
             id_categorie: 'PLANNING',
             createOptions: function (objID) {
                 return {name: objID, iaType: 'kendoGantt', dictionnaire_id_categorie: "iamHFDControls"
                     , dataSource: new kendo.data.GanttDataSource({
                         data:iamSampleDataGantt,
                         schema: {
                             model: {
                                 id: "id",
                                 fields: {
                                     id: { from: "id", type: "string" },
                                     orderId: {type: "number", validation: { required: true } },
                                     parentId: {type: "string", validation: { required: true }, defaultValue: null },
                                     start: {type: "date" },
                                     end: {from: "end", type: "date" },
                                     title: {defaultValue: "", type: "string" },
                                     percentComplete: {type: "number" },
                                     summary: { from: "summary" },
                                     expanded: { from: "expanded" }
                                 }
                             }
                         },
                     })
                     , dependencies: iamSampleDataGanttDependencies
                     , views: ["day", { type: "week", selected: true }, "month"],columns: [{ field: "id", title: "ID", width: 60 }, { field: "title", title: "DESIGNATION", editable: true, sortable: true },{ field: "start", title: "DEBUT", format: "{0:dd/MM/yyyy}", width: 100, editable: true, sortable: true }, { field: "end", title: "FIN", format: "{0:dd/MM/yyyy}", width: 100, editable: true, sortable: true }], height: 500,showWorkHours: false, showWorkDays: false, snap: false, width: "100%" } },
             getHtml: null,
             createWidget: function (objID, objOptions) { return $("#" + objID).kendoGantt(objOptions).data("kendoGantt"); },
             getWidget: function (objID, objOptions) { return $("#" + objID).data("kendoGantt"); },
             getInternalObjectOption: function (objID, objOptions) {//fonction qui permet de retourner le widget telqu'il existe en interne dans le widget. il peut etre différent de l'objet option disponible dans la liste des objets
                 this.getWidget(objID, objOptions).options();
             },
             deleteWidget: function (objID, objOptions, removeHtml) {
                 objOptions = null;
                 try{
                     $("#" + objID).kendoGantt().data("kendoGantt").destroy();
                 } catch (x) {
                     showErreurMsg(x.message);
                 }                 
                 //Retirer la balise html si cela à été demandé
                 if (removeHtml) $("#" + objID).remove();
                 return;
             },
             setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {//fonction pour mettre à jour une propriété du widget et de son option rattachée. donner null pour laisser l'applicatoin utiliser le modèle ci-dessous par défaut. donner false pour ne pas gérer cette fonctionalité.

                 //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
                 if (objOptions != null) objOptions[propertyName] = propertyValue;
                 if (recreate) {
                     //Supprimer l'objet sans retirer le div de la balise HTML
                     this.deleteWidget(objID, objOptions, false);
                     //Recréer le widget depuis l'option
                     this.createWidget(objID, objOptions);
                 } else {
                     //mettre à jour les propriété du widget par la fonction option ()
                     widget.options(propertyName, propertyValue);
                 }
                 return;
             },
             icon: '../images/controles_medium_white/gantt_withe_64.png',
             hide_item_text: true,
             //meta: dxHtmlEditorConfiguration
         }

      //DIVERS
      //, {
      //    type_controle: 'dxDiagram',
      //    nom_controle: 'dxDiagram',
      //    tooltip_controle: "Diagramme",
      //    id_categorie: 'OTHERS',
      //    createOptions: function (objID) { return { name: objID, iaType: 'dxDiagram', width: "100%" } },
      //    getHtml: null,
      //    createWidget: function (objID, objOptions) { return $("#" + objID).dxDiagram(objOptions).dxDiagram("instance"); },
      //    getWidget: function (objID, objOptions) { return $("#" + objID).dxDiagram("instance"); },
      //    getInternalObjectOption: null,
      //    deleteWidget: function (objID, objOptions, removeHtml) {
      //        objOptions = null; $("#" + objID).dxDataGrid("dispose");
      //        //Retirer la balise html si cela à été demandé
      //        if (removeHtml) $("#" + objID).remove();
      //        return;
      //    },
      //    setWidgetWidgetProperty: null,
      //    icon: '../images/controles_medium_white/Diagram_medium_white.png',
      //    hide_item_text: true,
      //    //meta: dxDataGridConfiguration
      //}
      ,
         {
             type_controle: 'kendoDiagram',
             nom_controle: 'Diagram',
             tooltip_controle: "Diagramme",
             id_categorie: 'OTHERS',
             createOptions: function (objID) { return { name: objID, iaType: 'kendoDiagram', dictionnaire_id_categorie: "iamHFDControls", iaHeight: "500px", width: "100%" } }, //, dataSource: null, connectionsDataSource: null, dataBound: function (e) {var that = this; setTimeout(function () {that.bringIntoView(that.shapes);}, 0);}
             getHtml: function (objID, objOptions) { return '<div id="' + objID + '" style="height:500px"></div>'; },
             createWidget: function (objID, objOptions) { return $("#" + objID).kendoDiagram(objOptions).data("kendoDiagram"); },
             getWidget: function (objID, objOptions) { return $("#" + objID).kendoDiagram(objOptions).data("kendoDiagram"); },
             getInternalObjectOption: function (objID, objOptions) {//fonction qui permet de retourner le widget telqu'il existe en interne dans le widget. il peut etre différent de l'objet option disponible dans la liste des objets
                 this.getWidget(objID, objOptions).options();
             },
             deleteWidget: function (objID, objOptions, removeHtml) {
                 objOptions = null;
                 try {
                     $("#" + objID).kendoDiagram().data("kendoDiagram").destroy();
                 } catch (x) {
                     showErreurMsg(x.message);
                 }
                 //Retirer la balise html si cela à été demandé
                 if (removeHtml) $("#" + objID).remove();
                 return;
             },
             setWidgetWidgetProperty: function (objID, objOptions, widget, propertyName, propertyValue, recreate) {//fonction pour mettre à jour une propriété du widget et de son option rattachée. donner null pour laisser l'applicatoin utiliser le modèle ci-dessous par défaut. donner false pour ne pas gérer cette fonctionalité.

                 //Si l'option n'est pas vide alors prendre la propriété dans l'option tout d'abord
                 if (objOptions != null) objOptions[propertyName] = propertyValue;
                 if (recreate) {
                     //Supprimer l'objet sans retirer le div de la balise HTML
                     this.deleteWidget(objID, objOptions, false);
                     //Recréer le widget depuis l'option
                     this.createWidget(objID, objOptions);
                 } else {
                     //mettre à jour les propriété du widget par la fonction option ()
                     widget.options(propertyName, propertyValue);
                 }
                 return;
             },
             icon: '../images/controles_medium_white/Diagram_medium_white.png',
             hide_item_text: true,
             //meta: dxHtmlEditorConfiguration
         }

];

