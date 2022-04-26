﻿//const { GridStack } = require("../../../../../gridstack/dist/gridstack");

//import('../../../../../view-resources/Areas/App/Views/_Bundles/gridstack.min.js');
///alert('test2 !!!!!!!!!!');
var test;
$(function () {
    
    iamGridStack.init();
})


var iamGridStack2 = {
    build: function () {
        const that = this;

        //Ajout du container dans le DOM
        $("#iamdashboard").html(that.templateHtml.initContainer());

        //Ajout de la 1ere page par défaut
        iamGridStack.events.addNewPage("Page 1");

    },
    init: function () {
        let items = [
            { x: 0, y: 0, w: 4, h: 2, content: '1' },
            { x: 4, y: 0, w: 4, h: 4, content: '2' },
            { x: 8, y: 0, w: 2, h: 2, content: '<p class="card-text text-center" style="margin-bottom: 0">Drag me!<p class="card-text text-center"style="margin-bottom: 0"><ion-icon name="hand" style="font-size: 300%"></ion-icon><p class="card-text text-center" style="margin-bottom: 0">' },
            
        ];
        //this.grid = GridStack.init();

        this.build();

       
        //grid.load(items);

        //GridStack.initAll()

        //grid.on('added removed change', function (e, items) {
        //    let str = '';
        //    items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
        //    console.log(e.type + ' ' + items.length + ' items:' + str);
        //});


        this.initEvent();


        //iamGridStack.refresh();
        //iamGridStack.methods.bindId();

        iamShared.ui.rightPanelCreate(null, false, null);
        //iamShared.ui.wizardPopupHtmlCreate();
        //iamShared.ui.popupWithIframeCreate();
        
    },
    initEvent: function () {
        const that = this;
        const addNewpage = (e) => {
            const name = $("#PageRenameInput").val();
            that.events.addNewPage(name);
            $("#PageRenameInput").val("");
        };
        const addNewWidget = (e) => {
            that.events.addNewWidget(null);
        };
        const toggleMoreSetting = (e) => {
            that.events.showMoreSetting(e);
        };
        const renamePage = (e) => {
            that.events.renamePage(e);
        }
        const deletePage = (e) => {
            that.events.deletePage(e);
        }
        const importWidget = (e) => {
            that.events.importWidget(e);
        }
        const editmode = (e) => {
            that.events.editMode(e);
        };
        const exportGrid = (e) => {
            iamGridStack.exportGrids();
        };
        const importGrid = (e) => {
            iamGridStack.events.importGrid(e);
        };

        $('[data-toggle="tooltip"]').tooltip();
        $("#ia-gridstack-editmode").prop("checked",false);
        //Ajouter une nouvelle page
        this.createEvent($("#ia-gridstack-add-page"), {
            "click": addNewpage,
        });
        //Supprimer page
        this.createEvent($(".btn-delete-page"), {
            "click": deletePage,
        });
        //Ajouter une nouveau widget
        this.createEvent($("#ia-gridstack-add-widget"), {
            "click": addNewWidget,
        });
        //Afficher ou masque les options
        this.createEvent($(".btn-show-more-setting"), {
            "click": toggleMoreSetting,
        });
        //Renommer page
        this.createEvent($("#ia-gridstack-rename-page"), {
            "click": renamePage,
        });
        //Importer widget
        this.createEvent($("#ia-gridstack-import-widget"), {
            "click": importWidget,
        });
        //Activer mode edition de widget
        this.createEvent($("#ia-gridstack-editmode"), {
            "change": editmode,
        });
        //Exporter le projet
        this.createEvent($("#ia-gridstack-export"), {
            "click": exportGrid,
        });
        //Importer le projet
        this.createEvent($("#ia-gridstack-import"), {
            "click": importGrid,
        });
    },
    refresh: function () {
        this.grids = GridStack.initAll();
        this.methods.addOptions();
    },
    grids: null,
    options: {
        editMode: false,
        float:false
    },
    pages: [],
    widgets: [],
    currentPage:0,
    items : [
        { x: 0, y: 0, w: 4, h: 2, content: '1' },
        { x: 4, y: 0, w: 4, h: 4, content: '2' },
    ],
    //Créer l'evenement d'un element || selector : l'element sur lequel doit se declencher l'event, eventObj: l'ensemble des events qui seront lié à l'element
    createEvent: function (selector, eventObj) {
        for (const event in eventObj) {
            selector.on(event, eventObj[event]);
        }
    },
    //Tous les templates
    templateHtml: {
        initContainer: function () {
            return `


        <div id="ia-gridstack-toolbar" class="mb-3">

                    <div class="card card-custom">
                                <div class="card-header card-header-tabs-line">
                                        <div class="card-toolbar">
                                            <ul class="nav nav-tabs nav-bold nav-tabs-line" role="tablist" id="pagesContainerId">
                                        
                                            </ul>
                                        </div>
                                        <div class="d-flex align-items-center">
                                             {tool-bar-right}
                                        </div>
                                </div>

        <div id="ia-gridstack-toolbar-more-setting" style="display:none;" class="isNotEditMode">
                                <div role="alert"  class="alert mb-1 alert-custom alert-white alert-shadow fade show gutter-b d-flex justify-content-between" >

                                            <div class="d-flex align-items-center">
                                                <div class="alert-icon">
                                                    
									            </div>
                                                

                                                <div class="alert-icon">                        
						                        </div>


                                            </div>


                                            <div class="d-flex align-items-center">                    
                                                <div class="alert-icon" data-toggle="tooltip" title="Ajouter widget">                        
                                                        <a href="#" class="font-weight-bold ml-2 mr-3" id="ia-gridstack-add-widget" >
                                                              <i class="flaticon2-plus-1" style="font-size: 1.7rem;"></i>
                                                        </a>									
                                                </div>
                                                <div class="alert-icon" data-toggle="tooltip" title="Importer widget">                        
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
                                                        </div>
                                                        </div>									
                                               </div>


                                            </div>
                                </div>
        </div>
                    

        </div>
        </div>
        <div id="ia-gridstack-container" class="">

        </div>
        <div id="test" class="">

        </div>

<!-- Modal-->
<div class="modal fade" id="ia-modal-widget-setting" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            



<div class="modal-header">
    <h5 class="modal-title">Paramètres</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <i aria-hidden="true" class="ki ki-close"></i>
    </button>
</div>
<div class="modal-body" id="modal-test">
    <p>Modal body text goes here.</p>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Enregistrer</button>
</div>



        </div>
    </div>
</div>








`.replace("{tool-bar-right}", iamGridStack.templateHtml.gridstackTabsRight());
        },
        gridstackTabsRight: function () {
            return `

                            <div class="d-flex align-items-center isNotEditMode" data-id="gridstackTabsRight">
                                
                                
                                <div class="dropdown dropdown-inline mr-1">
                                                        <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn">
                                                        <i class="fas fa-stream" style="font-size: 1.7rem;"></i>
                                                        </button>
                                                        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
                                                        
                                                            <div class="px-4 py-3">
                                                                <div class="form-group">
                                                                <label for="PageRenameInput">Nom de la page</label>
                                                                <input type="text" class="form-control" id="PageRenameInput">
                                                                </div>
                                                                <button class="btn btn-block btn-sm btn-primary" id="ia-gridstack-rename-page">Renommer</button>
                                                                <button class="btn btn-block btn-sm btn-primary ml-0" id="ia-gridstack-add-page">Créer nouveau</button>
                                                            </div>
                                    </div>
                                </div>
                                <a href="#" class="btn btn-icon btn-light-danger btn-delete-page ml-2 mr-2" data-toggle="tooltip" title=Supprimer la page">
                                    <i class="flaticon2-rubbish-bin-delete-button icon-lg"></i>
                                </a>
                                <span class="mr-5 ml-5"></span>
                                <a href="#" class="font-weight-bold ml-2 btn-show-more-setting" data-toggle="tooltip" title="Dévélopper/Réduire">
                                    <i class="flaticon2-down" style="font-size: 1.0rem;"></i>
                                </a>

                                




                            </div> 


`;
        },
        gridstackContainer: function () {
            return `<div class="grid-stack newgrid" style="min-height:40vh;" data-grid-id=""></div>`;
        },
        pageTab: function (obj) {
            obj = obj || {name:"page 1"}
            return `
                                       <li class="nav-item newpagetab" data-page-id="">
                                            <a class="nav-link" data-toggle="tab" href="" role="tab">
                                                ${obj.name}
                                            </a>
                                        </li>
`;
        },
        widgetOptionBar: function () {
            return `
                    <div class="d-flex justify-content-end m-2 ia-widget-toolbar" style="height: 20px;z-index: 2;position: absolute;">
                            <a href="#" class=" btn-delete-widget mr-5" style="display:none" >
                                  <i class="flaticon2-delete text-danger"></i>
                            </a>
                            <a href="#" class="btn-setting-widget mr-5" style="display:none" >
                                  <i class="flaticon2-settings text-dark"></i>
                            </a>
                    </div>
`;
        },
        //data-toggle="modal" data-target="#ia-modal-widget-setting"
    },
    methods: {
        //Obtebir l'id de chaque page créée
        bindId: function () {
            let classes = $(".newgrid").attr("class").split(" ");
            let classInstance = classes.filter(el => el.includes("grid-stack-instance"));
            const id = classInstance[0].substr(20);
            const pageSelector = $(".newpagetab");
            const gridSelector = $(".newgrid");

            pageSelector.attr("data-page-id", id).removeClass("newpagetab");
            gridSelector.attr("data-grid-id", id).removeClass("newgrid");

            return id;
        },
        //Rendre la page active
        setToActive: function (id) {
            $("[data-page-id] > a").removeClass("active").attr("aria-selected", "false");
            $(`[data-page-id="${id}"] > a`).addClass("active").attr("aria-selected", "true");
        },
        //Obtenir l'index de la page active
        getPagePosition: function (id) {
            return iamGridStack.pages.findIndex(el=>el.id===id);
        },
        addWidget: function (obj) {
            iamGridStack.widgets.push(obj);
        },
        deleteWidget: function (id) {
            let newWidgetList = iamGridStack.widgets.filter(widget => widget.id != id);
            iamGridStack.widgets = newWidgetList;
        },
        renamePage: function (id) {

        },
        deletePage: function (id) {
            let newPageList = iamGridStack.pages.filter(page => page.id != id);
            let newWidgetList = iamGridStack.widgets.filter(widget => widget.pageId != id);
            iamGridStack.pages = newPageList;
            iamGridStack.widgets = newWidgetList;
        },
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
        //Ajouter les options
        addOptions: function () {
            iamGridStack.pages.forEach((el, i) => {
                iamGridStack.grids[i].enableMove(iamGridStack.options.editMode);
                iamGridStack.grids[i].enableResize(iamGridStack.options.editMode);
                iamGridStack.grids[i].float(iamGridStack.options.float);
            })
        },
        showRightPanel: function (obj,objVal) {
            iamShared.ui.rightPanelShow();
            //iamShared.ui.popupWithIframeShow();
            console.log("ok !!!!!!!");

            iamQF.createForm(obj,objVal, true, "rightpanel", true, null, null, true, true, null);
        },
        buildWidget: function (widget) {
            console.log("widget", widget);
            const id = iamGridStack.events.addNewWidget("");
            const myWidgetHtml = iamWidget.render(id, widget);
            const callback = () => {
                let el = $(`[data-w-id="${id}"]`).parent().parent();
                let deleteBtn = el.find(".btn-delete-widget");
                let position = {
                    x: el.attr("gs-x"),
                    y: el.attr("gs-y"),
                    h: el.attr("gs-h"),
                    w: el.attr("gs-w"),
                }
                let objArray = iamGridStack.widgets.filter(el => el.id == id);
                deleteBtn.trigger("click");
                let newId = iamGridStack.methods.buildWidget(objArray[0].skeleton);
                let newEl = $(`[data-w-id="${newId}"]`).parent().parent();
                newEl.attr("gs-x", position.x).attr("gs-y", position.y).attr("gs-h", position.h).attr("gs-w", position.w);
                //console.log("el", el, position);
            }
            iamGridStack.widgets[iamGridStack.widgets.length - 1] = {
                ...iamGridStack.widgets[iamGridStack.widgets.length - 1],
                skeleton: widget,
                objectQF: iamWidget.getWidgetQFObject(widget, callback),
            }
            $(`[data-widget-id="${id}"]`).find(".grid-stack-item-content").append(myWidgetHtml);
            $(`#widget_${id}`).css("height", "100%");
            iamGridStack.refresh();
            //console.log("myWidgetHtml", myWidgetHtml);
            return id;
        },
    },
    events: {
        //Renommer page
        renamePage: function (e) {
            const newName = $("#PageRenameInput").val();
            const id = iamGridStack.pages[iamGridStack.currentPage].id;

            $(`[data-page-id="${id}"]`).find("a").html(newName);
            $("#PageRenameInput").val("");
            const pageIndex = iamGridStack.methods.getPagePosition(id);
            iamGridStack.pages[pageIndex].name = newName;
        },
        //Ajouter une nouvelle page
        addNewPage: function (name) {
            let id;
            $("#pagesContainerId").append(iamGridStack.templateHtml.pageTab({name:name}));
            $("#ia-gridstack-container").append(iamGridStack.templateHtml.gridstackContainer());

            iamGridStack.refresh();
            id = iamGridStack.methods.bindId();
            iamGridStack.pages.push({
                id: id,
                name:name,
            })
            


            const showPage = (e) => { iamGridStack.events.showActivePage(e); }
            //Afficher la page
            iamGridStack.createEvent($(`[data-page-id="${id}"]`), {
                "click":showPage,
            });

            $(`[data-page-id="${id}"]`).trigger("click");

            iamGridStack.methods.setToActive(id);
            iamGridStack.methods.addOptions();
        },
        //Ajouter un nouveau widget
        addNewWidget: function (something) {
            const contentHtml = something ? something.name : "";
            const id = new Date().getTime() + "";
            const content = `<span data-w-id="${id}"></span>` + iamGridStack.templateHtml.widgetOptionBar() + contentHtml;
            const obj = {
                id: id,
                pageId: iamGridStack.pages[iamGridStack.currentPage].id,
                content: contentHtml,
                type: "widget",
                //attributes: something.attributes,
                //attributesVal: something.attributesVal,
                objectQF: null,
                skeleton:null,
            };

            if (something==null) {
                iamGridStack.grids[iamGridStack.currentPage].addWidget({
                    h: 3,//Math.floor(1+3 * Math.random()),
                    w: 3,//Math.floor(1+3 * Math.random()),
                    content: content,
                });
            }
            else {
                iamGridStack.grids[iamGridStack.currentPage].addWidget({
                    h: something.h || 3,
                    w: something.w || 3,
                    x: something.x || 0,
                    y: something.y || 0,
                    content: content,
                });
            }
            
            
            iamGridStack.methods.addWidget(obj);
            $(`.grid-stack-item:has([data-w-id="${id}"])`).attr("data-widget-id", id);
            iamGridStack.bindTo(obj);
            return id;
        },
        //Afficher la page active
        showActivePage: function (e) {
            e.preventDefault();
            
            const selector = $(e.currentTarget);
            const id = selector.attr("data-page-id");

            $(`[data-grid-id]`).hide();
            $(`[data-grid-id="${id}"]`).show();

            iamGridStack.currentPage = iamGridStack.methods.getPagePosition(id);
            //console.log("test !!  !! ! !! !",id);

        },
        //Afficher la zone d'options
        showMoreSetting: function (e) {
            $(".btn-show-more-setting > i").toggleClass("flaticon2-up");
            $(".btn-show-more-setting > i").toggleClass("flaticon2-down");
            $("#ia-gridstack-toolbar-more-setting").toggle();
        },
        //
        showWidgetToobar: function (e) {
            if (iamGridStack.options.editMode) {
                let selector = $(e.currentTarget).find(".btn-delete-widget");
                selector.parent().children().toggle();
            };
            
        },
        //Supprimer page
        deletePage: function (e) {
            if (iamGridStack.pages.length == 1) return;
            const id = iamGridStack.pages[iamGridStack.currentPage].id;
            const pageIndex = iamGridStack.methods.getPagePosition(id);
            let newId;
            

            iamGridStack.grids[iamGridStack.currentPage].destroy();
            $(`[data-page-id="${id}"]`).remove();

            if (pageIndex == 0) {
                const nextPageId = iamGridStack.pages[1].id;
                iamGridStack.methods.setToActive(nextPageId);
                
                $(`[data-page-id="${nextPageId}"]`).trigger("click");
                newId = nextPageId;

            }
            else {
                const prevPageId = iamGridStack.pages[iamGridStack.currentPage-1].id;
                iamGridStack.methods.setToActive(prevPageId);

                $(`[data-page-id="${prevPageId}"]`).trigger("click");
                newId = prevPageId;
            }
            iamGridStack.methods.deletePage(id);
            iamGridStack.refresh();
            iamGridStack.currentPage = iamGridStack.methods.getPagePosition(newId);
            console.log("555555",iamGridStack.pages, "id",iamGridStack.currentPage)
        },
        //Supprimer widget 
        deleteWidget: function (e) {
            const id = $(e.currentTarget).parent().siblings(`[data-w-id]`).attr("data-w-id");
            
            iamGridStack.grids[iamGridStack.currentPage].removeWidget($(`[data-widget-id="${id}"]`)["0"]);
            iamGridStack.methods.deleteWidget(id);
        },
        //
        importWidget: function (e) {
            
            const buildWidget0 = (widget) => {
                console.log("widget", widget);
                const id = iamGridStack.events.addNewWidget("");
                const myWidgetHtml = iamWidget.render(id, widget);
                const callback = () => {
                    let el = $(`[data-w-id="${id}"]`).parent().parent();
                    let position = {
                        x:el.attr("gs-x"),
                        y:el.attr("gs-y"),
                        h:el.attr("gs-h"),
                        w:el.attr("gs-w"),
                    }
                    console.log("el", el,position);
                }
                iamGridStack.widgets[iamGridStack.widgets.length - 1] = {
                    ...iamGridStack.widgets[iamGridStack.widgets.length - 1],
                    skeleton:widget,
                    objectQF: iamWidget.getWidgetQFObject(widget, callback),
                }
                $(`[data-widget-id="${id}"]`).find(".grid-stack-item-content").append(myWidgetHtml);
                $(`#widget_${id}`).css("height", "100%");
               iamGridStack.refresh();
                //console.log("myWidgetHtml", myWidgetHtml);
            };
            const buildWidget = (widget) => {
                iamGridStack.methods.buildWidget(widget);
            }
            iamGridStack.methods.importFromJSON(buildWidget);
            //console.log("widgets :", iamGridStack.widgets);
        },
        //Mode d'edition des widgets et des pages
        editMode: function (e) {
            iamGridStack.options.editMode = $(e.currentTarget).prop("checked");

            $(`[data-id="gridstackTabsRight"], #ia-gridstack-toolbar-more-setting`).toggleClass("isNotEditMode");
            iamGridStack.methods.addOptions();
        },
        //Importer des Grids
        importGrid: function (e) {
            
            //iamGridStack.refresh();

            iamGridStack.methods.importFromJSON((obj) => {

                $("#ia-gridstack-container, #pagesContainerId").html("");
                iamGridStack.widgets = [];
                iamGridStack.pages = [];
                iamGridStack.options = {
                    editMode: false,
                    float: false
                };
                iamGridStack.importGrids(obj);
                console.log("importtttt99999999999999", obj);
            });

        },
        //Faire apparaitre la QuickForm des parametres
        settingWidget: function (e) {
            const id = $(e.currentTarget).parent().siblings(`[data-w-id]`).attr("data-w-id");
            let objArray = iamGridStack.widgets.filter(el => el.id == id);
            //console.log("555", objArray[0].objectQF);
            iamGridStack.methods.showRightPanel(objArray[0].objectQF, objArray[0].skeleton.attributesVal);

        }
    
    },
    bindTo: function (obj) {
        if (!obj) return;
        const that = this;

        if (obj.type == "widget") {
            const showToolbar = (e) => {
                that.events.showWidgetToobar(e);
            };
            const deleteWidget = (e) => {
                that.events.deleteWidget(e);
            };
            const settingWidget = (e) => {
                iamGridStack.events.settingWidget(e);
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
                "click": settingWidget,
            });

        }

    },
    //Exporter les grids
    exportGrids: function () {
        const guid = new Date().getTime() + "";
        let obj = {
            id:guid,
            pages:[],
        };
        $("[data-w-id]").siblings(".ia-widget-toolbar").remove();
        $("[data-w-id]").remove();
        iamGridStack.refresh();
        iamGridStack.pages.forEach((page,i) => {
            obj.pages.push({
                ...page,
                widgets: iamGridStack.grids[i].save(),
            })
        });
        console.log("exported!", obj);
        iamShared.files.stringToFileDownload("Grids_" + guid + ".json", JSON.stringify(obj));
    },
    //Importer des grids
   importGrids: function (obj) {
        const that = this;
        obj.pages.forEach((el, i) => {
            that.events.addNewPage(el.name);
            //that.grids[that.grids.length - 1].load(el.widgets);
            el.widgets.forEach((widget) => {
                const id = iamGridStack.events.addNewWidget({name:"",w:widget.w,h:widget.h,});
                //that.grids[that.grids.length - 1].addWidget(widget);
                $(`[data-widget-id="${id}"]`).find(".grid-stack-item-content").append(widget.content);
            });
        });
    }

};




