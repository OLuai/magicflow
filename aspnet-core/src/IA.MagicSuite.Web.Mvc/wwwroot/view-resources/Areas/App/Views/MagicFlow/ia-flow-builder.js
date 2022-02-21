
$(function () {
    //alert("test");
    iamFlowBuider.init();
})



var iamFlowBuider = {
    //Point d'entrée
    init: function () {
        this.aside.init();
        this.initEvent();
    },
    actions: {
        "ActionTypes": iamFlow.action.actionTypes,
        "ActionCategories": iamFlow.action.actionCategories
    },
    //Tous les templates
    templateHtml: {
        actionTypesGroup: function (obj) {
            return `
                                         <div class="card">
                                                <div class="card-header" id="${obj.id}">
                                                    <div class="card-title collapsed" data-toggle="collapse" data-target="#${obj.id_body}">
                                                        ${obj.icon}
                                                        <span class="mr-5" style="font-size:1vw;">
                                                            ${obj.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div id="${obj.id_body}" class="collapse" data-parent="#toolboxActionTypeIA">
                                                    <div class="card-body">
                                                        <ul id="${obj.id_body}_UL" class="navi navi-border">
                                                            ${obj.content}
                                                        </ul>
                                                    </div>
                                                </div>
                                         </div>
`;
        },
        actionTypesItem: function (obj) {
            return `
            <li class="navi-item flow-list-item" draggable="true" id="${obj.id}" data-flow-type="newFlow">
                <a class="navi-link">
                    ${obj.icon}
                    <span class="navi-text ml-4" style="font-size:0.9vw;">${obj.name}</span>
                </a>
            </li>
`;
        },
        flow: function (obj) {
            obj = obj || { id: "" };
            return `
                                
                            <div class="flow common-flow-class" style="display: flex;justify-content: center;" data-for-controlId="${obj.id.slice(5)}">
                                    <div class="flow-wrap active-flow" draggable="true" style="background-color:#d5d6f9;border:3px solid #00F !important; width:400px" data-id="${obj.id}" data-flow-type="flow" >
                                        <div class="flow-card d-flex justify-content-between" style="height: 44px" >
                                            <div class="" style="display: flex;">
                                                <div class="flow-icon  m-0 d-flex justify-content-center align-items-center" style="height:44px;width:44px;background-color:blue" data-toggle="popover" data-popover-id="${obj.id.slice(5)}" title="${obj.description}">
                                                    <i class="flaticon-multimedia-2 text-white"></i>
                                                </div>
                                                <div class="flow-title ml-3 d-flex justify-content-center align-items-center">
                                                    <span  data-title-for="${obj.id.slice(5)}">
                                                       ${obj.title}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="mr-1 d-flex justify-content-center align-items-center">
                                                <i class=" text-dark flaticon-more-1 ml-3"></i>
                                                <a class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white ml-3 flow-delete" data-delete-flow="${obj.id.slice(5)}" onclick="deleteFlow(event)">
                                                      <i class="flaticon2-cross"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flow-option " style="min-height:150px; display:none">
               <div class="m-5">
                    <div class="form-group ">
                        <label class="font-weight-bolder">Display Name : </label>
                        <input type="text" class="form-control" value="${obj.title}" data-displayname-for="${obj.id.slice(5)}"  maxlength="39" onchange="edit(event)" />
                    </div>
                    <div class="form-group">
                        <label class="font-weight-bolder" for="exampleTextarea">Description :</label>
                        <textarea class="form-control form-control" rows="3" data-description-for="${obj.id.slice(5)}" onchange="edit(event)">${obj.description}</textarea>
                    </div>
                    
                </div>
                                        </div>
                                    </div>
                                </div>

`;
        },
        flowIf: function (obj) {
            obj = obj || { id: "" }
            return `

                                <div class="flow-if common-flow-class" draggable="true" data-flow-type="flowIf" data-for-controlId="${obj.id.slice(5)}">
                                    <div class="flow" style="display: flex;justify-content: center;">
                                    <div class="flow-wrap"  style="background-color:#eee8e8;border:3px solid #919191 !important; width:400px" data-id="${obj.id}"  >
                                        <div class="flow-card d-flex justify-content-between" style="height: 44px">
                                            <div class="" style="display: flex;">
                                                <div class="flow-icon  m-0 d-flex justify-content-center align-items-center" style="height:44px;width:44px;background-color:black" data-toggle="popover" data-popover-id="${obj.id.slice(5)}" title="${obj.description}">
                                                    <i class="flaticon-multimedia-2 text-white"></i>
                                                </div>
                                                <div class="flow-title ml-3 d-flex justify-content-center align-items-center">
                                                    <span data-title-for="${obj.id.slice(5)}">
                                                        <span class="mr-2">If</span> <code id="${obj.id.slice(5)}-ConditionExpression">${obj.option["Condition Expression"]}</code>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="mr-1 d-flex justify-content-center align-items-center">
                                                <i class=" text-dark fas fa-eye-slash ml-2" data-icon-for="${obj.id.slice(5)}"></i>
                                                <a class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white ml-3 flow-delete" data-delete-flow="${obj.id.slice(5)}">
                                                      <i class="flaticon2-cross"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flow-option " style="min-height:150px; display:none">
                <div class="m-5">
                    
                    <div class="form-group">
                        <label class="font-weight-bolder" for="exampleTextarea">Description :</label>
                        <textarea class="form-control form-control" rows="3" data-description-for="${obj.id.slice(5)}" onchange="edit(event)">${obj.description}</textarea>
                    </div>
                    
                </div>
                                        </div>
                                    </div>
                                </div>
                                    <div class="flow-if-container" style="display: flex;justify-content: center;" data-if-container="${obj.id.slice(5)}">
                                        <div class="flow-yes" style="min-width:400px;border:3px solid #0DB74F !important;background-color: #caffda">
                                            <div class="flow-yes-title d-flex justify-content-between" style="height: 44px;background-color: #aeffc6;">
                                                <div class="" style="display: flex;">
                                                    <div class="flow-icon  m-0 d-flex justify-content-center align-items-center" style="height:44px;width:44px;background-color:#0db74f;">
                                                        <i class="flaticon2-checkmark text-white"></i>
                                                    </div>
                                                    <div class="flow-title ml-3 d-flex justify-content-center align-items-center">
                                                        <span class="font-weight-bolder">Oui</span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="flow-yes-content p-5" style="min-height: 80px;background-color: #caffda;" data-container-id="yes-${obj.id.slice(5)}" data-parent-id="${obj.id.slice(5)}" >

<div class="init-drop-zone" style="height:5vw; " data-from="" data-to=""></div>


                                            </div>
                                        </div>
                                        <div class="flow-no" style="min-width:400px;border:3px solid #F00 !important;background-color: #ffdada;">
                                            <div class="flow-no-title d-flex justify-content-between" style="height: 44px;background-color: #ffaeae;">
                                                <div class="" style="display: flex;">
                                                    <div class="flow-icon  m-0 d-flex justify-content-center align-items-center" style="height:44px;width:44px;background-color:#f00;">
                                                        <i class="flaticon2-delete text-white"></i>
                                                    </div>
                                                    <div class="flow-title ml-3 d-flex justify-content-center align-items-center">
                                                        <span class="font-weight-bolder">Non</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flow-no-content p-5" style="min-height: 80px;background-color: #ffdada;" data-container-id="no-${obj.id.slice(5)}" data-parent-id="${obj.id.slice(5)}">

<div class="init-drop-zone" style="height:5vw;" data-from="" data-to=""></div>


                                            </div>
                                        </div>
                                    </div>
                                </div>

`;
        },
        flowSwitch: function (obj) {
            obj = obj || { id: "", caseId1: "", caseId2: "" };
            return `
               <div class="flow common-flow-class" style="display: flex;justify-content: center;" data-for-controlId="${obj.id.slice(5)}">
                                    <div class="flow-wrap" draggable="true" style="background-color:#f9d5f3;border:3px solid #9700FF !important; min-width:400px" data-id="${obj.id}" data-flow-type="flowSwitch" >
                                        <div class="flow-card d-flex justify-content-between" style="height: 44px" >
                                            <div class="" style="display: flex;">
                                                <div class="flow-icon  m-0 d-flex justify-content-center align-items-center" style="height:44px;width:44px;background-color:#9700ff" data-toggle="popover" data-popover-id="${obj.id.slice(5)}" title="${obj.description}">
                                                    <i class="flaticon-multimedia-2 text-white"></i>
                                                </div>
                                                <div class="flow-title ml-3 d-flex justify-content-center align-items-center">
                                                    <span  data-title-for="${obj.id.slice(5)}">
                                                        <span class="mr-2">Switch</span> <code id="${obj.id.slice(5)}-ValueToCheck">${obj.option[2]["Value To Check"]}</code>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="mr-1 d-flex justify-content-center align-items-center">
                                                <i class=" text-dark fas fa-eye-slash ml-2" data-icon-for="${obj.id.slice(5)}"></i>
                                                <a class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white ml-3 flow-delete" data-delete-flow="${obj.id.slice(5)}" >
                                                      <i class="flaticon2-cross"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flow-option " style="min-height:150px;display:none">
<div class="m-5">
                    
                    <div class="form-group">
                        <label class="font-weight-bolder" for="exampleTextarea">Description :</label>
                        <textarea class="form-control form-control" rows="3" data-description-for="${obj.id.slice(5)}" onchange="edit(event)">${obj.description}</textarea>
                    </div>
                    
                </div>
                                        </div>
                                        <div class="flow-switch-container bg-light-secondary" style="min-height:150px" data-switch-case-container="${obj.id.slice(5)}">
                                            <div class=flow-switch-option" ml-2 mr-2" style="display: flex;justify-content: center;">
                                                <a  class="btn btn-info flow-add-case ml-1 mb-1 mt-1 mr-3" data-add-case-for="${obj.id.slice(5)}">
                                                    <i class="flaticon-plus icon-2x"></i>
                                                </a>
                                                <div class="p-1 ml-1 mr-1 flow-switch-case active-case" data-for-case="${obj.caseId1}" style="border-radius: 0.20em;">
                                                    <span class="m-2 font-weight-boldest flow-case-condition">
                                                        <span>Case</span> <span id="${obj.caseId1}-Value">${obj.option[0]["Value"]}</span> 
                                                    </span><span class="m-2"></span>
                                                    <a  class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white flow-delete-case"  data-delete-case="${obj.caseId1}">
                                                        <i class="flaticon2-cross"></i>
                                                    </a>
                                                </div>
                                                <div class="p-1 ml-1 mr-1 flow-switch-case" data-for-case="${obj.caseId2}" style=";border-radius: 0.20em;" >
                                                    <span class="m-2 font-weight-boldest flow-case-condition">
                                                         <span>Case</span> <span id="${obj.caseId2}-Value">${obj.option[1]["Value"]}</span>  
                                                    </span><span class="m-2"></span>
                                                    <a  class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white flow-delete-case"  data-delete-case="${obj.caseId2}">
                                                        <i class="flaticon2-cross"></i>
                                                    </a>
                                                </div>

                                                <div class="p-1 ml-1 mr-1 d-flex align-items-center set-case-position" data-set-case-position="${obj.id.slice(5)}">
                                                    <i class="flaticon2-back set-case-position-back" ></i>
                                                    <span class="m-2"></span> 
                                                    <i class="flaticon2-next text-info set-case-position-next" ></i>
                                                </div>


                                            </div>
                                            <div class="flow-case p-5" style="display: flex;min-height: 150px;background-color: #ccc5c2;" data-case-id="${obj.caseId1}" data-switch-id="${obj.id.slice(5)}">
                                                <div class="flow-case-container" data-container-id="${obj.caseId1}" style="width:100%";>

                                                    <div class="init-drop-zone" style="height:5vw; width:100%;" data-from="" data-to="">
                                                    
                                                    </div>

                                                </div>
                                            </div>
                                            <div class="flow-case p-5" style="display: none;min-height: 150px;background-color: #ccc5c2;" data-case-id="${obj.caseId2}" data-switch-id="${obj.id.slice(5)}">
                                                <div class="flow-case-container" data-container-id="${obj.caseId2}" style="width:100%";>

                                                    <div class="init-drop-zone" style="height:5vw; width:100%;" data-from="" data-to="">
                                                    
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


`;
        },
        flowContainer: function (obj) {
            obj = obj || { id: "" };
            return `
                                
                            <div class="flow common-flow-class" style="display: flex;justify-content: center;" data-for-controlId="${obj.id.slice(5)}">
                                    <div class="flow-wrap" draggable="true" style="background-color:#fff;border:3px dotted #7F7F91 !important; min-width:400px" data-id="${obj.id}" data-flow-type="flowContainer" >
                                        <div class="flow-card d-flex justify-content-between" style="height: 44px" >
                                            <div class="" style="display: flex;">
                                                <div style="width: 0;height: 0;border-top: 44px solid black;border-right: 44px solid transparent; display:none"></div>
                                                
                                                <div class="flow-title ml-3 d-flex justify-content-center align-items-center">
                                                    <span  data-title-for="${obj.id.slice(5)}" data-toggle="popover" data-popover-id="${obj.id.slice(5)}" title="${obj.description}">
                                                       ${obj.title}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="mr-1 d-flex justify-content-center align-items-center">
                                                <i class=" text-dark fas fa-eye-slash ml-2" data-icon-for="${obj.id.slice(5)}"></i>
                                                <a class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white ml-3 flow-delete" data-delete-flow="${obj.id.slice(5)}" >
                                                      <i class="flaticon2-cross"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flow-option " style="min-height:150px; display:none">
                                            <div class="m-5">
                                                <div class="form-group ">
                                                     <label class="font-weight-bolder">Display Name : </label>
                                                    <input type="text" class="form-control" value="${obj.title}" data-displayname-for="${obj.id.slice(5)}"  maxlength="39"/>
                                                 </div>
                                                <div class="form-group">
                                                    <label class="font-weight-bolder" for="exampleTextarea">Description :</label>
                                                    <textarea class="form-control form-control" rows="3" data-description-for="${obj.id.slice(5)}" >${obj.description}</textarea>
                                                </div>
                                            </div>
                                        </div>

                                       <div class="flow-container-container pr-10 pl-10 pt-0 pb-0" style="min-height:100px;" data-container-id="${obj.id.slice(5)}" data-container-container="${obj.id.slice(5)}">
                                             <div class="init-drop-zone" style="height:6vw; width:100%;" data-from="" data-to="">
                                        </div>

                                    </div>
                                </div>

`;
        },
        flowForLoop: function (obj) {
            obj = obj || { id: "" };
            return `
                                
                            <div class="flow common-flow-class" style="display: flex;justify-content: center;" data-for-controlId="${obj.id.slice(5)}">
                                    <div class="flow-wrap" draggable="true" style="background-color:#fff;border:3px solid #FF8300 !important; min-width:400px;border-left: 10px solid #FF8300 !important;" data-id="${obj.id}" data-flow-type="flowForLoop" >
                                        <div class="flow-card d-flex justify-content-between" style="height: 44px">
                                            <div class="" style="display: flex;">
                                                <div class="flow-icon  m-0 d-flex justify-content-start align-items-center" style="height:44px;width:91px;background-color:#ff8300" data-toggle="popover" data-popover-id="${obj.id.slice(5)}" title="${obj.description}">
                                                    <i class="flaticon-multimedia-2 text-white"></i>
                                                    <span class="ml-2 text-white font-weight-boldest"> For loop </span>
                                                </div>                                                
                                                <div class="flow-title ml-1 d-flex justify-content-center align-items-center">
                                                    
                                                     <code id="${obj.id.slice(5)}-Iterator">${obj.option["Iterator"]}</code>
                                                     <span class="ml-1 mr-1">from</span>
                                                     <code id="${obj.id.slice(5)}-StartValue">${obj.option["Start Value"]}</code>
                                                     <span class="ml-1 mr-1">to</span>
                                                     <code id="${obj.id.slice(5)}-EndValue">${obj.option["End Value"]}</code>
                                                     <span class="ml-1">by</span>
                                                     <code id="${obj.id.slice(5)}-Step">${obj.option["Step"]}</code>

                                                </div>
                                                
                                            </div>
                                            <div class="mr-1 d-flex justify-content-center align-items-center">
                                                <i class=" text-dark fas fa-eye-slash ml-2" data-icon-for="${obj.id.slice(5)}"></i>
                                                <a class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white ml-3 flow-delete" data-delete-flow="${obj.id.slice(5)}">
                                                      <i class="flaticon2-cross"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flow-option " style="min-height:150px; display:none">
                                            <div class="m-5">
                                                
                                                <div class="form-group">
                                                    <label class="font-weight-bolder" for="exampleTextarea">Description :</label>
                                                    <textarea class="form-control form-control" rows="3" data-description-for="${obj.id.slice(5)}" >${obj.description}</textarea>
                                                </div>
                                            </div>
                                        </div>

                                       <div class="flow-forloop-container p-5" style="min-height:150px;" data-container-id="${obj.id.slice(5)}" data-forloop-container="${obj.id.slice(5)}">

                                             <div class="init-drop-zone" style="height:6vw; width:100%;" data-from="" data-to="">

                                        </div>
                                    </div>
                                        <div class="d-flex align-items-center" style="height: 25px;border: ;background-color: #ff8300;">
                                                <span class=" text-white font-weight-boldest"> End </span>
                                        </div>
                                </div>

`;
        },
        flowForEach: function (obj) {
            obj = obj || { id: "" };
            return `
                                
                            <div class="flow common-flow-class" style="display: flex;justify-content: center;" data-for-controlId="${obj.id.slice(5)}">
                                    <div class="flow-wrap" draggable="true" style="background-color:#fff;border:3px solid #FF6C00 !important; min-width:400px;border-left: 10px solid #FF6C00 !important;" data-id="${obj.id}" data-flow-type="flowForEach">
                                        <div class="flow-card d-flex justify-content-between" style="height: 44px" >
                                            <div class="" style="display: flex;">
                                                <div class="flow-icon  m-0 d-flex justify-content-start align-items-center" style="height:44px;width:91px;background-color:#FF6C00" data-toggle="popover" data-popover-id="${obj.id.slice(5)}" title="${obj.description}">
                                                    <i class="flaticon-multimedia-2 text-white"></i>
                                                    <span class="ml-2 text-white font-weight-boldest"> For each </span>
                                                </div>                                                
                                                <div class="flow-title ml-3 d-flex justify-content-center align-items-center">
                                                    
                                                <code id="${obj.id.slice(5)}-VariableName">${obj.option["Variable Name"]}</code>
                                                <span class="ml-1 mr-1">in</span>
                                                <code id="${obj.id.slice(5)}-ActionsArray">${obj.option["Actions Array"]}</code>
                                            </div>
                                            </div>
                                            <div class="mr-1 d-flex justify-content-center align-items-center">
                                                <i class=" text-dark fas fa-eye-slash ml-2" data-icon-for="${obj.id.slice(5)}"></i>
                                                <a class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white ml-3 flow-delete" data-delete-flow="${obj.id.slice(5)}">
                                                      <i class="flaticon2-cross"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flow-option" style="min-height:150px; display:none">
                                            <div class="m-5">
                                                
                                                <div class="form-group">
                                                    <label class="font-weight-bolder" for="exampleTextarea">Description :</label>
                                                    <textarea class="form-control form-control" rows="3" data-description-for="${obj.id.slice(5)}">${obj.description}</textarea>
                                                </div>

                                            </div>
                                        </div>

                                       <div class="flow-foreach-container p-5" style="min-height:150px;" data-container-id="${obj.id.slice(5)}" data-foreach-container="${obj.id.slice(5)}">

                                             <div class="init-drop-zone" style="height:6vw; width:100%;" data-from="" data-to="">

                                        </div>
                                    </div>
                                        <div class="d-flex align-items-center" style="height: 25px;border: ;background-color: #FF6C00;">
                                                <span class=" text-white font-weight-boldest"> End </span>
                                        </div>
                                </div>

`;
        },
        flowWhile: function (obj) {
            obj = obj || { id: "" };
            return `
                                
                            <div class="flow common-flow-class" style="display: flex;justify-content: center;" data-for-controlId="${obj.id.slice(5)}">
                                    <div class="flow-wrap" draggable="true" style="background-color:#fff;border:3px solid #00B7FF !important; min-width:400px;border-left: 10px solid #00B7FF !important;" data-id="${obj.id}" data-flow-type="flowWhile" >
                                        <div class="flow-card d-flex justify-content-between" style="height: 44px">
                                            <div class="" style="display: flex;">
                                                <div class="flow-icon  m-0 d-flex justify-content-start align-items-center" style="height:44px;width:91px;background-color:#00B7FF" data-toggle="popover" data-popover-id="${obj.id.slice(5)}" title="${obj.description}">
                                                    <i class="flaticon-multimedia-2 text-white"></i>
                                                    <span class="ml-2 text-white font-weight-boldest"> While </span>
                                                </div>                                                
                                                <div class="flow-title ml-3 d-flex justify-content-center align-items-center">
                                                    
                                                     <code id="${obj.id.slice(5)}-ConditionExpression">${obj.option["Condition Expression"]}</code>
                                                
                                                </div>
                                            </div>
                                            <div class="mr-1 d-flex justify-content-center align-items-center">
                                                <i class=" text-dark fas fa-eye-slash ml-2" data-icon-for="${obj.id.slice(5)}"></i>
                                                <a class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white ml-3 flow-delete" data-delete-flow="${obj.id.slice(5)}" >
                                                      <i class="flaticon2-cross"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flow-option" style="min-height:150px; display:none">
                                            <div class="m-5">
                                                
                                                <div class="form-group">
                                                    <label class="font-weight-bolder" for="exampleTextarea">Description :</label>
                                                    <textarea class="form-control form-control" rows="3" data-description-for="${obj.id.slice(5)}">${obj.description}</textarea>
                                                </div>

                                            </div>
                                        </div>

                                       <div class="flow-while-container p-5" style="min-height:150px;" data-container-id="${obj.id.slice(5)}" data-while-container="${obj.id.slice(5)}">

                                             <div class="init-drop-zone" style="height:6vw; width:100%;" data-from="" data-to="">

                                        </div>
                                    </div>
                                        <div class="d-flex align-items-center" style="height: 25px;border: ;background-color: #00B7FF;">
                                                <span class="text-white font-weight-boldest"> End </span>
                                        </div>
                                </div>

`;
        },
        flowDoWhile: function (obj) {
            obj = obj || { id: "" };
            return `
                                
                            <div class="flow common-flow-class" style="display: flex;justify-content: center;" data-for-controlId="${obj.id.slice(5)}">
                                    <div class="flow-wrap" draggable="true" style="background-color:#fff;border:3px solid #2A8AB0 !important; min-width:400px;border-left: 10px solid #2A8AB0 !important;" data-id="${obj.id}" data-flow-type="flowWhile" >
                                        <div class="flow-card d-flex justify-content-between" style="height: 44px;background-color:#2A8AB0">
                                            <div class="" style="display: flex;">
                                                <div class="flow-icon  m-0 d-flex align-items-center" style="height:44px;width:91px;background-color:#2A8AB0" data-toggle="popover" data-popover-id="${obj.id.slice(5)}" title="${obj.description}">
                                                    <i class="flaticon-multimedia-2 text-white"></i>
                                                    <span class="ml-2 text-white font-weight-boldest"> Do </span>
                                                </div>                                                
                                                
                                            </div>
                                            <div class="mr-1 d-flex justify-content-center align-items-center">
                                                <i class=" text-dark fas fa-eye-slash ml-2" data-icon-for="${obj.id.slice(5)}"></i>
                                                <a class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white ml-3 flow-delete" data-delete-flow="${obj.id.slice(5)}">
                                                      <i class="flaticon2-cross"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flow-option" style="min-height:150px; display:none">
                                            <div class="m-5">
                                                
                                                <div class="form-group">
                                                    <label class="font-weight-bolder" for="exampleTextarea">Description :</label>
                                                    <textarea class="form-control form-control" rows="3" data-description-for="${obj.id.slice(5)}">${obj.description}</textarea>
                                                </div>

                                            </div>
                                        </div>

                                       <div class="flow-while-container p-5" style="min-height:150px;" data-container-id="${obj.id.slice(5)}" data-while-container="${obj.id.slice(5)}">

                                             <div class="init-drop-zone" style="height:6vw; width:100%;" data-from="" data-to="">

                                        </div>
                                    </div>
                                        <div class="flow-card d-flex justify-content-between" style="height: 30px">
                                            <div class="" style="display: flex;">
                                                <div class="flow-icon  m-0 d-flex  align-items-center" style="height:30px;width:91px;background-color:#2A8AB0">
                                                    
                                                    <span class="text-white font-weight-boldest"> While </span>
                                                </div>
                                                <div class="flow-title ml-3 d-flex justify-content-center align-items-center">

                                                     <code id="${obj.id.slice(5)}-ConditionExpression">${obj.option["Condition Expression"]}</code>

                                                </div>
                                            </div>
                                            
                                        </div>
                                </div>

`;
        },
        flowLink: function () {
            return `
                 <i class="flaticon2-arrow-down text-dark text-white" style="display: flex;align-items: center;justify-content: center;" ></i>
`;
        },
        flowCase: function (obj) {
            obj = obj || { id: "", switchId: "", show: true };
            return `
                                            <div class="flow-case p-5" style="${obj.show ? "" : "display: none;"} min-height: 150px;background-color: #ccc5c2;" data-case-id="${obj.id}" data-switch-id="${obj.switchId}">
                                                <div class="flow-case-container" data-container-id="${obj.id}"  style="width:100%";>
                                                    <div class="init-drop-zone" style="height:6vw; width:100%;" data-from="" data-to="">
                                                    
                                                    </div>
                                                </div>
                                            </div>
`;
        },
        caseTab: function (obj) {
            obj = obj || { id: "" };
            return `
                          <div class="p-1 ml-1 mr-1 flow-switch-case active-case" data-for-case="${obj.id}" style="border-radius: 0.20em;">
                                 <span class="m-2 font-weight-boldest flow-case-condition">
                                                       <span>Case</span> <span id="${obj.id}-Value">${obj.option["Value"]}</span> 
                                  </span>
                                  <span class="m-2"></span>
                                  <a  class="btn btn-hover-bg-danger btn-text-dark btn-hover-text-white flow-delete-case" data-delete-case="${obj.id}">
                                      <i class="flaticon2-cross"></i>
                                  </a>
                         </div>
`
        },
        initZone: function () {
            return `<div class="init-drop-zone" style="height:5vw;"></div>`;
        },
        beforeZone: function () {
            return `<div class="before-drop-zone" style="height:3vw;" data-from="" data-to=""></div>`;
        },
        linkZone: function () {
            return `<div class="link-drop-zone" style="height:2vw;display:flex;justify-content:center;align-items:center;" data-from="" data-to="">{content}</div>`;
        },
        endZone: function () {
            return `<div class="end-drop-zone" style="height:3vw;" data-from="" data-to=""></div>`;
        },
    },
    //Créer une zone pour l'action apres survol d'une zone de drop
    createDropZone: function (event, dragged) {
        let id;
        let checkId;
        let dataset = { ...event.target.dataset };
        let beforeZone = iamFlowBuider.templateHtml.beforeZone();
        let linkZone = iamFlowBuider.templateHtml.linkZone();
        let endZone = iamFlowBuider.templateHtml.endZone();
        let zone = `<div class="zone" id="{id}"></div>`
        let draggedId = $(dragged).attr("data-for-controlId") || $(dragged).attr("data-id").slice(5);


        //Si deposer dans init-zone
        if (event.target.className === "init-drop-zone") {

            event.target.id = iamShared.utils.guidString();
            id = event.target.id;

            //Verifier s'il ya un lien
            if (dataset["from"] == draggedId) {
                checkId = dataset["from"];
                return {
                    id: id,
                    checkId: checkId,
                };
            }

            $(beforeZone.replace("{from}", "").replace("{to}", draggedId)).insertBefore($(event.target));
            $(endZone.replace("{to}", "").replace("{from}", draggedId)).insertAfter($(event.target));

        }
        //Si deposer dans before-zone
        else if (event.target.className === "before-drop-zone") {

            id = iamShared.utils.guidString();
            $(zone.replace("{id}", id)).insertAfter($(event.target));
            $(linkZone.replace("{from}", draggedId)).insertAfter($("#" + id));
        }
        //Si deposer dans link-zone
        else if (event.target.className === "link-drop-zone") {

            id = iamShared.utils.guidString();
            $(zone.replace("{id}", id)).insertAfter($(event.target));
            $(linkZone.replace("{from}", draggedId)).insertAfter($("#" + id));
        }
        //Si deposer dans end-zone
        else if (event.target.className === "end-drop-zone") {

            id = iamShared.utils.guidString();
            $(zone.replace("{id}", id)).insertBefore($(event.target));
            $(linkZone.replace("{from}", draggedId)).insertBefore($("#" + id));
        }
        else {
            checkId = draggedId;
        }

        return {
            id: id,
            checkId: checkId,
        };
    },
    //Créer l'action/flow  correspondant dans la zone dediée
    dragHere: function (containerId, dragged, isSame = true, obj) {
        //Si deposer sur lui meme ne rien faire
        if (isSame) {
            return null;
        }
        let flowType = $(dragged).attr("data-flow-type");
        let initZone = iamFlowBuider.templateHtml.initZone();
        let moveObj = {
            id: null,
            prevId: null,
            containerId: null
        };


        if (flowType === "flow") {
            let initId;
            let init = false;
            let prevNode = $(dragged).parent().prev()["0"];
            let nextNode = $(dragged).parent().next()["0"];


            if ($(prevNode).hasClass("before-drop-zone") && $(nextNode).hasClass("end-drop-zone")) {
                initId = iamShared.utils.guidString();

                $(prevNode).replaceWith(initZone);


            }


            if ($(prevNode).hasClass("link-drop-zone")) {
                $(prevNode).remove();
            }
            if ($(prevNode).hasClass("before-drop-zone")) {
                $(nextNode).remove();
            }

            moveObj.containerId = $("#" + containerId).parent().attr("data-container-id");

            $("#" + containerId).replaceWith($(dragged).parent());
            if (init) {
                $("#" + initId).replaceWith(initZone);
            }
            moveObj.id = $(dragged).parent().attr("data-for-controlId");
            moveObj.prevId = $(dragged).parent().prevAll(".common-flow-class").attr("data-for-controlId");
        }
        if (flowType === "flowContainer" || flowType === "flowForLoop" || flowType === "flowForEach" || flowType === "flowWhile" || flowType === "flowDoWhile") {
            let initId;
            let init = false;
            let prevNode = $(dragged).parent().prev()["0"];
            let nextNode = $(dragged).parent().next()["0"];


            if ($(prevNode).hasClass("before-drop-zone") && $(nextNode).hasClass("end-drop-zone")) {
                initId = iamShared.utils.guidString();
                $(prevNode).replaceWith(initZone);
            }


            if ($(prevNode).hasClass("link-drop-zone")) {
                $(prevNode).remove();
            }
            if ($(prevNode).hasClass("before-drop-zone")) {
                $(nextNode).remove();
            }

            moveObj.containerId = $("#" + containerId).parent().attr("data-container-id");

            $("#" + containerId).replaceWith($(dragged).parent());
            if (init) {
                $("#" + initId).replaceWith(initZone);
            }
            moveObj.id = $(dragged).parent().attr("data-for-controlId");
            moveObj.prevId = $(dragged).parent().prevAll(".common-flow-class").attr("data-for-controlId");
        }

        else if (flowType === "flowIf") {
            let initId;
            let init = false;
            let prevNode = $(dragged).prev()["0"];
            let nextNode = $(dragged).next()["0"];

            if ($(prevNode).hasClass("before-drop-zone") && $(nextNode).hasClass("end-drop-zone")) {
                initId = iamShared.utils.guidString();
                $(prevNode).replaceWith(initZone);

                

            }


            if ($(prevNode).hasClass("link-drop-zone")) {
                $(prevNode).remove();
            }
            if ($(prevNode).hasClass("before-drop-zone")) {
                $(nextNode).remove();
            }

            moveObj.containerId = $("#" + containerId).parent().attr("data-container-id");


            $("#" + containerId).replaceWith($(dragged));
            if (init) {
                $("#" + initId).replaceWith(initZone);
            }
            moveObj.id = $(dragged).attr("data-for-controlId");
            moveObj.prevId = $(dragged).prevAll(".common-flow-class").attr("data-for-controlId");

        }
        else if (flowType === "flowSwitch") {
            let initId;
            let init = false;
            let prevNode = $(dragged).parent().prev()["0"];
            let nextNode = $(dragged).parent().next()["0"];


            if ($(prevNode).hasClass("before-drop-zone") && $(nextNode).hasClass("end-drop-zone")) {
                initId = iamShared.utils.guidString();

                $(prevNode).replaceWith(initZone);
            }


            if ($(prevNode).hasClass("link-drop-zone")) {
                $(prevNode).remove();
            }
            if ($(prevNode).hasClass("before-drop-zone")) {
                $(nextNode).remove();
            }


            moveObj.containerId = $("#" + containerId).parent().attr("data-container-id");

            $("#" + containerId).replaceWith($(dragged).parent());

            if (init) {
                $("#" + initId).replaceWith(initZone);
            }

            moveObj.id = $(dragged).parent().attr("data-for-controlId");
            moveObj.prevId = $(dragged).parent().prevAll(".common-flow-class").attr("data-for-controlId");
        }
        else {
            return;
        }

        //Deplacer la position de l'action/flow s'il ne s'agit pas d'une nouvelle creation 
        if (obj.flowType != "newFlow") {
            iamFlow.action.move(moveObj.id, moveObj.prevId, moveObj.containerId);
        }
        iamFlowBuider.createFromToLink();
    },
    //Creer lien flêché entre les actions
    createLink: function () {
        $(".link-drop-zone").css("height", "2vw").html(iamFlowBuider.templateHtml.flowLink());
        $(".flow-container-container").find("> .before-drop-zone").css("height", "1vw");
        $(".flow-container-container").find("> .end-drop-zone").css("height", "1vw");

    },
    //Contruire le type d'action  
    createActionFlow: function (actionType, content, selector, position, isDbclick = false) {
        const that = this;
        //Creer l'actionFlow
        let obj = iamFlow.action.create(actionType, position.prevId, position.containerId);

        let beforeZone = iamFlowBuider.templateHtml.beforeZone();
        let linkZone = iamFlowBuider.templateHtml.linkZone();
        let flowLink = iamFlowBuider.templateHtml.flowLink();
        let endZone = iamFlowBuider.templateHtml.endZone()

        const addFlowToContainer = (obj) => {
            //Pour doubleClick
            if (isDbclick) {
                $(".flow-container > .init-drop-zone").remove();
                $(".flow-container > .end-drop-zone").remove();
                $(".flow-container > .hidden-zone").remove();


                if ($(".flow").length >= 1) {
                    content += linkZone.replace("{content}", flowLink);
                }
                else {
                    selector.append(beforeZone);
                }
            }

            if (obj.Name == "IF") {
                content += iamFlowBuider.templateHtml.flowIf(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            else if (obj.Name == "CONTAINER") {
                content += iamFlowBuider.templateHtml.flowContainer(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description
                    }
                );
            }
            else if (obj.Name == "FOR_LOOP") {
                content += iamFlowBuider.templateHtml.flowForLoop(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            else if (obj.Name == "FOR_EACH") {
                content += iamFlowBuider.templateHtml.flowForEach(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            else if (obj.Name == "DO_WHILE") {
                content += iamFlowBuider.templateHtml.flowDoWhile(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            else if (obj.Name == "WHILE") {
                content += iamFlowBuider.templateHtml.flowWhile(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            else if (obj.Name == "SWITCH") {
                let caseObj1 = iamFlow.action.create("SWITCH_CASE", null, obj.Id);
                let caseObj2 = iamFlow.action.create("SWITCH_CASE", caseObj1.Id, obj.Id);

                content += iamFlowBuider.templateHtml.flowSwitch(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        caseId1: caseObj1.Id,
                        caseId2: caseObj2.Id,
                        option: [caseObj1.Options, caseObj2.Options, obj.Options]
                    }
                );
            }
            else {
                content += iamFlowBuider.templateHtml.flow(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName.length > 39 ? obj.DisplayName.slice(0,36) + "..." : obj.DisplayName,
                        description: obj.Description
                    }
                );
            }
            selector.append(content);
            that.flow.bindEventTo(obj);
            //Pour doubleClick
            if (isDbclick) {
                selector.append(endZone);
                selector.append(`<div class="hidden-zone" style="height:2vw; background-color: #00FF34;display:none"></div>`);
                iamFlowBuider.createFromToLink();
            }

        }

        addFlowToContainer(obj);
        iamFlow.propertyGrid.showItemInPropertyGrid(obj);

        //Retourner l'actionFlow
        return obj;
    },
    //Lier chaque LinkZone aux actions voisins
    createFromToLink: function () {
        let allFlow = $(".common-flow-class").toArray();

        if (allFlow.length == 0) return;



        allFlow.forEach((flow) => {
            let id = $(flow).attr("data-for-controlId");
            let prevFlow = $(flow).prev();
            let nextFlow = $(flow).next();

            prevFlow.attr("data-to", id);
            nextFlow.attr("data-from", id);
        });

    },
    //Importer un nouveau flow
    importBuilder: function (item) {
        let content = "";
        let selector;
        let obj = item;

        let beforeZone = iamFlowBuider.templateHtml.beforeZone();
        let linkZone = iamFlowBuider.templateHtml.linkZone();
        let endZone = iamFlowBuider.templateHtml.endZone();



        if (obj.ParentId == undefined) {
            selector = $(".flow-container");
        }
        else {
            selector = $(`[data-container-id="${obj.ParentId}"]`);
        }


        const addFlowToContainer = (obj) => {


            selector.find("> .init-drop-zone").remove();
            selector.find(" > .end-drop-zone").remove();
            selector.find(" > .hidden-zone").remove();

            if (selector.find("> .common-flow-class").length >= 1) {
                content += linkZone.replace("{content}", iamFlowBuider.templateHtml.flowLink());
            }
            else {
                selector.append(beforeZone);
            }
            //Construction des IF 
            if (obj.Name == "IF") {
                content += iamFlowBuider.templateHtml.flowIf(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            //Construction des IF 
            else if (obj.Name == "CONTAINER") {
                content += iamFlowBuider.templateHtml.flowContainer(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description
                    }
                );
            }
            else if (obj.Name == "FOR_LOOP") {
                content += iamFlowBuider.templateHtml.flowForLoop(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            else if (obj.Name == "FOR_EACH") {
                content += iamFlowBuider.templateHtml.flowForEach(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            else if (obj.Name == "DO_WHILE") {
                content += iamFlowBuider.templateHtml.flowDoWhile(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            else if (obj.Name == "WHILE") {
                content += iamFlowBuider.templateHtml.flowWhile(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: obj.Options
                    }
                );
            }
            //Construction des SWITCH
            else if (obj.Name == "SWITCH") {
                content += iamFlowBuider.templateHtml.flowSwitch(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName,
                        description: obj.Description,
                        option: [{}, {}, obj.Options]
                    }
                );
            }
            //Construction des CASE
            else if (obj.Name == "SWITCH_CASE") {
                
                $(iamFlowBuider.templateHtml.caseTab({
                    id: obj.Id,
                    option: obj.Options
                })).insertBefore($(`[data-set-case-position="${obj.ParentId}"]`));
                $(`[data-switch-case-container="${obj.ParentId}"]`).append(iamFlowBuider.templateHtml.flowCase(
                    {
                        id: obj.Id,
                        switchId: obj.ParentId,

                        show: false
                    }
                ));


            }
            else {
                content += iamFlowBuider.templateHtml.flow(
                    {
                        id: "flow_" + obj.Id,
                        title: obj.DisplayName.length > 39 ? obj.DisplayName.slice(0, 36) + "..." : obj.DisplayName,
                        description: obj.Description
                    }
                );
            }

            selector.append(content);
            selector.append(endZone);
            selector.append(`<div class="hidden-zone" style="height:2vw; background-color: #00FF34;display:none"></div>`);
            iamFlowBuider.createFromToLink();


            if (obj.Name == "SWITCH") {
                $(`[data-add-case-for="${obj.Id}"]`).siblings().not(".set-case-position").remove();
                $(`[data-add-case-for="${obj.Id}"]`).parent().siblings().not(".set-case-position").remove();
            }
            if (obj.Name == "SWITCH_CASE") {
                $(`[data-set-case-position="${obj.ParentId}"]`).siblings().removeClass("active-case");
                $(`[data-set-case-position="${obj.ParentId}"]`).prev().addClass("active-case");

                $(`[data-switch-id="${obj.ParentId}"]`).hide();

                $(`[data-switch-id="${obj.ParentId}"]`).last().show();

                iamFlowBuider.flow.events.setCasePositionActive($(`[data-set-case-position="${obj.ParentId}"]`).prev(), $(`[data-set-case-position="${obj.ParentId}"]`));

            }

            //Ajouter les events liés à cette action dans le DOM
            iamFlowBuider.flow.bindEventTo(obj);
        }


        addFlowToContainer(obj);
    },
    //Créer l'evenement d'un element || selector : l'element sur lequel doit se declencher l'event, eventObj: l'ensemble des events qui seront lié à l'element
    createEvent: function (selector, eventObj) {
        for (const event in eventObj) {
            selector.on(event, eventObj[event]);
        }
    },
    //Aside section
    aside: {
        //Poin d'initialisation de la zone ASIDE
        init: function () {
            iamFlowBuider.aside.create("toolboxActionTypeIA", iamFlowBuider.actions);
        },
        //Créer la zone Left-Aside
        create: function (containerId, actions) {
            if (!actions) return;
            const that = this;
            let content = "";
            let categoriesObj = actions.ActionCategories;
            let actionsObj = actions.ActionTypes;
            let actionsArray = Object.values(actionsObj);


            for (const property in categoriesObj) {
                const category = categoriesObj[property]
                const actionsByCategory = actionsArray.filter(action => action.Category == category.Name);

                content += iamFlowBuider.aside.createCaterogy(category, actionsByCategory);

            }

            $("#" + containerId).html(content);
            //iamFlowBuider.eventHandler();
            
        },
        //Créer les categories dans la zone Left-Aside 
        createCaterogy: function (category, actionTypes) {
            const that = this;
            let itemContent = "";

            actionTypes.forEach((action) => {
                itemContent += iamFlowBuider.aside.createCaterogyItems({
                    id: action.Name,
                    name: action.DisplayName,
                    icon: action.Icon || `<i class="flaticon2-box"></i>`,
                })
            });
            return iamFlowBuider.aside.groupHTML({
                id: category.Name,
                id_body: category.Name + "_body",
                name: category.Name,
                content: itemContent,
                icon: category.Icon || ""
            }
            );
        },
        //Créer les Items de chaque categorie
        createCaterogyItems: function (obj) {
            if (!obj) return;
            return iamFlowBuider.aside.actionHTML(obj);
        },
        //HTML template pour groupe
        groupHTML: function (obj) {
            return iamFlowBuider.templateHtml.actionTypesGroup(obj);
        },
        //HTML template pour action de chaque groupe
        actionHTML: function (obj) {
            return iamFlowBuider.templateHtml.actionTypesItem(obj);
        },
    },
    //Events initiaux après chargement de page
    initEvent: function () {
        //let that = this;
        let dragged;
        let isDragOverItself = false;
        
        const createFlowByDbclick = (e) => {
            let actionType = $(e.currentTarget).attr("id");
            let selector = $(".flow-container");
            let prevId = $("#flow-container > .common-flow-class").last().attr("data-for-controlid");
            iamFlowBuider.flow.createFlowByDbclick(actionType, selector, prevId);
        }; 
        const diselectall = iamFlowBuider.flow.events.diselectAll ;


        //Créer event double-clic pour création d'une action
        this.createEvent($(".flow-list-item"), {
            "dblclick": createFlowByDbclick,
        });
        //Créer event pour deselectionner les flow/actions active
        this.createEvent($("#iamFlowColDiv"), {
            "click": diselectall,
        });
        //Créer event pour DRAG & DROP
        this.createEvent($("body"), {

            "dragstart": function (e) {
                $(this).css('opacity', '0.5');
                // e.dataTransfer.effectAllowed = "copy";
                dragged = e.target;

            },
            "dragend": function (e) {
                $(this).css('opacity', '1');
            },
            "dragover": function (e) {
                e.preventDefault();
                let selection = e.target;
                let dropId;
                let draggedId;
                let dropInDragged;

                dropId = $(selection).parents(".common-flow-class").first().attr("data-for-controlid");
                dropInDragged = $(dragged).find(`[data-for-controlid="${dropId}"]`);

                //Si la selection se fait sur un IF
                if ($(dragged).attr("data-flow-type") == "flowIf") {
                    draggedId = $(dragged).attr(`data-for-controlid`);
                }
                //Si la selection se fait sur un SWITCH
                else if ($(dragged).attr("data-flow-type") == "flowSwitch") {
                    draggedId = $(dragged).parent().attr(`data-for-controlid`);
                }
                //Si la selection se fait sur un FLOW STANDARD
                else if ($(dragged).attr("data-flow-type") == "flow") {
                    //$("#iamMainToolbarContainer").css("background-color", "#FFF");
                    isDragOverItself = false;
                    return;
                }
                else if ($(dragged).attr("data-flow-type") == "flowContainer" || $(dragged).attr("data-flow-type") == "flowForLoop" || $(dragged).attr("data-flow-type") == "flowForLoop" || $(dragged).attr("data-flow-type") == "flowForEach" || $(dragged).attr("data-flow-type") == "flowWhile" || $(dragged).attr("data-flow-type") == "flowDoWhile") {
                    draggedId = $(dragged).parent().attr(`data-for-controlid`);
                }
                //Si la selection se fait sur le côté
                else if ($(dragged).attr("data-flow-type") == "newFlow") {
                    //$("#iamMainToolbarContainer").css("background-color", "#FFF");
                    isDragOverItself = false;
                    return;
                }


                if (((dropInDragged.length == 1) || dropId == draggedId)) {
                    //$("#iamMainToolbarContainer").css("background-color", "red");
                    isDragOverItself = true;
                }
                else {
                    //$("#iamMainToolbarContainer").css("background-color", "#FFF");
                    isDragOverItself = false;
                }




            },
            "dragenter": function (e) {

                if ((e.target.className === "init-drop-zone") || e.target.className === "before-drop-zone" || e.target.className === "link-drop-zone" || e.target.className === "end-drop-zone") {
                    e.target.style.border = '3px dashed #000';
                    $(e.target).find("> i").toggleClass("flaticon2-plus-1").toggleClass("flaticon2-arrow-down")
                }
            },
            "dragleave": function (e) {
                if ((e.target.className === "init-drop-zone") || (e.target.className === "before-drop-zone") || (e.target.className === "link-drop-zone") || (e.target.className === "end-drop-zone")) {
                    e.target.style.border = 'none';
                    $(e.target).find("> i").toggleClass("flaticon2-plus-1").toggleClass("flaticon2-arrow-down");
                    $(".hidden-zone").siblings(".init-drop-zone").css("border", "2px dashed #000");
                }


            },
            "drop": function (e) {
                let content = "";
                let flowType = $(dragged).attr("data-flow-type");

                e.preventDefault();
                e.target.style.border = 'none';

                //Si on veut deposer sur lui meme
                if (isDragOverItself) {
                    return;
                }
                //Créer une nouvelle action/flow par un D&D à partir de l'aside section
                if (flowType === "newFlow") {
                    //Si non dans une zone de drop sortir !
                    if (!(e.target.className == "init-drop-zone" || e.target.className == "before-drop-zone" || e.target.className == "link-drop-zone" || e.target.className == "end-drop-zone")) {
                        return;
                    }

                    let actionType = $(dragged).attr("id");



                    $(".hidden-zone").html("");
                    //Creer une action dans hidden-zone
                    actionTypeObj = iamFlowBuider.createActionFlow(actionType, content, $(".hidden-zone"), {});
                    if (actionType === "IF") {
                        dragged = $(".hidden-zone").find(">:first-child")["0"];
                    }
                    else {
                        dragged = $(".hidden-zone").find(">:first-child").find(">:first-child")["0"];
                    }


                    
                    let dropZoneObj = iamFlowBuider.createDropZone(e, dragged)
                    iamFlowBuider.dragHere(dropZoneObj.id, dragged, false, { flowType: flowType, movePosition: "" });
                    iamFlowBuider.createLink();
                    $(".hidden-zone").html("");

                    //Retirer l'action de la zone cachée : hidden-zone
                    if ($(dragged).attr("data-flow-type") == "flowIf") {

                        iamFlow.action.move($(dragged).attr("data-for-controlid"), $(dragged).prevAll(".common-flow-class").attr("data-for-controlid"), $(dragged).parent().attr("data-container-id"));
                        
                    }
                    else {
                        iamFlow.action.move($(dragged).parent().attr("data-for-controlid"), $(dragged).parent().prevAll(".common-flow-class").attr("data-for-controlid"), $(dragged).parent().parent().attr("data-container-id"));
                        
                    }



                }
                else {
                    //Si non dans une zone de drop sortir !
                    if (!(e.target.className == "init-drop-zone" || e.target.className == "before-drop-zone" || e.target.className == "link-drop-zone" || e.target.className == "end-drop-zone")) {
                        return;
                    }


                    draggedId = $(dragged).attr("data-for-controlId") || $(dragged).attr("data-id").slice(5);
                    let dropZoneObj = iamFlowBuider.createDropZone(e, dragged)
                    iamFlowBuider.dragHere(dropZoneObj.id, dragged, false, { flowType: flowType, movePosition: "" });
                    iamFlowBuider.createLink();

                    $(".hidden-zone").html("");
                }


            }
        })
    },
    flow: {
        //Methode pour création de flow/action en double cliquant
        createFlowByDbclick: function (actionType, selector, prevId) {
            let content = "";
            let obj = iamFlowBuider.createActionFlow(actionType, content, selector, { prevId: prevId }, true);

            iamFlow.propertyGrid.showItemInPropertyGrid(obj);
        },
        //Ensemble des events liés au flow/action
        events: {
            addCaseHandler: function (e) {
                let selector = $(e.currentTarget);
                let switchId = selector.attr("data-add-case-for");
                let beforecaseId = selector.siblings(".flow-switch-case").last().attr("data-for-case");
                let actionType = iamFlow.action.create("SWITCH_CASE", beforecaseId, switchId);
                let obj = {
                    caseId: actionType.Id,
                    switchId: switchId,
                    option: actionType.Options
                }
                let content = iamFlowBuider.templateHtml.flowCase({ id: obj.caseId, switchId: obj.switchId, show: true });
                let caseTab = iamFlowBuider.templateHtml.caseTab({ id: obj.caseId, option: obj.option });

                selector.siblings(".flow-switch-case").removeClass("active-case");
                $(caseTab).insertBefore(selector.siblings(".set-case-position"));
                $(`[data-switch-case-container="${$(selector).attr("data-add-case-for")}"]`).append(content.replaceAll("{caseId}", obj.caseId).replaceAll("{switchId}", obj.switchId));
                $(`[data-case-id="${obj.caseId}"]`).siblings(".flow-case").hide();

                iamFlowBuider.flow.bindEventTo(actionType,false);
                iamFlow.propertyGrid.showItemInPropertyGrid(actionType);

                iamFlowBuider.flow.events.setCasePositionActive(selector.siblings(".active-case"), selector.siblings(".set-case-position"));
                e.stopPropagation();
            },
            deleteFlowHandler: function (id) {
                
                const element = $(`[data-for-controlid="${id}"]`);
                const prev = $(`[data-for-controlid="${id}"]`).prev();
                const next = $(`[data-for-controlid="${id}"]`).next();

                if (element.siblings(".common-flow-class").length > 0) {
                    if (prev.hasClass("before-drop-zone")) {
                        element.remove();
                        next.remove();
                    }
                    else {
                        prev.remove();
                        element.remove();
                    }
                }
                else {
                    if (element.parent().attr("data-container-id")) {
                        element.parent().append(`<div class="init-drop-zone" style="height:5vw;"></div>`);
                        element.remove();
                        prev.remove();
                        next.remove();
                    }
                    else {
                        element.parent().append(`<div class="init-drop-zone" style="height:100%;border:2px dashed #7F7F91 !important"></div>`);
                        element.remove();
                        prev.remove();
                        next.remove();
                    }

                }
                
                iamFlow.action.delete(id);
            },
            deleteCaseHandler: function (e) {
                const selector = $(e.currentTarget);
                const caseId = selector.attr("data-delete-case");
                const firstBrother = $(`[data-for-case="${caseId}"]`).siblings(".flow-switch-case").first();

                if ($(`[data-for-case="${caseId}"]`).siblings(".flow-switch-case").length >= 2) {

                    $(`[data-for-case="${caseId}"]`).remove();
                    $(`[data-case-id="${caseId}"]`).remove();
                    firstBrother.siblings(".flow-switch-case").removeClass("active-case");
                    firstBrother.addClass("active-case");
                    $(`[data-case-id="${firstBrother.attr("data-for-case")}"]`).show().siblings(".flow-case").hide();

                    iamFlow.action.delete(caseId);
                }
            },
            showCaseHandler: function (e) {
                let selector = $(e.currentTarget);
                let flowId = selector.attr("data-for-case");
                let obj = iamFlow.action.get(flowId);

                selector.siblings(".flow-switch-case").removeClass("active-case");
                selector.addClass("active-case");
                $(`[data-case-id="${$(selector).attr("data-for-case")}"]`).show().siblings(".flow-case").hide();
                iamFlowBuider.flow.events.setCasePositionActive(selector, selector.siblings(".set-case-position"));

                iamFlow.propertyGrid.showItemInPropertyGrid(obj);
                e.stopPropagation();
            },
            showOptionHandler: function (e) {
                $(e.currentTarget).siblings(".flow-option").toggle();
            },
            showContainerHandler: function (e) {
                e.stopPropagation();
                const selector = $(e.currentTarget);
                const id = selector.attr("data-icon-for");

                selector.toggleClass("fa-eye-slash").toggleClass("fa-eye");

                if (selector.hasClass("fa-eye")) {
                    $(`[data-if-container="${id}"]`).hide();
                    $(`[data-switch-case-container="${id}"]`).hide();
                    $(`[data-container-container="${id}"]`).hide();
                    $(`[data-forloop-container="${id}"]`).hide();
                    $(`[data-foreach-container="${id}"]`).hide();
                    $(`[data-while-container="${id}"]`).hide();
                    $(`[data-dowhile-container="${id}"]`).hide();
                }
                else {
                    $(`[data-if-container="${id}"]`).show();
                    $(`[data-switch-case-container="${id}"]`).show();
                    $(`[data-container-container="${id}"]`).show();
                    $(`[data-forloop-container="${id}"]`).show();
                    $(`[data-foreach-container="${id}"]`).show();
                    $(`[data-while-container="${id}"]`).show();
                    $(`[data-dowhile-container="${id}"]`).show();
                }

            },
            showPropertyGridHandler: function (e, flowId) {
                e.stopPropagation();
                const selector = $(e.currentTarget);
                let obj = iamFlow.action.get(flowId);
                
                
                iamFlowBuider.flow.events.diselectAll();
                iamFlow.propertyGrid.showItemInPropertyGrid(obj);

                $(selector).css({
                    "outline": "none",
                    "transform": "scale(1.01)"
                });
                $(`[data-if-container="${flowId}"]`).css({
                    "outline": "none",
                    "transform": "scale(1.01)"
                });
                if (selector.attr("data-flow-type") == "flow") {
                    $(selector).css({
                        "box-shadow": "0 0 0 5px rgba(21, 156, 228, 0.26)"
                    });
                }
                else if ((selector.attr("data-flow-type") == "flowForLoop") || (selector.attr("data-flow-type") == "flowForEach")) {
                    $(selector).css({
                        "box-shadow": "0 0 0 5px rgba(228, 108, 21, 0.26)",
                        "transform": "scale(1.01)"
                    });
                }
                else if ((selector.attr("data-flow-type") == "flowWhile") || (selector.attr("data-flow-type") == "flowDoWhile")) {
                    $(selector).css({
                        "box-shadow": "0 0 0 5px rgba(0, 183, 255, 0.26)",
                        "transform": "scale(1.01)"
                    });
                }
                else if (selector.attr("data-flow-type") == "flowSwitch") {
                    $(selector).css({
                        "box-shadow": "0 0 0 5px rgba(134, 21, 228, 0.26)"
                    });

                }
                else if (selector.attr("data-flow-type") == "flowIf") {
                    $(selector).css({
                        "box-shadow": "0 0 0 5px rgba(0, 0, 0, 0.26)"
                    });

                }
            },
            editHandler: function (e) {
                e.stopPropagation();
                let displayNameId = $(e.currentTarget).attr("data-displayname-for");
                let descriptionId = $(e.currentTarget).attr("data-description-for");
                let newValue = $(e.currentTarget).val();

                if (descriptionId == undefined) {
                    $(`[data-title-for="${displayNameId}"]`).html(newValue);
                    iamFlow.action.update(displayNameId, { DisplayName: newValue })
                }
                else {
                    iamFlow.action.update(descriptionId, { Description: newValue })
                    $(`[data-popover-id="${descriptionId}"]`).attr("title", newValue);
                }

            },
            setCaseBackHandler: function (e) {
                const selector = $(e.currentTarget);
                const controlSelector = selector.parent();
                const element = controlSelector.siblings(".active-case")
                const prev = element.prev(".flow-switch-case");

                $(element).insertBefore(prev);
                iamFlowBuider.flow.events.setCasePositionActive(element, controlSelector);
                iamFlow.action.move(element.attr("data-for-case"), element.prev(".flow-switch-case").attr("data-for-case"), element.siblings(".set-case-position").attr("data-set-case-position"))

            },
            setCaseNextHandler: function (e) {
                const selector = $(e.currentTarget);
                const controlSelector = selector.parent();
                const element = controlSelector.siblings(".active-case")
                const prev = element.prev(".flow-switch-case");
                const next = element.next(".flow-switch-case");

                $(element).insertAfter(next);

                iamFlowBuider.flow.events.setCasePositionActive(element, controlSelector);
                iamFlow.action.move(element.attr("data-for-case"), element.prev(".flow-switch-case").attr("data-for-case"), element.siblings(".set-case-position").attr("data-set-case-position"))

            },
            setCasePositionActive: function (activeselector, setcaseselector) {
                const prev = activeselector.prev(".flow-switch-case");
                const next = activeselector.next(".flow-switch-case");

                if (prev.length == 0) {
                    setcaseselector.find("> .set-case-position-back").removeClass("text-info");
                    setcaseselector.find("> .set-case-position-next").removeClass("text-info").addClass("text-info");
                }
                else if (next.length == 0) {
                    setcaseselector.find("> .set-case-position-back").removeClass("text-info").addClass("text-info");
                    setcaseselector.find("> .set-case-position-next").removeClass("text-info");
                }
                else {
                    setcaseselector.find("> .set-case-position-back").removeClass("text-info").addClass("text-info");
                    setcaseselector.find("> .set-case-position-next").removeClass("text-info").addClass("text-info");
                }
            },
            diselectAll: function () {
                $(".flow-wrap, [data-if-container]").css({
                    "outline": "none",
                    "transform": "none",
                    "box-shadow": "none"
                });
                iamFlow.propertyGrid.showItemInPropertyGrid(null);
            },
        },
        //Methode pour lier une action à tous ses events, dans le DOM
        bindEventTo: function (obj, isCommonEvent = true) {

            //Les event communs à tous types de flow/action
            if (isCommonEvent) {

            const deleteFlow = () => { iamFlowBuider.flow.events.deleteFlowHandler(obj.Id); };
            const dbClickForShowOption = (e) => { iamFlowBuider.flow.events.showOptionHandler(e); };
            const showFlowContainer = (e) => { iamFlowBuider.flow.events.showContainerHandler(e); };
            const editDisplayNameDescription = (e) => { iamFlowBuider.flow.events.editHandler(e); };
            const showPropertyGrid = (e) => { iamFlowBuider.flow.events.showPropertyGridHandler(e, obj.Id); };

            // Supprimer une action/flow
            iamFlowBuider.createEvent($(`[data-delete-flow="${obj.Id}"]`), {
                "click": deleteFlow,
            });
            // Masquer/Afficher container
            iamFlowBuider.createEvent($(`[data-icon-for="${obj.Id}"]`), {
                "click": showFlowContainer,
            });
            // Etiter displayName & Description
            iamFlowBuider.createEvent($(`[data-displayname-for="${obj.Id}"], [data-description-for="${obj.Id}"]`), {
                    "change": editDisplayNameDescription,
                });
            // Masquer/Afficher les options (DisplayName, description,...) de chaque action/flow
            iamFlowBuider.createEvent($(".flow-card"), {
                "dblclick": dbClickForShowOption,
            });
            // Afficher les options specifiques de chaque action/flow
            iamFlowBuider.createEvent($(`[data-id="flow_${obj.Id}"]`), {
                 "click": showPropertyGrid,
            })
        }

            if (obj.Name ==="IF") {

            }
            else if (obj.Name === "SWITCH") {
                const addCaseToSwitch = (e) => { iamFlowBuider.flow.events.addCaseHandler(e); };
                const showCase = (e) => { iamFlowBuider.flow.events.showCaseHandler(e); };
                const setCaseBack = (e) => { iamFlowBuider.flow.events.setCaseBackHandler(e); };
                const setCaseNext = (e) => { iamFlowBuider.flow.events.setCaseNextHandler(e); };
                const deleteCase = (e) => { iamFlowBuider.flow.events.deleteCaseHandler(e); };

                // Ajouter noueau CASE
                iamFlowBuider.createEvent($(`[data-add-case-for="${obj.Id}"]`), {
                    "click": addCaseToSwitch,
                });
                // Changer position d'un CASE en arriere
                iamFlowBuider.createEvent($(`[data-set-case-position="${obj.Id}"] > .set-case-position-back`), {
                    "click": setCaseBack,
                });
                // Changer position d'un CASE en avant
                iamFlowBuider.createEvent($(`[data-set-case-position="${obj.Id}"] > .set-case-position-next`), {
                    "click": setCaseNext,
                });
                // Rendre CASE actif
                iamFlowBuider.createEvent($(`[data-for-case="${obj.Items[0].Id}"],[data-for-case="${obj.Items[1].Id}"]`), {
                    "click": showCase,
                });
                // Supprimer CASE
                iamFlowBuider.createEvent($(`[data-delete-case="${obj.Items[0].Id}"],[data-delete-case="${obj.Items[1].Id}"]`), {
                    "click": deleteCase,
                });
            }
            else if (obj.Name === "SWITCH_CASE") {
                const showCase = (e) => { iamFlowBuider.flow.events.showCaseHandler(e); };
                const deleteCase = (e) => { iamFlowBuider.flow.events.deleteCaseHandler(e); };
                // Rendre CASE actif
                iamFlowBuider.createEvent($(`[data-for-case="${obj.Id}"]`), {
                    "click": showCase,
                });
                // Supprimer CASE
                iamFlowBuider.createEvent($(`[data-delete-case="${obj.Id}"]`), {
                    "click": deleteCase,
                });
            }
            else if (obj.Name === "CONTAINER") {

            }
            else if (obj.Name === "FOR_LOOP") {

            }
            else if (obj.Name === "FOR_EACH") {

            }
            else if (obj.Name === "WHILE") {

            }
            else if (obj.Name === "DO_WHILE") {

            }
        },
        //Ensemble de HTML template
        templates: {
            defaultFlowHTML: function (obj) {
                return iamFlowBuider.templateHtml.flow(obj);
            },
            flowIfHTML: function (obj) {
                return iamFlowBuider.templateHtml.flowIf(obj);
            },
            flowSwitchHTML: function (obj) {
                return iamFlowBuider.templateHtml.flowSwitch(obj);
            },
            flowContainerHTML: function (obj) {
                return iamFlowBuider.templateHtml.flowContainer(obj);
            },
            flowForLoopHTML: function (obj) {
                return iamFlowBuider.templateHtml.flowForLoop(obj);
            },
            flowForEachHTML: function (obj) {
                return iamFlowBuider.templateHtml.flowForEach(obj);
            },
            flowWhileHTML: function (obj) {
                return iamFlowBuider.templateHtml.flowWhile(obj);
            },
            flowDoWhileHTML: function (obj) {
                return iamFlowBuider.templateHtml.flowDoWhile(obj);
            },
            flowLinkHTML: function () {
                return iamFlowBuider.templateHtml.flowLink();
            },
            flowCaseHTML: function (obj) {
                return iamFlowBuider.templateHtml.flowCase(obj);
            },
            caseTabHTML: function (obj) {
                return iamFlowBuider.templateHtml.caseTab(obj);
            },
            initZoneHTML: function () {
                return iamFlowBuider.templateHtml.initZone(obj);
            },
            beforeZoneHTML: function () {
                return iamFlowBuider.templateHtml.beforeZone(obj);
            },
            linkZoneHTML: function () {
                return iamFlowBuider.templateHtml.linkZone(obj);
            },
            endZoneHTML: function () {
                return iamFlowBuider.templateHtml.endZone(obj);
            },
        },
    }
};

