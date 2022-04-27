//Objet widget
const iamWidgetObject = class {
    #id;
    #attributes;
    #model;
    #containerId;


    get id() {
        return this.#id;
    }
    get containerId() {
        return this.#containerId;
    }
    get modelName() {
        return this.#model.name;
    }
    get modelId() {
        return this.#model.id;
    }
    //Retoune un widget a partir d'informations permetant de le reconstruire et d'une liste de modele de widget
    static fromJsonObject(widget, modelList) {
        let model = modelList.find(e => e.id == widget.modelId);
        if (model) {
            return new iamWidgetObject(widget.containerId, model, { ...(widget.attributes || {}), id: widget.id })


        }
        throw 'the model of the widget is unknow';

    }
    //Constructeur de notre Objet
    constructor(containerId, model, attributes = {}, showAttributesEditor = false) {
        attributes = attributes || {};
        this.#containerId = containerId;
        this.#model = model;
        this.#id = attributes['id'] || new Date().getTime();
        attributes['id'] = this.#id;

        let attributesVal = {};
        for (let attr of model.attributes) {
            attributesVal[attr.Name] = attributes[attr.Name] || attr.Default;
        }
        this.#attributes = attributesVal;

        if (showAttributesEditor) {

            this.showAttributesForm();
        } else {
            this.render();
        }


    }
    //Retoune un objet qui contient les proprietes qui permetront de reconstruire notre objet
    toJsonObject() {
        return {
            id: this.#id,
            containerId: this.#containerId,
            attributes: { ...this.#attributes, id: this.#id },
            modelId: this.#model.id,
        };
    }
    //retoune ou modifie la valeur d'un attribut de notre widget
    options(attrs, value) {
        if (typeof value != "undefined") {
            this.#attributes[attrs] = value;
            this.render();
            return;
        }

        if (typeof attrs == "object") {
            for (let attr in attrs) {
                this.#attributes[attr] = attrs[attr];
            }
            this.render();
            return;
        }
        if (typeof attrs == "string") {
            return this.#attributes[attrs];
        }
    }
    //Permet de construire notre widget
    render() {
        let id = this.#id;
        //Vider le conteneur du widget
        $('#' + this.#containerId).html("");

        let codeCSS = `
<style scoped>
${this.#model.template.css}
</style>`;
        let codeHTML = ejs.render(this.#model.template.html, this.#attributes);

        //Les scripts qui seront executes avant l'insertion du widget dans le DOM
        let beforeScript = `
<script>
    (function(){
        var widgetVariables = ${JSON.stringify(this.#attributes)};
        ${this.#attributes.beforeContentReady}
    })();
</script>`;
        $('#' + this.#containerId).append(beforeScript);

        //Creation du code js final du widget
        let codeJs = `
<script>
    (function(){
        var widgetVariables = ${JSON.stringify(this.#attributes)};
        ${this.#attributes.onContentReady}
    })();
    (function(){
        var widgetVariables = ${JSON.stringify(this.#attributes)};
        ${this.#model.template.customJs}
    })();
</script>`;

        //element conteneur de notre widget
        let html = $(`
<div style="min-width:${this.#attributes.minWidth};min-height:${this.#attributes.minHeight}; position:relative" id='widget_${id}'>
    ${codeHTML}
</div>`);

        //Unification des differents id crees au sein de notre widget
        let elements = html.find('*');
        $.each(elements, (i, e) => {
            if (e.id) {
                let beforeId = e.id;
                html.find(`#${e.id}`).attr('id', `${beforeId}_${id}`);
                codeCSS = codeCSS.replaceAll(`#${beforeId}`, `#${beforeId}_${id}`);
                codeJs = codeJs.replaceAll(`#${beforeId}`, `#${beforeId}_${id}`);
            }
        });

        //Insertion de notre widget dans le DOM
        html.prepend(codeCSS);
        html.append(codeJs);
        $('#' + this.#containerId).append(html);
    }
    //Retire notre widget du DOM
    destroy() {
        $('#' + this.#containerId).html("");
    }
    //Retourne l'objet de creation du Quick Form des attributs de notre Widget
    #attributesQFObject(callback, positionId) {
        let that = this;
        return {
            AutoCreateEditors: false,
            Id: `iamQFWidget_${that.#model.name.replaceAll(' ', "")}_${this.#id}`,
            Name: that.#model.name,
            DisplayName: null,
            PositionId: positionId || "rightpanel",
            OnValidated: function (data) {
                //abp.ui.setBusy('body');
                for (let attr in data) {
                    that.#attributes[attr] = data[attr];
                }
                that.render();
                if (callback && typeof callback == 'function') callback(that);
                //abp.ui.clearBusy('body');
            },
            Data: null,
            IgnoreStepsOrderNumber: false, //Ignore le numéro d'ordre attribué et ordonne par ordre de position dans le tableau des steps
            IgnoreItemsOrderNumber: true,
            Steps: [
                {
                    Id: "0001",
                    Name: null,
                    DisplayName: null,
                    DenyBack: false,
                    OrderNumber: 1
                }
            ],
            Items: that.#model.attributes.map((attr, i) => {
                return {
                    Id: `item_${that.#model.id}_${attr.Name}`,
                    StepId: "0001",
                    OrderNumber: i + 1,
                    DataField: attr.Name,
                    DisplayName: attr.Name,
                    IsRequired: true,
                    EditorType: "dxTextBox",
                    ValidationRules: [
                        {
                            type: 'pattern', //require, email,compare,range,stringLength
                            pattern: '^[0-9A-Za-z_ ]+$',
                            message: app.localize("InvalidDataInput")
                        }
                    ],
                };
            }),
        };
    }
    //Affiche le Quick Form d'affectation des attributs de notre widget
    showAttributesForm() {
        let attributesQFObjet = this.#attributesQFObject();
        iamShared.ui.rightPanelShow();
        iamQF.createForm(attributesQFObjet, this.#attributes, false, null, true, app, abp.services.app.magicData, true, true, null);
    }


};

//Utiliser pour les test en console
var test;

var iamWidget = {
    //Initialisation de l'interface de creation de Widget
    init: function (widget) {

        //Créer le right panel pour les quickCreate/quickforms
        iamShared.ui.rightPanelCreate(null, false, null);


        //Initialisation des editeurs de code

        iamWidget.codeEditor.init();

        //Evenement de modification du nom du widget
        $('#iamWidgetNameSave').on('click', iamWidget.widget.editName);
        $('#iamWidgetDescriptionInput').on('change', iamWidget.widget.editDescription);
        ////Evenements de modification des min-sizes
        //$('#iamWidgetMinWidth').on('change', iamWidget.widget.editWidth);
        //$('#iamWidgetMinHeight').on('change', iamWidget.widget.editHeight);


        //Import et Export du widget
        $('#btn-import').on('click', iamWidget.sharing.import);
        $('#btn-export').on('click', iamWidget.sharing.export);
        //Creer un nouvel attribut
        $(`#CreateNewWidgetAttributeButton`).on('click', iamWidget.attributes.create);
        //Generer la preview du widget
        $(`#iamWidgetPreviewButton`).on('click', iamWidget.widget.preview);


        //initialisation du widget
        iamWidget.widget.load(widget);
    },
    //Definition de variables
    variables: {
    },
    //L'objet widget
    activeItem: null,
    codeEditor: {
        init: function () {
            let edi = iamWidget.codeEditor;

            edi.html = ace.edit('code-html');
            edi.css = ace.edit('code-css');
            edi.customJs = ace.edit('code-custom-js');
            //edi.onContentReady = ace.edit('code-on-content-ready');
            //edi.beforeContentReady = ace.edit('code-before-content-ready');

            const options = {
                enableSnippets: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
            };

            edi.html.session.setMode("ace/mode/ejs");
            edi.html.setOptions(options);

            edi.css.session.setMode("ace/mode/css");
            edi.css.setOptions(options);

            edi.customJs.session.setMode("ace/mode/javascript");
            edi.customJs.setOptions(options);

            //edi.onContentReady.session.setMode("ace/mode/javascript");
            //edi.onContentReady.setOptions(options);

            //edi.beforeContentReady.session.setMode("ace/mode/javascript");
            //edi.beforeContentReady.setOptions(options);
        },
        html: null,
        css: null,
        customJs: null,
        //onContentReady: null,
        //beforeContentReady:null,
    },
    attributes: {

        //Creation ou modification d'un Attribut
        QFObject: (attributeName) => {
            let Id = "iamQFAttributeCreate";
            let Name = "Create Attribute";
            if (attributeName) {
                Id = "iamQFAttributeEdit_" + attributeName;
                Name = "Edit Attribute";
            }
            return {
                AutoCreateEditors: false,
                Id,
                Name,
                DisplayName: null,
                PositionId: "rightpanel",
                OnValidated: function (data) {
                    abp.ui.setBusy('body');
                    if (!(['id', 'minHeight', 'minWidth', 'beforeContentReady', 'onContentReady'].includes(data.Name))) {
                        //Ajout ou modification de l'attribut
                        let insertIndex = iamWidget.activeItem.attributes.findIndex(at => at.Name == data.Name);
                        insertIndex = insertIndex == -1 ? iamWidget.activeItem.attributes.length : insertIndex;

                        iamWidget.activeItem.attributes.splice(insertIndex, 1, { ...data, Default: null });

                        abp.notify.info(app.localize('SavedSuccessfully'));
                        iamWidget.attributes.list();
                    }
                    abp.ui.clearBusy('body');
                },
                Data: null,
                IgnoreStepsOrderNumber: false, //Ignore le numéro d'ordre attribué et ordonne par ordre de position dans le tableau des steps
                IgnoreItemsOrderNumber: true,
                Steps: [
                    {
                        Id: "0001",
                        Name: null,
                        DisplayName: null,
                        DenyBack: false,
                        OrderNumber: 1
                    }
                ],
                Items: [
                    //{
                    //    Id: "item_Id",
                    //    StepId: "0001",
                    //    OrderNumber: null,
                    //    ColSpan: null,
                    //    CssClass: null,
                    //    DataField: "id",
                    //    DisplayName: "Id",
                    //    IsRequired: true,
                    //    ReadOnly: true,
                    //    EditorType: "dxTextBox",
                    //    Formula: create ? `IF({tenantId}=NULL;convertToPascalCase({name}); CONCATENATE("t";{tenantId};"_";convertToPascalCase({name})))` : null,
                    //},
                    {
                        Id: "item_Name",
                        StepId: "0001",
                        OrderNumber: 1,
                        DataField: "Name",
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
                        Id: "item_AttributeType",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "Type",
                        DisplayName: "Attribute Type",
                        DefaultValue: "String",
                        IsRequired: true,
                        EditorType: "dxSelectBox",
                        ListDataSource: ['Array', 'Boolean', 'EntityRequestObject', 'Function', 'Number', 'String'],
                    },
                    //{
                    //    Id: "item_AttributeDefaultValue",
                    //    StepId: "0001",
                    //    OrderNumber: null,
                    //    DataField: "Default",
                    //    DisplayName: "Default Value",
                    //    DefaultValue: null,
                    //    IsRequired: false,
                    //    EditorType: "dxTextBox",
                    //},
                    //{
                    //    Id: "item_AttributeVisible",
                    //    StepId: "0001",
                    //    OrderNumber: null,
                    //    DataField: "Visible",
                    //    DisplayName: "Visible",
                    //    IsRequired: false,
                    //    EditorType: "dxCheckBox",
                    //    DefaultValue: false
                    //},
                    {
                        Id: "item_AttributeRequired",
                        StepId: "0001",
                        OrderNumber: null,
                        DataField: "IsRequired",
                        DisplayName: "Is Required",
                        IsRequired: false,
                        EditorType: "dxCheckBox",
                        DefaultValue: true
                    },
                ]
            }
        },
        //Afficher le QuickForm de creation d'un attribut
        create: function () {
            $("#widgetAttributesGridList").toggleClass('open');
            iamShared.ui.rightPanelShow();
            iamQF.createForm(iamWidget.attributes.QFObject(), null, false, null, true, app, abp.services.app.magicData, true, true, null);
        },
        //Afficher le QuickForm de modification d'un attribut
        edit: function (data) {
            iamShared.ui.rightPanelShow();
            iamQF.createForm(iamWidget.attributes.QFObject(data.Name), data, false, null, true, app, abp.services.app.magicData, true, true, null);
        },
        //Supprimer un attribut
        delete: function (data) {

            abp.ui.setBusy('body');
            //Suppression de l'attribut
            let deleteIndex = iamWidget.activeItem.attributes.findIndex(at => at.Name == data.Name);
            if (deleteIndex != -1) {
                iamWidget.activeItem.attributes.splice(deleteIndex, 1);
            }
            //
            abp.notify.info(app.localize('DeletedSuccessfully'));
            iamWidget.attributes.list();
            abp.ui.clearBusy('body');
        },
        //Defenir la valeur par defaut
        defaultValueQFObject: function (attribute) {
            let Id = "iamQFAttributeDefault_" + attribute.Name.replaceAll(' ', '');
            let Name = `Default Value Of *${attribute.Name}*`;

            let EditorType;
            let ListDataSource;
            let ValidationRules;

            if (attribute.Type == "Boolean") {
                EditorType = "dxSelectBox";
                ListDataSource = [true, false];

            }
            else if (attribute.Type == "Number") {
                ValidationRules =[{
                    type: 'pattern', //require, email,compare,range,stringLength
                        pattern: '^[0-9]+$',
                            message: app.localize("InvalidDataInput")
                }];
                EditorType = "dxTextBox";
            }
            else {
                EditorType = "dxTextBox";
            }

            return {
                AutoCreateEditors: false,
                Id,
                Name,
                DisplayName: null,
                PositionId: "rightpanel",
                OnValidated: function (data) {
                    abp.ui.setBusy('body');
                    let myAttribute = iamWidget.activeItem.attributes.find(e => e.Name == attribute.Name);
                    myAttribute = myAttribute.Default = data.Default;
                    iamWidget.attributes.list();
                    abp.ui.clearBusy('body');
                },
                Data: null,
                IgnoreStepsOrderNumber: false, //Ignore le numéro d'ordre attribué et ordonne par ordre de position dans le tableau des steps
                IgnoreItemsOrderNumber: true,
                Steps: [
                    {
                        Id: "0001",
                        Name: null,
                        DisplayName: null,
                        DenyBack: false,
                        OrderNumber: 1
                    }
                ],
                Items: [
                    {
                        Id: "item_Default",
                        StepId: "0001",
                        OrderNumber: 1,
                        Default: attribute.Default,
                        DataField: "Default",
                        DisplayName: "Default Value",
                        IsRequired: true,
                        ValidationRules,
                        EditorType,
                        ListDataSource
                    },
                ]
            }
        },
        //Lister les attributs
        list: function () {
            let attr = iamWidget.activeItem.attributes;
            $(`#widgetAttributesGridList`).dxDataGrid({
                dataSource: attr,
                hoverStateEnabled: true,
                keyExpr: "Name",
                columnFixing: { enabled: false },
                columns: [
                    {
                        dataField: "Name",
                        caption: app.localize("Name"),
                        width: 200,
                    },
                    {
                        dataField: "Type",
                        caption: app.localize("Type"),
                        width: 150,
                    },
                    {
                        dataField: "Default",
                        caption: "Default",
                    },
                    //{
                    //    dataField: "Visible",
                    //    caption: "Visible",
                    //    dataType: "boolean",
                    //},
                    {
                        width: 85,
                        dataField: "IsRequired",
                        caption: "Required",
                        dataType: "boolean",
                    },
                    {
                        width: 80,
                        caption: app.localize("Actions"),
                        type: 'buttons',
                        buttons: [
                            {
                                hint: 'Edit',
                                icon: 'edit',
                                visible(e) {

                                    return !(['id', 'minHeight', 'minWidth', 'beforeContentReady', 'onContentReady'].includes(e.row.data.Name));
                                },
                                //disabled(e) {
                                //return !(['id', 'minHeight', 'minWidth', 'beforeContentReady', 'onContentReady'].includes(e.row.data.Name));
                                //},
                                onClick(e) {
                                    iamWidget.attributes.edit(e.row.data);
                                },
                            },
                            {
                                hint: 'Remove',
                                icon: 'remove',
                                visible(e) {
                                    return !(['id', 'minHeight', 'minWidth', 'beforeContentReady', 'onContentReady'].includes(e.row.data.Name));
                                },
                                //disabled(e) {
                                //    return !(['id', 'minHeight', 'minWidth', 'beforeContentReady', 'onContentReady'].includes(e.row.data.Name));
                                //},
                                onClick(e) {
                                    iamWidget.attributes.delete(e.row.data);
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
                rowAlternationEnabled: true,
                onRowClick: function (e) {
                    if (!(['id', 'minHeight', 'minWidth', 'beforeContentReady', 'onContentReady'].includes(e.data.Name))) {
                        iamShared.ui.rightPanelShow();
                        iamQF.createForm(iamWidget.attributes.defaultValueQFObject(e.data), null, false, null, true, app, abp.services.app.magicData, true, true, null);
                    }

                },
                showBorders: true,
                showColumnHeaders: true,
                showRowLines: true,
            });
        },

    },
    widget: {
        //Valeurs par defaut d'un Widget
        item: {
            id: iamShared.utils.guidString(),
            name: "New Widget",
            description: "",
            entityId: null,
            attributes: [
                {
                    Name: "id",
                    Type: "String",
                    Default: '[GUID]',
                    IsRequired: true,
                },
                {
                    Name: "minHeight",
                    Type: "String",
                    Default: '100%',
                    IsRequired: false,
                },
                {
                    Name: "minWidth",
                    Type: "String",
                    Default: '100%',
                    IsRequired: false,
                },
                {
                    Name: "beforeContentReady",
                    Type: "Function",
                    Default: '',
                    IsRequired: false,
                },
                {
                    Name: "onContentReady",
                    Type: "Function",
                    Default: '',
                    IsRequired: false,
                },
            ],
            template: {
                html: "",
                css: "",
                customJs: "//La variable {widgetVariables} est un objet qui contient tous nos attributs\n"
            }

        },
        //Sauvegarder les differentes proprietes du widget dans l'activeItem
        localSave: function () {
            let edi = iamWidget.codeEditor;

            //Sauvegarde du nom et de la description du Widget
            iamWidget.activeItem.name = $('#iamWidgetName').text().trim() || "New Widget";
            iamWidget.activeItem.description = $('#iamWidgetDescriptionInput').val().trim();
            //Sauvegarde des code du template du Widget
            iamWidget.activeItem.template.html = edi.html.getValue();
            iamWidget.activeItem.template.css = edi.css.getValue();
            iamWidget.activeItem.template.customJs = edi.customJs.getValue();
        },
        //Modifier le nom du widget
        editName: function () {
            let newName = $('#iamWidgetNameInput').val().trim();
            if (newName) {
                $('#iamWidgetName').text(newName);
                iamWidget.widget.localSave();
            }

        },
        //Modifier la description
        editDescription: function () {
            iamWidget.activeItem.description = this.value;
        },
        //charger un widget dans l'interface d'edition
        load: function (widget) {

            iamWidget.activeItem = widget || { ...iamWidget.widget.item };
            //Initialisation du nom
            $('#iamWidgetName').text(iamWidget.activeItem.name || "New Widget");
            //Initialisation de la description
            $('#iamWidgetDescriptionInput').val(iamWidget.activeItem.description);

            //Liste des attributs
            iamWidget.attributes.list();

            //Initialiser les codes des editeurs
            let edi = iamWidget.codeEditor;
            edi.html.setValue(iamWidget.activeItem.template.html);
            edi.css.setValue(iamWidget.activeItem.template.css);
            edi.customJs.setValue(iamWidget.activeItem.template.customJs);
        },
        //Permet de pre-visualiser notre widget en mode edition
        preview: function () {
            let w = iamWidget.widget;
            w.localSave();
            let prevWidget = JSON.parse(JSON.stringify(iamWidget.activeItem));
            $("#iamWidgetPreviewContent").html("");
            let myWidget = new iamWidgetObject("iamWidgetPreviewContent", prevWidget, null, true);
            test = myWidget;
        },
    },
    //Fonctions d'import et d'export de widget
    sharing: {
        //Afficher la fenetre de selection de fichier
        //La callback s'execute avec un objet correspondant au widget selectionne
        showSelectWidgetFile: function (callback) {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = e => {
                // getting a hold of the file reference
                let file = e.target.files[0];

                // setting up the reader
                let reader = new FileReader();
                reader.readAsText(file, 'UTF-8');

                // here we tell the reader what to do when it's done reading...
                reader.onload = readerEvent => {
                    var content = readerEvent.target.result; // this is the content!
                    let widget = JSON.parse(content);
                    callback(widget);
                }
            }

            input.click();
        },
        //Importer un widget
        import: function () {
            iamWidget.sharing.showSelectWidgetFile(widget => {
                iamWidget.widget.load(widget);
                $("#iamWidgetPreviewContent").html("");
                iamShared.messages.showSuccessMsg("Imported !");
            });
        },
        //Exporter un Widget
        export: function () {
            iamWidget.widget.localSave();
            iamShared.files.stringToFileDownload("Widget_" + iamWidget.activeItem.id + ".json", JSON.stringify(iamWidget.activeItem));
        }
    },
}
