var iamWidget = {
    //Initialisation de l'interface de creation de Widget
    init: function (widget) {

        //Créer le right panel pour les quickCreate/quickforms
        iamShared.ui.rightPanelCreate(null, false, null);


        //Initialisation des editeurs de code

        iamWidget.codeEditor.init();

        //Evenement de modification du nom du widget
        $('#iamWidgetNameSave').on('click', iamWidget.widget.editName);
        //Evenements de modification des min-sizes
        $('#iamWidgetMinWidth').on('change', iamWidget.widget.editWidth);
        $('#iamWidgetMinHeight').on('change', iamWidget.widget.editHeight);


        //Import et Export du widget
        $('#btn-import').on('click', iamWidget.sharing.import);
        $('#btn-export').on('click', iamWidget.sharing.export);
        //Creer un nouvel attribut
        $(`#CreateNewWidgetAttributeButton`).on('click', iamWidget.widget.attributes.create);
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
            edi.onContentReady = ace.edit('code-on-content-ready');
            edi.beforeContentReady = ace.edit('code-before-content-ready');

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

            edi.onContentReady.session.setMode("ace/mode/javascript");
            edi.onContentReady.setOptions(options);

            edi.beforeContentReady.session.setMode("ace/mode/javascript");
            edi.beforeContentReady.setOptions(options);
        },
        html: null,
        css: null,
        customJs: null,
        onContentReady: null,
        beforeContentReady:null,
    },
    widget: {
        //Initialise avec les valeurs par defaut
        item: {
            id: iamShared.utils.guidString(),
            name: "New Widget",
            entityId: null,
            minSize: {
                height: "100%",
                width: "100%",
            },
            attributes: [
                {
                    Name: "nom",
                    Type: "String",
                    Default:"Luai",
                    Visible: true,
                    Required: true,
                },
            ],
            attributesVal: {
                "nom": "Luai"
            },
            template: {
                html: "",
                css: "",
                customJs: "//La variable {widgetVariables} est un objet qui contient tous nos attributs\n",
                onContentReady: "//La variable {widgetVariables} est un objet qui contient tous nos attributs\n",
                beforeContentReady: "//La variable {widgetVariables} est un objet qui contient tous nos attributs\n",
            }

        },
        create: function (widget, id, selector) {
            if (widget.attributes.length > 0) {
                iamWidget.widget.attributes.setAttributes(widget, id, selector);
            } else {
                iamWidget.widget.render(widget, id, selector);
            }
            
        },
        attributes: {
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
                        //Ajout ou modification de l'attribut
                        let insertIndex = iamWidget.activeItem.attributes.findIndex(at => at.Name == data.Name);
                        insertIndex = insertIndex == -1 ? iamWidget.activeItem.attributes.length : insertIndex;
                        iamWidget.activeItem.attributes.splice(insertIndex, 1, { ...data });
                        if (attributeName != data.Name) delete iamWidget.activeItem.attributesVal[attributeName];
                        iamWidget.activeItem.attributesVal[data.Name] = data.Default;
                        //
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        iamWidget.widget.attributes.list();
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
                            DisplayName: "Type",
                            DefaultValue: "String",
                            IsRequired: true,
                            EditorType: "dxTextBox",
                        },
                        {
                            Id: "item_AttributeDefaultValue",
                            StepId: "0001",
                            OrderNumber: null,
                            DataField: "Default",
                            DisplayName: "Default",
                            DefaultValue: null,
                            IsRequired: false,
                            EditorType: "dxTextBox",
                        },
                        {
                            Id: "item_AttributeVisible",
                            StepId: "0001",
                            OrderNumber: null,
                            DataField: "Visible",
                            DisplayName: "Visible",
                            IsRequired: false,
                            EditorType: "dxCheckBox",
                            DefaultValue: false
                        },
                        {
                            Id: "item_AttributeRequired",
                            StepId: "0001",
                            OrderNumber: null,
                            DataField: "Required",
                            DisplayName: "Required",
                            IsRequired: false,
                            EditorType: "dxCheckBox",
                            DefaultValue: false
                        },
                    ]
                }
            },
            //Creer un attribut
            create: function () {
                $("#widgetAttributesGridList").toggleClass('open');
                iamShared.ui.rightPanelShow();
                iamQF.createForm(iamWidget.widget.attributes.QFObject(), null, false, null, true, app, abp.services.app.magicData, true, true, null);
            },
            //Modifier un attribut
            edit: function (data) {
                iamShared.ui.rightPanelShow();
                iamQF.createForm(iamWidget.widget.attributes.QFObject(data.Name), data, false, null, true, app, abp.services.app.magicData, true, true, null);
            },
            //Supprimer un attribut
            delete: function (data) {

                abp.ui.setBusy('body');
                //Suppression de l'attribut
                let deleteIndex = iamWidget.activeItem.attributes.findIndex(at => at.Name == data.Name);
                if (deleteIndex != -1) {
                    iamWidget.activeItem.attributes.splice(deleteIndex, 1);
                    delete iamWidget.activeItem.attributesVal[data.Name];
                }
                //
                abp.notify.info(app.localize('DeletedSuccessfully'));
                iamWidget.widget.attributes.list();
                abp.ui.clearBusy('body');
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
                        },
                        {
                            dataField: "Type",
                            caption: app.localize("Type"),
                        },
                        {
                            dataField: "Default",
                            caption: "Default",
                        },
                        {
                            dataField: "Visible",
                            caption: "Visible",
                            dataType: "boolean",
                        },
                        {
                            dataField: "Required",
                            caption: "Required",
                            dataType: "boolean",
                        },
                        {
                            caption: app.localize("Actions"),
                            type: 'buttons',
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
                                        iamWidget.widget.attributes.edit(e.row.data);
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
                                        iamWidget.widget.attributes.delete(e.row.data);
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

                    showBorders: true,
                    showColumnHeaders: true,
                    showRowLines: true,
                });
            },
            //Afficher le QuickForm pour affecter des valeurs a nos attributs
            setAttributes: function (widget, id, selector, callback) {//, id, selector) {
                if (widget.attributes.length > 0) {
                    let attributesQFObjet = iamWidget.widget.attributes.getSetAttributesQFObject(widget, id, selector, callback)//, id, selector);
                    iamShared.ui.rightPanelShow();
                    iamQF.createForm(attributesQFObjet, widget.attributesVal, false, null, true, app, abp.services.app.magicData, true, true, null);
                }

            },
            //Retourne un Objet utiliser pour generer le Quickform
            getSetAttributesQFObject: function (widget, id, selector, callback, positionId) {//, id, selector, positionId) {
                return {
                    AutoCreateEditors: false,
                    Id: `iamQFWidget_${widget.name.replaceAll(' ',"")}_${id}`,
                    //Id: `iamQFWidget_${widget.id}`,
                    Name: widget.name,
                    DisplayName: null,
                    PositionId: positionId || "rightpanel",
                    OnValidated: function (data) {
                        abp.ui.setBusy('body');
                        widget.attributesVal = data;
                        iamWidget.widget.render(widget, id, selector);
                        if(callback)callback(widget);
                        //abp.notify.info(app.localize('SavedSuccessfully'));
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
                    Items: widget.attributes.map((attr, i) => {
                        return {
                            Id: `item_${widget.id}_${attr.Name}`,
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
            },
        },
        //Modifier les proprietes de activeWidget a partir des codeEditor
        localSave: function () {
            let myWidget = iamWidget.activeItem;
            let edi = iamWidget.codeEditor;
            myWidget.name = $('#iamWidgetName').text().trim() || "New Widget";

            myWidget.template.html = edi.html.getValue();
            myWidget.template.css = edi.css.getValue();
            myWidget.template.customJs = edi.customJs.getValue();
            myWidget.template.onContentReady = edi.onContentReady.getValue();
            myWidget.template.beforeContentReady = edi.beforeContentReady.getValue();
        },
        //Modifier le nom du widget
        editName: function () {
            let newName = $('#iamWidgetNameInput').val().trim();
            if (newName) {
                $('#iamWidgetName').text(newName);
                iamWidget.widget.localSave();
            }
            
        },
        //Modifier le min-width du widget
        editWidth: function () {
            iamWidget.activeItem.minSize.width = this.value;
        },
        //Modifier le min-height du widget
        editHeight: function () {
            iamWidget.activeItem.minSize.height = this.value;
        },
        //charger un widget dans l'interface d'edition
        load: function (widget) {
            
            iamWidget.activeItem = widget || { ...iamWidget.widget.item };
            //Initialisation du nom
            $('#iamWidgetName').text(iamWidget.activeItem.name || "New Widget");
            //Initialisation des min sizes
            $('#iamWidgetMinWidth').val(iamWidget.activeItem.minSize.width);
            $('#iamWidgetMinHeight').val(iamWidget.activeItem.minSize.height);

            //Liste des attributs
            iamWidget.widget.attributes.list();

            //Initialiser les codes des editeurs
            let edi = iamWidget.codeEditor;
            edi.html.setValue(iamWidget.activeItem.template.html);
            edi.css.setValue(iamWidget.activeItem.template.css);
            edi.customJs.setValue(iamWidget.activeItem.template.customJs);
            edi.onContentReady.setValue(iamWidget.activeItem.template.onContentReady);
            edi.beforeContentReady.setValue(iamWidget.activeItem.template.beforeContentReady);



        },
        //Permet de pre-visualiser notre widget en mode edition
        preview: function () {
            let w = iamWidget.widget;
            w.localSave();
            $("#iamWidgetPreviewContent").html("");
            w.create(iamWidget.activeItem, 'test', "#iamWidgetPreviewContent");
        },
        //Fonction de generation d'un widegt
        //required {widget} l'objet ayant la strcture d'un widget
        //required {id} identifiant rendant unique le widget dans le DOM
        //required {selector} selecteur css (jQuery)
        //Cette fontion ajoute notre widget au DOM via le selecteur {selector}
        render: function (widget, id, selector) {

            $(selector).html("");
            let codeCSS = `<style scoped>
${widget.template.css}
</style>`;
            let codeHTML = ejs.render(widget.template.html, widget.attributesVal);
            //Les scripts qui seront execute avant l'insertion du widget dans le DOM
            let beforeScript = `<script>
    var widgetVariables_${id} = ${JSON.stringify(widget.attributesVal)};
    var beforeContentReady_${id} = function(){ ${widget.template.beforeContentReady}  };
    beforeContentReady_${id}();
</script>`;
            $(selector).append(beforeScript);

            //Creation du code js final du widget
            let codeJs = `<script>
    var onContentReady_${id} = function(){ ${widget.template.onContentReady} };
    var customJs_${id} = function(){ ${widget.template.customJs} }; onContentReady_${id}(); customJs_${id}();
</script>`;

            //element conteneur de notre widget
            let html = $(`<div style="min-width:${widget.minSize.width};min-height:${widget.minSize.height}; position:relative" id='widget_${id}'>
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

//            //Creation du bouton d'edition des attributes d'un widget
//            let editButton = '';
//            let toggleEditButton = function () { };
//            if (widget.attributes.length > 0) {
//                editButton = $(`
//<a class="btn-custom-widget btn btn-light-success" style="display:none;position:absolute;top:5px;right:5px;z-index: 1000;">
//    <i class="flaticon2-pen" ></i>
//</a>
//`);
//                editButton.on('click', () => iamWidget.widget.attributes.setAttributes(widget, id, selector));
//                toggleEditButton = function () {
//                    html.find('.btn-custom-widget').first().toggle();
//                };
//            }
//            //Ajout du bouton
//            html.prepend(editButton);

//            //Fonction d'apparition du bouton d'edition des attributes
//            html.on({
//                'mouseover': toggleEditButton,
//                'mouseout': toggleEditButton,
//            });

//            //Ajout des elements de notre widget
//            html.prepend(editButton);
            html.prepend(codeCSS);
            //let cssLine = codeCSS.split("\n");
            //cssLine.forEach(line => console.log(line));
            html.append(codeJs);
            return $(selector).append(html);

        }
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