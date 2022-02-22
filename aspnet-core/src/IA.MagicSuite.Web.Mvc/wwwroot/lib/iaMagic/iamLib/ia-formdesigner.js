/// <reference path="iahformdesigner-data.js" />
/// <reference path="jquery-3.3.1.js" />
/// <reference path="jquery-ui.js" />
/// <reference path="iahform-common.js" />
/// <reference path="iahformdesigner-obj-meta.js" />
/// <reference path="dxLib/js/dx.all.debug.js" />


var iamHFDLastTool = "dxTextBox", //Dernier outil utilisé
    iamHFDDraggedTool = null, //outil dreag and droppé
    iamHFDFormItems = [], //items du FormLayout
    iamHFDActiveObj = null, iamHFDActiveObjId = null, iamHFDActiveItemName = "",
    iamHFDSelectedItems = [], //items du FormLayout ou autres gros conteneurs
    iamHFDActiveObjMeta,//Meta de l'objet actif pour permettre le filtre des propriétés dans le propertyGrid
    
    //fonction a traiter au retour du callback du input file
    iamHFDActiveFileFunctionCallBack, 
    //Définit si c'est un import simple ou une fusion qui a été demandé par l'utilisateur
    iamHFDActivePageFusion ,
    //Précise si le fichier est de forme blob au lieu de texte
    iamHFDActiveFileIsBlob,
    //variable fusion js,html, css pour conserver le type de destination du fichier uploadé dans le designer
    iamHFDActiveFileFusionFileType,

    //objets du designers
    //vue active de modification dans le designer
    iamHFDActiveView, 
    //Editeur de script
    iamDesignerJsContent, 
     //Editeur de Html
    iamDesignerHtmlContent,
    //Editeur de Css
    iamDesignerCssContent, 

    //Popup et Grid du datasource Master details
    iamMasterDetailsDSPopup,
    iamMasterDetailsDSGrid,

    //Popup et Tree de sélection
    iamTreeSelectorPopup,
    iamTreeSelector,
    //popup avec contenu dynamique de facon sélective
    iamToolsDynamicContentPopup,
    //contenant tous les objets dynamiques qui seront créés comme outils dans le paramétrage
    iamToolsDynamicsElements = {},

    //Menu contextuel dynamique dont le contenu est adapté aux circonstances et objets depuis lequel il est appelé
    iamDynamicContentContextMenu,
    
    //menu contextuel de transfert de la barre d'outils du designer
    iamToolBarTransfertContextMenu, 
    iamDesignerCheckPopup, iamDesignerCheckPopupEditor, iampropEdit, iampropEditPopup,

    // conteneur fieldset principal
    iamContentFieldSet,
    //conteneur FormLayout principal
    iamContentFormLayout,
    iamContentFormLayoutContextMenu, iamContentFormLayoutDesignerPopup, iamContentFormLayoutTree,

    //Accordéon du designer qui contient la liste des controles
    iamDesignerAccordion, 
    iamDesignerAccordionFilter,
    iamTabPanel, iamDictionnaireTreeTimeout = null, iamDictionnaireTreeLastComponent = {},

    iamJsContentNew = "", iamHtmlContentNew = "", iamHFormHeadImports = "", iamnotification,
    iamtoken = "",
    iamAllowItemsTemplateGen = true, iamAutoCreateNames =true;


//Permet de créer automatiquement un fichier depuis le string passé "text" et de le download pour faciliter la fonction save
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function ElementGetAttribuesById (objID){
    var el = document.getElementById("someId");
    for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++) {
        arr.push(atts[i].nodeName);
    }
}

//Initialise la sélection (remet à 0 les variables de sélection)
function initSelection() {
    iamHFDSelectedItems = [];
    iamHFDActiveObjId = "";
    iamHFDActiveItemName = "";
    iamHFDDraggedTool = null;

    //retirer les styles de sélection et de drag and drop
    $("div.iamHFD_active_CSS").removeClass("iamHFD_active_CSS");
    $("div.iamHFD_drag_over_CSS").removeClass("iamHFD_drag_over_CSS");
}

//lancer la copie d'un fichier de texte et lire le resulat en executant une fonction passée en callback
function FileLoadClientFile(callBackFunction) {
    //Prendre la fonction pour la conserver en active pour le retour de lecture du fichier
    iamHFDActiveFileFunctionCallBack = callBackFunction;
    $("#iamHFDFileinput").trigger("click");    
}

//Permet de conserver le nom de l'objet
function dragstart(e, type_controle) {
    iamHFDDraggedTool = type_controle;   
}

//fonctions liées au Document Ready ****************************************************************************************************************************************************************

//Se lancer après le chargement du DOM à l'ouverture de la page
$(document).ready(function () {

    //supprimer la detection des gestes par OnSen UI qui rentre en confilt avec jquery UI draggable.
    //document.body._gestureDetector.dispose();
    //delete ons.GestureDetector;

    $( "#draggable" ).draggable({cursor: "pointer"});
    $( "#draggable").hide();
   // $("#iamDesignerConfigButton").kendoButton({icon: "gear"});
    //$("#iamDesignerConfigButton").kendoTooltip({ position: "top" });
   // $("#iamDesignerDeleteObj").kendoButton({icon: "minus" , click: function (e){ Objet_SupprimerObjet();} });
   
    //$("#iamDesignerReplaceObj").kendoButton({icon: "invert-colors" , click: function (e){ Objet_RemplacerObjet();} });
    
    //$("#iamDesignerEditObj").kendoButton({icon: "track-changes" , click: function (e){ Objet_EditerManuellementOptions();} });


    ////Créer le splitter principal
    //$("#iamDesignerSplitter").kendoSplitter({

    //    //height:function (){
    //    //    return $(window).height() - 170;
    //    //},
    //    panes: [
    //        { collapsible: true, min: "450px"},
    //        { collapsible: true, max: "550px", size:"370px" }
    //    ],
    //    width:"100%",
    //    orientation: "horizontal"
    //});
     
    ////Créer le splitter de la zone des codes html, Js et CSS
    //$("#iamCodeSplitter").kendoSplitter({
    //    height: function () {
    //        return $(window).height() - 200;
    //    },
    //    panes: [
    //        { collapsible: true },
    //        { collapsible: true },
    //        { collapsible: true }
    //    ]
    //});

    //Accordion pour les controles
    //$("#iamDesignerAccordionFilter").kendoMaskedTextBox();
    iamDesignerAccordionFilter = $("#iamDesignerAccordionFilter").dxTextBox().dxTextBox("instance");

    //$("#iamContentFormLayoutTree").kendoTreeView({
    //    dataTextField: "name",
    //    dragAndDrop: true,
    //    dataSource: iamHFDFormItems,
    //    dragend: function(e) {
    //        var tree = iamContentFormLayoutTree;

    //        /* tree.dataItem accesses the item's model. You will be able to access any field declared in your model*/
    //        var movingItem = tree.dataItem(e.sourceNode);
    //        var destinationItem = tree.dataItem(e.destinationNode);

    //        /*Using firebug, console.log(movingItem) will elaborate better as to what you have access in the object*/

    //        var movingItemID = movingItem.id;
    //        var destinationItemID = destinationItem.id;
    //            //Get the same ID by movingItemID.MyID 
    //            //(if id:"MyID" set in dataSource's schema)
    //    }
    //});

    //iamContentFormLayoutTree = $("#iamContentFormLayoutTree").data("kendoTreeView");

    $('#iamContentFormLayoutDesignerPopupMenu').dxMenu({
        items: iamContentFormLayoutDesignerPopupMenuItems
        , width: "100%"
        , onItemClick: function (e) {
            customizeTreeMenuClick ('iamContentFormLayoutDesignerPopupMenu', e);
        }
    });
   

    iamContentFormLayoutDesignerPopup = $("#iamContentFormLayoutDesignerPopup").dxPopup({
        title: "Personnalisation de l'interface utilisateur"        
    }).dxPopup("instance");

            
    iamDesignerCheckPopup = $("#iamDesignerCheckPopup").dxPopup({
        title: "Information de vérification"
    }).dxPopup("instance");

    //Créer la barre principale du formulaire
    iamDesignerMenu = $("#iamDesignerMenu").dxToolbar({
        onItemRendered: function (e) {
            if (e.itemData.id == "iamHFDTransfertButton") {
                e.itemElement.attr("id", "iamHFDTransfertButton");
                return;
            }
            
            return;
        },
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: {                    
                    icon: 'far fa-folder-open',
                    hint:"Ouvrir un fichier MagicForm",
                    onClick: function() {
                        var fct = function (data) {
                            //déserialiser le data
                            alert(data);
                        };
                        //charger le fichier
                        FileLoadClientFile(fct);
                    }
                }
            }, {
                location: 'before',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    hint:"Nouveau: Réinitialiser la page depuis un nouveau modèle.",
                    icon: "far fa-file",
                    onClick: function() {
                        HFormNew();
                    }
                }
            }, {
                location: 'before',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    hint:"Enregistrer",
                    icon: "far fa-save",
                    onClick: function() {
                        HFormSave();
                    }
                }
            }, {
                id:"iamHFDTransfertButton",
                location: 'before',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    name:"",
                    hint: "Transférer (Import/Export)",
                    icon: "far fa-exchange-alt",
                    onClick: function () {
                        //Afficher le popup
                        if (iamToolBarTransfertContextMenu == null) {
                            toolBarCreateTransfertContextMenu(true);
                        } else {
                            iamToolBarTransfertContextMenu.show();
                        }
                    }
                }
            },
           
            {
                location: 'center',
                locateInMenu: 'never',
                template: function() {
                    return $("<div class='toolbar-label'><table><tr><td><img  src='/favicon-32x32.png' /></td><td width='10px'></td><td><b>Magic HForm Designer</b> - " + iamHForm.nomFormulaire + " (" + iamHForm.idFormulaire + ")" + "</td></tr></table></div>");
                }
            },

            {
                location: 'after',
                widget: 'dxButtonGroup',
                locateInMenu: 'auto',
                options: {
                    items: iamHFDToolbarDevicesItems,
                    keyExpr: "value",
                    stylingMode: "outlined",
                    selectedItemKeys: [""],
                    onItemClick: function (e) {
                        toolsUpdateDeviceType(e.itemData.value);
                    }
                }
            },
             
            {
                location: 'after',
                widget: 'dxButtonGroup',
                locateInMenu: 'auto',
                options: {
                    items: iamHFDToolbarViewsItems,
                    keyExpr: "value",
                    stylingMode: "outlined",
                    selectedItemKeys: ["designer"],
                    onItemClick: function (e) {                       
                        iamHFDActiveView = e.itemData.value

                        //Masquer toutes les fenetres
                        $("#iamDesignerMainDiv").hide();
                        $("#iamCodeElements").hide();
                        $("#iamDesignerPreview").hide();

                        switch (iamHFDActiveView) {
                            case "designer": {
                                //Designer
                                iamHFDActiveView = 'Designer';
                                HFormBuild();                                
                                $("#iamDesignerMainDiv").show();
                                break;
                            }
                            case "code": {
                                //Html, CSS et Js                    
                                $("#iamCodeElements").show();
                                resizeSplitter();
                                //iamDesignerHtmlContent.resize();
                                //iamDesignerJsContent.resize();
                                //iamDesignerCssContent.resize();
                                break;
                            }
                            case "preview": {
                                //Preview
                                HFormPreview();
                                $("#iamDesignerPreview").show();
                                break;
                            }
                        }
                    }
                }
            }, {
                locateInMenu: 'always',
                text: 'Exporter Js',
                icon:'far fa-js-square',                
                onClick: function() {
                    DevExpress.ui.notify("Print option has been clicked!");
                }
            }, {
                locateInMenu: 'always',
                text: 'Exporter CSS',
                icon:'far facss3-alt',                
                onClick: function() {
                    DevExpress.ui.notify("Print option has been clicked!");
                }
            }, {
                locateInMenu: 'always',
                icon: 'far fa-sliders-h-square',
                text: 'Propriétés Page',
                onClick: function() {
                    DevExpress.ui.notify("Propriétés page option has been clicked!");
                }
            }
            ]
        }).dxToolbar("instance");

    /*
    //Créer l'editeur HTML
    iamDesignerHtmlContent = ace.edit("iamDesignerHtmlContent");
    iamDesignerHtmlContent.session.setMode("ace/mode/html");
    iamDesignerHtmlContent.setShowPrintMargin(false);
    //iamDesignerJsContent.setTheme("ace/theme/monokai");

    //Créer l'editeur CSS
    iamDesignerCssContent = ace.edit("iamDesignerCssContent");
    iamDesignerCssContent.session.setMode("ace/mode/html");
    iamDesignerCssContent.setShowPrintMargin(false);
    //iamDesignerJsContent.setTheme("ace/theme/monokai");

    //Créer l'éditeur Javascript
    iamDesignerJsContent = ace.edit("iamDesignerJsContent");
    iamDesignerJsContent.session.setMode("ace/mode/javascript");
    iamDesignerJsContent.setShowPrintMargin(false);
    //iamDesignerJsContent.setTheme("ace/theme/monokai");
    */

    $("#iamCodeElements").hide();    
    $("#iamDesignerPreview").hide();

    iamTabPanel = $("#iamTabPanel").dxTabPanel({
        items: iamTabPanelItems,
        onSelectionChanged: function (e) {
            if (e.addedItems[0].name == 'iamDesignerPropertyGridTabPanelItem' && iamHFDActiveObjId) {
                //vérifier si un objet est actif et le charger dans le propertyGrid
                propertyGridLoadObjectPropertiesByName(iamHFDActiveObjId);
            }
        },
        onItemRendered: function (e) {
            if (e.itemData.name == 'iamDesignerAccordionTabPanelItem') {
                
                iamDesignerAccordion = $("#iamDesignerAccordion").dxAccordion({
                    dataSource: iamDesignerControlesCategories,
                    animationDuration: 300,
                    collapsible: true,
                    multiple: true,
                    //selectedItems: [accordionItems[0]],
                    //itemTitleTemplate: $("#title"),
                    itemTemplate: function (itemData, itemIndex, itemElement) {
                        //créer la liste des controles
                        Controles_createSelectorList(itemData.id_categorie, itemElement);
                    }
                }).dxAccordion("instance");
            } else {
                //creér le tree dictionnaire des objets
                if (e.itemData.name == 'iamDesignerDictionnaireTabPanelItem') {
                    treeDictionnaireCreate();
                }
               
            }
            
        }

        //Elargir les onglets à 100% de la width
        ,onContentReady: function(e) {
            e.element.find(".dx-tab").css({
            "width": "32%",
            "display": "inline-block" });
        }
    }).dxTabPanel("instance");
    createManualPropertiesEditor();    
    Objet_CreatesListWindow();

   
    
    //Gérer le redimmensionnement automatique du splitter principal ----------------------------------------------------------
    var outerSplitter = null// $("#iamDesignerSplitter").data("kendoSplitter");
    var codeSplitter = null// $("#iamCodeSplitter").data("kendoSplitter");
    var browserWindow = $(window);
    var headerFooterHeight = $("#iamDesignerMenu").height();//+ $("#footer").height();

    
    function resizeSplitter() {
        /*outerSplitter.wrapper.height(browserWindow.height() - headerFooterHeight - 55);
        outerSplitter.resize();
        codeSplitter.wrapper.height(browserWindow.height() - headerFooterHeight - 57);
        codeSplitter.resize();

        const newHeight = browserWindow.height() - headerFooterHeight - 102;

        $('#iamDesignerHtmlContent').height(newHeight.toString() + "px");
        $('#iamDesignerHtmlContent-section').height(newHeight.toString() + "px");
        iamDesignerHtmlContent.resize();

        $('#iamDesignerJsContent').height(newHeight.toString() + "px");
        $('#iamDesignerJsContent-section').height(newHeight.toString() + "px");
        iamDesignerJsContent.resize();

        $('#iamDesignerCssContent').height(newHeight.toString() + "px");
        $('#iamDesignerCssContent-section').height(newHeight.toString() + "px");
        iamDesignerCssContent.resize();

        $('#iamDesignerPreviewFrame').css('height',browserWindow.height() - headerFooterHeight - 60);*/
    }
    //redimmensionner le splitter
    resizeSplitter();
    //Lier la fonction de redimmensionnement du splitter à l'évènement resize du window
    browserWindow.resize(resizeSplitter);


    //Events **********************************************************************************************************************************************************

    $(document).on('change', '#iamHFDFileinput', function (e) {
        File_readFileAndExecuteCallbackFunction(e, iamHFDActiveFileFunctionCallBack, iamHFDActiveFileIsBlob);
    });

    //gestion du drag and drop
    $(document).on("dragover", "#divInnerSplitterContentAndCode", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $(document).on("drop", "#divInnerSplitterContentAndCode", function (e) {
        e.preventDefault();
        e.stopPropagation();
        //depot dans le form layout
        formItemsMoveTowardsItemByItemName('iamContentFormLayout', null, iamHFDDraggedTool);
    });
    $(document).on("dragover", "#iamContentFormLayout div.dx-field-item", function (e) {
        e.stopPropagation();
        e.preventDefault();
        if ($(this).parent().hasClass("iamHFD_drag_over_CSS") == false) $(this).parent().addClass("iamHFD_drag_over_CSS");
    });
    $(document).on("dragenter", "#iamContentFormLayout div.dx-field-item", function (e) {
        $(this).parent().addClass("iamHFD_drag_over_CSS");
    });
    $(document).on("dragenter", "#iamContentFormLayout div.dx-tab", function (e) {
        $(this).addClass("iamHFD_drag_over_CSS");
    });
    $(document).on("dragleave", "#iamContentFormLayout div.dx-field-item", function (e) {
        $(this).parent().removeClass("iamHFD_drag_over_CSS");
    });
    $(document).on("dragleave", "#iamContentFormLayout div.dx-field-item", function (e) {
        $(this).removeClass("iamHFD_drag_over_CSS");
    });
    $(document).on("drop", "#iamContentFormLayout div.dx-tab", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass("iamHFD_drag_over_CSS");
         
        var name = formItemsGetItemNameByDomElement($(this));

        if (name) formItemsMoveTowardsItemByItemName(name, null, iamHFDDraggedTool);         
    });
    $(document).on("drop", "#iamContentFormLayout div.dx-multiview-item", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass("iamHFD_drag_over_CSS");

        //recherhcher le conteneur de l'entete
        var name = formItemsGetItemNameByDomElement($(this));

        if (name) {
            formItemsMoveTowardsItemByItemName(name, null, iamHFDDraggedTool);
        }
    });
    $(document).on("drop", "#iamContentFormLayout div.dx-field-item", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().removeClass("iamHFD_drag_over_CSS");

        var name = formItemsGetItemNameByDomElement($(this));
        //Si l'objet contient directement un nom alors l'utiliser comme élément
        if (name) {
            formItemsMoveTowardsItemByItemName(name, null, iamHFDDraggedTool);
            return;
        } else {
            showErreurMsg("L'item de destination n'a pas été trouvé!");
        }
               
    });

    $(document).on('keyup', "#iamfloating_edit_caption", function (e) {

        if (e.keyCode == 13) {
            //Enter key. Insérer le text dans l'item.
            formItemsModifyText($("#iamfloating_edit_caption").val(), iamHFDFormItems);           
        }
        if (e.keyCode == 27 || e.keyCode == 13) {
            //Esc Key - fermer sans sauvegarder ou fermer après avoir sauvegardé plus haut
            $("#iamfloating_edit_caption").hide();
            //retourner l'objet à sa position initiale
            $("#iamfloating_edit_caption").prependTo($("#iamDesignerContent"));
            return;
        }
    })

    $(document).on("click", "div.dx-form", function (e) {        
        initSelection();
        $("div.iamHFD_active_CSS").removeClass("iamHFD_active_CSS");
    });
    //dx-form-group (div)
    //dx-form-group-caption (span)
    //dx-form-group-content (div)

    //dx-field-item (div) -- attention un peu grand par moment
    //dx-field-item-content (div) controle dans item
    //dx-field-item-label (label)
    $(document).on("dblclick", "#iamContentFormLayout label.dx-field-item-label,#iamContentFormLayout span.dx-form-group-caption, #iamContentFormLayout span.dx-tab-text", function (e) {
        e.stopPropagation();
        e.preventDefault();
        //si l"objet a été détruit pour quelque raisons que ce soit alors le recréer dynamiquement
        if ($("#iamfloating_edit_caption").length == 0) {
            $("<input id='iamfloating_edit_caption' draggable='false'/>").prependTo($("#iamDesignerContent"));
        }

        $("#iamfloating_edit_caption").appendTo($(this));
        //charger le text de l'élément sélectionné
        $("#iamfloating_edit_caption").val(formItemsGetSelectedText());
        $("#iamfloating_edit_caption").show();//afficher le input
        $("#iamfloating_edit_caption").focus();
        
        
    });

    $(document).on("click", "#iamContentFormLayout div.dx-tab", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        initSelection();

        $(this).addClass("iamHFD_active_CSS");

        if (!$(this).attr('draggable')) {
            $(this).attr('draggable', true);
        }

        var name = formItemsGetItemNameByDomElement($(this));

        if (name == null) {
            showErreurMsg("Aucun élément rattaché n'a pas été trouvé!");
        } else {
            //depot sur un titre d'onglet 
            if (iamHFDSelectedItems.includes(name) ==false) iamHFDSelectedItems.push(name);
        }

    });

    $(document).on("click", "#iamContentFormLayout div.dx-field-item", function (e) {
        var added = true;

        iamHFDDraggedTool = null;

        e.stopPropagation();
        e.preventDefault();

        if (e.ctrlKey || e.shiftKey) {
            $(this).parent().toggleClass("iamHFD_active_CSS");
            //préciser que l'élément à été rétirer
            if ($(this).parent().hasClass("iamHFD_active_CSS") == false) added = false;
            
        } else {
            initSelection();       
           
            $(this).parent().addClass("iamHFD_active_CSS");
            
            if (!$(this).attr('draggable')) {
                $(this).attr('draggable', true);
            }
            
        }
        
        var name = formItemsGetItemNameByDomElement($(this));
        
        //Si l'objet contient directement un nom alors l'utiliser comme élément
        if (name) {
            if (added) {                
                if (iamHFDSelectedItems.includes(name) == false) iamHFDSelectedItems.push(name);
            } else {
                arrayRemoveByValue(iamHFDSelectedItems, name);
            }
        } else {
            showErreurMsg("L'item de destination n'a pas été trouvé!");
        }

        //Toujours conservé le premier élément de la sélection comme items actif
        if (iamHFDSelectedItems.length > 0) {
            iamHFDActiveItemName = iamHFDSelectedItems[0];

            //Afficher les propriétés du controle interne à l'item si la fenêtre des propriétés est visible
            if (iamTabPanel.option("selectedIndex") == 0) {
                formItemsLoadItemObjectPropertiesByItemName(iamHFDActiveItemName);            
            }
        }
        
        return;       
   
    });
    
    // Gérer le Click sur les controles de la boite à outils
    $(document).on('click', '.controle-picker-list a', function () {
        // Sets selected icon
        iamHFDLastTool = $(this).attr('name');

        // Removes any previous active class
        $('.controle-picker-list a').removeClass('active');

        // Sets active class
        $('.controle-picker-list a').filter('[name=' + iamHFDLastTool + ']').addClass('active');

        //créer l'objet
        if (iamContentFormLayout == null) {
            Objet_Create(null, iamHFDLastTool, null, null, true);
        }else{
            Objet_Create(null, iamHFDLastTool, "iamContentFormLayout", null, true);
        }
        
    });

    // fin events ----------------------------------------------------------------------------------------------------------------------------------------


    //Charger les templates du designer
    LoadTemplates();


    //charger le device en cours
    toolsUpdateDeviceType(null);

    //Charger le formulaire dans le storage si nécessaire
    HFormGetFormFromStorage(iamHForm.idFormulaire + "LoadFromStorage");


    //masquer le busy
    $('#loading_div').hide();
});



