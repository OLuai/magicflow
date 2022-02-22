/// <reference path="iahform-common.js" />
/// <reference path="iahform-data.js" />


//Fonction qui se lance au chargement de la page
$(document).ready(function () {
    
    //const urlParams = new URLSearchParams(window.location.search);
    //iamagic_id_formulaire = urlParams.get('page_id');
    //iamagic_vue = urlParams.get('view_id');
    //iamagic_id_enregistrement = urlParams.get('data_id');
    //iamagic_token = urlParams.get('user_token');
    //iamgaic_preview = urlParams.get('preview');

    //Vérifier qu'un formulaire a bien été passé
    if (iamagic_id_formulaire == null) {
        iamShared.messages.showErrorMsg("Aucun identifiant de formulaire identifié!");        
        return;
    }

    //charger le contenu de la vue
    LoadView(iamagic_id_formulaire, iamagic_vue, iamagic_id_enregistrement, iamagic_preview, iamagic_token);

    //création des controles automatisée

    //fin création des controles automatisée ********************************************************************************************************




    //Veuillez créer vos éléments personnalisés qui doivent etre exécutés au lancement de la page en dessous ***************************************


    //fin de vos éléments personnalisés  ***********************************************************************************************************

});


//Fonction pour gérer les erreurs d'ajax
function AjaxErrors(x, textStatus) {
    if (textStatus === "timeout") {
        iamagic_notification.error("Error - timeout");
    } else {
        iamagic_notification.error(textStatus);
    }
}


//Permet d'enregistrer le formulaire
function LoadView(id_formulaire, id_vue, id_enregistrement,preview, token) {

    var url = iamagic_url_page + "/LoadView";
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

//Permet de transformer des données plates avec champ id_parent en données hiérarchiques
function FlatDataToHierarchicalData(flatData, champ_id, champ_id_parent, rootLevel) {
    var hash = {};

    for (var i = 0; i < flatData.length; i++) {
        var item = flatData[i];
        var id = item[champ_id];
        var parentId = item[champ_id_parent];

        hash[id] = hash[id] || [];
        hash[parentId] = hash[parentId] || [];

        item.items = hash[id];
        hash[parentId].push(item);
    }

    return hash[rootLevel];

}


