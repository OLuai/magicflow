var generatedId = 100;
var iamFlow = {

    //Element actif selectionné
    activeItem: null,

    init: function () {
        $("#btn-import").on('click', (e) => {
            iamFlow.transfert.importFlow();
        });

        $("#btn-export").on('click', (e) => {
            iamFlow.transfert.exportFlow();
        });

        $("#iamFlowBtnEditFlowName, #iamFlowNameSave, #iamFlowNameCancel").on('click', (e) => {
            let targetId = e.currentTarget.id;
            switch (targetId) {
                case "iamFlowBtnEditFlowName":
                    $("#iamFlowDisplayName").attr('style', 'display: none !important');
                    $("#iamFlowEditName").attr('style', '');
                    break;
                case "iamFlowNameSave":
                    let name = $("#iamFlowNameInput").val();
                    if (name && name != iamFlow.flow.FlowName) {
                        iamFlow.flow.FlowName = name;
                    }
                    else {
                        name = iamFlow.flow.FlowName;
                    }
                    $("#iamFlowName").html(name);
                    $("#iamFlowNameInput").val(name);

                case "iamFlowNameCancel":
                    $("#iamFlowEditName").attr('style', 'display: none !important');
                    $("#iamFlowDisplayName").attr('style', '');
                    break;
            };
        });

        $("#iamFlowNameInput").val('');
        $("#iamFlowNameSave").trigger('click');

    },

    //Les fonctions de transfert du flow
    transfert: {
        //Fonction d'export de flow
        exportFlow: function () {
            iamShared.files.stringToFileDownload(iamFlow.flow.FlowName + ".json", JSON.stringify(iamFlow.flow));
        },
        //Fonction d'iport de flow
        importFlow: function () {
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
                    let flow = JSON.parse(content);

                    iamFlow.flow = flow;

                    $("#flow-container").html('');
                    iamFlow.transfert.import(flow.FlowActions);

                    $("#iamFlowNameInput").val('');
                    $("#iamFlowNameSave").trigger('click');


                    iamShared.messages.showSuccessMsg("Imported !")
                    return flow;
                }
            }

            input.click();
        },
        //Fonction d'affichage du flow importer
        import: function (array) {
            let func = iamFlowBuider.importBuilder;
            let printChildren = function (children) {
                for (let node of children) {
                    if (!(node.Type == "IF_CONDITION_YES" || node.Type == "IF_CONDITION_NO")) {
                        func(node);
                    }
                    if (node.Items) {
                        printChildren(node.Items)
                    }

                }
            }

            printChildren(array);
        }
    },

    //Le flow et ses propietes
    flow: {
        FlowId: iamShared.utils.guidString(),
        FlowName: "Sans Titre",
        //Array de toutes les actions
        FlowActions: [],
        //Variables du flow
        FlowVariables: [],
    },

    //Les fonctions du property grid
    propertyGrid: {
        //Afficher les proprietes d'in item dans le property grid
        showItemInPropertyGrid: function (item) {
            iamFlow.activeItem = item;


            if (item) {

                let configArray = iamFlow.action.actionTypes[item.Type].ActionOptions || [];

                let itemProxy = iamFlow.propertyGrid.getItemPropertyGridProxy(item.Options);
                //Afficher le propertyGrid
                iamQF.showObjectProperties(itemProxy, "Options", configArray, "iamTabPanel", true);

            }
            else {
                iamQF.showObjectProperties(null, "Options", [], "iamTabPanel", true);
            }
        },

        //Retourner le proxy pour le propertyGrid d'un item
        getItemPropertyGridProxy: function (item) {

            //Si l'item est vide alors sortir
            if (!item) return;

            //retourner le proxy
            return new Proxy(item, iamFlow.propertyGrid.propertyGridProxyValidatorHandler);
        },

        //Handler proxy qui sera utiliser pour gérer la validation et la mise à jour des interfaces en fonction de la modification des propriétés des items
        propertyGridProxyValidatorHandler: {

            set: function (options, prop, value) {

                options[prop] = value;

                iamFlow.action.update(iamFlow.activeItem.Id, { Options: options });
                return true;
            },
        },

        //Afficher les Options d'une action via son Id
        showActionOptionsInPropertyGrid: function (actionId) {

            let action = iamFlow.action.get(actionId);

            iamFlow.propertyGrid.showItemInPropertyGrid(action);

        },
    },

    //Méthode sur les actions
    action: {
        //Recuperation des options de l'action
        getOptions: function (actionType) {
            let Options = {};
            if (iamFlow.action.actionTypes[actionType].ActionOptions) {
                iamFlow.action.actionTypes[actionType].ActionOptions.forEach(option => {
                    Options[option.Name] = option.Default;
                });
            }

            return Options;

        },
        //Retourne une Action 
        get: function (actionId) {

            let items = iamFlow.flow.FlowActions;
            let node;

            let getNode = function (actions, node) {

                if (node) {
                    return node;
                }

                for (let action of actions) {
                    let node;
                    if (action.Id == actionId) {
                        node = action;
                    }
                    else if (action.Items) {
                        node = getNode(action.Items);
                    }
                    if (node) {
                        return getNode([], node);
                    }
                }
                return;
            };

            node = getNode(items);

            return node
        },
        //Update les proprietes d'un item
        update: function (itemId, properties) {

            let action = iamFlow.action.get(itemId);
            if (action) {
                for (let property in properties) {
                    let propertyTextView;
                    action[property] = properties[property];

                    if (property == "Options") {
                        for (let option in properties[property]) {
                            propertyTextView = $(`#${itemId}-${option.replace(/\s/g, '')}`);
                            if (propertyTextView.length > 0) {
                                propertyTextView.html(properties[property][option]);
                            }
                        }
                    }
                    else {
                        propertyTextView = $(`#${itemId}-${property}`);
                        if (propertyTextView.length > 0) {
                            propertyTextView.html(properties[property]);
                        }
                    }

                }
            }
            return action;
        },
        //Insérer l'action à une position dans le container
        setPosition: function (action, toContainer) {
            let insertIndex = toContainer.findIndex(elt => elt.Id == action.BeforeAction) + 1;
            toContainer.splice(insertIndex, 0, action);

            if (toContainer.length != 1 && (insertIndex < toContainer.length - 1)) toContainer[insertIndex + 1].BeforeAction = action.Id;
        },
        //Fonction de creation d'une nouvelle action
        //beforeAction represente l'action qui precede l'action courante
        create: function (actionType, beforeAction, parentId) {

            // Permet d'identifier la position de l'action dans le flow
            beforeAction = beforeAction || null;
            parentId = parentId || null;

            let action;

            action = {
                Id: ++generatedId,
                Type: actionType,
                Name: iamFlow.action.actionTypes[actionType].Name,
                DisplayName: iamFlow.action.actionTypes[actionType].DisplayName,
                Description: "",
                BreakFlow: false,
                BeforeAction: beforeAction,
                ParentId: parentId,
                Options: iamFlow.action.getOptions(actionType),
            };

            let toContainer = iamFlow.flow.FlowActions;

            //Ajout de donnees supplementaires
            switch (actionType) {
                case 'CONTAINER':
                case 'FOR_LOOP':
                case 'FOR_EACH':
                case 'DO_WHILE':
                case 'WHILE':
                case 'SWITCH_CASE':
                case 'SWITCH':
                    action.Items = [];
                    break;
                case 'IF':
                    action.Items = [
                        {
                            Id: `yes-${action.Id}`,
                            Type: iamFlow.action.actionTypes["IF_CONDITION_YES"].Name,
                            Name: iamFlow.action.actionTypes["IF_CONDITION_YES"].Name,
                            DisplayName: iamFlow.action.actionTypes["IF_CONDITION_YES"].DisplayName,
                            Description: "",
                            ParentId: action.Id,
                            Items: [],
                        },
                        {
                            Id: `no-${action.Id}`,
                            Type: iamFlow.action.actionTypes["IF_CONDITION_NO"].Name,
                            Name: iamFlow.action.actionTypes["IF_CONDITION_NO"].Name,
                            DisplayName: iamFlow.action.actionTypes["IF_CONDITION_NO"].DisplayName,
                            ParentId: action.Id,
                            Description: "",
                            Items: [],
                        }
                    ];
                    break
            }

            if (parentId) {

                let parent = iamFlow.action.get(parentId);
                if (parent) toContainer = parent.Items;

            }
            iamFlow.action.setPosition(action, toContainer);

            return action;
        },
        //Suppression d'une action
        delete: function (Id) {

            let action = iamFlow.action.get(Id);
            let parentItems = iamFlow.flow.FlowActions;
            if (action.ParentId) {
                let parent = iamFlow.action.get(action.ParentId);
                if (parent) parentItems = parent.Items;
            }
            let actionIndex = parentItems.findIndex(elt => elt.Id == Id);
            parentItems.splice(actionIndex, 1);

            if (parentItems.length > 0 && parentItems.length != actionIndex) {
                parentItems[actionIndex].BeforeAction = action.BeforeAction;
            }

            return parentItems;

        },
        //Modification de la position d'une action
        move: function (actionId, beforeAction, newParentId) {

            newParentId = newParentId || null;

            let action = iamFlow.action.get(actionId);
            let newParentItems = iamFlow.flow.FlowActions;

            if (action) {
                iamFlow.action.delete(action.Id);

                //si l'action va dans un conteneur
                if (newParentId) {
                    let parent = iamFlow.action.get(newParentId);
                    if (parent) {
                        newParentItems = parent.Items;
                    }
                }


                action.BeforeAction = beforeAction;
                action.ParentId = newParentId;

                this.setPosition(action, newParentItems);
            }

            return action;

        },

        actionCategories: {

            CONTAINER: { Name: "CONTAINER", Icon: null },
            BOUCLE: { Name: "BOUCLE", Icon: null },
            CONDITIONS: { Name: "CONDITIONS", Icon: null },
            GENERAL: { Name: "GENERAL", Icon: null },
            USUELLE: { Name: "USUELLE", Icon: null },
            DIAGRAMME: { Name: "DIAGRAMME", Icon: null },
            GRAPHIQUE: { Name: "GRAPHIQUE", Icon: null },
            TRANSFERT: { Name: "TRANSFERT", Icon: null },
            KPI: { Name: "KPI", Icon: null },


        },

        actionTypes: {
            "GetMedia": {
                "Name": "GetMedia",
                "DisplayName": "Acquisition media",
                "Description": "Permet de lancer l'enregistreur de média pour enregistrement audio ou video. Le fichier ainsi créé est soit enregistré à un emplacement physique ou intégré dans le logiciel.",
                "IconUrl": null,
                "Category": "GENERAL",
                "Color": null,
                "ActionOptions": [
                    {
                        "Id": "config_UseExistingConnection",
                        "Name": "UseExistingConnection",
                        "Type": "String",
                        "Default": false,
                        "ReadOnly": false,
                        "AcceptedValues": [
                            false,
                            true
                        ],
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "Acquisition Media",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                    {
                        "Id": "config_ObjectToUpdate",
                        "Name": "ObjectToUpdate",
                        "Type": "String",
                        "Default": null,
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "Acquisition Media",
                        "IsRequired": false,
                        "EditorType": null,
                        "EditorOptions": null
                    }
                ]
            },
            "ActionCoteClient": {
                "Name": "ActionCoteClient",
                "DisplayName": "Exécuter une action coté client (Alert, Confirm, InputBox, JsEval etc.)",
                "Description": "Permet d'exécuter un MessageBox, un inputBox ou même une fonction Eval Javascript coté client.",
                "IconUrl": null,
                "Category": "GENERAL",
                "Color": null,
                "ActionOptions": [
                    {
                        "Id": "config_UseExistingConnection",
                        "Name": "UseExistingConnection",
                        "Type": "String",
                        "Default": false,
                        "ReadOnly": false,
                        "AcceptedValues": [
                            false,
                            true
                        ],
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "Action Cote Client",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                    {
                        "Id": "config_ObjectToUpdate",
                        "Name": "ObjectToUpdate",
                        "Type": "String",
                        "Default": null,
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "Action Cote Client",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                    {
                        "Id": "config_mapping",
                        "Name": "Mapping",
                        "Type": "String",
                        "Default": null,
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "Action Cote Client",
                        "IsRequired": false,
                        "EditorType": null,
                        "EditorOptions": null
                    }
                ]
            },
            "activation_affichage_objet": {
                "Name": "activation_affichage_objet",
                "DisplayName": "Activation, affichage et apparence objet",
                "Description": "Active/désactive ou Affiche/masque des objets ou modifie l'apparence (couleur, police etc.) de l'objet",
                "IconUrl": null,
                "Category": "GENERAL",
                "Color": null
            },
            "activer_desactiver_afficher_masquer_objets": {
                "Name": "activer_desactiver_afficher_masquer_objets",
                "DisplayName": "Activer/Désactiver - Afficher/Masquer objets",
                "Description": "Permet d'activer, de désactiver, afficher ou masquer les objets passés en paramètre dans chaque regroupement.",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAN1wAADdcBQiibeAAAAtlJREFUSEtj/P//PwNNAcgCWmKaGg4OHXyuBwYdk7aRpYqeqamvnql5ia6JWZmesWmmvqlpjK6Jub+ekZkTkK2N1wx0SQMTCwddU/MmENYzMavXNzGP1TEzM9HWduCxtLTk1NOzEtMxNlY2MDU1AFpgC7QgHKiuRd/UvNnQ3FwL3TywD0JDQ5mBLssDG2pq6gx0OSOp8eLg4MAC8p2usWkjiA3TDw8ibUtLIZgg0EUcZta21oFh4Y2B0YkzAhKL1kVkVS6wcHCyBcqx4bPc3NycD1keJQ6AmiWj4uLXNre33925e9e3azdv/49r2/F/5aE7//s2XvtfuuDs/7KZe78VdC17kFjatsPJNyQKqAfuWmwWwy1w9/F1qmloePj4yaP/7969AeO+lSf/Z04/+X/NkTv/d5688T+5uPm/W1Tu/8wJu/4XzT//P3vGyf/RBW33vAOCknD5CmwB0BV8RWXll2EGw+iCyfvABtUsu/R/xqLV/4vLyv8D1YItAYmDMEjNgYMHvkXExu0CynFijWSghGBdU9MtXBaADAIZCjIcmwUgfXfu3P4Xl5xyFCgPj0uUfACM0PrTZ0//QrYEFkQgC0DBArIEOYhAwQdSA9Pz+PHD/9V19Tey8wv2RMTELQBaxg6PAyCHOSw6ZvO1a1f/wDU8e/E/vn0nPDhgwQKjQXKPgWqQLZgwefKLlIzM4/4hoR2gFIeeilgi4+K3HT95/CdM04Ezt8GWgFwLMxjEBomB5GDqTp0+9SM6PgEUD3I4kyk0whmDwiNagC55+uLFM7ABIFeCggIUoSAMYsNc/vbt6/+Llix5DfR9N9BwjAyKsyyyd3FTj01MWtna0XHn5KmT/2GWwVx8+86t/0BHPEpKz9juHRjkhDeZ4suZQFfxunr5RIdGRU9PzsjcmJSWvg6YJBcDE0UdUE6EUJEysMU1IdcRIz/qA4IhQFABMeFMUpVJqYHo+gHer9oDvj4C0QAAAABJRU5ErkJggg==",
                "Category": "USUELLE"
            },
            "actualiser_objet_depuis_source_tabulaire": {
                "Name": "actualiser_objet_depuis_source_tabulaire",
                "DisplayName": "Actualiser objets depuis source tabulaire",
                "Description": "Renseigner des objets d'un formulaire ou des tableaux à partir d'un autre tableau ou arborescence.",
                "IconUrl": null,
                "Category": "USUELLE"
            },
            "afficher_enregistrement": {
                "Name": "afficher_enregistrement",
                "DisplayName": "Afficher enregistrement du formulaire en cours",
                "Description": "Permet de charger l'enregistrement dont l'identifiant est passé en paramètre dans le formulaire en cours.",
                "IconUrl": null,
                "Category": "USUELLE"
            },
            "afficher_popup_objet": {
                "Name": "afficher_popup_objet",
                "DisplayName": "Afficher formulaire popup local non  contenu dans la liste des formulaires.",
                "Description": "Cette action est surtout utilisée pour donner des informations complémentaire ou détaillées des objets présents sur le formulaire source. Il peut aussi être utilisé pour présenter une aide contextuelle etc.",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAASRJREFUOE+lUqFyhTAQjKysrH2yn9BfQCKxkZGRsZFPImuRkZHYSCQSi3wSeb29N/caqjL0ZpadMHd7mwUzDANxmasw3nuy1lJaiXw+TnB8Bmx6kEtPBobpl00IAQ4ITg7mnR+PRu7GnUyMUQRUZGOBsjNYZa544fO7y1Tz132jl4NaBE1pI8oMsALCbzaL8MRX/ozr2UEtAgff3KTIPAQHEFW+hYUkxLoQKPLo+16aY2EsRKEcsjXMz+1+PujDs4CG6JyTr+HiRPaeyU87NxS6cRMYzWcu7KSQwSCwrqsIYHNroV8ExnGUmZSS2F8W9txQ6JU/UHPAYNd1gpaCWxGACy28/JdAy+Z6mThAGFfqdYWrAriqOECa+vMoQ/0vMKAZKf8AQTw7zWlr8ZwAAAAASUVORK5CYII=",
                "Category": "GENERAL"
            },
            "assistant_chaine_connexion": {
                "Name": "assistant_chaine_connexion",
                "DisplayName": "Assistant chaine de connexion",
                "Description": "Permet d'afficher l'assistant pour la création d'un chaine de connexion à une base de données.",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "assistant_sql_ou_formule": {
                "Name": "assistant_sql_ou_formule",
                "DisplayName": "Assistant édition SQL ou formule",
                "Description": "Permet d'ouvrir l'editeur avec un assistant d'edition de SQL, sélection des paramètres du formulaire ou création de formule de calcul en utilisation.",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAB5FJREFUWEfFl3tM1WUYx2uaW9OlTrxPUlG8Y1ppE2mJGTjnJSvFIep0qKCmaXhLYRkyM5003dxqzkrNnJptzT8sRRQRuQZCeuAcLoeD3OQA53C4HC5+e76vvnTix9raav22Z7/LOed9Ps/3uby/8zyA5/7XgwC0gIAAn7Vr1944dOhQ88GDBx3/lsXFxTlosq7zwIEDjcHBwVf79u3rx6BV8Bpg1apVZ6qqquT2vz0SEhIwZsyYH8W/118AoqOjf6PrJ0+eKOvo6FDW3t6OtrY2tLa2wu12K2tpaUFzczOamprQ2NiozOVyoaGhQZnT6YTD4UB9fb2yuro61NbWqs94njZtmkkAZvwFYM+ePRkagE49HWvndNwqn7XKF90C2dJB60BTW7uyxtY2sVa4BLJBzCnfdza3wCGwtc9gqLKfn1++ALzZLYBn1J6R07lblLCXlqIw4TqKExNQlHgTRbcSYbmt7RbMSbdQkHQb+XeemomWnITKsjI4nA0gwJQpU4wAu3btUgp0jZyOlXOJrLHFjbsx+1D89UnYvj0F24l42D6Pgy3mE9iiPoItcgNsa8JgW/4ebAuCYZvzJspnvgrTy0Nx7/iXaBC1KisrMWnSJCNAVFRUJwAlp2nnSnr5sd1mQ+62jag6dRKl8Udgi/0UZXuiULo1EqXhq2ENXQbr4gUonjcHRbNmoOiVybD6jkZO7xdwI/YAXJKyyooKTJw40QiwY8cOBUDZdaHpYmuWYmuRnFebC5C7fCF++XAT0i78gJRvTiPt7Bnk/ngZ2ZcvIuXcWSR/fw4ZVy4j9fIl3JT7hDPf4ddvv4EpJ0dS4ESFAEyYMMEIsH37dgXQNXJd7c1PgIrUFGQvegeWmwloJ6yYWVSJPXIEsV8chcVWBrsU28f79mF/bCxcEoxTlKyXIqyR6q+12xXAuHHjjADbtm1TAJ5t5tlqTfJZmUSW6T8dpXm/w8UKl4jYVseOHYOXlxf279+PmJgYLF68GBIQampqYBenLDzmntfl5eXw9fU1AmzdurUTgI4NfS41YJZ8p87xVws6pe/Z35wFBJk6dSp69uyJixcvqjnCnn/8+DGqq6s7AQj06NEjDiIjwJYtWxQA885F9ZDhgHHJoHE0NuHBewuREfI+7HLNQUMnBOWxbt06bipITExUnaQj19FTegIRwMfHxwiwefNmBdDdhHMJUO2jcpj8X0P2wc9Q726FU5wXFhYiR4rr+vXrSnYCbNq0ST3PzMxUEJSezim9Bhg9erQRICIiQgGoyCXqJk40iaRBIuRUq/otC/kzXkG+VD8BeOzdu1c5lU1MOZ09ezZ69eql7u/fv68AtHMNUCYDaeTIkX8DIHK7ZfHKkhKkb1yPfGk1ilz20xWYpk9B0e3bqrJZrIz+/PnzKjIeJpMJp0+fRkFBgQqEAKwBOqf0vLZJ13QLsGHDhqc1IFGX3LuH9BUfwLV3F7LCQlHX3oGS+KPInTwOpQ8fokaKziTn4uJitbjZbMZDuacKdMT7Bw8eIDc3FxaLRanA56wHAnh7exsVWL9+vQKoE+qf576FK9P9YFq1EsXB82BJTUdB+DpkvPE6auTzfFl06dKlmD9/PhYtWqTyv2TJEnXmvb4ODAzEpUuXVLfQMeuhVPaSESNGGAHCw8MVAKv+4b1U5ElEaRERqA4MQEZcLHLnByH13SWodjXCLr1PuRkhLS8vT+U8OzsbWVlZypgenqkSoycAlSDA8OHDjQDSRgpAtZakgXWQGR+PqrmBSJw1E+mjvJEaEw27FCBzyzakMdeseBnluHbtmjLZ2lVq9OChczrmM6vVimHDhhkB1qxZowA4VPgSwTFqSUuD9e25yBk+FCkv9UH2hQuolznxWIpJDxgWIKXduXMn5NULKSkpWLFiBUqkiOmQzj0B+HzIkCFGgNWrVysA/SbjkFRUyOLZwUFw+oxCxmAv5CXfQb0opJ2zqGj8DccwZwC7gnnn1PN0zsiZCgIMHjzYCBAWFtYJwKJRJircCg+He6AX7vr6quJj/qufOWbkNKpG2WXC4fDhw50DR0dO+elYAwwaNMgIsHLlSgVA+bnBMH9OAUiTOVAmw+aGvz+snO1inuOV3+URGRnJVy3Virra6ZiR04qKisAhxKIcOHCgESA0NPRpGz57gSRArUhrzc/HnRdfxNWQEFTJkNLO6YSwx48fh2xk2L17N5KSkhQ4HXs6Z/R0TEUIMmDAACOAFE4nAPOnTBajXRV5b549ixoB0rOdLUWAEydOICgoCMnJyUo5T+faMZ1TGX7Gc//+/Y0AISEhCoCLaABV7ZRdCrJalPF0rscru4CqdSc7HWvjRNQA/fr1MwIsW7YskwCUkIt23cs9dzXtnDml6ai17Dpyyk1j1ATgc153CyCjNasrACF0q+mK17sbK5pGAN1uuuDoiKYBeOb+oGugd+/eRgVkOHzFPHKX8/xHo1tSdwYV8rTOdD1TTaunFdQzg2e2K1/ZZAtPF5slAf/531AeePfp0+ecvK8VjB071iJm/juT75n/iY0fP94s23Bhjx49MsRXtNjIrgD8w9qf/9nE5vyHFiBrjxLrSYA/AFiXw1hzIOwVAAAAAElFTkSuQmCC",
                "Category": "USUELLE"
            },
            "calcul_ponctuel_sur_formule": {
                "Name": "calcul_ponctuel_sur_formule",
                "DisplayName": "Calcul de formule ou SQL ponctuel",
                "Description": "Permet de lancer un calcul à partir d'une formule configurée ou de lancer un SQL ponctuel pour le remplissage d'un objet. Ce calcul n'est réalisé que chaque fois que l'action est lancée. Pour les tableaux, vous pouvez lancer l'opération sur les lignes sélectionnées ou toutes les lignes du tableau",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAA2FJREFUSEutlslPU2EUxdFA1JiwkchChJ1BY3ShC7b6V8DGhJCIogtj3JYhGBeoUdAyBClBWjYkssAgRhYmjiHBpJa5hU6vlAId6PCgTMd7L31NkZYq2uTk8qbfOd+9X1/JyfkPn/Ly8qN/gqmgm/AXUunecH5+PkpLS1FZWWml4+OkI5nMYLFYoKoqsn3i8Tji8XWR1+uFoigYGxtDSUmJQvACUtoV/RFcM2d4MBjAwMAb+Hw+OT04OIiysrJtMshPZ3Jg8J2dHbnOdXt7W9IHAgEYjb0IhUJyLRqNor+/H3l5eR1kcPL3dqU10IBbW5sC5rq5uSkG4XAYBoMh3dymCX6GlJc6jz0GqeC+vj6YTCZo1WQy0rFREo+PW/D+3RAaGxvwkFRTXcWGbtI50rF9BqlgTrqxsTvQ9fW1ZF1fU+XvSHgVDocdttlpjI5+x9DQW9y/d5cNAqTziV2V9JAVaC1IBWfauquhIEJBv8ijuPD500c06B5oLbtIz53Yt4JUMCddU2PJHqtqFLFoBNFIGAUFp6SylpcW4bTbRI8f6bT7L6U14FZoYA3YUF8vD92pqUEkskrDDdEW9SPgX4af5PG4kgZGwwvN4HJaAzVGKWO7KVkMHBn5gLq6WhQXF+P27VtYDQUEvrLsg3fBDZfTDsXtEJOsBgKl4XHKEIE4aTCwgm9fv0iy69evYdHrEThXj+IUuMs5f3gDK+2SulodreAsug1dYnhog2TqRHJuxfDwEAoLT+NW9U34V5YScEXa43bZ4XLMwemwwWG3oufV84NnwEPTIJySdfXqFXmId4tv0SMqKirCArXH7ZqHfX4W83MzmLNNo6czi8EuZEHEPV70Khlf4Qzn1BrcZp3KbsDLXqBtp4mHyEk9iiNZFTe1xTmXhDPYOjOBmSkLujueZm4Rv+d5R3BfOZ1ClWF6fQta9S8EylX/slkkyQlum50U+PTkTxjaDzDw+/00LBoYfysTQ9OSasdcuecO0l64GVMTZnS1Pc68ArPZTHCrPKwNTusxn+PEUmmYLE7O4uRTk2ZMWH6gU9+U2aCjvRm9hhb5NvZ2tZDomCpvvdekZO18JsPkfrO62p6IOlubUF1VkfFddOMvfvCz/XOgI9aF31/XuXSiMHGBX1T/IoYzK/cX1fsMZd929t0AAAAASUVORK5CYII=",
                "Category": "USUELLE"
            },
            "CallByName": {
                "Name": "CallByName",
                "DisplayName": "CallByName : lancer Méthode ou manipuler propriété objet",
                "Description": "Lance la fonction CallByName pour permettre l'exécution de la méthode d'un objet, la modification de la propriété d'un objet ou retourne la valeur de la propriété de l'objet",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "creer_identifiant": {
                "Name": "creer_identifiant",
                "DisplayName": "Générer identifiant depuis compteur",
                "Description": "Créer une nouvelle valeur d'identifiant depuis un compteur",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "diagram_creer_shape": {
                "Name": "diagram_creer_shape",
                "DisplayName": "DIAGRAMME: Créer shape (forme).",
                "Description": "Permet de créer une shape depuis un model ou selon le type disponible dans les librairies des constructeurs de shape (ShapeFactory)",
                "IconUrl": null,
                "Category": "DIAGRAMME"
            },
            "diagram_org_tree": {
                "Name": "diagram_org_tree",
                "DisplayName": "DIAGRAMME: Créer arborescence organisationnelle (Org Tree)",
                "Description": "Permet de créer une arborescence organisationnel dans un diagramme a partir d'une requete SQL ou d'une source tabulaire",
                "IconUrl": null,
                "Category": "DIAGRAMME"
            },
            "envoyer_mail": {
                "Name": "envoyer_mail",
                "DisplayName": "Envoyer mails",
                "Description": "Envoyer un mail à une liste de contacts",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "envoyer_sms": {
                "Name": "envoyer_sms",
                "DisplayName": "Envoyer sms",
                "Description": "Envoyer un sms à une liste de contacts",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEgAACxIB0t1+/AAABTpJREFUWEetlQlMFGcUxxWPUqWgNagtSrWKWmub6kpR2mgVrCJUqAQPThWWQyqUELnEWsBFrJB6oILibQ/P1kajxKPqpkljq1hFxQYrRuRUFpFrl5p/v/ftzDCzEiBjJ/nlve//vffmv/PBTE8APejyWBA62Lrfq9/ZDhzozgUVV4PBcK61uSXg9OFdNd1uJwOEd8jyswcK9cg/Xohvdh+SIG38xOkSE6fOAUG6vI76SKM54szuRH5zIjAmGbr8g4hKzVKyKgsJ67ciJSdfgtZRq9a9gC7vAGhOd24s1kgGAr5IQiQbOtM7UDXUT3NUGVgcnYjIlExEb7yimgjWT3NUGVgUuRIRyTrsvNykGuqnOaoMLIiIR3iSDjsuNTKaLCBN1OVRmYcnrQXNUWXATxsHbeJa5F1sRP6vDIoCCo325Pssp31Cm5gBmqPKgO+yWGgT0rH9wjOJPJaLkE65uG+p0zqM9dMcVQZ8lqxA6Mo0bDvXIPCMRYHzFJnOo5CLe7zerFM/zVFlgL1AEBr/NbaygWaeWSDXOs6Xxa+hF5E6A17+4VgStxqbC59yNp1+io0S9SwnRE2Zby5sYD0NCPkyFV6Lw9UZ8FgYhpDYVOh+qkMmxwDdz3UcWou6PFJuhtUygmNXgeaoOoLZfksRFJOCjGNPsJZBUY6oUbRErAtakQKao8rArPkhCGSv0fQjtYzHnDQBnh8mTdyT19RKdQHRSaA5qgy4+wTBf3mi4gsn/9p1J/ePSoC7d5A6AzPmBfDX6MugTcqGb1gics+Uf7j/UsW4C1cf2nT1NKSv4XTPRVgYHt8pj/dZof77Hv8bZE4yMM3DD35hcTh9+yYOnTrJobVcq9nVG6j90cw/CeoQ+g0He/Kjkgx89Kkvf40Gh2kxSePMobVcqyrojZrtPdF2PRhtl9+FiUGRox8PkwDl7bA6vqY6VsNqacaT/VZKA67uPpi/JKZTKvL6omLfaLOJIn+YLr4D06Vx5shzczQKkdZGce8i1Y3jvTU/OKF2j4WBqW7e8AmOVhwBreXagy3WqDs6GmXbRqIyl5n40wem82NgujAGRoLlPHbE+bGoyrXCoz1vo+6YE6oLeimfgMsnn2FeYJTiCGgt10qz+6H17GjUHx+F+1tHoPxbK5iueMJ4eTJ7tAL6yXwtQjrl5RutWM9beHpiFJ/xKL+P0oDzNE94+Ud0yt0sG7SeGYkWhuHICNzf4oiyDb3QdvVztP3hKTAX/0q5WSvb0Bsl6x1RfWAE76UZD3P7Kg1M+tgDnovCFUdAa7l2O8MWzacc0XySwWLVvuEoWTcMpbo+eF68DM9vvci9THbzrGF4VDAcLayvhfVRLNv0ioUB19mYu0CrOAJay7Vb6bZoOuFg5hcHVO8dguL0oSjZ5IK7aX04fwuI+Z1MB15DtWIf9d7LsVYa+GDKLMzxC+2Um2vs0HR8KBoZVbvtUZpjz/4lF+Lh9jdwW/emxB2Wi5SzPfpjvcdqq1kP9RN3dP2VBt53ccds36WKI6C1XLvxlR0aj9ijsmAQSrMHwcTOt36vDap2DsaDzUM6hPaoxvjbLN5DvTTjVsZrSgPvObuxr2Gy4giWr14PQnw5/bV6ACp3vI7itAEw/T4dht39O6Se6R1h1LvxXppxY42t2QC7HBljnSa4nJ2gmYkJk2e0o2G5qLGcDBBGvQZNR9mjVEGr3pWbuJ5q1/4EmAF7xpQu8KabX0uxQ1GKGNtzs25eFyXb4Roh1FHkmlAjRvrh0regq8+m8LjsNRrNnJfB4kfa/wfNKWN1F+2WCgAAAABJRU5ErkJggg==",
                "Category": "GENERAL"
            },
            "executer_action_objet": {
                "Name": "executer_action_objet",
                "DisplayName": "Exécuter les actions d'un autre objet",
                "Description": "Permet de lancer la série d'action paramétrée d'un autre objet. Attention cette action est a exécuter seule ou en dernier niveau sur un objet.",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "executer_dll": {
                "Name": "executer_dll",
                "DisplayName": "Exécuter une DLL",
                "Description": "Exécuter une dll présente dans le dossier de DLL de l'application",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "executer_procedure_bd": {
                "Name": "executer_procedure_bd",
                "DisplayName": "Exécuter procédure stockée",
                "Description": "Exécuter une procédure stockée dans une base de données et retourner la valeur si besoin est.",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "executer_script": {
                "Name": "executer_script",
                "DisplayName": "Exécuter un script",
                "Description": "Exécuté un script prédéfini",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "executer_service": {
                "Name": "executer_service",
                "DisplayName": "Exécuter un service",
                "Description": "Exécuter un service",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "executer_sql": {
                "Name": "executer_sql",
                "DisplayName": "Exécuter requête SQL",
                "Description": "Exécuter une requete SQL (souvent les requête \"actions\")",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "USUELLE"
            },
            "export_contenu_objet": {
                "Name": "export_contenu_objet",
                "DisplayName": "Exporter le contenu d'un objet vers un fichier.",
                "Description": "Permet d'exporter le contenu d'un objet vers un fichier dont le type depend de la nature de l'objet",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "fichier_copier": {
                "Name": "fichier_copier",
                "DisplayName": "Fichier: Copier fichier/dossier",
                "Description": "Permet de copier un dossier/fichier d'un emplacement à une autre en le compressant si besoin est. un mot de passe peut etre utilisé pour protéger le fichier compressé.",
                "IconUrl": null,
                "Category": "USUELLE"
            },
            "fichier_retourner_extension": {
                "Name": "fichier_retourner_extension",
                "DisplayName": "Fichier: Retourner l'extension fichier",
                "Description": "Permet de retourner l'extension d'un fichier à partir de son chemin d'accès (PATH)",
                "IconUrl": null,
                "Category": "USUELLE"
            },
            "fichier_retourner_txt_fichier": {
                "Name": "fichier_retourner_txt_fichier",
                "DisplayName": "Fichier: retourner le texte du fichier",
                "Description": "Fichier textes (Word, PDF, TXT etc.) permet de lire le fichier intégralement et de retourner le texte extrait sans mise en forme.",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "filtrer_objet": {
                "Name": "filtrer_objet",
                "DisplayName": "Filtrer contenu objet",
                "Description": "Permet de filtrer le contenu d'un objet soit de facon globale soit en sépcifiant la colonne sur laquelle appliquer le filtre.",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "graphe_affecter_champ_argument_serie": {
                "Name": "graphe_affecter_champ_argument_serie",
                "DisplayName": "GRAPHIQUE: Affecter champ à l'argument d'une série",
                "Description": "Permet d'affecter un champ spécifique de la source de données liée au graphique à l'argurment d'une série",
                "IconUrl": null,
                "Category": "GRAPHIQUE"
            },
            "graphe_affecter_champ_valeur_serie": {
                "Name": "graphe_affecter_champ_valeur_serie",
                "DisplayName": "GRAPHIQUE: Affecter champ des valeurs d'une serie",
                "Description": "Permet d'affecter un champ spécifique de la source de données comme champ des valeurs pour une série.",
                "IconUrl": null,
                "Category": "GRAPHIQUE"
            },
            "importer_donnees_fichier_texte": {
                "Name": "importer_donnees_fichier_texte",
                "DisplayName": "Importer les données d'un fichier texte (TXT, CSV etc.) dans une base de données ou dans un objet tabulaire",
                "Description": "Permet d'importer le contenu d'un fichier texte (CSV, TXT etc) dans une base de données ou dans un objet tabulaire.",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "imprimer_contenu_objet": {
                "Name": "imprimer_contenu_objet",
                "DisplayName": "Imprimer contenu objet",
                "Description": "Permet l'impression de l'objet ou de son contenu. Pratique pour imprimer le contenu d'un tableau (GridControl), d'un diagramme (NDrawingView), d'une jauge (GaugeControl) ou d'un graphique (ChartControl) etc.",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "USUELLE"
            },
            "insert_update_depuis_objet_tabulaire": {
                "Name": "insert_update_depuis_objet_tabulaire",
                "DisplayName": "INSERT OU UPDATE depuis un objet tabulaire",
                "Description": "Permet de mettre à jour directement la base de données en fonction du contenu d'un objet tabulaire.",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "kpi_calculer_valeurs_periode": {
                "Name": "kpi_calculer_valeurs_periode",
                "DisplayName": "KPI: Calculer les valeurs de la période",
                "Description": "Permet de lancer le calcul des valeurs de la période pour les objets (SQL et formules sont utilisés)",
                "IconUrl": null,
                "Category": "KPI"
            },
            "kpi_editer_formule": {
                "Name": "kpi_editer_formule",
                "DisplayName": "KPI: Editer la formule d'un objet KPI",
                "Description": "Permet de lancer l'assistant pour le calcul de la valeur de l'objet kpi",
                "IconUrl": null,
                "Category": "KPI"
            },
            "lancer_operation_ribbon": {
                "Name": "lancer_operation_ribbon",
                "DisplayName": "Executer le click des éléments du menu",
                "Description": "Permet d'exécuter les opérations qui surviennent lors du click sur un ou plusieurs boutons du menu. Les noms des boutons sont séparés par un point virgule",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "lancer_traceur": {
                "Name": "lancer_traceur",
                "DisplayName": "Tracer un objet (lancer traceur)",
                "Description": "créer un enregistrement dans le traceur sur un objet données ainsi que l'information à mentionner",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "layoutgroup_plier_deplier": {
                "Name": "layoutgroup_plier_deplier",
                "DisplayName": "LayoutGroup: Plier/déplier, Afficher/Masquer, Activer/Désactiver groupe",
                "Description": "Permet de plier ou déplier, afficher ou masquer, activer ou désactiver le contenu de plusieurs LayoutGroup",
                "IconUrl": null,
                "Category": "USUELLE"
            },
            "lien_hypertexte": {
                "Name": "lien_hypertexte",
                "DisplayName": "Lien hyperTexte",
                "Description": "Permet de lancer une URL. (pour ouvrir un fichier, exécuter une application externe, lancer une page web etc.)",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "modifier_valeur_propriete_objet": {
                "Name": "modifier_valeur_propriete_objet",
                "DisplayName": "Modifier valeur propriété objet",
                "Description": "Permet de modifier la valeur de la propriété passée en paramètre pour un objet donné",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "neant": {
                "Name": "neant",
                "DisplayName": "Ne rien faire",
                "Description": "Retourne toujours True. Est utilisé comme racine pour permettre un lancement de plusieurs actions enfants sans demander de sélection.",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "USUELLE"
            },
            "object_auto_scroll": {
                "Name": "object_auto_scroll",
                "DisplayName": "Scroll ou déplacement automatique dans un objet",
                "Description": "Permet de faire un scroll ou un déplacement automatique sur les objets passés en paramètre.",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOwgAADsIBFShKgAAAA39JREFUSEutVk1IVFEY/RJFNwqiCxUX4yxypRvTXIiblDYiEtpKLBghQodCVxKIg6mLWhZBilCriggXbaI2/WD+kKXYVJSKP4UJ4R/lKDPz9Z3vvft82hVcdOF47/3eN+ece9519ER/fz9hMDMlk0ldY04kEtR28ZzW5QclBayPnR4pup9zt1pxagceiAADfX193Nvbq4hEItzd3c0/5z/w6tx7Xv02xT++vuPvX4BJFxMyT/DK530sfx5nD5/GePnTGBGIbaOrq8stJ2SOC/YEMR92ZO0i+YfZIPGbWbAUHQOI4NiM+vp6b93R0SFrCcYj33XJjyYFMce3FUvRtwBRT0+PkoLcAPu2tjaXPI5gtedY894WJwWLIiAg2o/iYFChUMjnHocR54jBjcDvloVQgba9TU7ubvLix1GAqLOz0/oOmpubvdzVuSF2I9AoXLeGFH2J3Q1OxDZ4cfYNQNTe3m4VaGxsdDKHcwwhjK4+543teY1AIU4V4hrEGCogWBABAVFra6tVoK6uTupOLHD2ev4+D09e4XtTnfxh5am6NG7NGn3x2LrCE2hpabEK1NTUKHl8b12fg9xgSNZPZvt4bTOqIoZUD7rzi9e35vjF5B2AqKmpySpQVVXFsd01fhq9qScA6WEMv7vK4wsPObazxt9/TWvfo+kID02E+farEN94tkLkv/t+pfLycn48c11JMWwCQ5NhqbsQUu2T2QjcHV0nqq2ttZ6gtLRUIwHxvyfYJzWEmNE3KDOAEwiIqqurrQLFxcWea+cEdlIjAFKMwYl2xa2XIYCooqLCKhAIBFwBx5nfqZ90YOQCN1yu5GBJHqenp+vccPk0Rx6cd75aEYVt5OfnO64PZYu9iWFgpIUrzp7kcDjMMzMzSoMZ+1NnghAIEKKwjZycHM+1P1uH3IkBTkFmG6jL565RUVGRtSEzM9Nz6s/WkGNGHMY5esyXoTmJ7EepoKBABYLBICP3wsJC3WdkZHhOj/oWReZmuH/iDohILUa5ublekxFDITU11RPwux4cd+I59gmysrKsETm5u2Q+Uq1hL2i4dIx3gChwVDhOSUnRIxrgd6SyspLLysq4pKSEcSHwzhBjXl4eZ2dnc1pamvUWuRwBEgESARIBEoH9/wpkJQIkAiQCJAK4cbgUJAIkAiQC6A/obcELRebOjD3q9D8EDpg6vPkLTaYnF54USekAAAAASUVORK5CYII=",
                "Category": "GENERAL"
            },
            "objet_manual_scroll": {
                "Name": "objet_manual_scroll",
                "DisplayName": "Scroll ou déplacement manuel (sur demande)",
                "Description": "Permet de faire un scroll ou un déplacement manuel sur les objets passés en paramètre.",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAABNVJREFUSEullWtQVGUYx9Esw1KzzLEgYuXmJKRk2oxxEeTW9LnR6ksDe2NZEIFMRC71wQ8aqXGZmqYZq2lKQW4iUyGZ0we1JvMCxHW5LSzslb1wCWd6+j/vOcsePzLuzH/e95zd/f+e5/+8u2cVEQU96msVXvBYLfv8B8+AKe/j868kxxvbb8XntdOuvMtQG+00tNJOPaRrgZrpVS0k1qZbcdrmZP7eWx9uZ082fyKjKPpiemFMA/Zr+V5GcXSQ4MgAy1ddZvqtf05S3xxd6/PRr//4qKvXS509Hvql20M/33dTbccIxWkuWeQiJfMj0Q2Hv0ykgi8SKK0g8hLuBTNkGfBafrswPnfVSVWtNqposdKJpmkqg8+xi5O0I7thWQXfjVCsupEjEObpsvlPJjU19r1NhvrdlGqMbMJ760RsUgcSoKrVSpVs3jxDZY2S+dEfzXT+d5sAfH19hozfmPyA1RlFMReySrZTZnGMMK+/HULohgBlSCMAj0sAIwCIpbJlhsrZHJWXNkzR0QtmKvlhnI58PwZzK+V/a6K888O0I6fB38EamGzILI4m7qDurxBhjnub5VnIHQDAXYgBG9poVy6GjAHzUON0TZw5xWoaReWxMOduuLDMkhgecjAGLAHQQXphFAPWHyiIDAzZ8Ek9+RYfkG8hIC/23nnWkpBnQVq9WA0f10mAYgF4kgHphawoDFkAnjqQrwTgC2xucc3TlBNyzNGkXdIEZJZXae+j3MpaAeCjKHIOCtoEbYVehLZwPKl5EYoOqupQ2QMYz9MkzNlowgYzm4/GoQkrVmhMXvUVNRKgSACC00TlkYRYeLgiohQlgCtaifQV5wQAA2XA+rTDUdQxpBVKMUYwYFOKQdGBvqqWPJzz3BK55/6lWR+E1YXV5ZVWp7zyfhlQGMWADVw5m9f8GUYwZsBz+3O3BSLSV9bAeEnEMGr10si0l0wWNw1bPDSEdZA16aahKQh7XbnUAWJhwEaOpWPwIcDmZL0SgEwZMDrjI9O0B/IKQ9bA5Cz1mwPia135WQHgo4jXMxwLAz7/I4xQOXfwfLJOAVhJ/vxZzYkzApBqjBAzwEBFNPtZegF4NkmrCkSkw9BE3pADWds9i0I29yJZhRYkzS6QDdKWfSYAqFz8DqAwiP9aX4G2QesSlQAtWnbCfAiZcyz9Zjf1TsxSz/gsdY+56P6oE3JR9wj2Y07S+AE4KTwDjoUrT9KxVGLIiZpwRQcyYHDKQwPIuw/mvTDvYfMRJ91TCjD1cbkDCcADpfYBvRCMGfBCgloR0UpnoD5ezSaPQU9DUcmoms3P3gwnGPN7cTx8aI1oQ4uh8Tl3KLNH1jOuBZrG34cFfx/TLOxZ6tJP2WTtvg9ebsNpIQyU2vv1dOamipIASMhR0d73XrrCs3gIMID8+xBR7zjyRhQczV2Tg/4ettPtITtWB93BtQzgDra88X5Yp656H11mwA0VvXsynHa/E3oN74VA0vMAx85+4+6gGLAf0INhMoANGXBHyEFt1+8xwC4/Mvl5sHXPodCu7FPxdOikivZI5qFsvvzIRERZOBkWHh7nyxXmsI6dFsr+6BRWFq5LT1vUpdVZ/OVEDZ9I5Iyhvn4wtHPvwdCrfvM3sxWniD/8KJIhG/nI+iv3+/0PuK8vefx/gXIAAAAASUVORK5CYII=",
                "Category": "GENERAL"
            },
            "ouvrir_assistant_objet": {
                "Name": "ouvrir_assistant_objet",
                "DisplayName": "Ouvrir assistants objets",
                "Description": "Permet d'afficher l'assistant de parametrage des objets passés en paramètres.",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "ouvrir_fichier": {
                "Name": "ouvrir_fichier",
                "DisplayName": "Fichier: Ouvrir fichier",
                "Description": "Permet d'ouvrir un fichier dont le chemin est spécifié, un fichier interne dont l'id est spécifié, un fichier depuis un stream ou byte array.",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "USUELLE"
            },
            "ouvrir_formulaire": {
                "Name": "ouvrir_formulaire",
                "DisplayName": "Ouvrir un formulaire",
                "Description": "Ouvrir un formulaire de la liste des formulaires ou dont l'identifiant est dynamique (lié à un autre objet)",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAA+JJREFUWEfFl0lvG2UcxkHiQgWqhNrkUL4Bn4BTkXpJkZoDEnwVLqA2ztaoJCk3BBLKgpAQIKVpccOpNM0FJ97tmbE9421sjz3eEmgaKHGf/p83S4kSO8pIbkb6acazvL/n3cbzvgngjXPdGOA8YeXfuuLzPxgcXcGA7yEGRvqMOOiik24GeHfQt4Lvwi18E2zg21B/oYMuOulmgMuXRvz4SdvC4J0orszE8H6fYNl00EUn3Qww8N4tP1asbXz4fQpX59P4qE+wbDroopNuFeDiTT9W7ef45Gcbn/5i47Nf+wPLpoMuOg8DvPOlH+g8BXb+Av4hf/fmX7nuBZZLh7joPAxwgQF2n2H9zwACgY2erK8HsREMIeiBjQ15NrCuXHQeCxAKBhEKRxCOvCIkxzx3QCQSww+Li1hYWMD8/Bzm5k6H9/H+xcUFRMJhCbBzcoCwiKKxBJKacYRE0kA8oalr0WgCD/y/y7vr7Nv931YQiUS7B4jF4tD0FIaGrmNi8jbGJyYwNr7HiG8UiaSOWDyJx0/Wzm6XJ/5YfSIViHXvgkQ8AcNII5crIJ8vImvlYZpZWGYOmYwFTVomLgEiLMTDFpbax7sG+O8ZkkkNqbSJoY+vY/L2lKp5RuSjY+PwjY1Bl3Ax6YpsNudBD6lQFnHpRojr6CD8QmaBnNR1HUYqDVNuJBnTkkAZpDOmwkilpBs0NJstTwEajSYSCQbYxgVxvpoF+wFSImAASk+C1zTdwIsXHU8BOp0OdE0/HuBtFWAbaSU2e2KkMqorOFiTZ4D3a7pUTipBF52HLXAQwDJN1ey9YNdYMgY8I+V3DZBj4VZOBlleKOzv5VhmA7EEzpD7y8tYFu7dW8LS0unwPt5PCrl89wC8WCwUUS5XUKk4al8qlVEs2oqCXCOPVr29Bx49XoNdKHQJ8Pwp7KLIRXzjxjBm736N6ZlZ3PlqGk61hsmpKdgMY5cQkHe6l43P0XFyF0iAsl2G47hot7fQbm2hUW+hXm8qXLchLeJIAWUkjZQXvwxaA6ViCRDX8UEoJ51KBW6tjuFhaYHZu+C8nZmeUcfTsnec6l6XlGxPAYq2jUqpR4CqCKo1F3URu0LVrcOtN/Z+y55dUZJx0W5vegrQbm3K2KrIt0SXFnCrVVXLqogU/z+W37zGwbm7u+spAJ+rOU6XAJKq4bqoSQucBoMoKmdg/xk6jrWA+iKSMbDZasl7vtlX6KDryJ/RxZsPpUl39r4D+c3WT+gQF50Hr+LLA5//uMYTTMXp0U/ooIvOg3UBVycfCFeFa68JuuhUKyOuz3jAVQoXCq8DuuhUa8Nz3V4CEZMgQ5jFSvYAAAAASUVORK5CYII=",
                "Category": "USUELLE"
            },
            "ouvrir_pieces_jointes": {
                "Name": "ouvrir_pieces_jointes",
                "DisplayName": "Ouvir pièces jointes",
                "Description": "Ouvrir les pieces jointes liées à un enregistrement d'un formulaire.",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "USUELLE"
            },
            "popup_utree_check": {
                "Name": "popup_utree_check",
                "DisplayName": "Popup Utree check (chaine liste à cocher)",
                "Description": "Permet d'ouvrir une fenête popup de sélection d'objet avec case à cocher.\r\nLa valeur retourner est une chaine contenant l'ensemble des élément cochés, séparés par le paramètre \"separateur\".\r\nA l'ouverture le paramètre \"valeurs_cochees\" permet de pré-cocher des éléments avant affichage",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "rafraichir_controle": {
                "Name": "rafraichir_controle",
                "DisplayName": "Rafraîchir/Actualiser objet",
                "Description": "Permet de rafraichir ou actualiser le contenu d'un contrôle",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "USUELLE"
            },
            "recalculer_tout": {
                "Name": "recalculer_tout",
                "DisplayName": "Recalculer toutes les formules du formulaire (gestionnaire_de_calcul.recalc)",
                "Description": "Permet de lancer la fonction Recalc du gestionnaire de calcul pour recalculer toutes les valeurs des objets liés à des formules dans le formulaire. (Les caluls liés aux actions ou codes ne sont pas pris en comptes)",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "retourner_chaine_depuis_tableau": {
                "Name": "retourner_chaine_depuis_tableau",
                "DisplayName": "Retouner chaine depuis tableau (ex: csv, retourner les contacts, email, télephone, cellulaire etc.)",
                "Description": "Retourner une chaine construite à partir de la sélection d'un tableau SQL en utilisant un séparateur pour les lignes ou les colonnes. Peut retourner un CSV, permet de retourner le mail ou le téléphone d'une liste de contacts.",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "retourner_chemin_fichier_dossier": {
                "Name": "retourner_chemin_fichier_dossier",
                "DisplayName": "Fichier: Retourner chemin du fichier ou d'un dossier",
                "Description": "Permet d'ouvrir le dialogue de sélection de fichier ou de dossier et de retourner le chemin du dossier ou fichier sélectionné",
                "IconUrl": null,
                "Category": "USUELLE"
            },
            "retourner_fichier": {
                "Name": "retourner_fichier",
                "DisplayName": "Retourner fichier sélectionné depuis un emplacement ou scanner vers un objet ou intégrer le fichier dans le gestionnaire interne de fichier",
                "Description": "Permet de retourner un fichier sélectionné depuis un emplacement ou scanner vers un objet, retourner son chemin d'accès ou intégrer le fichier dans le gestionnaire interne de fichier et retourner son identifiant.",
                "IconUrl": null,
                "Category": "USUELLE"
            },
            "retourner_valeur_propriete_objet\t": {
                "Name": "retourner_valeur_propriete_objet\t",
                "DisplayName": "Retourner valeur propriété objet",
                "Description": "Permet de retourner  la valeur de la propriété passée en paramètre pour un objet donné",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "sage_prestations_reciproques": {
                "Name": "sage_prestations_reciproques",
                "DisplayName": "SAGE: prestations réciproques",
                "Description": "Permet de gérer les prestations réciproques et de remplir un tableau des avec les écritures des OD analytiques à créer.",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "saisie_securisee": {
                "Name": "saisie_securisee",
                "DisplayName": "Saisie sécurisée",
                "Description": "Permet de limiter les saisies sur un objet seulement a des utilisateurs abilités en demandant leur mots de passe",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "GENERAL"
            },
            "selectionner_tout": {
                "Name": "selectionner_tout",
                "DisplayName": "Sélectionner tout (contenu objet)",
                "Description": "Permet de tout sélectionner dans le contenu d'un objet. Pour les objets tabulaires, cela permet de sélectionner toutes les lignes. Pour un objet complexe permet de sélectionner tous les sous objets (ex: toutes les shapes d'un objet diagramme)",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "supprimer_contenu_objet": {
                "Name": "supprimer_contenu_objet",
                "DisplayName": "Supprimer le contenu des objets",
                "Description": "Permet de supprimer le contenu des objets listés dans le paramettrage. Lorsque l'objet est complexe c'est la liste des éléments sélectionnés qui sont supprimés (ex: lignes pour un tableau)",
                "IconUrl": "data:image/jpeg;base64, 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",
                "Category": "USUELLE"
            },
            "tableau_immediat": {
                "Name": "tableau_immediat",
                "DisplayName": "tableau/arborescence immédiat(e) et tableau/arborescence de sélection",
                "Description": "Permet de lancer un tableau qui affiche le résultat de la requète saisie dans \"chaine de l'opération\". Les lignes sélectionnées peuvent être retournées en vue renseigner les valeurs des objets du formulaire source.",
                "IconUrl": "data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAA89JREFUWEftl0loU1EUhuPWtW5VcKWIIBZciIrigAOOXSm4Edy4UEFQFwUHxApS0RYrTi3UhYrgPFSraMd0SNt0nuyQ6aVt0sx9TVo5nv+krz5zrQGp2kULH+e+c8/9//++l00tlrm/uTcwm97A5vuVziOPrHTymY3Ovm6krLd2Ol9spwvvm+ni+6Y/AmehAa0zLxtEGx7wUu6eWVhKofgERRITFE18oxgzOj492E8HdAygC/3A2ATBSwlwoKCUgvFvNMIDIa5hPhyZBuylAxoGhu6wPiH68FIC7L//RQL4eeCMdZgu2fyUXT8zQOs0ayIA9OGlBNh377Ok8/HQqcohyqrxzSjQHBxN6sNLCbD37idJN8RDqAgDsE4HRNMBXS02Lm8BXkqAPXc+ioiXBzE0HRBKB25qBprAHR2XPryUALtvl4iph1MeLPHQ4Y/ajHKoRCMnB0AQeCkBdt36IOkwtO+dW4IgsZnMYo/Sc/FMKpgz9wzN/nBCdOGlBNiZXyzfaCAyTtteuSRIKttfu8jB+78D5zGHCmAKoPk1lJALwEsJsOPmO0nXx8PrnjmmDhoCqBueO2Q/lV7umcEczMxAsysYl/DwUgJsz3srr607mKDVTwYoY4aBZnsgLheDlxJgW+4bSdfBQ8se9knazhSWcx/7ZiCaCuaMXttInAA0W/xxeXvwUgJsvfFKvlkrDy8q+iqHsDaz5EHvT88Q/BWYa/aP/cRi7tl9Y/JZ4KUE2HL9pXzHJj64oKBHaioLC5N9CP2KRu4DzBnrhuExAujVc8UnhpcSYPO1F5IOw/PvdEkFOGSAvo2fU6kb0skM5mq5Zwa9mkFdPiu8lACbcp5LOhyal9/5V6j06vLbgJcSYOPVp5KumlNaOAAqsJpAv4pFUoGwGczhuUIbnQI9POO3BS8lwPrLj6l9hMW1GFlym6mSq5kKT7KPOh3lvAcwh1rmjk6BHp5bfDrBSwmw9kIRtfk5sTtClpw6qWbKJ/uooMylUso9gPPGGhWz6KHCA15KgDVZd6nNxzdwhshypeKvUKtFqDugE7yUABmn86hliG8wEBDKHD8o5zWocAaFKleIrJNUu0NUw9R6ktQxNk+Y6tmswRuhRsY+mKSJ6Q/qBC8lwKoTOdQ+HKUqZ4Csk1S7AgRq3UGqYxObiIeonmnQkjQydm+YxcPUzLSwSStfBLQx0OzwRamT6WJcIZ3gpQRYeSybevxRoXckJvRN0h+IERgIjpKDcbIIgJiBm9fAE06imfBGdBo0AS8lwNLj17UVR8/RvwBes+l/ov+X5TuS2B+5pcnTwAAAAABJRU5ErkJggg==",
                "Category": "USUELLE"
            },
            "transferer_donnees": {
                "Name": "transferer_donnees",
                "DisplayName": "Transférer des données d'une source vers une autre source",
                "Description": "Permet de transférer des données depuis une source de données vers une destination de données",
                "IconUrl": null,
                "Category": "TRANSFERT"
            },
            "treelist_selectionner_descendance": {
                "Name": "treelist_selectionner_descendance",
                "DisplayName": "Tree: Ajouter la descendance (noeuds enfants)à la sélection",
                "Description": "Permet d'inclure les enfants des noeuds déjà sélectionnés à la sélection.",
                "IconUrl": null,
                "Category": "GENERAL"
            },
            "IF": {
                "Name": "IF",
                "DisplayName": "IF condition",
                "Description": "Permet de créer la condition IF",
                "IconUrl": null,
                "Category": "CONDITIONS",
                "ActionOptions": [

                    {
                        "Id": "If_condition_expression",
                        "Name": "Condition Expression",
                        "Type": "String",
                        "Default": "Condition",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "IF Condition",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    }
                ]
            },
            "SWITCH": {
                "Name": "SWITCH",
                "DisplayName": "SWITCH condition",
                "Description": "Permet de créer la condition SWITCH",
                "IconUrl": null,
                "Category": "CONDITIONS",
                "ActionOptions": [

                    {
                        "Id": "switch_value",
                        "Name": "Value To Check",
                        "Type": "String",
                        "Default": "Variable",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "SWITCH Condition",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    }
                ]
            },
            "SWITCH_CASE": {
                "Name": "SWITCH_CASE",
                "DisplayName": "Case",
                "Description": "condition d'un switch",
                "IconUrl": null,
                "Category": null,
                "ActionOptions": [

                    {
                        "Id": "switch_case_value",
                        "Name": "Value",
                        "Type": "String",
                        "Default": "",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "Switch Case",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                    {
                        "Id": "switch_case_break",
                        "Name": "Break",
                        "Type": "Booleean",
                        "Default": true,
                        "ReadOnly": false,
                        "AcceptedValues": [true, false],
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "Switch Case",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    }
                ]
            },
            "IF_CONDITION_NO": {
                "Name": "IF_CONDITION_NO",
                "DisplayName": "NO",
                "Description": "condition d'un switch",
                "IconUrl": null,
                "Category": null,
            },
            "IF_CONDITION_YES": {
                "Name": "IF_CONDITION_YES",
                "DisplayName": "YES",
                "Description": "condition d'un switch",
                "IconUrl": null,
                "Category": null,
            },
            "CONTAINER": {
                "Name": "CONTAINER",
                "DisplayName": "Container",
                "Description": "Conteneur d'action",
                "IconUrl": null,
                "Category": "CONTAINER",
            },
            "FOR_LOOP": {
                "Name": "FOR_LOOP",
                "DisplayName": "For loop",
                "Description": "Actions à repeter un nombre de fois",
                "IconUrl": null,
                "Category": "BOUCLE",
                "ActionOptions": [
                    {
                        "Id": "IteratorName",
                        "Name": "Iterator",
                        "Type": "String",
                        "Default": "i",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "For Loop",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                    {
                        "Id": "StartValue",
                        "Name": "Start Value",
                        "Type": "String",
                        "Default": "0",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "For Loop",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                    {
                        "Id": "EndValue",
                        "Name": "End Value",
                        "Type": "String",
                        "Default": "99",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "For Loop",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                    {
                        "Id": "Step",
                        "Name": "Step",
                        "Type": "String",
                        "Default": "1",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "For Loop",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                ],
            },
            "FOR_EACH": {
                "Name": "FOR_EACH",
                "DisplayName": "For each",
                "Description": "Traitement à effectuer un array",
                "IconUrl": null,
                "Category": "BOUCLE",
                "ActionOptions": [
                    {
                        "Id": "VariableName",
                        "Name": "Variable Name",
                        "Type": "String",
                        "Default": "Variable",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "For Each",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                    {
                        "Id": "ActionsArray",
                        "Name": "Actions Array",
                        "Type": "String",
                        "Default": "[Object]",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "For Each",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                ],
            },
            "DO_WHILE": {
                "Name": "DO_WHILE",
                "DisplayName": "Do while",
                "Description": "Executer un ensemble d'actions tant qu'une condition est satisfaite",
                "IconUrl": null,
                "Category": "BOUCLE",
                "ActionOptions": [
                    {
                        "Id": "DoWhileConditionExpression",
                        "Name": "Condition Expression",
                        "Type": "String",
                        "Default": "Condition",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "Do While",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                ],
            },
            "WHILE": {
                "Name": "WHILE",
                "DisplayName": "While",
                "Description": "Executer un ensemble d'actions tant qu'une condition est satisfaite",
                "IconUrl": null,
                "Category": "BOUCLE",
                "ActionOptions": [
                    {
                        "Id": "WhileConditionExpression",
                        "Name": "Condition Expression",
                        "Type": "String",
                        "Default": "Condition",
                        "ReadOnly": false,
                        "AcceptedValues": null,
                        "Url": null,
                        "localizationDescriptionName": null,
                        "Description": null,
                        "Category": null,
                        "localizationCategoryName": "While",
                        "IsRequired": true,
                        "EditorType": null,
                        "EditorOptions": null
                    },
                ],
            },
        }
    },

};

iamFlow.init();




