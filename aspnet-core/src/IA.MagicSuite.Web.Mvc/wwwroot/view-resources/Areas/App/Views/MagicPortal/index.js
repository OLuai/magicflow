//const { GridStack } = require("../../../../../gridstack/dist/gridstack");

//import('../../../../../view-resources/Areas/App/Views/_Bundles/gridstack.min.js');
alert('test !!!!!!!!!!');
$(function () {
    
    iamGridStack.init();
})


var iamGridStack = {
    build: function () {

        $("#iamdashboard").html(`
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
        let grid = GridStack.init();
        //let grid = $('.grid-stack').gridstack;

       
        grid.load(items);
        

        //grid.on('added removed change', function (e, items) {
        //    let str = '';
        //    items.forEach(function (item) { str += ' (x,y)=' + item.x + ',' + item.y; });
        //    console.log(e.type + ' ' + items.length + ' items:' + str);
        //});


        this.initEvent();
    },
    initEvent: function () {
        const that = this;
        $("#ia-gridstack-add-page").on("click", function () {
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
        gridstackHheader: function () {
            return `
            <div id="ia-gridstack-config" class="mb-5">

                    <div class="card card-custom">
                        <div class="card-header card-header-tabs-line">
                            


                                                       


                        </div>
                    </div>
        </div>
`;
        },
        gridstackTabsLeft: function () {
            return `


                          <div class="card-toolbar">
                                <ul class="nav nav-tabs nav-bold nav-tabs-line" role="tablist">
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


`;
        },
        gridstackTabsRight: function () {
            return `

                            <div class="d-flex align-items-center">
                                <a href="#" class="btn btn-success font-weight-bold mr-2 ia-gridstack-add-page">
                                    <i class="flaticon2-plus"></i>
                                </a>
                            </div> 


`;
        },
        gridstackContainer: function () {
            return `<div class="grid-stack"></div>`;
        },
    },

};

