//Permet la creation de la  liste des controles que l'on peut créer en flex
function Controles_createSelectorList(categoryId, templateElement) {
    
    var //Template du selecteur de controle
        iamControlesSelectorTemplate = '<li><a class="{{activeState}}" name="{{type_controle}}" data-name="{{type_controle}}" ondragstart="dragstart(event,\'{{type_controle}}\')" data-index="{{index}}"><img src="{{icon}}"/image><span class="name-class">{{nom}}</span></a></li>'

    //filtre la catégory
    icons = iamDesignerControlesTypeItems.filter(function (el) { return el.id_categorie == categoryId })

    var chaine = '<ul class="controle-picker-list">';

    // Loop through JSON and appends content to show icons
    $(icons).each(function (index) {
        var itemtemp = iamControlesSelectorTemplate;
        var icon = icons[index].icon;
        var nom = icons[index].nom_controle;
        var type_controle = icons[index].type_controle;

        if (type_controle == iamHFDLastTool) {
            var activeState = 'active'
        } else {
            var activeState = ''
        }

        chaine += itemtemp.replace(/{{icon}}/g, icon).replace(/{{nom}}/g, nom).replace(/{{type_controle}}/g, type_controle).replace(/{{index}}/g, index).replace(/{{activeState}}/g, activeState);
              
    });

    chaine += '</ul>';
    templateElement.append(chaine);

}

//Permet de créer le menu contextuel de transfert dans la barre d'outils principale du designer
function toolBarCreateTransfertContextMenu(show) {

    //Générer le contenext menu
    iamToolBarTransfertContextMenu = $("#iamToolBarTransfertContextMenu").dxContextMenu({
        items: iamDesignerMenuTransfererItems
        , target: "#iamHFDTransfertButton"
        ,position: { offset: '0 45' }
        , onItemClick: function (e) {
            var itemData = e.itemData;
            switch (itemData.id) {
            
                //les exports
                case "iamexport_page_zip": {
                    HFormSaveAs("zip");
                    break;
                }

                case "iamexport_page_json": {
                    HFormSaveAs("json");
                    break;
                }
                case "iamexport_html": {
                    
                    break;
                }
                case "iamexport_css": {
                    
                    break;
                }
                case "iamexport_js": {
                    
                    break;
                }

                //les imports
                case "iamimport_page_zip": {
                    HFormImportPage(false, true);
                    break;
                }
                case "iamimport_page_json": {
                    HFormImportPage(false, false);
                    break;
                }
                case "iamfusion_page_zip": {
                    HFormImportPage(true, true);
                    break;
                }
                case "iamfusion_page_json": {
                    HFormImportPage(true, false);
                    break;
                }
                case "iamfusion_html": {
                    HFormFusionPageElementFile('html');
                    break;
                }
                case "iamfusion_css": {
                    HFormFusionPageElementFile('css');
                    break;
                }
                case "iamfusion_js": {
                    HFormFusionPageElementFile('js');
                    break;
                }
               
            }

            return;
        }
    }).dxContextMenu('instance');

    //si on doit directement l'afficher tout de suite alors le faire
    if (show) iamToolBarTransfertContextMenu.show();
}

//fin fonctions Document Ready ---------------------------------------------------------------------------------------------------------------------------------------------------------------------



//FONCTIONS CONTROLS TOOLS AND DESIGNERS **************************************************************************************************************************************************

//permet de simuler l'ecran des smartphones et tablette
function toolsUpdateDeviceType(deviceName) {

    var id = "#iamEmulator"; //#iamDesignerMainDiv 

    if (deviceName != null) {
                
        $(id).removeClass("emulator__item");  
        $(id).attr("device", deviceName);

        if (deviceName == '') {    
            $(id).height("auto");
            $(id).width("100%");

            //repeindre le layout pour prendre en compte les modifications si le layout existe
            if (iamContentFormLayout) iamContentFormLayout.repaint();
            return;
        } else {
            //return;
            $(id).addClass("emulator__item");
        }
    }
    

    //Mettre à jour l'emulateur de device 
    var emulators = document.querySelectorAll(".emulator__item");
    
    for (let i = 0; i < emulators.length; i++) {
        let emulatorDevice = emulators[i].getAttribute("device");
        if (emulatorDevice in devices) {
            // If a key with the same device name exists in our devices object...
            //emulators[i].setAttribute(
            //    "width",
            //    devices[emulatorDevice].resX / devices[emulatorDevice].devicePixelRatio
            //);
            //emulators[i].setAttribute(
            //    "height",
            //    devices[emulatorDevice].resY / devices[emulatorDevice].devicePixelRatio
            //);
            //emulators[i].style.height = "" + devices[emulatorDevice].resY / devices[emulatorDevice].devicePixelRatio + "";
            $(id).height(devices[emulatorDevice].resY / devices[emulatorDevice].devicePixelRatio);
            $(id).width(devices[emulatorDevice].resX / devices[emulatorDevice].devicePixelRatio);
            
        } else {
            // else we use a defaultDevice
            //emulators[i].setAttribute(
            //    "width",
            //    devices[defaultDevice].resX / devices[emulatorDevice].devicePixelRatio
            //);
            //emulators[i].setAttribute(
            //    "height",
            //    devices[defaultDevice].resY / devices[emulatorDevice].devicePixelRatio
            //);
            $(id).width(devices["defaultDevice"].resX / devices["defaultDevice"].devicePixelRatio);
            $(id).height(devices["defaultDevice"].resY / devices["defaultDevice"].devicePixelRatio);
        }
        //Apply our scale modifier to make the emulators reasonably sized
        emulators[i].style.transform = "scale(" + scaleModifier + ")";
    }

    //repeindre le layout pour prendre en compte les modifications si le layout existe
    if (iamContentFormLayout) iamContentFormLayout.repaint();
    return;
}

//Permet de créer le popup devant avoir un contenu dynamique et présenter diverses infos de facon sélective en popup.
function toolsDynamicContentPopupCreate() {

    if (iamToolsDynamicContentPopup == null) {
        iamToolsDynamicContentPopup = $("#iamToolsDynamicContentPopup").dxPopup({
            width: 800,
            height: 550,
            title: "TITRE",
            resizeEnabled: true,
            showTitle: true,
            closeOnOutsideClick: false,    
        }).dxPopup("instance");
    }

    return;
}

//Permet d'affichier un objet contenu dans le popup de contenu dynamique et de créer automatiquement le popup s'il n'avait pas été créé au paravant
function toolsDynamicContentPopupShowInnerObject(innerObjName, popupTitle) {

    //créer l'objet popup s'il n'existe pas déjà
    if (iamToolsDynamicContentPopup == null) toolsDynamicContentPopupCreate();

    //Masquer tous les enfants direct contenu dans l'élément parent
    if ($("#iamToolsDynamicContent").children().length > 0) $("#iamToolsDynamicContent").children().hide();

    if ($("#" + innerObjName +"Container").length > 0) {
        //l'élément existe déjà donc simplement l'afficher
        $("#" + innerObjName + "Container").show();

        iamToolsDynamicContentPopup.option("title", popupTitle);
        //afficher le popup
        iamToolsDynamicContentPopup.show();
        return;
    }

    showErreurMsg("L'objet '" + innerObjName + "' n'a pas été trouvé");
}

//permet de créer le Div conteneur et le div de l'objet lui même devant être affiché dans le popup à contenu dynamique.
function toolsDynamicContentInnerObjectCreateHtml(innerObjName) {
        
    if ($("#" + innerObjName + "Container").length > 0) {
        //l'élément existe déjà donc simplement l'afficher
        return $("#" + innerObjName);

    } else {

        //Vérifier l'existence du div des contenus dynamique dans le popup
        if ($("#iamToolsDynamicContent").length > 0) {
            $("#iamToolsDynamicContent")
                .append("<div id='" + innerObjName + "Container'>" + "<div id='" + innerObjName + "'></div></div>")
                .promise()
                .done(function (item) {
                    return $("#" + innerObjName);
                });
        } else {

            if (!iamToolsDynamicContentPopup) {
                //créer le popup
                toolsDynamicContentPopupCreate();
            }
            //Ajouter le contenu Html au popup
            iamToolsDynamicContentPopup.content().append("<div id='iamToolsDynamicContent'>").promise()
                .done(function (item) {
                    $("#iamToolsDynamicContent")
                        .append("<div id='" + innerObjName + "Container'>" + "<div id='" + innerObjName + "'></div></div>")
                        .promise()
                        .done(function (item) {
                            return $("#" + innerObjName);
                        });
                }); 
        }
        

    }

}


// permet de créer le popup de sélection contenant un tree.la source de données du popup a une structure:
//{ name: , text: , id_parent: , icon:  }
function toolsTreeSelectorPopupCreate() {
    
    //Créer le tree puis le popup        
    iamTreeSelector = $("#iamTreeSelector").dxTreeView(iamTreeSelectorOption).dxTreeView("instance");

    iamTreeSelectorPopup = $("#iamTreeSelectorPopup").dxPopup({
        width: 600,
        height: 450,
        title: "SELECTION...",
        resizeEnabled: true,
        showTitle: true,
        closeOnOutsideClick: false,        
    }).dxPopup("instance");

    return;
}

//selectionArray est de la forme : [{ name: , text: , id_parent: , icon:  },{ name: , text: , id_parent: , icon:  }]
//selectionSuccessCallbackFunction est une fonction acceptant comme seul parametre e la selection réalisée par l'utilisateur
function toolsTreeSelectorPopupShow(selectionArray, selectionSuccessCallbackFunction) {

    if (selectionArray) iamTreeSelector.option("items", selectionArray);

    //Afficher le popup
    iamTreeSelectorPopup.show();
    return;
}

// permet de créer le menu contextuel dynamique physiquement depuis le html div
//{ id: , text: , icon: iamImagesPath + "saisir/zip_file_24.png", beginGroup: true },
function toolsDynamicContentContextMenuCreate(itemElement, items, itemClickCallbackFunction) {

    if (items) iamDynamicContentContextMenuOption.items = items;

    if (items) iamDynamicContentContextMenuOption.target = itemElement;

    if (itemClickCallbackFunction) iamDynamicContentContextMenuCallbackFunction = itemClickCallbackFunction;

    //Créer le contexte menu        
    iamDynamicContentContextMenu = $("#iamDynamicContentContextMenu").dxContextMenu(iamDynamicContentContextMenuOption).dxContextMenu("instance");

    return;    
}

// permet de mettre à jour la liste des items du menu contextuel dynamique et l'afficher si nécessaire
//items est de la forme : [{ id: , text: , icon: iamImagesPath + "saisir/zip_file_24.png", beginGroup: true },...]
function toolsDynamicContentContextMenuUpdateItems(itemElement, items, itemClickCallbackFunction, show) {

    if (!iamDynamicContentContextMenu) {
        //créer le menu dynamique et charger les items passés
        toolsDynamicContentContextMenuCreate(itemElement, items);
    } else {
        //Recharger les items du menu contextuel        
        iamDynamicContentContextMenu.option("items", items);
        //Prendre le bon élément jquery ou par son id comme élément de base de positionnement du menu contextuel
        iamDynamicContentContextMenu.option("target", itemElement);
    }

    iamDynamicContentContextMenuCallbackFunction = itemClickCallbackFunction;

    //Afficher le menu contextuel si cela est demandé
    if (show) toolsDynamicContentContextMenuShowHide(show, itemElement);

    return;
}

//Afficher/masquer le menu contextuel selon la demande
function toolsDynamicContentContextMenuShowHide(show, itemElement) {

    //si le menu contextuel n'est pas encore créé alors sortir
    if (!iamDynamicContentContextMenu) {
        return;
    }

    if (itemElement) iamDynamicContentContextMenu.option("target", itemElement);

    if (show) {
        iamDynamicContentContextMenu.option("disabled", false);        
        iamDynamicContentContextMenu.show();
    } else {
        iamDynamicContentContextMenu.option("disabled", true);
        iamDynamicContentContextMenu.hide();
    }

    return;
}

//fonction permettant d'afficher le popup de sélection des sources
//selectionSuccessFunctionCallback : fonction exécutée lorsqu'une selection a été validée elle retourne les éléments sélectionnés : [name: , text:, id_parent:, icon:]
function toolsDataSourcePopupSelect(selectionSuccessFunctionCallback) {

    var dsObjetcs = arrayFilterByItemProperty(iamHForm.objectsList, "id_categorie", "DATASOURCE");
    var items = [];
    if (dsObjetcs) {
        //charger la liste des sources de données
        dsObjetcs.forEach(function (item, indx) {
            let objOption = item.option_objet;
            if (objOption.iaType == 'iaMasterDetailsDS') {
                if (objOption.sqlSources) {
                    //prendre la source de données
                    items.push({ name: objOption.name , text: objOption.name, id_parent: null, icon: objOption.icon });
                    objOption.sqlSources.forEach(function (item, indx) {                        
                        items.push({ name: objOption.name + "_iaIndex_" + indx.toString(), text: objOption.name + "." + item.nom_table + " (index:" + indx.toString() +")", id_parent: objOption.name, icon: null });
                    });
                }
            } else {
                items.push({ name: objOption.name, text: objOption.name, id_parent: null, icon: objOption.icon });
            }            
        });

        //afficher le popup de sélection et charger les items pour permettre le choix
        toolsTreeSelectorPopupShow(items, selectionSuccessFunctionCallback);

    } else {
        showWarningMsg("Aucune source de données n'existe dans la page!");
        return;
    }

    
    return;
}

//fonction permettant de remplacer les objets de la page par ceux spécifiés dans le tableau passé en paramètre
function toolsDataSourceRemplacerObjetsPage(objArr, containerType) {
    //supprimer les anciens objets

    //Ajouter les éléments à la page
    toolsDataSourceAjouterObjetsPage(objArr, containerType);

}

//Permet de retourner un string Guid
function toolsNewGuid() {
    return new DevExpress.data.Guid().toString();
}

