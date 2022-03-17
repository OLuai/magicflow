var GridStack = import('../../../../../view-resources/Areas/App/Views/_Bundles/gridstack.min.js');
console.log(GridStack);
$(function () {
    var items = [
        { content: 'my first widget' }, // will default to location (0,0) and 1x1
        { w: 2, content: 'another longer widget!' } // will be placed next at (1,0) and 2x1
    ];
    var grid = GridStack.init();
    grid.load(items);
    ////var grid = GridStack.init();


   // grid.addWidget({ w: 2, content: 'item 1' });

})




































