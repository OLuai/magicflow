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
        iamGridStack.events.addNewPage();

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
            that.events.addNewPage(e);
        };
        const addNewWidget = (e) => {
            that.events.addNewWidget(e);
        };
        const toggleMoreSetting = (e) => {
            that.events.showMoreSetting(e);
        };


        //Ajouter une nouvelle page
        this.createEvent($("#ia-gridstack-add-page"), {
            "click": addNewpage,
        });
        //Ajouter une nouveau widget
        this.createEvent($("#ia-gridstack-add-widget"), {
            "click": addNewWidget,
        });

        //Afficher ou masque les options
        this.createEvent($(".btn-show-more-setting"), {
            "click": toggleMoreSetting,
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
						                            <a href="#" class="btn text-dark btn-light-secondary btn-hover-bg-light">Renommer</a>				
									            </div>
                                            </div>


                                            <div class="d-flex align-items-center">                    
                                                <div class="alert-icon">                        
                                                        <a href="#" class="btn btn-icon btn-light-danger btn-clear-all">
                                                            <i class="flaticon2-rubbish-bin-delete-button icon-lg"></i>
                                                        </a>									
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
                                <a href="#" class="font-weight-bold ml-2 mr-3" id="ia-gridstack-add-widget" >
                                    <i class="flaticon2-plus-1" style="font-size: 1.7rem;"></i>
                                </a>
                                <a href="#" class="font-weight-bold ml-2 mr-2" id="ia-gridstack-add-page" >
                                    <i class="fas fa-stream" style="font-size: 1.7rem;"></i>
                                </a>
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

        },
    },
    events: {
        //Ajouter une nouvelle page
        addNewPage: function (e) {
            let id;
            $("#pagesContainerId").append(iamGridStack.templateHtml.pageTab());
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

































