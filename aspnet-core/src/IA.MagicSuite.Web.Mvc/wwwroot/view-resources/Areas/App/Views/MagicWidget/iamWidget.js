var iamWidget = {
    init: function (propertyGridId, editAttributesId, htmlEditorId, cssEditorId, jsEditorId, widgetPreviewId, runButtonId) {
        let v = iamWidget.variables;
        let edi = iamWidget.codeEditor;

        v.runButtonId = runButtonId || "iamWidgetPreviewButton";

        v.propertyGridId = propertyGridId || "iamWidgetAttributesPropertyGrid";
        v.editAttributesId = editAttributesId || "iamWidgetSettingAttributes";
        v.htmlEditorId = htmlEditorId || "iamWidgetCustomHTML";
        v.cssEditorId = cssEditorId || "iamWidgetCustomCSS";
        v.jsEditorId = jsEditorId || "iamWidgetCustomJS";
        v.widgetPreviewId = widgetPreviewId || "iamWidgetPreviewWindow";

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
            value: "function myScript(){return 100;}\n",
            theme: "dracula",
            mode: "javascript"
        });
        $(`#${v.editAttributesId} , #${v.cssEditorId} , #${v.jsEditorId}`).toggleClass("show active");


        $(`#${v.runButtonId}`).on('click', iamWidget.runPreview);

        iamWidget.attributes.showAttributesGrid();
          
    },
    runPreview: function () {
        console.log('click');
        let v = iamWidget.variables;
        let edi = iamWidget.codeEditor;

        let htmlCode = edi.html.getValue();
        let cssCode = `<style>${edi.css.getValue()}</style>`;
        let jsCode = `<script>${edi.js.getValue()}</script>`;

        let previewWindow = document.getElementById(v.widgetPreviewId).contentWindow.document;
        previewWindow.open();
        previewWindow.write(cssCode + htmlCode + jsCode);
        previewWindow.close();


    },
    variables: {
        propertyGridId: null,
        htmlEditorId: null,
        cssEditorId: null,
        jsEditorId: null,
        widgetPreviewId: null,
        editAttributesId: null,
        runButtonId:null
    },
    codeEditor: {
        css: null,
        html: null,
        js:null,
    },
    widget: {
        id: null,
        name: null,
        entityId: null,
        attributes: [
            {
                name: "nom",
                type: "string",
                public: true,
            },
        ],
        widgetHTML: "",
        widgetCSS: "",
        widgetJS: "",
        widgetJSON: {

        },
        option: function () { },
        render: function () { },
        onContentReady: function () { },
        beforeContentReady: function () { },

    },
    attributes: {
        showAttributesGrid: function () {
            let attr = iamWidget.widget.attributes;
            $(`#widgetAttributesGridList`).dxDataGrid({
                dataSource: attr,
                hoverStateEnabled: true,
                keyExpr: "name",
                columnFixing: { enabled: false },
                columns: [
                    {
                        dataField: "name",
                        caption: app.localize("Name"),
                        width:150,
                    },
                    {
                        dataField: "type",
                        caption: app.localize("Type"),
                        width: 150,
                    },
                    {
                        dataField: "public",
                        caption: app.localize("Public"),
                        dataType: "boolean",
                        width: 150,
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
                                    alert('edit');
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
                                    alert('delete');
                                },
                            }
                        ],
                        width: 150,
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
    },
};

iamWidget.init();