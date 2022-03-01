
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

            $("#flow-container").html('');
            iamFlow.transfert.import(iamFlow.flow.FlowActions);

            $("#iamFlowNameInput").val('');
            $("#iamFlowNameSave").trigger('click');
            

        });

        
    });
})();