//fonction permettant de remplacer les objets de la page par ceux spécifiés dans le tableau passé en paramètre
function toolsDataSourceAjouterObjetsPage(objArr, containerType, id_parent) {

    //si aucun type de conteneur n'est passé alors prendre le dxForm par défaut
    if (!containerType) containerType = "dxForm";

    //Créer le layout s'il n'existe pas déjà
    if (iamContentFormLayout == null && containerType == "dxForm") {
        Objet_Create("iamContentFormLayout", "dxForm");
    }

    //Créer un fieldSet s'il n'existe pas déjà
    if (containerType == "dxFieldSet") {
        Objet_Create(null, "dxFieldSet");
    }

    if (id_parent == null && containerType == "dxForm") id_parent = "iamContentFormLayout";

    objArr.forEach(function (item, indx) {
       
        //vérifier si l'objet contient des propriété complémentaires
        if (item.options_complementaires) {
            let options_complementaires = JSONfn.parse(item.options_complementaires);
            //créer l'objet en ajoutant les propriétés complémentaires
            Objet_Create(item.nom_controle, item.type_controle, id_parent, null, true, false, null, options_complementaires );
        } else {
            //créer l'objet simplement
            Objet_Create(item.nom_controle, item.type_controle, id_parent);
        }

        //Ajouter le bindings de l'objet
        iamHForm.bindings.push({ bId: toolsNewGuid(), bProperty: item.nom_controle + "." + item.bindings_property, bExpression: item.bindings_value });
    });

}

//fonction permet de générer de nouveaux objets dans le formulaire depuis les champs de la source de données passée en paramètre
function toolsDataSourceGenererObjets(dsName, dsType){

    //Prendre l'objet actif si dsName n'est passé en paramètre
    if (dsName == null) dsName = iamHFDActiveObjId;

    let objOption = Objet_GetObjetOptions(dsName);
    if (objOption == null) {
        showErreurMsg("Aucun objet retrouvé sous le nom : '" + dsName + "'.");
        return;
    }

    var objArray = [];

    //Prendre le type depuis l'option de l'objet s'il n'est passé en paramètre
    if (dsType == null) dsType = objOption.iaType;
    switch (dsType) {
        case "iaMasterDetailsDS": {
            var type_controle;
            objOption.sqlSources.forEach(function (item, indx) {

                if (indx > 0) {
                    objArray.push({
                        nom_champ: item.champ_id
                        , nom_controle: "tb_" + item.nom_table
                        , type_controle: "dxDataGrid"
                        , bindings_property: "dataSource"
                        , bindings_value: objOption.name + ".data['" + item.nom_table+"']"
                        , options_complementaires: JSON.stringify({ keyExpr: item.champ_id })
                    });
                } else {
                    //première source, créer les editeurs selon la liste des champs de la source de données
                    if (!item.offline_schema) {
                        showErreurMsg("Aucun schema chargé pour cette source. Veuillez charger le 'schema' hors ligne (offline schema) et relancer l'opération.");
                        return;
                    }

                    var offline_schema_array = item.offline_schema;
                    offline_schema_array.forEach(function (el, idx) {
                        type_controle = toolsDataSourceGetTypeControleFromNomChamp(el.ColumnName, el.DataTypeName);
                        objArray.push({
                            nom_champ: el.ColumnName
                            , nom_controle: "db_" + el.ColumnName
                            , type_controle: type_controle
                            , bindings_property: toolsDataSourceGetValueBindingPropertyFromTypeControle(type_controle)                            
                            , bindings_value: objOption.name + ".data['" + item.nom_table + "']." + el.ColumnName
                            , options_complementaires: null
                        });
                    });
                    
                }
            });
            break;
        }
    }

    //créer le Html pour le grid outil de génération des objets.
    toolsDynamicContentInnerObjectCreateHtml("iamGenererObjetsGrid");

    //Créer le grid de Génération des controles s'il n'existe pas encore.
    if (iamToolsDynamicsElements["toolsGenererObjetsGrid"] == null) {
        //créer  le grid physiqument
        iamGenererObjetsGridOption.dataSource = objArray;
        iamToolsDynamicsElements["toolsGenererObjetsGrid"] = $("#iamGenererObjetsGrid").dxDataGrid(iamGenererObjetsGridOption).dxDataGrid("instance");
    } else {
        //recharger la source du grid déjà existant
        iamToolsDynamicsElements["toolsGenererObjetsGrid"].option("dataSource", objArray);
    }

    //afficher le popup contenant la liste des objets à créer.
    toolsDynamicContentPopupShowInnerObject("iamGenererObjetsGrid", "OBJETS A GENERER");
    return;
}

//fonction permet de charger les schemas des sql de la source de données passée en paramètre
function toolsDataSourceChargerOfflineSchema(dsName, dsType) {

    //Prendre l'objet actif si dsName n'est passé en paramètre
    if (dsName == null) dsName = iamHFDActiveObjId;

    var objOption = Objet_GetObjetOptions(dsName);

    if (objOption == null) showErreurMsg("Aucun objet retrouvé sous le nom : '" + dsName + "'.");

    var strOption = JSON.stringify(objOption);
    var url = "";// iamRootPath +  "Designers/DataSourceOfflineSchemaGet";
    var timeout = 5000;

    //Prendre le type depuis l'option de l'objet s'il n'est passé en paramètre
    if (dsType == null) dsType = objOption.iaType;

    $.ajax({
        url: url,
        data: { ds_name: dsName, ds_type: dsType, ds_option: encodeURIComponent(strOption), user_token: iamtoken },
        type: "POST",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                showErreurMsg(result.ErrorMessage);
                return;
            }
            if (dsType == 'iaMasterDetailsDS') {
                for (var i = 0; i < objOption.sqlSources.length; i++) {
                    objOption.sqlSources[i]['offline_schema'] = result.Data[i];
                }                
            } else {
                objOption['offline_schema'] = result.Data;
            }
            showSuccessMsg("Schema de la source de données '" + dsName + "' actualisé!");
            return;
        },
        error: AjaxErrors
    });

    return;
}

//fonction permet de charger les schemas des sql de la source de données passée en paramètre
function toolsDataSourceChargerSampleData(dsName, dsType, maxRows) {

    //Prendre l'objet actif si dsName n'est passé en paramètre
    if (dsName == null) dsName = iamHFDActiveObjId;

    var objOption = Objet_GetObjetOptions(dsName);

    if (objOption == null) showErreurMsg("Aucun objet retrouvé sous le nom : '" + dsName + "'.");

    var strOption = JSON.stringify(objOption);
    var url = "";// iamRootPath + "Designers/DataSourceSampleDataGet";
    var timeout = 5000;

    //Prendre le type depuis l'option de l'objet s'il n'est passé en paramètre
    if (dsType == null) dsType = objOption.iaType;

    //prendre 10 lignes maximum si rien de spécifique n'est demandé.
    if (maxRows == null) maxRows = 10;

    $.ajax({
        url: url,
        data: { ds_name: dsName, ds_type: dsType, ds_option: encodeURIComponent(strOption), max_rows: maxRows, user_token: iamtoken },
        type: "POST",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                showErreurMsg(result.ErrorMessage);
                return;
            }

            let infos = null;

            if (dsType == 'iaMasterDetailsDS') {
                for (var i = 0; i < objOption.sqlSources.length; i++) {

                    if (!result.Data[i] || result.Data[i].length == 0) {
                        if (!infos) infos = "";
                        infos += "\n L'échantillon retourné pour la source '" + objOption.sqlSources[i]["nom_table"] +"' ne contient aucune données!";
                    } else {
                        objOption.sqlSources[i]['sample_data'] = result.Data[i];
                    }
                    
                }
            } else {
                if (!result.Data || result.Data.length == 0) {
                    infos = "L'échantillon retourné ne contient aucune données!";
                } else {
                    objOption['sample_data'] = result.Data;
                }
                
            }

            if (infos) {
                showInformationMsg(infos);
            } else {
                showSuccessMsg("Echantillon de données hors ligne de la source de données '" + dsName + "' actualisé!");
            }
            
            return;
        },
        error: AjaxErrors
    });


    return;
}

//fonction permet de charger les schemas des sql de la source de données passée en paramètre
function charger_offline_new_object(dsName, dsType) {

    return;
}

//Retourner la propriétée utilisée par défaut pour le bindings des valeurs retournées par la base de données
function toolsDataSourceGetValueBindingPropertyFromTypeControle(typeControle) {

    if (typeControle == 'dxButton' ) {
        return "text"
    }

    if (typeControle == "dxBarGauge") {
        return "values"
    }
        
    return "value"
}

//Retourner le nom du controle à créer en fonction des racines des champs liés
function toolsDataSourceGetTypeControleFromNomChamp(nomChamp, typeDonnee) {

    
    if (nomChamp.indexOf("is_") == 0 || nomChamp.indexOf("chk_") == 0 || nomChamp.indexOf("bool_") == 0 || nomChamp.indexOf("tiny_") == 0 ) {
        return "dxCheckBox"
    }

    if (nomChamp.indexOf("dt_") == 0 || nomChamp.indexOf("dh_") == 0) {
        return "dxDateBox"
    }

    if (nomChamp.indexOf("memo_") == 0 || nomChamp.indexOf("mmo_") == 0) {
        return "dxTextArea"
    }

    if (nomChamp.indexOf("html_") == 0) {
        return "kendoEditor"
    }

    if (nomChamp.indexOf("num_") == 0 || nomChamp.indexOf("int_") == 0 || nomChamp.indexOf("dbl_") == 0) {
        return "dxNumberBox"
    }

    if (typeDonnee) typeDonnee = typeDonnee.toLowerCase();

    if (typeDonnee == "integer" || typeDonnee == "longint" || typeDonnee == "smallint" || typeDonnee == "int"  || typeDonnee == "double" || typeDonnee == "decimal" || typeDonnee == "float" ) {
        return "dxNumberBox"
    }

    if (typeDonnee == "date" || typeDonnee == "datetime" || typeDonnee == "time") {
        return "dxDateBox"
    }

    if (typeDonnee == "boolean" || typeDonnee == "tinyint") {
        return "dxCheckBox"
    }

    return "dxTextBox"
}



//FONCTIONS LIEES AU DICTIONNAIRE DES OBJETS **********************************************************************************************************************************************

//permet la création du tree dictionnaire des objets du formulaire depuis l'id d'un div passé en paramètre. si aucun id n'est passé alors "iamDesignerDictionnaire" est utilisé
function treeDictionnaireCreate(treeID) {

    if (!treeID) treeID = "iamDesignerDictionnaire";
    $("#" + treeID).dxTreeView({
        items: treeDictionnaireCreateItems(),
        dataStructure: "plain",
        parentIdExpr: "id_categorie",
        keyExpr: "name",
        displayExpr: "text",
        searchEnabled: true,
        width: 300,
        onItemContextMenu: function (e) {
            var item = e.itemData;
            iamDynamicContentContextMenuElementItem = e.itemData;
            var myArray = [];
            if (item.id_parent) myArray.push({
                id: "delete_item", text: "Supprimer Objet/Item", icon: iamImagesPath + "saisir/trash_red_24.png", beginGroup: true, action: function (item) {
                    Objet_SupprimerObjet(iamDynamicContentContextMenuElementItem.name);
                    return;
                }
            });

            if (iamDynamicContentContextMenuItemsArrays[item.id_categorie] != null) {
                myArray = arrayConcat(myArray, iamDynamicContentContextMenuItemsArrays[item.id_categorie], false);
                toolsDynamicContentContextMenuUpdateItems(e.itemElement, myArray, iamDynamicContentContextMenuItemsArrays[item.id_categorie + "CallBackFunction"], true);
            }
            return;
        },
        onItemClick: function (e) {
            var item = e.itemData;
            if (item.type_controle == null) {
                //Ne rien faire
            } else {
                //prendre l'objet sélectionné comme objet actif
                iamHFDActiveObjId = item.name;
            }

            //partie de code utile uniquement pour gérer le doubleClick
            if (!iamDictionnaireTreeTimeout) {
                iamDictionnaireTreeLastComponent = item;
                iamDictionnaireTreeTimeout = setTimeout(function () {
                    iamDictionnaireTreeTimeout = null;
                }, 300);
            } else if (item === iamDictionnaireTreeLastComponent) {
                //gérer le doubleClick, afficher les propriétés de l'objet clické
                propertyGridLoadObjectPropertiesByName(iamHFDActiveObjId, true);
            }  
            return;
        }
    });
}

iamDictionnaireTreeTimeout = null, iamDictionnaireTreeLastComponent = {}

//créer le noeuds du dictionnaire
function treeDictionnaireCreateItems() {
    var items = [
        { name: "iamHFDActions", text: "Actions", type_controle: null, icon: iamImagesPath + "controles_medium_white/actions_black_32.png"}
        , { name: "iamHFDBindings", text: "Bindings", id_categorie: null, type_controle: null, icon: iamImagesPath + "controles_medium_white/link_black_32.png" }
        , { name: "iamHFDControls", text: "Controls/Widgets", id_categorie: null, type_controle: null, icon: iamImagesPath + "controles_medium_white/controles_black_32.png"}
        , { name: "iamHFDDataSources", text: "DataSources", id_categorie: null, type_controle: null, icon: iamImagesPath + "controles_medium_white/Datasources_black_32.png" }
        , { name: "iamHFDFiles", text: "Files", id_categorie: null, type_controle: null, icon: iamImagesPath + "controles_medium_white/files_black_32.png" }
        , { name: "iamHFDViews", text: "Views", id_categorie: null, type_controle: null, icon: iamImagesPath + "controles_medium_white/views_black_32.png"}
    ];

    //remplir avec la liste des objets
    iamHForm.objectsList.forEach(function(item, indx){
        let objOption = item.option_objet;
        items.push({ name: objOption.name, text: objOption.name, id_categorie: objOption.dictionnaire_id_categorie, type_controle: objOption.iaType, icon: objOption.icon });
    });
    return items;
}

//ajouter un objet (controle) au tree du dictionnaire du HFORM
function treeDictionnaireAddObject(objOption, items, batch) {

    //si aucune catégorie de dictionnaire n'est spécifié alors sortir
    if (!objOption.dictionnaire_id_categorie) return;

    var treeWidget = $("#iamDesignerDictionnaire").dxTreeView("instance");

    if (treeWidget == null) return;

    if (!items) items = treeWidget.option("items");

    items.push({ name: objOption.name, text: objOption.name, id_categorie: objOption.dictionnaire_id_categorie, type_controle: objOption.iaType, icon: objOption.icon });

    if (batch != true) treeWidget.option("items", items);
}

//ajouter un objet (controle) au tree du dictionnaire du HFORM
function treeDictionnaireDeleteObject(objName, items, batch) {

    //si aucune catégorie de dictionnaire n'est spécifié alors sortir
    if (!objName) return;

    var treeWidget = $("#iamDesignerDictionnaire").dxTreeView("instance");

    if (treeWidget == null) return;

    //si aucun items n'est passé alors prendre la liste depuis le tree
    if (!items) items = treeWidget.option("items");
    //supprimer le noeud de la liste du tree
    arrayDeleteByKey(items, "name", objName, true);
   //recharger la liste dans le tree si on n'est pas dans un batch
    if (batch != true) treeWidget.option("items", items);
}


//FONCTIONS LIEES AUX ASSISTANTS DE CONFIGURATION DES OBJETS ******************************************************************************************************************************


// MasterDetailsDS
function MasterDetailsDSPopupShow(valeurDS) {

    var masterDetailDS = Objet_GetObjetOptions(iamHFDActiveObjId, false);

    if (masterDetailDS) {
        valeurDS = masterDetailDS.sqlSources;
    }

    //prendre la source de données passée en paramètre si elle n'est pas vide
    if (!valeurDS || valeurDS == []) {
        valeurDS = [{ nom_table: "TB1", champ_id: 'ID', champ_id_parent: null, deny_insert: null, deny_update: null, deny_delete: null, select_override: null, insert_override: null, update_override: null, delete_override: null, offline_schema: null, offline_new_object: null }];
    }

    if (!iamMasterDetailsDSGrid) {

        iamMasterDetailsGridOption.dataSource = valeurDS;
        //Créer le grid puis le popup        
        iamMasterDetailsDSGrid = $("#iamMasterDetailsDSGrid").dxDataGrid(iamMasterDetailsGridOption).dxDataGrid("instance");

        iamMasterDetailsDSPopup = $("#iamMasterDetailsDSPopup").dxPopup({
            width: 800,
            height: 350,
            title: "MASTER-DETAILS DATASOURCE CONFIG.",
            resizeEnabled: true,
            showTitle: true,
            closeOnOutsideClick: false,
            onHidden: function (e) {
                MasterDetailsDSPopupHide(true);
            }
        }).dxPopup("instance");

    } else {
        //recharger la source de données.
        iamMasterDetailsDSGrid.option("dataSource", valeurDS);
    }

    //afficher le popup
    iamMasterDetailsDSPopup.option("title", "MASTER-DETAILS DATASOURCE CONFIG. (" + iamHFDActiveObjId + ")");
    iamMasterDetailsDSPopup.show();
}

//Fonction permettant l'enregistrement des modifications de la source de données du grid de config dans les sources de l'objet master - details
function MasterDetailsDSPopupHide(hideByCloseButton) {

    var masterDetailDS = Objet_GetObjetOptions(iamHFDActiveObjId, false);

    if (masterDetailDS) {
        masterDetailDS.sqlSources = iamMasterDetailsDSGrid.option("dataSource");
    }
    
    //Masquer le popup
   if (!hideByCloseButton) iamMasterDetailsDSPopup.hide();
}



//Fonctions du HForm pour la création et l'enregistrement de page etc. *********************************************************************************************************************

//fonction permet d'importer ou fusionner une page. Ouvre une fenètre "Select file" chez le client pour charger le fichier
function HFormImportPage(fusion, isBlob){
    iamHFDActivePageFusion = fusion;
    iamHFDActiveFileIsBlob = isBlob;
    FileLoadClientFile(HFormImportPageCallBack);
}

//Fonction permettant d'injecter le css dynamique écrit par l'utilisateur pour personnaliser la page active
function HFormInjectUserCSS(user_css_rules) {
    if (!user_css_rules) user_css_rules = "";
    $("#iamdynamicActiveFormCSS").empty().append(user_css_rules);
}

//Fonction permettant d'injecter le css dynamique écrit par l'utilisateur pour personnaliser la page active
function HFormInjectUserJs(user_js) {
    if (!user_js) user_js = "";
    $("#iamdynamicActiveFormScript").empty().append(user_js);
}

//Fonction permettant d'injecter le html dynamique écrit par l'utilisateur pour personnaliser la page active
function HFormInjectUserHtml(user_html) {
    if (!user_html) user_html = "";
    $("#iamdynamicActiveFormHtml").empty().append(user_html);
}

//Fonction permettant d'injecter le html, le js et le css dynamique écrit par l'utilisateur pour personnaliser la page active
function HFormInjectUserCustomElements(user_html, user_js, user_css_rules) {
    HFormInjectUserCSS(user_css_rules);
    HFormInjectUserHtml(user_html);
    HFormInjectUserJs(user_js);    
}

//importer un fichier html, CSS, ou Js pour l'intégrer au contenu des fichiers personnalisés existants
//fileType: html, js or css
function HFormFusionPageElementFile(fileType){  
    iamHFDActiveFileFusionFileType= fileType;
    iamHFDActiveFileIsBlob = false;
    FileLoadClientFile(HFormFusionPageElementFileCallBack);
}

