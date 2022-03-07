/// <reference path="ia-common.js" />
/// <reference path="jquery-ui.min.js" />
/// <reference path="../dxlib/js/jquery.min.js" />
var formulaParser = import('./formula-parser.min.js');

var iamQF = {
    //template utiles

    quickForms: [],//Tableau des quickforms créés

    propertyGrids: [], //Tableau des propertyGrids créés
    activePropertyGridForm: null,
    activePropertyGridObject: null,
    activeForm: null,
    loadedFormsDatasources: [],//Tableau des noms des forms dont les dataSourcs des controles ont été chargés
    activeFormsData: [], //conserve les data fourni et devant etre mise a jour pour les quickforms actif car formData du dxForm ne conserve que les valeurs modifiées

    //permet de créer un QF depuis une chaine pour faire un test ou l'intégrer dynamquement au tableau des QF et l'utiliser par action ultérieurement et autre
    createFormFromString: function (strFrm, data, recreate = false, showAfterCreate = true) {
        if (!strFrm) {
            return null;
        } else {
            let frmObj = JSON.parse(strFrm);
            //créer l'élément et l'afficher si nécessaire          
            this.createForm(frmObj, data, recreate, null, showAfterCreate);
            return;
        }
    },

    //Masquer tous les groupes
    hideAllGroups: function (frmObj, frm, app) {
        let steps = DevExpress.data.query(frmObj.Steps)
            .sortBy("OrderNumber")
            .toArray();

        steps.forEach(function (step) {
            //let DisplayName = step.DisplayName || app.localize(step.Name);

            //frm.itemOption(DisplayName, "visible", false);
            frm.itemOption(step.Name, "visible", false);
        });
    },

    //Activer le bon groupe depuis le OrderNumber
    activateGroupByOrderNumber: function (frmObj, frm, app, gpOrderNumber) {
        let dxQ = DevExpress.data.query(frmObj.Steps)
            .filter(["OrderNumber", "=", gpOrderNumber]);

        dxQ.count().done(function (value) {
            if (value == 0) {
                return; 
            }else{
                //this.activateGroupByDisplayName(frmObj, frm, app, (dxQ.toArray()[0].DisplayName || app.localize(dxQ.toArray()[0].Name)));
                this.activateGroupByName(frmObj, frm, app, dxQ.toArray()[0].Name);
            }
        });
        

        
    },

    //Activer le bon groupe depuis le Name
    activateGroupByName: function (frmObj, frm, app, gpName) {

        //let dxQ = DevExpress.data.query(frmObj.Steps)
        //    .filter(["Name", "=", gpName]);

        //if (dxQ.count() == 0) return;

        //this.activateGroupByDisplayName(frmObj, frm, app, (dxQ.toArray()[0].DisplayName || app.localize(dxQ.toArray()[0].Name)));

        let steps = frmObj.Steps;
        steps.forEach(function (step) {
            //let DisplayName = iamShared.strings.removeAllWhiteSpaces(step.DisplayName || app.localize(step.Name));

            if (step.Name == gpName) {

                frm.itemOption(step.Name, "visible", true);
            } else {
                frm.itemOption(step.Name, "visible", false);
            }

        });
    },

    //Activer le bon groupe depuis le DisplayName
    activateGroupByDisplayName: function (frmObj, frm, app, gpDisplayName) {
        let steps = DevExpress.data.query(frmObj.Steps)
            .sortBy("OrderNumber")
            .toArray();


        steps.forEach(function (step) {
            let DisplayName = step.DisplayName || ((!app || !app.localize) ? step.Name : app.localize(step.Name)) ;

            if (gpDisplayName == DisplayName) {
                frm.itemOption(iamShared.strings.removeAllWhiteSpaces(DisplayName), "visible", true);
            } else {
                frm.itemOption(iamShared.strings.removeAllWhiteSpaces(DisplayName), "visible", false);
            }
        });
    },

    //Activer le bon groupe depuis la position (index) dans la collection
    activateGroupByOrderIndex: function (frmObj, frm, app, gpOrderIndex) {
        let steps;

        if (frmObj.IgnoreStepsOrderNumber) {
            //Ne pas ordonner les steps depuis le OrderNumer. Utiliser la position dans la collection
            steps = frmObj.Steps;
        } else {
            //Ordonner les steps depuis le OrderNumer
            steps = DevExpress.data.query(frmObj.Steps)
                .sortBy("OrderNumber")
                .toArray();
        }

        let i = 0;
        steps.forEach(function (step) {
            //let DisplayName = iamShared.strings.removeAllWhiteSpaces(step.DisplayName || app.localize(step.Name));

            if (i == gpOrderIndex) {

                frm.itemOption(step.Name, "visible", true);
            } else {
                frm.itemOption(step.Name, "visible", false);
            }

            i++;
        });
    },

    //Créer les éléments de validations des controles dans le quickform
    createEditorsValidationGroups: function (frmObj, frm, step) {

        //Parcourir les items (inputs) liés du step afin de gérer leur validation en bloc
        DevExpress.data.query(frmObj.Items)
            .filter(["StepId", "=", step.Id])
            .sortBy("OrderNumber")
            .toArray()
            .forEach(function (it) {

                //sortir si l'item n'est pas lié à une validation
                if (!it.DataField) return;

                //Parcourir les validations paramétrées dans le quickforms pour chaque item et les importer dans les validations Rules du controle
                let validationRules = [];
                if (it.IsRequired) validationRules.push({ type: 'required' })
                if (it.ValidationRules) it.ValidationRules.forEach(function (valR) {
                    validationRules.push(valR);
                });

                //Créer le validation Option en prenant le nom du step comme validationGroup
                let ValidationOption = {
                    validationGroup: step.Name,
                    validationRules: validationRules
                };


                let element = frm.getEditor(it.DataField).element();

                //INtégrer les options de validation au DxValidator du controle
                element.dxValidator(ValidationOption);
            });

    },

    //Permet de retourner l'objet source intégrant les modifications faites sur le quickform
    getUpdatedData: function (uniqueId, frm) {

        //iamShared.arrays.updatePropertiesByKey(iamQF.activeFormsData, "uniqueId", uniqueId, )

        let activeFormsDataElement = iamShared.arrays.findByKey(iamQF.activeFormsData, "uniqueId", uniqueId);

        if (activeFormsDataElement) {

            //Mettre a jour l'inner object depuis le formData du formulaire
            iamShared.utils.updateObjectFromObject(frm.option("formData"), activeFormsDataElement.data, false, false);
            return activeFormsDataElement.data;
        } else {
            return frm.option("formData");
        }

    },

    
    //permet de créer le formulaire quickform selon l'objet de paramétrage frmObj
    //overridePositionId = htmlContainer, popup, stepper, wizard, rightPanel
    createForm: function (frmObj, data, recreate = false, overridePositionId = null, showAfterCreate = false, app, magicDataService, closeAfterValidation = true) {
        let iamQF = this;
        let $qfParent;

        let innerStepperHtml = "";
        let innerContent = "";
        let qfCreationHtml = "<div id={id}></div>";
        let colCount = 2;
        let validateText = ((!app|| !app.localize)?"Validate": app.localize("Validate"));
        let title = (frmObj.DisplayName || ((!app || !app.localize) ? frmObj.Name : app.localize(frmObj.Name)));

        //Prendre la position paramétrée si aucune n'est passée
        if (!overridePositionId) overridePositionId = frmObj.PositionId;

        if (overridePositionId == 'htmlContainer' && frmObj.htmlContainerId) {
            $qfParent = $("#" + frmObj.htmlContainerId);
            if (frmObj.ColCount) colCount = frmObj.ColCount;
            //mettre à jour le titre de la fenetre
            if (frmObj.htmlContainerTitleId) $("#" + frmObj.htmlContainerTitleId).html(title);

        } else {
            if (overridePositionId == 'popup') {
                $qfParent = $("#iamQFPopupContainer");
                if (frmObj.colCount) colCount = frmObj.colCount;
                //mettre à jour le titre de la fenetre
            } else {
                if (overridePositionId == 'stepper') {
                    $qfParent = $("#iamQFStepperContainer");

                    colCount = frmObj.ColCount || 1;
                    //mettre à jour le titre de la fenetre
                    $("#iamQFStepperTitle").html(title);

                    if (!frmObj.StepperClass) frmObj.StepperClass = "step-line"; //step-thin, step-line, step-background, step-background-thin

                } else {
                    if (overridePositionId == 'wizard') {
                        $qfParent = $("#iamQFWizardContainer");

                        
                        if (!$qfParent.length) {
                            //Créer le html dans le body pour les assistants
                            iamShared.ui.wizardPopupHtmlCreate();                           
                            
                        }

                        if (frmObj.colCount) colCount = frmObj.colCount;
                        //mettre à jour le titre de la fenetre
                        if ($("#iamQFWizardTitle").length > 0) $("#iamQFWizardTitle").html(title);

                        if (!frmObj.WizardStepsPosition) frmObj.WizardStepsPosition = "top"; //top (wizard 1), left (wizard-2)

                    } else {
                        $qfParent = $("#iamQFRightPanelContainer");

                        if (!$qfParent.length) {
                            //Créer le right panel pour les quickCreate/quickforms
                            iamShared.ui.rightPanelCreate(null, false, null);                            
                        }

                        colCount = 1;
                        //mettre à jour le titre de la fenetre
                        $("#iamQFRightPanelTitle").html(title);
                    }
                }
            }
        }


        if (!$qfParent.length) {
            iamShared.messages.showErrorMsg("Cannot create QuickForm '" + title + " (" + frmObj.Id + ")" + "'");
            return;
        }

        //Masquer tous les div enfants du parent
        if (overridePositionId != 'wizard') $qfParent.children().hide();

        if (frmObj.ValidateText) validateText = frmObj.ValidateText;

        let uniqueId = frmObj.Id + "_" + overridePositionId;

        //Charger les nouvelles données
        //iamShared.arrays.updatePropertiesByKey(iamQF.activeFormsData, "uniqueId", uniqueId, { uniqueId: uniqueId, data: data }, true);


        //vérifier si le quickform a déjà été créé
        if ($("#" + uniqueId).length) {
            if (recreate == false) {
                let frm = $("#" + uniqueId).dxForm('instance');
                if (frm) {

                    frm.option("formData", data);

                    if (overridePositionId == 'wizard') {
                        //'<div id="iamWizardStep_' + el.Name + '" class="wizard-step" data-wizard-type="step" data-wizard-state="current">';
                        $(".wizard-step").attr("data-wizard-state", "pending");
                        if ($(".wizard-step").length > 0) $(".wizard-step").first().attr("data-wizard-state", "current");


                        //afficher le popup du wizard
                        this.wizardPopup.show();
                    } else {
                        //Se positionner sur le premier step, pour se faire masquer tous les groupes et afficher uniquement le premier
                        if (overridePositionId != 'stepper') {
                            this.activateGroupByOrderIndex(frmObj, frm, app, 0);
                        } else {
                            this.activateGroupByOrderIndex(frmObj, frm, app, 0);
                        }
                    }
                }

                //afficher le div
                $qfParent.children("#" + uniqueId).show();
                return true;
            }

            //Supprimer l'ancien existant
            $("#" + uniqueId).remove();
        }

        let stepperHtml = frmObj.StepperCreateCard ?
            `<div id="iamQFStepperCard" class="card card-custom gutter-b">
            <div class="card-body">
                <h4 class="font-weight-bold m-0" id="iamQFStepperTitle"></h4>                
                <div class="mt-element-step">                    
                    <div class="dropdown row {stepperClass}">
                        {innerStepperHtml}
                        <div id="iamStepperDropdownMenu" class="dropdown-menu dropdown-menu-lg">
                            <form class="px-8 py-8">
                                <div id={id}></div>
                            </form>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>` :
            `<div class="mt-element-step">
                    <div class="dropdown row {stepperClass}">
                        {innerStepperHtml}
                        <div id="iamStepperDropdownMenu" class="dropdown-menu dropdown-menu-lg">
                            <form class="px-8 py-8">
                                <div id={id}></div>
                            </form>                            
                        </div>
                    </div>
                    </div>
                </div>`;

        let wizardHtml = (frmObj.WizardStepsPosition == "top") ?
            `<div class="card card-custom">
             <div class="card-body p-0">                                   
                <div class="wizard wizard-1" data-wizard-clickable="false">

                    <div class="wizard-nav border-bottom">                                            
                        <div class="wizard-steps  p-8 p-lg-10">
                            {innerStepperHtml}
                        </div>
                        
                    </div>

                    <div class="row justify-content-center my-10 px-8 my-lg-15 px-lg-10">
                         <div class="col-xl-12 col-xxl-7">
                               <div id={id}></div>
                         </div>
                    </div>
                    
                </div>
            </div>
        </div>`
            ://else
            `<div class="card card-custom">
             <div class="card-body p-0">                                   
                <div class="wizard wizard-2" data-wizard-state="first" data-wizard-clickable="false">
                    
                    <div class="wizard-nav border-right py-8 px-8 py-lg-20 px-lg-10">                                            
                        <div class="wizard-steps">
                            {innerStepperHtml}
                        </div>
                        
                    </div>

                    <div class="wizard-body py-8 px-8 py-lg-20 px-lg-10">                                            
                             <div class="row">
                                   <div class="offset-xxl-2 col-xxl-8">
                                        <div id={id}></div>
                                   </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>` ;

        if (overridePositionId == 'stepper') {
            stepperHtml = stepperHtml.replace("{stepperClass}", frmObj.StepperClass).replace("{id}", uniqueId);
        } else {
            if (overridePositionId == 'wizard') {
                qfCreationHtml = wizardHtml;
            }
        }

        qfCreationHtml = qfCreationHtml.replace("{id}", uniqueId);
        if (!data) data = frmObj.Data;

        //Ordonner les étapes et les parcourrir
        let dxItems = [];
        let gpvisible = true;
        let steps;
        if (frmObj.IgnoreStepsOrderNumber) {
            //Prendre les steps dans l'ordre de création dans l'objet
            steps = DevExpress.data.query(frmObj.Steps).toArray();
        } else {
            //Ordonner les steps dans suivant l'ordre donné par la propriété OrderNumber
            steps = DevExpress.data.query(frmObj.Steps)
                .sortBy("OrderNumber")
                .toArray();
        }

        let i = 1;
        let BackGroupDisplayName = "";
        let dependencies = []; //Tableau des dépendances liées aux formules, a dependancy item is : {item: FormItem ,sourceObjectName:,sourceObjectProperty:, dependentObjectName:, dependentObjectProperty:, formula: formule de calcule adaptée au calculateur}

        steps.forEach(function (el) {

            let gpDisplayName = el.DisplayName || ((!app || !app.localize) ? el.Name : app.localize(el.Name));
            let nextGpDisplayName = "";

            let gp = {
                name: el.Name,
                itemType: "group",
                colCount: colCount,
                caption: gpDisplayName,
                items: [],
                visible: ((overridePositionId == 'stepper') ? true : gpvisible)
            }

            //Gerer les éléments du stepper si c'est nécessaire (cas stepper)
            if (overridePositionId == 'stepper') {

                //créer le a qui englobe les div des cols
                innerStepperHtml += '<a id="iamStep_' + el.Name + '" class="col-md mt-step-col" role="button" data-toggle="dropdown" >';

                //créer le div d'ouverture du step dans le stepper
                if (i == 1) {
                    innerStepperHtml += '<div class="col-md mt-step-col first active">';
                } else {
                    if (i == steps.length) {
                        innerStepperHtml += '<div class="col-md mt-step-col last">';
                    } else {
                        innerStepperHtml += '<div class="col-md mt-step-col">';
                    }
                }


                let chaineImage = null;
                let UseIcons = frmObj.UseIcons || el.UseIcons;

                //Utiliser les images seulement si cela est spécifé
                if (UseIcons) {
                    if (el.SystemIcon) {
                        chaineImage = '<i class="' + el.SystemIcon + '"></i>';
                    } else {
                        if (el.IconUrl) chaineImage = '<img src="' + el.IconUrl + '"/>';
                    }
                }

                innerStepperHtml += '<div class="mt-step-number ' + (frmObj.StepperClass.indexOf('step-background') > -1 ? '' : 'bg-white') + '">' + (chaineImage || i.toString()) + '</div>';
                innerStepperHtml += '<div class="mt-step-title uppercase font-grey-cascade">' + ((UseIcons) ? i.toString() + '. ' : '') + gpDisplayName + '</div>';
                if (el.Description) innerStepperHtml += '<div class="mt-step-content font-grey-cascade">' + ((!app || !app.localize) ? el.Description : app.localize(el.Description))  + '</div>';

                //Fermer le div du step
                innerStepperHtml += '</div>';

                //Fermer le a du step
                innerStepperHtml += '</a>';
            } else {

                //Gerer les éléments du stepper si c'est nécessaire (cas stepper)
                if (overridePositionId == 'wizard') {


                    //créer le div d'ouverture du step dans le stepper
                    if (i == 1) {

                        innerStepperHtml += '<div id="iamWizardStep_' + el.Name + '" class="wizard-step" data-wizard-type="step" data-wizard-state="current">';
                    } else {
                        innerStepperHtml += '<div id="iamWizardStep_' + el.Name + '" class="wizard-step" data-wizard-type="step" data-wizard-state="pending">';
                    }



                    let chaineImage = null;
                    let UseIcons = frmObj.UseIcons || el.UseIcons;

                    //Utiliser les images seulement si cela est spécifé
                    if (UseIcons) {
                        if (el.SystemIcon) {
                            chaineImage = '<i class="wizard-icon ' + el.SystemIcon + '"></i>';
                        } else {
                            if (el.IconUrl) chaineImage = '<img src="' + el.IconUrl + '"/>';
                        }
                    }

                    if (frmObj.WizardStepsPosition == "top") {

                        innerStepperHtml +=
                            `<div class="wizard-label" data-toggle="tooltip" data-placement="bottom" title="${(el.Description) ? ((!app || !app.localize) ? el.Description : app.localize(el.Description)) : ''}">
                                ${(chaineImage) ? chaineImage : '<div class="wizard-icon">' + i.toString() + '</div>'}                                
                                <h3 class="wizard-title">${((chaineImage) ? i.toString() + '. ' : '') + gpDisplayName}</h3>                    
                            </div>
                            ${(i != steps.length) ? '<span class="svg-icon svg-icon-xl wizard-icon"><i class="flaticon2-next"></i></span>' : ''}
                            `;

                    } else {

                        innerStepperHtml += '<div class="wizard-wrapper">';
                        innerStepperHtml += '<div class="wizard-icon">' + (chaineImage || '<span class="wizard-icon">' + i.toString() + '</span>') + '</div>';

                        innerStepperHtml += '<div class="wizard-label">';
                        innerStepperHtml += '<h3 class="wizard-title">' + ((chaineImage) ? i.toString() + '. ' : '') + gpDisplayName + '</h3>';
                        if (el.Description) innerStepperHtml += '<div class="wizard-desc">' + ((!app || !app.localize) ? el.Description : app.localize(el.Description)) + '</div>';
                        //Fermer le div du label
                        innerStepperHtml += '</div>';

                        //Fermer le wrapper du step
                        innerStepperHtml += '</div>';
                    }



                    //Fermer le div du step
                    innerStepperHtml += '</div>';

                }
            }

            let gpValidationName = el.Name;
            let colSpanSum = 0; //colSpanSum pour les items
            let ItemsArray;

            if (frmObj.IgnoreItemsOrderNumber) {
                //prendre les items du step en cours dans l'ordre de presence dans la collection et ne pas ordonner suivant la colonne (propriété) OrderNumber
                ItemsArray = DevExpress.data.query(frmObj.Items)
                    .filter(["StepId", "=", el.Id])
                    .toArray();
            } else {
                //Prendre les items du step en cours et les ordonner les items suivant la colonne (propriété) OrderNumber
                ItemsArray = DevExpress.data.query(frmObj.Items)
                    .filter(["StepId", "=", el.Id])
                    .sortBy("OrderNumber")
                    .toArray();
            }

            //Parcourir et ajouter les éléments à mettre dans le groupe ----------------------------------------------------------------------------------------------------------------
            ItemsArray.forEach(function (it) {
                let item;
                let editorType = "dxTextBox";
                let itemType = "simple";

                if (frmObj.AutoCreateEditors) {
                    item = {
                        dataField: it.DataField
                    }
                } else {

                    if (it.DataField) {
                        if (it.EditorType) editorType = it.EditorType;
                    } else {
                        if (editorType == "dxButton") {
                            itemType = "button"
                        }
                        //Ne pas prendre d'editeur si le champ de liaison est vide
                        editorType = null;
                    }


                    item = {
                        name: it.Id,
                        editorType: ((it.template) ? null : editorType),
                        itemType: itemType,
                        dataField: it.DataField,
                        //IsRequired: it.isRequired,
                        //Prendre null sinon créer un div comme item template
                        template: ((it.DataField || itemType == "button") ? ((it.template) ? it.template : null) : function (data, $itemElement) {
                            ((!it.CssClass) ? $("<div>").appendTo($itemElement).html('<span class="dx-form-group-caption">' + ((!app || !app.localize) ? it.DisplayName : app.localize(it.DisplayName)) + '</span><div class="dx-form-group-content"><div>') : $("<div>").appendTo($itemElement).html('<span class="' + it.CssClass + '">' + ((!app || !app.localize) ? it.DisplayName : app.localize(it.DisplayName)) + '</span>'));
                        }),
                        cssClass: it.CssClass,
                        colSpan: ((it.DataField) ? it.ColSpan : colCount)

                    };

                    //mettre a jour la variable colSpanSum
                    colSpanSum += ((it.DataField) ? (it.ColSpan || 1) : colCount);

                    if (["dxSelectBox", "dxLookup", "dxRadioGroup", "dxTagBox"].includes(editorType)) {
                        let dataSourceName = it.ListDataSourceName || it.DataField;

                        item["editorOptions"] = {
                            dataSource: ((it.ListDataSource) ? iamShared.utils.getRealDataSource(it.ListDataSource, Window) : null),
                            displayExpr: it.ListDisplayExpression,
                            valueExpr: it.ListValueExpression,
                            readOnly: it.ReadOnly,
                            searchEnabled: true,
                            onContentReady: function (e) {
                                let editor = e.component;

                                if (!editor.option("dataSource")) {
                                    try {

                                        //Prendre la ligne de conservations des éléments du quickforms dont les sources de données
                                        let qfItem = iamShared.arrays.findByKey(iamQF.quickForms, "name", uniqueId);

                                        if (!qfItem) {
                                            return;
                                        }

                                        //Recupérer le bon dataSource dans la liste
                                        let res = iamShared.arrays.findByKey(qfItem.dataSources, "Name", dataSourceName);

                                        if (res) {
                                            let val = editor.option("value");

                                            //Recharger la liste
                                            editor.option({ dataSource: res.Data, "valueExpr": res.KeyFieldName, "displayExpr": res.DisplayNameFieldName });

                                            if (val) {
                                                //Redonner la valeur au controle
                                                editor.option("value", val);
                                            }
                                        }

                                    } catch (x) {
                                        abp.message.error(x, it.DataField);
                                    }
                                }
                            }
                        }
                    } else {

                        if (it.ListDataSource) {
                            //Créer un bouton un 
                            item["editorOptions"] = {
                                readOnly: it.ReadOnly,
                                buttons: [{
                                    name: it.DataField + "Btn",
                                    location: "after",
                                    options: {
                                        icon: "fas fa-search",
                                        stylingMode: "contained",//text, outllined
                                        type: "normal",
                                        onClick: function (e) {
                                            //lancer un popup de sélection
                                            iamShared.ui.popupShowSelection(
                                                app, (it.DisplayName || ((!app || !app.localize) ? it.DataField : app.localize(it.DataField))) , null, iamShared.utils.getRealDataSource(it.ListDataSource, Window), it.ListMultiSelect,
                                                function (selectedItems) {
                                                    let Value;

                                                    if (selectedItems) {
                                                        if (it.ListValueExpression) {
                                                            Value = selectedItems[0][it.ListValueExpression];
                                                        } else {
                                                            Value = selectedItems[0];
                                                        }
                                                    }

                                                    //mettre à jour le controle
                                                    frm.updateData(it.DataField, Value);

                                                },
                                                null, null, it.ListValueExpression, it.ListDisplayExpression, null, null
                                            )
                                        }
                                    }
                                }
                                ]
                            }
                        } else {

                            if (it.EntityRequestObject || it.ListDataSourceName) {
                                //Créer un bouton un 
                                item["editorOptions"] = {
                                    readOnly: it.ReadOnly,
                                    buttons: [{
                                        name: it.DataField + "Btn",
                                        location: "after",
                                        options: {
                                            icon: "fas fa-search",
                                            stylingMode: "contained",//text, outllined
                                            type: "normal",
                                            onClick: function (e) {

                                                //Si c'est directement un nom de fonctionnement interne (Listes internes) alors le gérer par le système lui même selon le nom de l'objet liste interne
                                                if (it.EntityRequestObject && (typeof it.EntityRequestObject === 'string' || it.EntityRequestObject instanceof String)) {

                                                    switch (it.EntityRequestObject) {
                                                        case 'iamSystemIcon': {
                                                            //Afficher le popup de sélection des icones système
                                                            iamShared.fontAwesome.createFontAwesomePopupSelector(app, function (selectedItem) {
                                                                //mettre à jour le controle
                                                                frm.updateData(it.DataField, ((selectedItem) ? selectedItem.name : null));
                                                            }, "solid");
                                                            break;
                                                        }
                                                        default: {
                                                            //ne rien faire
                                                            break;
                                                        }
                                                    }

                                                    return;
                                                }

                                                //Vérifier si magic Data est disponible pour aller chercher l'objet depuis magicData
                                                if (magicDataService) {

                                                    //Si l'objet est directement rattaché à un EntityRequestObject
                                                    if (it.EntityRequestObject) {

                                                        
                                                        magicDataService.get(iamShared.magicData.adaptEntityRequestObject(it.EntityRequestObject, frm.option("formData"), frmObj.Variables)).done(function (res) {

                                                            let dataSource = res.data;
                                                            let valExpr = it.ListValueExpression || res.keyFieldName;
                                                            let displayExpr = it.ListDisplayExpression || res.displayNameFieldName;

                                                            //lancer un popup de sélection
                                                            iamShared.ui.popupShowSelection(
                                                                app, (it.DisplayName || ((!app || !app.localize) ? it.DataField : app.localize(it.DataField))), null, dataSource, it.ListMultiSelect,
                                                                function (selectedItems) {
                                                                    let Value;

                                                                    if (selectedItems) {
                                                                        if (valExpr) {
                                                                            Value = selectedItems[0][valExpr];
                                                                        } else {
                                                                            Value = selectedItems[0];
                                                                        }
                                                                    }

                                                                    //mettre à jour le controle
                                                                    frm.updateData(it.DataField, Value);
                                                                },
                                                                null, null, valExpr, displayExpr, null, null
                                                            )

                                                        });
                                                    } else {
                                                        //lié à un ListDataSourceName
                                                        //Prendre la ligne de conservations des éléments du quickforms dont les sources de données
                                                        let qfItem = iamShared.arrays.findByKey(iamQF.quickForms, "name", uniqueId);

                                                        if (!qfItem) {
                                                            return;
                                                        }

                                                        let res = iamShared.arrays.findByKey(qfItem.dataSources, "Name", it.ListDataSourceName);

                                                        if (res) {

                                                            if (iamShared.magicData.isEntityRequestObjectDependant(res.EntityRequestObject)) {


                                                                //Données dynamiques donc recharger depuis le serveur
                                                                magicDataService.get(iamShared.magicData.adaptEntityRequestObject(res.EntityRequestObject, frm.option("formData"), frmObj.Variables)).done(function (r) {

                                                                    //Mettre à jour le dataSource à conserver.
                                                                    res.Data = r.data;
                                                                    res.KeyFieldName = iamShared.strings.convertToCamelCase(r.keyFieldName);
                                                                    res.DisplayNameFieldName = iamShared.strings.convertToCamelCase(r.displayNameFieldName);

                                                                    console.log("data: " + JSONfn.stringify(r.data));
                                                                    console.log("keyFieldName: " + r.keyFieldName);
                                                                    console.log("displayNameFieldName: " + r.displayNameFieldName);

                                                                    //Préparer les données du popup
                                                                    let dataSource = r.data;
                                                                    let valExpr = it.ListValueExpression || iamShared.strings.convertToCamelCase(r.keyFieldName);
                                                                    let displayExpr = it.ListDisplayExpression || iamShared.strings.convertToCamelCase(r.displayNameFieldName);

                                                                    //lancer un popup de sélection
                                                                    iamShared.ui.popupShowSelection(
                                                                        app, (it.DisplayName || ((!app || !app.localize) ? it.DataField : app.localize(it.DataField))), null, dataSource, it.ListMultiSelect,
                                                                        function (selectedItems) {
                                                                            let Value;

                                                                            if (selectedItems) {
                                                                                if (valExpr) {
                                                                                    Value = selectedItems[0][valExpr];
                                                                                } else {
                                                                                    Value = selectedItems[0];
                                                                                }
                                                                            }

                                                                            //mettre à jour le controle
                                                                            frm.updateData(it.DataField, Value);
                                                                        },
                                                                        null, null, valExpr, displayExpr, null, null
                                                                    )

                                                                });

                                                            } else {
                                                                //données non dynamique donc sélectionner depuis la source existante
                                                                let valExpr = it.ListValueExpression || res.KeyFieldName;
                                                                let displayExpr = it.ListDisplayExpression || res.DisplayNameFieldName;
                                                                let dataSource = res.Data;

                                                                //lancer un popup de sélection
                                                                iamShared.ui.popupShowSelection(
                                                                    app, (it.DisplayName || ((!app || !app.localize) ? it.DataField : app.localize(it.DataField))), null, dataSource, it.ListMultiSelect,
                                                                    function (selectedItems) {
                                                                        let Value;

                                                                        if (selectedItems) {
                                                                            if (valExpr) {
                                                                                Value = selectedItems[0][valExpr];
                                                                            } else {
                                                                                Value = selectedItems[0];
                                                                            }
                                                                        }

                                                                        //mettre à jour le controle
                                                                        frm.updateData(it.DataField, Value);
                                                                    },
                                                                    null, null, valExpr, displayExpr, null, null
                                                                )
                                                            }

                                                        }
                                                    }

                                                }


                                            }
                                        }
                                    }
                                    ]
                                };
                            } else {

                                if (itemType == "button") {
                                    //Clonner les options de l'editeur configurées dans le quickform
                                    item["buttonOptions"] = Object.assign({}, it.editorOptions);    
                                } else {
                                    item["editorOptions"] = {
                                        readOnly: it.ReadOnly
                                    };
                                }
                                
                            }
                        }
                    }

                    if (it.onValueChanged) {
                        //Gérer le Eval pour contextualiser les variables et fonctions disponibles dans le onValueChanged
                        let fn;
                        eval("fn=" + it.onValueChanged.toString() + ";");
                        item["editorOptions"]["onValueChanged"] = fn;
                    }

                    //Gérer les boutons additionnels des items paramétrés
                    if (it.buttons) {
                        if (!item["editorOptions"]) {
                            //Créer le editorOptions et le tableau des boutons
                            item["editorOptions"] = { buttons: [] };
                        } else {
                            if (!item["editorOptions"]["buttons"]) {
                                //Créer et initialiser le tableau des boutons
                                item["editorOptions"]["buttons"] = [];
                            }
                        }

                        //Parcourir les boutons et les créer dans le tableau
                        it.buttons.forEach(function (btn) {
                            let btnOption = Object.assign({}, btn);

                            //Gérer le Eval pour contextualiser les variables et fonctions disponibles dans le click
                            if (btn.options && btn.options.onClick) {
                                let fn;
                                eval("fn=" + btn.options.onClick.toString() + ";");
                                btnOption.options.onClick = fn;
                            }

                            //Ajouter le bouton
                            item["editorOptions"]["buttons"].push(btnOption);
                        });

                    }

                }

                if (editorType == "dxCheckBox") {
                    //Pour le checkBox afficher le caption du item dans le controle lui même et masquer le caption.
                    item["editorOptions"] = {
                        text: it.DisplayName || ((!app || !app.localize) ? it.DataField : app.localize(it.DataField))
                    };
                    item['label'] = { text: "", visible: false };
                } else {
                    if (itemType == "button") {
                       //Déjà géré, ne rien faire
                    } else {
                        item['label'] = (it.DataField) ? { text: it.DisplayName || ((!app || !app.localize) ? it.DataField : app.localize(it.DataField)) } : null;
                    }                    
                }

                if (itemType != "button" && it.editorOptions) {
                    //Clonner les options de l'editeur configurées dans le quickform
                    item["editorOptions"] = Object.assign({}, it.editorOptions);   
                }

                //Gérer la formule liée
                if (it.Formula) {
                    //Récupérer la liste des paramètres
                    let params = iamShared.utils.getFormulaParams(it.Formula);

                    if (params) {
                        params.forEach(function (param) {

                            let dependentItem = { sourceObjectName: param, sourceObjectProperty: "value", dependentObjectName: it.DataField, dependentObjectProperty: "value", formula: iamShared.utils.adaptFormulaToCalcEngine(it.Formula) };

                            //Ajouter la dépendance si nécessaire
                            if (iamShared.arrays.existsByItemProperties(dependencies, dependentItem) == false) dependencies.push(dependentItem);
                        });
                    }
                }

                //Vérifier s'il est nécessaire d'ajouter un emptyitem
                if (!it.DataField && colCount > 1 && (colSpanSum / colCount) % 2 != 0) {
                    //ajouter un empty item avant l'élément pour repartir à la ligne
                    gp.items.push({ itemType: "empty" });
                }

                //Ajouter le groupe
                gp.items.push(item);
            });



            //ajouter la navigation du groupe ----------------------------------------------------------------------------------------------------------------------------------------------
            //Vérifier s'il est nécessaire d'ajouter un item
            if (colCount > 1 && (colSpanSum / colCount) % 2 != 0) {
                //ajouter un empty item avant le groupe de navigation
                gp.items.push({ itemType: "empty" });
            }

            //Ajouter les boutons de navigation           
            let navGp = {
                itemType: "group",
                colCount: 2,
                colSpan: colCount,
                items: [
                    {
                        itemType: 'empty',
                        colSpan: 1
                    }
                ]
            };

            let onValidated = null;

            if (el.DenyBack) {

            } else {
                if (steps.length > 1 && i > 1) {
                    //supprimer le "empty" item du début de la liste
                    //navGp.items.shift();
                    navGp.colCount = 3;
                    if (colCount > 1) {
                        navGp.colCount = 4;
                        navGp.items[0].colSpan = 2;
                    }
                    let back = BackGroupDisplayName;
                    let backName = steps[i - 2].Name;
                    //Ajouter l'élément back
                    navGp.items.push({
                        itemType: "button",
                        horizontalAlignment: "right",
                        buttonOptions: {
                            text: ((!app || !app.localize) ? "Back" : app.localize("Back")),
                            width: 120,
                            icon: "back",
                            onClick: function (e) {

                                if (overridePositionId == 'stepper') {

                                    //Masquer le dropdown                                    
                                    $("#iamStep_" + el.Name)[0].click();
                                    //afficher le dropdown à l'étape précédente en simulant le click sur elle
                                    setTimeout(function () { $("#iamStep_" + backName)[0].click(); }, 400);

                                } else {
                                    //Gérer les élements complémentaires spécifiques à chaque type
                                    if (overridePositionId == 'wizard') {
                                        //Masquer le dropdown                                    
                                        if ($("#iamWizardStep_" + el.Name).attr("data-wizard-state") != "done") $("#iamWizardStep_" + el.Name).attr("data-wizard-state", "pending");
                                        $("#iamWizardStep_" + backName).attr("data-wizard-state", "current");
                                    } else {

                                    }

                                    // Masquer le groupe en cours et afficher le groupe précédent                                  
                                    //frm.itemOption(gpDisplayName, "visible", false);
                                    //frm.itemOption(back, "visible", true);
                                    frm.itemOption(el.Name, "visible", false);
                                    frm.itemOption(backName, "visible", true);
                                }
                            }
                        }
                    });
                }

            }

            if (steps.length == i) {

                navGp.items.push({
                    itemType: "button",
                    horizontalAlignment: "right",
                    validationGroup: el.Name,
                    buttonOptions: {
                        validationGroup: el.Name,
                        text: "OK",
                        icon: "check",
                        type: "success",
                        onClick: function (e) {
                            //valider les éléments du step
                            if (!e.validationGroup) {
                                //Créer les éléments de validation des editors
                                iamQF.createEditorsValidationGroups(frmObj, frm, el);
                                //Relancer le click pour prendre en compte les validations avant de ressortir
                                e.element.click();
                                return;
                            }

                            const res = e.validationGroup.validate();
                            if (res.isValid) {
                                //Recupérer les données d'origine intégrant les modifications faites sur le QF
                                //let updatedData = iamQF.getUpdatedData(uniqueId, frm);

                                if (el.OnValidated) {
                                    el.OnValidated(frm.option("formData"));

                                    //Valider l'étape dans le stepper
                                    if (overridePositionId == 'stepper') {
                                        if ($("#iamStep_" + el.Name).children(":first").hasClass("done") == false) $("#iamStep_" + el.Name).children(":first").addClass("done");
                                    } else {
                                        if (overridePositionId == 'wizard') {
                                            //Passer le statut à done                                    
                                            $("#iamWizardStep_" + el.Name).attr("data-wizard-state", "done");

                                        }
                                    }
                                }

                                if (frmObj.OnValidated) {
                                    frmObj.OnValidated(frm.option("formData"));
                                }

                                //fermer le voler ou le conteneur du quickform
                                if (closeAfterValidation) iamQF.closeContainer(overridePositionId, el.Name);

                            } else {

                            }


                        }
                    }
                });

            } else {

                //Prendre le caption du groupe suivant pour le rechercher dans le dxform
                nextGpDisplayName = steps[i].DisplayName || ((!app || !app.localize) ? steps[i].Name : app.localize(steps[i].Name)) ;
                let nextGpName = steps[i].Name;
                navGp.items.push({
                    itemType: "button",
                    horizontalAlignment: "right",
                    validationGroup: el.Name,
                    buttonOptions: {
                        validationGroup: el.Name,
                        width: 120,
                        text: ((!app || !app.localize) ? "Next" : app.localize("Next")),
                        icon: "chevronnext",
                        type: "default",
                        onClick: function (e) {

                            //valider les éléments du step
                            if (!e.validationGroup) {
                                //Créer les éléments de validation des editors
                                iamQF.createEditorsValidationGroups(frmObj, frm, el);
                                //Relancer le click pour prendre en compte les validations avant de ressortir
                                e.element.click();
                                return;
                            }

                            //valider les éléments du step
                            const res = e.validationGroup.validate();

                            if (res.isValid) {
                                //Recupérer les données d'origine intégrant les modifications faites sur le QF et lancer la fonction OnValidated                              
                                if (el.OnValidated) {
                                    el.OnValidated(frm.option("formData"));
                                }

                                //Valider l'étape dans le stepper
                                if (overridePositionId == 'stepper') {
                                    if ($("#iamStep_" + el.Name).children(":first").hasClass("done") == false) $("#iamStep_" + el.Name).children(":first").addClass("done");
                                    if ($("#iamStep_" + nextGpName).children(":first").hasClass("done") == false) $("#iamStep_" + nextGpName).children(":first").addClass("active");
                                    //Masquer le dropdown
                                    $("#iamStep_" + el.Name)[0].click();
                                    //bootstrap.Dropdown($("#iamStep_" + el.Name)[0]).toggle();
                                    //afficher le dropdown à l'étape suivante en simulant le click sur la prochaine étape
                                    setTimeout(function () { $("#iamStep_" + nextGpName)[0].click(); }, 400);
                                    //$("#iamStep_" + nextGpName)[0].dispatchEvent(new Event('click'));

                                } else {

                                    if (overridePositionId == 'wizard') {
                                        //Passer le statut à done                                    
                                        $("#iamWizardStep_" + el.Name).attr("data-wizard-state", "done");
                                        //Passer le statut du prochain à current   
                                        $("#iamWizardStep_" + nextGpName).attr("data-wizard-state", "current");
                                    }

                                    // Masquer le groupe en cour et afficher le prochain groupe
                                    //frm.itemOption(gpDisplayName, "visible", false);
                                    //frm.itemOption(nextGpDisplayName, "visible", true);
                                    frm.itemOption(el.Name, "visible", false);
                                    frm.itemOption(nextGpName, "visible", true);
                                }

                            }


                        }
                    }
                });
            }


            //Ajouter le groupe
            gp.items.push(navGp);

            //Ajouter le groupe à liste des éléments du dxForm
            dxItems.push(gp);
            i += 1;
            gpvisible = false;
            BackGroupDisplayName = gpDisplayName;
        });



        //Générer les evènements par rapport aux dépendances --------------------------------------------------------------------------------------------------------------------
        let calcEgine = null;
        if (dependencies.length > 0) {
            //Créer uniquement le formulaParser que si des dépendances existent
            calcEgine = iamShared.utils.createFormulaCalcEngine(dependencies);

            //Parcourir les dépendances
            iamShared.arrays.getDistinctPropertyValue(dependencies, "sourceObjectName").forEach(function (sourceObjectName) {

                //Passer au suivant si c'est une variable globale
                if (iamShared.utils.isCalcEngineGlobalVariable(sourceObjectName)) return;

                //Rechercher l'item de l'objet source
                let sourceObjItem = iamShared.arrays.findRecursiveByKey(dxItems, "dataField", sourceObjectName, ["items"]);


                if (sourceObjItem) {

                    let srcDependencies = iamShared.arrays.filterByItemProperty(dependencies, "sourceObjectName", sourceObjectName);

                    //gérer le changement de valeur de la propriété de destination
                    sourceObjItem.editorOptions.onOptionChanged = function (e) {

                        srcDependencies.forEach(function (dependencyItem) {
                            if (e.name === dependencyItem.sourceObjectProperty) {

                                //Mettre à jour la formule dans le parseur
                                calcEgine.setVariable(dependencyItem.sourceObjectName + "_" + dependencyItem.sourceObjectProperty, e.value);

                                if (e.name == "value") calcEgine.setVariable(dependencyItem.sourceObjectName, e.value);

                                //calculer la valeur de la propriété de la destination
                                let calValue = calcEgine.parse(dependencyItem.formula).result;
                                //iamShared.utils.getCalcEngineVariables(calcEgine, true);
                                //alert(dependencyItem.formula);

                                //Actualiser la propriété de la valeur dépendante
                                if (frm.getEditor(dependencyItem.dependentObjectName).option(dependencyItem.dependentObjectProperty) != calValue) {
                                    frm.getEditor(dependencyItem.dependentObjectName).option(dependencyItem.dependentObjectProperty, calValue);
                                }

                            }
                        });


                    };
                }

            });
        }




        //Créer le dxForm avec ces attributs par défaut -----------------------------------------------------------------------------------------------------------------------------------
        let frmHeight = function () { return (overridePositionId == 'rightpanel') ? (iamShared.ui.getHeightFromWindowHeight(-150) < 400 ? 400 : iamShared.ui.getHeightFromWindowHeight(-150)) : null; }

        let dxFormOption = {
            name: uniqueId,
            focusStateEnabled: true,
            //dataSource: data,
            formData: data,
            height: frmHeight(),
            hoverStateEnabled: true,
            items: dxItems,
            labelLocation: "top",
            scrollingEnabled: true,
            showColonAfterLabel: false,
            width: "100%",
            customizeItem: function (item) {
                if (item.editorType == null)
                    return;
            },
            onContentReady: function (e) {

                //sortir si le servide de données magic data n'est pas disponible
                if (!magicDataService) return;

                //vérifier si les sources des objets de ce formulaire on déjà été créées
                if (iamQF.loadedFormsDatasources.includes(frmObj.Id)) return;

                let listItems = frmObj.Items.filter(function (item) {
                    return (item.EntityRequestObject || item.ListDataSourceName) && item.EditorType != "dxTextBox";
                });

                //Prendre la ligne de conservations des éléments du quickforms dont les sources de données
                let qfItem = iamShared.arrays.findByKey(iamQF.quickForms, "name", uniqueId);

                if (!qfItem) {

                    qfItem = { name: uniqueId, formObject: frmObj, formInstance: null, dependencies: dependencies, dataSources: [] };
                    //ajouter l'élément au tableau des quickForm déjà créés
                    iamQF.quickForms.push(qfItem);
                }
                //Chargement des sources du formulaire
                if (frmObj.DataSources) {

                    if (qfItem) {

                        //Prendre un tableau vide si il est à null
                        if (!qfItem.dataSources) { qfItem.dataSources = []; } else { qfItem.dataSources.length = 0; }

                        let listOfReqObjects = [];
                        //charger la liste des requestObjects
                        frmObj.DataSources.forEach(function (it) {
                            listOfReqObjects.push(iamShared.magicData.adaptEntityRequestObject(it.EntityRequestObject, data, frmObj.Variables));
                        });

                        //Rechercher les données en 1 bloc                 
                        magicDataService.getEntities({ rejectAllOnError: false, entitiesString: JSON.stringify(listOfReqObjects) }).done(function (res) {
                            //Error message
                            let Err = null;

                            //Parcourir la liste des resultats retournés
                            for (let i = 0; i < res.length; i++) {
                                let reqResultObj = res[i];

                                //Récupérer les messages d'erreur
                                if (reqResultObj.errorMessage) {
                                    Err = (!Err) ? reqResultObj.errorMessage : Err + '\n' + reqResultObj.errorMessage;
                                }

                                //Ajouter la source à la liste des sources du formulaire et conserver les informations pour la mise à jour des controles à lier ultérieurement
                                qfItem.dataSources.push({
                                    Name: frmObj.DataSources[i].Name,
                                    EntityRequestObject: frmObj.DataSources[i].EntityRequestObject,
                                    Data: reqResultObj.data,
                                    KeyFieldName: iamShared.strings.convertToCamelCase(reqResultObj.keyFieldName),
                                    DisplayNameFieldName: iamShared.strings.convertToCamelCase(reqResultObj.displayNameFieldName),
                                    TotalCount: reqResultObj.totalCount
                                });

                                //console.log(JSON.stringify(reqResultObj));
                            }

                            //Afficher les erreurs qui se sont produites
                            if (Err) {
                                abp.message.error(Err, "Magic Data");
                            }

                            //Rechercher les objets ayant un EntityRequestObject vide et un ListDataSourceName attribué
                            listItems.forEach(function (it) {

                                if (!it.EntityRequestObject && it.ListDataSourceName) {
                                    //cas du datasourceName, récupérer l'editor
                                    let editor = e.component.getEditor(it.DataField);

                                    let res = iamShared.arrays.findByKey(qfItem.dataSources, "Name", it.ListDataSourceName);

                                    if (res) {

                                        it.ListValueExpression = it.ListValueExpression || res.KeyFieldName;
                                        it.ListDisplayExpression = it.ListDisplayExpression || res.DisplayNameFieldName;

                                        if (editor) {
                                            //Recupérer la valeur dans le controle pour la sauvegarder
                                            try {
                                                let val = editor.option("value");
                                                editor.option({ dataSource: res.Data, "valueExpr": it.ListValueExpression, "displayExpr": it.ListDisplayExpression });

                                                if (val) {
                                                    //Redonner la valeur au controle
                                                    editor.option("value", val);
                                                }
                                            } catch (x) {
                                                abp.message.error(x, it.DataField);
                                            }

                                        }
                                    }
                                }


                            });

                        });

                    }
                }

                //Sortir si la liste est vide
                if (!listItems) {
                    iamQF.loadedFormsDatasources.push(frmObj.Id);
                    return;
                }

                //Rechercher les objets ayant un EntityRequestObject directement attribué
                listItems.forEach(function (it) {
                    //Gérer les objets ayant un EntityRequestObject directement attribué
                    if (it.EntityRequestObject) {
                        let editor = e.component.getEditor(it.DataField);

                        //Cas du requestObjectIndépendant
                        let reqObj = iamShared.magicData.adaptEntityRequestObject(it.EntityRequestObject, data, frmObj.Variables);

                        magicDataService.get(reqObj).done(function (res) {

                            //Modifier les éléments des items pour le futur
                            it.ListDataSource = res.data;
                            it.ListValueExpression = it.ListValueExpression || iamShared.strings.convertToCamelCase(res.keyFieldName);
                            it.ListDisplayExpression = it.ListDisplayExpression || iamShared.strings.convertToCamelCase(res.displayNameFieldName);

                            //Ajouter la source à la liste des sources du formulaire et conserver les informations pour la mise à jour des controles à lier ultérieurement
                            qfItem.dataSources.push({
                                Name: it.DataField,
                                EntityRequestObject: it.EntityRequestObject,
                                Data: res.data,
                                KeyFieldName: iamShared.strings.convertToCamelCase(res.keyFieldName),
                                DisplayNameFieldName: iamShared.strings.convertToCamelCase(res.displayNameFieldName),
                                TotalCount: res.totalCount
                            });

                            if (editor) {
                                //Recupérer la valeur dans le controle pour la sauvegarder
                                try {
                                    let val = editor.option("value");
                                    editor.option({ dataSource: it.ListDataSource, "valueExpr": it.ListValueExpression, "displayExpr": it.ListDisplayExpression });

                                    if (val) {
                                        //Redonner la valeur au controle
                                        editor.option("value", val);
                                    }
                                } catch (x) {
                                    abp.message.error(x, it.DataField);
                                }

                            }


                        });
                    }


                });

                //Ajouter le nom du form dans les forms dont les sources ont été chargées
                iamQF.loadedFormsDatasources.push(frmObj.Id);
                return;
            }

            //Fonction qui se lance après création de tous les éléments du dxform
            //,onInitialized: function (e) {             
            //}
        };

        var frm;

        //Ajouter le html du QF dans la page
        if (overridePositionId == 'stepper') {
            qfCreationHtml = stepperHtml.replace("{innerStepperHtml}", innerStepperHtml);
        } else {
            if (overridePositionId == 'wizard') {
                qfCreationHtml = qfCreationHtml.replace("{innerStepperHtml}", innerStepperHtml);
            }
        }

        //INsérer le html créer dans la page
        $qfParent.append(qfCreationHtml);

        //créer le form de saisie
        frm = $("#" + uniqueId).dxForm(dxFormOption).dxForm("instance");

        //iamQF.activeForm = frm;

        //le click sur les titres pour changer le groupe actif
        if (overridePositionId == 'stepper') {

            $("a.mt-step-col").click(function (e) {

                //prendre le nom du groupe à afficher pour l'étape sélectionnée.
                let gpName = $(this).attr("id").replace("iamStep_", "");

                //afficher le groupe
                iamQF.activateGroupByName(frmObj, frm, app, gpName);

                //afficher le dropdown
                //if ($("#iamStepperDropdownMenu").hasClass("show")) $("#iamStepperDropdownMenu").addClass("show");
            });
        } else {
            //gérer le wizard et créer le popup si nécessaire
            if (overridePositionId == 'wizard') {

                let element = document.getElementById("iamQFWizardPopup");
                let instance = DevExpress.ui.dxPopup.getInstance(element);

                if ($("#iamQFWizardPopup").length > 0 && !instance) {
                    iamQF.wizardPopup = $("#iamQFWizardPopup").dxPopup({
                        height: "auto",
                        name: "iamQFWizardPopup",
                        title: (frmObj.DisplayName || ((!app || !app.localize) ? frmObj.Name : app.localize(frmObj.Name)) )
                    }).dxPopup("instance");
                }
                //Afficher le popup de l'assitant
                if (showAfterCreate) iamQF.wizardPopup.show();
            }
        }

        //Ajouter le quickForm au tableau des QF du formulaire si c'est nécessaire
        let item = iamShared.arrays.findByKey(this.quickForms, "name", dxFormOption.name);

        if (item) {
            //mettre à jour l'élément
            item.formObject = frmObj;
            item.formInstance = frm;
            item.dependencies = dependencies;

            //ReloadDataSources


        } else {
            //ajouter l'élément au tableau des quickForm déjà créés
            this.quickForms.push({ name: dxFormOption.name, formObject: frmObj, formInstance: frm, dependencies: dependencies, dataSources: [] });
        }

        //redimensionner le frm en fonction de la fenêtre
        if (overridePositionId == 'rightpanel') {
            window.addEventListener("resize",
                function () {
                    frm.option("height", frmHeight());
                    return;
                }, false);
        }

    },
    

    wizardPopup: null,

    //mettre à jour le titre d'un QF
    updateTitle: function (title, positionId = 'rightpanel', titleHtmlId = null) {

        //titleHtmlId prioritaire sur tout. Donc le mettre à jour si il est passé en paramètre
        if (titleHtmlId) {
            $("#" + titleHtmlId).html(title);
            return;
        }

        if (positionId == 'htmlContainer' && frmObj.htmlContainerId) {

        } else {
            if (positionId == 'popup') {
                //mettre à jour le titre de la fenetre
                $("#iamQFPopupTitle").html(title);
            } else {
                if (positionId == 'stepper') {
                    //mettre à jour le titre de la fenetre
                    if ($("#iamQFStepperTitle").length) $("#iamQFStepperTitle").html(title);
                } else {
                    //mettre à jour le titre de la fenetre
                    $("#iamQFRightPanelTitle").html(title);
                }
            }
        }

    },

    //mettre à jour le titre d'un QF
    closeContainer: function (positionId = 'rightpanel', gpName) {


        if (positionId == 'htmlContainer' && frmObj.htmlContainerId) {
            $("#" + frmObj.htmlContainerId).hide();
        } else {
            if (positionId == 'popup') {
                //masquer la fenetre popup
                $("#iamQFPopup").hide();
            } else {
                if (positionId == 'stepper') {
                    //Masquer le dropdown du sterper
                    if ($("#iamStep_" + gpName).length) $("#iamStep_" + gpName)[0].click();

                } else {
                    //fermer le volet droit
                    $("#kt_iamQFRightPanel").removeClass("offcanvas-on");
                }
            }
        }

    },

    //Afficher un quickForm contenu dans le tableau des quickforms depuis son Id
    showForm: function (frmId, quickFormsArray, data, createIfNotExist = true) {

        //prendre l'objet QF dans le tableau
        let frmObj = iamShared.arrays.findByKey(quickFormsArray, "Id", frmId);

        //retourner null si aucun objet QF de cet Id n'a été trouvé
        if (!frmObj) {
            return null;
        }

        //Masquer tous les éléments du 
        //afficher le QF
        if (positionId == 'htmlContainer' && frmObj.htmlContainerId) {

        } else {
            //mettre à jour le titre de la fenetre
            this.updateTitle(frmObj.DisplayName, positionId);

            if (positionId == 'popup') {

            } else {
                if (positionId == 'stepper') {
                    //mettre à jour le titre de la fenetre
                    this.updateTitle(frmObj.DisplayName, positionId);
                    $("#iamQFStepperContainer").show();
                } else {
                    //mettre à jour le titre de la fenetre
                    this.updateTitle(frmObj.DisplayName, positionId);
                    //masquer tous les éléments contenus dans le RightPanel
                    $("#iamQFRightPanelContainer > *").hide();
                    //afficher le bon élément
                    if ($("#" + frmId).length) {
                        $("#" + frmId).show();
                    } else {
                        if ($("#" + frmId + "_" + positionId).length) $("#" + frmId + "_" + positionId).show();
                    }
                    //afficher le rightPane
                    if ($("#kt_iamQFRightPanel").hasClass("offcanvas-on") == false) $("#kt_iamQFRightPanel").addClass("offcanvas-on");
                }
            }
        }

        //retourner l'objet QF
        return frmObj;
    },

    //configArray :[{"Id":propertyId, "Name":propertyDisplayName, "Type": "Number | String | function()" ("Booleean", "Array", ensemble de type supporté par la propriété), "Default": null (property default value), "ReadOnly": false (si true la propriété est visible mais non modifiable), "AcceptedValues": ["clear", "spins"] (tableau des valeurs acceptables), "Url": "dxNumberBox/Configuration/buttons/", "localizationDescriptionName":"" (nom de localisation contenant la description de la propriété), "Description":"" (description à utiliser par défaut ou quand la localisation n'existe pas),"localizationCategoryName":"General" (nom de localisation contenant la catégorie de la propriété), "Category":"" (nom de la catégorie à laquelle appratient la propriété pour les regroupement de propriété) }]
    createPropertyGrid: function (objectConfigurationName, configArray, containerId = "iamPropertyGridContainer", onePropertyGridOnly = true) {

        //Sortir si le contenur du propertyGrid n'existe pas
        if ($('#' + containerId).length < 1) return;

        let self = this;
        let $divContainer;

        //Vérifier si le propertyGrid doit être unique donc recréé à chaque fois
        if (onePropertyGridOnly) {

            //Détruire le propertyGrid d'abord
            if (this.activePropertyGridForm) this.activePropertyGridForm.dispose();

            //Vider le contenu
            $('#' + containerId).empty();

            //Créer un nouveau div
            $divContainer = $('#' + containerId).append(`<div id="iamPropertyGrid"></div>`);


        } else {

            if ($('#' + containerId).children('div[data-property-grid-name="' + objectConfigurationName + '"]').length > 0) {

                //Masquer tous les propertyGrid
                self.propertyGridsforEach(function (el) {
                    if (el.name == objectConfigurationName) {
                        //afficher le bon propertyGrid
                        //$divContainer = $('#' + containerId).children('div[data-property-grid-name="' + objectConfigurationName + '"]').first().show();
                        el.propertyGridForm.option("visible", true);
                        self.activePropertyGridForm = el.propertyGridForm;

                    } else {
                        el.propertyGridForm.option("visible", false);
                    }
                })

                return self.activePropertyGridForm;

            } else {

                $divContainer = $('#' + containerId).append(`<div data-property-grid-name="${objectConfigurationName}"></div>`);
            }
        }

        //Créer le dxForm avec ces attributs par défaut
        let dxFormOption = {
            name: "iamPropertyGrid",
            focusStateEnabled: true,
            formData: null,
            hoverStateEnabled: true,
            items: null,
            labelLocation: "top",
            scrollingEnabled: true,
            showColonAfterLabel: false,
            width: "100%"
        };

        //créer les items du propertyGridForm
        let activeGroupName;
        var activeGroup;
        let items = [];

        
        configArray.forEach(function (item) {

            let itemCategoryName = (item.localizationCategoryName) || ((item.Category) || 'General');

            //Créer le groupe si nécessaire
            if (itemCategoryName != activeGroupName) {
                activeGroupName = itemCategoryName;

                //Vérifier si le groupe n'a pas déjà été créé précédement
                if (iamShared.arrays.existsByKey(items, "name", activeGroupName)) {
                    activeGroup = iamShared.arrays.findByKey(items, "name", activeGroupName);

                } else {
                    //créer un nouveau groupe car le name n'existe pas déjà
                    activeGroup = {
                        name: activeGroupName,
                        itemType: "group",
                        colCount: 1,
                        caption: (item.localizationCategoryName) ? ((!app || !app.localize) ? item.localizationCategoryName : app.localize(item.localizationCategoryName)) : ((item.Category) ? item.Category : ((!app || !app.localize) ? 'General' : app.localize('General')) ) ,
                        items: []
                    }

                    items.push(activeGroup);
                }

            }

            var buttons = [];

            if (item.Type && (item.Type.toLowerCase().includes("function"))) {
                buttons.push({
                    name: "iamCodeEditorBtn",
                    location: "after",
                    options: {
                        icon: "fas fa-code",
                        stylingMode: "text",//text
                        type: "normal",
                        onClick: function () {
                            //afficher le propup de sélection des valeurs de la liste
                        }
                    }
                });
            }

            if (item.AcceptedValues && (item.EditorType == "dxTextBox" || item.EditorType == null)) {

                //créer le button de list
                var newBtn = {
                    name: "iamAcceptedValuesSelectorBtn",
                    location: "before",
                    options: {
                        icon: "fas fa-list",
                        stylingMode: "contained",//text, outllined
                        type: "normal",
                        onClick: null
                    }
                }

                //Vérifier si c'est un tableau
                if (Array.isArray(item.AcceptedValues)) {
                    let arr = item.AcceptedValues.map(function (item) { return { value: ((item === false) ? 'false' : item), text: item.toString() } });

                    newBtn.options.onClick = function (e) {

                        //Afficher le popup ou context menu de sélection des éléments selon le cas
                        iamShared.ui.contextMenuShowSelection(
                            app,
                            arr,
                            function (itemData) {//callbackFunction,                                
                                iamQF.activePropertyGridForm.updateData(item.Name, itemData.value);
                                return;
                            },
                            null, //cmOption,
                            null, //keyExpr,
                            null, //displayExpr,
                            null, //localizationDisplayExpr,
                            null, //itemTemplate,
                            null, //selection
                        );
                    }
                    buttons.push(newBtn);
                } else {
                    //vérifier si c'est une chaine
                    if (typeof item.AcceptedValues === 'string' || item.AcceptedValues instanceof String) {

                        switch (item.AcceptedValues) {
                            case 'iamSystemIcon': {
                                newBtn.options.onClick = function (e) {

                                    //Afficher le popup de sélection des icones système
                                    iamShared.fontAwesome.createFontAwesomePopupSelector(app, function (selectedItem) {
                                        iamQF.activePropertyGridForm.updateData(item.Name, ((selectedItem) ? selectedItem.name:null));
                                    }, "solid");
                                }
                                
                                buttons.push(newBtn);
                                break;
                            }
                            default: {
                                //ne rien faire
                                break;
                            }
                        }
                    } else {
                        //vérifier si c'est une fonction
                        if (typeof item.AcceptedValues === 'function') {

                            //Gérer le Eval pour contextualiser les variables et fonctions disponibles dans le click
                            let fn;
                            eval("fn=" + item.AcceptedValues.toString() + ";");                            
                            newBtn.options.onClick = function (e) {                                
                                fn(self.activePropertyGridForm, window);
                            }

                            buttons.push(newBtn);
                        }
                    }
                }
            }

            let editorType = (item.EditorType || "dxTextBox");
            let editorOptions = {
                stylingMode: "filled",// "outlined",
                buttons: ((item.ReadOnly) ? null : buttons),
                readOnly: item.ReadOnly,
            };

            if (item.EditorOptions) {
                editorOptions = item.EditorOptions;
            } else {
                if (item.EditorType == "dxSelectBox") {
                    editorOptions = {
                        stylingMode: "filled",// "outlined",
                        dataSource: item.AcceptedValues,
                        readOnly: item.ReadOnly,
                        onValueChanged: function (e) {
                            self.activePropertyGridObject[item.Name] = e.value;
                        }
                    };
                }
            }

            var newItem = {
                name: item.Name,
                editorType: editorType,
                itemType: "simple",
                dataField: item.Name,
                label: {
                    text: item.Name,
                    visible: true
                },
                editorOptions: editorOptions,
                isRequired: item.IsRequired
            }


            //Ajouter la propriété au groupe actif du propertyGrid
            activeGroup.items.push(newItem);

        });

        //Récupérer les items créés
        dxFormOption.items = items;

        //créer le propertyGrid dans le Html
        if(onePropertyGridOnly) {
            //créer le form propertyGrid
            self.propertyGrids = [{ name: "iamPropertyGrid", propertyGridForm: $divContainer.dxForm(dxFormOption).dxForm("instance") }];
            self.activePropertyGridForm = self.propertyGrids[0].propertyGridForm;

        }  else {
            //créer le form propertyGrid 
            dxFormOption.name = objectConfigurationName;
            self.propertyGrids.push({ name: objectConfigurationName, propertyGridForm: $divContainer.dxForm(dxFormOption).dxForm("instance") });
            self.activePropertyGridForm = self.propertyGrids[(self.propertyGrids.length - 1)].propertyGridForm;
        }

        //Créer les fonctions nécessaires à l'utilisation des fonctions internes entre les boutons du propertyGrid  ********************************************  
        //Modifier la valeur d'une propriété du propertyGrid
        self.activePropertyGridForm.setPropertyValue= function(propertyName, newValue){
            iamQF.activePropertyGridForm.updateData(propertyName, newValue);
        };

        //Recupérer la valeur d'une propriété du property grid
        self.activePropertyGridForm.getPropertyValue = function (propertyName) {
            return iamQF.activePropertyGridForm.option('formData')[propertyName];
        };


        return self.activePropertyGridForm;

    },

    //permet d'affiher les propriétés d'un objet dans un propertyGridForm
    showObjectProperties: function (obj, objectConfigurationName, configArray, containerId = "iamPropertyGridContainer", onePropertyGridOnly = true) {
        let pGrid = this.createPropertyGrid(objectConfigurationName, configArray, containerId, onePropertyGridOnly);

        if (pGrid) {
            pGrid.option("formData", obj);
            this.activePropertyGridObject = obj;
        }
    }
};