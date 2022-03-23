//const { GridStack } = require("../../../../../gridstack/dist/gridstack");

//import('../../../../../view-resources/Areas/App/Views/_Bundles/gridstack.min.js');
alert('test2 !!!!!!!!!!');
var test;
$(function () {
    
    iamGridStack.init();
})


var iamGridStack = {
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
    },
    initEvent: function () {
        const that = this;
        const addNewpage = (e) => {
            const name = $("#PageRenameInput").val();
            that.events.addNewPage(name);
            $("#PageRenameInput").val("");
        };
        const addNewWidget = (e) => {
            that.events.addNewWidget(e);
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

    },
    refresh: function () {
        this.grids = GridStack.initAll();
    },
    grids: null,
    options: {
        isEditMode:true,
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


    <h1>Header</h1>
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

        <div id="ia-gridstack-toolbar-more-setting" style="display:none;">
                                <div role="alert"  class="alert mb-1 alert-custom alert-white alert-shadow fade show gutter-b d-flex justify-content-between" >

                                            <div class="d-flex align-items-center">
                                                <div class="alert-icon">
                                                    <span class="mr-2">Mode édition</span>
										            <span class="switch">
                                                    <label>
                                                            <input type="checkbox" name="select" class="switch-edit-mode">
                                                            <span></span>
                                                    </label>
                                                    </span>
									            </div>
                                                

                                                <div class="alert-icon">                        
						                        </div>


                                            </div>


                                            <div class="d-flex align-items-center">                    
                                                <div class="alert-icon">                        
                                                        <a href="#" class="font-weight-bold ml-2 mr-3" id="ia-gridstack-add-widget" >
                                                              <i class="flaticon2-plus-1" style="font-size: 1.7rem;"></i>
                                                        </a>									
                                                </div>


                                                <div class="alert-icon">                        
                                                          <div class="dropdown dropdown-inline">
                                                        <button type="button" class="btn btn-light-primary btn-icon btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i class="ki ki-bold-more-ver icon-lg"></i>
                                                        </button>
                                                        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(-5px, 32px, 0px); top: 0px; left: 0px; will-change: transform;">
                                                                <a class="dropdown-item" href="#">Exporter</a>
                                                                <a class="dropdown-item" href="#">Importer</a>
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




`.replace("{tool-bar-right}", iamGridStack.templateHtml.gridstackTabsRight());
        },
        gridstackTabsRight: function () {
            return `

                            <div class="d-flex align-items-center">
                                
                                
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
                                <a href="#" class="btn btn-icon btn-light-danger btn-delete-page ml-2 mr-2">
                                    <i class="flaticon2-rubbish-bin-delete-button icon-lg"></i>
                                </a>
                                <span class="mr-5 ml-5"></span>
                                <a href="#" class="font-weight-bold ml-2 btn-show-more-setting">
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
                    <div style="height: 20px;" class="d-flex justify-content-end m-2 ia-widget-toolbar">
                            <a href="#" class="btn-delete-widget" style="display:none">
                                  <i class="flaticon2-delete text-danger"></i>
                            </a>
                    </div>
`;
        },

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
            let newWidgetList = iamGridStack.widgets.filter(widget => widget.pageId != id);
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
    },
    events: {
        //Renommer page
        renamePage: function (e) {
            const newName = $("#PageRenameInput").val();
            const id = iamGridStack.pages[iamGridStack.currentPage].id;

            $(`[data-page-id="${id}"]`).find("a").html(newName);
            $("#PageRenameInput").val("");
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
                name:"",
                displayName: "",
            })
            


            const showPage = (e) => { iamGridStack.events.showActivePage(e); }
            //Afficher la page
            iamGridStack.createEvent($(`[data-page-id="${id}"]`), {
                "click":showPage,
            });

            $(`[data-page-id="${id}"]`).trigger("click");

            iamGridStack.methods.setToActive(id);

        },
        //Ajouter un nouveau widget
        addNewWidget: function (e) {
            const id = new Date().getTime() + "";
            const content = `<span data-w-id="${id}"></span>` + iamGridStack.templateHtml.widgetOptionBar() + "ceci est un test";
            const obj = {
                id: id,
                pageId: iamGridStack.pages[iamGridStack.currentPage].id,
                content: content,
                type:"widget",
            };

            
            iamGridStack.grids[iamGridStack.currentPage].addWidget({
                h: 4,
                w: 4,
                content:content,
            });
            iamGridStack.methods.addWidget(obj);
            $(`.grid-stack-item:has([data-w-id="${id}"])`).attr("data-widget-id", id);
            iamGridStack.bindTo(obj);
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
        showWidgetToobar: function (e) {
            let selector = $(e.currentTarget).find(".btn-delete-widget");
            selector.toggle();
        },
        //Supprimer page
        deletePage: function (e) {
            if (iamGridStack.pages.length == 1) return;
            const id = iamGridStack.pages[iamGridStack.currentPage].id;
            const pageIndex = iamGridStack.methods.getPagePosition(id);
            let newId;
            

            iamGridStack.grids[iamGridStack.currentPage].destroy();
            //iamGridStack.methods.deletePage(id);
            $(`[data-page-id="${id}"]`).remove();

            if (pageIndex == 0) {
                const nextPageId = iamGridStack.pages[1].id;
                iamGridStack.methods.setToActive(nextPageId);
                
                $(`[data-page-id="${nextPageId}"]`).trigger("click");
                newId = nextPageId;
                //iamGridStack.currentPage = iamGridStack.methods.getPagePosition(nextPageId);
                //iamGridStack.currentPage = 1;

            }
            else {
                const prevPageId = iamGridStack.pages[iamGridStack.currentPage-1].id;
                iamGridStack.methods.setToActive(prevPageId);

                $(`[data-page-id="${prevPageId}"]`).trigger("click");
                newId = prevPageId;
                //iamGridStack.currentPage = iamGridStack.methods.getPagePosition(prevPageId);
                //iamGridStack.currentPage = iamGridStack.currentPage - 1;
            }
           // iamGridStack.methods.setToActive(id);
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

            //Afficher toolbar widget
            this.createEvent($(`.grid-stack-item:has([data-w-id="${obj.id}"])`), {
                "mouseover": showToolbar,
                "mouseout": showToolbar,
            });
            //Supprimer widget
            this.createEvent($(`[data-widget-id="${obj.id}"]`).find(".btn-delete-widget"), {
                "click": deleteWidget,
            });
        }

    }

};

































