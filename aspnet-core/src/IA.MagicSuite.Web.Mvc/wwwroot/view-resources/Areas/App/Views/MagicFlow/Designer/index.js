<<<<<<< Updated upstream
﻿
(function () {
    $(function () {
        iamFlowBuider.init();
        iamFlow.init();
        var _magicFlowService = abp.services.app.flow;
        

        var url = new URL(window.location.href);
        var id = url.searchParams.get("id");
        _magicFlowService.getFlow({ 'id': id }).done(data => {
            iamFlow.flow.FlowId = data.id;
            iamFlow.flow.FlowName = data.name;
            iamFlow.flow.FlowActions = JSON.parse(data.flowJSON);

            
            iamFlow.transfert.import(iamFlow.flow.FlowActions);

            $("#iamFlowNameInput").val('');
            $("#iamFlowNameSave").trigger('click');
            

        });

        
=======

(function () {
    $(function () {
        alert();
        iamFlowBuider.init();
        iamFlow.init();
        let _magicFlowService = abp.services.app.flow;

        var url = new URL(window.location.href);
        var id = url.searchParams.get("id");

        _magicFlowService.getFlow({ 'id': id })
            .done(data => {
                data.flowJSON = JSON.parse(data.flowJSON);
                iamFlow.flow = data;
                iamFlow.transfert.import(data.flowJSON);
                alert('ok');
            })
            .always(data => {
                $("#iamFlowNameInput").val('');
                $("#iamFlowNameSave").trigger('click');
            });
>>>>>>> Stashed changes
    });
})();