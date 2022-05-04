//const { GridStack } = require("../../../../../gridstack/dist/gridstack");

//import('../../../../../view-resources/Areas/App/Views/_Bundles/gridstack.min.js');
///alert('test2 !!!!!!!!!!');
var test;
$(function () {
    
    iamGridStack.init();
})


var iamGridStack = {
    //Id du container
    id:"iamdashboard",
    //Point d'entrée : initialisation du projet
    init: function () {
        const that = this;

        //Ajout du container dans le DOM
        $("#"+this.id).html(this.ui.initContainer());
        this.portal.options.editMode = $("#ia-gridstack-editmode").prop("checked");

        this.events.portal.editName(this.portal.name);

        //Initialisation des evenements
        this.initEvent();
        //Initialisation du rightPannel
        iamShared.ui.rightPanelCreate(null, false, null);

        
    },
    //initialisation des Evenemmnts du projet
    initEvent: function () {
        const that = this;
        const editmode = (e) => {
            that.events.portal.activeEditMode(e);
        };
        const editname = (e) => {
            
            if (iamGridStack.portal.options.editMode) {
                let name = $("#iamWidgetNameInput").val();
                that.events.portal.editName(name);
            }
            
        }

        $('[data-toggle="tooltip"]').tooltip();
        $("#ia-gridstack-editmode").prop("checked", false);

        

        const _portal = JSON.parse(localStorage.getItem("portal"));
        const _widgetModels = JSON.parse(localStorage.getItem("widgets")) ;

        if (!_portal) {
            iamGridStack.events.page.add("Page 1");
        } else {
            this.load(_portal);
        }
        iamGridStack.portal.models.widgets = _widgetModels || [];

       
        //Activer mode edition de widget
        this.createEvent($("#ia-gridstack-editmode"), {
            "ready":editmode,
            "change": editmode,
        });
        //Editer le nom du widget
        this.createEvent($("#iamWidgetNameSave"), {
            "click":editname,
        });
        


    },
    //Rafraichir
    refresh: function () {
        this.grids = GridStack.initAll();
        //this.methods.addOptions();
    },
    //Page Active
    activePagePositionId: null,
    //Les proprietes d'un portal
    portal: {
        id: iamShared.utils.guidString(),
        name:"Portal",
        //Les options d'un portal
        options: {
            editMode: false,
            float: false,
            resizeable: false,
            moveable:false,
        },
        models: {
            widgets: [],
        },
        pages: [],
    },
    //L'ensemble des grids
    grids: null,
    //Lier tous les evenemments d'un objet specifique
    bindTo: function (obj) {
        if (!obj) return;
        const that = this;


        switch (obj.type) {
            case "widget":
                const showToolbar = (e) => {
                    that.events.widget.showOptions(e);
                };
                const deleteWidget = (e) => {
                    that.events.widget.delete(e);
                };
                const editWidget = (e) => {
                    //iamGridStack.events.widget.showRightPanel(e);
                    const id = $(e.currentTarget).parent().parent().siblings(`[data-w-id]`).attr("data-w-id");
                    let widget = iamGridStack.actions.widget.get(id);
                    let pagePosition = iamGridStack.actions.page._getPosition(widget.pageId);
                    //iamWidget.widget.attributes.setAttributes(widget.skeleton, id, `[data-container-id="${id}"]`);
                    iamGridStack.portal.pages[pagePosition].widgets.forEach((widget) => {
                        if (widget.id==id) {
                            widget.data.showAttributesForm();
                            return;
                        }
                    });
                }
                const setBackgroundColor = (e) => {
                    iamGridStack.events.widget.setBackground(e);
                }
                const setOpacity = (e) => {
                    iamGridStack.events.widget.setOpacity(e);
                }
                const setDefaultWidgetBackgroundColor = (e) => {
                    const id = $(e.currentTarget).attr("data-color-id");
                    $(`[data-widget-id=${id}]`).find(".grid-stack-item-content").css({
                        "backgroundColor": "transparent",
                        "opacity": "1",
                    });
                    iamGridStack.actions.widget.set(id,
                        {
                        "bg": "transparent",
                        "opacity": "1",
                    });
                }

                //Afficher toolbar widget
                this.createEvent($(`.grid-stack-item:has([data-w-id="${obj.id}"])`), {
                    "mouseover": showToolbar,
                    "mouseout": showToolbar,
                });
                //Supprimer widget
                this.createEvent($(`[data-widget-id="${obj.id}"]`).find(".btn-delete-widget"), {
                    "click": deleteWidget,
                });
                //Afficher setting des parametres widget
                this.createEvent($(`.btn-setting-widget`), {
                    "click": editWidget,
                });
                //Modifier le background du widget
                this.createEvent($(`.color-input`), {
                    "change": setBackgroundColor,
                });
                //Modifier l'opacité du widget
                this.createEvent($(`.opacity-input`), {
                    "change": setOpacity,
                });
                //Modifier l'apparence du widget
                that.createEvent($(`.default-widget`), {
                    "click": setDefaultWidgetBackgroundColor,
                });

                break;
            case "page":
                const addPage = (e) => {

                    e.preventDefault();
                    const name = $("#PageNewInput").val();
                    if (name.trim() == "") return;

                    iamGridStack.events.page.add(name);
                    $("#PageNewInput").val("");
                }
                const renamePage = (e) => {

                    e.preventDefault();

                    iamGridStack.events.page.rename(e);
                }
                const deletePage = (e) => {
                    e.preventDefault();
                    e.stopPropagaton;
                    iamGridStack.events.page.delete(e);
                }
                const showSubHeader = (e) => {
                    that.events.portal.showToolBarSubHeader(e);
                }


                //ajouter page
                that.createEvent($("#ia-gridstack-add-page"), {
                    "click": addPage,
                });
                //renommer page
                that.createEvent($("#ia-gridstack-rename-page"), {
                    "click": renamePage,
                });
                //supprimer page
                that.createEvent($(".btn-delete-page"), {
                    "click": deletePage,
                });
                //Afficher setting des parametres widget
                that.createEvent($(`.btn-show-more-setting`), {
                    "click": showSubHeader,
                });

                break;
            case "portal":

                break;
            case "subheader":
                const addWidget = (e) => {
                    iamGridStack.events.widget.add({});
                };
                const openModal = (e) => {
                    iamGridStack.events.widget.showModal(e);
                };
                const compact = (e) => {
                    iamGridStack.events.widget.compact();
                };
                const importWidget = (e) => {
                    iamGridStack.events.widget.import(e);
                };
                const importPortal = (e) => {
                    iamGridStack.events.portal.import(e);
                };
                const exportPortal = (e) => {
                    iamGridStack.events.portal.export(e);
                };
                const savePortal = (e) => {
                    iamGridStack.events.portal.save(e);
                };
                const setDefaultBackgroundColor = (e) => {
                    const id = $(e.currentTarget).attr("data-color-id");
                    let color = $(e.currentTarget).val();
                    let widgets = iamGridStack.actions.widget.getAll();

                    widgets.forEach((widget) => {
                        $(`[data-widget-id=${widget.id}]`).find(".grid-stack-item-content").css({
                            "backgroundColor": "transparent",
                            "opacity": "1",
                        });
                        iamGridStack.actions.widget.set(widget.id, { "bg": "transparent", "opacity": "1", });
                    });
                }
                const setAllWidgetBG = (e) => {
                    iamGridStack.events.widget.setBackground(e);
                }

                //ajouter nouveau widget
                that.createEvent($(`#ia-gridstack-add-widget`), {
                    "click": addWidget,
                });
                //compacter les widgets
                that.createEvent($(`#ia-gridstack-compact-widget`), {
                    "click": compact,
                });
                //importer widget
                that.createEvent($(`#ia-gridstack-import-widget`), {
                    "click": importWidget,
                });
                //afficher modal de widget
                that.createEvent($(`#ia-gridstack-add-model`), {
                    "click":openModal,
                });
                //importer portal
                that.createEvent($(`#ia-gridstack-import`), {
                    "click": importPortal,
                });
                //exporter portal
                that.createEvent($(`#ia-gridstack-export`), {
                    "click": exportPortal,
                });
                //sauvegarder portal
                that.createEvent($(`#ia-gridstack-save`), {
                    "click": savePortal,
                });
                //Apparence par defaut de tous les widgets
                that.createEvent($(`[data-color-id="default"]`), {
                    "click": setDefaultBackgroundColor,
                });
                //Modifier le background de tous les widgets
                that.createEvent($(`[data-color-id="all"]`), {
                    "change": setAllWidgetBG,
                });


                break;
            case "modal":

                if (obj.for == "widget") {
                    const previewWidget = (e) => {
                        that.events.widget.preview(e);
                    }
                    const addWidget = (e) => {
                        const id = iamGridStack.events.widget.add({});
                        
                    };
                    const importWidget = (e) => {
                        iamGridStack.events.widget.import(e);
                        
                    };

                    //ajouter nouveau widget
                    that.createEvent($(`[data-id="add-new-widget"]`), {
                        "click": addWidget,
                    });
                    //Previsualiser widget
                    this.createEvent($(`[data-id="preview-id"]`), {
                        "click": previewWidget,
                    });
                    //importer widget
                    that.createEvent($(`[data-id="import-new-widget"]`), {
                        "click": importWidget,
                    });

                }

            default:
        }
    },
    //Chargement du projet
    load: function (portal) {
        if (!portal) return;
        const that = this;
        iamGridStack.portal = {
            ...portal,
            id: iamShared.utils.guidString(),
            options: {...iamGridStack.portal.options},
            pages: [],
    },
        
        portal.pages.forEach((page, i) => {
            that.events.page.add(page.name);
            page.widgets.forEach((widget) => {
                iamGridStack.actions.widget.build(widget,false);
            });
        });
        iamGridStack.actions.portal._binOptions();
        iamGridStack.events.portal.editName(portal.name);
    },
    //Créer l'evenement d'un element || selector : l'element sur lequel doit se declencher l'event, eventObj: l'ensemble des events qui seront lié à l'element
    createEvent: function (selector, eventObj) {
        for (const event in eventObj) {
            selector.on(event, eventObj[event]);
        }
    },
    //Tous les templates
    ui: {
        initContainer: function () {
            return `


        <div id="ia-gridstack-toolbar" class="mb-3">

                    <div class="card card-custom">
                                <div class="card-header card-header-tabs-line">
                                        <div class="card-toolbar">
                                            <ul class="nav nav-tabs nav-bold nav-tabs-line" role="tablist" id="pagesContainerId">
                                        
                                            </ul>
                                        </div>
                                        <div class="d-flex align-items-center" data-id="right-toolbar-id">
                                             
                                        </div>
                                </div>

        <div id="ia-gridstack-toolbar-more-setting"  style="display:none" class="">
                                {subheader}
        </div>
                    

        </div>
        </div>
        <div id="ia-gridstack-container" class="">

        </div>
        <div id="test" class="">

        </div>

<div class="modal fade" id="ia-modal" tabindex="-1" role="dialog" aria-labelledby="ia-modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document" data-container-id="modal-id">
        {modal-content}
    </div>
</div>
<div class="modal fade" id="preview-eye" tabindex="-1" role="dialog" aria-labelledby="preview-eye" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i aria-hidden="true" class="ki ki-close"></i>
                </button>
            </div>
            <div class="modal-body" id="preview-eye-content">
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>



`;
        },
        rightToolBar: function () {
            return `

                            <div class="d-flex align-items-center" data-id="gridstackTabsRight">
                                
                                
                                <div class="dropdown dropdown-inline mr-1" data-toggle="tooltip" title="Renommer la page">
                                                        <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn">
                                                        <i class="flaticon2-pen" style="font-size: 1.7rem;"></i>
                                                        </button>
                                                        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
                                                        
                                                            <div class="px-4 py-3">
                                                                <div class="form-group">
                                                                <label for="PageRenameInput">Page active</label>
                                                                <input type="text" class="form-control" id="PageRenameInput">
                                                                </div>
                                                                <button class="btn btn-block btn-sm btn-primary" id="ia-gridstack-rename-page">Renommer</button>
                                                            </div>
                                    </div>
                                </div>
                                <div class="dropdown dropdown-inline mr-1" data-toggle="tooltip" title="Créer nouvelle page">
                                                        <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn">
                                                        <i class="flaticon2-plus" style="font-size: 1.7rem;"></i>
                                                        </button>
                                                        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
                                                        
                                                            <div class="px-4 py-3">
                                                                <div class="form-group">
                                                                <label for="PageNewInput">Nouvelle page</label>
                                                                <input type="text" class="form-control" id="PageNewInput">
                                                                </div>
                                                                <button class="btn btn-block btn-sm btn-primary ml-0" id="ia-gridstack-add-page">Créer</button>
                                                            </div>
                                    </div>
                                </div>
                                <a href="#" class="btn btn-icon btn-light-danger btn-delete-page ml-2 mr-2" data-toggle="tooltip" title="Supprimer la page">
                                    <i class="flaticon2-rubbish-bin-delete-button icon-lg"></i>
                                </a>
                                <span class="mr-5 ml-5"></span>
                                <a href="#" class="font-weight-bold ml-2 btn-show-more-setting" data-toggle="tooltip" title="Dévélopper/Réduire">
                                    <i class="flaticon2-down" style="font-size: 1.0rem;"></i>
                                </a>

                                




                            </div> 


`;
        },
        subHeaderToolBar: function () {
            return `
<div role="alert"  class="alert mb-1 alert-custom alert-white alert-shadow fade show gutter-b d-flex justify-content-between" >

                                            <div class="d-flex align-items-center">
                                                <div class="alert-icon">
                                                    
									            </div>
                                                

                                                <div class="alert-icon">                        
						                        </div>


                                            </div>


                                            <div class="d-flex align-items-center">                    
                                                <div class="alert-icon" data-toggle="modal" id="ia-gridstack-add-model" data-target="#ia-modal">                        
                                                        <a href="#" class="font-weight-bold ml-2 mr-3" id="" >
                                                              <i class="flaticon2-plus-1" style="font-size: 1.7rem;"></i>
                                                        </a>									
                                                </div>

                                                <div class="alert-icon" data-toggle="tooltip" title="Ajouter widget" style="display:none;">                        
                                                        <a href="#" class="font-weight-bold ml-2 mr-3" id="ia-gridstack-add-widget" >
                                                              <i class="flaticon2-plus-1" style="font-size: 1.7rem;"></i>
                                                        </a>									
                                                </div>


                                                
                                                <div class="alert-icon" data-toggle="tooltip" title="Changer background de tous les widgets">                        
                                                        <div class="dropdown dropdown-inline" >
                                                                                <a href="#" class="btn-appearance-widget" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                    <i class="fas fa-paint-brush text-dark" style="font-size: 1.7rem;"></i>
                                                                                </a>
                                                                                <div class="dropdown-menu p-2">
                                                                                    <input class="form-control" type="color" value="#563d7c"  data-color-id="all"/>
                                                                                    <br/>
                                                                                    <button class="btn btn-block btn-sm btn-primary ml-0" data-color-id="default">Par défaut</button>
                                                                                </div>
                                                        </div>									
                                                </div>

                                                <div class="alert-icon" data-toggle="tooltip" title="Compacter">                        
                                                        <a href="#" class="font-weight-bold ml-2 mr-3" id="ia-gridstack-compact-widget" >
                                                              <i class="flaticon2-menu-2" style="font-size: 1.7rem;"></i>
                                                        </a>									
                                                </div>
                                                <div class="alert-icon" data-toggle="tooltip" title="Importer widget" style="display:none;">                        
                                                        <a href="#" class="font-weight-bold ml-2 mr-3" id="ia-gridstack-import-widget" >
                                                              <i class="fas fa-download" style="font-size: 1.7rem;"></i>
                                                        </a>									
                                                </div>

                                                <div class="alert-icon">                        
                                                          <div class="dropdown dropdown-inline">
                                                        <button type="button" class="btn btn-light-primary btn-icon btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i class="ki ki-bold-more-ver icon-lg"></i>
                                                        </button>
                                                        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(-5px, 32px, 0px); top: 0px; left: 0px; will-change: transform;">
                                                                <a class="dropdown-item" href="#" id="ia-gridstack-export">Exporter</a>
                                                                <a class="dropdown-item" href="#" id="ia-gridstack-import">Importer</a>
                                                                <br/>
                                                                <a class="dropdown-item" href="#" id="ia-gridstack-save">Enregister</a>
                                                        </div>
                                                        </div>									
                                               </div>


                                            </div>
</div>
`
        },
        gridstackContainer: function () {
            return `<div class="grid-stack newgrid" style="min-height:40vh;" data-grid-id=""></div>`;
        },
        pageTab: function (obj) {
            obj = obj || { name: "page 1" }
            return `
                                       <li class="nav-item pagetab newpagetab" data-page-id="">
                                            <a class="nav-link" data-toggle="tab" href="" role="tab">
                                                <span>${obj.name}</span>
                                            </a>
                                        </li>
`;
        },
        widgetOptionBar: function (obj) {
            return `
                    <div class="d-flex justify-content-end m-2 ia-widget-toolbar" style="height: 20px;z-index: 2;position: absolute;">
                        <div class="ia-widget-tb"  style="display:none">
                            <a href="#" class="btn-delete-widget mr-5">
                                  <i class="flaticon2-delete text-danger"></i>
                            </a>
                            <a href="#" class="btn-setting-widget mr-5" >
                                  <i class="flaticon2-settings text-dark"></i>
                            </a>
                            <div class="dropdown dropdown-inline mr-4" style="width:200px">
                                <a href="#" class="btn-appearance-widget mr-5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-paint-brush text-dark"></i>
                                </a>
                                <div class="dropdown-menu p-2">
                                    <span class="">Couleur</span>
                                    <input class="form-control color-input" type="color" value="#563d7c"  data-color-id="${obj.id}"/>
                                    <br/>
                                    <span class="">Opacité</span>
                                    <input class="form-control opacity-input" min="30" type="range" data-opacity-id="${obj.id}" />
                                    <button class="btn btn-block btn-sm btn-primary ml-0 default-widget" data-color-id="${obj.id}">Par défaut</button>

                                </div>
                            </div>

                       </div>
                    </div>
`;
        },
        widgetModal: function () {
            return `

                                                            <div class="modal-content" style="height: 700px;">
																	<div class="modal-header">
																		<h5 class="modal-title" id="exampleModalLabel">Modèle de widget</h5>
																		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
																			<i aria-hidden="true" class="ki ki-close"></i>
																		</button>
																	</div>
																	<div class="modal-body row">
																		<div class="col-6" style="height:500px" data-id="widget-list-container-id">
                                                                        
                                                                        </div>
                                                                        <div style="min-height:500px" class="col-6 " data-id="preview-container-id">
                                                                            <div class=" d-flex align-items-center justify-content-between" style="height:15%">
                                                                                <span class="font-size-h2 font-weight-boldest" data-id="preview-title-id"></span>
                                                                                <a href="#" data-id="preview-id" style="display:none;" data-toggle="modal" data-target="#preview-eye"><i class="fa fa-eye text-dark icon-xl"></i></a>
                                                                            </div>
                                                                            
                                                                            <div class=" text-wrap" data-id="preview-description-id" style="height:25%"></div>
                                                                        </div>
																	</div>
																	<div class="modal-footer" >
                                                                        <a href="#" class="btn btn-light-dark mr-10" data-id="import-new-widget" data-toggle="tooltip" title="Ajouter widget">
                                                                            <i class="fas fa-download"></i> Importer
                                                                        </a>
																		<button type="button" class="btn btn-light-danger font-weight-bold" data-dismiss="modal">Annuler</button>
																		<button type="button" class="btn btn-primary font-weight-bold" data-dismiss="modal" style="display:none" data-id="add-new-widget">Ajouter</button>
																	</div>
																</div>

`
        },
        widgetPreview: function () {
            return `
                
`
        }

    },
    //Liste des actions (methodes specifiques)
    actions: {
        page: {
            //Modifier les proprietes d'une page
            set: function (id,obj) {
                
                const i = iamGridStack.actions.page._getPosition(id);
                iamGridStack.portal.pages[i] = { ...iamGridStack.portal.pages[i],...obj};
            },
            //Obtenir toutes les pagees
            getAll: function () {
                return iamGridStack.portal.pages;
            },
            //Obtenir une page à partir de son Id
            get: function (id) {
                const i = iamGridStack.actions.page._getPosition(id);
                return iamGridStack.portal.pages[i];
            },
            //Supprimer une page
            delete: function (id) {
                iamGridStack.portal.pages = iamGridStack.portal.pages.filter(page => page.id != id);
            },
            //Ajouter une page
            add: function (o) {
                let obj = {
                    id: o.id,
                    name: o.name,
                    widgets: [],
                    positionId: iamGridStack.portal.pages.length,
                };
                iamGridStack.portal.pages.push(obj);
                iamGridStack.activePagePositionId = obj.positionId;
                return obj;
            },
            //Afficher une page
            show: function (id) {

                $(`[data-grid-id]`).hide();
                $(`[data-grid-id="${id}"]`).show();
                iamGridStack.activePagePositionId = iamGridStack.actions.page._getPosition(id);
            },
            //Rendre la page active
            setToActive: function (id) {
                $("[data-page-id] > a").removeClass("active").attr("aria-selected", "false");
                $(`[data-page-id="${id}"] > a`).addClass("active").attr("aria-selected", "true");
                iamGridStack.actions.page.show(id);
                $("#PageRenameInput").val(iamGridStack.portal.pages[iamGridStack.activePagePositionId].name);

            },
            //Renommer page
            rename: function (name) {
                iamGridStack.portal.pages[iamGridStack.activePagePositionId].name = name;
            },
            //Obtenir l'id de chaque page créée
            _bindId: function () {
                let classes = $(".newgrid").attr("class").split(" ");
                let classInstance = classes.filter(el => el.includes("grid-stack-instance"));
                const id = classInstance[0].substr(20);
                const pageSelector = $(".newpagetab");
                const gridSelector = $(".newgrid");

                pageSelector.attr("data-page-id", id).removeClass("newpagetab");
                gridSelector.attr("data-grid-id", id).removeClass("newgrid");

                return id;
            },
            //Obtenir la position de la page
            _getPosition: function (id) {
                return iamGridStack.portal.pages.findIndex(el => el.id === id)
            },
        },
        widget: {
            set: function (id,obj) {
                let widget = iamGridStack.actions.widget.get(id);
                const i = iamGridStack.actions.page._getPosition(widget.pageId);
                const j = iamGridStack.actions.widget._getPosition(widget.id);
                iamGridStack.portal.pages[i].widgets[j] = { ...iamGridStack.portal.pages[i].widgets[j], ...obj };
                //iamGridStack.portal.pages[i] = { ...iamGridStack.portal.pages[i], ...obj };
                //iamGridStack.portal.pages[i].widgets.forEach((el,j) => {
                //    if (el.id==id) {
                //        iamGridStack.portal.pages[i].widgets[j] = { ...el, ...obj };
                //        return;
                //    }
                //});
            },
            getAll: function () {
                let widgets = [];
                iamGridStack.portal.pages.forEach((page) => {
                    widgets = [...widgets, ...page.widgets];
                });
                return widgets;
            },
            get: function (id) {
                const widgets = iamGridStack.actions.widget.getAll();
                const widget = widgets.find(el => el.id == id);
                return widget;
            },
            getPageId: function (id) {
                const widgets = iamGridStack.actions.widget.getAll();
                const widget = widgets.find(el => el.id == id);
                return widget.pageId;
            },
            getModel: function (id) {
                const models = iamGridStack.portal.models.widgets
                const modelID = models.find((widget) => widget.id == id);
                return modelID;
            },
            delete: function (id) {
                const pageId = iamGridStack.actions.widget.getPageId(id);
                const i = iamGridStack.actions.page._getPosition(pageId);
                const newWidgetList = iamGridStack.portal.pages[i].widgets.filter(widget => widget.id != id);
                iamGridStack.portal.pages[i].widgets = newWidgetList;
            },
            add: function (obj) {
                
                let pageWidgets = iamGridStack.actions.page.get(obj.pageId).widgets;
                iamGridStack.actions.page.set(obj.pageId, {
                    widgets: [...pageWidgets, obj]
                })
            },
            //Construire un widget à partir d'un objet
            build: function (widget,isCreation=true) {
                const id = new Date().getTime() + "";               
                const obj = {
                    id,
                    ...widget,
                    isCreation:true,
                }

                iamGridStack.events.widget.add(obj);
                
                iamGridStack.refresh();
                return id;
            },
            //Formater les données pour le DataGrid
            _toDataGridSource: function (properties,arr) {
                let widgets = arr || iamGridStack.portal.models.widgets;
                let propertyToShow = properties || {};
                let dataGridSource = [];
                widgets.forEach((widget) => {
                    dataGridSource.push({});

                    for (var i in propertyToShow) {
                        dataGridSource[dataGridSource.length - 1][propertyToShow[i]] = widget[i];
                    }
                });
                return dataGridSource;
            },
            //Obtenir la position du widget dans sa page
            _getPosition: function (id) {
                let widget = iamGridStack.actions.widget.get(id);
                let pagePosition = iamGridStack.actions.page._getPosition(widget.pageId);
                return iamGridStack.portal.pages[pagePosition].widgets.findIndex(el => el.id === id)
            },
        },
        portal: {
            export: function () {
                iamGridStack.portal.pages.forEach((page, i) => {
                    page.widgets.forEach((widget, j) => {
                        const el = $(`[data-w-id="${widget.id}"]`).parent().parent();
                        const position = {
                            x: el.attr("gs-x"),
                            y: el.attr("gs-y"),
                            h: el.attr("gs-h"),
                            w: el.attr("gs-w"),
                        }
                        iamGridStack.portal.pages[i].widgets[j] = { ...widget, ...position };
                        iamGridStack.portal.pages[i].widgets[j].data = widget.data.toJsonObject();
                    });
                });
                iamShared.files.stringToFileDownload("Portal_" + iamGridStack.portal.id + ".json", JSON.stringify(iamGridStack.portal));
            },
            import: function () {
                iamGridStack.actions.importFromJSON((portal) => {

                    $("#ia-gridstack-container, #pagesContainerId").html("");
                    
                    iamGridStack.load(portal);
                    iamShared.messages.showSuccessMsg("Imported");
                });
            },
            save: function (portal) {

                const _portal = JSON.stringify(portal);
                localStorage.setItem("portal", _portal);
            },
            set: function (obj) {
                iamGridStack.portal = { ...iamGridStack.portal, ...obj };
            },
            _binOptions: function () {
                iamGridStack.portal.options.editMode ? $("#iamWidgetBtnEditWidgetName").show() : $("#iamWidgetBtnEditWidgetName").hide() ;
                iamGridStack.portal.pages.forEach((el, i) => {
                    iamGridStack.grids[i].enableMove(iamGridStack.portal.options.editMode);
                    iamGridStack.grids[i].enableResize(iamGridStack.portal.options.editMode);
                    iamGridStack.grids[i].float(iamGridStack.portal.options.float);
                    
                });
            }
        },
        model: {
            set: function (id,obj) {
                iamGridStack.portal.models.widgets.forEach((el,i) => {
                    if (el.id == id) {
                        iamGridStack.portal.models.widgets[i] = { ...iamGridStack.portal.models.widgets[i], ...obj };
                        return
                    }
                });
            },
            get: function (id) {
                return iamGridStack.portal.models.widgets.find((el) => el.id == id);
            },
            delete: function (id) {
                iamGridStack.portal.models.widgets = iamGridStack.portal.models.widgets.filter((el) => el.id != id);
            },
            add: function (obj) {
                if (obj) iamGridStack.portal.models.widgets.push(obj);   
            },
        },
        //Fonction d'import de JSON
        importFromJSON: function (resolve, reject) {
            //alert('import');
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
                    resolve(widget);
                }
            }

            input.click();
        },
    },
    //L'ensemble de tous les evenemments
    events: {
        page: {
            //
            delete: function (e) {
                //e.preventDefault();
                

                if (iamGridStack.portal.pages.length == 1) return;
                const id = iamGridStack.portal.pages[iamGridStack.activePagePositionId].id;
                const pageIndex = iamGridStack.activePagePositionId;
                let newId = iamGridStack.actions.page._getPosition(id);


                iamGridStack.grids[iamGridStack.activePagePositionId].destroy();
                $(`[data-page-id="${id}"]`).remove();
                

                if (pageIndex == 0) {
                    newId = iamGridStack.portal.pages[1].id;
                }
                else {
                    newId = iamGridStack.portal.pages[iamGridStack.activePagePositionId - 1].id;     
                }
                iamGridStack.actions.page.setToActive(newId);
                iamGridStack.actions.page.delete(id);
                iamGridStack.refresh();
                iamGridStack.portal.pages.forEach((el, i) => {
                    el.positionId = i;
                });
            },
            add: function (name) {
                let id;
                $("#pagesContainerId").append(iamGridStack.ui.pageTab({ name: name }));
                $("#ia-gridstack-container").append(iamGridStack.ui.gridstackContainer());

                iamGridStack.refresh();
                id = iamGridStack.actions.page._bindId();
                iamGridStack.actions.page.add({
                    id, name,
                })

                const showPage = (e) => {
                    const selector = $(e.currentTarget);
                    const id = selector.attr("data-page-id");

                    iamGridStack.actions.page.setToActive(id);
                }
                //Afficher la page
                iamGridStack.createEvent($(`[data-page-id="${id}"]`), {
                    "click": showPage,
                });
                $(`[data-page-id="${id}"]`).trigger("click");

               // iamGridStack.methods.addOptions();
            },
            rename: function (e) {
                const name = $("#PageRenameInput").val();
                if (name.trim() == "") return;
                const id = iamGridStack.portal.pages[iamGridStack.activePagePositionId].id;

                iamGridStack.actions.page.rename(name);
                $(`[data-page-id="${id}"]`).find("a").html(name);

            },
        },
        widget: {
            //Supprimer widget
            delete: function (e) {
                const id = $(e.currentTarget).parent().parent().siblings(`[data-w-id]`).attr("data-w-id");
                iamGridStack.grids[iamGridStack.activePagePositionId].removeWidget($(`[data-widget-id="${id}"]`)["0"]);
                iamGridStack.actions.widget.delete(id);
            },
            //Ajouter Widget
            add: function (obj)     {
                const contentHtml = obj.content || "";
                const id = obj.id || new Date().getTime() + "";
                const content = `<span data-w-id="${id}"></span>` + iamGridStack.ui.widgetOptionBar({id}) + `<div style="height:100%" id="${id}" class="d-flex flex-column align-items-center justify-content-center" data-container-id=${id}>${contentHtml}</div>`;
                const widget = {
                    id: id,
                    pageId: iamGridStack.portal.pages[iamGridStack.activePagePositionId].id,
                    content: content,
                    type: "widget",
                    data: obj.data || null,
                    x: obj.x || null,
                    y: obj.y || null,
                    w: obj.w || 3,
                    h: obj.h || 3,
                    bg: obj.bg || "transparent",
                    opacity:obj.opacity || "1"
                };

                
                iamGridStack.grids[iamGridStack.activePagePositionId].addWidget({
                    h: widget.h,
                    w: widget.w,
                    x: widget.x,
                    y: widget.y,    


                    content: widget.content || "",
                });


                
                iamGridStack.actions.widget.add(widget);
                $(`.grid-stack-item:has([data-w-id="${id}"])`).attr("data-widget-id", id);

                $(`[data-widget-id=${id}]`).find(".grid-stack-item-content").css("backgroundColor", widget.bg);
                $(`[data-widget-id=${id}]`).find(".grid-stack-item-content").css("opacity", widget.opacity);

                iamGridStack.bindTo(widget);
                let modelId = $(`[data-id="preview-id"]`).attr("data-model-id") || widget.data.modelId;
                const modelList = iamGridStack.portal.models.widgets;
                if (obj.isCreation) {
                    iamGridStack.actions.widget.set(widget.id, {
                        data: iamWidgetObject.fromJsonObject(obj.data, modelList),
                    })
                } else {
                    widget.data = new iamWidgetObject(id, iamGridStack.actions.widget.getModel(modelId), { id });
                }
                return id;
            },
            //Importer Widget
            import: function (e) {
                
                
                const buildWidget = (widget) => {
                    iamGridStack.portal.models.widgets = iamGridStack.portal.models.widgets || JSON.parse(localStorage.getItem("widgets")) || [];
                    
                    delete widget.attributesVal;
                    iamGridStack.actions.model.add(widget);
                    
                    const _widgets = JSON.stringify(iamGridStack.portal.models.widgets);
                    localStorage.setItem("widgets", _widgets);

                    iamGridStack.events.widget.showModal(e);
                }
                iamGridStack.actions.importFromJSON(buildWidget);
            },
            //Montrer les options sur le widget
            showOptions: function (e) {
                if (iamGridStack.portal.options.editMode) {
                    let selector = $(e.currentTarget).find(".ia-widget-tb");
                    selector.toggle();
                };
            },
            showRightPanel: function (e) {
                const id = $(e.currentTarget).parent().parent().siblings(`[data-w-id]`).attr("data-w-id");
                let widget = iamGridStack.actions.widget.get(id);
                iamShared.ui.rightPanelShow();
                iamQF.createForm(widget.objectQF, widget.skeleton.attributesVal, true, "rightpanel", true, null, null, true, true, null);
            },
            //Compacter les widgets
            compact: function (e) {
                iamGridStack.grids[iamGridStack.activePagePositionId].compact();
            },
            //Afficher le modal 
            showModal: function (e) {
                let src = iamGridStack.actions.widget._toDataGridSource({
                    "id": "Id",
                    "name": "Name",
                    "entityId": "Date",
                });
                let modal = iamGridStack.ui.widgetModal();
                
                $(`[data-container-id="modal-id"]`).html(modal);
                $(`[data-id="widget-list-container-id"]`).dxDataGrid(
                    {
                        dataSource:src,
                        showBorders: true,
                        editing: {
                            mode: 'row',
                            allowUpdating: true,
                            allowDeleting: true,
                        },
                        columns: [
                            {
                                dataField: "Id",
                                caption: app.localize("Id"),
                                visible:false,
                            },
                            {
                                dataField: "Name",
                                caption: app.localize("Name"),
                            },
                            {
                                dataField: "Date",
                                caption: app.localize("Date"),
                            },
                            {
                                caption: app.localize("Actions"),
                                type: 'buttons',
                                buttons: [
                                    {
                                        hint: 'Remove',
                                        icon: 'remove',
                                        visible(e) {
                                            return true;
                                        },
                                        onClick(e) {
                                            const id = e.row.key;
                                            iamGridStack.actions.model.delete(id);
                                            iamGridStack.events.widget.showModal(e)
                                        },
                                    }
                                ],
                            },
                        ],
                        hoverStateEnabled: true,
                        keyExpr: "Id",
                        columnFixing: { enabled: false },
                        focusedRowEnabled: true,
                        focusedRowKey: -1,
                        onFocusedRowChanged: function (e) {
                            const id = e.row.key;
                            const widgetModel = iamGridStack.portal.models.widgets.find((widget) => widget.id == id);
                            let html = widgetModel.template.html;
                            selectedRowData = e.data;

                            $(`[data-id="preview-id"]`).attr("data-model-id", id).show();
                            $(`[data-id="add-new-widget"]`).show();
                            $(`[data-id="preview-content-id"]`).children().addClass("shadow-lg");
                            $(`[data-id="preview-title-id"]`).html(widgetModel.name);
                            $(`[data-id="preview-description-id"]`).html(widgetModel.description);
                        },
                        rowAlternationEnabled: true,
                        showBorders: true,
                        showColumnHeaders: true,
                        showRowLines: true,
                    }
                );

                

                iamGridStack.bindTo({
                    type: "modal",
                    for:"widget",
                })
            },
            //Prévisualisation du widget
            preview: function (e) {
                const id = $(e.currentTarget).attr("data-model-id");
                
                const widgetModel = iamGridStack.portal.models.widgets.find((widget) => widget.id == id);
                let wid = new iamWidgetObject("preview-eye-content", widgetModel);
                
            },
            setBackground: function (e) {
                const id = $(e.currentTarget).attr("data-color-id");
                let color = $(e.currentTarget).val();
                if (id == "all") {
                    let widgets = iamGridStack.actions.widget.getAll();
                    widgets.forEach((widget) => {
                        $(`[data-widget-id=${widget.id}]`).find(".grid-stack-item-content").css("backgroundColor", color);
                        iamGridStack.actions.widget.set(widget.id, { "bg": color });
                    });
                } else {
                    
                    $(`[data-widget-id=${id}]`).find(".grid-stack-item-content").css("backgroundColor", color);
                    iamGridStack.actions.widget.set(id, { "bg": color });
                }
                
            },
            setOpacity: function (e) {
                const id = $(e.currentTarget).attr("data-opacity-id");
                let opacity = $(e.currentTarget).val();
                $(`[data-widget-id=${id}]`).find(".grid-stack-item-content").css("opacity", opacity*0.01);
                iamGridStack.actions.widget.set(id, { opacity });
            }
        },
        portal:  {
            //Activer mode d'édition 
            activeEditMode: function (e) {
                iamGridStack.portal.options.editMode = $(e.currentTarget).prop("checked"); 

                if (iamGridStack.portal.options.editMode) {
                    $(`[data-id="right-toolbar-id"]`).html(iamGridStack.ui.rightToolBar());
                    iamGridStack.bindTo({ type: "page" });
                    $("#PageRenameInput").val(iamGridStack.portal.pages[iamGridStack.activePagePositionId].name);

                }
                else {
                    $(`[data-id="right-toolbar-id"], #ia-gridstack-toolbar-more-setting`).html("");
                }

                iamGridStack.actions.portal._binOptions();

            },
            //Montrer les options d'editions
            showToolBarSubHeader: function (e) {
                $(".btn-show-more-setting > i").toggleClass("flaticon2-up");
                $(".btn-show-more-setting > i").toggleClass("flaticon2-down");
                if ($(".btn-show-more-setting > i").hasClass("flaticon2-up")) {
                    $("#ia-gridstack-toolbar-more-setting").html(iamGridStack.ui.subHeaderToolBar()).show();   
                    iamGridStack.bindTo({ type: "subheader" });
                }
                else {
                    $("#ia-gridstack-toolbar-more-setting").html("").hide();
                }
            },
            //Editer le nom de portal
            editName: function (name) {
                
                iamGridStack.actions.portal.set({ name });
                $("#iamWidgetName").html(name);
            },
            //Importer le portal
            import: function (e) {
                iamGridStack.actions.portal.import();
                
            },
            //Exporter le portal
            export: function (e) {

                iamGridStack.actions.portal.export();
            },
            //Sauvegarder le portal
            save: function (e) {
                let portal = iamGridStack.portal;
                portal.pages.forEach((page, i) => {
                    page.widgets.forEach((widget, j) => {
                        const el = $(`[data-w-id="${widget.id}"]`).parent().parent();
                        const position = {
                            x: el.attr("gs-x"),
                            y: el.attr("gs-y"),
                            h: el.attr("gs-h"),
                            w: el.attr("gs-w"),
                        }
                        portal.pages[i].widgets[j] = { ...widget, ...position };
                        portal.pages[i].widgets[j].data = widget.data.toJsonObject();
                    });
                });
                //iamGridStack.portal.options.editMode = false;
                iamGridStack.actions.portal.save(portal);
                iamGridStack.portal.options.editMode = true;
                iamGridStack.actions.portal._binOptions();
                iamShared.messages.showSuccessMsg("Saved");
            },
        }
    }
}





















