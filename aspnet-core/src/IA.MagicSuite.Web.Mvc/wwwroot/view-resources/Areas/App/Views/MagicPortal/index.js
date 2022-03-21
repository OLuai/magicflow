﻿//const { GridStack } = require("../../../../../gridstack/dist/gridstack");

//import('../../../../../view-resources/Areas/App/Views/_Bundles/gridstack.min.js');
alert('test8mm !!!!!!!!!!');
$(function () {
    
    iamGridStack.init();
})


var iamGridStack = {
    build: function () {
        const that = this;


        $("#iamdashboard").html(that.templateHtml.initContainer());
        //Ajout de la page par défaut
        iamGridStack.events.addNewPage();

        $("#iamdashboard0").html(`
    <h1>Header</h1>
    <div id="ia-gridstack-config" class="mb-5">

        <div class="card card-custom">
                        <div class="card-header card-header-tabs-line">
                            <div class="card-toolbar">
                                <ul class="nav nav-tabs nav-bold nav-tabs-line page-list" role="tablist">
                                        <li class="nav-item">
                                            <a class="nav-link active" data-toggle="tab" href="" role="tab" aria-selected="true">
                                                Page 1
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" data-toggle="tab" href="" role="tab" aria-selected="false">
                                                000
                                            </a>
                                        </li>
                                </ul>
                            </div>


                            <div class="d-flex align-items-center">
                                <a href="#" class="btn btn-success font-weight-bold mr-2 ia-gridstack-add-page" id="ia-gridstack-add-page">
                                    <i class="flaticon2-plus"></i>
                                </a>
                            </div>                            


                        </div>
                    </div>
        </div>
    <div id="ia-gridstack-container" class="grid-stack"></div>
 <div id="ia-gridstack-container" class="grid-stack">

<div class="grid-stack-item">
    <div class="grid-stack-item-content">Item 1</div>
  </div>
  <div class="grid-stack-item" data-gs-width="2">
    <div class="grid-stack-item-content">Item 2 wider</div>
  </div>

</div>
`);
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


        iamGridStack.refresh();
        iamGridStack.methods.bindId();
    },
    initEvent: function () {
        const that = this;
        const addNewpage = (e) => {
            that.events.addNewPage(e);
        };

        //Ajouter une nouvelle page
        this.createEvent($("#ia-gridstack-add-page"), {
            "click": addNewpage,
        });

        $("#ia-gridstack-add-page00").on("click", function () {
            console.log("Clique !");
//            $(".page-list").append(`
//                                        <li class="nav-item">
//                                            <a class="nav-link" data-toggle="tab" href="" role="tab" aria-selected="false">
//                                                New page
//                                            </a>
//                                        </li>

//`);   
            that.grids = GridStack.initAll()
            console.log("00->", that.grids);
            

        });
    },
    refresh: function () {
        this.grids = GridStack.initAll();
    },
    grids: null,
    currentGrid: 0,
    pages: null,
    items : [
        { x: 0, y: 0, w: 4, h: 2, content: '1' },
        { x: 4, y: 0, w: 4, h: 4, content: '2' },
        //{ x: 8, y: 0, w: 2, h: 2, content: '<p class="card-text text-center" style="margin-bottom: 0">Drag me!<p class="card-text text-center"style="margin-bottom: 0"><ion-icon name="hand" style="font-size: 300%"></ion-icon><p class="card-text text-center" style="margin-bottom: 0">' },
        //{ x: 10, y: 0, w: 2, h: 2, content: '4' },
        //{ x: 0, y: 2, w: 2, h: 2, content: '5' },
        //{ x: 2, y: 2, w: 2, h: 4, content: '6' },
        //{ x: 8, y: 2, w: 4, h: 2, content: '7' },
        //{ x: 0, y: 4, w: 2, h: 2, content: '8' },
        //{ x: 4, y: 4, w: 4, h: 2, content: '9' },
        //{ x: 8, y: 4, w: 2, h: 2, content: '10' },
        //{ x: 10, y: 4, w: 2, h: 2, content: '11' },
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
        <div id="ia-gridstack-toolbar" class="mb-5">

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
                    </div>
        </div>
        <div id="ia-gridstack-container" class="">

                {grid-content-item}

        </div>




`.replace("{tool-bar-right}", iamGridStack.templateHtml.gridstackTabsRight()).replace("{grid-content-item}", iamGridStack.templateHtml.gridstackContainer());
        },
        gridstackTabsLeft: function () {
            return `


                          
                                <ul class="nav nav-tabs nav-bold nav-tabs-line" role="tablist" id="pagesContainerId">
                                        
                                </ul>
                            


`;
        },
        gridstackTabsRight: function () {
            return `

                            <div class="d-flex align-items-center">
                                <a href="#" class="font-weight-bold ml-2 mr-2" id="ia-gridstack-add-page" style="font-size: 1.7rem;">
                                    <i class="flaticon2-plus-1"></i>
                                </a>



                            </div> 


`;
        },
        gridstackContainer: function () {
            return `<div class="grid-stack newgrid" style="min-height:40vh;" data-grid-id="">1</div>`;
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
        }
    },
    methods: {
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
    },
    events: {
        addNewPage: function (e) {
            let id;
            $("#pagesContainerId").append(iamGridStack.templateHtml.pageTab());
            $("#ia-gridstack-container").append(iamGridStack.templateHtml.gridstackContainer());

            iamGridStack.refresh();
            id = iamGridStack.methods.bindId();


            const showPage = (e) => { iamGridStack.events.showActivePage(e); }
            //Afficher la page
            iamGridStack.createEvent($(`[data-page-id="${id}"]`), {
                "click":showPage,
            });

            //$(`[data-page-id="${id}"]`).trigger("click");

            console.log($(`[data-page-id="${id}"]`));

        },
        showActivePage: function (e) {
            e.preventDefault();
            $(`[data-grid-id]`).hide();
            const selector = $(e.currentTarget);
            const id = selector.attr("data-page-id");

            
            $(`[data-grid-id="${id}"]`).show();


            console.log("test !!  !! ! !! !",id);

        },
        
    }

};

