//Callback de la fonction d'import de page exécutée après le chargement du fichier depuis l'ordi du client.
function HFormFusionPageElementFileCallBack(fileText){

    //Si aucun contenu n'est retourné alors sortir
    if (!fileText) return;

    //fusionner le contenu texte selon le type de fichier
    switch (iamHFDActiveFileFusionFileType){
        case "html":{
            iamDesignerHtmlContent.setValue(iamDesignerHtmlContent.getValue() + + "  \n " + fileText);                      
           
            break;
        }
        case "css":{
            iamDesignerCssContent.setValue(iamDesignerCssContent.getValue()  + "  \n " + fileText);
            break;
        }
        case "js":{
            iamDesignerJsContent.setValue(iamDesignerJsContent.getValue() + "  \n" + fileText); 
            break;
        }
    }
    
    
    return;

}


//Callback de la fonction d'import de page exécutée après le chargement du fichier depuis l'ordi du client.
function HFormImportPageCallBack(HFormJSON){

    //Si aucun contenu n'est retourné alors sortir
    if (!HFormJSON) return;

    if (iamHFDActiveFileIsBlob){
        //Blob donc fichier zip (gzipped)
        var new_zip = new JSZip();
        // more files !
        new_zip.loadAsync(HFormJSON)
        .then(function(zip) {
            // you now have every files contained in the loaded zip
            var nom_fichier = Object.entries(zip.files)[0];
            zip.files[nom_fichier[0]].async("string").then(function (data) {
                //Recupérer la page
                var importPage= JSONfn.parse(data);

                //Reconstruire la page depuis l'import
                if (importPage) HFormBuildFromPage(importPage, iamHFDActivePageFusion);
                return;
            }); 
        });
    }else{
        //Recupérer la page
        var importPage= JSONfn.parse(HFormJSON);

        //Reconstruire la page depuis l'import
        if (importPage) HFormBuildFromPage(importPage, iamHFDActivePageFusion);
    }
    
    return;

}


//Détruire le HForm
function HFormDestroy() {

    for (var i = iamHForm.objectsList.length - 1 ; i > -1 ; i--) {
        var ligneObj = iamHForm.objectsList[i];
        var ligneTypeObj = Objet_GetTypeObjetLigne(ligneObj.type_controle);
        
        if (ligneTypeObj && ligneTypeObj.deleteWidget) {
            //supprimer le widget
            ligneTypeObj.deleteWidget(objID, objOptions, true);
        }

    }
    
    //Initialiser les objets de configuration
    
    iamHFDFormItems = [];
    //vider les code personnalisés
    iamDesignerJsContent.setValue("");
    iamDesignerHtmlContent.setValue("");
    iamDesignerCssContent.setValue("");
    //initialiser les tableaux du HForm
    iamHForm.objectsList = [];
    iamHForm.views = [];
    iamHForm.bindings = [];
    iamHForm.actions = [];
    iamHForm.files = [];
    //Lancer le build avec aucun objet passé en paramètre
    HFormBuild();

    return;

}

//Permet la reconstruction de l'objet Hform depuis les éléments paramétrés
function HFormBuild() {

    var js = iamDesignerJsContent.getValue();
    var html =iamDesignerHtmlContent.getValue();
    var css = iamDesignerCssContent.getValue();
    
    var frmOptions = Objet_GetObjetOptions("iamContentFormLayout");
    if (frmOptions != null ) frmOptions.items = iamHFDFormItems;
    
    iamHForm.htmlPage= html ;//recupérer le contenu html de la page
    iamHForm.jsPage= js; //recupérer le contenu js de la page
    iamHForm.cssPage = css; //contenu de la page css de l'utilisateur

    HFormInjectUserCustomElements(iamHForm.htmlPage, iamHForm.jsPage, iamHForm.cssPage) ;
    return;
         
}

//Permet la reconstruction de l'objet Hform depuis les éléments paramétrés
function HFormBuildFromPage(sourcePage, fusionner) {

    //Sortir si aucune page n'est passée
    if (sourcePage == null) {
        HFormNew(null,null);
        return;
    }

    if (fusionner) {
        //fusionner les codes
        iamDesignerHtmlContent.setValue(iamDesignerHtmlContent.getValue() + + "  \n " + sourcePage.htmlPage);
        iamDesignerJsContent.setValue(iamDesignerJsContent.getValue() + "  \n" + sourcePage.jsPage);            
        iamDesignerCssContent.setValue(iamDesignerCssContent.getValue()  + "  \n " + sourcePage.cssPage);
        
        //Prendre les items de la sourcePage et les fusionner avec ceux de la page existante
        sourcePageFormItems = iamHForm.getFormItems(sourcePage);
        if (iamContentFormLayout == null){
            if (sourcePageFormItems != null && sourcePageFormItems.length >0 ){
                iamHFDFormItems = Objet_Clone(sourcePageFormItems,[],true) ;
            }
            //importer la liste des objets
            if (sourcePage.objectsList != null && sourcePage.objectsList.length >0){
                iamHForm.objectsList.push.apply(iamHForm.objectsList, Objet_Clone(sourcePage.objectsList, [], true));
            }
            
        }else{
            //Créer un group
            if (sourcePageFormItems != null && sourcePageFormItems.length >0 ){
                var gp = formItemsCreateGroup(null, iamHFDFormItems, "FUSION ITEMS", true);

                //Prendre l'option du form layout de la page source
                var sourceForm = Objet_GetObjetOptions("iamContentFormLayout", false, sourcePage);

                //Si le formLayout de l'objet a été trouvé alors
                if (sourceForm) {
                    gp.items[0].colSpan = sourceForm.colCount;
                    gp.colCount = sourceForm.colCount;                   
                }

                //donner au groupe, la largeur complete du layout
                gp.colSpan = iamContentFormLayout.option("colCount");
                //charger les items de la sourcePage dans le groupe
                gp.items.push.apply(gp.items, Objet_Clone(sourcePageFormItems ,[],true));
            }
            //supprimer le formLayout de la source s'il existe
            arrayDeleteByKey(sourcePage.objectsList, "nom_objet", "iamContentFormLayout");

            //importer la liste des objets restants
            if (sourcePage.objectsList != null && sourcePage.objectsList.length >0){
                iamHForm.objectsList.push.apply(iamHForm.objectsList, Objet_Clone(sourcePage.objectsList, [], true));
            }
        }

        //fusionner les autres tableaux de la page
        if (sourcePage.actions != null && sourcePage.actions.length >0 ){
            iamHForm.actions.push.apply(iamHForm.actions, Objet_Clone(sourcePage.actions, [], true));
        }
        if (sourcePage.bindings != null && sourcePage.bindings.length >0 ){
            iamHForm.bindings.push.apply(iamHForm.bindings, Objet_Clone(sourcePage.bindings, [], true));
        }
        if (sourcePage.files != null && sourcePage.files.length >0 ){
            iamHForm.files.push.apply(iamHForm.files, Objet_Clone(sourcePage.files, [], true));
        }
    } else {
        //détruire l'ancienne page
        HFormDestroy();

        //remplacer les codes
        iamDesignerHtmlContent.setValue(sourcePage.htmlPage);
        iamDesignerJsContent.setValue(sourcePage.jsPage);            
        iamDesignerCssContent.setValue(sourcePage.cssPage);

        //Prendre les items de la sourcePage et remplacer ceux de la page existante
        sourcePageFormItems = iamHForm.getFormItems(sourcePage);
        iamHFDFormItems = Objet_Clone(sourcePageFormItems,[],true) ;

        //remplacer la liste des objets
        iamHForm.objectsList = Objet_Clone(sourcePage.objectsList,[],true) ;

        //cloner les autres tableaux de la page
        iamHForm.actions = Objet_Clone(sourcePage.actions,[],true) ;
        iamHForm.bindings = Objet_Clone(sourcePage.bindings,[],true) ;
        iamHForm.files = Objet_Clone(sourcePage.files,[],true) ;
        
    }

    //Reconstruire
    HFormBuild();
    
    //vider la page source pour libérer de la mémoire
    sourcePage=null;

    //Reconstruire le form layout s'il existe
    var frmOptions = Objet_GetObjetOptions("iamContentFormLayout");
    if (frmOptions != null ) {
        
        frmOptions.items = iamHFDFormItems;
        if (iamContentFormLayout == null) {
            Objet_Create("iamContentFormLayout", "dxForm", null, null, true, null, frmOptions);
        }
        iamContentFormLayout.option("items", iamHFDFormItems);
        iamContentFormLayout.repaint();
    }

    return;

}

//Permet la création d'une nouvelle page
function HFormNew(typeHForm, sTypeHForm) {
    //vider le queue des modifications
    HFormDestroy();

    return;
}

//permet d'enregistrer le formulaire dans le système (la plaforme magic suite)
function HFormSave() {

    //Cloner les objets en edition dans la page HForm
    HFormBuild();

    var strHForm = JSON.stringify(iamHForm);
    var url = "../../HFormDesigner/FormSave";
    var timeout = 5000;
    
    $.ajax({
        url: url,
        data: { id: iamHForm.idFormulaire, preview: preview, user_token: iamtoken, html_page: encodeURIComponent(iamHForm.htmlPage), js_page: encodeURIComponent(iamHForm.jsPage), css_page: encodeURIComponent(iamHForm.cssPage), hform_obj: encodeURIComponent(strHForm) },
        type: "POST",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                showErreurMsg(result.ErrorMessage);
                return;
            }
            if (preview == 1) {
                //Mode preview alors ouvrir le formulaire en preview
                url = '../../Page/HForm?id=' + iamHForm.idFormulaire + '&preview=1&user_token=' + iamtoken;
                $('#iamDesignerPreviewFrame').attr('src', url);

                //resizeIframe('iamDesignerPreviewFrame');
            } else {
                showSuccessMsg("La page '" + iamnom_formulaire + "' a bien été enregistrée!");
            }
            return;
        },
        error: AjaxErrors
    });

    return;
}

//Enregistrer vers l'extérieur
function HFormSaveAs(extension) {

    //Cloner les objets en edition dans la page HForm
    HFormBuild();

    var strHForm = JSONfn.stringify(iamHForm);

    switch (extension) {
        case 'zip': {
            //Zipper les fichiers et exporter
            var zip = new JSZip();
            zip.file(iamHForm.idFormulaire + ".json", strHForm);
            
            zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // use saveAs from FileSaver.js
                //saveAs(content, iamHForm.idFormulaire + ".zip");
                kendo.saveAs({
                    dataURI: content,
                    fileName: iamHForm.idFormulaire + ".zip"
                });
            });
            return;
        }
        case 'json': {
            html_str = strHForm;
            break;
        }
        case 'html': {
            //Ajouter le javascript dans la page
            html_str = html_str.replace('//{iamHFormAutoCreatedCode}', iamHForm.jsPage);
            break;
        }
        default:
            return;
    }

    //Lancer la fonction ajax pour en registrer le fichier
    var blob = new Blob([html_str], { type: "text/plain;charset=utf-8" });
    //saveAs(blob, iamHForm.idFormulaire + "." + extension);
    kendo.saveAs({
        dataURI: blob,
        fileName: iamHForm.idFormulaire + "." + extension
    });

    return;
}

//Enregistrer le formulaire dans le storage. Si loadFromStorage == true alors on fait un forcage lors du rechargement du formulaire et on recherche id_formulaire + LoadFromStorage
function HFormSaveToStorage(storageKey, loadFromStorage) {

    //Cloner les objets en edition dans la page HForm
    HFormBuild();

    var strHForm = JSONfn.stringify(iamHForm);
    
    if (storageKey == null) storageKey = iamHForm.idFormulaire;

    //sauvegarder dans le localstorage
    window.localStorage.setItem(storageKey, strHForm);

    //conserver en mémoire si le formulaire doit être obligatoirement recharger depuis le storage
    if (loadFromStorage) window.localStorage.setItem(storageKey + "LoadFromStorage", strHForm);

    return;
}

//Permet de charger le contenu du formulaire depuis le localStorage.
//Si un forcage lors de la relance de la page à exécuter a été fait le formulaire est souvent conservé dans : id_formulaire = id_formulaire + LoadFromStorage
function HFormGetFormFromStorage(storageKey) {
    //si l'identifiant est vide alors récupérer celui du formulaire en cours
    if (!storageKey) storageKey = iamHForm.idFormulaire;

    //récupérer le formulaire depuis le storage
    var strHForm =  window.localStorage.getItem(storageKey);
    
    //Sortir si aucun formulaire n'est trouvé dans le storage
    if (strHForm == "undefined" || strHForm == null) return;

    var sourcePage = JSONfn.parse(strHForm);
    //reconstruire la page depuis le contenu du local storage
    HFormBuildFromPage(sourcePage, false);

    //rétirer l'objet du local storage
    window.localStorage.removeItem(storageKey);
    return;
}

function HFormPreview() {

}

//fin fonctions HForm ---------------------------------------------------------------------------------------------------------------------------------------------------------------------


//fonctions du propertyGrid *****************************************************************************************************************************************************************


//Permet de gérer le clic sur le bouton dans le propertyGrid pour editer des propriétés particulières
function propertyGridButtonClick(nomPropriete, valeurPropriete) {
    
    switch (nomPropriete) {
        case 'datasource': {
            break;
        }
        case 'sqlSources': {
            MasterDetailsDSPopupShow(valeurPropriete);
            break;
        }
        case 'sql': {
            break;
        }
        case 'connection': {
            break;
        }
        
    }
}

//Permet de gérer le clic sur le bouton dans le propertyGrid pour editer des propriétés particulières
function propertyGridButtonEditClick(elemId, nomPropriete , valeurPropriete ) {
   //recupérer l'objet actif

    switch (nomPropriete) {
        case 'datasource': {
            break;
        }
        case 'sqlSources': {
            MasterDetailsDSPopupShow();
            break;
        }
        case 'sql': {
            break;
        }
        case 'connection': {
            break;
        }

    }
}


//Permet de créer le meta adapté au propertyGrid
function propertyGridCreateGridMetaFromObjMeta(objMeta) {
    if (objMeta == null) return null;

    var meta = { iaType: { browsable: false }, "dictionnaire_id_categorie": { browsable: false } };

    objMeta.forEach(function (el, index) {

        if (el.ReadOnly == null || el.ReadOnly != true) {
            var group ='PROPERTIES';
            if(el.Name.indexOf('on') == 0) group ='EVENTS';
                        
            meta[el.Name] = { group: group, description:null, type: el.Type.toLowerCase(), options: null, browsable: true };

            if (el.Name == 'colSpan' || el.Name == 'colCount') {
                meta[el.Name].type = 'number';
                meta[el.Name].options = { min: 0, max: 100, step: 1 };
            } else {
                if (el.Type.toLowerCase() == 'number') {
                    meta[el.Name].options = { step: 1 };
                }
            }

            switch (el.Name) {
                case "dictionnaire_id_categorie": {
                    meta[el.Name].browsable = false;
                    break;
                }	
                case "iaType": {
                    meta[el.Name].browsable = false;
                    break;
                }	
                case "name": {
                    meta[el.Name].name = "(Name)";  
                    meta[el.Name].type = 'name';
                    break;
                }
                case "colSpan": {
                    meta[el.Name].description = "Augmenter ou reduire la largeur de l'item.";
                    break;
                }
                case "controleName": {
                    meta[el.Name].type = 'readonly';
                    break;
                }
                case "onFieldDataChanged": { break; }
                case "dataSource": {
                    meta[el.Name].type = 'datasource';
                    break;
                }
                case "sqlSources": {
                    meta[el.Name].type = 'sqlSources';
                    break;
                }
                case "connection": {
                    meta[el.Name].type = 'options';
                    meta[el.Name].options = iamPageVariables.data.linkedDatabases;
                    break;
                }
            }

            if (el.Tooltip != null) meta[el.Name].description=el.Tooltip;
            if (el.AcceptedValues != null) {
                meta[el.Name].type = 'options';
                meta[el.Name].options = el.AcceptedValues;
            }
        }
                       
    });

    return meta;
}

//Permet de créer le model contenant toutes les propriétés modifiables du controle pour faciliter la mise à jour des propriétés non encore créées d'apparaitre dans le propertyGrid
function propertyGridObjet_CreateModelForGridFromObjMeta(objMeta) {
    if (objMeta == null) return null;

    var objModel = {};
    objMeta.forEach(function (el, index) {

        if (el.ReadOnly == null || el.ReadOnly != true) {           
            objModel[el.Name] =  el.Default ;
        }

    });

    return objModel;
}

//Permet de transmettre les valeurs des propriétés de l'objet source à l'objet model pour la mise à jour dans le propertyGrid
function propertyGridUpdateObjectModelFromObjSource(objSource, objModel) {

    if (objModel == null) {
        //prendre l'objet option interne du widget
        objModel = Objet_GetObjetOptions(objSource.name, true);
        return objModel;
    }
    //parcourir les propriétés de l'objet et données leurs valeurs à l'objet model
    Object.keys(objSource).forEach(function (key) {
        objModel[key] = objSource[key];        
    });

    return objModel;
}

// Callback function. Fonction exécutée à chaque fois qu'une propriété est modifiée directement dans le propertyGrid
function propertyGridCallback(grid, name, value) {
    
    if (iamHFDActiveObj == null) showErreurMsg("Impossible de retrouver l'objet dont les propriétés sont à mettre à jour!");
                
    //mettre à jour la propriété du widget
    Objet_SetObjectProperty(iamHFDActiveObj, name, value, false);

}

//permet de charger dans le grid des propriétés les options et attributs de l'objet passé en paramètre
function propertyGridLoadObjectProperties(theObj, afficher_propertyGrid) {
       
    if (theObj == null) {
        showErreurMsg("Impossible d'afficher les propriétés d'un objet vide!");
        return;
    }

    //prendre le meta de base de l'objet
    var objMeta = Objet_GetObjetMetaByTypeObjet(theObj.iaType);

    //Créer le modèle de modification des propriétés depuis le meta
    var objModel = propertyGridObjet_CreateModelForGridFromObjMeta(objMeta)

    iamDesignerPropertyGridOptions.meta = propertyGridCreateGridMetaFromObjMeta(objMeta); //prendre le meta de l'objet

    //Prendre l'objet passé comme objet actif
    iamHFDActiveObj = theObj;

    if (iamDesignerPropertyGridOptions.callback == null) iamDesignerPropertyGridOptions.callback = propertyGridCallback;
       
    //Modifier les propriétés du modèle pour les faire correspondre aux propriétés existantes dans l'objet principal
    objModel = propertyGridUpdateObjectModelFromObjSource(theObj, objModel);

    // Create the grid
    $('#iamDesignerPropertyGrid').jqPropertyGrid(objModel, iamDesignerPropertyGridOptions);

    //se mettre sur l'onglet des propriété s'il n'est pas actif
    if (afficher_propertyGrid) iamTabPanel.option("selectedIndex", 0);
    return;
}

//permet de charger dans le grid des propriétés les options et attributs de l'objet passé en paramètre
function propertyGridLoadObjectPropertiesByName(nomObjet, afficher_propertyGrid) {
    
    //si aucun nom d'objet n'est passé alors sortir
    if (!nomObjet) return;

    var theObj = Objet_GetObjetOptions(nomObjet); //retourner l'objet depuis sont nom

    //afficher les propriété de l'objet retrouvé   
    propertyGridLoadObjectProperties(theObj, afficher_propertyGrid);
    return;
}

