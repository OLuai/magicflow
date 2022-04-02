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
                type:"widget",
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
                    h:something.h || 3,
                    w:something.w || 3,
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
                selector.toggle();
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
            const buildWidget = (widget) => {
               
                const id = iamGridStack.events.addNewWidget("");
                const myWidgetHtml = iamWidget.render(id,widget);
                $(`[data-widget-id="${id}"]`).find(".grid-stack-item-content").append(myWidgetHtml);
               iamGridStack.refresh();
                console.log("myWidgetHtml", myWidgetHtml);
            };
            iamGridStack.methods.importFromJSON(buildWidget);
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

































