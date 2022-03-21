var iamWidget = {
    init: function () {
        let v = iamWidget.variables;
        let edi = iamWidget.codeEditor;

        //Initialisation des principales variables pour le mode de creation d'un widget
        v.runButtonId = "iamWidgetPreviewButton";
        v.propertyGridId = "iamWidgetAttributesPropertyGrid";
        v.editAttributesId = "iamWidgetSettingAttributes";
        v.htmlEditorId = "iamWidgetCustomHTML";
        v.cssEditorId = "iamWidgetCustomCSS";
        v.jsEditorId = "iamWidgetCustomJS";
        v.widgetPreviewId = "iamWidgetPreviewWindow";

        //Initialisation des editeurs de texte
        edi.html = CodeMirror($(`#${v.htmlEditorId}`)[0], {
            lineNumbers: true,
            tabSize: 4,
            mode: "text/html",
            theme: "dracula",
            indentUnit: 4,
        });
        edi.css = CodeMirror($(`#${v.cssEditorId}`)[0], {
            lineNumbers: true,
            tabSize: 4,
            mode: "css",
            theme: "dracula",
        });
        edi.js = CodeMirror($(`#${v.jsEditorId}`)[0], {
            lineNumbers: true,
            tabSize: 4,
            value: "//La variable {widgetVariables} est un objet qui contient tous nos attributs\n",
            theme: "dracula",
            mode: "javascript"
        });

        //Pour inhiber un petit bug
        $(`#${v.editAttributesId} , #${v.cssEditorId} , #${v.jsEditorId}`).toggleClass("show active");

        //Generer la preview du widget
        $(`#${v.runButtonId}`).on('click', iamWidget.runPreview);

        //Créer le right panel pour les quickCreate/quickforms
        iamShared.ui.rightPanelCreate(null, false, null);
        //Creer un nouvel attribut
        $(`#CreateNewWidgetAttributeButton`).on('click', function () {
            iamShared.ui.rightPanelShow();
            iamQF.createForm(iamWidget.iamQFObjects.attributeCreate, null, true, null, true, app, abp.services.app.magicData, true, true, null);
        });

        //Lister les attributs dans le propertyGrid et le gridView
        iamWidget.attributes.showAttributesListGrid();
        iamWidget.attributes.showAttributesPropertyGrid();

        $('#btn-import').on('click', iamWidget.importWidget);
        $('#btn-export').on('click', iamWidget.exportWidget);

    },

    variables: {
        propertyGridId: null,
        htmlEditorId: null,
        cssEditorId: null,
        jsEditorId: null,
        widgetPreviewId: null,
        editAttributesId: null,
        runButtonId: null
    },
    codeEditor: {
        css: null,
        html: null,
        js: null,
    },
    widget: {
        id: null,
        name: null,
        entityId: null,
        attributes: [
            {
                Name: "nom",
                Type: "String",
                Public: true,
                Category: "Attributes",
            },
        ],
        attributesVal: {
            "nom": null,
        },
        widgetHTML: "",
        widgetCSS: "",
        widgetJS: "",
        
        //render: function () {

        //},
        //onContentReady: function () { },
        //beforeContentReady: function () { },

    },
    attributes: {
        showAttributesListGrid: function () {
            let attr = iamWidget.widget.attributes;
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
                        dataField: "Public",
                        caption: app.localize("Public"),
                        dataType: "boolean",
                    },
                    {
                        caption: app.localize("Actions"),
                        type: 'buttons',
                        buttons: [
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
                                    alert('delete');
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
        showAttributesPropertyGrid: function () {
            let v = iamWidget.variables;
            let attr = iamWidget.widget.attributes;
            let attrObj = iamWidget.widget.attributesVal;
            iamQF.showObjectProperties(new Proxy(attrObj, iamWidget.attributes.propertyGridProxyValidatorHandler), "Attributes", attr, v.propertyGridId, true);
        },
        propertyGridProxyValidatorHandler: {
            set: function (options, prop, value) {
                options[prop] = value;
                return true;
            },
        },
        createAttribute: function (data) {
            iamWidget.widget.attributes.push({ ...data, Category: "Attributes" });
            iamWidget.widget.attributesVal[data.Name] = null;
        },

    },
    iamQFObjects: {
        attributeCreate: {
            AutoCreateEditors: false,
            Id: "iamQFFlowCreate",
            Name: "Create New Attribute",
            DisplayName: null,
            PositionId: "rightpanel",
            OnValidated: function (data) {
                abp.ui.setBusy('body');
                iamWidget.attributes.createAttribute(data);
                abp.notify.info(app.localize('SavedSuccessfully'));
                iamWidget.attributes.showAttributesListGrid();
                iamWidget.attributes.showAttributesPropertyGrid();
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
                    Id: "item_FlowType",
                    StepId: "0001",
                    OrderNumber: null,
                    DataField: "Type",
                    DisplayName: "Type",//app.localize("AppType"),
                    DefaultValue: "DUAL",
                    IsRequired: false,
                    EditorType: "dxTextBox",// "dxSelectBox",

                    //ListDataSourceName: "FlowTypeSelect"
                },
                {
                    Id: "item_IsPublic",
                    StepId: "0001",
                    OrderNumber: null,
                    DataField: "Public",
                    DisplayName: "Public",
                    IsRequired: false,
                    EditorType: "dxCheckBox",
                    DefaultValue: true
                },
            ]
        }
    },
    //la fonction renvoie une chaine html si selector est null
    render: function (widget, selector) {

        let codeCSS = `<style>${widget.widgetCSS}</style>`;
        let codeHTML = ejs.render(widget.widgetHTML, widget.attributesVal);
        let codeJS = `<script>var widgetVariables = ${JSON.stringify(widget.attributesVal)};${widget.widgetJS}</script>`.replaceAll("widgetVariables", `${widget.id}_widgetVariables`);
        let code = `${codeCSS} ${codeHTML} ${codeJS}`;
        if (!selector) return code;
        return $(selector).append(code);
    },
    saveWidget: function () {
        let edi = iamWidget.codeEditor;
        let widget = iamWidget.widget;
        widget.widgetCSS = edi.css.getValue();
        widget.widgetHTML = edi.html.getValue();
        widget.widgetJS = edi.js.getValue();
    },
    runPreview: function () {
        let v = iamWidget.variables;
        iamWidget.saveWidget();
        let code = iamWidget.render(iamWidget.widget);

        $(`#${v.widgetPreviewId}`).html("");
        $(`#${v.widgetPreviewId}`).html(code);
        //let previewWindow = document.getElementById(v.widgetPreviewId).contentWindow.document;

        //previewWindow.open();
        //previewWindow.write(code);
        //previewWindow.close();
    },
    importWidget: function () {
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

                iamWidget.widget = widget;

                //Lister les attributs dans le propertyGrid et le gridView
                iamWidget.attributes.showAttributesListGrid();
                iamWidget.attributes.showAttributesPropertyGrid();

                iamWidget.codeEditor.css.setValue(widget.widgetCSS);
                iamWidget.codeEditor.html.setValue(widget.widgetHTML);
                iamWidget.codeEditor.js.setValue(widget.widgetJS);
                iamShared.messages.showSuccessMsg("Imported !")
            }
        }

        input.click();
    },
    exportWidget: function () {
        iamShared.files.stringToFileDownload("Widget_"+iamWidget.widget.name + ".json", JSON.stringify(iamWidget.widget));
    },
};

iamWidget.init();