//fin fonctions propertyGrid ---------------------------------------------------------------------------------------------------------------------------------------------------------------------




//Helpers fonctions -- Fonctions d'utilité diverses **********************************************************************************************************************************************

//Fonction de redimensionnement du height du spliter et autres
function resizeIframe(nom_frame) {
    var iFrame = document.getElementById(nom_frame);
    if (iFrame.contentWindow.document && iFrame.contentWindow.document.body)
        iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}

var str2DOMElement = function(html) {
    
    var frame = document.getElementById("iamDesignerPreviewFrame");// document.createElement('iamDesignerPreviewFrame');
    //frame.style.display = 'none';
    //document.body.appendChild(frame);             
    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
    //var el = frame.contentDocument.body.firstChild;
    //document.body.removeChild(frame);
    //return el;
}


//Helpers fonctions -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Charger les templates de nouveau etc. utilisé par le designer
function LoadTemplates() {

    return;

    var url = "";//  iamRootPath +  "Designers/TemplateGet";
    var timeout = 5000;

    //fichier html template
    $.ajax({
        url: url,
        data: { template_file_name: "NewPage.html" },
        type: "GET",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                iamnotification.error(result.ErrorMessage);
                return;
            }
            //Conserver le resultat dans la variable d'actualisation du nouveau
            if (result.Data) {
                iamHtmlContentNew = result.Data.replace("{PageTitle}", iamHForm.nomFormulaire);
            } else {
                iamHtmlContentNew = "";
            }
            
            return;
        },
        error: AjaxErrors
    });

    //fichier de code Js
    $.ajax({
        url: url,
        data: { template_file_name: "NewPage.js" },
        type: "GET",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                iamnotification.error(result.ErrorMessage);
                return;
            }
            iamJsContentNew = result.Data;            
            return;
        },
        error: AjaxErrors
    });

    //iamHFormHeadImports
    $.ajax({
        url: url,
        data: { template_file_name: "HeadImports.html" },
        type: "GET",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                iamnotification.error(result.ErrorMessage);
                return;
            }
            iamHFormHeadImports = result.Data;
            return;
        },
        error: AjaxErrors
    });
}

//Créer et afficher le preview de la page
function PreviewPage() {
    
    //Récupérrer le iFrame du preview
    //iframe = $('#iamDesignerPreviewFrame')

    //Prendre le html de la page
    var page_str = iamDesignerHtmlContent.getValue();
    //Insérer les ressources clées dans le header
    page_str = page_str.replace("<!--{iamHFormHeadImports}-->", iamHFormHeadImports);

    //Ajouter le javascript dans la page
    page_str = page_str.replace('//{iamHFormAutoCreatedCode}', iamDesignerJsContent.getValue());
    
    //Charger la page dans le frame
    //iframe.attr('src', 'data:text/html' + page_str);

    str2DOMElement(page_str);

    resizeIframe('iamDesignerPreviewFrame');
}

//Permet d'enregistrer le formulaire ou le preview
function PageSave(preview) {
    
    var url = iamRootPath +  "Designers/FormSave";
    var timeout = 5000;
    var js = iamDesignerJsContent.getValue();
    var html = iamDesignerHtmlContent.getValue();
    $.ajax({
        url: url,
        data: { id: iamHForm.idFormulaire, preview: preview, user_token: iamtoken, html_page: encodeURIComponent(html), js_page: encodeURIComponent(js) },
        type: "POST",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                showErreurMsg(result.ErrorMessage);
                return;
            }
            if (preview == 1) {
                //Mode preview alors ouvrir le formulaire en preview
                url = '../../Page/HForm?id=' + iamHForm.idFormulaire + '&preview=1&user_token=' + iamtoken;               
                $('#iamDesignerPreviewFrame').attr('src', url);

                //resizeIframe('iamDesignerPreviewFrame');
            } else {
                showSuccessMsg("La page '" + iamnom_formulaire + "' a bien été enregistrée!");
            }            
            return;
        },
        error: AjaxErrors
    });
}

//Permet d'enregistrer un template (modèle) de formulaire, de html ou de javascript uniquement
function TemplateSave(nom_template, save_html, save_js) {

    if (!save_html) save_html = true;
    if (!save_js) save_js = true;

    var html_page = "", js_page = "";

    //récupérer le contenu html et js si nécessaire
    if (save_html) {
        html_page=  encodeURIComponent(iamDesignerHtmlContent.getValue());    
    }
    if (save_js) {
        js_page=  encodeURIComponent(iamDesignerJsContent.getValue());    
    }

    var url = "../../HFormDesigner/TemplateSave";
    var timeout = 5000;

    //Enregistrer le template (modèle)
    $.ajax({
        url: url,
        data: { template_file_name: nom_template, html_page: html_page, js_page: js_page },
        type: "POST",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                iamnotification.error(result.ErrorMessage);
                return;
            }
            iamnotification.success("La modèle '" + nom_template + "' a bien été enregistrée!");
            return;
        },
        error: AjaxErrors
    });
}


//Exporter le fichier selon le format zip, json, html
function PageExport(extension) {

    if (!extension) extension = "zip";

    //Prendre le html de la page
    var html_str = iamDesignerHtmlContent.getValue();
    var js_str = iamDesignerJsContent.getValue();
    //Insérer les ressources clées dans le header
    //page_str = page_str.replace("<!--{iamHFormHeadImports}-->", iamHFormHeadImports);
    
    switch (extension) {
        case 'zip': {
            //Zipper les fichiers et exporter
            var zip = new JSZip();
            zip.file(iamHForm.idFormulaire + ".html", html_str);
            zip.file(iamHForm.idFormulaire + ".js", js_str);
            zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // use saveAs from FileSaver.js
                //saveAs(content, iamHForm.idFormulaire + ".zip");
                kendo.saveAs({
                    dataURI: content,
                    fileName: iamHForm.idFormulaire + ".zip"
                });
            });
            return;
        }
        case 'json': {    
            html_str = JSON.stringify({ html_page: html_str, js_page: js_str });
            break;
        }
        case 'html': {
            //Ajouter le javascript dans la page
            html_str = html_str.replace('//{iamHFormAutoCreatedCode}', js_str);
            break;
        }
        default:
            return;
    }
        
    //Lancer la fonction ajax pour en registrer le fichier
    var blob = new Blob([html_str], { type: "text/plain;charset=utf-8" });
    //saveAs(blob, iamHForm.idFormulaire + "." + extension);
    kendo.saveAs({
        dataURI: blob,
        fileName: iamHForm.idFormulaire + "." + extension
    });
    return
}


//Permet la création de la fenêtre d'edition manuelle des options des objets et de son contenu
function createManualPropertiesEditor(){
        
    //$("#iamDesignerManualPropertiesEditorToolbar").kendoToolBar({
    //    click:onDesignerManualPropertiesEditorSave, 
    //    items: [
    //        { id:"iamDesignerManualPropertiesEditorSave", type: "button", text: "Button" , icon:"save"},
    //        { id:"iamDesignerManualPropertiesEditorClose", type: "button", text: "Button" , icon:"close"},
    //        { type: "splitButton", text: "Plus...", menuButtons: [{text: "Option 1"}, {text: "Option 2"}] }
    //    ]
    //});

    iampropEdit = $("#iamDesignerManualPropertiesEditor").dxTextArea({
       width:"100%"
    }).dxTextArea("instance");

    iampropEditPopup = $("#iamDesignerManualPropertiesEditorWindow").dxPopup({
        title: "Edition manuelle des propriétés"
    }).dxPopup("instance");
}

//Permet la création de la fenêtre de selection de la liste des objets
function Objet_CreatesListWindow(){

    //$("#iamDesignerObjectsListWindow").kendoWindow({
    //    width: "600px",
    //    title: "Liste des objets du formulaire",
    //    visible: false,
    //    actions: [
    //        "Pin",
    //        "Minimize",
    //        "Maximize",
    //        "Close"
    //    ]
    //});
        
    //$("#iamDesignerObjectsList").kendoTreeList({
    //    height: "500px",
    //    selectable:true,
    //    filterable:true,
    //    columns: [
    //      { field: "nom_objet" , title:"Objet"},
    //      { field: "type_objet", title:"Type" }
    //    ],
    //    dataSource: iamHForm.objectsList
    //});
}

function onDesignerManualPropertiesEditorSave(e){

}


//Fonctions des objets *********************************************************************************************************************************************************************

//Retourne la ligne d'infos de l'objet grace a son identifiant
function Objet_GetObjectRowById(objID, page) {
    
    //si aucune page n'est passée alors prendre la page en cours
    if (page == null) page = iamHForm;

    //rechercher l'objet tout d'abord dans le liste ds objets
    var found = page.objectsList.find(function(item) {
        return item.nom_objet == objID;
    });
    if (found != null) return found;
        
    return null;
}

//Ajouter un objet a la liste d'objet
function Objet_AjouterObjetToHFormObjectsList(objID, objType, parentID, objOptions, objCategory) {
    iamHForm.objectsList.push({ nom_objet: objID, nom_parent: parentID, type_objet: objType, option_objet: objOptions, categorie_objet: objCategory });
    //ajouter l'objet au dictionnaire
    treeDictionnaireAddObject(objOptions);
    return;
}

//Retourne la ligne (objet js contenant les informations sur le type de l'objet)
function Objet_GetTypeObjetLigne(objType) {
    //Vérifier que le type d'objet demandé existe dans la liste des objets
    var ligneObj = iamDesignerControlesTypeItems.find(function (item, index) {
        return item.type_controle == objType;
    });

    return ligneObj;
}

//Rend l'objet dont l'identifiant est passé actif
function Objet_ActiverObjet(objID){
    //Prendre l'objet actif
    iamHFDActiveObjId=objID;
        
    $( "#draggable").position({
        my: "left top",
        at: "left bottom",
        of: "#"+objID,
        collision : "fit"
    });
    $( "#draggable").show();
    return;
}

//Permet de supprimer un objet créé
function Objet_SupprimerObjet(objID){

    //Si aucun id n'est passé alors prendre l'objet actif
    if (objID == null) objID= iamHFDActiveObjId;
    
    //récupérer la ligne de l'objet dans la liste des objets de la page
    var ligneObj = Objet_GetObjectRowById(objID);
    //récupérer la ligne du type d'objet définissant les fonctions et caractéristiques dispo pour ce type d'objet
    var ligneTypeObj = Objet_GetTypeObjetLigne(ligneObj.type_objet);

    //vérifier si le type d'objet possède une fonction delete
    if (ligneTypeObj.deleteWidget) {        
        //supprimer le widget
        ligneTypeObj.deleteWidget(objID, ligneObj.option_objet, true);
    }

    //supprimer l'objet de la liste des objets de la page
    arrayDeleteByKey(iamHForm.objectsList, "nom_objet", objID);
    //retirer l'objet du tree dictionnaire
    treeDictionnaireDeleteObject(objID, null, false);

    //vider l'objet actif
    iamHFDActiveObjId=null;
    $( "#draggable").hide();
    return;
}

//Permet de remplacer un objet du formulaire par un autre type
function Objet_RemplacerObjet(objID){

    if (objID == null) objID= iamHFDActiveObjId;
    
    //var contextMenu = $("#iamDesignerObjectsTypeContextMenu").data("kendoContextMenu");
    ////afficher le menu contextuel de la liste des types d'objets 
    //contextMenu.open($("#iamDesignerRemplaceObj"));
      
    return;
}

//Retourne un objet js options de configuration de l'objet
function Objet_GetObjetOptions(objID, return_internal_widget_option, page) {
    
    //si aucune page n'est passée alors prendre la page en cours
    var items = null;

    if (page == null) {
        page = iamHForm;
        items = iamHFDFormItems;
    } else {
        items = iamHForm.getFormItems(page);
    }
    //rechercher d'abord dans la liste des objets
    var objInfos = Objet_GetObjectRowById(objID, page);

    if (objInfos == null) {
        //rechercher dans la liste des items du layout
        var item = formItemsGetItemByName(objID, items);

        return item;
    }

    //Vérifier si ce sont les propriétés internes du option remodélé par le widget qui est demandé
    if (return_internal_widget_option) {
        var type_controle = objInfos.type_objet;

        //Prendre l'objet de description et fonction lié au type de controle
        var ligneTypeObj = Objet_GetTypeObjetLigne(type_controle);
        
        //vérifier si le type d'objet gère la fonction qui retourne l'Option interne
        if (ligneTypeObj.getInternalObjectOption == false ) {
            if (objInfos) return objInfos.option_objet;
        }else{

            if (ligneTypeObj.getInternalObjectOption == null ){
                //null alors utiliser le fonctionnement par défaut
                if (ligneTypeObj.getWidget && ligneTypeObj.getWidget != false) {
                    try{
                        var w=ligneTypeObj.getWidget(objID, objInfos.option_objet);
                        return w.option();
                    } catch (e) {
                        return objInfos.option_objet;
                    }                    
                } 

            }else{
                return ligneTypeObj.getInternalObjectOption(objID, objInfos.option_objet);
            }
        }                
        
    }

    //Retourner l'option dans la liste des controles de la page
    if (objInfos) return objInfos.option_objet;
       
}

//Retourne un objet meta pour la modification des propriétés dans le propertyGrid
function Objet_GetObjetMetaByTypeObjet(type_objet) {

    //Vérifier que le type d'objet demandé existe dans la liste des objets
    var ligneObj = Objet_GetTypeObjetLigne(type_objet)

    //Sortir car aucun objet de ce type nexiste dans la liste
    if (ligneObj == null) return null;

    return ligneObj.meta;
}

//Retourne le widget de l'objet depuis son nom et son type s'il existe
function Objet_GetObjetWidgetByName(objID) {
        
    //lancer la fontion getWidget du type de controle existant dans la liste des types.
    return Objet_GetObjetWidget(objID, null);
}

//Retourne le widget de l'objet depuis son nom et son type s'il existe
function Objet_GetObjetWidget(objID, theObj) {
   
    //si l'objet des options n'est pas passé alors le rechercher dans la liste des objets
    if (theObj == null) theObj = Objet_GetObjetOptions(objID);

    var ligneObj = Objet_GetTypeObjetLigne(theObj.iaType);

   if (ligneObj == null || ligneObj.getWidget == null || ligneObj.getWidget == false) return null;

    //lancer la fontion getWidget du type de controle existant dans la liste des types.
   return ligneObj.getWidget(objID, theObj);
}

//mettre ajour les propriétés d'un objet
function Objet_SetObjectProperty(theObj, propertyName, propertyValue, recreate) {

    //prendre la ligne contenant les informations sur le type de l'objet et les fonctions de modification de l'objet du type
    var ligneTypeObj = Objet_GetTypeObjetLigne(theObj.iaType);

    //sortir si le type n'est pas trouvé ou que la modification de propriété sur le type est refusée.
    if (ligneTypeObj == null || ligneTypeObj.setWidgetWidgetProperty == false) return false;

    //si une fonction est passée alors transformer la valeur texte en function
    if (propertyValue.toLowerCase().indexOf('function') == 0) {
        propertyValue = eval("("+ propertyValue +")");
    }

    if (typeof window[propertyValue] === "function") {
        // prendre la function
        propertyValue = window[propertyValue];
    }

    try {
        //lancer la fonction de modification de propriété centralisée dans la ligne du type
        if (ligneTypeObj.setWidgetWidgetProperty != null) {

            ligneTypeObj.setWidgetWidgetProperty(theObj.name, theObj, Objet_GetObjetWidget(theObj.name, theObj), propertyName, propertyValue, recreate);
            return;
        }

    } catch (e) {
        showErreurMsg(e.message);
    }
    //Essayer le modèle par défaut si ligneObj.setWidgetWidgetProperty == null. 

    //Prendre la valeur de la propriété directement sur l'objet d'abord
    theObj[propertyName] = propertyValue;

    //récupérer le type du controle
    var type_controle = theObj.iaType;

    //si la propriété iaType n'existe pas alors c'est surement un sous objet
    if (!type_controle) return;

    //Si c'est un item alors recharger la liste des items
    if (type_controle == 'dxSimpleItem' || type_controle == 'dxEmptyItem' || type_controle == 'dxGroupItem' || type_controle == 'dxTabItem' || type_controle == 'dxTabbedItem') {
        iamContentFormLayout.option("items", iamHFDFormItems);
        return;
    }

    //si la propriété name n'existe pas alors c'est surement un sous objet
    if (!theObj.name) return;
       

    if (recreate && ligneTypeObj.createWidget != null) {
        //Détruire tous les évènements liés et l'objet
        if (ligneTypeObj.deleteWidget != null) {
            ligneTypeObj.deleteWidget(theObj.name, theObj, false);
        }
        //Reconstruire le controle
        if (ligneTypeObj.createWidget != null) {
            ligneTypeObj.createWidget(theObj.name, theObj);
        } else {

            //prendre le widget
            var w = Objet_GetObjetWidget(theObj.name, theObj);

            //Sortir si le widget n'a pas été retrouvé
            if (w == null) return false;

            try {
                //recharger tout le option du controle
                w.option(theObj);

            } catch (e) {
                showErreurMsg(e.message);
            }
        }
        
        return;
        
    } else {

        //prendre le widget
        var w = Objet_GetObjetWidget(theObj.name, theObj);

        //Sortir si le widget n'a pas été retrouvé
        if (w == null) return false;        
        
        try {
            //mettre à jour la propriété du widget
            w.option(propertyName, propertyValue);

        } catch (e) {
            showErreurMsg(e.message);
        }
    }
    
    return true;
}

//permet 
function Objet_SetObjetOptions(objID, objOptions){
    var objInfos=Objet_GetObjectRowById(objID);

    switch (objInfos.type_objet){
        case "dxForm":{
            return $("#" + objID).dxForm("instance").option(objOptions);
        }
        default:{
            if( objInfos.type_objet.startsWith("kendo")){
                return $("#" + objID).data(objInfos.type_objet).options;
            }
        }
    }
    
    return null;
}

//Afficher le popup d'edition manuelle des propriétés
function Objet_EditerManuellementOptions(objID){

    //Prendre l'objet actif si aucun identifiant d'objet n'est passé
    if (objID == null) objID=iamHFDActiveObjId;
   
    var config = JSON.stringify(Objet_GetObjetOptions(objID), function (key, value) {
        if (value !== null) return value
    });
        
    
    //Afficher la fenêtre d'édition manuelle
    var dialog = $("#iamDesignerManualPropertiesEditorWindow").data("kendoWindow");
    dialog.open(function (){
        //récupérer les propriétés de l'objet
        iampropEdit.option("value", config);
    });
}

//Permet de cloner un objet. deepCloning = true permet de cloner aussi les sous objets et array à l'intérieur de l'objet
function Objet_Clone(theObj, objDepart, deepCloning) {

    if (objDepart == null) objDepart = {};
    if (deepCloning == null) deepCloning = true;

    if (theObj == null) return null;

    return jQuery.extend(deepCloning, objDepart, theObj);
}

