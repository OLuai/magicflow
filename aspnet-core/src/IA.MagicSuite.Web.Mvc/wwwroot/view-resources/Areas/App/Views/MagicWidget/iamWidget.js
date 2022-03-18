var iamWidget = {
    init: function (propertyGridId, editAttributesId , htmlEditorId, cssEditorId, jsEditorId, widgetPreviewId) {
        iamWidget.variables.propertyGridId = propertyGridId || "iamWidgetAttributesPropertyGrid";
        iamWidget.variables.editAttributesId = editAttributesId || "iamWidgetSettingAttributes";
        iamWidget.variables.htmlEditorId = htmlEditorId || "iamWidgetCustomHTML";
        iamWidget.variables.cssEditorId = cssEditorId || "iamWidgetCustomCSS";
        iamWidget.variables.jsEditorId = jsEditorId || "iamWidgetCustomJS";
        iamWidget.variables.widgetPreviewId = widgetPreviewId || "iamWidgetPreviewWindow";

        iamWidget.codeEditor.html = CodeMirror($(`#${iamWidget.variables.htmlEditorId}`)[0], {
            lineNumbers: true,
            tabSize: 4,
            mode: "text/html",
            theme: "dracula",
        });
        iamWidget.codeEditor.css = CodeMirror($(`#${iamWidget.variables.cssEditorId}`)[0], {
            lineNumbers: true,
            tabSize: 4,
            mode: "css",
            theme: "dracula",
        });
        iamWidget.codeEditor.js = CodeMirror($(`#${iamWidget.variables.jsEditorId}`)[0], {
            lineNumbers: true,
            tabSize: 4,
            value: "function myScript(){return 100;}\n",
            theme: "dracula",
            mode: "javascript"
        });
        $(`#${iamWidget.variables.editAttributesId} , #${iamWidget.variables.cssEditorId} , #${iamWidget.variables.jsEditorId}`).toggleClass("show active");
        //setTimeout(() => $(`#css-btn > a`).trigger('click'), 1000);
        //setTimeout(() => $(`#js-btn > a`).trigger('click'), 2000);
        //setTimeout(() => $(`#html-btn > a`).trigger('click'), 3000);
        
        
    },
    variables: {
        propertyGridId: null,
        htmlEditorId: null,
        cssEditorId: null,
        jsEditorId: null,
        widgetPreviewId: null,
        editAttributesId: null,
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
        widgetJSON: {
            attributes: [],
            widgetHTML: "",
            widgetCSS: "",
            widgetJS:"",

        },
        option: function () { },
        render: function () { },
        onContentReady: function () { },
        beforeContentReady: function () { },

    }
};

iamWidget.init();