var iamGridStack = {
    //Id du container
    id:"iamdashboard",
    //Point d'entrée : initialisation du projet
    init: function () {
        const that = this;

        //Ajout du container dans le DOM
        $("#"+this.id).html(this.ui.initContainer());
        this.portal.options.editMode = $("#ia-gridstack-editmode").prop("checked");

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
        name:"",
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

                break;
            case "page":
                const addPage = (e) => {

                    e.preventDefault();
                    const name = $("#PageRenameInput").val();
                    if (name.trim() == "") return;

                    iamGridStack.events.page.add(name);
                    $("#PageRenameInput").val("");
                }
                const renamePage = (e) => {

                    e.preventDefault();

                    iamGridStack.events.page.rename(e);
                    $("#PageRenameInput").val("");
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
        console.log(portal)
        portal.pages.forEach((page, i) => {
            that.events.page.add(page.name);
            page.widgets.forEach((widget) => {
                iamGridStack.actions.widget.build(widget,false);
            });
        });
        iamGridStack.actions.portal._binOptions();
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
                                
                                
                                <div class="dropdown dropdown-inline mr-1">
                                                        <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn">
                                                        <i class="fas fa-stream" style="font-size: 1.7rem;"></i>
                                                        </button>
                                                        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
                                                        
                                                            <div class="px-4 py-3">
                                                                <div class="form-group">
                                                                <label for="PageRenameInput">Nom de la page</label>
                                                                <input type="text" class="form-control" id="PageRenameInput">
                                                                </div>
                                                                <button class="btn btn-block btn-sm btn-primary" id="ia-gridstack-rename-page">Renommer</button>
                                                                <button class="btn btn-block btn-sm btn-primary ml-0" id="ia-gridstack-add-page">Créer nouveau</button>
                                                            </div>
                                    </div>
                                </div>
                                <a href="#" class="btn btn-icon btn-light-danger btn-delete-page ml-2 mr-2" data-toggle="tooltip" title=Supprimer la page">
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
                                                ${obj.name}
                                            </a>
                                        </li>
`;
        },
        widgetOptionBar: function () {
            return `
                    <div class="d-flex justify-content-end m-2 ia-widget-toolbar" style="height: 20px;z-index: 2;position: absolute;">
                        <div class="ia-widget-tb"  style="display:none">
                            <a href="#" class="btn-delete-widget mr-5">
                                  <i class="flaticon2-delete text-danger"></i>
                            </a>
                            <a href="#" class="btn-setting-widget mr-5" >
                                  <i class="flaticon2-settings text-dark"></i>
                            </a>
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
    // /*<div class="m-5" id="preview-content-id" style="height:60%;overflow: auto;" data-id="preview-content-id"></div>*/
    //Liste des actions (methodes specifiques)
    actions: {
        page: {
            set: function (id,obj) {
                
                const i = iamGridStack.actions.page._getPosition(id);
                iamGridStack.portal.pages[i] = { ...iamGridStack.portal.pages[i],...obj};
            },
            getAll: function () {
                return iamGridStack.portal.pages;
            },
            get: function (id) {
                const i = iamGridStack.actions.page._getPosition(id);
                return iamGridStack.portal.pages[i];
            },
            delete: function (id) {
                iamGridStack.portal.pages = iamGridStack.portal.pages.filter(page => page.id != id);
            },
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
                console.log("modelID",models);
                const modelID = models.find((widget) => widget.id == id);
                //console.log("modelID", modelID);
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
            _toDataGridSource: function (properties,arr) {
                let widgets = arr || iamGridStack.portal.models.widgets;
                let propertyToShow = properties || {};
                console.log(widgets,propertyToShow);
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
            _binOptions: function () {
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
            remove: function (id) {
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
                
                console.log("deleted !");

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
                console.log("added !");
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
                $(`[data-page-id="${id}"]`).find("a").html(name)

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
                const content = `<span data-w-id="${id}"></span>` + iamGridStack.ui.widgetOptionBar() + `<div style="height:100%" id="${id}" class="d-flex flex-column align-items-center justify-content-center" data-container-id=${id}>${contentHtml}</div>`;
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
                iamGridStack.bindTo(widget);
                let modelId = $(`[data-id="preview-id"]`).attr("data-model-id") || widget.data.modelId;
                const modelList = iamGridStack.portal.models.widgets;
                if (obj.isCreation) {
                    iamGridStack.actions.widget.set(widget.id, {
                        data: Widget.fromJsonObject(obj.data, modelList),
                    })
                } else {
                    widget.data = new Widget(id, iamGridStack.actions.widget.getModel(modelId), { id });
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
                                            iamGridStack.actions.model.remove(id);
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
            preview: function (e) {
                const id = $(e.currentTarget).attr("data-model-id");
                
                const widgetModel = iamGridStack.portal.models.widgets.find((widget) => widget.id == id);
                let wid = new Widget("preview-eye-content", widgetModel);
                
            }
        },
        portal: {
            //Activer mode d'édition 
            activeEditMode: function (e) {
                iamGridStack.portal.options.editMode = $(e.currentTarget).prop("checked"); 

                if (iamGridStack.portal.options.editMode) {
                    $(`[data-id="right-toolbar-id"]`).html(iamGridStack.ui.rightToolBar());
                    iamGridStack.bindTo({ type: "page" });
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
                iamGridStack.portal.options.editMode = false;
                iamGridStack.actions.portal.save(iamGridStack.portal);
                iamShared.messages.showSuccessMsg("Saved");
            },
        }
    }
}





