function Objet_CreateJs(objID, objType, parentID, modeParametrage, remplacerObj) {
       
    //Créer le bon controle selon le type d'objet (d'abord on crée la balise adéquate et ensuite on execute le javascript qui la modifie selon le controle à créer.
    switch (objType) {
                
                    //BarCodes
        case "kendoBarcode": {
            $("#" + objID).kendoBarcode({
                value: "BARCODE",
                width: 200,
                height: 70
            });
            break;
        }
        case "kendoQRCode": {
            $("#" + objID).kendoQRCode({
                value: "QRCODE",
                size: 120
            });
            break;
        }

                                        
        case "RangeSelector": {
            $("#" + objID).dxRangeSelector({margin: {top: 40},size: {height: 200},scale: {startValue: 0,endValue: 150000,minorTickInterval: 500,tickInterval: 15000,minorTick: {visible: false,},label: {format: "currency"}}, sliderMarker: {format: "currency"},value: [40000, 80000],title: "TITRE"});
            break;
        }
        case "RangeSlider": {
            $("#" + objID).dxRangeSlider({min: 0,max: 100,start: 0, end: 100, label: {visible: true,position: "top"}, tooltip: {enabled: true,showMode: "onHover", position: "bottom"}});
            break;
        }
        case "Slider": {
            $("#" + objID).dxSlider({min: 0,max: 100,label: { visible: true,position: "top"} , tooltip: {enabled: true,showMode: "onHover",position: "bottom"}});
            break;
        }
               

        default: {

        }
    }
    
}

//Permet de créer un objet selon le type passé pour l'identifiant passé
function Objet_Create(objID, objType, parentID, objCreationHtml, modeParametrage, remplacerObj, objOption, proprietesComplementaires) {

    //Vérifier que le type d'objet demandé existe dans la liste des objets
    var ligneTypeObj = Objet_GetTypeObjetLigne(objType)

    //Sortir car aucun objet de ce type nexiste dans la liste
    if (ligneTypeObj == null) return;

    if (parentID == null && iamContentFormLayout != null) parentID = "iamContentFormLayout"; 

    //si ce n'est pas un layout alors
    if (objType != 'dxForm') {

        if (objID == "" || objID == null) {

            if (iamAutoCreateNames) {
               
                var nom_obj = '', indx = 1;
                nom_obj = objType + indx.toString();

                if (iamHForm.objectsList.length > 0) {
                    while (iamHForm.objectsList.find(function (el) { return el.nom_objet == nom_obj }) != null) {
                        indx++;
                        nom_obj = objType + indx.toString();                        
                    }
                }
               
                //prendre le nom créé et continuer
                objID = nom_obj;

            } else {

                var res = prompt("Saisir le nom de l'objet", "Magic Suite");

                if (res != null) {
                    Objet_Create(res, objType, parentID, objCreationHtml, modeParametrage);
                }

    //kendo.prompt("Saisir le nom de l'objet", null)
    //            .done(function (data) {
    //                Objet_Create(data, objType, parentID, objCreationHtml, modeParametrage);
    //            })
    //            .fail(function (data) {

    //            });
    //            return;
            }
            
        }
    } else {
        objID = "iamContentFormLayout";
    }
        
    //Conserver le dernier outils utilisé par l'utilisateur
    if (objType != 'dxForm') iamHFDLastTool = objType;

    //Vérifier si l'id existe déjà
    var monObj = $("#" + objID);

    if (monObj.length && remplacerObj == null) {
        showErreurMsg("Un objet de nom:'" + objID + "' existe déjà!", 3000);
        return;
    }
    
    //Mettre a jour la liste des objets créés
    if (objOption == null) objOption = ligneTypeObj.createOptions(objID);

    //Intégrer les propriétés complémentaires si nécessaire
    if (proprietesComplementaires) {        
        //parcourir les propriétés complémentaires
        Object.keys(proprietesComplementaires).forEach(function (key, index) {
            objOption[key]= proprietesComplementaires[key];
        });
    }
    
    if (remplacerObj) {
        //Récupérer les anciennes infos sur l'ancien objet dans la liste des objets du formulaire
        obj_infos = Objet_GetObjectRowById(objID);

        obj_infos.type_objet = objType;
        obj_infos.option_objet = objOption;

    } else {
        //ajouter l'objet créer dans la liste des objets
        Objet_AjouterObjetToHFormObjectsList(objID, objType, parentID, objOption, ligneTypeObj.id_categorie);
    }

    //Vérifier si le HTML de création du widget est déja existant
    if (objCreationHtml == null && (objOption.dictionnaire_id_categorie != "iamHFDDataSources") ) {
        if (ligneTypeObj.getHtml === false) {
            //Ne rien faire si aucun html ne doit etre créé
        } else {
            if (ligneTypeObj.getHtml == null) {
                //créer le modèle par défaut de magic suite
                objCreationHtml = '<div id="' + objID + '"></div>';               
            } else {
                //récupérer le html à créer depuis la fonction de création du html du type d'objet
                objCreationHtml = ligneTypeObj.getHtml(objID, objOption);
            }
        }
        
       
        var ObjContainer = null;
        //Vérifier si l'objet doit être créé à l'intérieur d'un parent spécifique au lieu des simplement dans la page
        if (parentID != null) {
            ObjContainer = $("#"+parentID);

            
        }else{
            ObjContainer = $("#iamEmulator");
        }
        
        if (remplacerObj == true) {
            //vider le contenu du div d'encadrement de l'objet
            $("#iamagicDesignDiv_" + objID).empty();
        } else {

            switch (parentID){
                case "iamContentFormLayout":{
                    var newItem = {
                        name: "item_" + objID,
                        controleName: objID,
                        iaType: 'dxSimpleItem',
                        label: { text: objID },
                        template: eval("(function (data, element) { formItemsCreateInnerControle(element,'" +  objID + "','" +  objCreationHtml+ "'); })")
                    };
                    
                    //Supprimer le label si cela est mentionné
                    if (ligneTypeObj.hide_item_text === true) {
                        delete newItem.label;
                    }
                    //ajouter l'item au dxForm
                    formItemsAddItem(newItem, iamHFDFormItems);    
                    break;
                }
                default:{
                    //ajouter la balise HTML dans la page pour ensuite générer l'objet
                    if (objCreationHtml) ObjContainer.append(objCreationHtml);
                }
            }
        }
        
                
    }
     
       
    //Créer le bon controle selon le type d'objet (d'abord on crée la balise adéquate et ensuite on execute le javascript qui la modifie selon le controle à créer.
    switch (objType) {

        //Conteneurs
        case "dxForm": {            
            iamContentFormLayout = ligneTypeObj.createWidget(objID, objOption);

            //signifier que le layout a bien été créé
            showSuccessMsg("FormLayout Créé avec succès!", 1000);

            //Générer le contenext menu
            iamContentFormLayoutContextMenu = $("#iamContentFormLayoutContextMenu").dxContextMenu({
                target: '#iamContentFormLayout',
                items: iamContentFormLayoutContextMenuItems                
                ,onItemClick: function (e) {
                    var itemData = e.itemData;
                    switch (itemData.id) {
                        case "customize_tree": {
                            //charger les items dans le tree                            
                            iamContentFormLayoutTree.setDataSource(iamHFDFormItems);
                            //Afficher le popup avec Tree du design du layout
                            iamContentFormLayoutDesignerPopup.show();
                            return;
                        }
                            
                        case "text_show_hide": {
                            formItemsShowHideText(iamHFDFormItems);
                            break;
                        }
                        case "text_location_left": {
                            formItemsChangeTextLocation('left', iamHFDFormItems);
                            break;
                        }
                        case "text_location_right": {
                            formItemsChangeTextLocation('right', iamHFDFormItems);
                            break;
                        }
                        case "text_location_top": {
                            formItemsChangeTextLocation('top', iamHFDFormItems);
                            break;
                        }
                        case "edit_item_properties": {
                            formItemsLoadItemProperties();
                            break;
                        }
                        case "edit_form_properties": {
                            formItemsLoadFormProperties();
                            break;
                        }
                        case "add_empty_item": {
                            formItemsCreateEmptyItem(null, iamHFDFormItems);
                            break;
                        }
                        case "edit_controle_properties": {
                            formItemsLoadItemObjectProperties();
                            break;
                        }
                        case "create_group": {
                            formItemsCreateGroup(null, iamHFDFormItems);
                            break;
                        }
                        case "ungroup": {
                            formItemsUnGroup(iamHFDFormItems);
                            break;
                        }
                        case "create_tab": {
                            formItemsCreateTabbed(iamHFDFormItems);
                            break;
                        }
                        case "add_tabitem": {
                            formItemsAddTabItem(iamHFDFormItems);
                            break;
                        }
                        case "span_less": {
                            formItemsShrinkWidenColSpan(-1, iamHFDFormItems);
                            break;
                        }
                        case "span_more": {
                            formItemsShrinkWidenColSpan(1, iamHFDFormItems);
                            break;
                        }
                        case "obligatoire": {
                            formItemsChangeObligatoire(iamHFDFormItems);
                            break;
                        }

                        case "delete_item": {
                            formItemsDelete(iamHFDFormItems);
                            break;
                        }
                        default: {
                            Objet_Create(null, itemData.id, "iamContentFormLayout", null, true);
                        }
                    }
                }
            }).dxContextMenu('instance');
            break;                        
        }                    
        
        default: {            
            //Vider la selection
            initSelection();

            if (modeParametrage) {
                //Activer l'objet pour le paramétrage
                //Objet_ActiverObjet(objID);

                //vérifier si le contrôle est une source de données
                if (objOption.dictionnaire_id_categorie == "iamHFDDataSources") {
                    //afficher les propriétés de l'objet.
                    iamHFDActiveObjId = objOption.name;
                    propertyGridLoadObjectPropertiesByName(iamHFDActiveObjId, true);

                    if (objOption.iaType == 'iaMasterDetailsDS') {
                        //afficher l'éditeur de sources SQL
                        MasterDetailsDSPopupShow();
                    }
                }
                
            }
        }
    }
    
    return;
        
}

//fin des fonctions Objet -----------------------------------------------------------------------------------------------------------------------------------------------------------------------


//fonction des layoutItems ***********************************************************************************************************************************************************************
//permet de supprimer tous les items sélectionnés avec leurs controles liés.
function formItemsDelete(items) {

    //Vérifier qu'un item est actif
    if (iamHFDSelectedItems.length > 0) {
        for (var i = 0; i < iamHFDSelectedItems.length; i++)
            formItemsDeleteItemAndInnerObject(iamHFDSelectedItems[i], items, true);

        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);
        iamContentFormLayout.repaint();

        //Vider la selection
        initSelection();
    }

    
}

//fonction permettant de supprimer un item depuis son nom. Si l'item contient un controle, le controle est aussi supprimé
//Si l'item est le dernier élément d'un groupe ou d'un onglet ce dernier est aussi supprimé.
function formItemsDeleteItemAndInnerObject(itemName, items, batch) {

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Récupérer l'item grace à son nom
    var item = formItemsGetItemByName(itemName, items, false);

    if (item == null) return;

    //prendre le parent
    var activeItemParent = formItemsGetItemByName(itemName, items, true);

    //Vérifier si l'item a un controle interne
    if (item.controleName) {
        //supprimer le controle interne
        Objet_SupprimerObjet(item.controleName);
    }

    if (item.items && item.items.length > 0) {
        //Afficher message
        showErreurMsg("Impossible de supprimer un élément contenant des objets!");
    } else {
        if (item.tabs && item.tabs.length > 0) {
            //Afficher message
            showErreurMsg("Impossible de supprimer un élément contenant des objets!");
        } else {

            var parentItems;

            //prendre le parent
            if (activeItemParent == iamContentFormLayout || activeItemParent == null) {
                //ne rien faire
                parentItems = items;
            } else {
                                
                if (activeItemParent.type == 'tabbed') {
                    parentItems = activeItemParent.tabs;
                } else {
                    parentItems = activeItemParent.items;
                }

               
            }

            //Retirer l'item de son parent
            for (var i = parentItems.length - 1 ; i > -1; i--)
                if (parentItems[i].name == item.name) {
                    parentItems.splice(i, 1)[0];
                    break;
                };

            //si le parent ne contient plus d'enfant alors sortir
            if ( (activeItemParent != iamContentFormLayout && activeItemParent != null) && parentItems.length == 0) formItemsDeleteItemAndInnerObject(activeItemParent.name, items, batch);

            if (batch == null || batch == false) {
                //recharger les items dans le form layout
                iamContentFormLayout.option("items", iamHFDFormItems);
                iamContentFormLayout.repaint();

                //Vider la selection
                initSelection();
            }

        }
    }
}

//Permet la regénération du item template du simple item
function formItemsCreateInnerControle(element, objID, objCreationHtml) {

    var objOption = Objet_GetObjetOptions(objID);

    //sortir si aucun objet n'a été trouvé
    if (objOption == null) return;

    ligneTypeObj = Objet_GetTypeObjetLigne(objOption.iaType);

    element.append(objCreationHtml)
                                .promise()
                                .done(function (item) {
                                    if (ligneTypeObj.createWidget) {
                                        //Créer le widget
                                        ligneTypeObj.createWidget(objID, objOption);
                                    }
                                    element.closest('div.dx-field-item').attr('name', 'item_' + objID);
                                    formItemsSetGroupNameInDom('item_' + objID, element);
                                });

}

//permet de charger les propriétés du controle lié à un item dans le propertyGrid
function formItemsLoadItemObjectPropertiesByItemName(itemName) {
    //rechercher l'item
    var item = formItemsGetItemByName(itemName);

    if (item.controleName == null) {
        //charger les propriétés de l'item vu que aucun objet n'y est lié
        propertyGridLoadObjectPropertiesByName(itemName);
    } else {
        //charger les propriétés de l'objet lié
        propertyGridLoadObjectPropertiesByName(item.controleName);
    }
    
    //se mettre sur l'onglet des propriété s'il n'est pas actif
    if (iamTabPanel.option("selectedIndex") != 0 ) iamTabPanel.option("selectedIndex", 0);
}

//permet de charger les propriétés du controle lié à un item dans le propertyGrid
function formItemsLoadItemObjectProperties() {
    //rechercher l'item
    if (iamHFDSelectedItems.length > 0) {
        var item = formItemsGetItemByName(iamHFDSelectedItems[0]);

        //Afficher les propriétés de l'objet lié
        propertyGridLoadObjectPropertiesByName(item.controleName);

        //se mettre sur l'onglet des propriété s'il n'est pas actif
        iamTabPanel.option("selectedIndex", 0);
    }
    
}

//permet de charger les propriétés d'un item dans le propertyGrid
function formItemsLoadItemPropertiesByItemName(itemName) {

    propertyGridLoadObjectPropertiesByName(itemName);
    //se mettre sur l'onglet des propriété s'il n'est pas actif
    iamTabPanel.option("selectedIndex", 0);
}

//Editer les propriété du layout
function formItemsLoadFormProperties() {
    propertyGridLoadObjectPropertiesByName("iamContentFormLayout");
    //se mettre sur l'onglet des propriété s'il n'est pas actif
    iamTabPanel.option("selectedIndex", 0);
}

//permet de charger les propriétés de l'item sélectionné dans le propertyGrid
function formItemsLoadItemProperties() {
    
    if (iamHFDSelectedItems.length > 0) { propertyGridLoadObjectPropertiesByName(iamHFDSelectedItems[0]); iamTabPanel.option("selectedIndex", 0);}
}

//permet d'ajouter un onglet supplémentaire à une item d'onglets tabbeditem. Si gpOrTabItem est non null cela veut dire que le nouvel onglet doit etre créé à partir d'un groupe 
//ou qu'on a un déplacemant d'onglet
//destinationTabbedItem est l'objet tabbed de destination. S'il n'est pas passé alors il est récupéré depuis la sélection: iamHFDSelectedItems[0]
function formItemsAddTabItem(items, TabName, destinationTabbedItem, gpOrTabItem, batch) {

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Vérrifier si aucun nom de tabbed a créer n'est passé
    if (!TabName && gpOrTabItem == null) {
        if (iamAutoCreateNames) {
            //prendre automatiquement
            TabName = 'item_' + new DevExpress.data.Guid().toString();
        } else {
            kendo.prompt("Saisir le nom de l'objet", null)
                .done(function (data) {
                    formItemsAddTabItem(items, data, destinationTabbedItem, gpOrTabItem, batch);
                })
                .fail(function (data) {
                });
            return;
        }
    } 
    
    //Récupérer le parent de l'élément
    var gpParent = null;
    var parentItems;

    //Vérifier si l'objet de destination est vide
    if (destinationTabbedItem == null) {
         //Vide, alors vérifier qu'un élément est dans la sélection
        if (iamHFDSelectedItems.length > 0) {
            if (destinationTabbedItem == null) destinationTabbedItem = formItemsGetItemByName(iamHFDSelectedItems[0], items);
        
            if (destinationTabbedItem.itemType == 'tabbed' || destinationTabbedItem.iaType == 'dxTabItem') {

                if (gpOrTabItem != null) {
                    //Modifier les informations du groupe pour le faire correspondre à une tab du tabbedItem
                    if (gpOrTabItem.iaType == 'dxTabItem') {
                        //ne rien faire
                    } else {
                        //groupe donc transformer le groupe en tabItem
                        formItemsTransformGroupToTab(gpOrTabItem);
                    }
                    

                    //Récupérer le parent du groupe
                    gpParent = formItemsGetItemByName(gpOrTabItem.name, items, true);

                    if (gpParent === iamContentFormLayout || gpParent == null) {
                        parentItems = iamHFDFormItems;
                    } else {
                        if (gpParent.itemType == 'tabbed') {
                            parentItems = gpParent.tabs;
                        } else {
                            parentItems = gpParent.items;
                        }
                        
                    }

                    var tabs;
                    if (destinationTabbedItem.iaType == 'dxTabItem') {
                        var tabbedItem = formItemsGetItemByName(destinationTabbedItem.name, items, true);

                        if (tabbedItem != null) tabs = tabbedItem.tabs;

                    } else {
                        tabs = destinationTabbedItem.tabs;
                    }

                    if (tabs == null) {
                        //Remettre le groupe comme il était
                        if (gpOrTabItem.iaType == 'dxTabItem') {
                            //ne rien faire
                        } else {
                            //groupe donc revenir sur la nature du groupe précédemment transformé en tabItem
                            formItemsTransformTabToGroup(gpOrTabItem);
                        }
                        
                        showInformationMsg("Impossible d'ajouter un onglet! L'objet sélectionné n'est pas un groupe d'onglet");
                        return;
                    }
                    //Retirer le groupe/tabItem de son parent et l'intégrer comme tab dans le nouveau tabbedItem
                    for (var i = parentItems.length - 1 ; i > -1; i--)
                        if (parentItems[i].name == gpOrTabItem.name) {

                            if (destinationTabbedItem.iaType == 'dxTabItem') {
                                //Ajouter juste avant la position de l'onglet
                                for (var j = tabs.length - 1 ; j > -1; j--)
                                    if (tabs[j].name == destinationTabbedItem.name) {
                                        tabs.splice(j, 0, parentItems.splice(i, 1)[0]);
                                    }
                            } else {
                                //Ajouter en dernière position
                                tabs.push(parentItems.splice(i, 1)[0]);
                            }
                            
                            break;
                        }

                } else {
                    //Ajouter un nouvel onglet vierge
                    var newItem = {
                        name: TabName,
                        title:"NEW TAB",
                        iaType: 'dxTabItem',                
                        items: []
                    };

                    //Ajouter l'onglet au groupe d'onglet
                    destinationTabbedItem.tabs.push(newItem);

                    //Créer un empty item dans la tabulation pour permettre le drag and drop dans son content
                    formItemsCreateEmptyItem(null, items, newItem);
                }
                
            } else {
                showInformationMsg("Impossible d'ajouter un onglet! L'objet sélectionné n'est pas un groupe d'onglet");
            }
        } else {
            showInformationMsg("Impossible d'ajouter un onglet! Aucun objet de destination trouvé!");
        }
    } else {
        //l'objet de destination n'est pas vide donc vérifier que c'est un tabbed
        if (destinationTabbedItem.itemType == 'tabbed' || destinationTabbedItem.iaType == 'dxTabItem') {

            if (gpOrTabItem != null) {
                //Modifier les informations du groupe pour le faire correspondre à une tab du tabbedItem
                formItemsTransformGroupToTab(gpOrTabItem);

                //Récupérer le parent du groupe
                gpParent = formItemsGetItemByName(gpOrTabItem.name, items, true);

                if (gpParent === iamContentFormLayout || gpParent == null) {
                    parentItems = iamHFDFormItems;
                } else {
                    if (gpParent.itemType == 'tabbed') {
                        parentItems = gpParent.tabs;
                    } else {
                        parentItems = gpParent.items;
                    }
                }

                var tabs;
                if (destinationTabbedItem.iaType == 'dxTabItem') {
                    var tabbedItem = formItemsGetItemByName(destinationTabbedItem.name, items, true);

                    if (tabbedItem != null) tabs = tabbedItem.tabs;

                } else {
                    tabs = destinationTabbedItem.tabs;
                }

                if (tabs == null) {
                    //Remettre le groupe comme il était
                    formItemsTransformTabToGroup(gpOrTabItem);                   
                    showInformationMsg("Impossible d'ajouter un onglet! L'objet sélectionné n'est pas un groupe d'onglet");
                    return;
                }
                //Retirer le groupe de son parent et l'intégrer comme tab dans le nouveau tabbedItem
                for (var i = parentItems.length - 1 ; i > -1; i--)
                    if (parentItems[i].name == gpOrTabItem.name) {

                        if (destinationTabbedItem.iaType == 'dxTabItem') {
                            //Ajouter juste avant la position de l'onglet
                            for (var j = tabs.length - 1 ; j > -1; j--)
                                if (tabs[j].name == destinationTabbedItem.name) {
                                    tabs.splice(j, 0, parentItems.splice(i, 1)[0]);
                                }
                        } else {
                            //Ajouter en dernière position
                            tabs.push(parentItems.splice(i, 1)[0]);
                        }

                        break;
                    }

            } else {

                //Ajouter un nouvel onglet vierge
                var newItem = {
                    name: TabName,
                    title: "NEW TAB",
                    iaType: 'dxTabItem',
                    items: []
                };
                
                //Ajouter l'onglet au groupe d'onglet
                destinationTabbedItem.tabs.push(newItem);

                //Créer un empty item dans la tabulation pour permettre le drag and drop dans son content
                formItemsCreateEmptyItem(null, items, newItem);
            }
            
        } else {
            showInformationMsg("Impossible d'ajouter un onglet! L'objet sélectionné n'est pas un groupe d'onglet");
        }
    }

    if (batch == null || batch == false) {
        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);
        iamContentFormLayout.repaint();

        //Vider la selection
        initSelection();
    }
    
}


