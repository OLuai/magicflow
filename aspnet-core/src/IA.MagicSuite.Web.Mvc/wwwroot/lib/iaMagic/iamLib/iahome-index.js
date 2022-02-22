/// <reference path="iahform-common.js" />

//Fonction qui se lance au chargement de la page
$(document).ready(function () {

    //créer le menu de l'application.
    iamMenuCreate();
    //charger la page de démarrage de l'utilisateur
    //loadStartUpPage();



});


//Fonction pour gérer les erreurs d'ajax
function AjaxErrors(x, textStatus) {
    if (textStatus === "timeout") {
        iamShared.messages.showErrorMsg("Error - timeout");
    } else {
        iamShared.messages.showErrorMsg(textStatus);
    }
}


//Permet d'enregistrer le formulaire
function loadStartUpPage() {


    var url = iamagic_url_page + "/LoadStartUpPage";
    var timeout = 5000; 

    $.ajax({
        url: url,
        data: { id: id_formulaire, view_id: encodeURIComponent(id_vue), data_id: encodeURIComponent(id_enregistrement), preview:preview, user_token: token },
        type: "POST",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                iamagic_notification.error(result.ErrorMessage);
                return;
            }
            //iamagic_notification.success("La page '" + iamagic_nom_formulaire + "' a bien été enregistrée!");
            if (preview == 1) {
                $("#iamagic_HFormContent").html(result.Data).promise().done(function () {
                    onHFormViewLoad();
                });
            } else {
                $("#iamagic_HFormContent").html(result.Data).promise().done(function () {
                    onHFormViewLoad();
                });
            }
            
            return;
        },
        error: AjaxErrors
    });
}

//création du menu de l'application
function iamMenuCreate() {

    //source de données groupé des thèmes pour le selecteur de thème
    var iamToolbarThemesDataSource = new DevExpress.data.DataSource({
        store: iamToolbarThemesItems,
        key: "id"
        , group: "categorie"
    });
       
    //Créer la barre principale du formulaire
    iaMagic.UI.iamMenu = $("#iamMenu").dxToolbar({
        height:'40px',
        onItemRendered: function (e) {
            if (e.itemData.id == "iamagic_HFDTransfertButton") {
                e.itemElement.attr("id", "iamagic_HFDTransfertButton");
                return;
            }
            if (e.itemData.id == "iamagic_HFDThemeSelectBox") {
                iamagic_HFDThemeSelectBox = e.component;
                return;
            }
            return;
        },
        items: [
            {
                location: 'before',
                locateInMenu: 'never',
                template: function () {
                    return $("<div class='toolbar-label'><table><tr><td><img  src='/favicon-32x32.png' /></td><td width='10px'></td><td><b>Magic Suite</b></td></tr></table></div>");
                }
            },
            {
                location: 'center',
                widget: 'dxButton',
                options: {
                    icon: 'far fa-home',
                    hint: "Accueil",
                    onClick: function () {
                        //loadStartUpPage();
                    }
                }
            },
            {
                location: 'center',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    hint: "Nouveau: Créer un nouvel élément.",
                    icon: "far fa-plus",
                    onClick: function () {
                        //mainNew();
                    }
                }
            },
            {
                location: 'center',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    hint: "Objets récents",
                    icon: "far fa-history",
                    onClick: function () {
                        //mainRecents();
                    }
                }
            },
            {           
                location: 'center',
                widget: 'dxButton',
                locateInMenu: 'auto',
                    options: {
                    name:"",
                    hint: "Liste des favoris",
                    icon: "far fa-star",
                    onClick: function () {
                        //Afficher le menu contextuel
                        if (iaMagic.UI.iamToolBarFavorisContextMenu == null) {
                            //toolBarFavorisContextMenuCreate(true);
                        } else {
                            iaMagic.UI.iamToolBarFavorisContextMenu.show();
                        }
                    }
                }
            },
            {
                id: "iamagic_HFDThemeSelectBox",
                location: "center",
                widget: "dxSelectBox",
                options: {
                    dataSource: iamToolbarThemesDataSource,
                    grouped: true,
                    displayExpr: "text",
                    valueExpr: "id",
                    value: 1,
                    fieldTemplate: function (data, container) {
                        var result = $("<div class='select-theme-container'><img src='" + (data ? data.icon : '') + "' /><div id='selectThemeTextBox' class='select-theme-text'></div></div>");
                        result
                            .find("#selectThemeTextBox")
                            .dxTextBox({
                                value: data && data.text,
                                visible: true,
                                readOnly: true
                            });
                        container.append(result);
                    }
                    //,
                    //itemTemplate: function(data) {
                    //    return "<div class='theme-designer-icon'><img src='"+ data.icon + "' /><span>"+ data.text +"</span></div>";
                    //} 
                    , onSelectionChanged: function (e) {
                        //e.component.option("dropDownButtonTemplate", themesDropDownButtonTemplate(e.selectedItem));
                        //themesChangeDesignerTheme(e.selectedItem.name);
                    }
                }
            },

            {
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    hint: "Extension Tools",
                    icon: "far fa-magic",
                    onClick: function () {
                        //Afficher le menu contextuel
                        //signOut();
                    }
                }
            },

            {
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    hint: "Se déconnecter",
                    icon: "far fa-sign-out-alt",
                    onClick: function () {
                        //Afficher le menu contextuel
                        //signOut();
                    }
                }
            },

            {
                locateInMenu: 'always',
                text: 'Préférences utilisateur',
                //icon: 'far fa-user-cog',
                onClick: function () {
                    DevExpress.ui.notify("Print option has been clicked!");
                }
            },
            {
                locateInMenu: 'always',
                text: 'Modifier login',
                //icon: 'far fa-user-lock',
                onClick: function () {
                    DevExpress.ui.notify("Print option has been clicked!");
                }
            },
            {
                locateInMenu: 'always',
                //icon: 'far fa-sliders-h-square',
                text: 'My logs',
                onClick: function () {
                    DevExpress.ui.notify("Propriétés page option has been clicked!");
                }
            }
        ]
    }).dxToolbar("instance");
    //*/
}


