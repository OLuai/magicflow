var isNew = true;

//Fonction qui se lance au chargement de la page
$(document).ready(function () {    
    
    //Vérifier qu'un formulaire a bien été passé
    if (iamagic_id_formulaire == null) {
        iamagic_notification.error("Aucun identifiant de formulaire identifié!")
        return;
    }

    //Si ce n'est pas un nouveau formulaire alors prendre les information du formulaire en cours
    if (iamagic_id_formulaire && iamagic_id_formulaire.toLower() != "new") {
        formDataLoad(iamagic_id_formulaire, iamagic_token);
    }
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
function formDataLoad(formId, token) {

    var url = iamPageData.designersUrl + "/formDataLoad";
    var timeout = 5000; 

    $.ajax({
        url: url,
        data: { id: formId, userToken: token },
        type: "POST",
        timeout: timeout,
        dataType: "json",
        success: function (result) {
            
            //Afficher l'erreur en cas de pb
            if (result.ErrorMessage) {
                iamagic_notification.error(result.ErrorMessage);
                return;
            }

            isNew = false;
                       
            
            return;
        },
        error: AjaxErrors
    });
}