//fonction exécutée dans le content ready du tabbedPanel
function formItemsTabbedItemOnContentReady(element, tabbedName) {

    element.attr('name', tabbedName);
    element.closest('div.dx-field-item').attr('name', tabbedName);
    formItemsSetGroupNameInDom(tabbedName, element);

    return;
}

//permet de créer des onglets pour tous les groupes présents dans la sélection
function formItemsCreateTabbed(items) {

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Vérifier qu'un item est actif
    if (iamHFDSelectedItems.length > 0) {
        for (var i = 0; i < iamHFDSelectedItems.length; i++)
            formItemsCreateTabbedItemByItemName(null,iamHFDSelectedItems[i], items, true);
    }

    //recharger les items dans le form layout
    iamContentFormLayout.option("items", iamHFDFormItems);
    iamContentFormLayout.repaint();

    //Vider la selection
    initSelection();
}

//permet dissocier le groupe dont le nom est passé en paramètre 
function formItemsCreateTabbedItemByItemName(tabbedName,gpName, items, batch) {

    //Vérrifier si aucun nom de tabbed a créer n'est passé
    if (!tabbedName) {
        if (iamAutoCreateNames) {
            //prendre automatiquement
            tabbedName = 'Tabbed_' + new DevExpress.data.Guid().toString();
        } else {
            kendo.prompt("Saisir le nom de l'objet", null)
                .done(function (data) {
                    formItemsCreateTabbedItemByItemName(data, gpName, items, batch);
                })
                .fail(function (data) {
                });
            return;
        }
    }

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Recupérer l'élément actif 
    var activeItem = formItemsGetItemByName(gpName, items);
    if (activeItem == null) {
        showErreurMsg("L'item de nom:'" + gpName + "' n'a pas été trouvé!");
        return;
    }

    if (activeItem.itemType != 'group') {
        showErreurMsg("L'item de nom:'" + gpName + "' n'est pas un groupe!");
        return;
    }

    //Modifier les informations du groupe pour le faire correspondre à une tab du tabbedItem
    formItemsTransformGroupToTab(activeItem)
    

    //Créer le nouvel tabbedItem
    var newItem = {
        name:tabbedName,
        itemType: "tabbed",
        iaType:'dxTabbedItem',
        colSpan: activeItem.colSpan,
        tabPanelOptions: {
            deferRendering: false,
            onTitleRendered: function (e) {
                e.itemElement.attr('name', e.itemData.name);
                var el = e.itemElement.closest('div.dx-tabpanel-tabs').next();
                el = $('div', el).filter('.dx-multiview-item-container').children().eq(e.itemIndex);
                if (el) el.attr('name', e.itemData.name);
            },           
            onContentReady: eval("(function (e) { formItemsTabbedItemOnContentReady(e.element,'" + tabbedName + "'); })")
        },
        tabs: []
    };

    //Récupérer le parent de l'élément
    var activeItemParent = formItemsGetItemByName(gpName, items, true);

    var parentItems;
    if (activeItemParent === iamContentFormLayout || activeItemParent == null) {
        parentItems = iamHFDFormItems;
    } else {
        parentItems = activeItemParent.items;
    }

    //Intégrer  le tabbedItem dans le parent du groupe à la position du groupe
    for (var i = parentItems.length - 1 ; i > -1; i--)
        if (parentItems[i].name == activeItem.name) {
            parentItems.splice(i, 0, newItem);
            break;
        }
    
    //Retirer le groupe de son parent et l'intégrer comme tab dans le nouveau tabbedItem
    for (var i = parentItems.length - 1 ; i > -1; i--)
        if (parentItems[i].name == activeItem.name) {
            newItem.tabs.push(parentItems.splice(i, 1)[0]);
            break;
        }

    if (batch == null || batch == false) {
        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);
        iamContentFormLayout.repaint();

        //Vider la selection
        initSelection();
    }


}

//permet de transformer un onglet en goupe 
function formItemsTransformTabToGroup(tabItem) {

    //si c'est déjà un groupe alors sortir
    if (tabItem.iaType == "dxGroupItem") return;

    //Modifier les informations du groupe pour le faire correspondre à une tab du tabbedItem
    tabItem.caption = tabItem.title;
    tabItem.iaType = "dxGroupItem";
    tabItem.itemType = 'group'; //donner le type group
    delete tabItem.hiddenType 
    delete tabItem.title;
    
}

//permet de transformer un groupe en onglet
function formItemsTransformGroupToTab(gpItem) {

    //si c'est déjà un tabItem alors sortir
    if (gpItem.iaType == "dxTabItem") return;

    //Modifier les informations du groupe pour le faire correspondre à une tab du tabbedItem
    gpItem.title = gpItem.caption;
    gpItem.iaType = "dxTabItem";
    gpItem.hiddenType = gpItem.itemType;//garder le type en hydden pour le futur
    delete gpItem.itemType; //supprimer le itemType pour ne pas bugger le système
    delete gpItem.caption;
}

//permet de déplacer les items sélectionnés vers/dans un autre item selon la nature de l'item de destination
function formItemsMoveTowardsItemByItemName(destinationItemName, items, type_controle) {

    if (!iamContentFormLayout) return;

    //Si un type de controle est spécifier alors il faut créer un nouvel élément vers l'objet de destination
    if (type_controle) {
        iamHFDDraggedTool = null;

        if (type_controle == "dxForm") {
            Objet_Create(null, type_controle);

        } else {
            iamHFDSelectedItems = [];
            iamHFDSelectedItems.push(destinationItemName);
            Objet_Create(null, type_controle, "iamContentFormLayout");
        }
        
        return;
    }
    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Vérifier qu'un item est actif
    if (iamHFDSelectedItems.length > 0) {
        for (var i = 0; i < iamHFDSelectedItems.length; i++)
            formItemsMoveItemTowardsItemByItemsNames(iamHFDSelectedItems[i], destinationItemName, items, true);
    }

    //recharger les items dans le form layout
    iamContentFormLayout.option("items", iamHFDFormItems);
    iamContentFormLayout.repaint();

    //Vider la selection
    initSelection();
}


//permet de déplacer l'item vers/dans un autre item selon la nature de l'item de destination
function formItemsMoveItemTowardsItemByItemsNames(itemToMoveName, destinationItemName, items, batch) {

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //rechercher l'item à déplacer depuis son nom
    var itemToMove = formItemsGetItemByName(itemToMoveName, items, false);
    if (itemToMove == null) {
        showErreurMsg("Objet à déplacer '" +itemToMoveName + "' non retrouvé!");
        return;
    }

    //Rechercher l'item de destination depuis son nom
    var destinationItem = formItemsGetItemByName(destinationItemName, items, false);
    if (itemToMove == null) {
        showErreurMsg("Objet à déplacer '" + itemToMoveName + "' non retrouvé!");
        return;
    }

    //déplacer l'item vers/dans la destination
    formItemsMoveItemTowardsItem(itemToMove, destinationItem, items, batch);
}


//permet de déplacer l'item vers/dans un autre item selon la nature de l'item de destination
function formItemsMoveItemTowardsItem(itemToMove, destinationItem, items, batch) {

    if (destinationItem == null) {
        showErreurMsg("Objet de destination non retrouvé!");
        return ;
    }

    if (itemToMove == null) {
        showErreurMsg("Objet à déplacer non retrouvé!");
        return ;
    }

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Récupérer le parent de l'élément
    var activeItemParent = formItemsGetItemByName(itemToMove.name, items, true);

    var parentItems;
    if (activeItemParent === iamContentFormLayout || activeItemParent == null) {
        parentItems = iamHFDFormItems;
    } else {
        if (activeItemParent.itemType == 'tabbed') {
            parentItems = activeItemParent.tabs;
        } else {
            parentItems = activeItemParent.items;
        }        
    }

    //Sortir si les items du parents n'ont pas été trouvé
    if (parentItems == null) return;

    indx=-1
    for (var i = 0; i < parentItems.length; i++)
        if (parentItems[i].name == itemToMove.name) {
            indx=i;
            break;
        }

    //Si l'objet de destination est le layout lui mme alors ajouter l'objet à la fin
    if (destinationItem === iamContentFormLayout) {
        
        if (itemToMove.iaType == "dxTabItem") {
            //Transformer l'onglet en groupe
            formItemsTransformTabToGroup(itemToMove);
        }
        iamHFDFormItems.push(parentItems.splice(indx, 1)[0]);
        return;
    }

    if (destinationItem.itemType == 'group') {
        //Ajouter l'élément au groupe
        destinationItem.items.push(parentItems.splice(indx, 1)[0]);
    } else {

        if (destinationItem.itemType == 'tabbed') {
            if (itemToMove.itemType != 'group' && itemToMove.iaType != 'dxTabItem') {
                showErreurMsg("Impossible de déplacer cet élément dans la zone des onglets!");
            } else {
                formItemsAddTabItem(items, null, destinationItem, itemToMove, batch);
                return;
            }
        } else {
            if (destinationItem.iaType == 'dxTabItem') {
                if (itemToMove.itemType != 'group' && itemToMove.iaType != 'dxTabItem') {
                    showErreurMsg("Impossible de déplacer cet élément dans la zone des onglets!");
                } else {
                    formItemsAddTabItem(items, null, destinationItem, itemToMove, batch);
                    return;
                }
            } else {
                //Récupérer le parent de l'élément de destination
                var destinationItemParent = formItemsGetItemByName(destinationItem.name, items, true);
                //Récupérer les items du parent de l'objet de destination
                var destinationItemParentItems;
                if (destinationItemParent === iamContentFormLayout || destinationItemParent == null) {
                    destinationItemParentItems = iamHFDFormItems;
                } else {
                    destinationItemParentItems = destinationItemParent.items;
                }

                for (var i = 0; i < destinationItemParentItems.length; i++)
                    if (destinationItemParentItems[i].name == destinationItem.name) {
                        if (itemToMove.iaType == "dxTabItem") {
                            //Transformer l'onglet en groupe
                            formItemsTransformTabToGroup(itemToMove);
                        }
                        destinationItemParentItems.splice(i, 0, parentItems.splice(indx, 1)[0]);
                        break;
                    }
            }
        }
        
        
    }

    if (batch == null || batch == false) {
        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);
        iamContentFormLayout.repaint();

        //Vider la selection
        initSelection();
    }
}

//permet de déplacer un item vers un groupe ou une tabulation 
function formItemsCreateEmptyItem(itemName, items, parentItem) {

    if (!itemName) {
        //créer le nom de l'item avec un guid
        itemName ='emptyItem_'+ new DevExpress.data.Guid().toString();
    }

    //Créer un empty item
    var newItem = {
        name: itemName,        
        itemType: "simple",
        iaType: 'dxEmptyItem',
        template: eval("(function (data, element) { formItemsCreateEmptyItemTemplate(element,'" + itemName + "'); })"),            
    };

    //Ajouter l'item au form layout
    formItemsAddItem(newItem, items, parentItem);

    return newItem;
}

//permet de créer le contenu du itemTemplate d'un empty item
function formItemsCreateEmptyItemTemplate(element, itemName) {
    element.append("<div>&nbsp</div>");
    element.closest('div.dx-field-item').attr('name', itemName);
    formItemsSetGroupNameInDom(itemName, element);
    return;
}

//permet de réduire ou d'augmenter le colSpan donc la largeur des items présent dans la sélection shrinkOrWiden=1 Widen et shrinkOrWiden=-1 shrink
function formItemsShrinkWidenColSpan(shrinkOrWiden, items) {

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    if (shrinkOrWiden == null) shrinkOrWiden = 1; //Par défaut on augmente le colSpan de l'item

    //Vérifier qu'un item est actif
    if (iamHFDSelectedItems.length > 0) {
        for (var i = 0; i < iamHFDSelectedItems.length; i++)
            formItemsShrinkWidenItemColSpanByItemName(iamHFDSelectedItems[i], shrinkOrWiden, items, true);

        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);
        iamContentFormLayout.repaint();

        //Vider la selection
        initSelection();
    }

   
}

//permet de réduire ou d'augmenter le colSpan donc la largeur  de l'item dont le nom est passé en paramètre  (shrinkOrWiden=1 Widen et shrinkOrWiden=-1 shrink)
function formItemsShrinkWidenItemColSpanByItemName(itemName, shrinkOrWiden, items, batch) {

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Recupérer l'élément actif 
    var activeItem = formItemsGetItemByName(iamHFDSelectedItems[0], items);
    if (activeItem == null) {
        showErreurMsg("L'item de nom:'" + itemName + "' n'a pas été trouvé!");
        return;
    }

    if ((activeItem.colSpan == 1 || activeItem.colSpan == null ) && shrinkOrWiden == -1) {
        showInformationMsg("L'item de nom:'" + itemName + "' a atteint sa largeur minimale!");
        return;
    }

    //Récupérer le parent de l'élément
    var activeItemParent = formItemsGetItemByName(itemName, items, true);

    if ( activeItemParent == null) {
        activeItemParent = iamContentFormLayout;
    }

    if (shrinkOrWiden == 1) {
        //Initialiser les propriétés si elles n'existent pas encore
        if (activeItem.colSpan == null) activeItem.colSpan = 1;
        var colCount = 1;

        if (activeItemParent === iamContentFormLayout) {
            colCount = iamContentFormLayout.option("colCount");
        } else {
            if (activeItemParent.colCount == null) {
                activeItemParent.colCount = 1;
            } else {
                colCount = activeItemParent.colCount;
            }
        }               

        if (activeItem.colSpan == colCount) {
            showInformationMsg("L'item de nom:'" + itemName + "' a atteint sa largeur maximale!");
            return;

        } else {
            //Incrémenter me colSpan
            activeItem.colSpan += 1;
        }
    } else {
        activeItem.colSpan -= 1;
    }
    
    if (batch == null || batch == false) {
        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);
        iamContentFormLayout.repaint();

        //Vider la selection
        initSelection();
    }


}


//permet d'ajouter un nouveau item au layout. parentItem est facultatif. Il est utilisé lorsqu'on veut directement créé l'item dans une destination maitrisée et pas la sélection en cours
function formItemsAddItem(newItem, items, parentItem) {
        
    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;
       
    //Vérifier qu'un item est actif
    if (iamHFDSelectedItems.length > 0 || parentItem != null) {
       
        var activeItem;

        if (parentItem != null) {
            activeItem = parentItem;
        } else {
            //Recupérer l'élément actif (premier de la sélection)
            activeItem = formItemsGetItemByName(iamHFDSelectedItems[0], items);
        }
        if (activeItem == null) {
            DevExpress.ui.notify({ message: "L'item de nom:'" + iamHFDSelectedItems[0] + "' n'a pas été trouvé!", width: 400, shading: true }, "error", 1500);
            return;
        }

        //Si l'élément sélectionné peut contenir des enfants alors créer dans la sélection
        if (activeItem.items != null) {
            activeItem.items.push(newItem);
        } else {
            //Récupérer le parent de l'élément
            var parentItems;

            if (parentItem == null) {
                var activeItemParent = formItemsGetItemByName(iamHFDSelectedItems[0], items, true);
            
                if (activeItemParent === iamContentFormLayout || activeItemParent == null) {
                    parentItems = iamHFDFormItems;
                } else {
                    parentItems = activeItemParent.items;
                }
            } else {
                parentItems = parentItem.items;
            }
            
                        
            //Rechercher la position
            if (activeItem) {
                //prendre le plus petit index dans le parent devant contenir le groupe
                var index = -1;
                for (var i = 0; i < parentItems.length; i++)
                    if (activeItem.name == parentItems[i].name) {
                        //insérer le groupe à la bonne position
                        parentItems.splice(i+1, 0, newItem);
                        break;
                    }
                            
            }
        }
               

    } else {
        iamHFDFormItems.push(newItem);
    }

    //recharger les items dans le form layout
    iamContentFormLayout.option("items", iamHFDFormItems);
    iamContentFormLayout.repaint();

    //Vider la selection
    initSelection();

    return;
}

//permet d'ecrire le nom du group dans le dom si ce n'est pas déjà fait
function formItemsSetGroupNameInDom(childItemName, childElement) {

    var parent = formItemsGetItemByName(childItemName, iamHFDFormItems, true);
    if (parent != null && parent !== iamContentFormLayout && parent.itemType == 'group') {
        var gpDom = childElement.closest('div.dx-form-group').closest('div.dx-field-item');
        if (!gpDom.attr('name')) gpDom.attr('name', parent.name);
    }
    return;
}

//permet de dissocier tous les groupes présents dans la sélection
function formItemsUnGroup(items) {

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Vérifier qu'un item est actif
    if (iamHFDSelectedItems.length > 0) {
        for (var i = 0; i < iamHFDSelectedItems.length; i++)
            formItemsUnGroupItemByItemName(iamHFDSelectedItems[i], items, true);
    }

    //recharger les items dans le form layout
    iamContentFormLayout.option("items", iamHFDFormItems);
    iamContentFormLayout.repaint();

    //Vider la selection
    initSelection();
}

//permet dissocier le groupe dont le nom est passé en paramètre 
function formItemsUnGroupItemByItemName(gpName, items, batch) {
               
    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;
                   
    //Recupérer l'élément actif 
    var activeItem = formItemsGetItemByName(gpName, items);
    if (activeItem == null) {
        showErreurMsg("L'item de nom:'" + gpName + "' n'a pas été trouvé!");
        return;
    }
       
    if (activeItem.itemType != 'group') {        
        showErreurMsg("L'item de nom:'" + gpName + "' n'est pas un groupe!");
        return;
    }
    //Récupérer le parent de l'élément
    var activeItemParent = formItemsGetItemByName(gpName, items, true);
        
    var parentItems;
    if (activeItemParent === iamContentFormLayout || activeItemParent == null) {
        parentItems = iamHFDFormItems;
    } else {
        parentItems=activeItemParent.items;
    }

    //Intégrer tous les éléments du group dans le parent
    parentItems.push.apply(parentItems, activeItem.items.slice(0));

    //Retirer le groupe de son parent
    for (var i = parentItems.length - 1 ; i > -1; i--)
        if (parentItems[i].name == activeItem.name) {
            parentItems.splice(i, 1);
            break;
        }
        
    if (batch == null || batch == false) {
        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);
        iamContentFormLayout.repaint();

        //Vider la selection
        initSelection();
    }

     
}

//permet de creer un groupe dans le form autour de l'item sélectionné 
function formItemsCreateGroup(gpName, items, gpText, newWithoutSelection) {

    if (!gpName) {
        if (iamAutoCreateNames){
            //prendre automatiquement
            gpName = 'item_'+ new DevExpress.data.Guid().toString();
        }else{
            kendo.prompt("Saisir le nom de l'objet", null)
                .done(function (data) {
                    formItemsCreateGroup(data, items, gpText, newWithoutSelection);
                })
                .fail(function (data) {
                });
            return;
        }        
    }
       
    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //vérifier si le groupe existe déjà
    var gp = formItemsGetItemByName(gpName, items);
    if (gp){
        DevExpress.ui.notify({ message: "Un objet de nom:'" + gpName + "' existe déjà!", width: 400, shading: true }, "error", 1500);
        return null;
    }
       

    //Vérifier qu'un item est actif
    if (iamHFDSelectedItems.length > 0 || newWithoutSelection) {
                
        //Recupérer l'élément actif (premier de la sélection)
        var activeItem;

        if (newWithoutSelection) {
            //Nouveau groupe sans sélection alors créer un nouvel emptyItem qui permettra la création du groupe
            //Vider la selection
            initSelection();

            //créer le nouveau temptyItem
            activeItem = formItemsCreateEmptyItem('emptyItem_' + new DevExpress.data.Guid().toString(), items);

            //créer une nouvelle sélection ne contenant que le nouvel item
            iamHFDSelectedItems.push(activeItem.name);

        } else {
            activeItem = formItemsGetItemByName(iamHFDSelectedItems[0], items);
        }

        if (activeItem == null) {
            DevExpress.ui.notify({ message: "L'item de nom:'" + iamHFDSelectedItems[0] + "' n'a pas été trouvé!", width: 400, shading: true }, "error", 1500);
            return null;
        }

        //Récupérer le parent de l'élément
        var activeItemParent = formItemsGetItemByName(activeItem.name, items, true);
        
        var parentItems;
        if (activeItemParent === iamContentFormLayout || activeItemParent == null) {
            parentItems = iamHFDFormItems;
        } else {
            parentItems=activeItemParent.items;
        }

        
        //Créer le nouveau noeud (groupe)
        var newItem = {
            name: gpName,
            caption: "GROUP",
            colCount: 1,
            colSpan: 1,
            itemType: "group",
            iaType: 'dxGroupItem',
            items: parentItems.filter(function (el) { return iamHFDSelectedItems.includes(el.name); })
        };

        //Remplacer le caption par le texte passé s'il n'est pas vide
        if (gpText) newItem.caption = gpText;

        //recalculer le colCount et le colSpan en fonction des enfants
        for (var i = 0; i < newItem.items.length; i++) {
            if (newItem.items[i].colSpan && newItem.items[i].colSpan > newItem.colCount) {
                newItem.colCount = newItem.items[i].colSpan;
            }
            if (newItem.items[i].colSpan && newItem.items[i].colSpan > newItem.colSpan) {
                newItem.colSpan = newItem.items[i].colSpan;
            }
        }
            

        var index = -1;

        //Rechercher la position
        if (activeItem) {                        
            //prendre le plus petit index dans le parent devant contenir le groupe
            var index = -1;
            for (var i = 0; i < parentItems.length; i++)
                if (iamHFDSelectedItems.includes(parentItems[i].name)) {
                    index = i;                    
                    break;
                }
            //Rétirer les éléments groupés de leur parent d'origine
            for (var i = parentItems.length -1 ; i > -1; i--)
                if (iamHFDSelectedItems.includes(parentItems[i].name)) {
                    parentItems.splice(i, 1);
                }
            
            //Si l'index n'est pas retrouvé alors ajouter le groupe à la fin
            if (index == -1) {
                if (parentItems.length>0){
                    //Prendre la dernière position
                    index=parentItems.length-1;
                }else{
                    //prendre position 0
                    index =0;
                }
               
            } 
            //insérer le groupe à la bonne position
            parentItems.splice(index, 0, newItem);

            //recharger les items dans le form layout
            iamContentFormLayout.option("items", iamHFDFormItems);
            iamContentFormLayout.repaint();

            //Vider la selection
            initSelection();

           return newItem;
        }
                
        return null;

    }
}

//permet de retourner le nom d'un item depuis le jquery de click sur des zones liées à lui
function formItemsGetItemNameByDomElement(element) {
    //si le nom de l'objet est directement disponible alors le retourner
    var name = element.attr('name');
    if (name) return name;

    return null;
}

//permet de déplacer un item vers un groupe ou une tabulation 
function formItemsMoveItemToParent(parentItems, itemName, treeview) {

        //Vérifier qu'un item est actif
    if (itemName != "") {
        var items=iamHFDFormItems;
        var activeItem = formItemsGetItemByName(itemName, items);
        if (activeItem == null) {
            DevExpress.ui.notify({ message: "L'item de nom:'" + itemName + "' n'a pas été trouvé!", width: 400, shading: true }, "error", 2500);
            return;
        }

        var activeItemParent = formItemsGetItemByName(itemName, items, true);
        var parentItems;
        if (activeItemParent === iamContentFormLayout) {
            parentItems = iamHFDFormItems;
        } else {
            parentItems = activeItemParent.items;
        }

        //Si un libelé existe alors le placer au dessus
        if (activeItem) {
            parentItems.filter(function (el) { return el.name == itemName; })
            
            //retirer l'élément du parent            
            for (var i = 0; i < parentItems.length; i++)
                if (parentItems[i].name == itemName) {                    
                    parentItems.splice(i, 1);
                    break;
                }
            
            return;

        }
    }
}

//permet de changer déplacer l'item vers le haut ou le bas dans l'ordre du groupe dans lequel il est
function formItemsMoveItem(up_or_down) {
        
    //Vérifier qu'un item est actif
    if (iamHFDActiveItemName != "") {
        var items = iamHFDFormItems;

        var activeItem = formItemsGetItemByName(iamHFDActiveItemName, items);
        //Si un libelé existe alors le placer au dessus
        if (activeItem.visibleIndex != null) {
            if (up_or_down == 'down') {
                activeItem.visibleIndex += 1;
            } else {
                if (activeItem.visibleIndex > 0) activeItem.visibleIndex -= 1;
            }
                        
        } else {
            //Afficher en premiere position
            if (up_or_down == 'down') {
                //activeItem.visibleIndex = 0;
            } else {
                activeItem.visibleIndex = 0;
            }
            
        }

        //recharger les items dans le form layout
        iamContentFormLayout.option("items", items);
    }
}

//Permet de masquer ou afficher le caption ou text des items sélectionnés
function formItemsShowHideText(items) {

    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //Vérifier qu'une selection existe
    if (iamHFDSelectedItems.length > 0) {
        for (var i = 0 ; i < iamHFDSelectedItems.length; i++)
            formItemsShowHideTextByItemName(iamHFDSelectedItems[i], items, true);
    }

    //recharger les items dans le form layout
    iamContentFormLayout.option("items", iamHFDFormItems);
}

//Masquer afficher le caption d'un item depuis son nom
function formItemsShowHideTextByItemName(itemName, items, batch) {

    var activeItem = formItemsGetItemByName(itemName, items);

    if (activeItem == null) {
        showErreurMsg( "L'item de nom:'" + itemName + "' n'a pas été trouvé!");
        return;
    }

    if (activeItem.itemType == 'empty') return;

    //masquer afficher le caption des groupes
    if (activeItem.itemType == 'group') {
        if (activeItem.caption) {
            //créer la propriété text pour conserver le caption du groupe
            activeItem.text = activeItem.caption;
            activeItem.caption == '';
        } else {
            if (activeItem.text) {
                //Utiliser la propriété text manuellement créée précédemment pour restituer le caption du groupe
                activeItem.caption = activeItem.text;                
            } else {
                //prendre le nom comme caption
                activeItem.caption == activeItem.name;
            }
        }        
        
    } else {
        //masquer afficher pour les simpleItem
        if (activeItem.label != null) {
            if (activeItem.label.visible == null || activeItem.label.visible == true) {
                activeItem.label.visible = false;
            } else {
                activeItem.label.visible = true;
            }
           
        }
    }

    if (batch == null || batch == false) {
        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);       
    }

    
}

//permet de modifier le texte, le title ou caption d'un item tous les items sélectionnés
function formItemsModifyText(newText, items) {

    //Vérifier qu'une selection existe
    if (iamHFDSelectedItems.length > 0) {
        //Charger la liste des items du form Layout s'il ne sont passé en paramètres
        if (items == null) items = iamHFDFormItems;

        for (var i = 0 ; i < iamHFDSelectedItems.length; i++)
            formItemsModifyTextByItemName(newText, iamHFDSelectedItems[i], items, true);

        //recharger les items dans le form layout
        iamContentFormLayout.option("items", items);
    }
}

//permet de modifier le texte, le title ou caption d'un item depuis son nom
function formItemsModifyTextByItemName(newText, itemName, items, batch) {
        
    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    var activeItem = formItemsGetItemByName(itemName, items);
    if (activeItem == null) {
        DevExpress.ui.notify({ message: "L'item de nom:'" + itemName + "' n'a pas été trouvé!", width: 400, shading: true }, "error", 1500);
        return;
    }

    if (activeItem.itemType == 'empty') return;

    //modifier le caption des groupes
    if (activeItem.itemType == 'group') {
        activeItem.caption = newText;                     
    } else {

        if (activeItem.title != null) {
            //modifier pour les onglets des tabulations
            activeItem.title = newText;            
        } else {           
            //modifier pour les simpleItem
            if (activeItem.label != null) {
                activeItem.label.text = newText;                
            } else {
                activeItem.label = { text: newText };
            }
        }
    }        
        
    if (batch == null || batch == false) {
        //recharger les items dans le form layout
        iamContentFormLayout.option("items", iamHFDFormItems);
        //iamContentFormLayout.repaint();
    }
   
}

//permet de retourner le texte, le title ou caption de l'item sélectionné
function formItemsGetSelectedText(items) {

    //Vérifier qu'une selection existe
    if (iamHFDSelectedItems.length > 0) {
        //Charger la liste des items du form Layout s'il ne sont passé en paramètres
        if (items == null) items = iamHFDFormItems;

        return formItemsGetTextByItemName(iamHFDSelectedItems[0], items);
    }
    return "";
}

//permet de retourner le texte, le title ou caption d'un item depuis son nom
function formItemsGetTextByItemName(itemName, items) {

            //Charger la liste des items du form Layout s'il ne sont passé en paramètres
        if (items == null) items = iamHFDFormItems;

        var activeItem = formItemsGetItemByName(itemName, items);
        if (activeItem == null) {
            showErreurMsg("L'item de nom:'" + itemName + "' n'a pas été trouvé!");
            return "";
        }

        if (activeItem.itemType == 'empty') return "" ;

        //modifier le caption des groupes
        if (activeItem.itemType == 'group') {
            return activeItem.caption ;
        }

        if (activeItem.title != null) {
            //modifier pour les onglets des tabulations
            return activeItem.title ;
            
        } else {
            //modifier pour les simpleItem
            if (activeItem.label != null) {
                return activeItem.label.text;
                
            } else {
               return "";
            }
        }
            return "";
   
}

//permet de changer la position du libellé (text) du label de tous les items sélectionnés
function formItemsChangeTextLocation(location, items) {

    //Vérifier qu'une selection existe
    if (iamHFDSelectedItems.length > 0) {
        //Charger la liste des items du form Layout s'il ne sont passé en paramètres
        if (items == null) items = iamHFDFormItems;

        for (var i = 0 ; i < iamHFDSelectedItems.length; i++)
            formItemsChangeItemTextLocationByItemName(iamHFDSelectedItems[i], location , items, true);

        //recharger les items dans le form layout
        iamContentFormLayout.option("items", items);
    }
}

//permet de changer la position du libellé (text) du label d'un item depuis son nom
function formItemsChangeItemTextLocationByItemName(itemName, location, items, batch) {
    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    var activeItem = formItemsGetItemByName(itemName, items);
        //Si un libelé existe alors le placer au dessus
        if (activeItem.label) {
            activeItem.label.location = location;
            activeItem.label.visible = true;

            if (batch == null || batch == false) {
                //recharger les items dans le form layout
                iamContentFormLayout.option("items", items);
            }
            
        }    
}

//active ou  désactive la fonction obligatoire sur les items sélectionnés
function formItemsChangeObligatoire(items) {

    //Vérifier qu'une selection existe
    if (iamHFDSelectedItems.length > 0) {
        //Charger la liste des items du form Layout s'il ne sont passé en paramètres
        if (items == null) items = iamHFDFormItems;

        for (var i = 0 ; i < iamHFDSelectedItems.length; i++)
            formItemsChangeItemObligatoireByItemName(iamHFDSelectedItems[i], items, true);

        //recharger les items dans le form layout
        iamContentFormLayout.option("items", items);
    }
}

//active ou  désactive la fonction obligatoire sur un item depuis son nom
function formItemsChangeItemObligatoireByItemName(itemName, items, batch) {

    //Vérifier qu'un item est actif
    if (itemName != "") {
        //Charger la liste des items du form Layout s'il ne sont passé en paramètres
        if (items == null) items = iamHFDFormItems;

        var activeItem = formItemsGetItemByName(iamHFDActiveItemName, items);

        if (activeItem.itemType == 'group' || activeItem.itemType == 'tabbed' || activeItem.itemType == 'empty') return;

        //Si un libellé existe alors le placer au dessus
        if (activeItem.isRequired == true) {
            activeItem.isRequired = false;
        } else {
            activeItem.isRequired = true;
        }

        if (batch == null || batch == false) {
            //recharger les items dans le form layout
            iamContentFormLayout.option("items", items);
        }
    }
}

//Fonction permettant de retourner un item object en function de son nom ou l'objet parent si return_parent=true
function formItemsGetItemByName(itemName, items, return_parent) {

    if ( itemName == 'iamContentFormLayout') return iamContentFormLayout;

    var searchItem = null;
    //Charger la liste des items du form Layout s'il ne sont passé en paramètres
    if (items == null) items = iamHFDFormItems;

    //rechercher l'item depuis son nom
    items.some(function (item, index) {
        if (item.name == itemName) {
            if (return_parent) {
                searchItem = iamContentFormLayout;
            } else {
                searchItem = item;
            }            
            return true;
        }

        //Vérifier si c'est un group ou tab ayant des items
        if (item.items) {
            searchItem = formItemsGetItemByNameRecursive(item.items, itemName, searchItem, item, return_parent);
            if (searchItem != null) return true;
        }

        //Vérifier si c'est un tabbed et rechercher dans ses tabs
        if (item.tabs) {
            searchItem = formItemsGetItemByNameRecursive(item.tabs, itemName, searchItem, item, return_parent);
            if (searchItem != null) return true;
        }

        if (searchItem != null) return true;
    });

    //Retourner le searchItem
    return searchItem;
}


//Fonction recursive utilisée par formItemsGetItemByName permettant de retourner un item object en function de son nom dans les sous éléments par itération
// ou son parent
function formItemsGetItemByNameRecursive(itemsList, itemName, searchItem, parent_item, return_parent) {
        
   itemsList.some(function (item, index) {
       if (item.name == itemName) {
           if (return_parent) {
               searchItem = parent_item;
           } else {
                searchItem = item;
           }
           
           return true;
        }

        if (item.items) {
            searchItem = formItemsGetItemByNameRecursive(item.items, itemName, searchItem, item, return_parent);
            if (searchItem != null) return true;
        }

        if (item.tabs) {
            searchItem = formItemsGetItemByNameRecursive(item.tabs, itemName, searchItem, item, return_parent);
            if (searchItem != null) return true;
        }

        if (searchItem != null) return true;
   });

  return searchItem;
}

//fin fonctions Form items -------------------------------------------------------------------------------------------------------------------------------------------------------------


function customizeTreeMenuClick (sender_name, e) {
    var itemData = e.itemData;
    switch (itemData.id) {
        
        case "edit_item_properties": {
            break;
        }
        case "edit_controle_properties": {
            break;
        }
        case "create_group": {
            //iamContentFormLayoutTree
            formItemsCreateGroup(null, null);
            break;
        }
        case "create_tab": {
            formItemsCreateTab(null, null);
            break;
        }
        case "move_down": {
            formItemsMoveItem('down');
            break;
        }
        case "move_up": {
            formItemsMoveItem('up');
            break;
        }
        case "obligatoire": {
            formItemsChangeItemObligatoire();
            break;
        }
        case "delete_item": {
            var selectedNode = iamContentFormLayoutTree.select();
            iamContentFormLayoutTree.remove(selectedNode);
            break;
        }
        default: {
            Objet_Create(null, itemData.id, "iamContentFormLayout", null, true);
        }
    }
}