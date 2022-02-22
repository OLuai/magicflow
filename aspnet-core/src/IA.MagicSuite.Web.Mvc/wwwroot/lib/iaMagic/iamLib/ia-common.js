/// <reference path="../dxlib/js/jquery.min.js" />
/// <reference path="jquery-ui.min.js" />

DevExpress.setTemplateEngine("underscore");

//Objet contenant les fonctions essentielles de magic
var iamShared = {

    //fonction de manipulation des dates
    dates: {
        dateAddDays: function(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
    },
	//Utilisé pour conserver des données dans une page pour 
	data: {
		//permet de retourner un objet data conserver temporairement dans la page depuis son nom
		get: function (name) {
			var dataItem = iamShared.arrays.findByKey(iamShared.data.storage, "name", name);

			if (dataItem) {
				return dataItem.data;
			} else {
				return null;
            }
		},
		set: function (name, data) {
			if (!name) {
				iamShared.messages.showErrorMsg("Name is mandatory in data.set!")
				return false;
			}

			//Vérifier si un élément existe déjà avec ce nom
			var dataItem = iamShared.arrays.findByKey(iamShared.data.storage, "name", name);

			if (dataItem) {
				//Mettre à jour les données de ce data
				return dataItem.data = data;
			} else {
				//INsérer un nouvel élément dans le data avec le nom passé
				iamShared.data.storage.push({name:name, data:data});
			}

			return true;
		},
		//vider le storage sans créer un nouveau tableau
		clear: function () {
			//vider le storage sans créer un nouveau tableau
			this.storage.splice(0, this.storage.length);
		},
		//Supprimer un data du storage
		delete: function (name) {
			iamShared.arrays.deleteByKey(this.storage, "name", name);
        },
		storage:[] //conserve les données en ligne d'objet de forme : {name: "nom du data", data: data conservé de tout type}
	},
    //fonction générales utiles
    utils: {

        //Permet de vérifier si une propriété est une fonction
        isFunction: function (propertyObject) {
            if (typeof propertyObject === 'function') {
                return true;
            }
            return false;
        },

        //Permet de vérifier si une propriété est une chaine de caractère "string"
        isString: function (propertyObject) {
            if (typeof propertyObject === 'string' || propertyObject instanceof String) {
                return true;
            }
            return false;
        },

        //Permet de retourner le service de données MagicData si abp est disponible sur la page
        getMagicDataService: function () {

            try {
                return abp.services.app.magicData;
            } catch (x) {
                return null;
            }            
        },

        //permet dévaluer et calculer une formule du moteur de calcul pour ressortir le résultat attendu
        calculateFormula: function (calcEngine, formula) {
            let calcResult = calcEgine.parse(dependencyItem.formula);

            if (calcResult.error && !calcResult.result) {
                let varTxt = "";
                for (let key in calcEngine.variables) {
                    //varTxt += "let "+ key +"="+ 
                }

            }
        },

        getFormulaValueExpression: function () {

        },

        //permet de créer un nouveau calcEngine : formulaParser de formula-parser-min.js
        createFormulaCalcEngine: function (dependencies) {
            var calcEngine = new formulaParser.Parser();

            //Ajouter les propriétés générales d'un formulaire
            calcEngine.setVariable('userId', ((Window["iamPageVariables"]) ? Window["iamPageVariables"]["userId"] : null));
            calcEngine.setVariable('tenantId', ((Window["iamPageVariables"]) ? Window["iamPageVariables"]["tenantId"] : null));
            calcEngine.on('callVariable', function (name, done) {
                if (name.toLowerCase() === 'userid') {
                    done(((Window["iamPageVariables"]) ? Window["iamPageVariables"]["userId"] : null));
                } else {
                    if (name.toLowerCase() === 'tenantid') {
                        done(((Window["iamPageVariables"]) ? Window["iamPageVariables"]["tenantId"] : null));
                    }
                }
            });
            
            //Créer les variables liées au dépendances
            dependencies.forEach(function (dependencyItem) {
                calcEngine.setVariable(dependencyItem.sourceObjectName + "_" + dependencyItem.sourceObjectProperty, null);
            });

            //ajouter les fonctions iamShared
            Object.keys(iamShared).forEach(function (obj) {
                Object.keys(iamShared[obj]).forEach(function (key) {
                    try {
                        if (typeof iamShared[obj][key] === "function") {
                            calcEngine.setFunction(key, iamShared[obj][key]);
                        }                       
                    } catch (x) {

                    }
                });            
            });
            
            return calcEngine;
        },

        //retourne true si la variable passée est une variable globale
        isCalcEngineGlobalVariable: function (variable) {
            return ["userId", "tenantId"].map(function (el) {
                return el.toLowerCase();
            }).includes(variable.toLowerCase());
        },

        //Retourne la liste des variables d'un calcEngine et l'afficher dans un alert si showInAlert=true
        getCalcEngineVariables: function (calcEngine, showInAlert=false) {

            let list = calcEngine.variables;

            if (showInAlert) {
                alert(JSON
                    .stringify(list)
                );
            }                

            return list;
        },

        //Retourne la liste des variables d'un calcEngine et l'afficher dans un alert si showInAlert=true
        getCalcEngineFunctions: function (calcEngine, showInAlert = false) {

            let list = calcEngine.functions;

            if (showInAlert) {
                alert(JSON
                    .stringify(list)
                );
            }

            return list;
        },

        //permet de retourner un tableau contenant la liste des paramètres disponibles dans 
        getFormulaParams: function (formula) {

            //retourner null si aucun paramètre n'existe
            if (!formula) return null;

            let decoup = formula.split("{");
           

            //retourner null si aucun paramètre n'existe
            if (decoup.length < 2) return null;

            let params = [];
            decoup.forEach(function (part, index) {

                if (index > 0) {
                    decoup2 = part.split("}");
                    params.push(decoup2[0]);
                }

            });

            //retourner null si aucun paramètre n'existe
            if (params.length == 0) return null;

            return params;
        },

        //Adapte la formule en retirant les crochets des variables
        adaptFormulaToCalcEngine: function (formula) {
            return formula.replaceAll("{", "").replaceAll("}", "");
        },

        //Permet de mettre à jour les propriétés d'un objet objectToUpdate depuis celle d'un objet sourceObject en choisissant de respecter la casse dans les noms des propriétés ou pas
        //si addNonExistingProperties=true les propriétés de sourceObject qui n'existent pas dans objectToUpdate seront créées
        updateObjectFromObject: function (sourceObject, objectToUpdate, caseSensitivePropertyName =false, addNonExistingProperties=false) {

            Object.keys(sourceObject).forEach(function (key) {
                let keyExists = false;

                //Vérifier si la case doit etre respectée dans le nom de l'objet
                if (caseSensitivePropertyName) {
                    if (key in objectToUpdate) {
                        objectToUpdate[key] = sourceObject[key];
                        keyExists = true;
                    }
                } else {

                    //Rechercher si une propriété sans respect de casse existe dans l'objet de destination
                    Object.keys(objectToUpdate).forEach(function (dkey) {
                        if (dkey.toLowerCase() == key.toLowerCase()) {
                            objectToUpdate[dkey] = sourceObject[key];
                            keyExists = true;
                        }
                        
                    });

                    
                }

                //Si la propriété n'existe pas et que addNonExistingProperties = true alors l'ajouter
                if (keyExists == false && addNonExistingProperties) objectToUpdate[key] = sourceObject[key];

            });
        },

        //Retourne un string GUID
        guidString: function () {
            return new DevExpress.data.Guid().toString();
        },

        //Retourner un vrai GUID ou transforme le string passé en vrai GUID
        guid: function (guidString) {
            return new DevExpress.data.Guid(guidString);
        },

        getRealDataSource: function (dataSourceOrDataSourceExpression, paramsObject, serviceUrl) {

            //Si la source est un tableau, retourner directement
            if (Array.isArray(dataSourceOrDataSourceExpression)) return dataSourceOrDataSourceExpression;

            //Si une fonction est passée, l'exécuter
            if (typeof dataSourceOrDataSourceExpression === 'function') {

                return dataSourceOrDataSourceExpression.call(paramsObject);
            }

            if (typeof dataSourceOrDataSourceExpression == 'string' && serviceUrl) {

                return DevExpress.data.AspNet.createStore({                    
                    loadUrl: serviceUrl + "/" + dataSourceOrDataSourceExpression
                });
            }

            return dataSourceOrDataSourceExpression;
        },

        //Exécute le code js. paramsObject est de la forme {key1:value1, key2:value2}
        eval: function (stringToEval, paramsObject) {

            if (!stringToEval) return stringToEval;
            if (stringToEval == undefined) return undefined;

            switch (stringToEval.toLowerCase()) {
                case "false": {
                    return false;
                    break;
                }
                case "true": {
                    return true;
                    break;
                }
                default:
                    if (!isNaN(stringToEval)) return Number(stringToEval);

                    //remplacer les paramètres 
                    if (paramsObject) {
                        for (let key in paramsObject) {
                            stringToEval = stringToEval.replaceAll("{" + key + "}", paramsObject[key]);
                        }
                    }
            
                    var F = new Function(stringToEval);

                    return (F());
                    break;
            }

            
        }
    },

    //fonction relatives à Framework7 --------------------------------------------------------------------------------------------------------------------------
    f7: {
        createSmartSelect: function (f7app, containerId, selectId, dataSource, caption, keyEpr, displayExpr, addNullItem, nullItemText) {
            var html = '<a id="a_' + selectId + '" class="item-link smart-select smart-select-init">';

            html += '<select id="' + selectId + '" name="' + selectId + '">';
            if (addNullItem) {
                if (!nullItemText) nullItemText = "NULL";

                html += '<option value=null>' + nullItemText + '</option>';
            }
            if (dataSource && dataSource.length > 0) {
                dataSource.forEach(function (item) {
                    html += '<option value="' + item[keyEpr] + '">' + item[displayExpr] + '</option>';
                }
                );
            }
            html += '</select>';
            html += `<div class="item-content">
                    <div class="item-inner">
                        <div class="item-title">`+ caption + `</div>
                    </div>
                </div>`;
            html += "</a>";

            $("#" + containerId).html(html);

            //retourner l'objet smartSelect
            return f7app.smartSelect.get('#a_' + selectId);
        },

        createSmartSelectInnerOptions: function (dataSource) {

        }
    },

    //fonctions relatives aux traitements des fichiers ---------------------------------------------------------------------------------------------------------
    files: {
        activeFileFunctionCallBack: null,
        activeFileIsBlob: false,

        //lancer la copie d'un fichier de texte et lire le resulat en executant une fonction passée en callback
        loadClientFile: function (callBackFunction) {
            //Prendre la fonction pour la conserver en active pour le retour de lecture du fichier
            iamShared.file.activeFileFunctionCallBack = callBackFunction;
            $("#iamFileinput").trigger("click");
        },

        //Permet de créer automatiquement un fichier depuis le string passé "text" et de le download pour faciliter la fonction save
        stringToFileDownload: function (filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },

        //permet la lecture d'un fichier et execute une fonction passée en paramètre en lui passant le contenu du fichier
        readFileAndExecuteCallbackFunction: function (evt, callBackFunction, isBlob) {
            var files = evt.target.files;
            var file = files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                //Executer la callbackfunction
                callBackFunction(event.target.result);
            }


            if (isBlob) {
                //traiter directement le blob
                callBackFunction(file);
            } else {
                reader.readAsText(file); //Encoding is utf-8 by default
            }

            return;
        },

        //Permet de retourner un DataURl ou le Base64 uniquement compris dans le dataURL depuis l'url source d'un fichier
        urlToDataUrl: function (url, callback, useOnlyBase64Data) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    if (useOnlyBase64Data) {
                        callback(reader.result.split(",", 2)[1].trim());
                    } else {
                        callback(reader.result);
                    }

                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        },

        //Transforme un contenu base 64 d'un fichier d'un type spécfique en fichier réel (File) pour le web
        //contentType: 'application/pdf', 'image/png'
        base64toFile: function (b64Data, filename, contentType) {
            contentType = contentType || 'image/png';
            var sliceSize = 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);
                var byteNumbers = new Array(slice.length);

                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            var file = new File(byteArrays, filename, { type: contentType });
            return file;
        },

        //Transforme un contenu base 64 d'un fichier d'un type spécfique en blob pour le web
        base64toBlob: function (base64Data, contentType) {
            contentType = contentType || 'image/png';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }

            var blob;
            try {
                blob = new Blob(byteArrays, { type: contentType });
            }
            catch (e) {
                // TypeError old chrome and FF
                window.BlobBuilder = window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder ||
                    window.MSBlobBuilder;
                if (e.name == 'TypeError' && window.BlobBuilder) {
                    var bb = new BlobBuilder();
                    bb.append(byteArrays);
                    blob = bb.getBlob(contentType);
                }
                else if (e.name == "InvalidStateError") {
                    // InvalidStateError (tested on FF13 WinXP)
                    blob = new Blob(byteArrays, { type: contentType });
                }
                else {
                    // We're screwed, blob constructor unsupported entirely   
                }
            }
            return blob;
        },

        //permet de copier un fichier depuis son emplacement baseFileURI vers un dossier de destination fileSystem
        //baseFileURI est de la forme"file:///storage/emulated/0/Android/data/com.iamagicsuite.mobile/cache/fichier.jpg"
        //destFileNameWithExtension est de la forme nomfichier.extension: fichier.pdf ou fichier.png etc selon l'extension du fichier.
        //fileSystem == LocalFileSystem.TEMPORARY pour dossier temp ou fileSystem == LocalFileSystem.PERSISTENT, dossier de l'APP 
        cordovaFileCopy: function (baseFileURI, destFileNameWithExtension, fileSystem) {

            if (!window.cordova) {
                iamShared.messages.showErreurMsg(iamStrings.messages.noCordova);
                return;
            }

            window.resolveLocalFileSystemURL(baseFileURI,
                function (file) {
                    window.requestFileSystem(fileSystem, 0,
                        function (fileSystem) {
                            var documentsPath = fileSystem.root;

                            file.copyTo(documentsPath, destFileNameWithExtension,
                                function (res) {
                                    iamShared.messages.showSuccessMsg("Copie vers : " + res.nativeURL + " effectuée avec succès!");
                                },
                                function () {

                                    iamShared.messages.showErreurMsg(iamStrings.messages.copyError);
                                });
                        });
                },
                function () {
                    iamShared.messages.showErreurMsg(iamStrings.messages.fileNotFound);
                });
        },

        //Permet de créer un fichier un contenu base 64
        // directoryPath = cordova.file.dataDirectory ou -.externalDataDirectory, -.externalRootDirectory (SDCARD)  , -externalApplicationStorageDirectory    ou chemin absolu : file:///storage/emulated/0/Android/data/myPackageName/cache/1461244585881.jpg
        cordovaFileCreateFromBase64: function (base64String, directoryPath, fileNameWithExtension) {

            if (!directoryPath) directoryPath = cordova.file.dataDirectory;

            window.resolveLocalFileSystemURL(directoryPath, function (dir) {
                dir.getFile(fileNameWithExtension, { create: true, exclusive: false }, function (fileEntry) {
                    fileEntry.createWriter(function (writer) {
                        writer.seek(0);
                        writer.write(base64String);
                        iamShared.messages.showSuccessMsg(iamStrings.messages.operationSucces);
                    }, function (error) {
                        iamShared.messages.showErreurMsg("Erreur: " + error.code);
                    }, function () {
                        iamShared.messages.showErreurMsg(iamStrings.messages.fileNotFound);
                    });
                });
            });

        },

        //Permet de créer un fichier un contenu base 64
        // directoryPath = cordova.file.dataDirectory ou -.externalDataDirectory, -.externalRootDirectory (SDCARD)  , -externalApplicationStorageDirectory    ou chemin absolu : file:///storage/emulated/0/Android/data/myPackageName/cache/monTexte.txt
        //fileNameWithExtension: monFichier.txt, monFichier.json, monFichier.js etc.
        cordovaFileCreateFromString: function (Txt, directoryPath, fileNameWithExtension, useDownloadFolder) {

            if (!directoryPath) directoryPath = cordova.file.dataDirectory;
            if (useDownloadFolder) {
                var storageLocation = "";

                switch (device.platform) {

                    case "Android":
                        storageLocation = 'file:///storage/emulated/0/';
                        break;
                    case "iOS":
                        storageLocation = cordova.file.documentsDirectory;
                        break;
                    default:
                        storageLocation = cordova.file.dataDirectory;
                }


                window.resolveLocalFileSystemURL(storageLocation,
                    function (fileSystem) {

                        fileSystem.getDirectory('Download', {
                            create: true,
                            exclusive: false
                        },
                            function (dir) {

                                dir.getFile(fileNameWithExtension, { create: true, exclusive: false }, function (fileEntry) {
                                    fileEntry.createWriter(function (writer) {
                                        writer.seek(0);
                                        writer.write(Txt);
                                        iamShared.messages.showSuccessMsg(fileCopyToDownloadSuccess + " " + fileNameWithExtension);
                                    }, function (error) {
                                        iamShared.messages.showErreurMsg("Erreur: " + error.code);
                                    }, function () {
                                        iamShared.messages.showErreurMsg(iamStrings.messages.fileNotFound);
                                    });
                                });

                            },
                            function () {
                                iamShared.messages.showErreurMsg("Accès au dossier Download refusé ou dossier inexistant!");
                            }
                        );
                    },
                    function () {
                        iamShared.messages.showErreurMsg("Accès au dossier refusé ou dossier inexistant! " + storageLocation);
                    }
                );

                return;
            }


            window.resolveLocalFileSystemURL(directoryPath, function (dir) {
                dir.getFile(fileNameWithExtension, { create: true, exclusive: false }, function (fileEntry) {
                    fileEntry.createWriter(function (writer) {
                        writer.seek(0);
                        writer.write(Txt);
                        iamShared.messages.showSuccessMsg(iamStrings.messages.operationSucces + " " + directoryPath + fileNameWithExtension);
                    }, function (error) {
                        iamShared.messages.showErreurMsg("Erreur: " + error.code);
                    }, function () {
                        iamShared.messages.showErreurMsg(iamStrings.messages.fileNotFound);
                    });
                });
            });

        },

        //Permet de supprimer un fichier 
        // directoryPath = cordova.file.dataDirectory ou -.externalDataDirectory, -.externalRootDirectory (SDCARD)  , -externalApplicationStorageDirectory    ou chemin absolu : file:///storage/emulated/0/Android/data/myPackageName/cache/1461244585881.jpg
        cordovaFileDelete: function (directoryPath, fileNameWithExtension) {

            if (!directoryPath) directoryPath = cordova.file.dataDirectory;

            window.resolveLocalFileSystemURL(directoryPath, function (dir) {
                dir.getFile(fileNameWithExtension, { create: false }, function (fileEntry) {
                    fileEntry.remove(function (file) {
                        iamShared.messages.showSuccessMsg(iamStrings.messages.operationSucces);
                    }, function (error) {
                        iamShared.messages.showErreurMsg("Erreur: " + error.code);
                    }, function () {
                        iamShared.messages.showErreurMsg(iamStrings.messages.fileNotFound);
                    });
                });
            });

        },

        //permet de créer une url DATA Base64 pour  les images
        cordovaFileReadAsDataURL: function (directoryPath, fileNameWithExtension, base64Var) {
            if (!directoryPath) directoryPath = cordova.file.dataDirectory;

            cordova.file.readAsDataURL(directoryPath, fileNameWithExtension).then(function (result) {
                base64Var = result;
            },
                (error) => {
                    iamShared.messages.showErreurMsg(error.message);
                });
        },
    },

	dx: {

		//Retourne null ou l'instance de l'objet dx recherché
		getInstance:function (objectId) {
			let element = document.getElementById(objectId);

			if (!element) return null;

			var instance = DevExpress.ui.dxPopup.getInstance(element);

			return instance;
		},

		//Permet de dire si l'instance de l'objet dont l'id est passé existe déjà
		instanceExists: function (objectId) {
						
			return (this.getInstance(objectId)) ? true : false;
		},

		//permet de supprimer l'objet existant.
		deleteInstance: function (objectId, deleteObjectDiv) {

			let instance = this.getInstance(objectId);

			if (instance) {
				//détruire l'instance et les évènements liés.
				instance.dispose();
            }

			//Supprimer le div de l'objet si demandé
			if (deleteObjectDiv) $("#" + objectId).remove();

			return true;
		}
    },

    //fonctions relatives à l'interface utilisateur (panels, popup windows, etc) ---------------------------------------------------------------------------------------------------------
    ui: {

		//Popup d'édition de formule de calcul
		calculationFormulaBuilder: function (title, titleLocalizationName, formula, callBackFunction) {
			var htmlBuilderHtml = ``;
			var popupId = 'iamFormulaBuilderPopup';

			if ($("").length > 0) $(document.body).append(htmlBuilderHtml);
		},

        //Générer un html final en utilisant une chaine template contenant des variables à remplacer pour un objet ou un tableau d'objets
        //containerId : identifiant du conteneur dans lequel insérer le html, null si on recherche simplement à retourner le html contenant les paramètres avec les valeurs remplacées.
        //templateHtml : Chaine html utilisée comme template contenant les variables à remplacer
        //data: objet ou tableau de données contenant les valeurs de remplacement dans le template
        //emptyContainer: true si le conteneur doit être vider avant d'ajouter les nouveaux élément lorsque containerId n'est pas null
        buildHtmlTemplate: function (containerId, templateHtml, data, emptyContainer=true) {

            //Vider le container si cela a été demandé
            if (emptyContainer && containerId) $("#" + containerId).empty();

            var finalHtmlToInsert = templateHtml;

            if (Array.isArray(data)) {
                finalHtmlToInsert = "";
                data.forEach(function (item) {
                    var itemHtml = templateHtml;

                    //Parcourir la liste des propriétés de chaque item et intégrer les paramètres dans la chaine template
                    Object.keys(item).forEach(function (prop) {
                        itemHtml = itemHtml.replaceAll("{" + prop + "}", item[prop]);
                    });

                    //Ajouter le html de la ligne au html final
                    finalHtmlToInsert += itemHtml;
                });

                //Insérer le nouveau html dans le conteneur  s'il est spécifié
                if (containerId) $("#" + containerId).append(finalHtmlToInsert);

            } else {
                //Parcourir la liste des propriétés de l'objet et intégrer les paramètres dans la chaine template
                Object.keys(data).forEach(function (prop) {
                    finalHtmlToInsert = finalHtmlToInsert.replaceAll("{" + prop + "}" , data[prop]);
                });
                //Insérer le nouveau html dans le conteneur s'il est spécifié
                if (containerId) $("#" + containerId).append(finalHtmlToInsert);
            }

            return finalHtmlToInsert;
        }, 

        //permet d'afficher un popup contenant le designer adequat selon le nom unique de la page passé
        designersShowPopup: function (app, pageUniqueName) {

            let popupId = "iamPopupWithIF";
            let localizationTitleName = "";
                      
            let url = window["iamPageVariables"]["designPageUrl"]+ "/?uniqueName=" + pageUniqueName;

            //Afficher le popup du designer
            return this.popupWithIframeShow (app, popupId , url, null, localizationTitleName);
        },

        //permet d'afficher un popup contenant le designer adequat selon l'id de la page passé
        designersShowPopupByPageId: function (app, pageId) {

            let popupId = "iamPopupWithIF";
            let localizationTitleName = "";

            let url = window["iamPageVariables"]["designPageUrl"] + "/?id=" + pageId;

            //Afficher le popup du designer
            return this.popupWithIframeShow(app, popupId, url, null, localizationTitleName);
        },

        //Permet de mettre à jour le titre du popup depuis les infos du titre disponible dans la page chargée de le IFrame du popup
        popupWithIframeUpdateTitleByChildDocument: function (windw,title) {

            //Renommer le titre du popup si le formulaire est ouvert dans un popup
            if (windw.top != windw.self) {
                try {
                    //Récupérer les iframes du parent
                    windw.parent.$("iframe").each(function (iel, el) {

                        if (el.contentWindow === windw) {

                            let $element = windw.parent.$("#" + windw.name.replace("_Iframe", ""));
                            if ($element.length > 0) {
                                let instance = windw.parent.DevExpress.ui.dxPopup.getInstance($element[0]);
                                if (instance) instance.option("title", title);
                            }
                        }
                    });
                } catch (x) {

                }
            }
        },

        //Créer un popup contenant un Iframe pour l'affichage de page en popup dans le Iframe
        popupWithIframeCreate: function (app, popupId = "iamPopupWithIF", url, title, localizationTitleName, show = false) {

            if (!popupId) popupId = "iamPopupWithIF";

            //Le popup existe déjà alors sortir
            if ($("#" + popupId).length > 0) return;

            //Créer le Html du popup incluant le Iframe dans le body de la page
            let popupIframeId = popupId + "_Iframe";
            $("body").append(
                `<div id="${popupId}">        
                    <iframe id="${popupIframeId}" name="${popupIframeId}" src="${url || ''}"  width="100%" style="height: 92vh; border: none"></iframe>        
                </div>`
            );

            //Créer le popup
            var popup = $("#" + popupId).dxPopup({
                name: popupId,
                fullScreen: true,
                height: "600px",
                onShown: function (e) {
                    var winH = $(window).height();
                    //adapter la hauteur
                    if (winH > 690) {
                        $('#' + popupId).height(winH - 90);
                    } else {
                        $('#' + popupId).height(500);
                    }

                },
                showCloseButton: true,
                showTitle: true,
                title: ((localizationTitleName)?app.localize('localizationTitleName'): title),
                width: "100%"
            }).dxPopup("instance");

            //Ajouter l'évènement pour gérer le redimensionnement
            $(window).on("resize", function () {

                var winH = $(window).height();

                //adapter la hauteur
                if (winH > 690) {
                    $('#' + popupId).height(winH - 90);
                } else {
                    $('#' + popupId).height(500);
                }
            });

            //Afficher le popup
            if (show) {
                popup.show();
            }

            return popup;
        },

         //Afficher un popup contenant un Iframe et passer l'url de la page si nécessaire. Si l'id du popup n'existe pas, alors le popup est automatiquement créé
        popupWithIframeShow: function (app, popupId = "iamPopupWithIF", url, title, localizationTitleName) {

            if (!popupId) popupId = "iamPopupWithIF";

            //Le popup n'existe pas alors le créer, l'afficher et sortir
            if ($("#" + popupId).length < 1) {
                return this.popupWithIframeCreate(app, popupId, url, title, localizationTitleName, true)
            };

            let popupIframeId = popupId + "_Iframe";

            //prendre le popup
            var popup = $("#" + popupId).dxPopup("instance");

            //Modifier le titre si nécessaire
            if (localizationTitleName || title)
                popup.option("title", ((localizationTitleName) ? app.localize('localizationTitleName') : title));

            //Adapter l'url si nécessaire
            if (url) $('#' + popupIframeId).attr('src',url);

            //Afficher le popup
            popup.show();           

            return popup;
        },

        //permet de calculer une hauteur depuis celle du window en ajoutant ou retranchant des dimensions selon la valeur positive ou négative de additionnalHeight
        getHeightFromWindowHeight : function (additionnalHeight = 0, addPixels = false){
            var windowHeight = window.innerHeight;
            return (addPixels) ? windowHeight + additionnalHeight + "px" : windowHeight + additionnalHeight ;
        },

		//Permet de créer la zone du html pour les assistants si elle n'existe pas déjà
		wizardPopupHtmlCreate: function (container = "body") {

			//Si le div existe déjà alors sortir
			if ($("#iamQFWizardPopup").length > 0) return;

			let html =
				`<!--begin::popup wizard-->
                    <div id="iamQFWizardPopup">
                        <div id="iamQFWizardContainer">
                        </div>
                    </div>
                 <!--end::popup wizard-->
                `;

			if (container && container != "body") {
				container = "#" + container;
			} else {
				container = document.body;
			}

			//Ajouter le panel à la page
			$(container).append(html);

		},


        //Identifiant de la zone de titre du right panel
        rightPanelTitleId: 'iamQFRightPanelTitle',


        //Permet de créer la zone du rightPanel si elle n'existe pas déjà
        rightPanelCreate: function (title, show = false, container = "body") {

            //Si le div existe déjà alors sortir
            if ($("#kt_iamQFRightPanel").length > 0) return;

            let html =
                `
                <!--begin::Right Panel-->
                <div id="kt_iamQFRightPanel" class="offcanvas offcanvas-right p-10">

                    <!--begin::Header-->
                    <div class="offcanvas-header d-flex align-items-center justify-content-between pb-7">
                        <h4 class="font-weight-bold m-0" id="iamQFRightPanelTitle">${title}</h4>
                        <a href="#" class="btn btn-xs btn-icon btn-light btn-hover-primary" id="kt_iamQFRightPanel_close">
                            <i class="ki ki-close icon-xs text-muted"></i>
                        </a>
                    </div>
                    <!--end::Header-->

                    <!--begin::Content-->
                    <div class="offcanvas-content">

                        <!--begin::Wrapper-->
                        <div class="offcanvas-wrapper mb-5 scroll-pull">
                            <div id="iamQFRightPanelContainer">

                            </div> 
                        </div>
                        <!--end::Wrapper-->

                    </div>
                    <!--end::Content-->

                </div>
                <!--end::Right Panel-->
                `;

            if (container && container != "body") {
                container = "#" + container;
            } else {
                container = document.body;
            }

            //Ajouter le panel à la page
            $(container).append(html);

            //Gérer le bouton de fermeture du paneau
            $("#kt_iamQFRightPanel_close").click(function (e) { iamShared.ui.rightPanelHide(); });

            //Afficher automatiquement le paneau si cela a été demandé
            if (show) iamShared.ui.rightPanelShow();

        },

        //Afficher le right panel de magic suite
        rightPanelShow: function () {
            if ($("#kt_iamQFRightPanel").hasClass("offcanvas-on") == false) $("#kt_iamQFRightPanel").addClass("offcanvas-on");
            return;
        },
        //Masquer le rignt panel
        rightPanelHide: function () {
            if ($("#kt_iamQFRightPanel").hasClass("offcanvas-on") == true) $("#kt_iamQFRightPanel").removeClass("offcanvas-on");
            return;
        },


        contextMenu: null,
        contextMenuObject: null,
        //Afficher un context menu pour sélectionner une information
        contextMenuShowSelection: function (app, dataSource, callbackFunction, cmOption, keyExpr, displayExpr, localizationDisplayExpr, itemTemplate, selection) {

            let self = this;

            if (!dataSource || dataSource.length == 0) {
                iamShared.messages.showWarningMsg("NoDataToSelect")
                return;
            }

            //créer l'objet utile pour la création dynamique du popup de sélection
            self.contextMenuObject = {                
                items: dataSource,               
                callbackFunction: callbackFunction,
                keyExpr: keyExpr,
                displayExpr: displayExpr,
                localizationDisplayExpr: localizationDisplayExpr,
                itemTemplate: itemTemplate,                
                cmOption: cmOption,
                selection: selection
            }
            
            //Créer le div du popup s'il n'existe pas dans la page
            if ($("#iamContextMenu").length < 1) {
				$(document.body).append('<div id="iamContextMenu"></div>');
            }

            
            if ($("#iamContextMenu").length > 0 && !self.contextMenu) {
                self.contextMenu = $("#iamContextMenu").dxContextMenu({                    
                    name: "iamContextMenu",
                    items: dataSource,
                    position: { of: { pageX: event.pageX, pageY: event.pageY, preventDefault: true } },
                    //libérer la mémoire et réinitialiser les variables lorsque le popup est libéré
                    onHidden: function (e) {
                        //Vider toutes les variables
                        contextMenu = null;
                        contextMenuObject= null;
                        return;
                    },

                    onItemClick: function (e) {
                        //exécuter la fonction callback en lui passant la sélection                       
                        if (self.contextMenuObject.callbackFunction) self.contextMenuObject.callbackFunction(e.itemData);
                    },
                    width: "250px",
                    //onShowing: function (e) {
                    
                    
                }).dxContextMenu("instance");
            }


            let option;
            //vérifier si un objet Option de configuration de list a été passé en paramètre a la fonction
            if (!self.contextMenuObject.cmOption) {
                    option = {
                        //name: "iamContextMenu",                                    
                        //items: null,                                    
                        //height:"100%",
                        //itemTemplate: null,                                                                  
                        //onItemClick: null,
                        width:"200px",
                        position:null
                    };

            } else {
                option = self.contextMenuObject.cmOption;
            }

            // prendre la source de données passée en paramètre
              if (self.contextMenuObject.items) {
                   option.items = self.contextMenuObject.items;
              }


                    //    if (self.contextMenuObject.keyExpr) {
                    //        option.keyExpr = self.contextMenuObject.keyExpr;
                    //    }
                    //    if (self.contextMenuObject.localizationDisplayExpr) {
                    //        option.displayExpr = function (item) { return app.localize(item[self.contextMenuObject.localizationDisplayExpr]); };
                    //    } else {
                    //        if (self.contextMenuObject.displayExpr) {
                    //            option.displayExpr = self.contextMenuObject.displayExpr;                                
                    //        }
                    //    }

                    //    if (self.contextMenuObject.itemTemplate) {
                    //        option.itemTemplate = self.contextMenuObject.itemTemplate                                
                    //    }

                    //    //Positionner l'élément avant
            option.position = { of: { pageX: event.pageX, pageY: event.pageY, preventDefault: true } };
            self.contextMenu.option(option);                        
         
            //Afficher le popup de l'assitant
            if (self.contextMenu) self.contextMenu.show();

            return;
        },


        popupSelectedItems:null,
        popupSelect:null,
        popupSelectObject: null,
        //Function qui gère la validation de la sélection du popup
        popupValiderSelection: function (closePopup) {
            //prendre l'instance du controle
            var widget = this.popupSelectObject.listInstance;
            
            //exécuter la fonction callback en lui passant la sélection
            if (this.popupSelectObject.callbackFunction && widget.option("selectedItems").length>0) this.popupSelectObject.callbackFunction(widget.option("selectedItems"));

            if (closePopup) this.popupSelect.hide();
        },
        popupAnnulerSelection: function () {
            //fermer simplement le popup
            this.popupSelect.hide();
            //iamShared.messages.showInformationMsg("Sélection annulée!");
        },

        //Afficher un popup pour sélectionner des données en provenance d'un Entity de magic Data
        popupShowDataServiceEntitySelection: function (magicDataService, entityId, entityKeyValuePairsObject, entityFilterExpression, app, title, titleLocalizationName, multiSelect, callbackFunction, keyExpr, displayExpr, itemTemplate) {

            //Essayer de récuperer un magic dataService par défaut si aucun n'est passé en paramètre
            if (!magicDataService) {
                magicDataService = iamShared.utils.getMagicDataService();
            }

            //Créer l'objet de demande de données vers un entity
            let dataRequestObjectInput = {
                entityId: entityId,
                keyValuePairsString: ((entityKeyValuePairsObject) ? JSON.stringify(entityKeyValuePairsObject) : null),
                filterExpression: entityFilterExpression,
                dataId:null
            };
                        
            //Récupérer les données depuis le service magic Data
            magicDataService.get(dataRequestObjectInput).done(function (result) {
                //Lancer le popup en utilisant les données retournées.
                console.log(result);
                if (result) {

                    //Si le displayExpr n'est pas renseigné alors prendre celui du resultat dataRequest
                    if (!displayExpr) displayExpr = result.displayNameFieldName;
                    //Si le keyExpr n'est pas renseigné alors prendre celui du resultat dataRequest
                    if (!keyExpr) keyExpr = result.keyFieldName;

                    //Les noms des colonnes dans result.data etant en "CamelCase", utiliser la fonction iamShared.strings.convertToCamelCase sur keyExpr et displayExpr pour s'assurer de la concordance des noms
                    iamShared.ui.popupShowSelection(app, title, titleLocalizationName, result.data, multiSelect, callbackFunction, null, null, iamShared.strings.convertToCamelCase(keyExpr), iamShared.strings.convertToCamelCase(displayExpr), itemTemplate, null);
                } else {
                    iamShared.messages.showErrorMsg("ErrorRequestingData");
                }
                
            });
        },

        //Afficher un popup pour sélectionner des données dans une liste
        popupShowSelection: function (app, title, titleLocalizationName, dataSource, multiSelect, callbackFunction, listInstance, listOption, keyExpr, displayExpr, itemTemplate, selection) {

            let self = this;

            if (!dataSource || dataSource.length == 0) {
                iamShared.messages.showWarningMsg("NoDataToSelect")
                return;
            }

            //créer l'objet utile pour la création dynamique du popup de sélection
            self.popupSelectObject = {
                title: ((titleLocalizationName && app) ? app.localize(titleLocalizationName) : title),
                dataSource: dataSource,
                multiSelect: multiSelect,
                callbackFunction: callbackFunction,
                keyExpr: keyExpr,
                displayExpr: displayExpr,
                itemTemplate: itemTemplate,
                listInstance: listInstance,
                listOption: listOption,
                selection: selection
            }

            //Afficher le popup de sélection
            //let element = document.getElementById("iamPopupSelect");
            //let instance = DevExpress.ui.dxPopup.getInstance(element);

            //Créer le div du popup s'il n'existe pas dans la page
            if ($("#iamPopupSelect").length < 1) {
				$(document.body).append('<div id="iamPopupSelect"><div style="max-height: 620px;"><div id="iamPopupSelectList"></div></div></div>');
            }

            if ($("#iamPopupSelect").length > 0 && !self.popupSelect) {
                self.popupSelect = $("#iamPopupSelect").dxPopup({
                    height: ((dataSource.length<16)? "auto": 600),
                    name: "iamPopupSelect",
                    title: self.popupSelectObject.title,
                    
                    //libérer la mémoire et réinitialiser les variables lorsque le popup est libéré
                    onHidden: function (e) {
                        //Vider toutes les variables
                        popupSelectedItems: null;
                        popupSelect: null;
                        popupSelectObject: null;
                        return;
                    },
                    
                    onShown: function (e) {
                        //mettre à jour le titre de la page si nécessaire
                        if (self.popupSelectObject.title) {
                            self.popupSelect.option("title", self.popupSelectObject.title);
                        }

                        //Vérifier si une instance de list à utiliser est aussi passé en paramètre
                        if (self.popupSelectObject.listInstance) {
                            self.popupSelectObject.listInstance = $("#iamPopupSelectList").dxList(self.popupSelectObject.listInstance.option()).dxList("instance");
                        } else {
                            var option;
                            //vérifier si un objet Option de configuration de list a été passé en paramètre a la fonction
                            if (!self.popupSelectObject.listOption) {
                                option = {
                                    name: "iamPopupSelectList",
                                    keyExpr: keyExpr,
                                    dataSource: null,
                                    displayExpr: displayExpr,                                    
                                    itemTemplate: "item",
                                    searchExpr: displayExpr,
                                    selectionMode: "single",
                                    searchEnabled: true,
                                    onItemClick: null
                                };

                            } else {
                                option = self.popupSelectObject.listOption;
                            }
                            //prendre la source de données passée en paramètre
                            if (self.popupSelectObject.dataSource) {
                                option['dataSource'] = self.popupSelectObject.dataSource;
                                option['height'] = ((self.popupSelectObject.dataSource.length < 16) ? null : "100%");
                            }
                            //gérer la sélection multiple
                            if (self.popupSelectObject.multiSelect) {
                                option.selectionMode = "multiple";
                                option.selectAllMode = "allPages";
                            } else {
                                option.selectionMode = "single";

                                if (!self.popupSelectObject.selection || self.popupSelectObject.selection.length == 0) {
                                    option.onItemClick = function (e) {
                                        self.popupValiderSelection(true);
                                    };
                                }
                            }

                            if (self.popupSelectObject.keyExpr) {
                                option.keyExpr = self.popupSelectObject.keyExpr;
                            }
                            if (self.popupSelectObject.displayExpr) {
                                option.displayExpr = self.popupSelectObject.displayExpr;
                                option.searchExpr = option.displayExpr;
                            }
                            if (self.popupSelectObject.itemTemplate) {
                                //renseigner le contenu du template dans la balise adéquate
                                $("#iamPopupSelectTemplate").html(self.popupSelectObject.itemTemplate).then(function () {
                                    option.itemTemplate = $("#iamPopupSelectTemplate");
                                    //générer l'objet
                                    self.popupSelectObject.listInstance = $("#iamPopupSelectList").dxList(option).dxList("instance");
                                });

                            } else {
                                //générer l'objet
                                self.popupSelectObject.listInstance = $("#iamPopupSelectList").dxList(option).dxList("instance");
                            }

                        }




                        return;
                    },
                    toolbarItems: [
                        {
                            widget: "dxButton",
                            location: "after",
                            options: {
                                icon: "fas fa-check",
                                text: "Ok",
                                onClick: function () {
                                    self.popupValiderSelection(true);
                                }
                            }
                        },
                        {
                            widget: "dxButton",
                            location: "after",
                            options: {
                                icon: "fas fa-ban",
                                text: app.localize("Cancel"),
                                onClick: function () {
                                    self.popupAnnulerSelection();
                                }
                            }
                        }
                    ]
                }).dxPopup("instance");
            } 
            //Afficher le popup de l'assitant
            if (self.popupSelect) self.popupSelect.show();
            
            return;
        },


		//Variable de conservation en cas de possibilité de selection dans le simple popup
		simplePopupSelectedItem :null,
		//Permet de créer un popup et de retourner son instance. si show=true alors le popup est immédiatement affiché après la création
		simplePopupCreate: function (popupHtmlId = "iamPopup", app, title, titleLocalizationName, contentHtml, replaceContent, popupOptions, toolbarItems, createDefaultToolbarItems = false, recreateIfExists = false, show = true, resizeEnabled = true, fullScreen = false, showCloseButton =true, autoHeight =false,  height=600, width=800, maxHeight) {

			//Vérifier si l'identifiant html du popup est vide
			if (!popupHtmlId) {				
				popupHtmlId = "iamPopup_" + iamShared.utils.guidString();
			}
			
			//Créer la balise html dans le document
			if ($("#" + popupHtmlId).length == 0) {
				if (maxHeight) {
					$(document.body).append('<div id="' + popupHtmlId + '" ><div style="max-height: ' + maxHeight + 'px;"><div id="' + popupHtmlId + 'Content"></div></div></div>');
				} else {
					$(document.body).append('<div id="' + popupHtmlId + '" ><div id="' + popupHtmlId + 'Content"></div></div>');					
				}
			} else {
				//Vérifier si le p
				if (!recreateIfExists) {
					var pop = iamShared.dx.getInstance(popupHtmlId);
					if (pop) {
						//Afficher le popup si cela est demandé
						if (show) pop.show();
						//retourner le popup
						return pop;
					}
				}

				if (replaceContent) {
					$("#" + popupHtmlId).html('><div id="' + popupHtmlId + 'Content"></div>');
				} else {
					$("#" + popupHtmlId).append('<div id="' + popupHtmlId + 'Content"></div>');
                }
            }
			$("#" + popupHtmlId + 'Content').html(contentHtml);
			//Intégrer un scrollview dans le popup pour générer le scroll
			$("#" + popupHtmlId + 'Content').dxScrollView({
				height: '100%',
				width: '100%'

			});

			//Recupérer les propriétés du popup à créer.
			let options = popupOptions;
			
			if (!toolbarItems && createDefaultToolbarItems) {
				toolbarItems = [
					{
						widget: "dxButton",
						location: "after",
						options: {
							icon: "fas fa-check",
							text: "Ok",
							onClick: function () {
								self.popupValiderSelection(true);
							}
						}
					},
					{
						widget: "dxButton",
						location: "after",
						options: {
							icon: "fas fa-ban",
							text: app.localize("Cancel"),
							onClick: function () {
								self.popupAnnulerSelection();
							}
						}
					}
				]
			}

			//si aucun objet contenant les propriétés n'est passé alors crée un objet avec des propriétés par défaut
			if (!options) {
				options = {
					name: popupHtmlId,
					height: ((autoHeight) ? 'auto' : height || 600),
					title: ((titleLocalizationName) ? ((app && app.localize) ? app.localize(titleLocalizationName) : titleLocalizationName) : title),
					resizeEnabled: resizeEnabled,
					fullScreen: fullScreen,
					showCloseButton: showCloseButton,
					//libérer la mémoire et réinitialiser les variables lorsque le popup est libéré
					onHidden: function (e) {
						//Vider toutes les variables
						iamShared.ui.simplePopupSelectedItem = null;
						return;
					},
				}
			
			} else {
				//Inclure le paramétrage de la barre d'outils si cela a été défini
				if (toolbarItems) {
					options["toolbarItems"] = toolbarItems;
				}

				if (title || titleLocalizationName) {
					options["title"] = ((titleLocalizationName) ? ((app && app.localize) ? app.localize(titleLocalizationName) : titleLocalizationName) : title);
				}
            }

			if (recreateIfExists) {
				iamShared.dx.deleteInstance(popupHtmlId, false);
			}

			//contentTemplate: function(container) {
			//	var scrollView = $("<div id='scrollView'></div>");
			//	var content = $("<div></div>");
			//	scrollView.append(content);

			//	content.text("test content").height(1000);
			//	scrollView.

			//	container.append(scrollView);

			//	return container;
			//}

			//Créer le popup et recupérer son instance
			let popup = $("#" + popupHtmlId).dxPopup(options).dxPopup("instance");

			console.log(popup);

			//Afficher le popup si cela est demandé
			if (show) {
				popup.show();
			}

			//retourner l'instance de popup ainsi créée
			return popup;
        }

	},

    //functions de chaine de caractère -------------------------------------------------------------------------------------------------------------------------
    strings: {
        //retirer tous les expaces vide de la chaine de caractère
        removeAllWhiteSpaces: function (str) {
            if (!str) return str;

            return str.replace(/\s/g, "");
        },

        //Créer le pluriel des noms en anglais
        pluralizeEn: function (word) {

            if (!word) return null;

            const plural = {
                '(quiz)$': "$1zes",
                '^(ox)$': "$1en",
                '([m|l])ouse$': "$1ice",
                '(matr|vert|ind)ix|ex$': "$1ices",
                '(x|ch|ss|sh)$': "$1es",
                '([^aeiouy]|qu)y$': "$1ies",
                '(hive)$': "$1s",
                '(?:([^f])fe|([lr])f)$': "$1$2ves",
                '(shea|lea|loa|thie)f$': "$1ves",
                'sis$': "ses",
                '([ti])um$': "$1a",
                '(tomat|potat|ech|her|vet)o$': "$1oes",
                '(bu)s$': "$1ses",
                '(alias)$': "$1es",
                '(octop)us$': "$1i",
                '(ax|test)is$': "$1es",
                '(us)$': "$1es",
                '([^s]+)$': "$1s"
            };
            const irregular = {
                'move': 'moves',
                'foot': 'feet',
                'goose': 'geese',
                'sex': 'sexes',
                'child': 'children',
                'man': 'men',
                'tooth': 'teeth',
                'person': 'people'
            };
            const uncountable = [
                'sheep',
                'fish',
                'deer',
                'moose',
                'series',
                'species',
                'money',
                'rice',
                'information',
                'equipment',
                'bison',
                'cod',
                'offspring',
                'pike',
                'salmon',
                'shrimp',
                'swine',
                'trout',
                'aircraft',
                'hovercraft',
                'spacecraft',
                'sugar',
                'tuna',
                'you',
                'wood'
            ];
            // save some time in the case that singular and plural are the same
            if (uncountable.indexOf(word.toLowerCase()) >= 0) {
                return word
            }
            // check for irregular forms
            for (const w in irregular) {
                const pattern = new RegExp(`${w}$`, 'i')
                const replace = irregular[w]
                if (pattern.test(word)) {
                    return word.replace(pattern, replace)
                }
            }
            // check for matches using regular expressions
            for (const reg in plural) {
                const pattern = new RegExp(reg, 'i')
                if (pattern.test(word)) {
                    return word.replace(pattern, plural[reg])
                }
            }

            return word
        },

        //Convertir une chaine vers la forme Javascript camelCase : monTestEstBon
        convertToCamelCase: function (str) {
            if (!str) return str;
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
        },

        //Convertir une chaine vers la forme C# PascalCase : MonTestEstBon
        convertToPascalCase: function (string) {
            return `${string}`
                .replace(new RegExp(/[-_]+/, 'g'), ' ')
                .replace(new RegExp(/[^\w\s]/, 'g'), '')
                .replace(
                    new RegExp(/\s+(.)(\w+)/, 'g'),
                    ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
                )
                .replace(new RegExp(/\s/, 'g'), '')
                .replace(new RegExp(/\w/), s => s.toUpperCase());
        }, 

        //Convertir une chaine vers la forme Des titres avec uniquement la première lettre du premier mot en Majuscule et tout le reste en miniscule : Montestestbon
        convertToTitleCase: function (string) {
            return `${string}`
                .replace(/\w+/g,
                    function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); });
        }, 

        //Permet de transformer les propriétés d'un objet/tableau d'objet vers la forme camelCase:  monTestEstBon
        convertKeysToCamelCase: function (obj) {
            let that = this;
            if (!obj || typeof obj !== "object") return null;

            //Vérifier si c'est un tableau de données lancer la procédure récursive
            if (obj instanceof Array) {
                return $.map(obj, function (value) {
                    return that.convertKeysToCamelCase(value);
                });
            }

            var newObj = {};
            $.each(obj, function (key, value) {
                key = that.convertToCamelCase(key);
                if (typeof value == "object" && !(value instanceof Array)) {
                    value = that.convertKeysToCamelCase(value);
                }
                newObj[key] = value;
            });

            return newObj;
        },

        //Permet de transformer les propriétés d'un objet/tableau d'objet vers la forme PascalCase:  MonTestEstBon
        convertKeysToPascalCase: function (obj) {
            let that = this;
            if (!obj || typeof obj !== "object") return null;

            //Vérifier si c'est un tableau de données lancer la procédure récursive
            if (obj instanceof Array) {
                return $.map(obj, function (value) {
                    return that.convertKeysToPascalCase(value);
                });
            }

            var newObj = {};
            $.each(obj, function (key, value) {
                key = that.convertToPascalCase(key);
                if (typeof value == "object" && !(value instanceof Array)) {
                    value = that.convertKeysToPascalCase(value);
                }
                newObj[key] = value;
            });

            return newObj;
        }
    },

    //fonctions relative à magic Data --------------------------------------------------------------------------------------------------------------------------
    magicData: {

        //Fonctions pour MagicSuite 3.1 et plus ***********************************************************************************************************************


        //Permet de définir si l'entity dépends de valeurs de champs ou variables et doit être rechargé à chaque demande
        isEntityRequestObjectDependant: function (EntityRequestObject) {

            if (typeof EntityRequestObject.EntityId === "function") return true;
            if (typeof EntityRequestObject.KeyValuePairs === "function") return true;
            if (typeof EntityRequestObject.DataId === "function") return true;
            if (typeof EntityRequestObject.FilterExpression === "function") return true;
            if (typeof EntityRequestObject.Select === "function") return true;
            if (typeof EntityRequestObject.DataTable === "function") return true;

            return false;
        },

        //Permet d'adapter la case des propriétés de l'objet ainsi que d'exécuter les fonctions dynamiques des propriétés en vue de remplacer les paramètres dans les valeurs de mapping
        adaptEntityRequestObject: function (EntityRequestObject, data, variables) {
            if (!EntityRequestObject) return null;

            return {
				entityId: ((EntityRequestObject.EntityId) ? ((typeof EntityRequestObject.EntityId === "function") ? EntityRequestObject.EntityId(data, variables) : EntityRequestObject.EntityId):null),
                keyValuePairsString: ((EntityRequestObject.KeyValuePairs) ? ((typeof EntityRequestObject.KeyValuePairs === "function") ? JSON.stringify( EntityRequestObject.KeyValuePairs(data, variables)) : JSON.stringify(EntityRequestObject.KeyValuePairs)) : null),
                dataId: ((EntityRequestObject.DataId) ? ((typeof EntityRequestObject.DataId === "function") ? EntityRequestObject.DataId(data, variables) : EntityRequestObject.DataId) : null),
                filterExpression: ((EntityRequestObject.FilterExpression) ? ((typeof EntityRequestObject.FilterExpression === "function") ? EntityRequestObject.FilterExpression(data, variables) : EntityRequestObject.FilterExpression) : null),
                select: ((EntityRequestObject.Select) ? ((typeof EntityRequestObject.Select === "function") ? EntityRequestObject.Select(data, variables) : EntityRequestObject.Select) : null),
                datatableString: ((EntityRequestObject.DataTable) ? ((typeof EntityRequestObject.DataTable === "function") ? JSON.stringify(EntityRequestObject.DataTable(data, variables)) : JSON.stringify( EntityRequestObject.DataTable)) : null)
            };
        },

        //magicDataObjectRequest = {EntityId:, KeyValuePairs:, FilterExpression:, DataTable}
        get: function (magicDataService, magicDataObjectRequest, adaptEntityRequestObject, adaptEntityRequestObjectData, adaptEntityRequestObjectVariables, callbackFunction, timeout, showBusy = true) {
            if (magicDataService) return;

            if (showBusy && abp) {
                abp.ui.setBusy('body');
            }

            //if (!timeout) timeout = 180000;

            magicDataService.get(((adaptEntityRequestObject) ? adaptEntityRequestObject(magicDataObjectRequest, adaptEntityRequestObjectData, adaptEntityRequestObjectVariables):magicDataObjectRequest)).done(function (res) {
                    if (callbackFunction) callbackFunction(res);
            }).fail(function (error) {
                    //Afficher le message d'erreur
                    iamShared.messages.showErrorMsg(error);
            }).always(function () {
                    //masquer le busy
                    if (showBusy && abp) {
                        abp.ui.clearBusy('body');
                    }
            });
        },


        //Anciennes fonctions pour MagicSuite 2016 ************************************************************************************************************************

        //Fonction ajax pour recupérer les données depuis le serveur
        //callbackFunction est seulement exécutée si la réponse est non vide et que aucune erreur n'a été signalée durant l'opération
        //callbackFunction accepte l'objet DataObjectResult retourné par l'application. DataObjectResult est de la forme {.Data, }
        dataGet: function (urlServer, token, idProjet, idObjet, idEnregistrement, connectionName, paramsObj, callbackFunction, errorCallbackFunction, busy, timeout) {
            //Construire l'objet de recherche de données MagicData
            var DataObjectResquest = {
                //token pour vérifier les habilitations de l'utilisateur
                token: token
                //Identifiant de la connexion/environnement magic Suite à utiliser
                , id_connexion: null
                //identifiant du projet de données dans magic data gérant l'application ou un module           
                , id_projet: encodeURIComponent(idProjet)
                //identifiant de la nature de l'objet recherché (l'objet pourrait etre par exemple une table une vue ou le resultat d'un sql)
                , id_objet: encodeURIComponent(idObjet)
                , id_enregistrement: null //utiliser encodeURIComponent() pour gérer les caractères non compatible avec le URI
                , key_value_pair_string: null
            };

            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (idEnregistrement) DataObjectResquest.id_enregistrement = encodeURIComponent(idEnregistrement);
            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (connectionName) DataObjectResquest.id_connexion = encodeURIComponent(connectionName);
            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (paramsObj) DataObjectResquest.key_value_pair_string = encodeURIComponent(JSON.stringify(paramsObj));

            if (busy) busy.show();

            if (!timeout) timeout = 180000;
            //Envoyer la demande de données vers le serveur
            var url = urlServer + 'MagicData/DataGet';
            $.ajax({
                url: url,
                type: "POST",
                data: DataObjectResquest,
                dataType: "json",
                crossDomain: true,
                timeout: timeout,// donner un timeout pour ne pas attendre indéfiniment
                success: function (res) {

                    if (res == null) {
                        if (busy) busy.hide();
                        iamShared.messages.showErreurMsg(iamStrings.messages.erreurInconnueOperation);
                        return;
                    } else {

                        if (busy) busy.hide();
                        //Vérifier s'il ya un message d'erreur et l'afficher
                        if (res.ErrorMessage) {
                            iamShared.messages.showErreurMsg(res.ErrorMessage);

                            if (errorCallbackFunction) errorCallbackFunction();

                        } else {
                            //Exécuter la function callback en lui passant les données retournées!
                            if (callbackFunction) callbackFunction(res);
                            return;
                        }

                    }
                },
                error: function () {
                    // will fire when timeout is reached
                    //Masquer le busy
                    if (busy) busy.hide();
                    if (errorCallbackFunction) errorCallbackFunction();

                    //Afficher le message à l'utilisateur
                    iamShared.messages.showErreurMsg(iamStrings.messages.erreurTimeOut);
                },
                fail: function () {
                    if (busy) busy.hide();
                    if (errorCallbackFunction) errorCallbackFunction();
                    iamShared.messages.showErreurMsg(iamStrings.messages.erreurTraitement);
                    return false;
                }
            });
        },

        //Fonction ajax pour recupérer insérer un nouvel enregistrement vers le serveur
        //callbackFunction est seulement exécutée si la réponse est non vide et que aucune erreur n'a été signalée durant l'opération
        //callbackFunction accepte l'objet DataObjectResult retourné par l'application. DataObjectResult est de la forme {.Data, }
        dataInsert: function (urlServer, token, idProjet, idObjet, idEnregistrement, connectionName, paramsObj, callbackFunction, errorCallbackFunction, busy, timeout) {
            //Construire l'objet de recherche de données MagicData
            var DataObjectResquest = {
                //token pour vérifier les habilitations de l'utilisateur
                token: token
                //Identifiant de la connexion/environnement magic Suite à utiliser
                , id_connexion: null
                //identifiant du projet de données dans magic data gérant l'application ou un module           
                , id_projet: encodeURIComponent(idProjet)
                //identifiant de la nature de l'objet recherché (l'objet pourrait etre par exemple une table une vue ou le resultat d'un sql)
                , id_objet: encodeURIComponent(idObjet)
                , id_enregistrement: null //utiliser encodeURIComponent() pour gérer les caractères non compatible avec le URI
                , key_value_pair_string: null
            };

            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (idEnregistrement) DataObjectResquest.id_enregistrement = encodeURIComponent(idEnregistrement);
            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (connectionName) DataObjectResquest.id_connexion = encodeURIComponent(connectionName);
            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (paramsObj) DataObjectResquest.key_value_pair_string = encodeURIComponent(JSON.stringify(paramsObj));

            //lancer la requete ajax            
            if (busy) busy.show();

            if (!timeout) timeout = 180000;
            //Envoyer la demande de données vers le serveur
            var url = urlServer + 'MagicData/DataInsert';
            $.ajax({
                url: url,
                type: "POST",
                data: DataObjectResquest,
                dataType: "json",
                crossDomain: true,
                timeout: timeout,// donner un timeout pour ne pas attendre indéfiniment
                success: function (res) {

                    if (res == null) {
                        if (busy) busy.hide();
                        iamShared.messages.showErreurMsg(iamStrings.messages.erreurInconnueOperation);
                        return;
                    } else {

                        if (busy) busy.hide();
                        //Vérifier s'il ya un message d'erreur et l'afficher
                        if (res.ErrorMessage) {
                            if (errorCallbackFunction) errorCallbackFunction();
                            iamShared.messages.showErreurMsg(res.ErrorMessage);

                        } else {
                            //Exécuter la function callback en lui passant les données retournées!
                            if (callbackFunction) callbackFunction(res);
                            return;
                        }

                    }
                },
                error: function () {
                    // will fire when timeout is reached
                    //Masquer le busy
                    if (busy) busy.hide();
                    if (errorCallbackFunction) errorCallbackFunction();
                    //Afficher le message à l'utilisateur
                    iamShared.messages.showErreurMsg(iamStrings.messages.erreurTimeOut);
                },
                fail: function () {
                    if (busy) busy.hide();
                    if (errorCallbackFunction) errorCallbackFunction();
                    iamShared.messages.showErreurMsg(iamStrings.messages.erreurTraitement);
                    return false;
                }
            });
        },

        //Fonction ajax pour mettre à jour un enregistrement vers le serveur
        //callbackFunction est seulement exécutée si la réponse est non vide et que aucune erreur n'a été signalée durant l'opération
        //callbackFunction accepte l'objet DataObjectResult retourné par l'application. DataObjectResult est de la forme {.Data, }
        dataUpdate: function (urlServer, token, idProjet, idObjet, idEnregistrement, connectionName, paramsObj, callbackFunction, errorCallbackFunction, busy, timeout) {
            //Construire l'objet de recherche de données MagicData
            var DataObjectResquest = {
                //token pour vérifier les habilitations de l'utilisateur
                token: token
                //Identifiant de la connexion/environnement magic Suite à utiliser
                , id_connexion: null
                //identifiant du projet de données dans magic data gérant l'application ou un module           
                , id_projet: encodeURIComponent(idProjet)
                //identifiant de la nature de l'objet recherché (l'objet pourrait etre par exemple une table une vue ou le resultat d'un sql)
                , id_objet: encodeURIComponent(idObjet)
                , id_enregistrement: null //utiliser encodeURIComponent() pour gérer les caractères non compatible avec le URI
                , key_value_pair_string: null
            };

            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (idEnregistrement) DataObjectResquest.id_enregistrement = encodeURIComponent(idEnregistrement);
            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (connectionName) DataObjectResquest.id_connexion = encodeURIComponent(connectionName);
            //prendre des paramètres particuliers à passer a la fonction DataGet de magic data
            if (paramsObj) DataObjectResquest.key_value_pair_string = encodeURIComponent(JSON.stringify(paramsObj));

            //lancer la requete ajax            
            if (busy) busy.show();

            if (!timeout) timeout = 180000;
            //Envoyer la demande de données vers le serveur
            var url = urlServer + 'MagicData/DataUpdate';
            $.ajax({
                url: url,
                type: "POST",
                data: DataObjectResquest,
                dataType: "json",
                crossDomain: true,
                timeout: timeout,// donner un timeout pour ne pas attendre indéfiniment
                success: function (res) {

                    if (res == null) {
                        if (busy) busy.hide();
                        iamShared.messages.showErreurMsg(iamStrings.messages.erreurInconnueOperation);
                        return;
                    } else {

                        if (busy) busy.hide();
                        //Vérifier s'il ya un message d'erreur et l'afficher
                        if (res.ErrorMessage) {
                            if (errorCallbackFunction) errorCallbackFunction();
                            iamShared.messages.showErreurMsg(res.ErrorMessage);
                        } else {
                            //Exécuter la function callback en lui passant les données retournées!
                            if (callbackFunction) callbackFunction(res);
                            return;
                        }

                    }
                },
                error: function () {
                    // will fire when timeout is reached
                    //Masquer le busy
                    if (busy) busy.hide();
                    if (errorCallbackFunction) errorCallbackFunction();
                    //Afficher le message à l'utilisateur
                    iamShared.messages.showErreurMsg(iamStrings.messages.erreurTimeOut);
                },
                fail: function () {
                    if (busy) busy.hide();
                    if (errorCallbackFunction) errorCallbackFunction();
                    iamShared.messages.showErreurMsg(iamStrings.messages.erreurTraitement);
                    return false;
                }
            });
        }
    },

    //------------------------------------------------------------------------------------------------
    //Messages à afficher à l'utilisateur ----------------------------------------------------------
    messages: {

        //Afficher un message d'erreur à l'utilisateur
        showErrorMsg: function (message, delais) {
            if (delais == null) delais = 2000;
            DevExpress.ui.notify({ message: message, width: 400, shading: true }, "error", delais);
        },

        //Afficher un message d'information à l'utilisateur
        showInformationMsg: function (message, delais) {
            if (delais == null) delais = 2000;
            DevExpress.ui.notify({ message: message, width: 400, shading: true }, "info", delais);
        },

        //Afficher un message d'attention à l'utilisateur
        showWarningMsg: function (message, delais) {
            if (delais == null) delais = 2000;
            DevExpress.ui.notify({ message: message, width: 400, shading: true }, "warning", delais);
        },

        //Afficher un message de succes à l'utilisateur
        showSuccessMsg: function (message, delais) {
            if (delais == null) delais = 2000;
            DevExpress.ui.notify({ message: message, width: 400, shading: true }, "success", delais);
        }


    },


    //Fonction de manipulation des tableaux -----------------------------------------------------------------------------------------------------------------
	arrays: {

		//vider réellement le tableau sans créer un nouveau tableau pour l'attribuer ainsi les éléments qui font référence au tableau passé en paramètre son réellement affecté par l'opération
		clear: function (myArray) {			
			myArray.splice(0, myArray.length);
		},

        //Permet de transformer des données plates avec champ id_parent en données hiérarchiques
        flatDataToHierarchicalData: function (flatData, champ_id, champ_id_parent, rootLevel) {
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
        },

        //Permet de générer un nouveau nom non existant dans elementArray à partir d'une racine de nom nameRoot
        //si nameProperty=null alors la recherche se fait directement sur chaque élément du tableau et pas sur la propriété nameProperty de chaque élément
        generateNewName: function (nameRoot, elementArray, nameProperty = "Name", startNumber = 1) {

            if (!elementArray || elementArray.length == 0) return nameRoot + startNumber.toString();
            var exists = true;
            var newName = '';
            var i = startNumber;

            //rechercher si le nouveau nom existe déjà dans le tableau
            do {

                newName = nameRoot + i.toString();
                if (!nameProperty) {
                    if (elementArray.includes(newName) == false) exists = false;
                } else {
                    var element = this.findByKey(elementArray, nameProperty, newName);
                    if (!element) exists = false;
                }

                i++;

            } while (exists = true)

            return newName;
        },

        //Permet de vérifier l'existence d'un objet dans un tableau depuis la clé primaire (propriété key de l'objet dans le tableau).
        //myArray: tableau dans lequel rechercher l'élément , key: propriété representant la clé primaire, keyValue : valeur de la clé primaire du tableau
        existsByKey: function (myArray, key, keyValue) {

            var item = this.findByKey(myArray, key, keyValue);

            if (!item) return false;

            //Retourner 
            return true;
        },

        //permet de vérifier si un élément du tableau myArray existe avec les mêmes valeurs que le paramètre "item" pour toutes les propriétés de "item".
        existsByItemProperties: function (myArray, item) {

            let exists = false;
            //Parcourir tous les élément du tableau
            myArray.forEach(function (el) {

                //Parcourir toutes les propriétés de item
                for (let key in item)
                {
                    if (item[key] != el[key]) {
                        exists = false;
                        break; //sortir du for de item
                    } else {
                        exists = true;
                    }
                }

                //Si l'élément existe alors sortir
                if (exists) return true;
            });

            return exists;
        },

        //Permet d'insérer un élément dans un tableau à une position avant un élément dont la valeur de l'identifiant (key) est passée en argument
        insertBeforeElementByKey(myArray, insertElementKey, insertElementkeyValue,elementOrObjectToInsert) {

            //Identifier l'index de l'element avant lequel insérer
            var index = myArray.findIndex(el => el[insertElementKey] == insertElementkeyValue);

            if (index) myArray.splice(index, 0, elementOrObjectToInsert);

            //retourner l'index
            return index;
        },

        //Repositionner un élément avant un autre grace aux index des 2 éléments
        repositionItemBeforeByIndex: function (myArray, itemToRepositionIndex, itemBeforeToRepositionIndex) {
            myArray.splice(itemBeforeToRepositionIndex, 0, myArray.splice(itemToRepositionIndex, 1)[0]);
            return;
        },
        //Repositionner un élément avant un autre grace aux valeurs de la propriété "Key" des 2 éléments passée en paramètre
        repositionItemBeforeByKey: function (myArray, key, itemToRepositionKeyValue, itemBeforeToRepositionKeyValue) {

            //Récupérer les index des 2 éléments
            let itemToRepositionIndex = this.getIndexByKey(myArray, key, itemToRepositionKeyValue);
            let itemBeforeToRepositionIndex = this.getIndexByKey(myArray, key, itemBeforeToRepositionKeyValue);
            //repositionner
            myArray.splice(itemBeforeToRepositionIndex, 0, myArray.splice(itemToRepositionIndex, 1)[0]);
            return;
        },

        //Repositionner un élément après un autre grace aux index des 2 éléments
        repositionItemAfterByIndex: function (myArray, itemToRepositionIndex, itemAfterToRepositionIndex) {
            myArray.splice(itemAfterToRepositionIndex + 1, 0, myArray.splice(itemToRepositionIndex, 1)[0]);
            return;
        },
        //Repositionner un élément après un autre grace aux valeurs de la propriété "Key" des 2 éléments passée en paramètre
        repositionItemAfterByKey: function (myArray, key, itemToRepositionKeyValue, itemAfterToRepositionKeyValue) {

            //Récupérer les index des 2 éléments
            let itemToRepositionIndex = this.getIndexByKey(myArray, key, itemToRepositionKeyValue);
            let itemAfterToRepositionIndex = this.getIndexByKey(myArray, key, itemAfterToRepositionKeyValue);
            //repositionner
            myArray.splice(itemAfterToRepositionIndex +1 , 0, myArray.splice(itemToRepositionIndex, 1)[0]);
            return;
        },

        //Retourne l'index d'un élément d'un tableau depuis la valeur de la propriété key
        getIndexByKey: function (myArray, key, keyValue) {
            return myArray.findIndex(el => el[key] == keyValue);
        },

        //Permet de retrouner un objet dans un tableau depuis la clé primaire (propriété key de l'objet dans le tableau).
        //myArray: tableau dans lequel rechercher l'élément ,
        //key: propriété representant la clé primaire, peut etre une propriété imbriquée dans un sous objet en utilisant ".". Exemple objet.prop1.sousProp2
        //keyValue: valeur de la clé primaire du tableau
        findByKey: function (myArray, key, keyValue) {

            
            var item = myArray.find(function (el) {

                
                //Vérifier si c'est une propriété imbriquée
                if (key.indexOf(".") > -1) {
                    let propObj = el;
                    let propArray = key.split(".");

                    if (propArray) {
                        propArray.forEach(function (it) {                            
                            if (propObj != null) propObj = propObj[it];
                        });

                        return propObj == keyValue;
                    } else {
                        return false;
                    }

                } else {
                    return el[key] == keyValue;
                }
                
            });

            //Retourner l'élément
            return item;
        },

        //Permet de rechercher et retourner un item dans une struture hierarchique tabulaire ou les enfants sont inclus dans les propriétés dont les noms sont contenues dans le tableau childPropertiesArray
        findRecursiveByKey: function (myArray, key, keyValue, childPropertiesArray) {

            for (let item of myArray) {
                //Vérifier si c'est une propriété imbriquée
                if (key.indexOf(".") > -1) {
                    let propObj = item;
                    let propArray = key.split(".");

                    if (propArray) {
                        propArray.forEach(function (it) {
                            if (propObj != null) propObj = propObj[it];
                        });

                        if (propObj == keyValue) return item;
                    } 

                } else {
                    //Retourner le bon objet si il est trouvé
                    if (item[key] == keyValue) return item ;
                }

                //Parcourir les enfants et retourner le bon objet si il est trouvé
                for (let childProperty of childPropertiesArray) {
                    if (item[childProperty]) {
                        let it = iamShared.arrays.findRecursiveByKey(item[childProperty], key, keyValue, childPropertiesArray);
                        if (it) return it;
                    }
                }
            }

            return null;

        },

        //Retourne le dernier élément dont la propriété "propertyName" a pour valeur "propertyValue"
        findLastItemByPropertyName: function (myArray, propertyName, propertyValue) {
            let selected = this.filterByItemProperty(myArray, propertyName, propertyValue);
            if (selected && selected.length >0) {
                return selected[(selected.length - 1)];
            } else {
                return null;
            }
        },

        //Retourne les valeurs distinctes d'une colonne (propriété de chaque item) contenu dans un tableau
        getDistinctPropertyValue: function (myArray, propertyName) {
            return [... new Set(myArray.map(function (item) {
                return item[propertyName];
            }))];
        },

        //Permet de retrouner la valeur d'une propriété dont le nom est passé pour un objet dans un tableau depuis la clé primaire (propriété key de l'objet dans le tableau).
        //myArray: tableau dans lequel rechercher l'élément , key: propriété representant la clé primaire, keyValue : valeur de la clé primaire du tableau
        getPropertyValueByKeyAndPropertyName: function (myArray, key, keyValue, propertyName) {

            var item = myArray.find(function (el) {
                return el[key] == keyValue;
            });

            if (item) {
                //Retourner la propriété de l'objet
                return item[propertyName];
            } else {
                return null;
            }

        },

        //permet de mettre à jour un objet contenu dans un tableau a partir des valeurs des propriété de l'objet updatePropertiesObject passé en paramètre
        //myArray: tableau contenant l'objet a mettre a jour, keyName: nom de la propriété utilisée comme identifiant des objets, keyValue: valeur de l'identifiant de l'objet recherché, updatePropertiesObject:objet contenant les valeurs a attribuer.
        //addUpdatePropertiesObjectIfNotExist: si true et que aucun élément ne possède la valeur keyValue pour la propriété keyName alors l'objet updatePropertiesObject est ajouté au tableau myArray
        updatePropertiesByKey: function (myArray, keyName, keyValue, updatePropertiesObject, addUpdatePropertiesObjectIfNotExist =false) {
            //sortir si aucune propriété n'est à mettre a jour
            if (!updatePropertiesObject) return;

            //retrouver l'objet dans le tableau dont l'id est keyValue
            let obj = myArray.find(f => f[keyName] == keyValue);
            
            //si l'objet existe alors mettre à jour les propriétés concernées
            if (obj) {
                Object.keys(updatePropertiesObject).forEach(function (key) {
                    obj[key] = updatePropertiesObject[key];
                });
            } else {
                if (addUpdatePropertiesObjectIfNotExist) myArray.push(updatePropertiesObject);
            }
                
        },

        //permet de mettre à jour les propriétés de tous les objets contenu dans un tableau a partir dont la propriété  valeurs des propriété searchPropertyName 
        // a la valeur searchPropertyValue gace à l'objet updatePropertiesObject passé en paramètre
        //myArray: tableau contenant les objets à mettre a jour, searchPropertyName: nom de la propriété utilisée pour retrouver les objets à modifier, searchPropertyValue: valeur de la propriété recherché dans les objets, updatePropertiesObject:objet contenant les nouvelles valeurs a attribuer.
        updateItemsPropertiesByPropertyName: function (myArray, searchPropertyName, searchPropertyValue, updatePropertiesObject) {
            //sortir si aucune propriété n'est à mettre a jour
            if (!updatePropertiesObject) return;

            //retrouver l'objet dans le tableau dont l'id est keyValue
            let arr = myArray.filter(f => f[searchPropertyName] == searchPropertyValue);
            //si l'objet existe alors mettre à jour les propriétés concernées
            if (arr)
                arr.forEach(function (item) {
                    Object.keys(updatePropertiesObject).forEach(function (key) {
                        item[key] = updatePropertiesObject[key];
                    });
                });                
        },

        //Permet de supprimer un objet dans un tableau depuis la clé primaire du tableau
        //myArray: tableau dans lequel supprimer l'élément , key: propriété representant la clé primaire, keyValue : valeur de la clé primaire du tableau
        deleteByKey: function (myArray, key, keyValue, oneOnly) {

            var deleted = false;

            for (var i = myArray.length - 1; i > -1; i--) {
                if (myArray[i][key] == keyValue) {
                    //supprimer l'élément et sortir de la boucle
                    myArray.splice(i, 1);
                    //Si on ne doit que supprimer le premier alors sortir
                    if (oneOnly) return true;

                    deleted = true;
                }
            }

            return deleted;
        },

        //Permet de supprimer un objet dans un tableau depuis l'objet lui même
        //array: tableau dans lequel supprimer l'élément , element: l'objet/valeur contenu dans le tableau
        deleteByElement: function (array, element) {
            const index = array.indexOf(element);

            if (index !== -1) {
                array.splice(index, 1);
            }
        },

        //filtre un tableau pour retourner la liste de ces items dont la propriété "propertyName" a la valeur "propertyValue"
        filterByItemProperty: function (myArray, propertyName, propertyValue) {
            return myArray.filter(function (item) { return item[propertyName] == propertyValue; });
        },

        //permet de filtrer suivant plusieur propriétés contenues dans l'objet passé en paramètre
        filterByItemProperties: function (myArray, keyValuePairsFiltrerObject) {

            let resArray = [];

            //parcourir les éléments du tableau
            myArray.forEach(function (item) {
                let exist = true;

                //pour chaque élément parcourir les propriété à controler pour le filtre
                Object.keys(keyValuePairsFiltrerObject).forEach(function (key) {
                    if (keyValuePairsFiltrerObject[key] != item[key]) {
                        //Si une propriété n'a pas la même valeur que l'objet de fitre
                        exist = false;
                    }
                });

                if (exist) resArray.push(item);

            });

            //retourner le tableau filtré
            return resArray
        },

        //permet de retourner le nombre d'élément dans le tablau en appliquant un filter sur la "propertyName" de valeur "propertyValue"
        getCountFilterByItemProperty: function (myArray, propertyName, propertyValue) {
            let filterArray = this.filterByItemProperty(myArray, propertyName, propertyValue);

            if (!filterArray) return 0;

            return filterArray.length;
        },

        //permet de retourner le nombre d'élément dans le tablau en filtrant plusieurs propriétés depuis les propriétés de l'objet passé en paramètre
        getCountFilterByItemProperties: function (myArray, keyValuePairsFiltrerObject) {
            let filterArray = this.filterByItemProperties(myArray, keyValuePairsFiltrerObject);

            if (!filterArray) return 0;

            return filterArray.length;
        },

        //Ajoute le contenu de tableau2 au tableau1. si creer_nouveau_tableau==true alors retourne un nouveau tableau qui est la fusion des tableau1 et 2 tout en les laissant inchangés tous les 2.
        concat: function (tableau1, tableau2, creer_nouveau_tableau) {

            if (creer_nouveau_tableau) {
                //retourner un nouveau tableau qui est la fusion des tableau1 et 2 tout en les laissant inchangés tous les 2
                return tableau1.concat(tableau2);
            } else {
                //Ajouter le contenu du tableau2 au tableau1 et retourner le tableau1 ainsi modifié
                tableau1.push.apply(tableau1, tableau2);
                return tableau1;
            }
        },

         //Permet de repositionner un élément dans un tableau depuis son ancien index à sa nouvelle position (nouvelle index)
        repositionItem: function (myArray, oldIndex, newIndex) {

            if (newIndex >= myArray.length) {
                newIndex = myArray.length - 1
            }

            if (oldIndex = newIndex) return;

            myArray.splice(newIndex, 0, myArray.splice(oldIndex, 1)[0]);
            return myArray;
        },

        //Permet de repositionner un élément dans un tableau depuis son ancien index à sa nouvelle position (nouvelle index) 
        //en renumérotant la valeur de OrderNumberPropertyName pour les objets impactés uniquement
        repositionItemWithOrderNumberProperty: function (myArray, oldIndex, newIndex, OrderNumberPropertyName, firstElementPositionNumber = 1, step = 1) {


            if (newIndex >= myArray.length) {
                newIndex = myArray.length - 1
            }

            if (oldIndex = newIndex) return;

            myArray.splice(newIndex, 0, myArray.splice(oldIndex, 1)[0]);

            if (oldIndex > newIndex) {
                for (var i = newIndex; i <= oldIndex; i += step) {
                    myArray[i][OrderNumberPropertyName] = i + firstElementPositionNumber;
                }
            } else {
                for (var i = oldIndex; i <= newIndex; i += step) {
                    myArray[i][OrderNumberPropertyName] = i + firstElementPositionNumber;
                }
            }

            return myArray;
        }
    },


	//management des icones de font Awesome -------------------------------------------------------------------------------------------------------------------
	fontAwesome: {
		selectedItem: null,
		popupSelector: null,
		popupCallBackFunction : null,
		iconsArray: null,

		//Créer un popup de selection d'icons fontAwesome
		createFontAwesomePopupSelector(app, callBackFunction, typeNameFilter = "solid") {

			var that = this;
			that.popupCallBackFunction = callBackFunction;

			//Si le selector a déjà été créé alors l'afficher et sortir
			if (that.popupSelector) {
				that.popupSelector.show();
				return;
			}

			if (!that.iconsArray) that.iconsArray = that.createIconsArray(false, typeNameFilter);

			//Vérifier si les styles nécessaire a la création des icones fontAwesome existent dans la page en cours et l'injecter dans la page sinon
			if ($("#iamFontAwesomeListStylesContainer").length == 0) $(document.body).prepend(that.listHtmlTemplateStyle);

			//Ajouter l'évènement du click sur chaque icone
			$(document).on("click", "div.fa-card-items", function (e) {

				var selectedName = $(this).data("name");
				that.selectedItem = iamShared.arrays.findByKey(that.iconsArray, "name", selectedName);

				//Si la selection existe et une fonction callback a été passée alors exécuter la fonction callback avec comme argument la sélection
				if (that.selectedItem && that.popupCallBackFunction) {
					that.popupCallBackFunction(that.selectedItem);
				}

				//Masquer le popup
				that.popupSelector.hide();
			});

			var html = '<div id="iamFontAwesomeListContainer" class="iamFontAwesomeListContainerClass">{content}</div>';

			html = html.replace("{content}", iamShared.ui.buildHtmlTemplate(null, that.listHtmlTemplate, that.iconsArray, true));

			console.log(html);

			//créer le popup
			//popupHtmlId = "iamPopup", app, title, titleLocalizationName, contentHtml, replaceContent, popupOptions, toolbarItems, createDefaultToolbarItems = false, recreateIfExists = false, show = true, resizeEnabled = true, fullScreen = false, showCloseButton =true, autoHeight =false,  height=600, width=800, maxHeight
			that.popupSelector = iamShared.ui.simplePopupCreate("iamFontAwesomeListPopup", app, null, "SelectIcon", html, false,null,null,false,false,true,true,false,true);
		},

		//Template (modèle) HTML utilisé pour la création d'une carte de visualisation des icones fontAwesome
        listHtmlTemplate: `
		<div class="fa-card-items" data-name="{name}" data-displayName="{displayName}" data-type="{type}">
			<div class="fa-card-icon-wrapper">
			  <i class="{name}"></i>
			</div>
			<div class="fa-card-item-name">
			  <p>{displayName}</p>
			</div>
		  </div>
        `,

		//balise de Style utilisé pour la réalisatoin des cartes pour la selection ou visualisation des icones fontAwesome
		listHtmlTemplateStyle: `
			<style id="iamFontAwesomeListStylesContainer">
				
			.iamFontAwesomeListContainerClass {			  
				
				display: flex;
				flex-flow: row wrap;
				gap: 3px;

				justify-content:space-evenly;
				font-family: 'Raleway', sans-serif; 
			}

			.fa-card-items {
				border-radius: 5px;
				flex: 1 1 128px;
				width: 128px;				
				align-items: center;
				justify-content: center;				
				cursor: pointer;
				border: 1px dotted black;
				transition: all 0.6s;
			}
			.fa-card-icon-wrapper, .fa-card-item-name {			  
			  align-items: center;
			  justify-content: center;
			}

			
		  </style>
        `,

		//Permet de créer un tableau contenant le nom uniquement des icones (getNamesOnly=true) ou des objets avec le détail des informations sur l'icone 
		createIconsArray: function (getNamesOnly=false, typeNameFilter) {

			var iconsList = [];
			var that = this;

			//Parcourir chaque propriété de iconsObjet pour générer le tableau de la liste des icones
			Object.keys(this.iconsObject).forEach(function (key) {
				//découper la valeur par espace
				let decoup = that.iconsObject[key].split(" ");//this.iconsObject[key] est de la forme: "&#xf63f; Zhihu brands"
				let type = decoup[decoup.length - 1];
				//prendre le premier élément en supprimant le dernier caractère de la chaine
				let value = decoup[0].slice(0, -1);

				if (!typeNameFilter) {
					//Ajouter au tableau des icones
					if (getNamesOnly) {
						//Ajouter le nom uniquement de l'icone
						iconsList.push(key);
					} else {
						//Ajouter un objet détaillé des informations sur l'icone
						iconsList.push({ name: key, displayName: key.slice(7).replaceAll("-"," "), type: type, value: value, html: '<i class="' + key + '"></i>'});
					}
				} else {

					if (typeNameFilter.toLowerCase() == type.toLowerCase()) {
						//Ajouter au tableau des icones
						if (getNamesOnly) {
							//Ajouter le nom uniquement de l'icone
							iconsList.push(key);
						} else {
							//Ajouter un objet détaillé des informations sur l'icone
							iconsList.push({ name: key, displayName: key.slice(7).replaceAll("-", " "), type: type, value: value, html: '<i class="' + key + '"></i>' });
						}
					}
                }
				
				
			});

			//console.log(iconsList);

			//retourner le tableau
			return iconsList;
		},

		//Permet de créer un liste flex filtrable de l'ensemble des icones disponibles dans la banque d'images font awesome
		createFlexList: function (containerId = "iamFontAwesomeListContainer", htmlTemplate) {

			var iconsList = this.createIconsArray(false);

			//Vérifier si les styles nécessaire a la création des icones fontAwesome existent dans la page en cours et l'injecter dans la page sinon
			if ($("#iamFontAwesomeListStylesContainer").length == 0) $(document.body).prepend(this.listHtmlTemplateStyle);

			//Créer le div du container s'il n'existe pas
			if ($("#" + containerId).length == 0) $(document.body).append('<div id="' + containerId + '" class="iamFontAwesomeListContainerClass"></div>');

			//Prendre le html template de base si aucun template n'est fourni
			if (!htmlTemplate) htmlTemplate = this.listHtmlTemplate ;

			//intégrer le template dans la page
			iamShared.ui.buildHtmlTemplate(containerId, htmlTemplate, iconsList, true);			
			
		},

        iconsObject: {
			"fab fa-zhihu": "&#xf63f; Zhihu brands",
			"fab fa-youtube-square": "&#xf431; YouTube Square brands",
			"fab fa-youtube": "&#xf167; YouTube brands",
			"fab fa-yoast": "&#xf2b1; Yoast brands",
			"fas fa-yin-yang": "&#xf6ad; Yin Yang solid",
			"far fa-yin-yang": "&#xf6ad; Yin Yang regular",
			"fal fa-yin-yang": "&#xf6ad; Yin Yang light",
			"fab fa-yin-yang": "&#xf6ad; Yin Yang duotone",
			"fas fa-yen-sign": "&#xf157; Yen Sign solid",
			"far fa-yen-sign": "&#xf157; Yen Sign regular",
			"fal fa-yen-sign": "&#xf157; Yen Sign light",
			"fab fa-yen-sign": "&#xf157; Yen Sign duotone",
			"fab fa-yelp": "&#xf1e9; Yelp brands",
			"fab fa-yarn": "&#xf7e3; Yarn brands",
			"fab fa-yandex-international": "&#xf414; Yandex International brands",
			"fab fa-yandex": "&#xf413; Yandex brands",
			"fab fa-yammer": "&#xf840; Yammer brands",
			"fab fa-yahoo": "&#xf19e; Yahoo Logo brands",
			"fab fa-y-combinator": "&#xf23b; Y Combinator brands",
			"fab fa-xing-square": "&#xf169; Xing Square brands",
			"fab fa-xing": "&#xf168; Xing brands",
			"fab fa-xbox": "&#xf412; Xbox brands",
			"fas fa-x-ray": "&#xf497; X-Ray solid",
			"far fa-x-ray": "&#xf497; X-Ray regular",
			"fal fa-x-ray": "&#xf497; X-Ray light",
			"fab fa-x-ray": "&#xf497; X-Ray duotone",
			"fas fa-wrench": "&#xf0ad; Wrench solid",
			"far fa-wrench": "&#xf0ad; Wrench regular",
			"fal fa-wrench": "&#xf0ad; Wrench light",
			"fab fa-wrench": "&#xf0ad; Wrench duotone",
			"fas fa-wreath": "&#xf7e2; Wreath solid",
			"far fa-wreath": "&#xf7e2; Wreath regular",
			"fal fa-wreath": "&#xf7e2; Wreath light",
			"fab fa-wreath": "&#xf7e2; Wreath duotone",
			"fab fa-wpressr": "&#xf3e4; wpressr brands",
			"fab fa-wpforms": "&#xf298; WPForms brands",
			"fab fa-wpexplorer": "&#xf2de; WPExplorer brands",
			"fab fa-wpbeginner": "&#xf297; WPBeginner brands",
			"fab fa-wordpress-simple": "&#xf411; Wordpress Simple brands",
			"fab fa-wordpress": "&#xf19a; WordPress Logo brands",
			"fas fa-won-sign": "&#xf159; Won Sign solid",
			"far fa-won-sign": "&#xf159; Won Sign regular",
			"fal fa-won-sign": "&#xf159; Won Sign light",
			"fab fa-won-sign": "&#xf159; Won Sign duotone",
			"fab fa-wolf-pack-battalion": "&#xf514; Wolf Pack Battalion brands",
			"fab fa-wizards-of-the-coast": "&#xf730; Wizards of the Coast brands",
			"fab fa-wix": "&#xf5cf; Wix brands",
			"fas fa-wine-glass-alt": "&#xf5ce; Alternate Wine Glas solid",
			"far fa-wine-glass-alt": "&#xf5ce; Alternate Wine Glas regular",
			"fal fa-wine-glass-alt": "&#xf5ce; Alternate Wine Glas light",
			"fab fa-wine-glass-alt": "&#xf5ce; Alternate Wine Glas duotone",
			"fas fa-wine-glass": "&#xf4e3; Wine Glass solid",
			"far fa-wine-glass": "&#xf4e3; Wine Glass regular",
			"fal fa-wine-glass": "&#xf4e3; Wine Glass light",
			"fab fa-wine-glass": "&#xf4e3; Wine Glass duotone",
			"fas fa-wine-bottle": "&#xf72f; Wine Bottle solid",
			"far fa-wine-bottle": "&#xf72f; Wine Bottle regular",
			"fal fa-wine-bottle": "&#xf72f; Wine Bottle light",
			"fab fa-wine-bottle": "&#xf72f; Wine Bottle duotone",
			"fas fa-windsock": "&#xf777; Windsock solid",
			"far fa-windsock": "&#xf777; Windsock regular",
			"fal fa-windsock": "&#xf777; Windsock light",
			"fab fa-windsock": "&#xf777; Windsock duotone",
			"fab fa-windows": "&#xf17a; Windows brands",
			"fas fa-window-restore": "&#xf2d2; Window Restore solid",
			"far fa-window-restore": "&#xf2d2; Window Restore regular",
			"fal fa-window-restore": "&#xf2d2; Window Restore light",
			"fab fa-window-restore": "&#xf2d2; Window Restore duotone",
			"fas fa-window-minimize": "&#xf2d1; Window Minimize solid",
			"far fa-window-minimize": "&#xf2d1; Window Minimize regular",
			"fal fa-window-minimize": "&#xf2d1; Window Minimize light",
			"fab fa-window-minimize": "&#xf2d1; Window Minimize duotone",
			"fas fa-window-maximize": "&#xf2d0; Window Maximize solid",
			"far fa-window-maximize": "&#xf2d0; Window Maximize regular",
			"fal fa-window-maximize": "&#xf2d0; Window Maximize light",
			"fab fa-window-maximize": "&#xf2d0; Window Maximize duotone",
			"fas fa-window-close": "&#xf410; Window Close solid",
			"far fa-window-close": "&#xf410; Window Close regular",
			"fal fa-window-close": "&#xf410; Window Close light",
			"fab fa-window-close": "&#xf410; Window Close duotone",
			"fas fa-window-alt": "&#xf40f; Alternate Window solid",
			"far fa-window-alt": "&#xf40f; Alternate Window regular",
			"fal fa-window-alt": "&#xf40f; Alternate Window light",
			"fab fa-window-alt": "&#xf40f; Alternate Window duotone",
			"fas fa-window": "&#xf40e; Window solid",
			"far fa-window": "&#xf40e; Window regular",
			"fal fa-window": "&#xf40e; Window light",
			"fab fa-window": "&#xf40e; Window duotone",
			"fas fa-wind-warning": "&#xf776; Wind Warning solid",
			"far fa-wind-warning": "&#xf776; Wind Warning regular",
			"fal fa-wind-warning": "&#xf776; Wind Warning light",
			"fab fa-wind-warning": "&#xf776; Wind Warning duotone",
			"fas fa-wind-turbine": "&#xf89b; Wind Turbine solid",
			"far fa-wind-turbine": "&#xf89b; Wind Turbine regular",
			"fal fa-wind-turbine": "&#xf89b; Wind Turbine light",
			"fab fa-wind-turbine": "&#xf89b; Wind Turbine duotone",
			"fas fa-wind": "&#xf72e; Wind solid",
			"far fa-wind": "&#xf72e; Wind regular",
			"fal fa-wind": "&#xf72e; Wind light",
			"fab fa-wind": "&#xf72e; Wind duotone",
			"fab fa-wikipedia-w": "&#xf266; Wikipedia W brands",
			"fas fa-wifi-slash": "&#xf6ac; Wifi Slash solid",
			"far fa-wifi-slash": "&#xf6ac; Wifi Slash regular",
			"fal fa-wifi-slash": "&#xf6ac; Wifi Slash light",
			"fab fa-wifi-slash": "&#xf6ac; Wifi Slash duotone",
			"fas fa-wifi-2": "&#xf6ab; Wifi 2 solid",
			"far fa-wifi-2": "&#xf6ab; Wifi 2 regular",
			"fal fa-wifi-2": "&#xf6ab; Wifi 2 light",
			"fab fa-wifi-2": "&#xf6ab; Wifi 2 duotone",
			"fas fa-wifi-1": "&#xf6aa; Wifi 1 solid",
			"far fa-wifi-1": "&#xf6aa; Wifi 1 regular",
			"fal fa-wifi-1": "&#xf6aa; Wifi 1 light",
			"fab fa-wifi-1": "&#xf6aa; Wifi 1 duotone",
			"fas fa-wifi": "&#xf1eb; WiFi solid",
			"far fa-wifi": "&#xf1eb; WiFi regular",
			"fal fa-wifi": "&#xf1eb; WiFi light",
			"fab fa-wifi": "&#xf1eb; WiFi duotone",
			"fab fa-whmcs": "&#xf40d; WHMCS brands",
			"fas fa-whistle": "&#xf460; Whistle solid",
			"far fa-whistle": "&#xf460; Whistle regular",
			"fal fa-whistle": "&#xf460; Whistle light",
			"fab fa-whistle": "&#xf460; Whistle duotone",
			"fas fa-wheelchair": "&#xf193; Wheelchair solid",
			"far fa-wheelchair": "&#xf193; Wheelchair regular",
			"fal fa-wheelchair": "&#xf193; Wheelchair light",
			"fab fa-wheelchair": "&#xf193; Wheelchair duotone",
			"fas fa-wheat": "&#xf72d; Wheat solid",
			"far fa-wheat": "&#xf72d; Wheat regular",
			"fal fa-wheat": "&#xf72d; Wheat light",
			"fab fa-wheat": "&#xf72d; Wheat duotone",
			"fab fa-whatsapp-square": "&#xf40c; What's App Square brands",
			"fab fa-whatsapp": "&#xf232; What's App brands",
			"fas fa-whale": "&#xf72c; Whale solid",
			"far fa-whale": "&#xf72c; Whale regular",
			"fal fa-whale": "&#xf72c; Whale light",
			"fab fa-whale": "&#xf72c; Whale duotone",
			"fab fa-weixin": "&#xf1d7; Weixin (WeChat) brands",
			"fas fa-weight-hanging": "&#xf5cd; Hanging Weight solid",
			"far fa-weight-hanging": "&#xf5cd; Hanging Weight regular",
			"fal fa-weight-hanging": "&#xf5cd; Hanging Weight light",
			"fab fa-weight-hanging": "&#xf5cd; Hanging Weight duotone",
			"fas fa-weight": "&#xf496; Weight solid",
			"far fa-weight": "&#xf496; Weight regular",
			"fal fa-weight": "&#xf496; Weight light",
			"fab fa-weight": "&#xf496; Weight duotone",
			"fab fa-weibo": "&#xf18a; Weibo brands",
			"fab fa-weebly": "&#xf5cc; Weebly brands",
			"fas fa-webcam-slash": "&#xf833; Webcam Slash solid",
			"far fa-webcam-slash": "&#xf833; Webcam Slash regular",
			"fal fa-webcam-slash": "&#xf833; Webcam Slash light",
			"fab fa-webcam-slash": "&#xf833; Webcam Slash duotone",
			"fas fa-webcam": "&#xf832; Webcam solid",
			"far fa-webcam": "&#xf832; Webcam regular",
			"fal fa-webcam": "&#xf832; Webcam light",
			"fab fa-webcam": "&#xf832; Webcam duotone",
			"fab fa-waze": "&#xf83f; Waze brands",
			"fas fa-waveform-path": "&#xf8f2; Waveform Path solid",
			"far fa-waveform-path": "&#xf8f2; Waveform Path regular",
			"fal fa-waveform-path": "&#xf8f2; Waveform Path light",
			"fab fa-waveform-path": "&#xf8f2; Waveform Path duotone",
			"fas fa-waveform": "&#xf8f1; Waveform solid",
			"far fa-waveform": "&#xf8f1; Waveform regular",
			"fal fa-waveform": "&#xf8f1; Waveform light",
			"fab fa-waveform": "&#xf8f1; Waveform duotone",
			"fas fa-wave-triangle": "&#xf89a; Triangle Wave solid",
			"far fa-wave-triangle": "&#xf89a; Triangle Wave regular",
			"fal fa-wave-triangle": "&#xf89a; Triangle Wave light",
			"fab fa-wave-triangle": "&#xf89a; Triangle Wave duotone",
			"fal fa-wave-square": "&#xf83e; Square Wave light",
			"far fa-wave-square": "&#xf83e; Square Wave regular",
			"fas fa-wave-square": "&#xf83e; Square Wave solid",
			"fab fa-wave-square": "&#xf83e; Square Wave duotone",
			"fas fa-wave-sine": "&#xf899; Sine Wave solid",
			"far fa-wave-sine": "&#xf899; Sine Wave regular",
			"fal fa-wave-sine": "&#xf899; Sine Wave light",
			"fab fa-wave-sine": "&#xf899; Sine Wave duotone",
			"fas fa-water-rise": "&#xf775; Rising Water Level solid",
			"far fa-water-rise": "&#xf775; Rising Water Level regular",
			"fal fa-water-rise": "&#xf775; Rising Water Level light",
			"fab fa-water-rise": "&#xf775; Rising Water Level duotone",
			"fas fa-water-lower": "&#xf774; Lower Water Level solid",
			"far fa-water-lower": "&#xf774; Lower Water Level regular",
			"fal fa-water-lower": "&#xf774; Lower Water Level light",
			"fab fa-water-lower": "&#xf774; Lower Water Level duotone",
			"fas fa-water": "&#xf773; Water solid",
			"far fa-water": "&#xf773; Water regular",
			"fal fa-water": "&#xf773; Water light",
			"fab fa-water": "&#xf773; Water duotone",
			"fas fa-watch-fitness": "&#xf63e; Watch Fitness solid",
			"far fa-watch-fitness": "&#xf63e; Watch Fitness regular",
			"fal fa-watch-fitness": "&#xf63e; Watch Fitness light",
			"fab fa-watch-fitness": "&#xf63e; Watch Fitness duotone",
			"fas fa-watch-calculator": "&#xf8f0; Calculator Watch solid",
			"far fa-watch-calculator": "&#xf8f0; Calculator Watch regular",
			"fal fa-watch-calculator": "&#xf8f0; Calculator Watch light",
			"fab fa-watch-calculator": "&#xf8f0; Calculator Watch duotone",
			"fas fa-watch": "&#xf2e1; Watch solid",
			"far fa-watch": "&#xf2e1; Watch regular",
			"fal fa-watch": "&#xf2e1; Watch light",
			"fab fa-watch": "&#xf2e1; Watch duotone",
			"fas fa-washer": "&#xf898; Washer solid",
			"far fa-washer": "&#xf898; Washer regular",
			"fal fa-washer": "&#xf898; Washer light",
			"fab fa-washer": "&#xf898; Washer duotone",
			"fas fa-warehouse-alt": "&#xf495; Alternate Warehouse solid",
			"far fa-warehouse-alt": "&#xf495; Alternate Warehouse regular",
			"fal fa-warehouse-alt": "&#xf495; Alternate Warehouse light",
			"fab fa-warehouse-alt": "&#xf495; Alternate Warehouse duotone",
			"fas fa-warehouse": "&#xf494; Warehouse solid",
			"far fa-warehouse": "&#xf494; Warehouse regular",
			"fal fa-warehouse": "&#xf494; Warehouse light",
			"fab fa-warehouse": "&#xf494; Warehouse duotone",
			"fas fa-wand-magic": "&#xf72b; Wand Magic solid",
			"far fa-wand-magic": "&#xf72b; Wand Magic regular",
			"fal fa-wand-magic": "&#xf72b; Wand Magic light",
			"fab fa-wand-magic": "&#xf72b; Wand Magic duotone",
			"fas fa-wand": "&#xf72a; Wand solid",
			"far fa-wand": "&#xf72a; Wand regular",
			"fal fa-wand": "&#xf72a; Wand light",
			"fab fa-wand": "&#xf72a; Wand duotone",
			"fas fa-wallet": "&#xf555; Wallet solid",
			"far fa-wallet": "&#xf555; Wallet regular",
			"fal fa-wallet": "&#xf555; Wallet light",
			"fab fa-wallet": "&#xf555; Wallet duotone",
			"fas fa-walking": "&#xf554; Walking solid",
			"far fa-walking": "&#xf554; Walking regular",
			"fal fa-walking": "&#xf554; Walking light",
			"fab fa-walking": "&#xf554; Walking duotone",
			"fas fa-walkie-talkie": "&#xf8ef; Walkie Talkie solid",
			"far fa-walkie-talkie": "&#xf8ef; Walkie Talkie regular",
			"fal fa-walkie-talkie": "&#xf8ef; Walkie Talkie light",
			"fab fa-walkie-talkie": "&#xf8ef; Walkie Talkie duotone",
			"fas fa-walker": "&#xf831; Walker solid",
			"far fa-walker": "&#xf831; Walker regular",
			"fal fa-walker": "&#xf831; Walker light",
			"fab fa-walker": "&#xf831; Walker duotone",
			"fal fa-wagon-covered": "&#xf8ee; Covered Wagon light",
			"far fa-wagon-covered": "&#xf8ee; Covered Wagon regular",
			"fas fa-wagon-covered": "&#xf8ee; Covered Wagon solid",
			"fab fa-wagon-covered": "&#xf8ee; Covered Wagon duotone",
			"fab fa-vuejs": "&#xf41f; Vue.js brands",
			"fas fa-vr-cardboard": "&#xf729; Cardboard VR solid",
			"far fa-vr-cardboard": "&#xf729; Cardboard VR regular",
			"fal fa-vr-cardboard": "&#xf729; Cardboard VR light",
			"fab fa-vr-cardboard": "&#xf729; Cardboard VR duotone",
			"fas fa-vote-yea": "&#xf772; Vote Yea solid",
			"far fa-vote-yea": "&#xf772; Vote Yea regular",
			"fal fa-vote-yea": "&#xf772; Vote Yea light",
			"fab fa-vote-yea": "&#xf772; Vote Yea duotone",
			"fas fa-vote-nay": "&#xf771; Vote Nay solid",
			"far fa-vote-nay": "&#xf771; Vote Nay regular",
			"fal fa-vote-nay": "&#xf771; Vote Nay light",
			"fab fa-vote-nay": "&#xf771; Vote Nay duotone",
			"fas fa-volume-up": "&#xf028; Volume Up solid",
			"far fa-volume-up": "&#xf028; Volume Up regular",
			"fal fa-volume-up": "&#xf028; Volume Up light",
			"fab fa-volume-up": "&#xf028; Volume Up duotone",
			"fas fa-volume-slash": "&#xf2e2; Volume Slash solid",
			"far fa-volume-slash": "&#xf2e2; Volume Slash regular",
			"fal fa-volume-slash": "&#xf2e2; Volume Slash light",
			"fab fa-volume-slash": "&#xf2e2; Volume Slash duotone",
			"fas fa-volume-off": "&#xf026; Volume Off solid",
			"far fa-volume-off": "&#xf026; Volume Off regular",
			"fal fa-volume-off": "&#xf026; Volume Off light",
			"fab fa-volume-off": "&#xf026; Volume Off duotone",
			"fas fa-volume-mute": "&#xf6a9; Volume Mute solid",
			"far fa-volume-mute": "&#xf6a9; Volume Mute regular",
			"fal fa-volume-mute": "&#xf6a9; Volume Mute light",
			"fab fa-volume-mute": "&#xf6a9; Volume Mute duotone",
			"fas fa-volume-down": "&#xf027; Volume Down solid",
			"far fa-volume-down": "&#xf027; Volume Down regular",
			"fal fa-volume-down": "&#xf027; Volume Down light",
			"fab fa-volume-down": "&#xf027; Volume Down duotone",
			"fas fa-volume": "&#xf6a8; Volume solid",
			"far fa-volume": "&#xf6a8; Volume regular",
			"fal fa-volume": "&#xf6a8; Volume light",
			"fab fa-volume": "&#xf6a8; Volume duotone",
			"fas fa-volleyball-ball": "&#xf45f; Volleyball Ball solid",
			"far fa-volleyball-ball": "&#xf45f; Volleyball Ball regular",
			"fal fa-volleyball-ball": "&#xf45f; Volleyball Ball light",
			"fab fa-volleyball-ball": "&#xf45f; Volleyball Ball duotone",
			"fas fa-volcano": "&#xf770; Volcano solid",
			"far fa-volcano": "&#xf770; Volcano regular",
			"fal fa-volcano": "&#xf770; Volcano light",
			"fab fa-volcano": "&#xf770; Volcano duotone",
			"fas fa-voicemail": "&#xf897; Voicemail solid",
			"far fa-voicemail": "&#xf897; Voicemail regular",
			"fal fa-voicemail": "&#xf897; Voicemail light",
			"fab fa-voicemail": "&#xf897; Voicemail duotone",
			"fab fa-vnv": "&#xf40b; VNV brands",
			"fab fa-vk": "&#xf189; VK brands",
			"fas fa-violin": "&#xf8ed; Violin solid",
			"far fa-violin": "&#xf8ed; Violin regular",
			"fal fa-violin": "&#xf8ed; Violin light",
			"fab fa-violin": "&#xf8ed; Violin duotone",
			"fab fa-vine": "&#xf1ca; Vine brands",
			"fab fa-vimeo-v": "&#xf27d; Vimeo brands",
			"fab fa-vimeo-square": "&#xf194; Vimeo Square brands",
			"fab fa-vimeo": "&#xf40a; Vimeo brands",
			"fas fa-vihara": "&#xf6a7; Vihara solid",
			"far fa-vihara": "&#xf6a7; Vihara regular",
			"fal fa-vihara": "&#xf6a7; Vihara light",
			"fab fa-vihara": "&#xf6a7; Vihara duotone",
			"fas fa-video-slash": "&#xf4e2; Video Slash solid",
			"far fa-video-slash": "&#xf4e2; Video Slash regular",
			"fal fa-video-slash": "&#xf4e2; Video Slash light",
			"fab fa-video-slash": "&#xf4e2; Video Slash duotone",
			"fas fa-video-plus": "&#xf4e1; Video Plus solid",
			"far fa-video-plus": "&#xf4e1; Video Plus regular",
			"fal fa-video-plus": "&#xf4e1; Video Plus light",
			"fab fa-video-plus": "&#xf4e1; Video Plus duotone",
			"fas fa-video": "&#xf03d; Video solid",
			"far fa-video": "&#xf03d; Video regular",
			"fal fa-video": "&#xf03d; Video light",
			"fab fa-video": "&#xf03d; Video duotone",
			"fab fa-viber": "&#xf409; Viber brands",
			"fas fa-vials": "&#xf493; Vials solid",
			"far fa-vials": "&#xf493; Vials regular",
			"fal fa-vials": "&#xf493; Vials light",
			"fab fa-vials": "&#xf493; Vials duotone",
			"fas fa-vial": "&#xf492; Vial solid",
			"far fa-vial": "&#xf492; Vial regular",
			"fal fa-vial": "&#xf492; Vial light",
			"fab fa-vial": "&#xf492; Vial duotone",
			"fab fa-viadeo-square": "&#xf2aa; Video Square brands",
			"fab fa-viadeo": "&#xf2a9; Video brands",
			"fab fa-viacoin": "&#xf237; Viacoin brands",
			"fas fa-vhs": "&#xf8ec; VHS solid",
			"far fa-vhs": "&#xf8ec; VHS regular",
			"fal fa-vhs": "&#xf8ec; VHS light",
			"fab fa-vhs": "&#xf8ec; VHS duotone",
			"fas fa-venus-mars": "&#xf228; Venus Mars solid",
			"far fa-venus-mars": "&#xf228; Venus Mars regular",
			"fal fa-venus-mars": "&#xf228; Venus Mars light",
			"fab fa-venus-mars": "&#xf228; Venus Mars duotone",
			"fas fa-venus-double": "&#xf226; Venus Double solid",
			"far fa-venus-double": "&#xf226; Venus Double regular",
			"fal fa-venus-double": "&#xf226; Venus Double light",
			"fab fa-venus-double": "&#xf226; Venus Double duotone",
			"fas fa-venus": "&#xf221; Venus solid",
			"far fa-venus": "&#xf221; Venus regular",
			"fal fa-venus": "&#xf221; Venus light",
			"fab fa-venus": "&#xf221; Venus duotone",
			"fas fa-vector-square": "&#xf5cb; Vector Square solid",
			"far fa-vector-square": "&#xf5cb; Vector Square regular",
			"fal fa-vector-square": "&#xf5cb; Vector Square light",
			"fab fa-vector-square": "&#xf5cb; Vector Square duotone",
			"fas fa-value-absolute": "&#xf6a6; Value Absolute solid",
			"far fa-value-absolute": "&#xf6a6; Value Absolute regular",
			"fal fa-value-absolute": "&#xf6a6; Value Absolute light",
			"fab fa-value-absolute": "&#xf6a6; Value Absolute duotone",
			"fab fa-vaadin": "&#xf408; Vaadin brands",
			"fas fa-utensils-alt": "&#xf2e6; Alternate Utensils solid",
			"far fa-utensils-alt": "&#xf2e6; Alternate Utensils regular",
			"fal fa-utensils-alt": "&#xf2e6; Alternate Utensils light",
			"fab fa-utensils-alt": "&#xf2e6; Alternate Utensils duotone",
			"fas fa-utensils": "&#xf2e7; Utensils solid",
			"far fa-utensils": "&#xf2e7; Utensils regular",
			"fal fa-utensils": "&#xf2e7; Utensils light",
			"fab fa-utensils": "&#xf2e7; Utensils duotone",
			"fas fa-utensil-spoon": "&#xf2e5; Utensil Spoon solid",
			"far fa-utensil-spoon": "&#xf2e5; Utensil Spoon regular",
			"fal fa-utensil-spoon": "&#xf2e5; Utensil Spoon light",
			"fab fa-utensil-spoon": "&#xf2e5; Utensil Spoon duotone",
			"fas fa-utensil-knife": "&#xf2e4; Utensil Knife solid",
			"far fa-utensil-knife": "&#xf2e4; Utensil Knife regular",
			"fal fa-utensil-knife": "&#xf2e4; Utensil Knife light",
			"fab fa-utensil-knife": "&#xf2e4; Utensil Knife duotone",
			"fas fa-utensil-fork": "&#xf2e3; Utensil Fork solid",
			"far fa-utensil-fork": "&#xf2e3; Utensil Fork regular",
			"fal fa-utensil-fork": "&#xf2e3; Utensil Fork light",
			"fab fa-utensil-fork": "&#xf2e3; Utensil Fork duotone",
			"fab fa-ussunnah": "&#xf407; us-Sunnah Foundation brands",
			"fab fa-usps": "&#xf7e1; United States Postal Service brands",
			"fas fa-users-medical": "&#xf830; Users with Medical Symbol solid",
			"far fa-users-medical": "&#xf830; Users with Medical Symbol regular",
			"fal fa-users-medical": "&#xf830; Users with Medical Symbol light",
			"fab fa-users-medical": "&#xf830; Users with Medical Symbol duotone",
			"fas fa-users-crown": "&#xf6a5; Users Crown solid",
			"far fa-users-crown": "&#xf6a5; Users Crown regular",
			"fal fa-users-crown": "&#xf6a5; Users Crown light",
			"fab fa-users-crown": "&#xf6a5; Users Crown duotone",
			"fas fa-users-cog": "&#xf509; Users Cog solid",
			"far fa-users-cog": "&#xf509; Users Cog regular",
			"fal fa-users-cog": "&#xf509; Users Cog light",
			"fab fa-users-cog": "&#xf509; Users Cog duotone",
			"fas fa-users-class": "&#xf63d; Users Class solid",
			"far fa-users-class": "&#xf63d; Users Class regular",
			"fal fa-users-class": "&#xf63d; Users Class light",
			"fab fa-users-class": "&#xf63d; Users Class duotone",
			"fas fa-users": "&#xf0c0; Users solid",
			"far fa-users": "&#xf0c0; Users regular",
			"fal fa-users": "&#xf0c0; Users light",
			"fab fa-users": "&#xf0c0; Users duotone",
			"fas fa-user-times": "&#xf235; Remove User solid",
			"far fa-user-times": "&#xf235; Remove User regular",
			"fal fa-user-times": "&#xf235; Remove User light",
			"fab fa-user-times": "&#xf235; Remove User duotone",
			"fas fa-user-tie": "&#xf508; User Tie solid",
			"far fa-user-tie": "&#xf508; User Tie regular",
			"fal fa-user-tie": "&#xf508; User Tie light",
			"fab fa-user-tie": "&#xf508; User Tie duotone",
			"fas fa-user-tag": "&#xf507; User Tag solid",
			"far fa-user-tag": "&#xf507; User Tag regular",
			"fal fa-user-tag": "&#xf507; User Tag light",
			"fab fa-user-tag": "&#xf507; User Tag duotone",
			"fas fa-user-slash": "&#xf506; User Slash solid",
			"far fa-user-slash": "&#xf506; User Slash regular",
			"fal fa-user-slash": "&#xf506; User Slash light",
			"fab fa-user-slash": "&#xf506; User Slash duotone",
			"fas fa-user-shield": "&#xf505; User Shield solid",
			"far fa-user-shield": "&#xf505; User Shield regular",
			"fal fa-user-shield": "&#xf505; User Shield light",
			"fab fa-user-shield": "&#xf505; User Shield duotone",
			"fas fa-user-secret": "&#xf21b; User Secret solid",
			"far fa-user-secret": "&#xf21b; User Secret regular",
			"fal fa-user-secret": "&#xf21b; User Secret light",
			"fab fa-user-secret": "&#xf21b; User Secret duotone",
			"fas fa-user-plus": "&#xf234; User Plus solid",
			"far fa-user-plus": "&#xf234; User Plus regular",
			"fal fa-user-plus": "&#xf234; User Plus light",
			"fab fa-user-plus": "&#xf234; User Plus duotone",
			"fas fa-user-nurse": "&#xf82f; Nurse solid",
			"far fa-user-nurse": "&#xf82f; Nurse regular",
			"fal fa-user-nurse": "&#xf82f; Nurse light",
			"fab fa-user-nurse": "&#xf82f; Nurse duotone",
			"fas fa-user-ninja": "&#xf504; User Ninja solid",
			"far fa-user-ninja": "&#xf504; User Ninja regular",
			"fal fa-user-ninja": "&#xf504; User Ninja light",
			"fab fa-user-ninja": "&#xf504; User Ninja duotone",
			"fas fa-user-music": "&#xf8eb; User Music solid",
			"far fa-user-music": "&#xf8eb; User Music regular",
			"fal fa-user-music": "&#xf8eb; User Music light",
			"fab fa-user-music": "&#xf8eb; User Music duotone",
			"fas fa-user-minus": "&#xf503; User Minus solid",
			"far fa-user-minus": "&#xf503; User Minus regular",
			"fal fa-user-minus": "&#xf503; User Minus light",
			"fab fa-user-minus": "&#xf503; User Minus duotone",
			"fas fa-user-md-chat": "&#xf82e; Chat with Doctor solid",
			"far fa-user-md-chat": "&#xf82e; Chat with Doctor regular",
			"fal fa-user-md-chat": "&#xf82e; Chat with Doctor light",
			"fab fa-user-md-chat": "&#xf82e; Chat with Doctor duotone",
			"fas fa-user-md": "&#xf0f0; Doctor solid",
			"far fa-user-md": "&#xf0f0; Doctor regular",
			"fal fa-user-md": "&#xf0f0; Doctor light",
			"fab fa-user-md": "&#xf0f0; Doctor duotone",
			"fas fa-user-lock": "&#xf502; User Lock solid",
			"far fa-user-lock": "&#xf502; User Lock regular",
			"fal fa-user-lock": "&#xf502; User Lock light",
			"fab fa-user-lock": "&#xf502; User Lock duotone",
			"fas fa-user-injured": "&#xf728; User Injured solid",
			"far fa-user-injured": "&#xf728; User Injured regular",
			"fal fa-user-injured": "&#xf728; User Injured light",
			"fab fa-user-injured": "&#xf728; User Injured duotone",
			"fas fa-user-headset": "&#xf82d; User Headset solid",
			"far fa-user-headset": "&#xf82d; User Headset regular",
			"fal fa-user-headset": "&#xf82d; User Headset light",
			"fab fa-user-headset": "&#xf82d; User Headset duotone",
			"fas fa-user-hard-hat": "&#xf82c; Construction Worker solid",
			"far fa-user-hard-hat": "&#xf82c; Construction Worker regular",
			"fal fa-user-hard-hat": "&#xf82c; Construction Worker light",
			"fab fa-user-hard-hat": "&#xf82c; Construction Worker duotone",
			"fas fa-user-graduate": "&#xf501; User Graduate solid",
			"far fa-user-graduate": "&#xf501; User Graduate regular",
			"fal fa-user-graduate": "&#xf501; User Graduate light",
			"fab fa-user-graduate": "&#xf501; User Graduate duotone",
			"fas fa-user-friends": "&#xf500; User Friends solid",
			"far fa-user-friends": "&#xf500; User Friends regular",
			"fal fa-user-friends": "&#xf500; User Friends light",
			"fab fa-user-friends": "&#xf500; User Friends duotone",
			"fas fa-user-edit": "&#xf4ff; User Edit solid",
			"far fa-user-edit": "&#xf4ff; User Edit regular",
			"fal fa-user-edit": "&#xf4ff; User Edit light",
			"fab fa-user-edit": "&#xf4ff; User Edit duotone",
			"fas fa-user-crown": "&#xf6a4; User Crown solid",
			"far fa-user-crown": "&#xf6a4; User Crown regular",
			"fal fa-user-crown": "&#xf6a4; User Crown light",
			"fab fa-user-crown": "&#xf6a4; User Crown duotone",
			"fal fa-user-cowboy": "&#xf8ea; User Cowboy light",
			"far fa-user-cowboy": "&#xf8ea; User Cowboy regular",
			"fas fa-user-cowboy": "&#xf8ea; User Cowboy solid",
			"fab fa-user-cowboy": "&#xf8ea; User Cowboy duotone",
			"fas fa-user-cog": "&#xf4fe; User Cog solid",
			"far fa-user-cog": "&#xf4fe; User Cog regular",
			"fal fa-user-cog": "&#xf4fe; User Cog light",
			"fab fa-user-cog": "&#xf4fe; User Cog duotone",
			"fas fa-user-clock": "&#xf4fd; User Clock solid",
			"far fa-user-clock": "&#xf4fd; User Clock regular",
			"fal fa-user-clock": "&#xf4fd; User Clock light",
			"fab fa-user-clock": "&#xf4fd; User Clock duotone",
			"fas fa-user-circle": "&#xf2bd; User Circle solid",
			"far fa-user-circle": "&#xf2bd; User Circle regular",
			"fal fa-user-circle": "&#xf2bd; User Circle light",
			"fab fa-user-circle": "&#xf2bd; User Circle duotone",
			"fas fa-user-check": "&#xf4fc; User Check solid",
			"far fa-user-check": "&#xf4fc; User Check regular",
			"fal fa-user-check": "&#xf4fc; User Check light",
			"fab fa-user-check": "&#xf4fc; User Check duotone",
			"fas fa-user-chart": "&#xf6a3; User Chart solid",
			"far fa-user-chart": "&#xf6a3; User Chart regular",
			"fal fa-user-chart": "&#xf6a3; User Chart light",
			"fab fa-user-chart": "&#xf6a3; User Chart duotone",
			"fas fa-user-astronaut": "&#xf4fb; User Astronaut solid",
			"far fa-user-astronaut": "&#xf4fb; User Astronaut regular",
			"fal fa-user-astronaut": "&#xf4fb; User Astronaut light",
			"fab fa-user-astronaut": "&#xf4fb; User Astronaut duotone",
			"fas fa-user-alt-slash": "&#xf4fa; Alternate User Slash solid",
			"far fa-user-alt-slash": "&#xf4fa; Alternate User Slash regular",
			"fal fa-user-alt-slash": "&#xf4fa; Alternate User Slash light",
			"fab fa-user-alt-slash": "&#xf4fa; Alternate User Slash duotone",
			"fas fa-user-alt": "&#xf406; Alternate User solid",
			"far fa-user-alt": "&#xf406; Alternate User regular",
			"fal fa-user-alt": "&#xf406; Alternate User light",
			"fab fa-user-alt": "&#xf406; Alternate User duotone",
			"fas fa-user": "&#xf007; User solid",
			"far fa-user": "&#xf007; User regular",
			"fal fa-user": "&#xf007; User light",
			"fab fa-user": "&#xf007; User duotone",
			"fas fa-usd-square": "&#xf2e9; US Dollar Square solid",
			"far fa-usd-square": "&#xf2e9; US Dollar Square regular",
			"fal fa-usd-square": "&#xf2e9; US Dollar Square light",
			"fab fa-usd-square": "&#xf2e9; US Dollar Square duotone",
			"fas fa-usd-circle": "&#xf2e8; US Dollar Circle solid",
			"far fa-usd-circle": "&#xf2e8; US Dollar Circle regular",
			"fal fa-usd-circle": "&#xf2e8; US Dollar Circle light",
			"fab fa-usd-circle": "&#xf2e8; US Dollar Circle duotone",
			"fas fa-usb-drive": "&#xf8e9; USB Drive solid",
			"far fa-usb-drive": "&#xf8e9; USB Drive regular",
			"fal fa-usb-drive": "&#xf8e9; USB Drive light",
			"fab fa-usb-drive": "&#xf8e9; USB Drive duotone",
			"fab fa-usb": "&#xf287; USB brands",
			"fab fa-ups": "&#xf7e0; UPS brands",
			"fas fa-upload": "&#xf093; Upload solid",
			"far fa-upload": "&#xf093; Upload regular",
			"fal fa-upload": "&#xf093; Upload light",
			"fab fa-upload": "&#xf093; Upload duotone",
			"fab fa-untappd": "&#xf405; Untappd brands",
			"fas fa-unlock-alt": "&#xf13e; Alternate Unlock solid",
			"far fa-unlock-alt": "&#xf13e; Alternate Unlock regular",
			"fal fa-unlock-alt": "&#xf13e; Alternate Unlock light",
			"fab fa-unlock-alt": "&#xf13e; Alternate Unlock duotone",
			"fas fa-unlock": "&#xf09c; unlock solid",
			"far fa-unlock": "&#xf09c; unlock regular",
			"fal fa-unlock": "&#xf09c; unlock light",
			"fab fa-unlock": "&#xf09c; unlock duotone",
			"fas fa-unlink": "&#xf127; unlink solid",
			"far fa-unlink": "&#xf127; unlink regular",
			"fal fa-unlink": "&#xf127; unlink light",
			"fab fa-unlink": "&#xf127; unlink duotone",
			"fas fa-university": "&#xf19c; University solid",
			"far fa-university": "&#xf19c; University regular",
			"fal fa-university": "&#xf19c; University light",
			"fab fa-university": "&#xf19c; University duotone",
			"fas fa-universal-access": "&#xf29a; Universal Access solid",
			"far fa-universal-access": "&#xf29a; Universal Access regular",
			"fal fa-universal-access": "&#xf29a; Universal Access light",
			"fab fa-universal-access": "&#xf29a; Universal Access duotone",
			"fab fa-uniregistry": "&#xf404; Uniregistry brands",
			"fas fa-union": "&#xf6a2; Union solid",
			"far fa-union": "&#xf6a2; Union regular",
			"fal fa-union": "&#xf6a2; Union light",
			"fab fa-union": "&#xf6a2; Union duotone",
			"fas fa-unicorn": "&#xf727; Unicorn solid",
			"far fa-unicorn": "&#xf727; Unicorn regular",
			"fal fa-unicorn": "&#xf727; Unicorn light",
			"fab fa-unicorn": "&#xf727; Unicorn duotone",
			"fas fa-undo-alt": "&#xf2ea; Alternate Undo solid",
			"far fa-undo-alt": "&#xf2ea; Alternate Undo regular",
			"fal fa-undo-alt": "&#xf2ea; Alternate Undo light",
			"fab fa-undo-alt": "&#xf2ea; Alternate Undo duotone",
			"fas fa-undo": "&#xf0e2; Undo solid",
			"far fa-undo": "&#xf0e2; Undo regular",
			"fal fa-undo": "&#xf0e2; Undo light",
			"fab fa-undo": "&#xf0e2; Undo duotone",
			"fas fa-underline": "&#xf0cd; Underline solid",
			"far fa-underline": "&#xf0cd; Underline regular",
			"fal fa-underline": "&#xf0cd; Underline light",
			"fab fa-underline": "&#xf0cd; Underline duotone",
			"fas fa-umbrella-beach": "&#xf5ca; Umbrella Beach solid",
			"far fa-umbrella-beach": "&#xf5ca; Umbrella Beach regular",
			"fal fa-umbrella-beach": "&#xf5ca; Umbrella Beach light",
			"fab fa-umbrella-beach": "&#xf5ca; Umbrella Beach duotone",
			"fas fa-umbrella": "&#xf0e9; Umbrella solid",
			"far fa-umbrella": "&#xf0e9; Umbrella regular",
			"fal fa-umbrella": "&#xf0e9; Umbrella light",
			"fab fa-umbrella": "&#xf0e9; Umbrella duotone",
			"fab fa-umbraco": "&#xf8e8; Umbraco brands",
			"fab fa-uikit": "&#xf403; UIkit brands",
			"fab fa-ubuntu": "&#xf7df; Ubuntu brands",
			"fab fa-uber": "&#xf402; Uber brands",
			"fab fa-typo3": "&#xf42b; Typo3 brands",
			"fas fa-typewriter": "&#xf8e7; Typewriter solid",
			"far fa-typewriter": "&#xf8e7; Typewriter regular",
			"fal fa-typewriter": "&#xf8e7; Typewriter light",
			"fab fa-typewriter": "&#xf8e7; Typewriter duotone",
			"fab fa-twitter-square": "&#xf081; Twitter Square brands",
			"fab fa-twitter": "&#xf099; Twitter brands",
			"fab fa-twitch": "&#xf1e8; Twitch brands",
			"fas fa-tv-retro": "&#xf401; Retro Televison solid",
			"far fa-tv-retro": "&#xf401; Retro Televison regular",
			"fal fa-tv-retro": "&#xf401; Retro Televison light",
			"fab fa-tv-retro": "&#xf401; Retro Televison duotone",
			"fas fa-tv-music": "&#xf8e6; TV Music solid",
			"far fa-tv-music": "&#xf8e6; TV Music regular",
			"fal fa-tv-music": "&#xf8e6; TV Music light",
			"fab fa-tv-music": "&#xf8e6; TV Music duotone",
			"fas fa-tv-alt": "&#xf8e5; Alternate Television solid",
			"far fa-tv-alt": "&#xf8e5; Alternate Television regular",
			"fal fa-tv-alt": "&#xf8e5; Alternate Television light",
			"fab fa-tv-alt": "&#xf8e5; Alternate Television duotone",
			"fas fa-tv": "&#xf26c; Television solid",
			"far fa-tv": "&#xf26c; Television regular",
			"fal fa-tv": "&#xf26c; Television light",
			"fab fa-tv": "&#xf26c; Television duotone",
			"fas fa-turtle": "&#xf726; Turtle solid",
			"far fa-turtle": "&#xf726; Turtle regular",
			"fal fa-turtle": "&#xf726; Turtle light",
			"fab fa-turtle": "&#xf726; Turtle duotone",
			"fas fa-turntable": "&#xf8e4; Turntable solid",
			"far fa-turntable": "&#xf8e4; Turntable regular",
			"fal fa-turntable": "&#xf8e4; Turntable light",
			"fab fa-turntable": "&#xf8e4; Turntable duotone",
			"fas fa-turkey": "&#xf725; Turkey solid",
			"far fa-turkey": "&#xf725; Turkey regular",
			"fal fa-turkey": "&#xf725; Turkey light",
			"fab fa-turkey": "&#xf725; Turkey duotone",
			"fab fa-tumblr-square": "&#xf174; Tumblr Square brands",
			"fab fa-tumblr": "&#xf173; Tumblr brands",
			"fas fa-tty": "&#xf1e4; TTY solid",
			"far fa-tty": "&#xf1e4; TTY regular",
			"fal fa-tty": "&#xf1e4; TTY light",
			"fab fa-tty": "&#xf1e4; TTY duotone",
			"fas fa-tshirt": "&#xf553; T-Shirt solid",
			"far fa-tshirt": "&#xf553; T-Shirt regular",
			"fal fa-tshirt": "&#xf553; T-Shirt light",
			"fab fa-tshirt": "&#xf553; T-Shirt duotone",
			"fas fa-trumpet": "&#xf8e3; Trumpet solid",
			"far fa-trumpet": "&#xf8e3; Trumpet regular",
			"fal fa-trumpet": "&#xf8e3; Trumpet light",
			"fab fa-trumpet": "&#xf8e3; Trumpet duotone",
			"fas fa-truck-ramp": "&#xf4e0; Truck Ramp solid",
			"far fa-truck-ramp": "&#xf4e0; Truck Ramp regular",
			"fal fa-truck-ramp": "&#xf4e0; Truck Ramp light",
			"fab fa-truck-ramp": "&#xf4e0; Truck Ramp duotone",
			"fas fa-truck-plow": "&#xf7de; Truck Plow solid",
			"far fa-truck-plow": "&#xf7de; Truck Plow regular",
			"fal fa-truck-plow": "&#xf7de; Truck Plow light",
			"fab fa-truck-plow": "&#xf7de; Truck Plow duotone",
			"fas fa-truck-pickup": "&#xf63c; Truck Side solid",
			"far fa-truck-pickup": "&#xf63c; Truck Side regular",
			"fal fa-truck-pickup": "&#xf63c; Truck Side light",
			"fab fa-truck-pickup": "&#xf63c; Truck Side duotone",
			"fas fa-truck-moving": "&#xf4df; Truck Moving solid",
			"far fa-truck-moving": "&#xf4df; Truck Moving regular",
			"fal fa-truck-moving": "&#xf4df; Truck Moving light",
			"fab fa-truck-moving": "&#xf4df; Truck Moving duotone",
			"fas fa-truck-monster": "&#xf63b; Truck Monster solid",
			"far fa-truck-monster": "&#xf63b; Truck Monster regular",
			"fal fa-truck-monster": "&#xf63b; Truck Monster light",
			"fab fa-truck-monster": "&#xf63b; Truck Monster duotone",
			"fas fa-truck-loading": "&#xf4de; Truck Loading solid",
			"far fa-truck-loading": "&#xf4de; Truck Loading regular",
			"fal fa-truck-loading": "&#xf4de; Truck Loading light",
			"fab fa-truck-loading": "&#xf4de; Truck Loading duotone",
			"fas fa-truck-couch": "&#xf4dd; Truck Couch solid",
			"far fa-truck-couch": "&#xf4dd; Truck Couch regular",
			"fal fa-truck-couch": "&#xf4dd; Truck Couch light",
			"fab fa-truck-couch": "&#xf4dd; Truck Couch duotone",
			"fas fa-truck-container": "&#xf4dc; Truck Container solid",
			"far fa-truck-container": "&#xf4dc; Truck Container regular",
			"fal fa-truck-container": "&#xf4dc; Truck Container light",
			"fab fa-truck-container": "&#xf4dc; Truck Container duotone",
			"fas fa-truck": "&#xf0d1; truck solid",
			"far fa-truck": "&#xf0d1; truck regular",
			"fal fa-truck": "&#xf0d1; truck light",
			"fab fa-truck": "&#xf0d1; truck duotone",
			"fas fa-trophy-alt": "&#xf2eb; Alternate Trophy solid",
			"far fa-trophy-alt": "&#xf2eb; Alternate Trophy regular",
			"fal fa-trophy-alt": "&#xf2eb; Alternate Trophy light",
			"fab fa-trophy-alt": "&#xf2eb; Alternate Trophy duotone",
			"fas fa-trophy": "&#xf091; trophy solid",
			"far fa-trophy": "&#xf091; trophy regular",
			"fal fa-trophy": "&#xf091; trophy light",
			"fab fa-trophy": "&#xf091; trophy duotone",
			"fab fa-tripadvisor": "&#xf262; TripAdvisor brands",
			"fas fa-triangle-music": "&#xf8e2; Musical Triangle solid",
			"far fa-triangle-music": "&#xf8e2; Musical Triangle regular",
			"fal fa-triangle-music": "&#xf8e2; Musical Triangle light",
			"fab fa-triangle-music": "&#xf8e2; Musical Triangle duotone",
			"fas fa-triangle": "&#xf2ec; Triangle solid",
			"far fa-triangle": "&#xf2ec; Triangle regular",
			"fal fa-triangle": "&#xf2ec; Triangle light",
			"fab fa-triangle": "&#xf2ec; Triangle duotone",
			"fab fa-trello": "&#xf181; Trello brands",
			"fas fa-trees": "&#xf724; Trees solid",
			"far fa-trees": "&#xf724; Trees regular",
			"fal fa-trees": "&#xf724; Trees light",
			"fab fa-trees": "&#xf724; Trees duotone",
			"fas fa-tree-palm": "&#xf82b; Palm Tree solid",
			"far fa-tree-palm": "&#xf82b; Palm Tree regular",
			"fal fa-tree-palm": "&#xf82b; Palm Tree light",
			"fab fa-tree-palm": "&#xf82b; Palm Tree duotone",
			"fas fa-tree-large": "&#xf7dd; Tree Large solid",
			"far fa-tree-large": "&#xf7dd; Tree Large regular",
			"fal fa-tree-large": "&#xf7dd; Tree Large light",
			"fab fa-tree-large": "&#xf7dd; Tree Large duotone",
			"fas fa-tree-decorated": "&#xf7dc; Tree Decorated solid",
			"far fa-tree-decorated": "&#xf7dc; Tree Decorated regular",
			"fal fa-tree-decorated": "&#xf7dc; Tree Decorated light",
			"fab fa-tree-decorated": "&#xf7dc; Tree Decorated duotone",
			"fas fa-tree-christmas": "&#xf7db; Christmas Tree solid",
			"far fa-tree-christmas": "&#xf7db; Christmas Tree regular",
			"fal fa-tree-christmas": "&#xf7db; Christmas Tree light",
			"fab fa-tree-christmas": "&#xf7db; Christmas Tree duotone",
			"fas fa-tree-alt": "&#xf400; Alternate Tree solid",
			"far fa-tree-alt": "&#xf400; Alternate Tree regular",
			"fal fa-tree-alt": "&#xf400; Alternate Tree light",
			"fab fa-tree-alt": "&#xf400; Alternate Tree duotone",
			"fas fa-tree": "&#xf1bb; Tree solid",
			"far fa-tree": "&#xf1bb; Tree regular",
			"fal fa-tree": "&#xf1bb; Tree light",
			"fab fa-tree": "&#xf1bb; Tree duotone",
			"fas fa-treasure-chest": "&#xf723; Treasure Chest solid",
			"far fa-treasure-chest": "&#xf723; Treasure Chest regular",
			"fal fa-treasure-chest": "&#xf723; Treasure Chest light",
			"fab fa-treasure-chest": "&#xf723; Treasure Chest duotone",
			"fas fa-trash-undo-alt": "&#xf896; Alternate Trash Undo solid",
			"far fa-trash-undo-alt": "&#xf896; Alternate Trash Undo regular",
			"fal fa-trash-undo-alt": "&#xf896; Alternate Trash Undo light",
			"fab fa-trash-undo-alt": "&#xf896; Alternate Trash Undo duotone",
			"fas fa-trash-undo": "&#xf895; Trash Undo solid",
			"far fa-trash-undo": "&#xf895; Trash Undo regular",
			"fal fa-trash-undo": "&#xf895; Trash Undo light",
			"fab fa-trash-undo": "&#xf895; Trash Undo duotone",
			"fas fa-trash-restore-alt": "&#xf82a; Alternative Trash Restore solid",
			"far fa-trash-restore-alt": "&#xf82a; Alternative Trash Restore regular",
			"fal fa-trash-restore-alt": "&#xf82a; Alternative Trash Restore light",
			"fab fa-trash-restore-alt": "&#xf82a; Alternative Trash Restore duotone",
			"fas fa-trash-restore": "&#xf829; Trash Restore solid",
			"far fa-trash-restore": "&#xf829; Trash Restore regular",
			"fal fa-trash-restore": "&#xf829; Trash Restore light",
			"fab fa-trash-restore": "&#xf829; Trash Restore duotone",
			"fas fa-trash-alt": "&#xf2ed; Alternate Trash solid",
			"far fa-trash-alt": "&#xf2ed; Alternate Trash regular",
			"fal fa-trash-alt": "&#xf2ed; Alternate Trash light",
			"fab fa-trash-alt": "&#xf2ed; Alternate Trash duotone",
			"fas fa-trash": "&#xf1f8; Trash solid",
			"far fa-trash": "&#xf1f8; Trash regular",
			"fal fa-trash": "&#xf1f8; Trash light",
			"fab fa-trash": "&#xf1f8; Trash duotone",
			"fas fa-transgender-alt": "&#xf225; Alternate Transgender solid",
			"far fa-transgender-alt": "&#xf225; Alternate Transgender regular",
			"fal fa-transgender-alt": "&#xf225; Alternate Transgender light",
			"fab fa-transgender-alt": "&#xf225; Alternate Transgender duotone",
			"fas fa-transgender": "&#xf224; Transgender solid",
			"far fa-transgender": "&#xf224; Transgender regular",
			"fal fa-transgender": "&#xf224; Transgender light",
			"fab fa-transgender": "&#xf224; Transgender duotone",
			"fas fa-tram": "&#xf7da; Tram solid",
			"far fa-tram": "&#xf7da; Tram regular",
			"fal fa-tram": "&#xf7da; Tram light",
			"fab fa-tram": "&#xf7da; Tram duotone",
			"fas fa-train": "&#xf238; Train solid",
			"far fa-train": "&#xf238; Train regular",
			"fal fa-train": "&#xf238; Train light",
			"fab fa-train": "&#xf238; Train duotone",
			"fas fa-traffic-light-stop": "&#xf63a; Traffic Light-stop solid",
			"far fa-traffic-light-stop": "&#xf63a; Traffic Light-stop regular",
			"fal fa-traffic-light-stop": "&#xf63a; Traffic Light-stop light",
			"fab fa-traffic-light-stop": "&#xf63a; Traffic Light-stop duotone",
			"fas fa-traffic-light-slow": "&#xf639; Traffic Light-slow solid",
			"far fa-traffic-light-slow": "&#xf639; Traffic Light-slow regular",
			"fal fa-traffic-light-slow": "&#xf639; Traffic Light-slow light",
			"fab fa-traffic-light-slow": "&#xf639; Traffic Light-slow duotone",
			"fas fa-traffic-light-go": "&#xf638; Traffic Light-go solid",
			"far fa-traffic-light-go": "&#xf638; Traffic Light-go regular",
			"fal fa-traffic-light-go": "&#xf638; Traffic Light-go light",
			"fab fa-traffic-light-go": "&#xf638; Traffic Light-go duotone",
			"fas fa-traffic-light": "&#xf637; Traffic Light solid",
			"far fa-traffic-light": "&#xf637; Traffic Light regular",
			"fal fa-traffic-light": "&#xf637; Traffic Light light",
			"fab fa-traffic-light": "&#xf637; Traffic Light duotone",
			"fas fa-traffic-cone": "&#xf636; Traffic Cone solid",
			"far fa-traffic-cone": "&#xf636; Traffic Cone regular",
			"fal fa-traffic-cone": "&#xf636; Traffic Cone light",
			"fab fa-traffic-cone": "&#xf636; Traffic Cone duotone",
			"fas fa-trademark": "&#xf25c; Trademark solid",
			"far fa-trademark": "&#xf25c; Trademark regular",
			"fal fa-trademark": "&#xf25c; Trademark light",
			"fab fa-trademark": "&#xf25c; Trademark duotone",
			"fab fa-trade-federation": "&#xf513; Trade Federation brands",
			"fas fa-tractor": "&#xf722; Tractor solid",
			"far fa-tractor": "&#xf722; Tractor regular",
			"fal fa-tractor": "&#xf722; Tractor light",
			"fab fa-tractor": "&#xf722; Tractor duotone",
			"fas fa-tornado": "&#xf76f; Tornado solid",
			"far fa-tornado": "&#xf76f; Tornado regular",
			"fal fa-tornado": "&#xf76f; Tornado light",
			"fab fa-tornado": "&#xf76f; Tornado duotone",
			"fas fa-torii-gate": "&#xf6a1; Torii Gate solid",
			"far fa-torii-gate": "&#xf6a1; Torii Gate regular",
			"fal fa-torii-gate": "&#xf6a1; Torii Gate light",
			"fab fa-torii-gate": "&#xf6a1; Torii Gate duotone",
			"fas fa-torah": "&#xf6a0; Torah solid",
			"far fa-torah": "&#xf6a0; Torah regular",
			"fal fa-torah": "&#xf6a0; Torah light",
			"fab fa-torah": "&#xf6a0; Torah duotone",
			"fas fa-toothbrush": "&#xf635; Toothbrush solid",
			"far fa-toothbrush": "&#xf635; Toothbrush regular",
			"fal fa-toothbrush": "&#xf635; Toothbrush light",
			"fab fa-toothbrush": "&#xf635; Toothbrush duotone",
			"fas fa-tooth": "&#xf5c9; Tooth solid",
			"far fa-tooth": "&#xf5c9; Tooth regular",
			"fal fa-tooth": "&#xf5c9; Tooth light",
			"fab fa-tooth": "&#xf5c9; Tooth duotone",
			"fas fa-tools": "&#xf7d9; Tools solid",
			"far fa-tools": "&#xf7d9; Tools regular",
			"fal fa-tools": "&#xf7d9; Tools light",
			"fab fa-tools": "&#xf7d9; Tools duotone",
			"fas fa-toolbox": "&#xf552; Toolbox solid",
			"far fa-toolbox": "&#xf552; Toolbox regular",
			"fal fa-toolbox": "&#xf552; Toolbox light",
			"fab fa-toolbox": "&#xf552; Toolbox duotone",
			"fas fa-tombstone-alt": "&#xf721; Alternate Tombstone solid",
			"far fa-tombstone-alt": "&#xf721; Alternate Tombstone regular",
			"fal fa-tombstone-alt": "&#xf721; Alternate Tombstone light",
			"fab fa-tombstone-alt": "&#xf721; Alternate Tombstone duotone",
			"fas fa-tombstone": "&#xf720; Tombstone solid",
			"far fa-tombstone": "&#xf720; Tombstone regular",
			"fal fa-tombstone": "&#xf720; Tombstone light",
			"fab fa-tombstone": "&#xf720; Tombstone duotone",
			"fas fa-toilet-paper-alt": "&#xf71f; Alternate Toilet Paper solid",
			"far fa-toilet-paper-alt": "&#xf71f; Alternate Toilet Paper regular",
			"fal fa-toilet-paper-alt": "&#xf71f; Alternate Toilet Paper light",
			"fab fa-toilet-paper-alt": "&#xf71f; Alternate Toilet Paper duotone",
			"fas fa-toilet-paper": "&#xf71e; Toilet Paper solid",
			"far fa-toilet-paper": "&#xf71e; Toilet Paper regular",
			"fal fa-toilet-paper": "&#xf71e; Toilet Paper light",
			"fab fa-toilet-paper": "&#xf71e; Toilet Paper duotone",
			"fas fa-toilet": "&#xf7d8; Toilet solid",
			"far fa-toilet": "&#xf7d8; Toilet regular",
			"fal fa-toilet": "&#xf7d8; Toilet light",
			"fab fa-toilet": "&#xf7d8; Toilet duotone",
			"fas fa-toggle-on": "&#xf205; Toggle On solid",
			"far fa-toggle-on": "&#xf205; Toggle On regular",
			"fal fa-toggle-on": "&#xf205; Toggle On light",
			"fab fa-toggle-on": "&#xf205; Toggle On duotone",
			"fas fa-toggle-off": "&#xf204; Toggle Off solid",
			"far fa-toggle-off": "&#xf204; Toggle Off regular",
			"fal fa-toggle-off": "&#xf204; Toggle Off light",
			"fab fa-toggle-off": "&#xf204; Toggle Off duotone",
			"fas fa-tired": "&#xf5c8; Tired Face solid",
			"far fa-tired": "&#xf5c8; Tired Face regular",
			"fal fa-tired": "&#xf5c8; Tired Face light",
			"fab fa-tired": "&#xf5c8; Tired Face duotone",
			"fas fa-tire-rugged": "&#xf634; Tire Rugged solid",
			"far fa-tire-rugged": "&#xf634; Tire Rugged regular",
			"fal fa-tire-rugged": "&#xf634; Tire Rugged light",
			"fab fa-tire-rugged": "&#xf634; Tire Rugged duotone",
			"fas fa-tire-pressure-warning": "&#xf633; Tire Pressure-warning solid",
			"far fa-tire-pressure-warning": "&#xf633; Tire Pressure-warning regular",
			"fal fa-tire-pressure-warning": "&#xf633; Tire Pressure-warning light",
			"fab fa-tire-pressure-warning": "&#xf633; Tire Pressure-warning duotone",
			"fas fa-tire-flat": "&#xf632; Tire Flat solid",
			"far fa-tire-flat": "&#xf632; Tire Flat regular",
			"fal fa-tire-flat": "&#xf632; Tire Flat light",
			"fab fa-tire-flat": "&#xf632; Tire Flat duotone",
			"fas fa-tire": "&#xf631; Tire solid",
			"far fa-tire": "&#xf631; Tire regular",
			"fal fa-tire": "&#xf631; Tire light",
			"fab fa-tire": "&#xf631; Tire duotone",
			"fas fa-tint-slash": "&#xf5c7; Tint Slash solid",
			"far fa-tint-slash": "&#xf5c7; Tint Slash regular",
			"fal fa-tint-slash": "&#xf5c7; Tint Slash light",
			"fab fa-tint-slash": "&#xf5c7; Tint Slash duotone",
			"fas fa-tint": "&#xf043; tint solid",
			"far fa-tint": "&#xf043; tint regular",
			"fal fa-tint": "&#xf043; tint light",
			"fab fa-tint": "&#xf043; tint duotone",
			"fas fa-times-square": "&#xf2d3; Times Square solid",
			"far fa-times-square": "&#xf2d3; Times Square regular",
			"fal fa-times-square": "&#xf2d3; Times Square light",
			"fab fa-times-square": "&#xf2d3; Times Square duotone",
			"fas fa-times-octagon": "&#xf2f0; Times Octagon solid",
			"far fa-times-octagon": "&#xf2f0; Times Octagon regular",
			"fal fa-times-octagon": "&#xf2f0; Times Octagon light",
			"fab fa-times-octagon": "&#xf2f0; Times Octagon duotone",
			"fas fa-times-hexagon": "&#xf2ee; Times Hexagon solid",
			"far fa-times-hexagon": "&#xf2ee; Times Hexagon regular",
			"fal fa-times-hexagon": "&#xf2ee; Times Hexagon light",
			"fab fa-times-hexagon": "&#xf2ee; Times Hexagon duotone",
			"fas fa-times-circle": "&#xf057; Times Circle solid",
			"far fa-times-circle": "&#xf057; Times Circle regular",
			"fal fa-times-circle": "&#xf057; Times Circle light",
			"fab fa-times-circle": "&#xf057; Times Circle duotone",
			"fas fa-times": "&#xf00d; Times solid",
			"far fa-times": "&#xf00d; Times regular",
			"fal fa-times": "&#xf00d; Times light",
			"fab fa-times": "&#xf00d; Times duotone",
			"fas fa-tilde": "&#xf69f; Tilde solid",
			"far fa-tilde": "&#xf69f; Tilde regular",
			"fal fa-tilde": "&#xf69f; Tilde light",
			"fab fa-tilde": "&#xf69f; Tilde duotone",
			"fas fa-ticket-alt": "&#xf3ff; Alternate Ticket solid",
			"far fa-ticket-alt": "&#xf3ff; Alternate Ticket regular",
			"fal fa-ticket-alt": "&#xf3ff; Alternate Ticket light",
			"fab fa-ticket-alt": "&#xf3ff; Alternate Ticket duotone",
			"fas fa-ticket": "&#xf145; Ticket solid",
			"far fa-ticket": "&#xf145; Ticket regular",
			"fal fa-ticket": "&#xf145; Ticket light",
			"fab fa-ticket": "&#xf145; Ticket duotone",
			"fas fa-thunderstorm-sun": "&#xf76e; Thunderstorm with Sun solid",
			"far fa-thunderstorm-sun": "&#xf76e; Thunderstorm with Sun regular",
			"fal fa-thunderstorm-sun": "&#xf76e; Thunderstorm with Sun light",
			"fab fa-thunderstorm-sun": "&#xf76e; Thunderstorm with Sun duotone",
			"fas fa-thunderstorm-moon": "&#xf76d; Thunderstorm with Moon solid",
			"far fa-thunderstorm-moon": "&#xf76d; Thunderstorm with Moon regular",
			"fal fa-thunderstorm-moon": "&#xf76d; Thunderstorm with Moon light",
			"fab fa-thunderstorm-moon": "&#xf76d; Thunderstorm with Moon duotone",
			"fas fa-thunderstorm": "&#xf76c; Thunderstorm solid",
			"far fa-thunderstorm": "&#xf76c; Thunderstorm regular",
			"fal fa-thunderstorm": "&#xf76c; Thunderstorm light",
			"fab fa-thunderstorm": "&#xf76c; Thunderstorm duotone",
			"fas fa-thumbtack": "&#xf08d; Thumbtack solid",
			"far fa-thumbtack": "&#xf08d; Thumbtack regular",
			"fal fa-thumbtack": "&#xf08d; Thumbtack light",
			"fab fa-thumbtack": "&#xf08d; Thumbtack duotone",
			"fas fa-thumbs-up": "&#xf164; thumbs-up solid",
			"far fa-thumbs-up": "&#xf164; thumbs-up regular",
			"fal fa-thumbs-up": "&#xf164; thumbs-up light",
			"fab fa-thumbs-up": "&#xf164; thumbs-up duotone",
			"fas fa-thumbs-down": "&#xf165; thumbs-down solid",
			"far fa-thumbs-down": "&#xf165; thumbs-down regular",
			"fal fa-thumbs-down": "&#xf165; thumbs-down light",
			"fab fa-thumbs-down": "&#xf165; thumbs-down duotone",
			"fab fa-think-peaks": "&#xf731; Think Peaks brands",
			"fas fa-theta": "&#xf69e; Theta solid",
			"far fa-theta": "&#xf69e; Theta regular",
			"fal fa-theta": "&#xf69e; Theta light",
			"fab fa-theta": "&#xf69e; Theta duotone",
			"fas fa-thermometer-three-quarters": "&#xf2c8; Thermometer 3\/4 Full solid",
			"far fa-thermometer-three-quarters": "&#xf2c8; Thermometer 3\/4 Full regular",
			"fal fa-thermometer-three-quarters": "&#xf2c8; Thermometer 3\/4 Full light",
			"fab fa-thermometer-three-quarters": "&#xf2c8; Thermometer 3\/4 Full duotone",
			"fas fa-thermometer-quarter": "&#xf2ca; Thermometer 1\/4 Full solid",
			"far fa-thermometer-quarter": "&#xf2ca; Thermometer 1\/4 Full regular",
			"fal fa-thermometer-quarter": "&#xf2ca; Thermometer 1\/4 Full light",
			"fab fa-thermometer-quarter": "&#xf2ca; Thermometer 1\/4 Full duotone",
			"fas fa-thermometer-half": "&#xf2c9; Thermometer 1\/2 Full solid",
			"far fa-thermometer-half": "&#xf2c9; Thermometer 1\/2 Full regular",
			"fal fa-thermometer-half": "&#xf2c9; Thermometer 1\/2 Full light",
			"fab fa-thermometer-half": "&#xf2c9; Thermometer 1\/2 Full duotone",
			"fas fa-thermometer-full": "&#xf2c7; Thermometer Full solid",
			"far fa-thermometer-full": "&#xf2c7; Thermometer Full regular",
			"fal fa-thermometer-full": "&#xf2c7; Thermometer Full light",
			"fab fa-thermometer-full": "&#xf2c7; Thermometer Full duotone",
			"fas fa-thermometer-empty": "&#xf2cb; Thermometer Empty solid",
			"far fa-thermometer-empty": "&#xf2cb; Thermometer Empty regular",
			"fal fa-thermometer-empty": "&#xf2cb; Thermometer Empty light",
			"fab fa-thermometer-empty": "&#xf2cb; Thermometer Empty duotone",
			"fas fa-thermometer": "&#xf491; Thermometer solid",
			"far fa-thermometer": "&#xf491; Thermometer regular",
			"fal fa-thermometer": "&#xf491; Thermometer light",
			"fab fa-thermometer": "&#xf491; Thermometer duotone",
			"fab fa-themeisle": "&#xf2b2; ThemeIsle brands",
			"fab fa-themeco": "&#xf5c6; Themeco brands",
			"fas fa-theater-masks": "&#xf630; Theater Masks solid",
			"far fa-theater-masks": "&#xf630; Theater Masks regular",
			"fal fa-theater-masks": "&#xf630; Theater Masks light",
			"fab fa-theater-masks": "&#xf630; Theater Masks duotone",
			"fab fa-the-red-yeti": "&#xf69d; The Red Yeti brands",
			"fas fa-th-list": "&#xf00b; th-list solid",
			"far fa-th-list": "&#xf00b; th-list regular",
			"fal fa-th-list": "&#xf00b; th-list light",
			"fab fa-th-list": "&#xf00b; th-list duotone",
			"fas fa-th-large": "&#xf009; th-large solid",
			"far fa-th-large": "&#xf009; th-large regular",
			"fal fa-th-large": "&#xf009; th-large light",
			"fab fa-th-large": "&#xf009; th-large duotone",
			"fas fa-th": "&#xf00a; th solid",
			"far fa-th": "&#xf00a; th regular",
			"fal fa-th": "&#xf00a; th light",
			"fab fa-th": "&#xf00a; th duotone",
			"fas fa-text-width": "&#xf035; Text Width solid",
			"far fa-text-width": "&#xf035; Text Width regular",
			"fal fa-text-width": "&#xf035; Text Width light",
			"fab fa-text-width": "&#xf035; Text Width duotone",
			"fas fa-text-size": "&#xf894; Text Size solid",
			"far fa-text-size": "&#xf894; Text Size regular",
			"fal fa-text-size": "&#xf894; Text Size light",
			"fab fa-text-size": "&#xf894; Text Size duotone",
			"fas fa-text-height": "&#xf034; text-height solid",
			"far fa-text-height": "&#xf034; text-height regular",
			"fal fa-text-height": "&#xf034; text-height light",
			"fab fa-text-height": "&#xf034; text-height duotone",
			"fas fa-text": "&#xf893; Text solid",
			"far fa-text": "&#xf893; Text regular",
			"fal fa-text": "&#xf893; Text light",
			"fab fa-text": "&#xf893; Text duotone",
			"fas fa-terminal": "&#xf120; Terminal solid",
			"far fa-terminal": "&#xf120; Terminal regular",
			"fal fa-terminal": "&#xf120; Terminal light",
			"fab fa-terminal": "&#xf120; Terminal duotone",
			"fas fa-tennis-ball": "&#xf45e; Tennis Ball solid",
			"far fa-tennis-ball": "&#xf45e; Tennis Ball regular",
			"fal fa-tennis-ball": "&#xf45e; Tennis Ball light",
			"fab fa-tennis-ball": "&#xf45e; Tennis Ball duotone",
			"fas fa-tenge": "&#xf7d7; Tenge solid",
			"far fa-tenge": "&#xf7d7; Tenge regular",
			"fal fa-tenge": "&#xf7d7; Tenge light",
			"fab fa-tenge": "&#xf7d7; Tenge duotone",
			"fab fa-tencent-weibo": "&#xf1d5; Tencent Weibo brands",
			"fas fa-temperature-low": "&#xf76b; Low Temperature solid",
			"far fa-temperature-low": "&#xf76b; Low Temperature regular",
			"fal fa-temperature-low": "&#xf76b; Low Temperature light",
			"fab fa-temperature-low": "&#xf76b; Low Temperature duotone",
			"fas fa-temperature-hot": "&#xf76a; Temperature Hot solid",
			"far fa-temperature-hot": "&#xf76a; Temperature Hot regular",
			"fal fa-temperature-hot": "&#xf76a; Temperature Hot light",
			"fab fa-temperature-hot": "&#xf76a; Temperature Hot duotone",
			"fas fa-temperature-high": "&#xf769; High Temperature solid",
			"far fa-temperature-high": "&#xf769; High Temperature regular",
			"fal fa-temperature-high": "&#xf769; High Temperature light",
			"fab fa-temperature-high": "&#xf769; High Temperature duotone",
			"fas fa-temperature-frigid": "&#xf768; Temperature Frigid solid",
			"far fa-temperature-frigid": "&#xf768; Temperature Frigid regular",
			"fal fa-temperature-frigid": "&#xf768; Temperature Frigid light",
			"fab fa-temperature-frigid": "&#xf768; Temperature Frigid duotone",
			"fab fa-telegram-plane": "&#xf3fe; Telegram Plane brands",
			"fab fa-telegram": "&#xf2c6; Telegram brands",
			"fas fa-teeth-open": "&#xf62f; Teeth Open solid",
			"far fa-teeth-open": "&#xf62f; Teeth Open regular",
			"fal fa-teeth-open": "&#xf62f; Teeth Open light",
			"fab fa-teeth-open": "&#xf62f; Teeth Open duotone",
			"fas fa-teeth": "&#xf62e; Teeth solid",
			"far fa-teeth": "&#xf62e; Teeth regular",
			"fal fa-teeth": "&#xf62e; Teeth light",
			"fab fa-teeth": "&#xf62e; Teeth duotone",
			"fab fa-teamspeak": "&#xf4f9; TeamSpeak brands",
			"fas fa-taxi": "&#xf1ba; Taxi solid",
			"far fa-taxi": "&#xf1ba; Taxi regular",
			"fal fa-taxi": "&#xf1ba; Taxi light",
			"fab fa-taxi": "&#xf1ba; Taxi duotone",
			"fas fa-tasks-alt": "&#xf828; Alternate Tasks solid",
			"far fa-tasks-alt": "&#xf828; Alternate Tasks regular",
			"fal fa-tasks-alt": "&#xf828; Alternate Tasks light",
			"fab fa-tasks-alt": "&#xf828; Alternate Tasks duotone",
			"fas fa-tasks": "&#xf0ae; Tasks solid",
			"far fa-tasks": "&#xf0ae; Tasks regular",
			"fal fa-tasks": "&#xf0ae; Tasks light",
			"fab fa-tasks": "&#xf0ae; Tasks duotone",
			"fas fa-tape": "&#xf4db; Tape solid",
			"far fa-tape": "&#xf4db; Tape regular",
			"fal fa-tape": "&#xf4db; Tape light",
			"fab fa-tape": "&#xf4db; Tape duotone",
			"fas fa-tanakh": "&#xf827; Tanakh solid",
			"far fa-tanakh": "&#xf827; Tanakh regular",
			"fal fa-tanakh": "&#xf827; Tanakh light",
			"fab fa-tanakh": "&#xf827; Tanakh duotone",
			"fas fa-tally": "&#xf69c; Tally solid",
			"far fa-tally": "&#xf69c; Tally regular",
			"fal fa-tally": "&#xf69c; Tally light",
			"fab fa-tally": "&#xf69c; Tally duotone",
			"fas fa-tags": "&#xf02c; tags solid",
			"far fa-tags": "&#xf02c; tags regular",
			"fal fa-tags": "&#xf02c; tags light",
			"fab fa-tags": "&#xf02c; tags duotone",
			"fas fa-tag": "&#xf02b; tag solid",
			"far fa-tag": "&#xf02b; tag regular",
			"fal fa-tag": "&#xf02b; tag light",
			"fab fa-tag": "&#xf02b; tag duotone",
			"fas fa-taco": "&#xf826; Taco solid",
			"far fa-taco": "&#xf826; Taco regular",
			"fal fa-taco": "&#xf826; Taco light",
			"fab fa-taco": "&#xf826; Taco duotone",
			"fas fa-tachometer-slowest": "&#xf62d; Tachometer Slowest solid",
			"far fa-tachometer-slowest": "&#xf62d; Tachometer Slowest regular",
			"fal fa-tachometer-slowest": "&#xf62d; Tachometer Slowest light",
			"fab fa-tachometer-slowest": "&#xf62d; Tachometer Slowest duotone",
			"fas fa-tachometer-slow": "&#xf62c; Tachometer Slow solid",
			"far fa-tachometer-slow": "&#xf62c; Tachometer Slow regular",
			"fal fa-tachometer-slow": "&#xf62c; Tachometer Slow light",
			"fab fa-tachometer-slow": "&#xf62c; Tachometer Slow duotone",
			"fas fa-tachometer-fastest": "&#xf62b; Tachometer Fastest solid",
			"far fa-tachometer-fastest": "&#xf62b; Tachometer Fastest regular",
			"fal fa-tachometer-fastest": "&#xf62b; Tachometer Fastest light",
			"fab fa-tachometer-fastest": "&#xf62b; Tachometer Fastest duotone",
			"fas fa-tachometer-fast": "&#xf62a; Tachometer Fast solid",
			"far fa-tachometer-fast": "&#xf62a; Tachometer Fast regular",
			"fal fa-tachometer-fast": "&#xf62a; Tachometer Fast light",
			"fab fa-tachometer-fast": "&#xf62a; Tachometer Fast duotone",
			"fas fa-tachometer-average": "&#xf629; Tachometer Average solid",
			"far fa-tachometer-average": "&#xf629; Tachometer Average regular",
			"fal fa-tachometer-average": "&#xf629; Tachometer Average light",
			"fab fa-tachometer-average": "&#xf629; Tachometer Average duotone",
			"fas fa-tachometer-alt-slowest": "&#xf628; Alternate Tachometer Slowest solid",
			"far fa-tachometer-alt-slowest": "&#xf628; Alternate Tachometer Slowest regular",
			"fal fa-tachometer-alt-slowest": "&#xf628; Alternate Tachometer Slowest light",
			"fab fa-tachometer-alt-slowest": "&#xf628; Alternate Tachometer Slowest duotone",
			"fas fa-tachometer-alt-slow": "&#xf627; Alternate Tachometer Slow solid",
			"far fa-tachometer-alt-slow": "&#xf627; Alternate Tachometer Slow regular",
			"fal fa-tachometer-alt-slow": "&#xf627; Alternate Tachometer Slow light",
			"fab fa-tachometer-alt-slow": "&#xf627; Alternate Tachometer Slow duotone",
			"fas fa-tachometer-alt-fastest": "&#xf626; Alternate Tachometer Fastest solid",
			"far fa-tachometer-alt-fastest": "&#xf626; Alternate Tachometer Fastest regular",
			"fal fa-tachometer-alt-fastest": "&#xf626; Alternate Tachometer Fastest light",
			"fab fa-tachometer-alt-fastest": "&#xf626; Alternate Tachometer Fastest duotone",
			"fas fa-tachometer-alt-fast": "&#xf625; Alternate Tachometer Fast solid",
			"far fa-tachometer-alt-fast": "&#xf625; Alternate Tachometer Fast regular",
			"fal fa-tachometer-alt-fast": "&#xf625; Alternate Tachometer Fast light",
			"fab fa-tachometer-alt-fast": "&#xf625; Alternate Tachometer Fast duotone",
			"fas fa-tachometer-alt-average": "&#xf624; Alternate Tachometer Average solid",
			"far fa-tachometer-alt-average": "&#xf624; Alternate Tachometer Average regular",
			"fal fa-tachometer-alt-average": "&#xf624; Alternate Tachometer Average light",
			"fab fa-tachometer-alt-average": "&#xf624; Alternate Tachometer Average duotone",
			"fas fa-tachometer-alt": "&#xf3fd; Alternate Tachometer solid",
			"far fa-tachometer-alt": "&#xf3fd; Alternate Tachometer regular",
			"fal fa-tachometer-alt": "&#xf3fd; Alternate Tachometer light",
			"fab fa-tachometer-alt": "&#xf3fd; Alternate Tachometer duotone",
			"fas fa-tachometer": "&#xf0e4; Tachometer solid",
			"far fa-tachometer": "&#xf0e4; Tachometer regular",
			"fal fa-tachometer": "&#xf0e4; Tachometer light",
			"fab fa-tachometer": "&#xf0e4; Tachometer duotone",
			"fas fa-tablets": "&#xf490; Tablets solid",
			"far fa-tablets": "&#xf490; Tablets regular",
			"fal fa-tablets": "&#xf490; Tablets light",
			"fab fa-tablets": "&#xf490; Tablets duotone",
			"fas fa-tablet-rugged": "&#xf48f; Rugged Tablet solid",
			"far fa-tablet-rugged": "&#xf48f; Rugged Tablet regular",
			"fal fa-tablet-rugged": "&#xf48f; Rugged Tablet light",
			"fab fa-tablet-rugged": "&#xf48f; Rugged Tablet duotone",
			"fas fa-tablet-android-alt": "&#xf3fc; Alternate Tablet Android solid",
			"far fa-tablet-android-alt": "&#xf3fc; Alternate Tablet Android regular",
			"fal fa-tablet-android-alt": "&#xf3fc; Alternate Tablet Android light",
			"fab fa-tablet-android-alt": "&#xf3fc; Alternate Tablet Android duotone",
			"fas fa-tablet-android": "&#xf3fb; Tablet Android solid",
			"far fa-tablet-android": "&#xf3fb; Tablet Android regular",
			"fal fa-tablet-android": "&#xf3fb; Tablet Android light",
			"fab fa-tablet-android": "&#xf3fb; Tablet Android duotone",
			"fas fa-tablet-alt": "&#xf3fa; Alternate Tablet solid",
			"far fa-tablet-alt": "&#xf3fa; Alternate Tablet regular",
			"fal fa-tablet-alt": "&#xf3fa; Alternate Tablet light",
			"fab fa-tablet-alt": "&#xf3fa; Alternate Tablet duotone",
			"fas fa-tablet": "&#xf10a; tablet solid",
			"far fa-tablet": "&#xf10a; tablet regular",
			"fal fa-tablet": "&#xf10a; tablet light",
			"fab fa-tablet": "&#xf10a; tablet duotone",
			"fas fa-table-tennis": "&#xf45d; Table Tennis solid",
			"far fa-table-tennis": "&#xf45d; Table Tennis regular",
			"fal fa-table-tennis": "&#xf45d; Table Tennis light",
			"fab fa-table-tennis": "&#xf45d; Table Tennis duotone",
			"fas fa-table": "&#xf0ce; table solid",
			"far fa-table": "&#xf0ce; table regular",
			"fal fa-table": "&#xf0ce; table light",
			"fab fa-table": "&#xf0ce; table duotone",
			"fas fa-syringe": "&#xf48e; Syringe solid",
			"far fa-syringe": "&#xf48e; Syringe regular",
			"fal fa-syringe": "&#xf48e; Syringe light",
			"fab fa-syringe": "&#xf48e; Syringe duotone",
			"fas fa-sync-alt": "&#xf2f1; Alternate Sync solid",
			"far fa-sync-alt": "&#xf2f1; Alternate Sync regular",
			"fal fa-sync-alt": "&#xf2f1; Alternate Sync light",
			"fab fa-sync-alt": "&#xf2f1; Alternate Sync duotone",
			"fas fa-sync": "&#xf021; Sync solid",
			"far fa-sync": "&#xf021; Sync regular",
			"fal fa-sync": "&#xf021; Sync light",
			"fab fa-sync": "&#xf021; Sync duotone",
			"fas fa-synagogue": "&#xf69b; Synagogue solid",
			"far fa-synagogue": "&#xf69b; Synagogue regular",
			"fal fa-synagogue": "&#xf69b; Synagogue light",
			"fab fa-synagogue": "&#xf69b; Synagogue duotone",
			"fab fa-symfony": "&#xf83d; Symfony brands",
			"fas fa-swords": "&#xf71d; Swords solid",
			"far fa-swords": "&#xf71d; Swords regular",
			"fal fa-swords": "&#xf71d; Swords light",
			"fab fa-swords": "&#xf71d; Swords duotone",
			"fas fa-sword": "&#xf71c; Sword solid",
			"far fa-sword": "&#xf71c; Sword regular",
			"fal fa-sword": "&#xf71c; Sword light",
			"fab fa-sword": "&#xf71c; Sword duotone",
			"fas fa-swimming-pool": "&#xf5c5; Swimming Pool solid",
			"far fa-swimming-pool": "&#xf5c5; Swimming Pool regular",
			"fal fa-swimming-pool": "&#xf5c5; Swimming Pool light",
			"fab fa-swimming-pool": "&#xf5c5; Swimming Pool duotone",
			"fas fa-swimmer": "&#xf5c4; Swimmer solid",
			"far fa-swimmer": "&#xf5c4; Swimmer regular",
			"fal fa-swimmer": "&#xf5c4; Swimmer light",
			"fab fa-swimmer": "&#xf5c4; Swimmer duotone",
			"fab fa-swift": "&#xf8e1; Swift brands",
			"fas fa-swatchbook": "&#xf5c3; Swatchbook solid",
			"far fa-swatchbook": "&#xf5c3; Swatchbook regular",
			"fal fa-swatchbook": "&#xf5c3; Swatchbook light",
			"fab fa-swatchbook": "&#xf5c3; Swatchbook duotone",
			"fab fa-suse": "&#xf7d6; Suse brands",
			"fas fa-surprise": "&#xf5c2; Hushed Face solid",
			"far fa-surprise": "&#xf5c2; Hushed Face regular",
			"fal fa-surprise": "&#xf5c2; Hushed Face light",
			"fab fa-surprise": "&#xf5c2; Hushed Face duotone",
			"fab fa-supple": "&#xf3f9; Supple brands",
			"fas fa-superscript": "&#xf12b; superscript solid",
			"far fa-superscript": "&#xf12b; superscript regular",
			"fal fa-superscript": "&#xf12b; superscript light",
			"fab fa-superscript": "&#xf12b; superscript duotone",
			"fab fa-superpowers": "&#xf2dd; Superpowers brands",
			"fas fa-sunset": "&#xf767; Sunset solid",
			"far fa-sunset": "&#xf767; Sunset regular",
			"fal fa-sunset": "&#xf767; Sunset light",
			"fab fa-sunset": "&#xf767; Sunset duotone",
			"fas fa-sunrise": "&#xf766; Sunrise solid",
			"far fa-sunrise": "&#xf766; Sunrise regular",
			"fal fa-sunrise": "&#xf766; Sunrise light",
			"fab fa-sunrise": "&#xf766; Sunrise duotone",
			"fas fa-sunglasses": "&#xf892; Sunglasses solid",
			"far fa-sunglasses": "&#xf892; Sunglasses regular",
			"fal fa-sunglasses": "&#xf892; Sunglasses light",
			"fab fa-sunglasses": "&#xf892; Sunglasses duotone",
			"fas fa-sun-haze": "&#xf765; Sun Haze solid",
			"far fa-sun-haze": "&#xf765; Sun Haze regular",
			"fal fa-sun-haze": "&#xf765; Sun Haze light",
			"fab fa-sun-haze": "&#xf765; Sun Haze duotone",
			"fas fa-sun-dust": "&#xf764; Sun Dust solid",
			"far fa-sun-dust": "&#xf764; Sun Dust regular",
			"fal fa-sun-dust": "&#xf764; Sun Dust light",
			"fab fa-sun-dust": "&#xf764; Sun Dust duotone",
			"fas fa-sun-cloud": "&#xf763; Sun with Cloud solid",
			"far fa-sun-cloud": "&#xf763; Sun with Cloud regular",
			"fal fa-sun-cloud": "&#xf763; Sun with Cloud light",
			"fab fa-sun-cloud": "&#xf763; Sun with Cloud duotone",
			"fas fa-sun": "&#xf185; Sun solid",
			"far fa-sun": "&#xf185; Sun regular",
			"fal fa-sun": "&#xf185; Sun light",
			"fab fa-sun": "&#xf185; Sun duotone",
			"fas fa-suitcase-rolling": "&#xf5c1; Suitcase Rolling solid",
			"far fa-suitcase-rolling": "&#xf5c1; Suitcase Rolling regular",
			"fal fa-suitcase-rolling": "&#xf5c1; Suitcase Rolling light",
			"fab fa-suitcase-rolling": "&#xf5c1; Suitcase Rolling duotone",
			"fas fa-suitcase": "&#xf0f2; Suitcase solid",
			"far fa-suitcase": "&#xf0f2; Suitcase regular",
			"fal fa-suitcase": "&#xf0f2; Suitcase light",
			"fab fa-suitcase": "&#xf0f2; Suitcase duotone",
			"fas fa-subway": "&#xf239; Subway solid",
			"far fa-subway": "&#xf239; Subway regular",
			"fal fa-subway": "&#xf239; Subway light",
			"fab fa-subway": "&#xf239; Subway duotone",
			"fas fa-subscript": "&#xf12c; subscript solid",
			"far fa-subscript": "&#xf12c; subscript regular",
			"fal fa-subscript": "&#xf12c; subscript light",
			"fab fa-subscript": "&#xf12c; subscript duotone",
			"fab fa-stumbleupon-circle": "&#xf1a3; StumbleUpon Circle brands",
			"fab fa-stumbleupon": "&#xf1a4; StumbleUpon Logo brands",
			"fab fa-studiovinari": "&#xf3f8; Studio Vinari brands",
			"fas fa-stroopwafel": "&#xf551; Stroopwafel solid",
			"far fa-stroopwafel": "&#xf551; Stroopwafel regular",
			"fal fa-stroopwafel": "&#xf551; Stroopwafel light",
			"fab fa-stroopwafel": "&#xf551; Stroopwafel duotone",
			"fab fa-stripe-s": "&#xf42a; Stripe S brands",
			"fab fa-stripe": "&#xf429; Stripe brands",
			"fas fa-strikethrough": "&#xf0cc; Strikethrough solid",
			"far fa-strikethrough": "&#xf0cc; Strikethrough regular",
			"fal fa-strikethrough": "&#xf0cc; Strikethrough light",
			"fab fa-strikethrough": "&#xf0cc; Strikethrough duotone",
			"fas fa-stretcher": "&#xf825; Stretcher solid",
			"far fa-stretcher": "&#xf825; Stretcher regular",
			"fal fa-stretcher": "&#xf825; Stretcher light",
			"fab fa-stretcher": "&#xf825; Stretcher duotone",
			"fas fa-street-view": "&#xf21d; Street View solid",
			"far fa-street-view": "&#xf21d; Street View regular",
			"fal fa-street-view": "&#xf21d; Street View light",
			"fab fa-street-view": "&#xf21d; Street View duotone",
			"fas fa-stream": "&#xf550; Stream solid",
			"far fa-stream": "&#xf550; Stream regular",
			"fal fa-stream": "&#xf550; Stream light",
			"fab fa-stream": "&#xf550; Stream duotone",
			"fab fa-strava": "&#xf428; Strava brands",
			"fas fa-store-alt": "&#xf54f; Alternate Store solid",
			"far fa-store-alt": "&#xf54f; Alternate Store regular",
			"fal fa-store-alt": "&#xf54f; Alternate Store light",
			"fab fa-store-alt": "&#xf54f; Alternate Store duotone",
			"fas fa-store": "&#xf54e; Store solid",
			"far fa-store": "&#xf54e; Store regular",
			"fal fa-store": "&#xf54e; Store light",
			"fab fa-store": "&#xf54e; Store duotone",
			"fas fa-stopwatch": "&#xf2f2; Stopwatch solid",
			"far fa-stopwatch": "&#xf2f2; Stopwatch regular",
			"fal fa-stopwatch": "&#xf2f2; Stopwatch light",
			"fab fa-stopwatch": "&#xf2f2; Stopwatch duotone",
			"fas fa-stop-circle": "&#xf28d; Stop Circle solid",
			"far fa-stop-circle": "&#xf28d; Stop Circle regular",
			"fal fa-stop-circle": "&#xf28d; Stop Circle light",
			"fab fa-stop-circle": "&#xf28d; Stop Circle duotone",
			"fas fa-stop": "&#xf04d; stop solid",
			"far fa-stop": "&#xf04d; stop regular",
			"fal fa-stop": "&#xf04d; stop light",
			"fab fa-stop": "&#xf04d; stop duotone",
			"fas fa-stomach": "&#xf623; Stomach solid",
			"far fa-stomach": "&#xf623; Stomach regular",
			"fal fa-stomach": "&#xf623; Stomach light",
			"fab fa-stomach": "&#xf623; Stomach duotone",
			"fas fa-stocking": "&#xf7d5; Stocking solid",
			"far fa-stocking": "&#xf7d5; Stocking regular",
			"fal fa-stocking": "&#xf7d5; Stocking light",
			"fab fa-stocking": "&#xf7d5; Stocking duotone",
			"fas fa-sticky-note": "&#xf249; Sticky Note solid",
			"far fa-sticky-note": "&#xf249; Sticky Note regular",
			"fal fa-sticky-note": "&#xf249; Sticky Note light",
			"fab fa-sticky-note": "&#xf249; Sticky Note duotone",
			"fab fa-sticker-mule": "&#xf3f7; Sticker Mule brands",
			"fas fa-stethoscope": "&#xf0f1; Stethoscope solid",
			"far fa-stethoscope": "&#xf0f1; Stethoscope regular",
			"fal fa-stethoscope": "&#xf0f1; Stethoscope light",
			"fab fa-stethoscope": "&#xf0f1; Stethoscope duotone",
			"fas fa-step-forward": "&#xf051; step-forward solid",
			"far fa-step-forward": "&#xf051; step-forward regular",
			"fal fa-step-forward": "&#xf051; step-forward light",
			"fab fa-step-forward": "&#xf051; step-forward duotone",
			"fas fa-step-backward": "&#xf048; step-backward solid",
			"far fa-step-backward": "&#xf048; step-backward regular",
			"fal fa-step-backward": "&#xf048; step-backward light",
			"fab fa-step-backward": "&#xf048; step-backward duotone",
			"fas fa-steering-wheel": "&#xf622; Wheel Steering solid",
			"far fa-steering-wheel": "&#xf622; Wheel Steering regular",
			"fal fa-steering-wheel": "&#xf622; Wheel Steering light",
			"fab fa-steering-wheel": "&#xf622; Wheel Steering duotone",
			"fab fa-steam-symbol": "&#xf3f6; Steam Symbol brands",
			"fab fa-steam-square": "&#xf1b7; Steam Square brands",
			"fab fa-steam": "&#xf1b6; Steam brands",
			"fas fa-steak": "&#xf824; Steak solid",
			"far fa-steak": "&#xf824; Steak regular",
			"fal fa-steak": "&#xf824; Steak light",
			"fab fa-steak": "&#xf824; Steak duotone",
			"fab fa-staylinked": "&#xf3f5; StayLinked brands",
			"fas fa-stars": "&#xf762; Stars solid",
			"far fa-stars": "&#xf762; Stars regular",
			"fal fa-stars": "&#xf762; Stars light",
			"fab fa-stars": "&#xf762; Stars duotone",
			"fas fa-star-of-life": "&#xf621; Star of Life solid",
			"far fa-star-of-life": "&#xf621; Star of Life regular",
			"fal fa-star-of-life": "&#xf621; Star of Life light",
			"fab fa-star-of-life": "&#xf621; Star of Life duotone",
			"fas fa-star-of-david": "&#xf69a; Star of David solid",
			"far fa-star-of-david": "&#xf69a; Star of David regular",
			"fal fa-star-of-david": "&#xf69a; Star of David light",
			"fab fa-star-of-david": "&#xf69a; Star of David duotone",
			"fas fa-star-half-alt": "&#xf5c0; Alternate Star Half solid",
			"far fa-star-half-alt": "&#xf5c0; Alternate Star Half regular",
			"fal fa-star-half-alt": "&#xf5c0; Alternate Star Half light",
			"fab fa-star-half-alt": "&#xf5c0; Alternate Star Half duotone",
			"fas fa-star-half": "&#xf089; star-half solid",
			"far fa-star-half": "&#xf089; star-half regular",
			"fal fa-star-half": "&#xf089; star-half light",
			"fab fa-star-half": "&#xf089; star-half duotone",
			"fas fa-star-exclamation": "&#xf2f3; Exclamation Star solid",
			"far fa-star-exclamation": "&#xf2f3; Exclamation Star regular",
			"fal fa-star-exclamation": "&#xf2f3; Exclamation Star light",
			"fab fa-star-exclamation": "&#xf2f3; Exclamation Star duotone",
			"fas fa-star-christmas": "&#xf7d4; Christmas Star solid",
			"far fa-star-christmas": "&#xf7d4; Christmas Star regular",
			"fal fa-star-christmas": "&#xf7d4; Christmas Star light",
			"fab fa-star-christmas": "&#xf7d4; Christmas Star duotone",
			"fas fa-star-and-crescent": "&#xf699; Star and Crescent solid",
			"far fa-star-and-crescent": "&#xf699; Star and Crescent regular",
			"fal fa-star-and-crescent": "&#xf699; Star and Crescent light",
			"fab fa-star-and-crescent": "&#xf699; Star and Crescent duotone",
			"fas fa-star": "&#xf005; Star solid",
			"far fa-star": "&#xf005; Star regular",
			"fal fa-star": "&#xf005; Star light",
			"fab fa-star": "&#xf005; Star duotone",
			"fas fa-stamp": "&#xf5bf; Stamp solid",
			"far fa-stamp": "&#xf5bf; Stamp regular",
			"fal fa-stamp": "&#xf5bf; Stamp light",
			"fab fa-stamp": "&#xf5bf; Stamp duotone",
			"fas fa-staff": "&#xf71b; Staff solid",
			"far fa-staff": "&#xf71b; Staff regular",
			"fal fa-staff": "&#xf71b; Staff light",
			"fab fa-staff": "&#xf71b; Staff duotone",
			"fab fa-stackpath": "&#xf842; Stackpath brands",
			"fab fa-stack-overflow": "&#xf16c; Stack Overflow brands",
			"fab fa-stack-exchange": "&#xf18d; Stack Exchange brands",
			"fas fa-squirrel": "&#xf71a; Squirrel solid",
			"far fa-squirrel": "&#xf71a; Squirrel regular",
			"fal fa-squirrel": "&#xf71a; Squirrel light",
			"fab fa-squirrel": "&#xf71a; Squirrel duotone",
			"fab fa-squarespace": "&#xf5be; Squarespace brands",
			"fas fa-square-root-alt": "&#xf698; Alternate Square Root solid",
			"far fa-square-root-alt": "&#xf698; Alternate Square Root regular",
			"fal fa-square-root-alt": "&#xf698; Alternate Square Root light",
			"fab fa-square-root-alt": "&#xf698; Alternate Square Root duotone",
			"fas fa-square-root": "&#xf697; Square Root solid",
			"far fa-square-root": "&#xf697; Square Root regular",
			"fal fa-square-root": "&#xf697; Square Root light",
			"fab fa-square-root": "&#xf697; Square Root duotone",
			"fas fa-square-full": "&#xf45c; Square Full solid",
			"far fa-square-full": "&#xf45c; Square Full regular",
			"fal fa-square-full": "&#xf45c; Square Full light",
			"fab fa-square-full": "&#xf45c; Square Full duotone",
			"fas fa-square": "&#xf0c8; Square solid",
			"far fa-square": "&#xf0c8; Square regular",
			"fal fa-square": "&#xf0c8; Square light",
			"fab fa-square": "&#xf0c8; Square duotone",
			"fas fa-spray-can": "&#xf5bd; Spray Can solid",
			"far fa-spray-can": "&#xf5bd; Spray Can regular",
			"fal fa-spray-can": "&#xf5bd; Spray Can light",
			"fab fa-spray-can": "&#xf5bd; Spray Can duotone",
			"fab fa-spotify": "&#xf1bc; Spotify brands",
			"fas fa-splotch": "&#xf5bc; Splotch solid",
			"far fa-splotch": "&#xf5bc; Splotch regular",
			"fal fa-splotch": "&#xf5bc; Splotch light",
			"fab fa-splotch": "&#xf5bc; Splotch duotone",
			"fas fa-spinner-third": "&#xf3f4; Spinner Third solid",
			"far fa-spinner-third": "&#xf3f4; Spinner Third regular",
			"fal fa-spinner-third": "&#xf3f4; Spinner Third light",
			"fab fa-spinner-third": "&#xf3f4; Spinner Third duotone",
			"fas fa-spinner": "&#xf110; Spinner solid",
			"far fa-spinner": "&#xf110; Spinner regular",
			"fal fa-spinner": "&#xf110; Spinner light",
			"fab fa-spinner": "&#xf110; Spinner duotone",
			"fas fa-spider-web": "&#xf719; Spider Web solid",
			"far fa-spider-web": "&#xf719; Spider Web regular",
			"fal fa-spider-web": "&#xf719; Spider Web light",
			"fab fa-spider-web": "&#xf719; Spider Web duotone",
			"fas fa-spider-black-widow": "&#xf718; Black Widow Spider solid",
			"far fa-spider-black-widow": "&#xf718; Black Widow Spider regular",
			"fal fa-spider-black-widow": "&#xf718; Black Widow Spider light",
			"fab fa-spider-black-widow": "&#xf718; Black Widow Spider duotone",
			"fas fa-spider": "&#xf717; Spider solid",
			"far fa-spider": "&#xf717; Spider regular",
			"fal fa-spider": "&#xf717; Spider light",
			"fab fa-spider": "&#xf717; Spider duotone",
			"fas fa-spell-check": "&#xf891; Spell Check solid",
			"far fa-spell-check": "&#xf891; Spell Check regular",
			"fal fa-spell-check": "&#xf891; Spell Check light",
			"fab fa-spell-check": "&#xf891; Spell Check duotone",
			"fas fa-speakers": "&#xf8e0; Speakers solid",
			"far fa-speakers": "&#xf8e0; Speakers regular",
			"fal fa-speakers": "&#xf8e0; Speakers light",
			"fab fa-speakers": "&#xf8e0; Speakers duotone",
			"fab fa-speaker-deck": "&#xf83c; Speaker Deck brands",
			"fas fa-speaker": "&#xf8df; Speaker solid",
			"far fa-speaker": "&#xf8df; Speaker regular",
			"fal fa-speaker": "&#xf8df; Speaker light",
			"fab fa-speaker": "&#xf8df; Speaker duotone",
			"fab fa-speakap": "&#xf3f3; Speakap brands",
			"fas fa-sparkles": "&#xf890; Sparkles solid",
			"far fa-sparkles": "&#xf890; Sparkles regular",
			"fal fa-sparkles": "&#xf890; Sparkles light",
			"fab fa-sparkles": "&#xf890; Sparkles duotone",
			"fas fa-spade": "&#xf2f4; Spade solid",
			"far fa-spade": "&#xf2f4; Spade regular",
			"fal fa-spade": "&#xf2f4; Spade light",
			"fab fa-spade": "&#xf2f4; Spade duotone",
			"fas fa-space-shuttle": "&#xf197; Space Shuttle solid",
			"far fa-space-shuttle": "&#xf197; Space Shuttle regular",
			"fal fa-space-shuttle": "&#xf197; Space Shuttle light",
			"fab fa-space-shuttle": "&#xf197; Space Shuttle duotone",
			"fas fa-spa": "&#xf5bb; Spa solid",
			"far fa-spa": "&#xf5bb; Spa regular",
			"fal fa-spa": "&#xf5bb; Spa light",
			"fab fa-spa": "&#xf5bb; Spa duotone",
			"fab fa-sourcetree": "&#xf7d3; Sourcetree brands",
			"fas fa-soup": "&#xf823; Soup solid",
			"far fa-soup": "&#xf823; Soup regular",
			"fal fa-soup": "&#xf823; Soup light",
			"fab fa-soup": "&#xf823; Soup duotone",
			"fab fa-soundcloud": "&#xf1be; SoundCloud brands",
			"fas fa-sort-up": "&#xf0de; Sort Up (Ascending) solid",
			"far fa-sort-up": "&#xf0de; Sort Up (Ascending) regular",
			"fal fa-sort-up": "&#xf0de; Sort Up (Ascending) light",
			"fab fa-sort-up": "&#xf0de; Sort Up (Ascending) duotone",
			"fas fa-sort-size-up-alt": "&#xf88f; Alternate Sort Size Up solid",
			"far fa-sort-size-up-alt": "&#xf88f; Alternate Sort Size Up regular",
			"fal fa-sort-size-up-alt": "&#xf88f; Alternate Sort Size Up light",
			"fab fa-sort-size-up-alt": "&#xf88f; Alternate Sort Size Up duotone",
			"fas fa-sort-size-up": "&#xf88e; Sort Size Up solid",
			"far fa-sort-size-up": "&#xf88e; Sort Size Up regular",
			"fal fa-sort-size-up": "&#xf88e; Sort Size Up light",
			"fab fa-sort-size-up": "&#xf88e; Sort Size Up duotone",
			"fas fa-sort-size-down-alt": "&#xf88d; Alternate Sort Size Down solid",
			"far fa-sort-size-down-alt": "&#xf88d; Alternate Sort Size Down regular",
			"fal fa-sort-size-down-alt": "&#xf88d; Alternate Sort Size Down light",
			"fab fa-sort-size-down-alt": "&#xf88d; Alternate Sort Size Down duotone",
			"fas fa-sort-size-down": "&#xf88c; Sort Size Down solid",
			"far fa-sort-size-down": "&#xf88c; Sort Size Down regular",
			"fal fa-sort-size-down": "&#xf88c; Sort Size Down light",
			"fab fa-sort-size-down": "&#xf88c; Sort Size Down duotone",
			"fas fa-sort-shapes-up-alt": "&#xf88b; Alternate Sort Shapes Up solid",
			"far fa-sort-shapes-up-alt": "&#xf88b; Alternate Sort Shapes Up regular",
			"fal fa-sort-shapes-up-alt": "&#xf88b; Alternate Sort Shapes Up light",
			"fab fa-sort-shapes-up-alt": "&#xf88b; Alternate Sort Shapes Up duotone",
			"fas fa-sort-shapes-up": "&#xf88a; Sort Shapes Up solid",
			"far fa-sort-shapes-up": "&#xf88a; Sort Shapes Up regular",
			"fal fa-sort-shapes-up": "&#xf88a; Sort Shapes Up light",
			"fab fa-sort-shapes-up": "&#xf88a; Sort Shapes Up duotone",
			"fas fa-sort-shapes-down-alt": "&#xf889; Alternate Sort Shapes Down solid",
			"far fa-sort-shapes-down-alt": "&#xf889; Alternate Sort Shapes Down regular",
			"fal fa-sort-shapes-down-alt": "&#xf889; Alternate Sort Shapes Down light",
			"fab fa-sort-shapes-down-alt": "&#xf889; Alternate Sort Shapes Down duotone",
			"fas fa-sort-shapes-down": "&#xf888; Sort Shapes Down solid",
			"far fa-sort-shapes-down": "&#xf888; Sort Shapes Down regular",
			"fal fa-sort-shapes-down": "&#xf888; Sort Shapes Down light",
			"fab fa-sort-shapes-down": "&#xf888; Sort Shapes Down duotone",
			"fas fa-sort-numeric-up-alt": "&#xf887; Alternate Sort Numeric Up solid",
			"far fa-sort-numeric-up-alt": "&#xf887; Alternate Sort Numeric Up regular",
			"fal fa-sort-numeric-up-alt": "&#xf887; Alternate Sort Numeric Up light",
			"fab fa-sort-numeric-up-alt": "&#xf887; Alternate Sort Numeric Up duotone",
			"fas fa-sort-numeric-up": "&#xf163; Sort Numeric Up solid",
			"far fa-sort-numeric-up": "&#xf163; Sort Numeric Up regular",
			"fal fa-sort-numeric-up": "&#xf163; Sort Numeric Up light",
			"fab fa-sort-numeric-up": "&#xf163; Sort Numeric Up duotone",
			"fas fa-sort-numeric-down-alt": "&#xf886; Alternate Sort Numeric Down solid",
			"far fa-sort-numeric-down-alt": "&#xf886; Alternate Sort Numeric Down regular",
			"fal fa-sort-numeric-down-alt": "&#xf886; Alternate Sort Numeric Down light",
			"fab fa-sort-numeric-down-alt": "&#xf886; Alternate Sort Numeric Down duotone",
			"fas fa-sort-numeric-down": "&#xf162; Sort Numeric Down solid",
			"far fa-sort-numeric-down": "&#xf162; Sort Numeric Down regular",
			"fal fa-sort-numeric-down": "&#xf162; Sort Numeric Down light",
			"fab fa-sort-numeric-down": "&#xf162; Sort Numeric Down duotone",
			"fas fa-sort-down": "&#xf0dd; Sort Down (Descending) solid",
			"far fa-sort-down": "&#xf0dd; Sort Down (Descending) regular",
			"fal fa-sort-down": "&#xf0dd; Sort Down (Descending) light",
			"fab fa-sort-down": "&#xf0dd; Sort Down (Descending) duotone",
			"fas fa-sort-amount-up-alt": "&#xf885; Alternate Sort Amount Up solid",
			"far fa-sort-amount-up-alt": "&#xf885; Alternate Sort Amount Up regular",
			"fal fa-sort-amount-up-alt": "&#xf885; Alternate Sort Amount Up light",
			"fab fa-sort-amount-up-alt": "&#xf885; Alternate Sort Amount Up duotone",
			"fas fa-sort-amount-up": "&#xf161; Sort Amount Up solid",
			"far fa-sort-amount-up": "&#xf161; Sort Amount Up regular",
			"fal fa-sort-amount-up": "&#xf161; Sort Amount Up light",
			"fab fa-sort-amount-up": "&#xf161; Sort Amount Up duotone",
			"fas fa-sort-amount-down-alt": "&#xf884; Alternate Sort Amount Down solid",
			"far fa-sort-amount-down-alt": "&#xf884; Alternate Sort Amount Down regular",
			"fal fa-sort-amount-down-alt": "&#xf884; Alternate Sort Amount Down light",
			"fab fa-sort-amount-down-alt": "&#xf884; Alternate Sort Amount Down duotone",
			"fas fa-sort-amount-down": "&#xf160; Sort Amount Down solid",
			"far fa-sort-amount-down": "&#xf160; Sort Amount Down regular",
			"fal fa-sort-amount-down": "&#xf160; Sort Amount Down light",
			"fab fa-sort-amount-down": "&#xf160; Sort Amount Down duotone",
			"fas fa-sort-alt": "&#xf883; Alternate Sort solid",
			"far fa-sort-alt": "&#xf883; Alternate Sort regular",
			"fal fa-sort-alt": "&#xf883; Alternate Sort light",
			"fab fa-sort-alt": "&#xf883; Alternate Sort duotone",
			"fas fa-sort-alpha-up-alt": "&#xf882; Alternate Sort Alphabetical Up solid",
			"far fa-sort-alpha-up-alt": "&#xf882; Alternate Sort Alphabetical Up regular",
			"fal fa-sort-alpha-up-alt": "&#xf882; Alternate Sort Alphabetical Up light",
			"fab fa-sort-alpha-up-alt": "&#xf882; Alternate Sort Alphabetical Up duotone",
			"fas fa-sort-alpha-up": "&#xf15e; Sort Alphabetical Up solid",
			"far fa-sort-alpha-up": "&#xf15e; Sort Alphabetical Up regular",
			"fal fa-sort-alpha-up": "&#xf15e; Sort Alphabetical Up light",
			"fab fa-sort-alpha-up": "&#xf15e; Sort Alphabetical Up duotone",
			"fas fa-sort-alpha-down-alt": "&#xf881; Alternate Sort Alphabetical Down solid",
			"far fa-sort-alpha-down-alt": "&#xf881; Alternate Sort Alphabetical Down regular",
			"fal fa-sort-alpha-down-alt": "&#xf881; Alternate Sort Alphabetical Down light",
			"fab fa-sort-alpha-down-alt": "&#xf881; Alternate Sort Alphabetical Down duotone",
			"fas fa-sort-alpha-down": "&#xf15d; Sort Alphabetical Down solid",
			"far fa-sort-alpha-down": "&#xf15d; Sort Alphabetical Down regular",
			"fal fa-sort-alpha-down": "&#xf15d; Sort Alphabetical Down light",
			"fab fa-sort-alpha-down": "&#xf15d; Sort Alphabetical Down duotone",
			"fas fa-sort": "&#xf0dc; Sort solid",
			"far fa-sort": "&#xf0dc; Sort regular",
			"fal fa-sort": "&#xf0dc; Sort light",
			"fab fa-sort": "&#xf0dc; Sort duotone",
			"fas fa-solar-panel": "&#xf5ba; Solar Panel solid",
			"far fa-solar-panel": "&#xf5ba; Solar Panel regular",
			"fal fa-solar-panel": "&#xf5ba; Solar Panel light",
			"fab fa-solar-panel": "&#xf5ba; Solar Panel duotone",
			"fas fa-socks": "&#xf696; Socks solid",
			"far fa-socks": "&#xf696; Socks regular",
			"fal fa-socks": "&#xf696; Socks light",
			"fab fa-socks": "&#xf696; Socks duotone",
			"fas fa-snowplow": "&#xf7d2; Snowplow solid",
			"far fa-snowplow": "&#xf7d2; Snowplow regular",
			"fal fa-snowplow": "&#xf7d2; Snowplow light",
			"fab fa-snowplow": "&#xf7d2; Snowplow duotone",
			"fas fa-snowmobile": "&#xf7d1; Snowmobile solid",
			"far fa-snowmobile": "&#xf7d1; Snowmobile regular",
			"fal fa-snowmobile": "&#xf7d1; Snowmobile light",
			"fab fa-snowmobile": "&#xf7d1; Snowmobile duotone",
			"fas fa-snowman": "&#xf7d0; Snowman solid",
			"far fa-snowman": "&#xf7d0; Snowman regular",
			"fal fa-snowman": "&#xf7d0; Snowman light",
			"fab fa-snowman": "&#xf7d0; Snowman duotone",
			"fas fa-snowflakes": "&#xf7cf; Snowflakes solid",
			"far fa-snowflakes": "&#xf7cf; Snowflakes regular",
			"fal fa-snowflakes": "&#xf7cf; Snowflakes light",
			"fab fa-snowflakes": "&#xf7cf; Snowflakes duotone",
			"fas fa-snowflake": "&#xf2dc; Snowflake solid",
			"far fa-snowflake": "&#xf2dc; Snowflake regular",
			"fal fa-snowflake": "&#xf2dc; Snowflake light",
			"fab fa-snowflake": "&#xf2dc; Snowflake duotone",
			"fas fa-snowboarding": "&#xf7ce; Snowboarding solid",
			"far fa-snowboarding": "&#xf7ce; Snowboarding regular",
			"fal fa-snowboarding": "&#xf7ce; Snowboarding light",
			"fab fa-snowboarding": "&#xf7ce; Snowboarding duotone",
			"fas fa-snow-blowing": "&#xf761; Snow Blowing solid",
			"far fa-snow-blowing": "&#xf761; Snow Blowing regular",
			"fal fa-snow-blowing": "&#xf761; Snow Blowing light",
			"fab fa-snow-blowing": "&#xf761; Snow Blowing duotone",
			"fas fa-snooze": "&#xf880; Snooze solid",
			"far fa-snooze": "&#xf880; Snooze regular",
			"fal fa-snooze": "&#xf880; Snooze light",
			"fab fa-snooze": "&#xf880; Snooze duotone",
			"fab fa-snapchat-square": "&#xf2ad; Snapchat Square brands",
			"fab fa-snapchat-ghost": "&#xf2ac; Snapchat Ghost brands",
			"fab fa-snapchat": "&#xf2ab; Snapchat brands",
			"fas fa-snake": "&#xf716; Snake solid",
			"far fa-snake": "&#xf716; Snake regular",
			"fal fa-snake": "&#xf716; Snake light",
			"fab fa-snake": "&#xf716; Snake duotone",
			"fas fa-sms": "&#xf7cd; SMS solid",
			"far fa-sms": "&#xf7cd; SMS regular",
			"fal fa-sms": "&#xf7cd; SMS light",
			"fab fa-sms": "&#xf7cd; SMS duotone",
			"fas fa-smoking-ban": "&#xf54d; Smoking Ban solid",
			"far fa-smoking-ban": "&#xf54d; Smoking Ban regular",
			"fal fa-smoking-ban": "&#xf54d; Smoking Ban light",
			"fab fa-smoking-ban": "&#xf54d; Smoking Ban duotone",
			"fas fa-smoking": "&#xf48d; Smoking solid",
			"far fa-smoking": "&#xf48d; Smoking regular",
			"fal fa-smoking": "&#xf48d; Smoking light",
			"fab fa-smoking": "&#xf48d; Smoking duotone",
			"fas fa-smoke": "&#xf760; Smoke solid",
			"far fa-smoke": "&#xf760; Smoke regular",
			"fal fa-smoke": "&#xf760; Smoke light",
			"fab fa-smoke": "&#xf760; Smoke duotone",
			"fas fa-smog": "&#xf75f; Smog solid",
			"far fa-smog": "&#xf75f; Smog regular",
			"fal fa-smog": "&#xf75f; Smog light",
			"fab fa-smog": "&#xf75f; Smog duotone",
			"fas fa-smile-wink": "&#xf4da; Winking Face solid",
			"far fa-smile-wink": "&#xf4da; Winking Face regular",
			"fal fa-smile-wink": "&#xf4da; Winking Face light",
			"fab fa-smile-wink": "&#xf4da; Winking Face duotone",
			"fas fa-smile-plus": "&#xf5b9; Smiling Face Plus solid",
			"far fa-smile-plus": "&#xf5b9; Smiling Face Plus regular",
			"fal fa-smile-plus": "&#xf5b9; Smiling Face Plus light",
			"fab fa-smile-plus": "&#xf5b9; Smiling Face Plus duotone",
			"fas fa-smile-beam": "&#xf5b8; Beaming Face With Smiling Eyes solid",
			"far fa-smile-beam": "&#xf5b8; Beaming Face With Smiling Eyes regular",
			"fal fa-smile-beam": "&#xf5b8; Beaming Face With Smiling Eyes light",
			"fab fa-smile-beam": "&#xf5b8; Beaming Face With Smiling Eyes duotone",
			"fas fa-smile": "&#xf118; Smiling Face solid",
			"far fa-smile": "&#xf118; Smiling Face regular",
			"fal fa-smile": "&#xf118; Smiling Face light",
			"fab fa-smile": "&#xf118; Smiling Face duotone",
			"fab fa-slideshare": "&#xf1e7; Slideshare brands",
			"fas fa-sliders-v-square": "&#xf3f2; Square Vertical Sliders solid",
			"far fa-sliders-v-square": "&#xf3f2; Square Vertical Sliders regular",
			"fal fa-sliders-v-square": "&#xf3f2; Square Vertical Sliders light",
			"fab fa-sliders-v-square": "&#xf3f2; Square Vertical Sliders duotone",
			"fas fa-sliders-v": "&#xf3f1; Vertical Sliders solid",
			"far fa-sliders-v": "&#xf3f1; Vertical Sliders regular",
			"fal fa-sliders-v": "&#xf3f1; Vertical Sliders light",
			"fab fa-sliders-v": "&#xf3f1; Vertical Sliders duotone",
			"fas fa-sliders-h-square": "&#xf3f0; Square Horizontal Sliders solid",
			"far fa-sliders-h-square": "&#xf3f0; Square Horizontal Sliders regular",
			"fal fa-sliders-h-square": "&#xf3f0; Square Horizontal Sliders light",
			"fab fa-sliders-h-square": "&#xf3f0; Square Horizontal Sliders duotone",
			"fas fa-sliders-h": "&#xf1de; Horizontal Sliders solid",
			"far fa-sliders-h": "&#xf1de; Horizontal Sliders regular",
			"fal fa-sliders-h": "&#xf1de; Horizontal Sliders light",
			"fab fa-sliders-h": "&#xf1de; Horizontal Sliders duotone",
			"fas fa-sleigh": "&#xf7cc; Sleigh solid",
			"far fa-sleigh": "&#xf7cc; Sleigh regular",
			"fal fa-sleigh": "&#xf7cc; Sleigh light",
			"fab fa-sleigh": "&#xf7cc; Sleigh duotone",
			"fas fa-sledding": "&#xf7cb; Sledding solid",
			"far fa-sledding": "&#xf7cb; Sledding regular",
			"fal fa-sledding": "&#xf7cb; Sledding light",
			"fab fa-sledding": "&#xf7cb; Sledding duotone",
			"fas fa-slash": "&#xf715; Slash solid",
			"far fa-slash": "&#xf715; Slash regular",
			"fal fa-slash": "&#xf715; Slash light",
			"fab fa-slash": "&#xf715; Slash duotone",
			"fab fa-slack-hash": "&#xf3ef; Slack Hashtag brands",
			"fab fa-slack": "&#xf198; Slack Logo brands",
			"fab fa-skype": "&#xf17e; Skype brands",
			"fab fa-skyatlas": "&#xf216; skyatlas brands",
			"fas fa-skull-crossbones": "&#xf714; Skull & Crossbones solid",
			"far fa-skull-crossbones": "&#xf714; Skull & Crossbones regular",
			"fal fa-skull-crossbones": "&#xf714; Skull & Crossbones light",
			"fab fa-skull-crossbones": "&#xf714; Skull & Crossbones duotone",
			"fal fa-skull-cow": "&#xf8de; Cow Skull light",
			"far fa-skull-cow": "&#xf8de; Cow Skull regular",
			"fas fa-skull-cow": "&#xf8de; Cow Skull solid",
			"fab fa-skull-cow": "&#xf8de; Cow Skull duotone",
			"fas fa-skull": "&#xf54c; Skull solid",
			"far fa-skull": "&#xf54c; Skull regular",
			"fal fa-skull": "&#xf54c; Skull light",
			"fab fa-skull": "&#xf54c; Skull duotone",
			"fas fa-skiing-nordic": "&#xf7ca; Skiing Nordic solid",
			"far fa-skiing-nordic": "&#xf7ca; Skiing Nordic regular",
			"fal fa-skiing-nordic": "&#xf7ca; Skiing Nordic light",
			"fab fa-skiing-nordic": "&#xf7ca; Skiing Nordic duotone",
			"fas fa-skiing": "&#xf7c9; Skiing solid",
			"far fa-skiing": "&#xf7c9; Skiing regular",
			"fal fa-skiing": "&#xf7c9; Skiing light",
			"fab fa-skiing": "&#xf7c9; Skiing duotone",
			"fas fa-ski-lift": "&#xf7c8; Ski Lift solid",
			"far fa-ski-lift": "&#xf7c8; Ski Lift regular",
			"fal fa-ski-lift": "&#xf7c8; Ski Lift light",
			"fab fa-ski-lift": "&#xf7c8; Ski Lift duotone",
			"fas fa-ski-jump": "&#xf7c7; Ski Jump solid",
			"far fa-ski-jump": "&#xf7c7; Ski Jump regular",
			"fal fa-ski-jump": "&#xf7c7; Ski Jump light",
			"fab fa-ski-jump": "&#xf7c7; Ski Jump duotone",
			"fab fa-sketch": "&#xf7c6; Sketch brands",
			"fas fa-skeleton": "&#xf620; Skeleton solid",
			"far fa-skeleton": "&#xf620; Skeleton regular",
			"fal fa-skeleton": "&#xf620; Skeleton light",
			"fab fa-skeleton": "&#xf620; Skeleton duotone",
			"fas fa-skating": "&#xf7c5; Skating solid",
			"far fa-skating": "&#xf7c5; Skating regular",
			"fal fa-skating": "&#xf7c5; Skating light",
			"fab fa-skating": "&#xf7c5; Skating duotone",
			"fab fa-sith": "&#xf512; Sith brands",
			"fas fa-sitemap": "&#xf0e8; Sitemap solid",
			"far fa-sitemap": "&#xf0e8; Sitemap regular",
			"fal fa-sitemap": "&#xf0e8; Sitemap light",
			"fab fa-sitemap": "&#xf0e8; Sitemap duotone",
			"fab fa-sistrix": "&#xf3ee; SISTRIX brands",
			"fab fa-simplybuilt": "&#xf215; SimplyBuilt brands",
			"fas fa-sim-card": "&#xf7c4; SIM Card solid",
			"far fa-sim-card": "&#xf7c4; SIM Card regular",
			"fal fa-sim-card": "&#xf7c4; SIM Card light",
			"fab fa-sim-card": "&#xf7c4; SIM Card duotone",
			"fas fa-signature": "&#xf5b7; Signature solid",
			"far fa-signature": "&#xf5b7; Signature regular",
			"fal fa-signature": "&#xf5b7; Signature light",
			"fab fa-signature": "&#xf5b7; Signature duotone",
			"fas fa-signal-stream": "&#xf8dd; Signal Stream solid",
			"far fa-signal-stream": "&#xf8dd; Signal Stream regular",
			"fal fa-signal-stream": "&#xf8dd; Signal Stream light",
			"fab fa-signal-stream": "&#xf8dd; Signal Stream duotone",
			"fas fa-signal-slash": "&#xf695; Signal Slash solid",
			"far fa-signal-slash": "&#xf695; Signal Slash regular",
			"fal fa-signal-slash": "&#xf695; Signal Slash light",
			"fab fa-signal-slash": "&#xf695; Signal Slash duotone",
			"fas fa-signal-alt-slash": "&#xf694; Alternate Signal Slash solid",
			"far fa-signal-alt-slash": "&#xf694; Alternate Signal Slash regular",
			"fal fa-signal-alt-slash": "&#xf694; Alternate Signal Slash light",
			"fab fa-signal-alt-slash": "&#xf694; Alternate Signal Slash duotone",
			"fas fa-signal-alt-3": "&#xf693; Alternate Signal 3 solid",
			"far fa-signal-alt-3": "&#xf693; Alternate Signal 3 regular",
			"fal fa-signal-alt-3": "&#xf693; Alternate Signal 3 light",
			"fab fa-signal-alt-3": "&#xf693; Alternate Signal 3 duotone",
			"fas fa-signal-alt-2": "&#xf692; Alternate Signal 2 solid",
			"far fa-signal-alt-2": "&#xf692; Alternate Signal 2 regular",
			"fal fa-signal-alt-2": "&#xf692; Alternate Signal 2 light",
			"fab fa-signal-alt-2": "&#xf692; Alternate Signal 2 duotone",
			"fas fa-signal-alt-1": "&#xf691; Alternate Signal 1 solid",
			"far fa-signal-alt-1": "&#xf691; Alternate Signal 1 regular",
			"fal fa-signal-alt-1": "&#xf691; Alternate Signal 1 light",
			"fab fa-signal-alt-1": "&#xf691; Alternate Signal 1 duotone",
			"fas fa-signal-alt": "&#xf690; Alternate Signal solid",
			"far fa-signal-alt": "&#xf690; Alternate Signal regular",
			"fal fa-signal-alt": "&#xf690; Alternate Signal light",
			"fab fa-signal-alt": "&#xf690; Alternate Signal duotone",
			"fas fa-signal-4": "&#xf68f; Signal 4 solid",
			"far fa-signal-4": "&#xf68f; Signal 4 regular",
			"fal fa-signal-4": "&#xf68f; Signal 4 light",
			"fab fa-signal-4": "&#xf68f; Signal 4 duotone",
			"fas fa-signal-3": "&#xf68e; Signal 3 solid",
			"far fa-signal-3": "&#xf68e; Signal 3 regular",
			"fal fa-signal-3": "&#xf68e; Signal 3 light",
			"fab fa-signal-3": "&#xf68e; Signal 3 duotone",
			"fas fa-signal-2": "&#xf68d; Signal 2 solid",
			"far fa-signal-2": "&#xf68d; Signal 2 regular",
			"fal fa-signal-2": "&#xf68d; Signal 2 light",
			"fab fa-signal-2": "&#xf68d; Signal 2 duotone",
			"fas fa-signal-1": "&#xf68c; Signal 1 solid",
			"far fa-signal-1": "&#xf68c; Signal 1 regular",
			"fal fa-signal-1": "&#xf68c; Signal 1 light",
			"fab fa-signal-1": "&#xf68c; Signal 1 duotone",
			"fas fa-signal": "&#xf012; signal solid",
			"far fa-signal": "&#xf012; signal regular",
			"fal fa-signal": "&#xf012; signal light",
			"fab fa-signal": "&#xf012; signal duotone",
			"fas fa-sign-out-alt": "&#xf2f5; Alternate Sign Out solid",
			"far fa-sign-out-alt": "&#xf2f5; Alternate Sign Out regular",
			"fal fa-sign-out-alt": "&#xf2f5; Alternate Sign Out light",
			"fab fa-sign-out-alt": "&#xf2f5; Alternate Sign Out duotone",
			"fas fa-sign-out": "&#xf08b; Sign Out solid",
			"far fa-sign-out": "&#xf08b; Sign Out regular",
			"fal fa-sign-out": "&#xf08b; Sign Out light",
			"fab fa-sign-out": "&#xf08b; Sign Out duotone",
			"fas fa-sign-language": "&#xf2a7; Sign Language solid",
			"far fa-sign-language": "&#xf2a7; Sign Language regular",
			"fal fa-sign-language": "&#xf2a7; Sign Language light",
			"fab fa-sign-language": "&#xf2a7; Sign Language duotone",
			"fas fa-sign-in-alt": "&#xf2f6; Alternate Sign In solid",
			"far fa-sign-in-alt": "&#xf2f6; Alternate Sign In regular",
			"fal fa-sign-in-alt": "&#xf2f6; Alternate Sign In light",
			"fab fa-sign-in-alt": "&#xf2f6; Alternate Sign In duotone",
			"fas fa-sign-in": "&#xf090; Sign In solid",
			"far fa-sign-in": "&#xf090; Sign In regular",
			"fal fa-sign-in": "&#xf090; Sign In light",
			"fab fa-sign-in": "&#xf090; Sign In duotone",
			"fas fa-sign": "&#xf4d9; Sign solid",
			"far fa-sign": "&#xf4d9; Sign regular",
			"fal fa-sign": "&#xf4d9; Sign light",
			"fab fa-sign": "&#xf4d9; Sign duotone",
			"fas fa-sigma": "&#xf68b; Sigma (Summation) solid",
			"far fa-sigma": "&#xf68b; Sigma (Summation) regular",
			"fal fa-sigma": "&#xf68b; Sigma (Summation) light",
			"fab fa-sigma": "&#xf68b; Sigma (Summation) duotone",
			"fas fa-sickle": "&#xf822; Sickle solid",
			"far fa-sickle": "&#xf822; Sickle regular",
			"fal fa-sickle": "&#xf822; Sickle light",
			"fab fa-sickle": "&#xf822; Sickle duotone",
			"fas fa-shuttlecock": "&#xf45b; Shuttlecock solid",
			"far fa-shuttlecock": "&#xf45b; Shuttlecock regular",
			"fal fa-shuttlecock": "&#xf45b; Shuttlecock light",
			"fab fa-shuttlecock": "&#xf45b; Shuttlecock duotone",
			"fas fa-shuttle-van": "&#xf5b6; Shuttle Van solid",
			"far fa-shuttle-van": "&#xf5b6; Shuttle Van regular",
			"fal fa-shuttle-van": "&#xf5b6; Shuttle Van light",
			"fab fa-shuttle-van": "&#xf5b6; Shuttle Van duotone",
			"fas fa-shredder": "&#xf68a; Shredder solid",
			"far fa-shredder": "&#xf68a; Shredder regular",
			"fal fa-shredder": "&#xf68a; Shredder light",
			"fab fa-shredder": "&#xf68a; Shredder duotone",
			"fas fa-shower": "&#xf2cc; Shower solid",
			"far fa-shower": "&#xf2cc; Shower regular",
			"fal fa-shower": "&#xf2cc; Shower light",
			"fab fa-shower": "&#xf2cc; Shower duotone",
			"fas fa-shovel-snow": "&#xf7c3; Shovel Snow solid",
			"far fa-shovel-snow": "&#xf7c3; Shovel Snow regular",
			"fal fa-shovel-snow": "&#xf7c3; Shovel Snow light",
			"fab fa-shovel-snow": "&#xf7c3; Shovel Snow duotone",
			"fas fa-shovel": "&#xf713; Shovel solid",
			"far fa-shovel": "&#xf713; Shovel regular",
			"fal fa-shovel": "&#xf713; Shovel light",
			"fab fa-shovel": "&#xf713; Shovel duotone",
			"fab fa-shopware": "&#xf5b5; Shopware brands",
			"fas fa-shopping-cart": "&#xf07a; shopping-cart solid",
			"far fa-shopping-cart": "&#xf07a; shopping-cart regular",
			"fal fa-shopping-cart": "&#xf07a; shopping-cart light",
			"fab fa-shopping-cart": "&#xf07a; shopping-cart duotone",
			"fas fa-shopping-basket": "&#xf291; Shopping Basket solid",
			"far fa-shopping-basket": "&#xf291; Shopping Basket regular",
			"fal fa-shopping-basket": "&#xf291; Shopping Basket light",
			"fab fa-shopping-basket": "&#xf291; Shopping Basket duotone",
			"fas fa-shopping-bag": "&#xf290; Shopping Bag solid",
			"far fa-shopping-bag": "&#xf290; Shopping Bag regular",
			"fal fa-shopping-bag": "&#xf290; Shopping Bag light",
			"fab fa-shopping-bag": "&#xf290; Shopping Bag duotone",
			"fas fa-shoe-prints": "&#xf54b; Shoe Prints solid",
			"far fa-shoe-prints": "&#xf54b; Shoe Prints regular",
			"fal fa-shoe-prints": "&#xf54b; Shoe Prints light",
			"fab fa-shoe-prints": "&#xf54b; Shoe Prints duotone",
			"fas fa-shish-kebab": "&#xf821; Shish Kebab solid",
			"far fa-shish-kebab": "&#xf821; Shish Kebab regular",
			"fal fa-shish-kebab": "&#xf821; Shish Kebab light",
			"fab fa-shish-kebab": "&#xf821; Shish Kebab duotone",
			"fab fa-shirtsinbulk": "&#xf214; Shirts in Bulk brands",
			"fas fa-shipping-timed": "&#xf48c; Shipping Timed solid",
			"far fa-shipping-timed": "&#xf48c; Shipping Timed regular",
			"fal fa-shipping-timed": "&#xf48c; Shipping Timed light",
			"fab fa-shipping-timed": "&#xf48c; Shipping Timed duotone",
			"fas fa-shipping-fast": "&#xf48b; Shipping Fast solid",
			"far fa-shipping-fast": "&#xf48b; Shipping Fast regular",
			"fal fa-shipping-fast": "&#xf48b; Shipping Fast light",
			"fab fa-shipping-fast": "&#xf48b; Shipping Fast duotone",
			"fas fa-ship": "&#xf21a; Ship solid",
			"far fa-ship": "&#xf21a; Ship regular",
			"fal fa-ship": "&#xf21a; Ship light",
			"fab fa-ship": "&#xf21a; Ship duotone",
			"fas fa-shield-cross": "&#xf712; Shield Cross solid",
			"far fa-shield-cross": "&#xf712; Shield Cross regular",
			"fal fa-shield-cross": "&#xf712; Shield Cross light",
			"fab fa-shield-cross": "&#xf712; Shield Cross duotone",
			"fas fa-shield-check": "&#xf2f7; shield solid",
			"far fa-shield-check": "&#xf2f7; shield regular",
			"fal fa-shield-check": "&#xf2f7; shield light",
			"fab fa-shield-check": "&#xf2f7; shield duotone",
			"fas fa-shield-alt": "&#xf3ed; Alternate Shield solid",
			"far fa-shield-alt": "&#xf3ed; Alternate Shield regular",
			"fal fa-shield-alt": "&#xf3ed; Alternate Shield light",
			"fab fa-shield-alt": "&#xf3ed; Alternate Shield duotone",
			"fas fa-shield": "&#xf132; shield solid",
			"far fa-shield": "&#xf132; shield regular",
			"fal fa-shield": "&#xf132; shield light",
			"fab fa-shield": "&#xf132; shield duotone",
			"fas fa-shekel-sign": "&#xf20b; Shekel Sign solid",
			"far fa-shekel-sign": "&#xf20b; Shekel Sign regular",
			"fal fa-shekel-sign": "&#xf20b; Shekel Sign light",
			"fab fa-shekel-sign": "&#xf20b; Shekel Sign duotone",
			"fas fa-sheep": "&#xf711; Sheep solid",
			"far fa-sheep": "&#xf711; Sheep regular",
			"fal fa-sheep": "&#xf711; Sheep light",
			"fab fa-sheep": "&#xf711; Sheep duotone",
			"fas fa-share-square": "&#xf14d; Share Square solid",
			"far fa-share-square": "&#xf14d; Share Square regular",
			"fal fa-share-square": "&#xf14d; Share Square light",
			"fab fa-share-square": "&#xf14d; Share Square duotone",
			"fas fa-share-alt-square": "&#xf1e1; Alternate Share Square solid",
			"far fa-share-alt-square": "&#xf1e1; Alternate Share Square regular",
			"fal fa-share-alt-square": "&#xf1e1; Alternate Share Square light",
			"fab fa-share-alt-square": "&#xf1e1; Alternate Share Square duotone",
			"fas fa-share-alt": "&#xf1e0; Alternate Share solid",
			"far fa-share-alt": "&#xf1e0; Alternate Share regular",
			"fal fa-share-alt": "&#xf1e0; Alternate Share light",
			"fab fa-share-alt": "&#xf1e0; Alternate Share duotone",
			"fas fa-share-all": "&#xf367; Share All solid",
			"far fa-share-all": "&#xf367; Share All regular",
			"fal fa-share-all": "&#xf367; Share All light",
			"fab fa-share-all": "&#xf367; Share All duotone",
			"fas fa-share": "&#xf064; Share solid",
			"far fa-share": "&#xf064; Share regular",
			"fal fa-share": "&#xf064; Share light",
			"fab fa-share": "&#xf064; Share duotone",
			"fas fa-shapes": "&#xf61f; Shapes solid",
			"far fa-shapes": "&#xf61f; Shapes regular",
			"fal fa-shapes": "&#xf61f; Shapes light",
			"fab fa-shapes": "&#xf61f; Shapes duotone",
			"fab fa-servicestack": "&#xf3ec; Servicestack brands",
			"fas fa-server": "&#xf233; Server solid",
			"far fa-server": "&#xf233; Server regular",
			"fal fa-server": "&#xf233; Server light",
			"fab fa-server": "&#xf233; Server duotone",
			"fas fa-send-backward": "&#xf87f; Send Backward solid",
			"far fa-send-backward": "&#xf87f; Send Backward regular",
			"fal fa-send-backward": "&#xf87f; Send Backward light",
			"fab fa-send-backward": "&#xf87f; Send Backward duotone",
			"fas fa-send-back": "&#xf87e; Send Back solid",
			"far fa-send-back": "&#xf87e; Send Back regular",
			"fal fa-send-back": "&#xf87e; Send Back light",
			"fab fa-send-back": "&#xf87e; Send Back duotone",
			"fab fa-sellsy": "&#xf213; Sellsy brands",
			"fab fa-sellcast": "&#xf2da; Sellcast brands",
			"fas fa-seedling": "&#xf4d8; Seedling solid",
			"far fa-seedling": "&#xf4d8; Seedling regular",
			"fal fa-seedling": "&#xf4d8; Seedling light",
			"fab fa-seedling": "&#xf4d8; Seedling duotone",
			"fab fa-searchengin": "&#xf3eb; Searchengin brands",
			"fas fa-search-plus": "&#xf00e; Search Plus solid",
			"far fa-search-plus": "&#xf00e; Search Plus regular",
			"fal fa-search-plus": "&#xf00e; Search Plus light",
			"fab fa-search-plus": "&#xf00e; Search Plus duotone",
			"fas fa-search-minus": "&#xf010; Search Minus solid",
			"far fa-search-minus": "&#xf010; Search Minus regular",
			"fal fa-search-minus": "&#xf010; Search Minus light",
			"fab fa-search-minus": "&#xf010; Search Minus duotone",
			"fas fa-search-location": "&#xf689; Search Location solid",
			"far fa-search-location": "&#xf689; Search Location regular",
			"fal fa-search-location": "&#xf689; Search Location light",
			"fab fa-search-location": "&#xf689; Search Location duotone",
			"fas fa-search-dollar": "&#xf688; Search Dollar solid",
			"far fa-search-dollar": "&#xf688; Search Dollar regular",
			"fal fa-search-dollar": "&#xf688; Search Dollar light",
			"fab fa-search-dollar": "&#xf688; Search Dollar duotone",
			"fas fa-search": "&#xf002; Search solid",
			"far fa-search": "&#xf002; Search regular",
			"fal fa-search": "&#xf002; Search light",
			"fab fa-search": "&#xf002; Search duotone",
			"fas fa-sd-card": "&#xf7c2; Sd Card solid",
			"far fa-sd-card": "&#xf7c2; Sd Card regular",
			"fal fa-sd-card": "&#xf7c2; Sd Card light",
			"fab fa-sd-card": "&#xf7c2; Sd Card duotone",
			"fas fa-scythe": "&#xf710; Scythe solid",
			"far fa-scythe": "&#xf710; Scythe regular",
			"fal fa-scythe": "&#xf710; Scythe light",
			"fab fa-scythe": "&#xf710; Scythe duotone",
			"fas fa-scrubber": "&#xf2f8; Scrubber solid",
			"far fa-scrubber": "&#xf2f8; Scrubber regular",
			"fal fa-scrubber": "&#xf2f8; Scrubber light",
			"fab fa-scrubber": "&#xf2f8; Scrubber duotone",
			"fas fa-scroll-old": "&#xf70f; Scroll Old solid",
			"far fa-scroll-old": "&#xf70f; Scroll Old regular",
			"fal fa-scroll-old": "&#xf70f; Scroll Old light",
			"fab fa-scroll-old": "&#xf70f; Scroll Old duotone",
			"fas fa-scroll": "&#xf70e; Scroll solid",
			"far fa-scroll": "&#xf70e; Scroll regular",
			"fal fa-scroll": "&#xf70e; Scroll light",
			"fab fa-scroll": "&#xf70e; Scroll duotone",
			"fab fa-scribd": "&#xf28a; Scribd brands",
			"fas fa-screwdriver": "&#xf54a; Screwdriver solid",
			"far fa-screwdriver": "&#xf54a; Screwdriver regular",
			"fal fa-screwdriver": "&#xf54a; Screwdriver light",
			"fab fa-screwdriver": "&#xf54a; Screwdriver duotone",
			"fas fa-school": "&#xf549; School solid",
			"far fa-school": "&#xf549; School regular",
			"fal fa-school": "&#xf549; School light",
			"fab fa-school": "&#xf549; School duotone",
			"fab fa-schlix": "&#xf3ea; SCHLIX brands",
			"fas fa-scarf": "&#xf7c1; Scarf solid",
			"far fa-scarf": "&#xf7c1; Scarf regular",
			"fal fa-scarf": "&#xf7c1; Scarf light",
			"fab fa-scarf": "&#xf7c1; Scarf duotone",
			"fas fa-scarecrow": "&#xf70d; Scarecrow solid",
			"far fa-scarecrow": "&#xf70d; Scarecrow regular",
			"fal fa-scarecrow": "&#xf70d; Scarecrow light",
			"fab fa-scarecrow": "&#xf70d; Scarecrow duotone",
			"fas fa-scanner-touchscreen": "&#xf48a; Scanner Touchscreen solid",
			"far fa-scanner-touchscreen": "&#xf48a; Scanner Touchscreen regular",
			"fal fa-scanner-touchscreen": "&#xf48a; Scanner Touchscreen light",
			"fab fa-scanner-touchscreen": "&#xf48a; Scanner Touchscreen duotone",
			"fas fa-scanner-keyboard": "&#xf489; Scanner Keyboard solid",
			"far fa-scanner-keyboard": "&#xf489; Scanner Keyboard regular",
			"fal fa-scanner-keyboard": "&#xf489; Scanner Keyboard light",
			"fab fa-scanner-keyboard": "&#xf489; Scanner Keyboard duotone",
			"fas fa-scanner-image": "&#xf8f3; Image Scanner solid",
			"far fa-scanner-image": "&#xf8f3; Image Scanner regular",
			"fal fa-scanner-image": "&#xf8f3; Image Scanner light",
			"fab fa-scanner-image": "&#xf8f3; Image Scanner duotone",
			"fas fa-scanner": "&#xf488; Scanner solid",
			"far fa-scanner": "&#xf488; Scanner regular",
			"fal fa-scanner": "&#xf488; Scanner light",
			"fab fa-scanner": "&#xf488; Scanner duotone",
			"fas fa-scalpel-path": "&#xf61e; Scalpel Path solid",
			"far fa-scalpel-path": "&#xf61e; Scalpel Path regular",
			"fal fa-scalpel-path": "&#xf61e; Scalpel Path light",
			"fab fa-scalpel-path": "&#xf61e; Scalpel Path duotone",
			"fas fa-scalpel": "&#xf61d; Scalpel solid",
			"far fa-scalpel": "&#xf61d; Scalpel regular",
			"fal fa-scalpel": "&#xf61d; Scalpel light",
			"fab fa-scalpel": "&#xf61d; Scalpel duotone",
			"fas fa-saxophone": "&#xf8dc; Saxophone solid",
			"far fa-saxophone": "&#xf8dc; Saxophone regular",
			"fal fa-saxophone": "&#xf8dc; Saxophone light",
			"fab fa-saxophone": "&#xf8dc; Saxophone duotone",
			"fas fa-sax-hot": "&#xf8db; Hot Saxophone solid",
			"far fa-sax-hot": "&#xf8db; Hot Saxophone regular",
			"fal fa-sax-hot": "&#xf8db; Hot Saxophone light",
			"fab fa-sax-hot": "&#xf8db; Hot Saxophone duotone",
			"fas fa-save": "&#xf0c7; Save solid",
			"far fa-save": "&#xf0c7; Save regular",
			"fal fa-save": "&#xf0c7; Save light",
			"fab fa-save": "&#xf0c7; Save duotone",
			"fas fa-sausage": "&#xf820; Sausage solid",
			"far fa-sausage": "&#xf820; Sausage regular",
			"fal fa-sausage": "&#xf820; Sausage light",
			"fab fa-sausage": "&#xf820; Sausage duotone",
			"fas fa-satellite-dish": "&#xf7c0; Satellite Dish solid",
			"far fa-satellite-dish": "&#xf7c0; Satellite Dish regular",
			"fal fa-satellite-dish": "&#xf7c0; Satellite Dish light",
			"fab fa-satellite-dish": "&#xf7c0; Satellite Dish duotone",
			"fas fa-satellite": "&#xf7bf; Satellite solid",
			"far fa-satellite": "&#xf7bf; Satellite regular",
			"fal fa-satellite": "&#xf7bf; Satellite light",
			"fab fa-satellite": "&#xf7bf; Satellite duotone",
			"fab fa-sass": "&#xf41e; Sass brands",
			"fas fa-sandwich": "&#xf81f; Sandwich solid",
			"far fa-sandwich": "&#xf81f; Sandwich regular",
			"fal fa-sandwich": "&#xf81f; Sandwich light",
			"fab fa-sandwich": "&#xf81f; Sandwich duotone",
			"fab fa-salesforce": "&#xf83b; Salesforce brands",
			"fas fa-salad": "&#xf81e; Salad solid",
			"far fa-salad": "&#xf81e; Salad regular",
			"fal fa-salad": "&#xf81e; Salad light",
			"fab fa-salad": "&#xf81e; Salad duotone",
			"fab fa-safari": "&#xf267; Safari brands",
			"fas fa-sad-tear": "&#xf5b4; Loudly Crying Face solid",
			"far fa-sad-tear": "&#xf5b4; Loudly Crying Face regular",
			"fal fa-sad-tear": "&#xf5b4; Loudly Crying Face light",
			"fab fa-sad-tear": "&#xf5b4; Loudly Crying Face duotone",
			"fas fa-sad-cry": "&#xf5b3; Crying Face solid",
			"far fa-sad-cry": "&#xf5b3; Crying Face regular",
			"fal fa-sad-cry": "&#xf5b3; Crying Face light",
			"fab fa-sad-cry": "&#xf5b3; Crying Face duotone",
			"fas fa-sack-dollar": "&#xf81d; Sack of Money solid",
			"far fa-sack-dollar": "&#xf81d; Sack of Money regular",
			"fal fa-sack-dollar": "&#xf81d; Sack of Money light",
			"fab fa-sack-dollar": "&#xf81d; Sack of Money duotone",
			"fas fa-sack": "&#xf81c; Sack solid",
			"far fa-sack": "&#xf81c; Sack regular",
			"fal fa-sack": "&#xf81c; Sack light",
			"fab fa-sack": "&#xf81c; Sack duotone",
			"fas fa-rv": "&#xf7be; R.V. solid",
			"far fa-rv": "&#xf7be; R.V. regular",
			"fal fa-rv": "&#xf7be; R.V. light",
			"fab fa-rv": "&#xf7be; R.V. duotone",
			"fas fa-rupee-sign": "&#xf156; Indian Rupee Sign solid",
			"far fa-rupee-sign": "&#xf156; Indian Rupee Sign regular",
			"fal fa-rupee-sign": "&#xf156; Indian Rupee Sign light",
			"fab fa-rupee-sign": "&#xf156; Indian Rupee Sign duotone",
			"fas fa-running": "&#xf70c; Running solid",
			"far fa-running": "&#xf70c; Running regular",
			"fal fa-running": "&#xf70c; Running light",
			"fab fa-running": "&#xf70c; Running duotone",
			"fas fa-ruler-vertical": "&#xf548; Ruler Vertical solid",
			"far fa-ruler-vertical": "&#xf548; Ruler Vertical regular",
			"fal fa-ruler-vertical": "&#xf548; Ruler Vertical light",
			"fab fa-ruler-vertical": "&#xf548; Ruler Vertical duotone",
			"fas fa-ruler-triangle": "&#xf61c; Ruler Triangle solid",
			"far fa-ruler-triangle": "&#xf61c; Ruler Triangle regular",
			"fal fa-ruler-triangle": "&#xf61c; Ruler Triangle light",
			"fab fa-ruler-triangle": "&#xf61c; Ruler Triangle duotone",
			"fas fa-ruler-horizontal": "&#xf547; Ruler Horizontal solid",
			"far fa-ruler-horizontal": "&#xf547; Ruler Horizontal regular",
			"fal fa-ruler-horizontal": "&#xf547; Ruler Horizontal light",
			"fab fa-ruler-horizontal": "&#xf547; Ruler Horizontal duotone",
			"fas fa-ruler-combined": "&#xf546; Ruler Combined solid",
			"far fa-ruler-combined": "&#xf546; Ruler Combined regular",
			"fal fa-ruler-combined": "&#xf546; Ruler Combined light",
			"fab fa-ruler-combined": "&#xf546; Ruler Combined duotone",
			"fas fa-ruler": "&#xf545; Ruler solid",
			"far fa-ruler": "&#xf545; Ruler regular",
			"fal fa-ruler": "&#xf545; Ruler light",
			"fab fa-ruler": "&#xf545; Ruler duotone",
			"fas fa-ruble-sign": "&#xf158; Ruble Sign solid",
			"far fa-ruble-sign": "&#xf158; Ruble Sign regular",
			"fal fa-ruble-sign": "&#xf158; Ruble Sign light",
			"fab fa-ruble-sign": "&#xf158; Ruble Sign duotone",
			"fas fa-rss-square": "&#xf143; RSS Square solid",
			"far fa-rss-square": "&#xf143; RSS Square regular",
			"fal fa-rss-square": "&#xf143; RSS Square light",
			"fab fa-rss-square": "&#xf143; RSS Square duotone",
			"fas fa-rss": "&#xf09e; rss solid",
			"far fa-rss": "&#xf09e; rss regular",
			"fal fa-rss": "&#xf09e; rss light",
			"fab fa-rss": "&#xf09e; rss duotone",
			"fas fa-router": "&#xf8da; Router solid",
			"far fa-router": "&#xf8da; Router regular",
			"fal fa-router": "&#xf8da; Router light",
			"fab fa-router": "&#xf8da; Router duotone",
			"fas fa-route-interstate": "&#xf61b; Route Interstate solid",
			"far fa-route-interstate": "&#xf61b; Route Interstate regular",
			"fal fa-route-interstate": "&#xf61b; Route Interstate light",
			"fab fa-route-interstate": "&#xf61b; Route Interstate duotone",
			"fas fa-route-highway": "&#xf61a; Route Highway solid",
			"far fa-route-highway": "&#xf61a; Route Highway regular",
			"fal fa-route-highway": "&#xf61a; Route Highway light",
			"fab fa-route-highway": "&#xf61a; Route Highway duotone",
			"fas fa-route": "&#xf4d7; Route solid",
			"far fa-route": "&#xf4d7; Route regular",
			"fal fa-route": "&#xf4d7; Route light",
			"fab fa-route": "&#xf4d7; Route duotone",
			"fab fa-rockrms": "&#xf3e9; Rockrms brands",
			"fab fa-rocketchat": "&#xf3e8; Rocket.Chat brands",
			"fas fa-rocket": "&#xf135; rocket solid",
			"far fa-rocket": "&#xf135; rocket regular",
			"fal fa-rocket": "&#xf135; rocket light",
			"fab fa-rocket": "&#xf135; rocket duotone",
			"fas fa-robot": "&#xf544; Robot solid",
			"far fa-robot": "&#xf544; Robot regular",
			"fal fa-robot": "&#xf544; Robot light",
			"fab fa-robot": "&#xf544; Robot duotone",
			"fas fa-road": "&#xf018; road solid",
			"far fa-road": "&#xf018; road regular",
			"fal fa-road": "&#xf018; road light",
			"fab fa-road": "&#xf018; road duotone",
			"fas fa-rings-wedding": "&#xf81b; Rings Wedding solid",
			"far fa-rings-wedding": "&#xf81b; Rings Wedding regular",
			"fal fa-rings-wedding": "&#xf81b; Rings Wedding light",
			"fab fa-rings-wedding": "&#xf81b; Rings Wedding duotone",
			"fas fa-ring": "&#xf70b; Ring solid",
			"far fa-ring": "&#xf70b; Ring regular",
			"fal fa-ring": "&#xf70b; Ring light",
			"fab fa-ring": "&#xf70b; Ring duotone",
			"fas fa-ribbon": "&#xf4d6; Ribbon solid",
			"far fa-ribbon": "&#xf4d6; Ribbon regular",
			"fal fa-ribbon": "&#xf4d6; Ribbon light",
			"fab fa-ribbon": "&#xf4d6; Ribbon duotone",
			"fab fa-rev": "&#xf5b2; Rev.io brands",
			"fas fa-retweet-alt": "&#xf361; Alternate Retweet solid",
			"far fa-retweet-alt": "&#xf361; Alternate Retweet regular",
			"fal fa-retweet-alt": "&#xf361; Alternate Retweet light",
			"fab fa-retweet-alt": "&#xf361; Alternate Retweet duotone",
			"fas fa-retweet": "&#xf079; Retweet solid",
			"far fa-retweet": "&#xf079; Retweet regular",
			"fal fa-retweet": "&#xf079; Retweet light",
			"fab fa-retweet": "&#xf079; Retweet duotone",
			"fas fa-restroom": "&#xf7bd; Restroom solid",
			"far fa-restroom": "&#xf7bd; Restroom regular",
			"fal fa-restroom": "&#xf7bd; Restroom light",
			"fab fa-restroom": "&#xf7bd; Restroom duotone",
			"fab fa-resolving": "&#xf3e7; Resolving brands",
			"fab fa-researchgate": "&#xf4f8; Researchgate brands",
			"fas fa-republican": "&#xf75e; Republican solid",
			"far fa-republican": "&#xf75e; Republican regular",
			"fal fa-republican": "&#xf75e; Republican light",
			"fab fa-republican": "&#xf75e; Republican duotone",
			"fab fa-replyd": "&#xf3e6; replyd brands",
			"fas fa-reply-all": "&#xf122; reply-all solid",
			"far fa-reply-all": "&#xf122; reply-all regular",
			"fal fa-reply-all": "&#xf122; reply-all light",
			"fab fa-reply-all": "&#xf122; reply-all duotone",
			"fas fa-reply": "&#xf3e5; Reply solid",
			"far fa-reply": "&#xf3e5; Reply regular",
			"fal fa-reply": "&#xf3e5; Reply light",
			"fab fa-reply": "&#xf3e5; Reply duotone",
			"fas fa-repeat-alt": "&#xf364; Alternate Repeat solid",
			"far fa-repeat-alt": "&#xf364; Alternate Repeat regular",
			"fal fa-repeat-alt": "&#xf364; Alternate Repeat light",
			"fab fa-repeat-alt": "&#xf364; Alternate Repeat duotone",
			"fas fa-repeat-1-alt": "&#xf366; Alternate Repeat 1 solid",
			"far fa-repeat-1-alt": "&#xf366; Alternate Repeat 1 regular",
			"fal fa-repeat-1-alt": "&#xf366; Alternate Repeat 1 light",
			"fab fa-repeat-1-alt": "&#xf366; Alternate Repeat 1 duotone",
			"fas fa-repeat-1": "&#xf365; Repeat 1 solid",
			"far fa-repeat-1": "&#xf365; Repeat 1 regular",
			"fal fa-repeat-1": "&#xf365; Repeat 1 light",
			"fab fa-repeat-1": "&#xf365; Repeat 1 duotone",
			"fas fa-repeat": "&#xf363; Repeat solid",
			"far fa-repeat": "&#xf363; Repeat regular",
			"fal fa-repeat": "&#xf363; Repeat light",
			"fab fa-repeat": "&#xf363; Repeat duotone",
			"fab fa-renren": "&#xf18b; Renren brands",
			"fas fa-remove-format": "&#xf87d; Remove Format solid",
			"far fa-remove-format": "&#xf87d; Remove Format regular",
			"fal fa-remove-format": "&#xf87d; Remove Format light",
			"fab fa-remove-format": "&#xf87d; Remove Format duotone",
			"fas fa-registered": "&#xf25d; Registered Trademark solid",
			"far fa-registered": "&#xf25d; Registered Trademark regular",
			"fal fa-registered": "&#xf25d; Registered Trademark light",
			"fab fa-registered": "&#xf25d; Registered Trademark duotone",
			"fas fa-redo-alt": "&#xf2f9; Alternate Redo solid",
			"far fa-redo-alt": "&#xf2f9; Alternate Redo regular",
			"fal fa-redo-alt": "&#xf2f9; Alternate Redo light",
			"fab fa-redo-alt": "&#xf2f9; Alternate Redo duotone",
			"fas fa-redo": "&#xf01e; Redo solid",
			"far fa-redo": "&#xf01e; Redo regular",
			"fal fa-redo": "&#xf01e; Redo light",
			"fab fa-redo": "&#xf01e; Redo duotone",
			"fab fa-redhat": "&#xf7bc; Redhat brands",
			"fab fa-reddit-square": "&#xf1a2; reddit Square brands",
			"fab fa-reddit-alien": "&#xf281; reddit Alien brands",
			"fab fa-reddit": "&#xf1a1; reddit Logo brands",
			"fab fa-red-river": "&#xf3e3; red river brands",
			"fas fa-recycle": "&#xf1b8; Recycle solid",
			"far fa-recycle": "&#xf1b8; Recycle regular",
			"fal fa-recycle": "&#xf1b8; Recycle light",
			"fab fa-recycle": "&#xf1b8; Recycle duotone",
			"fas fa-rectangle-wide": "&#xf2fc; Wide Rectangle solid",
			"far fa-rectangle-wide": "&#xf2fc; Wide Rectangle regular",
			"fal fa-rectangle-wide": "&#xf2fc; Wide Rectangle light",
			"fab fa-rectangle-wide": "&#xf2fc; Wide Rectangle duotone",
			"fas fa-rectangle-portrait": "&#xf2fb; Portrait Rectangle solid",
			"far fa-rectangle-portrait": "&#xf2fb; Portrait Rectangle regular",
			"fal fa-rectangle-portrait": "&#xf2fb; Portrait Rectangle light",
			"fab fa-rectangle-portrait": "&#xf2fb; Portrait Rectangle duotone",
			"fas fa-rectangle-landscape": "&#xf2fa; Landscape Rectangle solid",
			"far fa-rectangle-landscape": "&#xf2fa; Landscape Rectangle regular",
			"fal fa-rectangle-landscape": "&#xf2fa; Landscape Rectangle light",
			"fab fa-rectangle-landscape": "&#xf2fa; Landscape Rectangle duotone",
			"fas fa-record-vinyl": "&#xf8d9; Record Vinyl solid",
			"far fa-record-vinyl": "&#xf8d9; Record Vinyl regular",
			"fal fa-record-vinyl": "&#xf8d9; Record Vinyl light",
			"fab fa-record-vinyl": "&#xf8d9; Record Vinyl duotone",
			"fas fa-receipt": "&#xf543; Receipt solid",
			"far fa-receipt": "&#xf543; Receipt regular",
			"fal fa-receipt": "&#xf543; Receipt light",
			"fab fa-receipt": "&#xf543; Receipt duotone",
			"fab fa-rebel": "&#xf1d0; Rebel Alliance brands",
			"fab fa-readme": "&#xf4d5; ReadMe brands",
			"fab fa-reacteurope": "&#xf75d; ReactEurope brands",
			"fab fa-react": "&#xf41b; React brands",
			"fab fa-ravelry": "&#xf2d9; Ravelry brands",
			"fab fa-raspberry-pi": "&#xf7bb; Raspberry Pi brands",
			"fas fa-random": "&#xf074; random solid",
			"far fa-random": "&#xf074; random regular",
			"fal fa-random": "&#xf074; random light",
			"fab fa-random": "&#xf074; random duotone",
			"fas fa-ramp-loading": "&#xf4d4; Ramp Loading solid",
			"far fa-ramp-loading": "&#xf4d4; Ramp Loading regular",
			"fal fa-ramp-loading": "&#xf4d4; Ramp Loading light",
			"fab fa-ramp-loading": "&#xf4d4; Ramp Loading duotone",
			"fas fa-ram": "&#xf70a; Ram solid",
			"far fa-ram": "&#xf70a; Ram regular",
			"fal fa-ram": "&#xf70a; Ram light",
			"fab fa-ram": "&#xf70a; Ram duotone",
			"fas fa-raindrops": "&#xf75c; Raindrops solid",
			"far fa-raindrops": "&#xf75c; Raindrops regular",
			"fal fa-raindrops": "&#xf75c; Raindrops light",
			"fab fa-raindrops": "&#xf75c; Raindrops duotone",
			"fas fa-rainbow": "&#xf75b; Rainbow solid",
			"far fa-rainbow": "&#xf75b; Rainbow regular",
			"fal fa-rainbow": "&#xf75b; Rainbow light",
			"fab fa-rainbow": "&#xf75b; Rainbow duotone",
			"fas fa-radio-alt": "&#xf8d8; Alternate Radio solid",
			"far fa-radio-alt": "&#xf8d8; Alternate Radio regular",
			"fal fa-radio-alt": "&#xf8d8; Alternate Radio light",
			"fab fa-radio-alt": "&#xf8d8; Alternate Radio duotone",
			"fas fa-radio": "&#xf8d7; Radio solid",
			"far fa-radio": "&#xf8d7; Radio regular",
			"fal fa-radio": "&#xf8d7; Radio light",
			"fab fa-radio": "&#xf8d7; Radio duotone",
			"fas fa-radiation-alt": "&#xf7ba; Alternate Radiation solid",
			"far fa-radiation-alt": "&#xf7ba; Alternate Radiation regular",
			"fal fa-radiation-alt": "&#xf7ba; Alternate Radiation light",
			"fab fa-radiation-alt": "&#xf7ba; Alternate Radiation duotone",
			"fas fa-radiation": "&#xf7b9; Radiation solid",
			"far fa-radiation": "&#xf7b9; Radiation regular",
			"fal fa-radiation": "&#xf7b9; Radiation light",
			"fab fa-radiation": "&#xf7b9; Radiation duotone",
			"fas fa-racquet": "&#xf45a; Racquet solid",
			"far fa-racquet": "&#xf45a; Racquet regular",
			"fal fa-racquet": "&#xf45a; Racquet light",
			"fab fa-racquet": "&#xf45a; Racquet duotone",
			"fas fa-rabbit-fast": "&#xf709; Fast Rabbit solid",
			"far fa-rabbit-fast": "&#xf709; Fast Rabbit regular",
			"fal fa-rabbit-fast": "&#xf709; Fast Rabbit light",
			"fab fa-rabbit-fast": "&#xf709; Fast Rabbit duotone",
			"fas fa-rabbit": "&#xf708; Rabbit solid",
			"far fa-rabbit": "&#xf708; Rabbit regular",
			"fal fa-rabbit": "&#xf708; Rabbit light",
			"fab fa-rabbit": "&#xf708; Rabbit duotone",
			"fab fa-r-project": "&#xf4f7; R Project brands",
			"fas fa-quran": "&#xf687; Quran solid",
			"far fa-quran": "&#xf687; Quran regular",
			"fal fa-quran": "&#xf687; Quran light",
			"fab fa-quran": "&#xf687; Quran duotone",
			"fas fa-quote-right": "&#xf10e; quote-right solid",
			"far fa-quote-right": "&#xf10e; quote-right regular",
			"fal fa-quote-right": "&#xf10e; quote-right light",
			"fab fa-quote-right": "&#xf10e; quote-right duotone",
			"fas fa-quote-left": "&#xf10d; quote-left solid",
			"far fa-quote-left": "&#xf10d; quote-left regular",
			"fal fa-quote-left": "&#xf10d; quote-left light",
			"fab fa-quote-left": "&#xf10d; quote-left duotone",
			"fab fa-quora": "&#xf2c4; Quora brands",
			"fab fa-quinscape": "&#xf459; QuinScape brands",
			"fas fa-quidditch": "&#xf458; Quidditch solid",
			"far fa-quidditch": "&#xf458; Quidditch regular",
			"fal fa-quidditch": "&#xf458; Quidditch light",
			"fab fa-quidditch": "&#xf458; Quidditch duotone",
			"fas fa-question-square": "&#xf2fd; Question Square solid",
			"far fa-question-square": "&#xf2fd; Question Square regular",
			"fal fa-question-square": "&#xf2fd; Question Square light",
			"fab fa-question-square": "&#xf2fd; Question Square duotone",
			"fas fa-question-circle": "&#xf059; Question Circle solid",
			"far fa-question-circle": "&#xf059; Question Circle regular",
			"fal fa-question-circle": "&#xf059; Question Circle light",
			"fab fa-question-circle": "&#xf059; Question Circle duotone",
			"fas fa-question": "&#xf128; Question solid",
			"far fa-question": "&#xf128; Question regular",
			"fal fa-question": "&#xf128; Question light",
			"fab fa-question": "&#xf128; Question duotone",
			"fas fa-qrcode": "&#xf029; qrcode solid",
			"far fa-qrcode": "&#xf029; qrcode regular",
			"fal fa-qrcode": "&#xf029; qrcode light",
			"fab fa-qrcode": "&#xf029; qrcode duotone",
			"fab fa-qq": "&#xf1d6; QQ brands",
			"fab fa-python": "&#xf3e2; Python brands",
			"fas fa-puzzle-piece": "&#xf12e; Puzzle Piece solid",
			"far fa-puzzle-piece": "&#xf12e; Puzzle Piece regular",
			"fal fa-puzzle-piece": "&#xf12e; Puzzle Piece light",
			"fab fa-puzzle-piece": "&#xf12e; Puzzle Piece duotone",
			"fab fa-pushed": "&#xf3e1; Pushed brands",
			"fas fa-pumpkin": "&#xf707; Pumpkin solid",
			"far fa-pumpkin": "&#xf707; Pumpkin regular",
			"fal fa-pumpkin": "&#xf707; Pumpkin light",
			"fab fa-pumpkin": "&#xf707; Pumpkin duotone",
			"fas fa-projector": "&#xf8d6; Projector solid",
			"far fa-projector": "&#xf8d6; Projector regular",
			"fal fa-projector": "&#xf8d6; Projector light",
			"fab fa-projector": "&#xf8d6; Projector duotone",
			"fas fa-project-diagram": "&#xf542; Project Diagram solid",
			"far fa-project-diagram": "&#xf542; Project Diagram regular",
			"fal fa-project-diagram": "&#xf542; Project Diagram light",
			"fab fa-project-diagram": "&#xf542; Project Diagram duotone",
			"fab fa-product-hunt": "&#xf288; Product Hunt brands",
			"fas fa-procedures": "&#xf487; Procedures solid",
			"far fa-procedures": "&#xf487; Procedures regular",
			"fal fa-procedures": "&#xf487; Procedures light",
			"fab fa-procedures": "&#xf487; Procedures duotone",
			"fas fa-print-slash": "&#xf686; Print Slash solid",
			"far fa-print-slash": "&#xf686; Print Slash regular",
			"fal fa-print-slash": "&#xf686; Print Slash light",
			"fab fa-print-slash": "&#xf686; Print Slash duotone",
			"fas fa-print-search": "&#xf81a; Print Search solid",
			"far fa-print-search": "&#xf81a; Print Search regular",
			"fal fa-print-search": "&#xf81a; Print Search light",
			"fab fa-print-search": "&#xf81a; Print Search duotone",
			"fas fa-print": "&#xf02f; print solid",
			"far fa-print": "&#xf02f; print regular",
			"fal fa-print": "&#xf02f; print light",
			"fab fa-print": "&#xf02f; print duotone",
			"fas fa-presentation": "&#xf685; Presentation solid",
			"far fa-presentation": "&#xf685; Presentation regular",
			"fal fa-presentation": "&#xf685; Presentation light",
			"fab fa-presentation": "&#xf685; Presentation duotone",
			"fas fa-prescription-bottle-alt": "&#xf486; Alternate Prescription Bottle solid",
			"far fa-prescription-bottle-alt": "&#xf486; Alternate Prescription Bottle regular",
			"fal fa-prescription-bottle-alt": "&#xf486; Alternate Prescription Bottle light",
			"fab fa-prescription-bottle-alt": "&#xf486; Alternate Prescription Bottle duotone",
			"fas fa-prescription-bottle": "&#xf485; Prescription Bottle solid",
			"far fa-prescription-bottle": "&#xf485; Prescription Bottle regular",
			"fal fa-prescription-bottle": "&#xf485; Prescription Bottle light",
			"fab fa-prescription-bottle": "&#xf485; Prescription Bottle duotone",
			"fas fa-prescription": "&#xf5b1; Prescription solid",
			"far fa-prescription": "&#xf5b1; Prescription regular",
			"fal fa-prescription": "&#xf5b1; Prescription light",
			"fab fa-prescription": "&#xf5b1; Prescription duotone",
			"fas fa-praying-hands": "&#xf684; Praying Hands solid",
			"far fa-praying-hands": "&#xf684; Praying Hands regular",
			"fal fa-praying-hands": "&#xf684; Praying Hands light",
			"fab fa-praying-hands": "&#xf684; Praying Hands duotone",
			"fas fa-pray": "&#xf683; Pray solid",
			"far fa-pray": "&#xf683; Pray regular",
			"fal fa-pray": "&#xf683; Pray light",
			"fab fa-pray": "&#xf683; Pray duotone",
			"fas fa-power-off": "&#xf011; Power Off solid",
			"far fa-power-off": "&#xf011; Power Off regular",
			"fal fa-power-off": "&#xf011; Power Off light",
			"fab fa-power-off": "&#xf011; Power Off duotone",
			"fas fa-pound-sign": "&#xf154; Pound Sign solid",
			"far fa-pound-sign": "&#xf154; Pound Sign regular",
			"fal fa-pound-sign": "&#xf154; Pound Sign light",
			"fab fa-pound-sign": "&#xf154; Pound Sign duotone",
			"fas fa-portrait": "&#xf3e0; Portrait solid",
			"far fa-portrait": "&#xf3e0; Portrait regular",
			"fal fa-portrait": "&#xf3e0; Portrait light",
			"fab fa-portrait": "&#xf3e0; Portrait duotone",
			"fas fa-popcorn": "&#xf819; Popcorn solid",
			"far fa-popcorn": "&#xf819; Popcorn regular",
			"fal fa-popcorn": "&#xf819; Popcorn light",
			"fab fa-popcorn": "&#xf819; Popcorn duotone",
			"fas fa-poop": "&#xf619; Poop solid",
			"far fa-poop": "&#xf619; Poop regular",
			"fal fa-poop": "&#xf619; Poop light",
			"fab fa-poop": "&#xf619; Poop duotone",
			"fas fa-poo-storm": "&#xf75a; Poo Storm solid",
			"far fa-poo-storm": "&#xf75a; Poo Storm regular",
			"fal fa-poo-storm": "&#xf75a; Poo Storm light",
			"fab fa-poo-storm": "&#xf75a; Poo Storm duotone",
			"fas fa-poo": "&#xf2fe; Poo solid",
			"far fa-poo": "&#xf2fe; Poo regular",
			"fal fa-poo": "&#xf2fe; Poo light",
			"fab fa-poo": "&#xf2fe; Poo duotone",
			"fas fa-poll-people": "&#xf759; Poll People solid",
			"far fa-poll-people": "&#xf759; Poll People regular",
			"fal fa-poll-people": "&#xf759; Poll People light",
			"fab fa-poll-people": "&#xf759; Poll People duotone",
			"fas fa-poll-h": "&#xf682; Poll H solid",
			"far fa-poll-h": "&#xf682; Poll H regular",
			"fal fa-poll-h": "&#xf682; Poll H light",
			"fab fa-poll-h": "&#xf682; Poll H duotone",
			"fas fa-poll": "&#xf681; Poll solid",
			"far fa-poll": "&#xf681; Poll regular",
			"fal fa-poll": "&#xf681; Poll light",
			"fab fa-poll": "&#xf681; Poll duotone",
			"fas fa-podium-star": "&#xf758; Podium with Star solid",
			"far fa-podium-star": "&#xf758; Podium with Star regular",
			"fal fa-podium-star": "&#xf758; Podium with Star light",
			"fab fa-podium-star": "&#xf758; Podium with Star duotone",
			"fas fa-podium": "&#xf680; Podium solid",
			"far fa-podium": "&#xf680; Podium regular",
			"fal fa-podium": "&#xf680; Podium light",
			"fab fa-podium": "&#xf680; Podium duotone",
			"fas fa-podcast": "&#xf2ce; Podcast solid",
			"far fa-podcast": "&#xf2ce; Podcast regular",
			"fal fa-podcast": "&#xf2ce; Podcast light",
			"fab fa-podcast": "&#xf2ce; Podcast duotone",
			"fas fa-plus-square": "&#xf0fe; Plus Square solid",
			"far fa-plus-square": "&#xf0fe; Plus Square regular",
			"fal fa-plus-square": "&#xf0fe; Plus Square light",
			"fab fa-plus-square": "&#xf0fe; Plus Square duotone",
			"fas fa-plus-octagon": "&#xf301; Plus Octagon solid",
			"far fa-plus-octagon": "&#xf301; Plus Octagon regular",
			"fal fa-plus-octagon": "&#xf301; Plus Octagon light",
			"fab fa-plus-octagon": "&#xf301; Plus Octagon duotone",
			"fas fa-plus-hexagon": "&#xf300; Plus Hexagon solid",
			"far fa-plus-hexagon": "&#xf300; Plus Hexagon regular",
			"fal fa-plus-hexagon": "&#xf300; Plus Hexagon light",
			"fab fa-plus-hexagon": "&#xf300; Plus Hexagon duotone",
			"fas fa-plus-circle": "&#xf055; Plus Circle solid",
			"far fa-plus-circle": "&#xf055; Plus Circle regular",
			"fal fa-plus-circle": "&#xf055; Plus Circle light",
			"fab fa-plus-circle": "&#xf055; Plus Circle duotone",
			"fas fa-plus": "&#xf067; plus solid",
			"far fa-plus": "&#xf067; plus regular",
			"fal fa-plus": "&#xf067; plus light",
			"fab fa-plus": "&#xf067; plus duotone",
			"fas fa-plug": "&#xf1e6; Plug solid",
			"far fa-plug": "&#xf1e6; Plug regular",
			"fal fa-plug": "&#xf1e6; Plug light",
			"fab fa-plug": "&#xf1e6; Plug duotone",
			"fab fa-playstation": "&#xf3df; PlayStation brands",
			"fas fa-play-circle": "&#xf144; Play Circle solid",
			"far fa-play-circle": "&#xf144; Play Circle regular",
			"fal fa-play-circle": "&#xf144; Play Circle light",
			"fab fa-play-circle": "&#xf144; Play Circle duotone",
			"fas fa-play": "&#xf04b; play solid",
			"far fa-play": "&#xf04b; play regular",
			"fal fa-play": "&#xf04b; play light",
			"fab fa-play": "&#xf04b; play duotone",
			"fas fa-plane-departure": "&#xf5b0; Plane Departure solid",
			"far fa-plane-departure": "&#xf5b0; Plane Departure regular",
			"fal fa-plane-departure": "&#xf5b0; Plane Departure light",
			"fab fa-plane-departure": "&#xf5b0; Plane Departure duotone",
			"fas fa-plane-arrival": "&#xf5af; Plane Arrival solid",
			"far fa-plane-arrival": "&#xf5af; Plane Arrival regular",
			"fal fa-plane-arrival": "&#xf5af; Plane Arrival light",
			"fab fa-plane-arrival": "&#xf5af; Plane Arrival duotone",
			"fas fa-plane-alt": "&#xf3de; Alternate Plane solid",
			"far fa-plane-alt": "&#xf3de; Alternate Plane regular",
			"fal fa-plane-alt": "&#xf3de; Alternate Plane light",
			"fab fa-plane-alt": "&#xf3de; Alternate Plane duotone",
			"fas fa-plane": "&#xf072; plane solid",
			"far fa-plane": "&#xf072; plane regular",
			"fal fa-plane": "&#xf072; plane light",
			"fab fa-plane": "&#xf072; plane duotone",
			"fas fa-place-of-worship": "&#xf67f; Place of Worship solid",
			"far fa-place-of-worship": "&#xf67f; Place of Worship regular",
			"fal fa-place-of-worship": "&#xf67f; Place of Worship light",
			"fab fa-place-of-worship": "&#xf67f; Place of Worship duotone",
			"fas fa-pizza-slice": "&#xf818; Pizza Slice solid",
			"far fa-pizza-slice": "&#xf818; Pizza Slice regular",
			"fal fa-pizza-slice": "&#xf818; Pizza Slice light",
			"fab fa-pizza-slice": "&#xf818; Pizza Slice duotone",
			"fas fa-pizza": "&#xf817; Pizza solid",
			"far fa-pizza": "&#xf817; Pizza regular",
			"fal fa-pizza": "&#xf817; Pizza light",
			"fab fa-pizza": "&#xf817; Pizza duotone",
			"fab fa-pinterest-square": "&#xf0d3; Pinterest Square brands",
			"fab fa-pinterest-p": "&#xf231; Pinterest P brands",
			"fab fa-pinterest": "&#xf0d2; Pinterest brands",
			"fas fa-pills": "&#xf484; Pills solid",
			"far fa-pills": "&#xf484; Pills regular",
			"fal fa-pills": "&#xf484; Pills light",
			"fab fa-pills": "&#xf484; Pills duotone",
			"fas fa-piggy-bank": "&#xf4d3; Piggy Bank solid",
			"far fa-piggy-bank": "&#xf4d3; Piggy Bank regular",
			"fal fa-piggy-bank": "&#xf4d3; Piggy Bank light",
			"fab fa-piggy-bank": "&#xf4d3; Piggy Bank duotone",
			"fas fa-pig": "&#xf706; Pig solid",
			"far fa-pig": "&#xf706; Pig regular",
			"fal fa-pig": "&#xf706; Pig light",
			"fab fa-pig": "&#xf706; Pig duotone",
			"fab fa-pied-piper-pp": "&#xf1a7; Pied Piper PP Logo (Old) brands",
			"fab fa-pied-piper-hat": "&#xf4e5; Pied Piper-hat brands",
			"fab fa-pied-piper-alt": "&#xf1a8; Alternate Pied Piper Logo brands",
			"fab fa-pied-piper": "&#xf2ae; Pied Piper Logo brands",
			"fas fa-pie": "&#xf705; Pie solid",
			"far fa-pie": "&#xf705; Pie regular",
			"fal fa-pie": "&#xf705; Pie light",
			"fab fa-pie": "&#xf705; Pie duotone",
			"fas fa-piano-keyboard": "&#xf8d5; Piano Keyboard solid",
			"far fa-piano-keyboard": "&#xf8d5; Piano Keyboard regular",
			"fal fa-piano-keyboard": "&#xf8d5; Piano Keyboard light",
			"fab fa-piano-keyboard": "&#xf8d5; Piano Keyboard duotone",
			"fas fa-piano": "&#xf8d4; Piano solid",
			"far fa-piano": "&#xf8d4; Piano regular",
			"fal fa-piano": "&#xf8d4; Piano light",
			"fab fa-piano": "&#xf8d4; Piano duotone",
			"fas fa-pi": "&#xf67e; Pi solid",
			"far fa-pi": "&#xf67e; Pi regular",
			"fal fa-pi": "&#xf67e; Pi light",
			"fab fa-pi": "&#xf67e; Pi duotone",
			"fab fa-php": "&#xf457; PHP brands",
			"fas fa-photo-video": "&#xf87c; Photo Video solid",
			"far fa-photo-video": "&#xf87c; Photo Video regular",
			"fal fa-photo-video": "&#xf87c; Photo Video light",
			"fab fa-photo-video": "&#xf87c; Photo Video duotone",
			"fas fa-phone-volume": "&#xf2a0; Phone Volume solid",
			"far fa-phone-volume": "&#xf2a0; Phone Volume regular",
			"fal fa-phone-volume": "&#xf2a0; Phone Volume light",
			"fab fa-phone-volume": "&#xf2a0; Phone Volume duotone",
			"fas fa-phone-square-alt": "&#xf87b; Alternate Phone Square solid",
			"far fa-phone-square-alt": "&#xf87b; Alternate Phone Square regular",
			"fal fa-phone-square-alt": "&#xf87b; Alternate Phone Square light",
			"fab fa-phone-square-alt": "&#xf87b; Alternate Phone Square duotone",
			"fas fa-phone-square": "&#xf098; Phone Square solid",
			"far fa-phone-square": "&#xf098; Phone Square regular",
			"fal fa-phone-square": "&#xf098; Phone Square light",
			"fab fa-phone-square": "&#xf098; Phone Square duotone",
			"fas fa-phone-slash": "&#xf3dd; Phone Slash solid",
			"far fa-phone-slash": "&#xf3dd; Phone Slash regular",
			"fal fa-phone-slash": "&#xf3dd; Phone Slash light",
			"fab fa-phone-slash": "&#xf3dd; Phone Slash duotone",
			"fas fa-phone-rotary": "&#xf8d3; Rotary Phone solid",
			"far fa-phone-rotary": "&#xf8d3; Rotary Phone regular",
			"fal fa-phone-rotary": "&#xf8d3; Rotary Phone light",
			"fab fa-phone-rotary": "&#xf8d3; Rotary Phone duotone",
			"fas fa-phone-plus": "&#xf4d2; Phone Plus solid",
			"far fa-phone-plus": "&#xf4d2; Phone Plus regular",
			"fal fa-phone-plus": "&#xf4d2; Phone Plus light",
			"fab fa-phone-plus": "&#xf4d2; Phone Plus duotone",
			"fas fa-phone-office": "&#xf67d; Office Phone solid",
			"far fa-phone-office": "&#xf67d; Office Phone regular",
			"fal fa-phone-office": "&#xf67d; Office Phone light",
			"fab fa-phone-office": "&#xf67d; Office Phone duotone",
			"fas fa-phone-laptop": "&#xf87a; Phone and Laptop solid",
			"far fa-phone-laptop": "&#xf87a; Phone and Laptop regular",
			"fal fa-phone-laptop": "&#xf87a; Phone and Laptop light",
			"fab fa-phone-laptop": "&#xf87a; Phone and Laptop duotone",
			"fas fa-phone-alt": "&#xf879; Alternate Phone solid",
			"far fa-phone-alt": "&#xf879; Alternate Phone regular",
			"fal fa-phone-alt": "&#xf879; Alternate Phone light",
			"fab fa-phone-alt": "&#xf879; Alternate Phone duotone",
			"fas fa-phone": "&#xf095; Phone solid",
			"far fa-phone": "&#xf095; Phone regular",
			"fal fa-phone": "&#xf095; Phone light",
			"fab fa-phone": "&#xf095; Phone duotone",
			"fab fa-phoenix-squadron": "&#xf511; Phoenix Squadron brands",
			"fab fa-phoenix-framework": "&#xf3dc; Phoenix Framework brands",
			"fab fa-phabricator": "&#xf3db; Phabricator brands",
			"fas fa-person-sign": "&#xf757; Person Holding Sign solid",
			"far fa-person-sign": "&#xf757; Person Holding Sign regular",
			"fal fa-person-sign": "&#xf757; Person Holding Sign light",
			"fab fa-person-sign": "&#xf757; Person Holding Sign duotone",
			"fas fa-person-dolly-empty": "&#xf4d1; Person and Empty Dolly solid",
			"far fa-person-dolly-empty": "&#xf4d1; Person and Empty Dolly regular",
			"fal fa-person-dolly-empty": "&#xf4d1; Person and Empty Dolly light",
			"fab fa-person-dolly-empty": "&#xf4d1; Person and Empty Dolly duotone",
			"fas fa-person-dolly": "&#xf4d0; Person and Dolly solid",
			"far fa-person-dolly": "&#xf4d0; Person and Dolly regular",
			"fal fa-person-dolly": "&#xf4d0; Person and Dolly light",
			"fab fa-person-dolly": "&#xf4d0; Person and Dolly duotone",
			"fas fa-person-carry": "&#xf4cf; Person Carry solid",
			"far fa-person-carry": "&#xf4cf; Person Carry regular",
			"fal fa-person-carry": "&#xf4cf; Person Carry light",
			"fab fa-person-carry": "&#xf4cf; Person Carry duotone",
			"fas fa-person-booth": "&#xf756; Person Entering Booth solid",
			"far fa-person-booth": "&#xf756; Person Entering Booth regular",
			"fal fa-person-booth": "&#xf756; Person Entering Booth light",
			"fab fa-person-booth": "&#xf756; Person Entering Booth duotone",
			"fab fa-periscope": "&#xf3da; Periscope brands",
			"fas fa-percentage": "&#xf541; Percentage solid",
			"far fa-percentage": "&#xf541; Percentage regular",
			"fal fa-percentage": "&#xf541; Percentage light",
			"fab fa-percentage": "&#xf541; Percentage duotone",
			"fas fa-percent": "&#xf295; Percent solid",
			"far fa-percent": "&#xf295; Percent regular",
			"fal fa-percent": "&#xf295; Percent light",
			"fab fa-percent": "&#xf295; Percent duotone",
			"fas fa-pepper-hot": "&#xf816; Hot Pepper solid",
			"far fa-pepper-hot": "&#xf816; Hot Pepper regular",
			"fal fa-pepper-hot": "&#xf816; Hot Pepper light",
			"fab fa-pepper-hot": "&#xf816; Hot Pepper duotone",
			"fas fa-people-carry": "&#xf4ce; People Carry solid",
			"far fa-people-carry": "&#xf4ce; People Carry regular",
			"fal fa-people-carry": "&#xf4ce; People Carry light",
			"fab fa-people-carry": "&#xf4ce; People Carry duotone",
			"fab fa-penny-arcade": "&#xf704; Penny Arcade brands",
			"fas fa-pennant": "&#xf456; Pennant solid",
			"far fa-pennant": "&#xf456; Pennant regular",
			"fal fa-pennant": "&#xf456; Pennant light",
			"fab fa-pennant": "&#xf456; Pennant duotone",
			"fas fa-pencil-ruler": "&#xf5ae; Pencil Ruler solid",
			"far fa-pencil-ruler": "&#xf5ae; Pencil Ruler regular",
			"fal fa-pencil-ruler": "&#xf5ae; Pencil Ruler light",
			"fab fa-pencil-ruler": "&#xf5ae; Pencil Ruler duotone",
			"fas fa-pencil-paintbrush": "&#xf618; Pencil Paintbrush solid",
			"far fa-pencil-paintbrush": "&#xf618; Pencil Paintbrush regular",
			"fal fa-pencil-paintbrush": "&#xf618; Pencil Paintbrush light",
			"fab fa-pencil-paintbrush": "&#xf618; Pencil Paintbrush duotone",
			"fas fa-pencil-alt": "&#xf303; Alternate Pencil solid",
			"far fa-pencil-alt": "&#xf303; Alternate Pencil regular",
			"fal fa-pencil-alt": "&#xf303; Alternate Pencil light",
			"fab fa-pencil-alt": "&#xf303; Alternate Pencil duotone",
			"fas fa-pencil": "&#xf040; pencil solid",
			"far fa-pencil": "&#xf040; pencil regular",
			"fal fa-pencil": "&#xf040; pencil light",
			"fab fa-pencil": "&#xf040; pencil duotone",
			"fas fa-pen-square": "&#xf14b; Pen Square solid",
			"far fa-pen-square": "&#xf14b; Pen Square regular",
			"fal fa-pen-square": "&#xf14b; Pen Square light",
			"fab fa-pen-square": "&#xf14b; Pen Square duotone",
			"fas fa-pen-nib": "&#xf5ad; Pen Nib solid",
			"far fa-pen-nib": "&#xf5ad; Pen Nib regular",
			"fal fa-pen-nib": "&#xf5ad; Pen Nib light",
			"fab fa-pen-nib": "&#xf5ad; Pen Nib duotone",
			"fas fa-pen-fancy": "&#xf5ac; Pen Fancy solid",
			"far fa-pen-fancy": "&#xf5ac; Pen Fancy regular",
			"fal fa-pen-fancy": "&#xf5ac; Pen Fancy light",
			"fab fa-pen-fancy": "&#xf5ac; Pen Fancy duotone",
			"fas fa-pen-alt": "&#xf305; Alternate Pen solid",
			"far fa-pen-alt": "&#xf305; Alternate Pen regular",
			"fal fa-pen-alt": "&#xf305; Alternate Pen light",
			"fab fa-pen-alt": "&#xf305; Alternate Pen duotone",
			"fas fa-pen": "&#xf304; Pen solid",
			"far fa-pen": "&#xf304; Pen regular",
			"fal fa-pen": "&#xf304; Pen light",
			"fab fa-pen": "&#xf304; Pen duotone",
			"fas fa-pegasus": "&#xf703; Pegasus solid",
			"far fa-pegasus": "&#xf703; Pegasus regular",
			"fal fa-pegasus": "&#xf703; Pegasus light",
			"fab fa-pegasus": "&#xf703; Pegasus duotone",
			"fas fa-peace": "&#xf67c; Peace solid",
			"far fa-peace": "&#xf67c; Peace regular",
			"fal fa-peace": "&#xf67c; Peace light",
			"fab fa-peace": "&#xf67c; Peace duotone",
			"fab fa-paypal": "&#xf1ed; Paypal brands",
			"fas fa-paw-claws": "&#xf702; Paw Claws solid",
			"far fa-paw-claws": "&#xf702; Paw Claws regular",
			"fal fa-paw-claws": "&#xf702; Paw Claws light",
			"fab fa-paw-claws": "&#xf702; Paw Claws duotone",
			"fas fa-paw-alt": "&#xf701; Paw Alt solid",
			"far fa-paw-alt": "&#xf701; Paw Alt regular",
			"fal fa-paw-alt": "&#xf701; Paw Alt light",
			"fab fa-paw-alt": "&#xf701; Paw Alt duotone",
			"fas fa-paw": "&#xf1b0; Paw solid",
			"far fa-paw": "&#xf1b0; Paw regular",
			"fal fa-paw": "&#xf1b0; Paw light",
			"fab fa-paw": "&#xf1b0; Paw duotone",
			"fas fa-pause-circle": "&#xf28b; Pause Circle solid",
			"far fa-pause-circle": "&#xf28b; Pause Circle regular",
			"fal fa-pause-circle": "&#xf28b; Pause Circle light",
			"fab fa-pause-circle": "&#xf28b; Pause Circle duotone",
			"fas fa-pause": "&#xf04c; pause solid",
			"far fa-pause": "&#xf04c; pause regular",
			"fal fa-pause": "&#xf04c; pause light",
			"fab fa-pause": "&#xf04c; pause duotone",
			"fab fa-patreon": "&#xf3d9; Patreon brands",
			"fas fa-paste": "&#xf0ea; Paste solid",
			"far fa-paste": "&#xf0ea; Paste regular",
			"fal fa-paste": "&#xf0ea; Paste light",
			"fab fa-paste": "&#xf0ea; Paste duotone",
			"fas fa-pastafarianism": "&#xf67b; Pastafarianism solid",
			"far fa-pastafarianism": "&#xf67b; Pastafarianism regular",
			"fal fa-pastafarianism": "&#xf67b; Pastafarianism light",
			"fab fa-pastafarianism": "&#xf67b; Pastafarianism duotone",
			"fas fa-passport": "&#xf5ab; Passport solid",
			"far fa-passport": "&#xf5ab; Passport regular",
			"fal fa-passport": "&#xf5ab; Passport light",
			"fab fa-passport": "&#xf5ab; Passport duotone",
			"fas fa-parking-slash": "&#xf617; Parking Slash solid",
			"far fa-parking-slash": "&#xf617; Parking Slash regular",
			"fal fa-parking-slash": "&#xf617; Parking Slash light",
			"fab fa-parking-slash": "&#xf617; Parking Slash duotone",
			"fas fa-parking-circle-slash": "&#xf616; Parking Circle Slash solid",
			"far fa-parking-circle-slash": "&#xf616; Parking Circle Slash regular",
			"fal fa-parking-circle-slash": "&#xf616; Parking Circle Slash light",
			"fab fa-parking-circle-slash": "&#xf616; Parking Circle Slash duotone",
			"fas fa-parking-circle": "&#xf615; Parking Circle solid",
			"far fa-parking-circle": "&#xf615; Parking Circle regular",
			"fal fa-parking-circle": "&#xf615; Parking Circle light",
			"fab fa-parking-circle": "&#xf615; Parking Circle duotone",
			"fas fa-parking": "&#xf540; Parking solid",
			"far fa-parking": "&#xf540; Parking regular",
			"fal fa-parking": "&#xf540; Parking light",
			"fab fa-parking": "&#xf540; Parking duotone",
			"fas fa-paragraph-rtl": "&#xf878; Paragraph Right-to-Left solid",
			"far fa-paragraph-rtl": "&#xf878; Paragraph Right-to-Left regular",
			"fal fa-paragraph-rtl": "&#xf878; Paragraph Right-to-Left light",
			"fab fa-paragraph-rtl": "&#xf878; Paragraph Right-to-Left duotone",
			"fas fa-paragraph": "&#xf1dd; paragraph solid",
			"far fa-paragraph": "&#xf1dd; paragraph regular",
			"fal fa-paragraph": "&#xf1dd; paragraph light",
			"fab fa-paragraph": "&#xf1dd; paragraph duotone",
			"fas fa-parachute-box": "&#xf4cd; Parachute Box solid",
			"far fa-parachute-box": "&#xf4cd; Parachute Box regular",
			"fal fa-parachute-box": "&#xf4cd; Parachute Box light",
			"fab fa-parachute-box": "&#xf4cd; Parachute Box duotone",
			"fas fa-paperclip": "&#xf0c6; Paperclip solid",
			"far fa-paperclip": "&#xf0c6; Paperclip regular",
			"fal fa-paperclip": "&#xf0c6; Paperclip light",
			"fab fa-paperclip": "&#xf0c6; Paperclip duotone",
			"fas fa-paper-plane": "&#xf1d8; Paper Plane solid",
			"far fa-paper-plane": "&#xf1d8; Paper Plane regular",
			"fal fa-paper-plane": "&#xf1d8; Paper Plane light",
			"fab fa-paper-plane": "&#xf1d8; Paper Plane duotone",
			"fas fa-pallet-alt": "&#xf483; Alternate Pallet solid",
			"far fa-pallet-alt": "&#xf483; Alternate Pallet regular",
			"fal fa-pallet-alt": "&#xf483; Alternate Pallet light",
			"fab fa-pallet-alt": "&#xf483; Alternate Pallet duotone",
			"fas fa-pallet": "&#xf482; Pallet solid",
			"far fa-pallet": "&#xf482; Pallet regular",
			"fal fa-pallet": "&#xf482; Pallet light",
			"fab fa-pallet": "&#xf482; Pallet duotone",
			"fab fa-palfed": "&#xf3d8; Palfed brands",
			"fas fa-palette": "&#xf53f; Palette solid",
			"far fa-palette": "&#xf53f; Palette regular",
			"fal fa-palette": "&#xf53f; Palette light",
			"fab fa-palette": "&#xf53f; Palette duotone",
			"fas fa-paint-roller": "&#xf5aa; Paint Roller solid",
			"far fa-paint-roller": "&#xf5aa; Paint Roller regular",
			"fal fa-paint-roller": "&#xf5aa; Paint Roller light",
			"fab fa-paint-roller": "&#xf5aa; Paint Roller duotone",
			"fas fa-paint-brush-alt": "&#xf5a9; Alternate Paint Brush solid",
			"far fa-paint-brush-alt": "&#xf5a9; Alternate Paint Brush regular",
			"fal fa-paint-brush-alt": "&#xf5a9; Alternate Paint Brush light",
			"fab fa-paint-brush-alt": "&#xf5a9; Alternate Paint Brush duotone",
			"fas fa-paint-brush": "&#xf1fc; Paint Brush solid",
			"far fa-paint-brush": "&#xf1fc; Paint Brush regular",
			"fal fa-paint-brush": "&#xf1fc; Paint Brush light",
			"fab fa-paint-brush": "&#xf1fc; Paint Brush duotone",
			"fas fa-pager": "&#xf815; Pager solid",
			"far fa-pager": "&#xf815; Pager regular",
			"fal fa-pager": "&#xf815; Pager light",
			"fab fa-pager": "&#xf815; Pager duotone",
			"fab fa-pagelines": "&#xf18c; Pagelines brands",
			"fab fa-page4": "&#xf3d7; page4 Corporation brands",
			"fas fa-page-break": "&#xf877; Page Break solid",
			"far fa-page-break": "&#xf877; Page Break regular",
			"fal fa-page-break": "&#xf877; Page Break light",
			"fab fa-page-break": "&#xf877; Page Break duotone",
			"fas fa-overline": "&#xf876; Overline solid",
			"far fa-overline": "&#xf876; Overline regular",
			"fal fa-overline": "&#xf876; Overline light",
			"fab fa-overline": "&#xf876; Overline duotone",
			"fas fa-outdent": "&#xf03b; Outdent solid",
			"far fa-outdent": "&#xf03b; Outdent regular",
			"fal fa-outdent": "&#xf03b; Outdent light",
			"fab fa-outdent": "&#xf03b; Outdent duotone",
			"fas fa-otter": "&#xf700; Otter solid",
			"far fa-otter": "&#xf700; Otter regular",
			"fal fa-otter": "&#xf700; Otter light",
			"fab fa-otter": "&#xf700; Otter duotone",
			"fab fa-osi": "&#xf41a; Open Source Initiative brands",
			"fas fa-ornament": "&#xf7b8; Ornament solid",
			"far fa-ornament": "&#xf7b8; Ornament regular",
			"fal fa-ornament": "&#xf7b8; Ornament light",
			"fab fa-ornament": "&#xf7b8; Ornament duotone",
			"fab fa-orcid": "&#xf8d2; ORCID brands",
			"fab fa-optin-monster": "&#xf23c; Optin Monster brands",
			"fab fa-opera": "&#xf26a; Opera brands",
			"fab fa-openid": "&#xf19b; OpenID brands",
			"fab fa-opencart": "&#xf23d; OpenCart brands",
			"fas fa-omega": "&#xf67a; Omega solid",
			"far fa-omega": "&#xf67a; Omega regular",
			"fal fa-omega": "&#xf67a; Omega light",
			"fab fa-omega": "&#xf67a; Omega duotone",
			"fas fa-om": "&#xf679; Om solid",
			"far fa-om": "&#xf679; Om regular",
			"fal fa-om": "&#xf679; Om light",
			"fab fa-om": "&#xf679; Om duotone",
			"fab fa-old-republic": "&#xf510; Old Republic brands",
			"fas fa-oil-temp": "&#xf614; Oil Temp solid",
			"far fa-oil-temp": "&#xf614; Oil Temp regular",
			"fal fa-oil-temp": "&#xf614; Oil Temp light",
			"fab fa-oil-temp": "&#xf614; Oil Temp duotone",
			"fas fa-oil-can": "&#xf613; Oil Can solid",
			"far fa-oil-can": "&#xf613; Oil Can regular",
			"fal fa-oil-can": "&#xf613; Oil Can light",
			"fab fa-oil-can": "&#xf613; Oil Can duotone",
			"fab fa-odnoklassniki-square": "&#xf264; Odnoklassniki Square brands",
			"fab fa-odnoklassniki": "&#xf263; Odnoklassniki brands",
			"fas fa-octagon": "&#xf306; Octagon solid",
			"far fa-octagon": "&#xf306; Octagon regular",
			"fal fa-octagon": "&#xf306; Octagon light",
			"fab fa-octagon": "&#xf306; Octagon duotone",
			"fas fa-object-ungroup": "&#xf248; Object Ungroup solid",
			"far fa-object-ungroup": "&#xf248; Object Ungroup regular",
			"fal fa-object-ungroup": "&#xf248; Object Ungroup light",
			"fab fa-object-ungroup": "&#xf248; Object Ungroup duotone",
			"fas fa-object-group": "&#xf247; Object Group solid",
			"far fa-object-group": "&#xf247; Object Group regular",
			"fal fa-object-group": "&#xf247; Object Group light",
			"fab fa-object-group": "&#xf247; Object Group duotone",
			"fab fa-nutritionix": "&#xf3d6; Nutritionix brands",
			"fab fa-ns8": "&#xf3d5; NS8 brands",
			"fab fa-npm": "&#xf3d4; npm brands",
			"fas fa-notes-medical": "&#xf481; Medical Notes solid",
			"far fa-notes-medical": "&#xf481; Medical Notes regular",
			"fal fa-notes-medical": "&#xf481; Medical Notes light",
			"fab fa-notes-medical": "&#xf481; Medical Notes duotone",
			"fas fa-not-equal": "&#xf53e; Not Equal solid",
			"far fa-not-equal": "&#xf53e; Not Equal regular",
			"fal fa-not-equal": "&#xf53e; Not Equal light",
			"fab fa-not-equal": "&#xf53e; Not Equal duotone",
			"fab fa-node-js": "&#xf3d3; Node.js JS brands",
			"fab fa-node": "&#xf419; Node.js brands",
			"fab fa-nimblr": "&#xf5a8; Nimblr brands",
			"fas fa-newspaper": "&#xf1ea; Newspaper solid",
			"far fa-newspaper": "&#xf1ea; Newspaper regular",
			"fal fa-newspaper": "&#xf1ea; Newspaper light",
			"fab fa-newspaper": "&#xf1ea; Newspaper duotone",
			"fas fa-neuter": "&#xf22c; Neuter solid",
			"far fa-neuter": "&#xf22c; Neuter regular",
			"fal fa-neuter": "&#xf22c; Neuter light",
			"fab fa-neuter": "&#xf22c; Neuter duotone",
			"fas fa-network-wired": "&#xf6ff; Wired Network solid",
			"far fa-network-wired": "&#xf6ff; Wired Network regular",
			"fal fa-network-wired": "&#xf6ff; Wired Network light",
			"fab fa-network-wired": "&#xf6ff; Wired Network duotone",
			"fab fa-neos": "&#xf612; Neos brands",
			"fas fa-narwhal": "&#xf6fe; Narwhal solid",
			"far fa-narwhal": "&#xf6fe; Narwhal regular",
			"fal fa-narwhal": "&#xf6fe; Narwhal light",
			"fab fa-narwhal": "&#xf6fe; Narwhal duotone",
			"fab fa-napster": "&#xf3d2; Napster brands",
			"fas fa-music-slash": "&#xf8d1; Music Slash solid",
			"far fa-music-slash": "&#xf8d1; Music Slash regular",
			"fal fa-music-slash": "&#xf8d1; Music Slash light",
			"fab fa-music-slash": "&#xf8d1; Music Slash duotone",
			"fas fa-music-alt-slash": "&#xf8d0; Alternate Music Slash solid",
			"far fa-music-alt-slash": "&#xf8d0; Alternate Music Slash regular",
			"fal fa-music-alt-slash": "&#xf8d0; Alternate Music Slash light",
			"fab fa-music-alt-slash": "&#xf8d0; Alternate Music Slash duotone",
			"fas fa-music-alt": "&#xf8cf; Alternate Music solid",
			"far fa-music-alt": "&#xf8cf; Alternate Music regular",
			"fal fa-music-alt": "&#xf8cf; Alternate Music light",
			"fab fa-music-alt": "&#xf8cf; Alternate Music duotone",
			"fas fa-music": "&#xf001; Music solid",
			"far fa-music": "&#xf001; Music regular",
			"fal fa-music": "&#xf001; Music light",
			"fab fa-music": "&#xf001; Music duotone",
			"fas fa-mug-tea": "&#xf875; Mug Tea solid",
			"far fa-mug-tea": "&#xf875; Mug Tea regular",
			"fal fa-mug-tea": "&#xf875; Mug Tea light",
			"fab fa-mug-tea": "&#xf875; Mug Tea duotone",
			"fas fa-mug-marshmallows": "&#xf7b7; Mug with Marshmallows solid",
			"far fa-mug-marshmallows": "&#xf7b7; Mug with Marshmallows regular",
			"fal fa-mug-marshmallows": "&#xf7b7; Mug with Marshmallows light",
			"fab fa-mug-marshmallows": "&#xf7b7; Mug with Marshmallows duotone",
			"fas fa-mug-hot": "&#xf7b6; Mug Hot solid",
			"far fa-mug-hot": "&#xf7b6; Mug Hot regular",
			"fal fa-mug-hot": "&#xf7b6; Mug Hot light",
			"fab fa-mug-hot": "&#xf7b6; Mug Hot duotone",
			"fas fa-mug": "&#xf874; Mug solid",
			"far fa-mug": "&#xf874; Mug regular",
			"fal fa-mug": "&#xf874; Mug light",
			"fab fa-mug": "&#xf874; Mug duotone",
			"fas fa-mp3-player": "&#xf8ce; MP3 Player solid",
			"far fa-mp3-player": "&#xf8ce; MP3 Player regular",
			"fal fa-mp3-player": "&#xf8ce; MP3 Player light",
			"fab fa-mp3-player": "&#xf8ce; MP3 Player duotone",
			"fas fa-mouse-pointer": "&#xf245; Mouse Pointer solid",
			"far fa-mouse-pointer": "&#xf245; Mouse Pointer regular",
			"fal fa-mouse-pointer": "&#xf245; Mouse Pointer light",
			"fab fa-mouse-pointer": "&#xf245; Mouse Pointer duotone",
			"fas fa-mouse-alt": "&#xf8cd; Alternate Mouse solid",
			"far fa-mouse-alt": "&#xf8cd; Alternate Mouse regular",
			"fal fa-mouse-alt": "&#xf8cd; Alternate Mouse light",
			"fab fa-mouse-alt": "&#xf8cd; Alternate Mouse duotone",
			"fas fa-mouse": "&#xf8cc; Mouse solid",
			"far fa-mouse": "&#xf8cc; Mouse regular",
			"fal fa-mouse": "&#xf8cc; Mouse light",
			"fab fa-mouse": "&#xf8cc; Mouse duotone",
			"fas fa-mountains": "&#xf6fd; Mountains solid",
			"far fa-mountains": "&#xf6fd; Mountains regular",
			"fal fa-mountains": "&#xf6fd; Mountains light",
			"fab fa-mountains": "&#xf6fd; Mountains duotone",
			"fas fa-mountain": "&#xf6fc; Mountain solid",
			"far fa-mountain": "&#xf6fc; Mountain regular",
			"fal fa-mountain": "&#xf6fc; Mountain light",
			"fab fa-mountain": "&#xf6fc; Mountain duotone",
			"fas fa-motorcycle": "&#xf21c; Motorcycle solid",
			"far fa-motorcycle": "&#xf21c; Motorcycle regular",
			"fal fa-motorcycle": "&#xf21c; Motorcycle light",
			"fab fa-motorcycle": "&#xf21c; Motorcycle duotone",
			"fas fa-mosque": "&#xf678; Mosque solid",
			"far fa-mosque": "&#xf678; Mosque regular",
			"fal fa-mosque": "&#xf678; Mosque light",
			"fab fa-mosque": "&#xf678; Mosque duotone",
			"fas fa-mortar-pestle": "&#xf5a7; Mortar Pestle solid",
			"far fa-mortar-pestle": "&#xf5a7; Mortar Pestle regular",
			"fal fa-mortar-pestle": "&#xf5a7; Mortar Pestle light",
			"fab fa-mortar-pestle": "&#xf5a7; Mortar Pestle duotone",
			"fas fa-moon-stars": "&#xf755; Moon with Stars solid",
			"far fa-moon-stars": "&#xf755; Moon with Stars regular",
			"fal fa-moon-stars": "&#xf755; Moon with Stars light",
			"fab fa-moon-stars": "&#xf755; Moon with Stars duotone",
			"fas fa-moon-cloud": "&#xf754; Moon with Cloud solid",
			"far fa-moon-cloud": "&#xf754; Moon with Cloud regular",
			"fal fa-moon-cloud": "&#xf754; Moon with Cloud light",
			"fab fa-moon-cloud": "&#xf754; Moon with Cloud duotone",
			"fas fa-moon": "&#xf186; Moon solid",
			"far fa-moon": "&#xf186; Moon regular",
			"fal fa-moon": "&#xf186; Moon light",
			"fab fa-moon": "&#xf186; Moon duotone",
			"fas fa-monument": "&#xf5a6; Monument solid",
			"far fa-monument": "&#xf5a6; Monument regular",
			"fal fa-monument": "&#xf5a6; Monument light",
			"fab fa-monument": "&#xf5a6; Monument duotone",
			"fas fa-monkey": "&#xf6fb; Monkey solid",
			"far fa-monkey": "&#xf6fb; Monkey regular",
			"fal fa-monkey": "&#xf6fb; Monkey light",
			"fab fa-monkey": "&#xf6fb; Monkey duotone",
			"fas fa-monitor-heart-rate": "&#xf611; Heart Rate Monitor solid",
			"far fa-monitor-heart-rate": "&#xf611; Heart Rate Monitor regular",
			"fal fa-monitor-heart-rate": "&#xf611; Heart Rate Monitor light",
			"fab fa-monitor-heart-rate": "&#xf611; Heart Rate Monitor duotone",
			"fas fa-money-check-edit-alt": "&#xf873; Alternate Money Check Edit solid",
			"far fa-money-check-edit-alt": "&#xf873; Alternate Money Check Edit regular",
			"fal fa-money-check-edit-alt": "&#xf873; Alternate Money Check Edit light",
			"fab fa-money-check-edit-alt": "&#xf873; Alternate Money Check Edit duotone",
			"fas fa-money-check-edit": "&#xf872; Money Check Edit solid",
			"far fa-money-check-edit": "&#xf872; Money Check Edit regular",
			"fal fa-money-check-edit": "&#xf872; Money Check Edit light",
			"fab fa-money-check-edit": "&#xf872; Money Check Edit duotone",
			"fas fa-money-check-alt": "&#xf53d; Alternate Money Check solid",
			"far fa-money-check-alt": "&#xf53d; Alternate Money Check regular",
			"fal fa-money-check-alt": "&#xf53d; Alternate Money Check light",
			"fab fa-money-check-alt": "&#xf53d; Alternate Money Check duotone",
			"fas fa-money-check": "&#xf53c; Money Check solid",
			"far fa-money-check": "&#xf53c; Money Check regular",
			"fal fa-money-check": "&#xf53c; Money Check light",
			"fab fa-money-check": "&#xf53c; Money Check duotone",
			"fas fa-money-bill-wave-alt": "&#xf53b; Alternate Wavy Money Bill solid",
			"far fa-money-bill-wave-alt": "&#xf53b; Alternate Wavy Money Bill regular",
			"fal fa-money-bill-wave-alt": "&#xf53b; Alternate Wavy Money Bill light",
			"fab fa-money-bill-wave-alt": "&#xf53b; Alternate Wavy Money Bill duotone",
			"fas fa-money-bill-wave": "&#xf53a; Wavy Money Bill solid",
			"far fa-money-bill-wave": "&#xf53a; Wavy Money Bill regular",
			"fal fa-money-bill-wave": "&#xf53a; Wavy Money Bill light",
			"fab fa-money-bill-wave": "&#xf53a; Wavy Money Bill duotone",
			"fas fa-money-bill-alt": "&#xf3d1; Alternate Money Bill solid",
			"far fa-money-bill-alt": "&#xf3d1; Alternate Money Bill regular",
			"fal fa-money-bill-alt": "&#xf3d1; Alternate Money Bill light",
			"fab fa-money-bill-alt": "&#xf3d1; Alternate Money Bill duotone",
			"fas fa-money-bill": "&#xf0d6; Money Bill solid",
			"far fa-money-bill": "&#xf0d6; Money Bill regular",
			"fal fa-money-bill": "&#xf0d6; Money Bill light",
			"fab fa-money-bill": "&#xf0d6; Money Bill duotone",
			"fab fa-monero": "&#xf3d0; Monero brands",
			"fab fa-modx": "&#xf285; MODX brands",
			"fas fa-mobile-android-alt": "&#xf3cf; Alternate Mobile Android solid",
			"far fa-mobile-android-alt": "&#xf3cf; Alternate Mobile Android regular",
			"fal fa-mobile-android-alt": "&#xf3cf; Alternate Mobile Android light",
			"fab fa-mobile-android-alt": "&#xf3cf; Alternate Mobile Android duotone",
			"fas fa-mobile-android": "&#xf3ce; Mobile Android solid",
			"far fa-mobile-android": "&#xf3ce; Mobile Android regular",
			"fal fa-mobile-android": "&#xf3ce; Mobile Android light",
			"fab fa-mobile-android": "&#xf3ce; Mobile Android duotone",
			"fas fa-mobile-alt": "&#xf3cd; Alternate Mobile solid",
			"far fa-mobile-alt": "&#xf3cd; Alternate Mobile regular",
			"fal fa-mobile-alt": "&#xf3cd; Alternate Mobile light",
			"fab fa-mobile-alt": "&#xf3cd; Alternate Mobile duotone",
			"fas fa-mobile": "&#xf10b; Mobile Phone solid",
			"far fa-mobile": "&#xf10b; Mobile Phone regular",
			"fal fa-mobile": "&#xf10b; Mobile Phone light",
			"fab fa-mobile": "&#xf10b; Mobile Phone duotone",
			"fab fa-mizuni": "&#xf3cc; Mizuni brands",
			"fab fa-mixcloud": "&#xf289; Mixcloud brands",
			"fab fa-mix": "&#xf3cb; Mix brands",
			"fas fa-mitten": "&#xf7b5; Mitten solid",
			"far fa-mitten": "&#xf7b5; Mitten regular",
			"fal fa-mitten": "&#xf7b5; Mitten light",
			"fab fa-mitten": "&#xf7b5; Mitten duotone",
			"fas fa-mistletoe": "&#xf7b4; Mistletoe solid",
			"far fa-mistletoe": "&#xf7b4; Mistletoe regular",
			"fal fa-mistletoe": "&#xf7b4; Mistletoe light",
			"fab fa-mistletoe": "&#xf7b4; Mistletoe duotone",
			"fas fa-minus-square": "&#xf146; Minus Square solid",
			"far fa-minus-square": "&#xf146; Minus Square regular",
			"fal fa-minus-square": "&#xf146; Minus Square light",
			"fab fa-minus-square": "&#xf146; Minus Square duotone",
			"fas fa-minus-octagon": "&#xf308; Minus Octagon solid",
			"far fa-minus-octagon": "&#xf308; Minus Octagon regular",
			"fal fa-minus-octagon": "&#xf308; Minus Octagon light",
			"fab fa-minus-octagon": "&#xf308; Minus Octagon duotone",
			"fas fa-minus-hexagon": "&#xf307; Minus Hexagon solid",
			"far fa-minus-hexagon": "&#xf307; Minus Hexagon regular",
			"fal fa-minus-hexagon": "&#xf307; Minus Hexagon light",
			"fab fa-minus-hexagon": "&#xf307; Minus Hexagon duotone",
			"fas fa-minus-circle": "&#xf056; Minus Circle solid",
			"far fa-minus-circle": "&#xf056; Minus Circle regular",
			"fal fa-minus-circle": "&#xf056; Minus Circle light",
			"fab fa-minus-circle": "&#xf056; Minus Circle duotone",
			"fas fa-minus": "&#xf068; minus solid",
			"far fa-minus": "&#xf068; minus regular",
			"fal fa-minus": "&#xf068; minus light",
			"fab fa-minus": "&#xf068; minus duotone",
			"fas fa-mind-share": "&#xf677; Mind Share solid",
			"far fa-mind-share": "&#xf677; Mind Share regular",
			"fal fa-mind-share": "&#xf677; Mind Share light",
			"fab fa-mind-share": "&#xf677; Mind Share duotone",
			"fab fa-microsoft": "&#xf3ca; Microsoft brands",
			"fas fa-microscope": "&#xf610; Microscope solid",
			"far fa-microscope": "&#xf610; Microscope regular",
			"fal fa-microscope": "&#xf610; Microscope light",
			"fab fa-microscope": "&#xf610; Microscope duotone",
			"fas fa-microphone-stand": "&#xf8cb; Microphone Stand solid",
			"far fa-microphone-stand": "&#xf8cb; Microphone Stand regular",
			"fal fa-microphone-stand": "&#xf8cb; Microphone Stand light",
			"fab fa-microphone-stand": "&#xf8cb; Microphone Stand duotone",
			"fas fa-microphone-slash": "&#xf131; Microphone Slash solid",
			"far fa-microphone-slash": "&#xf131; Microphone Slash regular",
			"fal fa-microphone-slash": "&#xf131; Microphone Slash light",
			"fab fa-microphone-slash": "&#xf131; Microphone Slash duotone",
			"fas fa-microphone-alt-slash": "&#xf539; Alternate Microphone Slash solid",
			"far fa-microphone-alt-slash": "&#xf539; Alternate Microphone Slash regular",
			"fal fa-microphone-alt-slash": "&#xf539; Alternate Microphone Slash light",
			"fab fa-microphone-alt-slash": "&#xf539; Alternate Microphone Slash duotone",
			"fas fa-microphone-alt": "&#xf3c9; Alternate Microphone solid",
			"far fa-microphone-alt": "&#xf3c9; Alternate Microphone regular",
			"fal fa-microphone-alt": "&#xf3c9; Alternate Microphone light",
			"fab fa-microphone-alt": "&#xf3c9; Alternate Microphone duotone",
			"fas fa-microphone": "&#xf130; microphone solid",
			"far fa-microphone": "&#xf130; microphone regular",
			"fal fa-microphone": "&#xf130; microphone light",
			"fab fa-microphone": "&#xf130; microphone duotone",
			"fas fa-microchip": "&#xf2db; Microchip solid",
			"far fa-microchip": "&#xf2db; Microchip regular",
			"fal fa-microchip": "&#xf2db; Microchip light",
			"fab fa-microchip": "&#xf2db; Microchip duotone",
			"fas fa-meteor": "&#xf753; Meteor solid",
			"far fa-meteor": "&#xf753; Meteor regular",
			"fal fa-meteor": "&#xf753; Meteor light",
			"fab fa-meteor": "&#xf753; Meteor duotone",
			"fas fa-mercury": "&#xf223; Mercury solid",
			"far fa-mercury": "&#xf223; Mercury regular",
			"fal fa-mercury": "&#xf223; Mercury light",
			"fab fa-mercury": "&#xf223; Mercury duotone",
			"fas fa-menorah": "&#xf676; Menorah solid",
			"far fa-menorah": "&#xf676; Menorah regular",
			"fal fa-menorah": "&#xf676; Menorah light",
			"fab fa-menorah": "&#xf676; Menorah duotone",
			"fab fa-mendeley": "&#xf7b3; Mendeley brands",
			"fas fa-memory": "&#xf538; Memory solid",
			"far fa-memory": "&#xf538; Memory regular",
			"fal fa-memory": "&#xf538; Memory light",
			"fab fa-memory": "&#xf538; Memory duotone",
			"fas fa-meh-rolling-eyes": "&#xf5a5; Face With Rolling Eyes solid",
			"far fa-meh-rolling-eyes": "&#xf5a5; Face With Rolling Eyes regular",
			"fal fa-meh-rolling-eyes": "&#xf5a5; Face With Rolling Eyes light",
			"fab fa-meh-rolling-eyes": "&#xf5a5; Face With Rolling Eyes duotone",
			"fas fa-meh-blank": "&#xf5a4; Face Without Mouth solid",
			"far fa-meh-blank": "&#xf5a4; Face Without Mouth regular",
			"fal fa-meh-blank": "&#xf5a4; Face Without Mouth light",
			"fab fa-meh-blank": "&#xf5a4; Face Without Mouth duotone",
			"fas fa-meh": "&#xf11a; Neutral Face solid",
			"far fa-meh": "&#xf11a; Neutral Face regular",
			"fal fa-meh": "&#xf11a; Neutral Face light",
			"fab fa-meh": "&#xf11a; Neutral Face duotone",
			"fab fa-megaport": "&#xf5a3; Megaport brands",
			"fas fa-megaphone": "&#xf675; Megaphone solid",
			"far fa-megaphone": "&#xf675; Megaphone regular",
			"fal fa-megaphone": "&#xf675; Megaphone light",
			"fab fa-megaphone": "&#xf675; Megaphone duotone",
			"fab fa-meetup": "&#xf2e0; Meetup brands",
			"fab fa-medrt": "&#xf3c8; MRT brands",
			"fas fa-medkit": "&#xf0fa; medkit solid",
			"far fa-medkit": "&#xf0fa; medkit regular",
			"fal fa-medkit": "&#xf0fa; medkit light",
			"fab fa-medkit": "&#xf0fa; medkit duotone",
			"fab fa-medium-m": "&#xf3c7; Medium M brands",
			"fab fa-medium": "&#xf23a; Medium brands",
			"fab fa-medapps": "&#xf3c6; MedApps brands",
			"fas fa-medal": "&#xf5a2; Medal solid",
			"far fa-medal": "&#xf5a2; Medal regular",
			"fal fa-medal": "&#xf5a2; Medal light",
			"fab fa-medal": "&#xf5a2; Medal duotone",
			"fas fa-meat": "&#xf814; Meat solid",
			"far fa-meat": "&#xf814; Meat regular",
			"fal fa-meat": "&#xf814; Meat light",
			"fab fa-meat": "&#xf814; Meat duotone",
			"fab fa-mdb": "&#xf8ca; Material Design for Bootstrap brands",
			"fab fa-maxcdn": "&#xf136; MaxCDN brands",
			"fab fa-mastodon": "&#xf4f6; Mastodon brands",
			"fas fa-mask": "&#xf6fa; Mask solid",
			"far fa-mask": "&#xf6fa; Mask regular",
			"fal fa-mask": "&#xf6fa; Mask light",
			"fab fa-mask": "&#xf6fa; Mask duotone",
			"fas fa-mars-stroke-v": "&#xf22a; Mars Stroke Vertical solid",
			"far fa-mars-stroke-v": "&#xf22a; Mars Stroke Vertical regular",
			"fal fa-mars-stroke-v": "&#xf22a; Mars Stroke Vertical light",
			"fab fa-mars-stroke-v": "&#xf22a; Mars Stroke Vertical duotone",
			"fas fa-mars-stroke-h": "&#xf22b; Mars Stroke Horizontal solid",
			"far fa-mars-stroke-h": "&#xf22b; Mars Stroke Horizontal regular",
			"fal fa-mars-stroke-h": "&#xf22b; Mars Stroke Horizontal light",
			"fab fa-mars-stroke-h": "&#xf22b; Mars Stroke Horizontal duotone",
			"fas fa-mars-stroke": "&#xf229; Mars Stroke solid",
			"far fa-mars-stroke": "&#xf229; Mars Stroke regular",
			"fal fa-mars-stroke": "&#xf229; Mars Stroke light",
			"fab fa-mars-stroke": "&#xf229; Mars Stroke duotone",
			"fas fa-mars-double": "&#xf227; Mars Double solid",
			"far fa-mars-double": "&#xf227; Mars Double regular",
			"fal fa-mars-double": "&#xf227; Mars Double light",
			"fab fa-mars-double": "&#xf227; Mars Double duotone",
			"fas fa-mars": "&#xf222; Mars solid",
			"far fa-mars": "&#xf222; Mars regular",
			"fal fa-mars": "&#xf222; Mars light",
			"fab fa-mars": "&#xf222; Mars duotone",
			"fas fa-marker": "&#xf5a1; Marker solid",
			"far fa-marker": "&#xf5a1; Marker regular",
			"fal fa-marker": "&#xf5a1; Marker light",
			"fab fa-marker": "&#xf5a1; Marker duotone",
			"fab fa-markdown": "&#xf60f; Markdown brands",
			"fas fa-map-signs": "&#xf277; Map Signs solid",
			"far fa-map-signs": "&#xf277; Map Signs regular",
			"fal fa-map-signs": "&#xf277; Map Signs light",
			"fab fa-map-signs": "&#xf277; Map Signs duotone",
			"fas fa-map-pin": "&#xf276; Map Pin solid",
			"far fa-map-pin": "&#xf276; Map Pin regular",
			"fal fa-map-pin": "&#xf276; Map Pin light",
			"fab fa-map-pin": "&#xf276; Map Pin duotone",
			"fas fa-map-marker-times": "&#xf60e; Map Marker Times solid",
			"far fa-map-marker-times": "&#xf60e; Map Marker Times regular",
			"fal fa-map-marker-times": "&#xf60e; Map Marker Times light",
			"fab fa-map-marker-times": "&#xf60e; Map Marker Times duotone",
			"fas fa-map-marker-smile": "&#xf60d; Map Marker Smile solid",
			"far fa-map-marker-smile": "&#xf60d; Map Marker Smile regular",
			"fal fa-map-marker-smile": "&#xf60d; Map Marker Smile light",
			"fab fa-map-marker-smile": "&#xf60d; Map Marker Smile duotone",
			"fas fa-map-marker-slash": "&#xf60c; Map Marker Slash solid",
			"far fa-map-marker-slash": "&#xf60c; Map Marker Slash regular",
			"fal fa-map-marker-slash": "&#xf60c; Map Marker Slash light",
			"fab fa-map-marker-slash": "&#xf60c; Map Marker Slash duotone",
			"fas fa-map-marker-question": "&#xf60b; Map Marker Question solid",
			"far fa-map-marker-question": "&#xf60b; Map Marker Question regular",
			"fal fa-map-marker-question": "&#xf60b; Map Marker Question light",
			"fab fa-map-marker-question": "&#xf60b; Map Marker Question duotone",
			"fas fa-map-marker-plus": "&#xf60a; Map Marker Plus solid",
			"far fa-map-marker-plus": "&#xf60a; Map Marker Plus regular",
			"fal fa-map-marker-plus": "&#xf60a; Map Marker Plus light",
			"fab fa-map-marker-plus": "&#xf60a; Map Marker Plus duotone",
			"fas fa-map-marker-minus": "&#xf609; Map Marker Minus solid",
			"far fa-map-marker-minus": "&#xf609; Map Marker Minus regular",
			"fal fa-map-marker-minus": "&#xf609; Map Marker Minus light",
			"fab fa-map-marker-minus": "&#xf609; Map Marker Minus duotone",
			"fas fa-map-marker-exclamation": "&#xf608; Map Marker Exclamation solid",
			"far fa-map-marker-exclamation": "&#xf608; Map Marker Exclamation regular",
			"fal fa-map-marker-exclamation": "&#xf608; Map Marker Exclamation light",
			"fab fa-map-marker-exclamation": "&#xf608; Map Marker Exclamation duotone",
			"fas fa-map-marker-edit": "&#xf607; Map Marker Edit solid",
			"far fa-map-marker-edit": "&#xf607; Map Marker Edit regular",
			"fal fa-map-marker-edit": "&#xf607; Map Marker Edit light",
			"fab fa-map-marker-edit": "&#xf607; Map Marker Edit duotone",
			"fas fa-map-marker-check": "&#xf606; Map Marker Check solid",
			"far fa-map-marker-check": "&#xf606; Map Marker Check regular",
			"fal fa-map-marker-check": "&#xf606; Map Marker Check light",
			"fab fa-map-marker-check": "&#xf606; Map Marker Check duotone",
			"fas fa-map-marker-alt-slash": "&#xf605; Alternate Map Marker Slash solid",
			"far fa-map-marker-alt-slash": "&#xf605; Alternate Map Marker Slash regular",
			"fal fa-map-marker-alt-slash": "&#xf605; Alternate Map Marker Slash light",
			"fab fa-map-marker-alt-slash": "&#xf605; Alternate Map Marker Slash duotone",
			"fas fa-map-marker-alt": "&#xf3c5; Alternate Map Marker solid",
			"far fa-map-marker-alt": "&#xf3c5; Alternate Map Marker regular",
			"fal fa-map-marker-alt": "&#xf3c5; Alternate Map Marker light",
			"fab fa-map-marker-alt": "&#xf3c5; Alternate Map Marker duotone",
			"fas fa-map-marker": "&#xf041; map-marker solid",
			"far fa-map-marker": "&#xf041; map-marker regular",
			"fal fa-map-marker": "&#xf041; map-marker light",
			"fab fa-map-marker": "&#xf041; map-marker duotone",
			"fas fa-map-marked-alt": "&#xf5a0; Alternate Map Marked solid",
			"far fa-map-marked-alt": "&#xf5a0; Alternate Map Marked regular",
			"fal fa-map-marked-alt": "&#xf5a0; Alternate Map Marked light",
			"fab fa-map-marked-alt": "&#xf5a0; Alternate Map Marked duotone",
			"fas fa-map-marked": "&#xf59f; Map Marked solid",
			"far fa-map-marked": "&#xf59f; Map Marked regular",
			"fal fa-map-marked": "&#xf59f; Map Marked light",
			"fab fa-map-marked": "&#xf59f; Map Marked duotone",
			"fas fa-map": "&#xf279; Map solid",
			"far fa-map": "&#xf279; Map regular",
			"fal fa-map": "&#xf279; Map light",
			"fab fa-map": "&#xf279; Map duotone",
			"fas fa-mandolin": "&#xf6f9; Mandolin solid",
			"far fa-mandolin": "&#xf6f9; Mandolin regular",
			"fal fa-mandolin": "&#xf6f9; Mandolin light",
			"fab fa-mandolin": "&#xf6f9; Mandolin duotone",
			"fab fa-mandalorian": "&#xf50f; Mandalorian brands",
			"fas fa-male": "&#xf183; Male solid",
			"far fa-male": "&#xf183; Male regular",
			"fal fa-male": "&#xf183; Male light",
			"fab fa-male": "&#xf183; Male duotone",
			"fab fa-mailchimp": "&#xf59e; Mailchimp brands",
			"fas fa-mailbox": "&#xf813; Mailbox solid",
			"far fa-mailbox": "&#xf813; Mailbox regular",
			"fal fa-mailbox": "&#xf813; Mailbox light",
			"fab fa-mailbox": "&#xf813; Mailbox duotone",
			"fas fa-mail-bulk": "&#xf674; Mail Bulk solid",
			"far fa-mail-bulk": "&#xf674; Mail Bulk regular",
			"fal fa-mail-bulk": "&#xf674; Mail Bulk light",
			"fab fa-mail-bulk": "&#xf674; Mail Bulk duotone",
			"fas fa-magnet": "&#xf076; magnet solid",
			"far fa-magnet": "&#xf076; magnet regular",
			"fal fa-magnet": "&#xf076; magnet light",
			"fab fa-magnet": "&#xf076; magnet duotone",
			"fas fa-magic": "&#xf0d0; magic solid",
			"far fa-magic": "&#xf0d0; magic regular",
			"fal fa-magic": "&#xf0d0; magic light",
			"fab fa-magic": "&#xf0d0; magic duotone",
			"fab fa-magento": "&#xf3c4; Magento brands",
			"fas fa-mace": "&#xf6f8; Mace solid",
			"far fa-mace": "&#xf6f8; Mace regular",
			"fal fa-mace": "&#xf6f8; Mace light",
			"fab fa-mace": "&#xf6f8; Mace duotone",
			"fab fa-lyft": "&#xf3c3; lyft brands",
			"fas fa-lungs": "&#xf604; Lungs solid",
			"far fa-lungs": "&#xf604; Lungs regular",
			"fal fa-lungs": "&#xf604; Lungs light",
			"fab fa-lungs": "&#xf604; Lungs duotone",
			"fas fa-luggage-cart": "&#xf59d; Luggage Cart solid",
			"far fa-luggage-cart": "&#xf59d; Luggage Cart regular",
			"fal fa-luggage-cart": "&#xf59d; Luggage Cart light",
			"fab fa-luggage-cart": "&#xf59d; Luggage Cart duotone",
			"fas fa-luchador": "&#xf455; Luchador solid",
			"far fa-luchador": "&#xf455; Luchador regular",
			"fal fa-luchador": "&#xf455; Luchador light",
			"fab fa-luchador": "&#xf455; Luchador duotone",
			"fas fa-low-vision": "&#xf2a8; Low Vision solid",
			"far fa-low-vision": "&#xf2a8; Low Vision regular",
			"fal fa-low-vision": "&#xf2a8; Low Vision light",
			"fab fa-low-vision": "&#xf2a8; Low Vision duotone",
			"fas fa-loveseat": "&#xf4cc; Loveseat solid",
			"far fa-loveseat": "&#xf4cc; Loveseat regular",
			"fal fa-loveseat": "&#xf4cc; Loveseat light",
			"fab fa-loveseat": "&#xf4cc; Loveseat duotone",
			"fas fa-long-arrow-up": "&#xf176; Long Arrow Up solid",
			"far fa-long-arrow-up": "&#xf176; Long Arrow Up regular",
			"fal fa-long-arrow-up": "&#xf176; Long Arrow Up light",
			"fab fa-long-arrow-up": "&#xf176; Long Arrow Up duotone",
			"fas fa-long-arrow-right": "&#xf178; Long Arrow Right solid",
			"far fa-long-arrow-right": "&#xf178; Long Arrow Right regular",
			"fal fa-long-arrow-right": "&#xf178; Long Arrow Right light",
			"fab fa-long-arrow-right": "&#xf178; Long Arrow Right duotone",
			"fas fa-long-arrow-left": "&#xf177; Long Arrow Left solid",
			"far fa-long-arrow-left": "&#xf177; Long Arrow Left regular",
			"fal fa-long-arrow-left": "&#xf177; Long Arrow Left light",
			"fab fa-long-arrow-left": "&#xf177; Long Arrow Left duotone",
			"fas fa-long-arrow-down": "&#xf175; Long Arrow Down solid",
			"far fa-long-arrow-down": "&#xf175; Long Arrow Down regular",
			"fal fa-long-arrow-down": "&#xf175; Long Arrow Down light",
			"fab fa-long-arrow-down": "&#xf175; Long Arrow Down duotone",
			"fas fa-long-arrow-alt-up": "&#xf30c; Alternate Long Arrow Up solid",
			"far fa-long-arrow-alt-up": "&#xf30c; Alternate Long Arrow Up regular",
			"fal fa-long-arrow-alt-up": "&#xf30c; Alternate Long Arrow Up light",
			"fab fa-long-arrow-alt-up": "&#xf30c; Alternate Long Arrow Up duotone",
			"fas fa-long-arrow-alt-right": "&#xf30b; Alternate Long Arrow Right solid",
			"far fa-long-arrow-alt-right": "&#xf30b; Alternate Long Arrow Right regular",
			"fal fa-long-arrow-alt-right": "&#xf30b; Alternate Long Arrow Right light",
			"fab fa-long-arrow-alt-right": "&#xf30b; Alternate Long Arrow Right duotone",
			"fas fa-long-arrow-alt-left": "&#xf30a; Alternate Long Arrow Left solid",
			"far fa-long-arrow-alt-left": "&#xf30a; Alternate Long Arrow Left regular",
			"fal fa-long-arrow-alt-left": "&#xf30a; Alternate Long Arrow Left light",
			"fab fa-long-arrow-alt-left": "&#xf30a; Alternate Long Arrow Left duotone",
			"fas fa-long-arrow-alt-down": "&#xf309; Alternate Long Arrow Down solid",
			"far fa-long-arrow-alt-down": "&#xf309; Alternate Long Arrow Down regular",
			"fal fa-long-arrow-alt-down": "&#xf309; Alternate Long Arrow Down light",
			"fab fa-long-arrow-alt-down": "&#xf309; Alternate Long Arrow Down duotone",
			"fas fa-lock-open-alt": "&#xf3c2; Alternate Lock Open solid",
			"far fa-lock-open-alt": "&#xf3c2; Alternate Lock Open regular",
			"fal fa-lock-open-alt": "&#xf3c2; Alternate Lock Open light",
			"fab fa-lock-open-alt": "&#xf3c2; Alternate Lock Open duotone",
			"fas fa-lock-open": "&#xf3c1; Lock Open solid",
			"far fa-lock-open": "&#xf3c1; Lock Open regular",
			"fal fa-lock-open": "&#xf3c1; Lock Open light",
			"fab fa-lock-open": "&#xf3c1; Lock Open duotone",
			"fas fa-lock-alt": "&#xf30d; Alternate Lock solid",
			"far fa-lock-alt": "&#xf30d; Alternate Lock regular",
			"fal fa-lock-alt": "&#xf30d; Alternate Lock light",
			"fab fa-lock-alt": "&#xf30d; Alternate Lock duotone",
			"fas fa-lock": "&#xf023; lock solid",
			"far fa-lock": "&#xf023; lock regular",
			"fal fa-lock": "&#xf023; lock light",
			"fab fa-lock": "&#xf023; lock duotone",
			"fas fa-location-slash": "&#xf603; Location Slash solid",
			"far fa-location-slash": "&#xf603; Location Slash regular",
			"fal fa-location-slash": "&#xf603; Location Slash light",
			"fab fa-location-slash": "&#xf603; Location Slash duotone",
			"fas fa-location-circle": "&#xf602; Location Circle solid",
			"far fa-location-circle": "&#xf602; Location Circle regular",
			"fal fa-location-circle": "&#xf602; Location Circle light",
			"fab fa-location-circle": "&#xf602; Location Circle duotone",
			"fas fa-location-arrow": "&#xf124; location-arrow solid",
			"far fa-location-arrow": "&#xf124; location-arrow regular",
			"fal fa-location-arrow": "&#xf124; location-arrow light",
			"fab fa-location-arrow": "&#xf124; location-arrow duotone",
			"fas fa-location": "&#xf601; Location solid",
			"far fa-location": "&#xf601; Location regular",
			"fal fa-location": "&#xf601; Location light",
			"fab fa-location": "&#xf601; Location duotone",
			"fas fa-list-ul": "&#xf0ca; list-ul solid",
			"far fa-list-ul": "&#xf0ca; list-ul regular",
			"fal fa-list-ul": "&#xf0ca; list-ul light",
			"fab fa-list-ul": "&#xf0ca; list-ul duotone",
			"fas fa-list-ol": "&#xf0cb; list-ol solid",
			"far fa-list-ol": "&#xf0cb; list-ol regular",
			"fal fa-list-ol": "&#xf0cb; list-ol light",
			"fab fa-list-ol": "&#xf0cb; list-ol duotone",
			"fas fa-list-music": "&#xf8c9; List Music solid",
			"far fa-list-music": "&#xf8c9; List Music regular",
			"fal fa-list-music": "&#xf8c9; List Music light",
			"fab fa-list-music": "&#xf8c9; List Music duotone",
			"fas fa-list-alt": "&#xf022; Alternate List solid",
			"far fa-list-alt": "&#xf022; Alternate List regular",
			"fal fa-list-alt": "&#xf022; Alternate List light",
			"fab fa-list-alt": "&#xf022; Alternate List duotone",
			"fas fa-list": "&#xf03a; List solid",
			"far fa-list": "&#xf03a; List regular",
			"fal fa-list": "&#xf03a; List light",
			"fab fa-list": "&#xf03a; List duotone",
			"fas fa-lira-sign": "&#xf195; Turkish Lira Sign solid",
			"far fa-lira-sign": "&#xf195; Turkish Lira Sign regular",
			"fal fa-lira-sign": "&#xf195; Turkish Lira Sign light",
			"fab fa-lira-sign": "&#xf195; Turkish Lira Sign duotone",
			"fas fa-lips": "&#xf600; Lips solid",
			"far fa-lips": "&#xf600; Lips regular",
			"fal fa-lips": "&#xf600; Lips light",
			"fab fa-lips": "&#xf600; Lips duotone",
			"fab fa-linux": "&#xf17c; Linux brands",
			"fab fa-linode": "&#xf2b8; Linode brands",
			"fab fa-linkedin-in": "&#xf0e1; LinkedIn In brands",
			"fab fa-linkedin": "&#xf08c; LinkedIn brands",
			"fas fa-link": "&#xf0c1; Link solid",
			"far fa-link": "&#xf0c1; Link regular",
			"fal fa-link": "&#xf0c1; Link light",
			"fab fa-link": "&#xf0c1; Link duotone",
			"fas fa-line-height": "&#xf871; Line Height solid",
			"far fa-line-height": "&#xf871; Line Height regular",
			"fal fa-line-height": "&#xf871; Line Height light",
			"fab fa-line-height": "&#xf871; Line Height duotone",
			"fas fa-line-columns": "&#xf870; Line Columns solid",
			"far fa-line-columns": "&#xf870; Line Columns regular",
			"fal fa-line-columns": "&#xf870; Line Columns light",
			"fab fa-line-columns": "&#xf870; Line Columns duotone",
			"fab fa-line": "&#xf3c0; Line brands",
			"fas fa-lights-holiday": "&#xf7b2; Holiday Lights solid",
			"far fa-lights-holiday": "&#xf7b2; Holiday Lights regular",
			"fal fa-lights-holiday": "&#xf7b2; Holiday Lights light",
			"fab fa-lights-holiday": "&#xf7b2; Holiday Lights duotone",
			"fas fa-lightbulb-slash": "&#xf673; Lightbulb Slash solid",
			"far fa-lightbulb-slash": "&#xf673; Lightbulb Slash regular",
			"fal fa-lightbulb-slash": "&#xf673; Lightbulb Slash light",
			"fab fa-lightbulb-slash": "&#xf673; Lightbulb Slash duotone",
			"fas fa-lightbulb-on": "&#xf672; Lightbulb On solid",
			"far fa-lightbulb-on": "&#xf672; Lightbulb On regular",
			"fal fa-lightbulb-on": "&#xf672; Lightbulb On light",
			"fab fa-lightbulb-on": "&#xf672; Lightbulb On duotone",
			"fas fa-lightbulb-exclamation": "&#xf671; Lightbulb Exclamation solid",
			"far fa-lightbulb-exclamation": "&#xf671; Lightbulb Exclamation regular",
			"fal fa-lightbulb-exclamation": "&#xf671; Lightbulb Exclamation light",
			"fab fa-lightbulb-exclamation": "&#xf671; Lightbulb Exclamation duotone",
			"fas fa-lightbulb-dollar": "&#xf670; Lightbulb Dollar solid",
			"far fa-lightbulb-dollar": "&#xf670; Lightbulb Dollar regular",
			"fal fa-lightbulb-dollar": "&#xf670; Lightbulb Dollar light",
			"fab fa-lightbulb-dollar": "&#xf670; Lightbulb Dollar duotone",
			"fas fa-lightbulb": "&#xf0eb; Lightbulb solid",
			"far fa-lightbulb": "&#xf0eb; Lightbulb regular",
			"fal fa-lightbulb": "&#xf0eb; Lightbulb light",
			"fab fa-lightbulb": "&#xf0eb; Lightbulb duotone",
			"fas fa-life-ring": "&#xf1cd; Life Ring solid",
			"far fa-life-ring": "&#xf1cd; Life Ring regular",
			"fal fa-life-ring": "&#xf1cd; Life Ring light",
			"fab fa-life-ring": "&#xf1cd; Life Ring duotone",
			"fas fa-level-up-alt": "&#xf3bf; Alternate Level Up solid",
			"far fa-level-up-alt": "&#xf3bf; Alternate Level Up regular",
			"fal fa-level-up-alt": "&#xf3bf; Alternate Level Up light",
			"fab fa-level-up-alt": "&#xf3bf; Alternate Level Up duotone",
			"fas fa-level-up": "&#xf148; Level Up solid",
			"far fa-level-up": "&#xf148; Level Up regular",
			"fal fa-level-up": "&#xf148; Level Up light",
			"fab fa-level-up": "&#xf148; Level Up duotone",
			"fas fa-level-down-alt": "&#xf3be; Alternate Level Down solid",
			"far fa-level-down-alt": "&#xf3be; Alternate Level Down regular",
			"fal fa-level-down-alt": "&#xf3be; Alternate Level Down light",
			"fab fa-level-down-alt": "&#xf3be; Alternate Level Down duotone",
			"fas fa-level-down": "&#xf149; Level Down solid",
			"far fa-level-down": "&#xf149; Level Down regular",
			"fal fa-level-down": "&#xf149; Level Down light",
			"fab fa-level-down": "&#xf149; Level Down duotone",
			"fas fa-less-than-equal": "&#xf537; Less Than Equal To solid",
			"far fa-less-than-equal": "&#xf537; Less Than Equal To regular",
			"fal fa-less-than-equal": "&#xf537; Less Than Equal To light",
			"fab fa-less-than-equal": "&#xf537; Less Than Equal To duotone",
			"fas fa-less-than": "&#xf536; Less Than solid",
			"far fa-less-than": "&#xf536; Less Than regular",
			"fal fa-less-than": "&#xf536; Less Than light",
			"fab fa-less-than": "&#xf536; Less Than duotone",
			"fab fa-less": "&#xf41d; Less brands",
			"fas fa-lemon": "&#xf094; Lemon solid",
			"far fa-lemon": "&#xf094; Lemon regular",
			"fal fa-lemon": "&#xf094; Lemon light",
			"fab fa-lemon": "&#xf094; Lemon duotone",
			"fab fa-leanpub": "&#xf212; Leanpub brands",
			"fas fa-leaf-oak": "&#xf6f7; Oak Leaf solid",
			"far fa-leaf-oak": "&#xf6f7; Oak Leaf regular",
			"fal fa-leaf-oak": "&#xf6f7; Oak Leaf light",
			"fab fa-leaf-oak": "&#xf6f7; Oak Leaf duotone",
			"fas fa-leaf-maple": "&#xf6f6; Maple Leaf solid",
			"far fa-leaf-maple": "&#xf6f6; Maple Leaf regular",
			"fal fa-leaf-maple": "&#xf6f6; Maple Leaf light",
			"fab fa-leaf-maple": "&#xf6f6; Maple Leaf duotone",
			"fas fa-leaf-heart": "&#xf4cb; Leaf with a Heart solid",
			"far fa-leaf-heart": "&#xf4cb; Leaf with a Heart regular",
			"fal fa-leaf-heart": "&#xf4cb; Leaf with a Heart light",
			"fab fa-leaf-heart": "&#xf4cb; Leaf with a Heart duotone",
			"fas fa-leaf": "&#xf06c; leaf solid",
			"far fa-leaf": "&#xf06c; leaf regular",
			"fal fa-leaf": "&#xf06c; leaf light",
			"fab fa-leaf": "&#xf06c; leaf duotone",
			"fas fa-layer-plus": "&#xf5ff; Layer Plus solid",
			"far fa-layer-plus": "&#xf5ff; Layer Plus regular",
			"fal fa-layer-plus": "&#xf5ff; Layer Plus light",
			"fab fa-layer-plus": "&#xf5ff; Layer Plus duotone",
			"fas fa-layer-minus": "&#xf5fe; Layer Minus solid",
			"far fa-layer-minus": "&#xf5fe; Layer Minus regular",
			"fal fa-layer-minus": "&#xf5fe; Layer Minus light",
			"fab fa-layer-minus": "&#xf5fe; Layer Minus duotone",
			"fas fa-layer-group": "&#xf5fd; Layer Group solid",
			"far fa-layer-group": "&#xf5fd; Layer Group regular",
			"fal fa-layer-group": "&#xf5fd; Layer Group light",
			"fab fa-layer-group": "&#xf5fd; Layer Group duotone",
			"fas fa-laugh-wink": "&#xf59c; Laughing Winking Face solid",
			"far fa-laugh-wink": "&#xf59c; Laughing Winking Face regular",
			"fal fa-laugh-wink": "&#xf59c; Laughing Winking Face light",
			"fab fa-laugh-wink": "&#xf59c; Laughing Winking Face duotone",
			"fas fa-laugh-squint": "&#xf59b; Laughing Squinting Face solid",
			"far fa-laugh-squint": "&#xf59b; Laughing Squinting Face regular",
			"fal fa-laugh-squint": "&#xf59b; Laughing Squinting Face light",
			"fab fa-laugh-squint": "&#xf59b; Laughing Squinting Face duotone",
			"fas fa-laugh-beam": "&#xf59a; Laugh Face with Beaming Eyes solid",
			"far fa-laugh-beam": "&#xf59a; Laugh Face with Beaming Eyes regular",
			"fal fa-laugh-beam": "&#xf59a; Laugh Face with Beaming Eyes light",
			"fab fa-laugh-beam": "&#xf59a; Laugh Face with Beaming Eyes duotone",
			"fas fa-laugh": "&#xf599; Grinning Face With Big Eyes solid",
			"far fa-laugh": "&#xf599; Grinning Face With Big Eyes regular",
			"fal fa-laugh": "&#xf599; Grinning Face With Big Eyes light",
			"fab fa-laugh": "&#xf599; Grinning Face With Big Eyes duotone",
			"fab fa-lastfm-square": "&#xf203; last.fm Square brands",
			"fab fa-lastfm": "&#xf202; last.fm brands",
			"fal fa-lasso": "&#xf8c8; Lasso light",
			"far fa-lasso": "&#xf8c8; Lasso regular",
			"fas fa-lasso": "&#xf8c8; Lasso solid",
			"fab fa-lasso": "&#xf8c8; Lasso duotone",
			"fab fa-laravel": "&#xf3bd; Laravel brands",
			"fas fa-laptop-medical": "&#xf812; Laptop Medical solid",
			"far fa-laptop-medical": "&#xf812; Laptop Medical regular",
			"fal fa-laptop-medical": "&#xf812; Laptop Medical light",
			"fab fa-laptop-medical": "&#xf812; Laptop Medical duotone",
			"fas fa-laptop-code": "&#xf5fc; Laptop Code solid",
			"far fa-laptop-code": "&#xf5fc; Laptop Code regular",
			"fal fa-laptop-code": "&#xf5fc; Laptop Code light",
			"fab fa-laptop-code": "&#xf5fc; Laptop Code duotone",
			"fas fa-laptop": "&#xf109; Laptop solid",
			"far fa-laptop": "&#xf109; Laptop regular",
			"fal fa-laptop": "&#xf109; Laptop light",
			"fab fa-laptop": "&#xf109; Laptop duotone",
			"fas fa-language": "&#xf1ab; Language solid",
			"far fa-language": "&#xf1ab; Language regular",
			"fal fa-language": "&#xf1ab; Language light",
			"fab fa-language": "&#xf1ab; Language duotone",
			"fas fa-landmark-alt": "&#xf752; Alternative Landmark solid",
			"far fa-landmark-alt": "&#xf752; Alternative Landmark regular",
			"fal fa-landmark-alt": "&#xf752; Alternative Landmark light",
			"fab fa-landmark-alt": "&#xf752; Alternative Landmark duotone",
			"fas fa-landmark": "&#xf66f; Landmark solid",
			"far fa-landmark": "&#xf66f; Landmark regular",
			"fal fa-landmark": "&#xf66f; Landmark light",
			"fab fa-landmark": "&#xf66f; Landmark duotone",
			"fas fa-lamp": "&#xf4ca; Lamp solid",
			"far fa-lamp": "&#xf4ca; Lamp regular",
			"fal fa-lamp": "&#xf4ca; Lamp light",
			"fab fa-lamp": "&#xf4ca; Lamp duotone",
			"fas fa-lambda": "&#xf66e; Lambda solid",
			"far fa-lambda": "&#xf66e; Lambda regular",
			"fal fa-lambda": "&#xf66e; Lambda light",
			"fab fa-lambda": "&#xf66e; Lambda duotone",
			"fab fa-korvue": "&#xf42f; KORVUE brands",
			"fas fa-knife-kitchen": "&#xf6f5; Knife Kitchen solid",
			"far fa-knife-kitchen": "&#xf6f5; Knife Kitchen regular",
			"fal fa-knife-kitchen": "&#xf6f5; Knife Kitchen light",
			"fab fa-knife-kitchen": "&#xf6f5; Knife Kitchen duotone",
			"fas fa-kiwi-bird": "&#xf535; Kiwi Bird solid",
			"far fa-kiwi-bird": "&#xf535; Kiwi Bird regular",
			"fal fa-kiwi-bird": "&#xf535; Kiwi Bird light",
			"fab fa-kiwi-bird": "&#xf535; Kiwi Bird duotone",
			"fas fa-kite": "&#xf6f4; Kite solid",
			"far fa-kite": "&#xf6f4; Kite regular",
			"fal fa-kite": "&#xf6f4; Kite light",
			"fab fa-kite": "&#xf6f4; Kite duotone",
			"fas fa-kiss-wink-heart": "&#xf598; Face Blowing a Kiss solid",
			"far fa-kiss-wink-heart": "&#xf598; Face Blowing a Kiss regular",
			"fal fa-kiss-wink-heart": "&#xf598; Face Blowing a Kiss light",
			"fab fa-kiss-wink-heart": "&#xf598; Face Blowing a Kiss duotone",
			"fas fa-kiss-beam": "&#xf597; Kissing Face With Smiling Eyes solid",
			"far fa-kiss-beam": "&#xf597; Kissing Face With Smiling Eyes regular",
			"fal fa-kiss-beam": "&#xf597; Kissing Face With Smiling Eyes light",
			"fab fa-kiss-beam": "&#xf597; Kissing Face With Smiling Eyes duotone",
			"fas fa-kiss": "&#xf596; Kissing Face solid",
			"far fa-kiss": "&#xf596; Kissing Face regular",
			"fal fa-kiss": "&#xf596; Kissing Face light",
			"fab fa-kiss": "&#xf596; Kissing Face duotone",
			"fas fa-kidneys": "&#xf5fb; Kidneys solid",
			"far fa-kidneys": "&#xf5fb; Kidneys regular",
			"fal fa-kidneys": "&#xf5fb; Kidneys light",
			"fab fa-kidneys": "&#xf5fb; Kidneys duotone",
			"fab fa-kickstarter-k": "&#xf3bc; Kickstarter K brands",
			"fab fa-kickstarter": "&#xf3bb; Kickstarter brands",
			"fas fa-khanda": "&#xf66d; Khanda solid",
			"far fa-khanda": "&#xf66d; Khanda regular",
			"fal fa-khanda": "&#xf66d; Khanda light",
			"fab fa-khanda": "&#xf66d; Khanda duotone",
			"fas fa-keynote": "&#xf66c; Keynote solid",
			"far fa-keynote": "&#xf66c; Keynote regular",
			"fal fa-keynote": "&#xf66c; Keynote light",
			"fab fa-keynote": "&#xf66c; Keynote duotone",
			"fab fa-keycdn": "&#xf3ba; KeyCDN brands",
			"fas fa-keyboard": "&#xf11c; Keyboard solid",
			"far fa-keyboard": "&#xf11c; Keyboard regular",
			"fal fa-keyboard": "&#xf11c; Keyboard light",
			"fab fa-keyboard": "&#xf11c; Keyboard duotone",
			"fab fa-keybase": "&#xf4f5; Keybase brands",
			"fas fa-key-skeleton": "&#xf6f3; Key Skeleton solid",
			"far fa-key-skeleton": "&#xf6f3; Key Skeleton regular",
			"fal fa-key-skeleton": "&#xf6f3; Key Skeleton light",
			"fab fa-key-skeleton": "&#xf6f3; Key Skeleton duotone",
			"fas fa-key": "&#xf084; key solid",
			"far fa-key": "&#xf084; key regular",
			"fal fa-key": "&#xf084; key light",
			"fab fa-key": "&#xf084; key duotone",
			"fas fa-kerning": "&#xf86f; Kerning solid",
			"far fa-kerning": "&#xf86f; Kerning regular",
			"fal fa-kerning": "&#xf86f; Kerning light",
			"fab fa-kerning": "&#xf86f; Kerning duotone",
			"fas fa-kazoo": "&#xf8c7; Kazoo solid",
			"far fa-kazoo": "&#xf8c7; Kazoo regular",
			"fal fa-kazoo": "&#xf8c7; Kazoo light",
			"fab fa-kazoo": "&#xf8c7; Kazoo duotone",
			"fab fa-kaggle": "&#xf5fa; Kaggle brands",
			"fas fa-kaaba": "&#xf66b; Kaaba solid",
			"far fa-kaaba": "&#xf66b; Kaaba regular",
			"fal fa-kaaba": "&#xf66b; Kaaba light",
			"fab fa-kaaba": "&#xf66b; Kaaba duotone",
			"fal fa-jug": "&#xf8c6; Jug light",
			"far fa-jug": "&#xf8c6; Jug regular",
			"fas fa-jug": "&#xf8c6; Jug solid",
			"fab fa-jug": "&#xf8c6; Jug duotone",
			"fab fa-jsfiddle": "&#xf1cc; jsFiddle brands",
			"fab fa-js-square": "&#xf3b9; JavaScript (JS) Square brands",
			"fab fa-js": "&#xf3b8; JavaScript (JS) brands",
			"fas fa-joystick": "&#xf8c5; Joystick solid",
			"far fa-joystick": "&#xf8c5; Joystick regular",
			"fal fa-joystick": "&#xf8c5; Joystick light",
			"fab fa-joystick": "&#xf8c5; Joystick duotone",
			"fas fa-journal-whills": "&#xf66a; Journal of the Whills solid",
			"far fa-journal-whills": "&#xf66a; Journal of the Whills regular",
			"fal fa-journal-whills": "&#xf66a; Journal of the Whills light",
			"fab fa-journal-whills": "&#xf66a; Journal of the Whills duotone",
			"fab fa-joomla": "&#xf1aa; Joomla Logo brands",
			"fas fa-joint": "&#xf595; Joint solid",
			"far fa-joint": "&#xf595; Joint regular",
			"fal fa-joint": "&#xf595; Joint light",
			"fab fa-joint": "&#xf595; Joint duotone",
			"fab fa-joget": "&#xf3b7; Joget brands",
			"fab fa-jira": "&#xf7b1; Jira brands",
			"fab fa-jenkins": "&#xf3b6; Jenkis brands",
			"fab fa-jedi-order": "&#xf50e; Jedi Order brands",
			"fas fa-jedi": "&#xf669; Jedi solid",
			"far fa-jedi": "&#xf669; Jedi regular",
			"fal fa-jedi": "&#xf669; Jedi light",
			"fab fa-jedi": "&#xf669; Jedi duotone",
			"fab fa-java": "&#xf4e4; Java brands",
			"fas fa-jack-o-lantern": "&#xf30e; Jack-o'-lantern solid",
			"far fa-jack-o-lantern": "&#xf30e; Jack-o'-lantern regular",
			"fal fa-jack-o-lantern": "&#xf30e; Jack-o'-lantern light",
			"fab fa-jack-o-lantern": "&#xf30e; Jack-o'-lantern duotone",
			"fab fa-itunes-note": "&#xf3b5; Itunes Note brands",
			"fab fa-itunes": "&#xf3b4; iTunes brands",
			"fab fa-itch-io": "&#xf83a; itch.io brands",
			"fas fa-italic": "&#xf033; italic solid",
			"far fa-italic": "&#xf033; italic regular",
			"fal fa-italic": "&#xf033; italic light",
			"fab fa-italic": "&#xf033; italic duotone",
			"fas fa-island-tropical": "&#xf811; Tropical Island solid",
			"far fa-island-tropical": "&#xf811; Tropical Island regular",
			"fal fa-island-tropical": "&#xf811; Tropical Island light",
			"fab fa-island-tropical": "&#xf811; Tropical Island duotone",
			"fab fa-ioxhost": "&#xf208; ioxhost brands",
			"fab fa-invision": "&#xf7b0; InVision brands",
			"fas fa-inventory": "&#xf480; Inventory solid",
			"far fa-inventory": "&#xf480; Inventory regular",
			"fal fa-inventory": "&#xf480; Inventory light",
			"fab fa-inventory": "&#xf480; Inventory duotone",
			"fas fa-intersection": "&#xf668; Intersection solid",
			"far fa-intersection": "&#xf668; Intersection regular",
			"fal fa-intersection": "&#xf668; Intersection light",
			"fab fa-intersection": "&#xf668; Intersection duotone",
			"fab fa-internet-explorer": "&#xf26b; Internet-explorer brands",
			"fab fa-intercom": "&#xf7af; Intercom brands",
			"fas fa-integral": "&#xf667; Integral solid",
			"far fa-integral": "&#xf667; Integral regular",
			"fal fa-integral": "&#xf667; Integral light",
			"fab fa-integral": "&#xf667; Integral duotone",
			"fab fa-instagram": "&#xf16d; Instagram brands",
			"fas fa-inhaler": "&#xf5f9; Inhaler solid",
			"far fa-inhaler": "&#xf5f9; Inhaler regular",
			"fal fa-inhaler": "&#xf5f9; Inhaler light",
			"fab fa-inhaler": "&#xf5f9; Inhaler duotone",
			"fas fa-info-square": "&#xf30f; Info Square solid",
			"far fa-info-square": "&#xf30f; Info Square regular",
			"fal fa-info-square": "&#xf30f; Info Square light",
			"fab fa-info-square": "&#xf30f; Info Square duotone",
			"fas fa-info-circle": "&#xf05a; Info Circle solid",
			"far fa-info-circle": "&#xf05a; Info Circle regular",
			"fal fa-info-circle": "&#xf05a; Info Circle light",
			"fab fa-info-circle": "&#xf05a; Info Circle duotone",
			"fas fa-info": "&#xf129; Info solid",
			"far fa-info": "&#xf129; Info regular",
			"fal fa-info": "&#xf129; Info light",
			"fab fa-info": "&#xf129; Info duotone",
			"fas fa-infinity": "&#xf534; Infinity solid",
			"far fa-infinity": "&#xf534; Infinity regular",
			"fal fa-infinity": "&#xf534; Infinity light",
			"fab fa-infinity": "&#xf534; Infinity duotone",
			"fas fa-industry-alt": "&#xf3b3; Alternate Industry solid",
			"far fa-industry-alt": "&#xf3b3; Alternate Industry regular",
			"fal fa-industry-alt": "&#xf3b3; Alternate Industry light",
			"fab fa-industry-alt": "&#xf3b3; Alternate Industry duotone",
			"fas fa-industry": "&#xf275; Industry solid",
			"far fa-industry": "&#xf275; Industry regular",
			"fal fa-industry": "&#xf275; Industry light",
			"fab fa-industry": "&#xf275; Industry duotone",
			"fas fa-indent": "&#xf03c; Indent solid",
			"far fa-indent": "&#xf03c; Indent regular",
			"fal fa-indent": "&#xf03c; Indent light",
			"fab fa-indent": "&#xf03c; Indent duotone",
			"fas fa-inbox-out": "&#xf311; Inbox Out solid",
			"far fa-inbox-out": "&#xf311; Inbox Out regular",
			"fal fa-inbox-out": "&#xf311; Inbox Out light",
			"fab fa-inbox-out": "&#xf311; Inbox Out duotone",
			"fas fa-inbox-in": "&#xf310; Inbox In solid",
			"far fa-inbox-in": "&#xf310; Inbox In regular",
			"fal fa-inbox-in": "&#xf310; Inbox In light",
			"fab fa-inbox-in": "&#xf310; Inbox In duotone",
			"fas fa-inbox": "&#xf01c; inbox solid",
			"far fa-inbox": "&#xf01c; inbox regular",
			"fal fa-inbox": "&#xf01c; inbox light",
			"fab fa-inbox": "&#xf01c; inbox duotone",
			"fab fa-imdb": "&#xf2d8; IMDB brands",
			"fas fa-images": "&#xf302; Images solid",
			"far fa-images": "&#xf302; Images regular",
			"fal fa-images": "&#xf302; Images light",
			"fab fa-images": "&#xf302; Images duotone",
			"fas fa-image-polaroid": "&#xf8c4; Polaroid Image solid",
			"far fa-image-polaroid": "&#xf8c4; Polaroid Image regular",
			"fal fa-image-polaroid": "&#xf8c4; Polaroid Image light",
			"fab fa-image-polaroid": "&#xf8c4; Polaroid Image duotone",
			"fas fa-image": "&#xf03e; Image solid",
			"far fa-image": "&#xf03e; Image regular",
			"fal fa-image": "&#xf03e; Image light",
			"fab fa-image": "&#xf03e; Image duotone",
			"fas fa-igloo": "&#xf7ae; Igloo solid",
			"far fa-igloo": "&#xf7ae; Igloo regular",
			"fal fa-igloo": "&#xf7ae; Igloo light",
			"fab fa-igloo": "&#xf7ae; Igloo duotone",
			"fas fa-id-card-alt": "&#xf47f; Alternate Identification Card solid",
			"far fa-id-card-alt": "&#xf47f; Alternate Identification Card regular",
			"fal fa-id-card-alt": "&#xf47f; Alternate Identification Card light",
			"fab fa-id-card-alt": "&#xf47f; Alternate Identification Card duotone",
			"fas fa-id-card": "&#xf2c2; Identification Card solid",
			"far fa-id-card": "&#xf2c2; Identification Card regular",
			"fal fa-id-card": "&#xf2c2; Identification Card light",
			"fab fa-id-card": "&#xf2c2; Identification Card duotone",
			"fas fa-id-badge": "&#xf2c1; Identification Badge solid",
			"far fa-id-badge": "&#xf2c1; Identification Badge regular",
			"fal fa-id-badge": "&#xf2c1; Identification Badge light",
			"fab fa-id-badge": "&#xf2c1; Identification Badge duotone",
			"fas fa-icons-alt": "&#xf86e; Alternate Icons solid",
			"far fa-icons-alt": "&#xf86e; Alternate Icons regular",
			"fal fa-icons-alt": "&#xf86e; Alternate Icons light",
			"fab fa-icons-alt": "&#xf86e; Alternate Icons duotone",
			"fas fa-icons": "&#xf86d; Icons solid",
			"far fa-icons": "&#xf86d; Icons regular",
			"fal fa-icons": "&#xf86d; Icons light",
			"fab fa-icons": "&#xf86d; Icons duotone",
			"fas fa-icicles": "&#xf7ad; Icicles solid",
			"far fa-icicles": "&#xf7ad; Icicles regular",
			"fal fa-icicles": "&#xf7ad; Icicles light",
			"fab fa-icicles": "&#xf7ad; Icicles duotone",
			"fas fa-ice-skate": "&#xf7ac; Ice Skate solid",
			"far fa-ice-skate": "&#xf7ac; Ice Skate regular",
			"fal fa-ice-skate": "&#xf7ac; Ice Skate light",
			"fab fa-ice-skate": "&#xf7ac; Ice Skate duotone",
			"fas fa-ice-cream": "&#xf810; Ice Cream solid",
			"far fa-ice-cream": "&#xf810; Ice Cream regular",
			"fal fa-ice-cream": "&#xf810; Ice Cream light",
			"fab fa-ice-cream": "&#xf810; Ice Cream duotone",
			"fas fa-i-cursor": "&#xf246; I Beam Cursor solid",
			"far fa-i-cursor": "&#xf246; I Beam Cursor regular",
			"fal fa-i-cursor": "&#xf246; I Beam Cursor light",
			"fab fa-i-cursor": "&#xf246; I Beam Cursor duotone",
			"fas fa-hurricane": "&#xf751; Hurricane solid",
			"far fa-hurricane": "&#xf751; Hurricane regular",
			"fal fa-hurricane": "&#xf751; Hurricane light",
			"fab fa-hurricane": "&#xf751; Hurricane duotone",
			"fas fa-humidity": "&#xf750; Humidity solid",
			"far fa-humidity": "&#xf750; Humidity regular",
			"fal fa-humidity": "&#xf750; Humidity light",
			"fab fa-humidity": "&#xf750; Humidity duotone",
			"fab fa-hubspot": "&#xf3b2; HubSpot brands",
			"fab fa-html5": "&#xf13b; HTML 5 Logo brands",
			"fas fa-hryvnia": "&#xf6f2; Hryvnia solid",
			"far fa-hryvnia": "&#xf6f2; Hryvnia regular",
			"fal fa-hryvnia": "&#xf6f2; Hryvnia light",
			"fab fa-hryvnia": "&#xf6f2; Hryvnia duotone",
			"fab fa-houzz": "&#xf27c; Houzz brands",
			"fas fa-house-flood": "&#xf74f; Flooded House solid",
			"far fa-house-flood": "&#xf74f; Flooded House regular",
			"fal fa-house-flood": "&#xf74f; Flooded House light",
			"fab fa-house-flood": "&#xf74f; Flooded House duotone",
			"fas fa-house-damage": "&#xf6f1; Damaged House solid",
			"far fa-house-damage": "&#xf6f1; Damaged House regular",
			"fal fa-house-damage": "&#xf6f1; Damaged House light",
			"fab fa-house-damage": "&#xf6f1; Damaged House duotone",
			"fas fa-hourglass-start": "&#xf251; Hourglass Start solid",
			"far fa-hourglass-start": "&#xf251; Hourglass Start regular",
			"fal fa-hourglass-start": "&#xf251; Hourglass Start light",
			"fab fa-hourglass-start": "&#xf251; Hourglass Start duotone",
			"fas fa-hourglass-half": "&#xf252; Hourglass Half solid",
			"far fa-hourglass-half": "&#xf252; Hourglass Half regular",
			"fal fa-hourglass-half": "&#xf252; Hourglass Half light",
			"fab fa-hourglass-half": "&#xf252; Hourglass Half duotone",
			"fas fa-hourglass-end": "&#xf253; Hourglass End solid",
			"far fa-hourglass-end": "&#xf253; Hourglass End regular",
			"fal fa-hourglass-end": "&#xf253; Hourglass End light",
			"fab fa-hourglass-end": "&#xf253; Hourglass End duotone",
			"fas fa-hourglass": "&#xf254; Hourglass solid",
			"far fa-hourglass": "&#xf254; Hourglass regular",
			"fal fa-hourglass": "&#xf254; Hourglass light",
			"fab fa-hourglass": "&#xf254; Hourglass duotone",
			"fab fa-hotjar": "&#xf3b1; Hotjar brands",
			"fas fa-hotel": "&#xf594; Hotel solid",
			"far fa-hotel": "&#xf594; Hotel regular",
			"fal fa-hotel": "&#xf594; Hotel light",
			"fab fa-hotel": "&#xf594; Hotel duotone",
			"fas fa-hotdog": "&#xf80f; Hot Dog solid",
			"far fa-hotdog": "&#xf80f; Hot Dog regular",
			"fal fa-hotdog": "&#xf80f; Hot Dog light",
			"fab fa-hotdog": "&#xf80f; Hot Dog duotone",
			"fas fa-hot-tub": "&#xf593; Hot Tub solid",
			"far fa-hot-tub": "&#xf593; Hot Tub regular",
			"fal fa-hot-tub": "&#xf593; Hot Tub light",
			"fab fa-hot-tub": "&#xf593; Hot Tub duotone",
			"fas fa-hospitals": "&#xf80e; Hospitals solid",
			"far fa-hospitals": "&#xf80e; Hospitals regular",
			"fal fa-hospitals": "&#xf80e; Hospitals light",
			"fab fa-hospitals": "&#xf80e; Hospitals duotone",
			"fas fa-hospital-user": "&#xf80d; Hospital with User solid",
			"far fa-hospital-user": "&#xf80d; Hospital with User regular",
			"fal fa-hospital-user": "&#xf80d; Hospital with User light",
			"fab fa-hospital-user": "&#xf80d; Hospital with User duotone",
			"fas fa-hospital-symbol": "&#xf47e; Hospital Symbol solid",
			"far fa-hospital-symbol": "&#xf47e; Hospital Symbol regular",
			"fal fa-hospital-symbol": "&#xf47e; Hospital Symbol light",
			"fab fa-hospital-symbol": "&#xf47e; Hospital Symbol duotone",
			"fas fa-hospital-alt": "&#xf47d; Alternate Hospital solid",
			"far fa-hospital-alt": "&#xf47d; Alternate Hospital regular",
			"fal fa-hospital-alt": "&#xf47d; Alternate Hospital light",
			"fab fa-hospital-alt": "&#xf47d; Alternate Hospital duotone",
			"fas fa-hospital": "&#xf0f8; hospital solid",
			"far fa-hospital": "&#xf0f8; hospital regular",
			"fal fa-hospital": "&#xf0f8; hospital light",
			"fab fa-hospital": "&#xf0f8; hospital duotone",
			"fal fa-horse-saddle": "&#xf8c3; Horse Saddle light",
			"far fa-horse-saddle": "&#xf8c3; Horse Saddle regular",
			"fas fa-horse-saddle": "&#xf8c3; Horse Saddle solid",
			"fab fa-horse-saddle": "&#xf8c3; Horse Saddle duotone",
			"fas fa-horse-head": "&#xf7ab; Horse Head solid",
			"far fa-horse-head": "&#xf7ab; Horse Head regular",
			"fal fa-horse-head": "&#xf7ab; Horse Head light",
			"fab fa-horse-head": "&#xf7ab; Horse Head duotone",
			"fas fa-horse": "&#xf6f0; Horse solid",
			"far fa-horse": "&#xf6f0; Horse regular",
			"fal fa-horse": "&#xf6f0; Horse light",
			"fab fa-horse": "&#xf6f0; Horse duotone",
			"fab fa-hornbill": "&#xf592; Hornbill brands",
			"fas fa-horizontal-rule": "&#xf86c; Horizontal Rule solid",
			"far fa-horizontal-rule": "&#xf86c; Horizontal Rule regular",
			"fal fa-horizontal-rule": "&#xf86c; Horizontal Rule light",
			"fab fa-horizontal-rule": "&#xf86c; Horizontal Rule duotone",
			"fab fa-hooli": "&#xf427; Hooli brands",
			"fas fa-hood-cloak": "&#xf6ef; Hood Cloak solid",
			"far fa-hood-cloak": "&#xf6ef; Hood Cloak regular",
			"fal fa-hood-cloak": "&#xf6ef; Hood Cloak light",
			"fab fa-hood-cloak": "&#xf6ef; Hood Cloak duotone",
			"fas fa-home-lg-alt": "&#xf80c; Alternative Home Large solid",
			"far fa-home-lg-alt": "&#xf80c; Alternative Home Large regular",
			"fal fa-home-lg-alt": "&#xf80c; Alternative Home Large light",
			"fab fa-home-lg-alt": "&#xf80c; Alternative Home Large duotone",
			"fas fa-home-lg": "&#xf80b; Home Large solid",
			"far fa-home-lg": "&#xf80b; Home Large regular",
			"fal fa-home-lg": "&#xf80b; Home Large light",
			"fab fa-home-lg": "&#xf80b; Home Large duotone",
			"fas fa-home-heart": "&#xf4c9; Home Heart solid",
			"far fa-home-heart": "&#xf4c9; Home Heart regular",
			"fal fa-home-heart": "&#xf4c9; Home Heart light",
			"fab fa-home-heart": "&#xf4c9; Home Heart duotone",
			"fas fa-home-alt": "&#xf80a; Alternate Home solid",
			"far fa-home-alt": "&#xf80a; Alternate Home regular",
			"fal fa-home-alt": "&#xf80a; Alternate Home light",
			"fab fa-home-alt": "&#xf80a; Alternate Home duotone",
			"fas fa-home": "&#xf015; home solid",
			"far fa-home": "&#xf015; home regular",
			"fal fa-home": "&#xf015; home light",
			"fab fa-home": "&#xf015; home duotone",
			"fas fa-holly-berry": "&#xf7aa; Holly Berry solid",
			"far fa-holly-berry": "&#xf7aa; Holly Berry regular",
			"fal fa-holly-berry": "&#xf7aa; Holly Berry light",
			"fab fa-holly-berry": "&#xf7aa; Holly Berry duotone",
			"fas fa-hockey-sticks": "&#xf454; Hockey Sticks solid",
			"far fa-hockey-sticks": "&#xf454; Hockey Sticks regular",
			"fal fa-hockey-sticks": "&#xf454; Hockey Sticks light",
			"fab fa-hockey-sticks": "&#xf454; Hockey Sticks duotone",
			"fas fa-hockey-puck": "&#xf453; Hockey Puck solid",
			"far fa-hockey-puck": "&#xf453; Hockey Puck regular",
			"fal fa-hockey-puck": "&#xf453; Hockey Puck light",
			"fab fa-hockey-puck": "&#xf453; Hockey Puck duotone",
			"fas fa-hockey-mask": "&#xf6ee; Hockey Mask solid",
			"far fa-hockey-mask": "&#xf6ee; Hockey Mask regular",
			"fal fa-hockey-mask": "&#xf6ee; Hockey Mask light",
			"fab fa-hockey-mask": "&#xf6ee; Hockey Mask duotone",
			"fas fa-history": "&#xf1da; History solid",
			"far fa-history": "&#xf1da; History regular",
			"fal fa-history": "&#xf1da; History light",
			"fab fa-history": "&#xf1da; History duotone",
			"fab fa-hire-a-helper": "&#xf3b0; HireAHelper brands",
			"fab fa-hips": "&#xf452; Hips brands",
			"fas fa-hippo": "&#xf6ed; Hippo solid",
			"far fa-hippo": "&#xf6ed; Hippo regular",
			"fal fa-hippo": "&#xf6ed; Hippo light",
			"fab fa-hippo": "&#xf6ed; Hippo duotone",
			"fas fa-hiking": "&#xf6ec; Hiking solid",
			"far fa-hiking": "&#xf6ec; Hiking regular",
			"fal fa-hiking": "&#xf6ec; Hiking light",
			"fab fa-hiking": "&#xf6ec; Hiking duotone",
			"fas fa-highlighter": "&#xf591; Highlighter solid",
			"far fa-highlighter": "&#xf591; Highlighter regular",
			"fal fa-highlighter": "&#xf591; Highlighter light",
			"fab fa-highlighter": "&#xf591; Highlighter duotone",
			"fas fa-hexagon": "&#xf312; Hexagon solid",
			"far fa-hexagon": "&#xf312; Hexagon regular",
			"fal fa-hexagon": "&#xf312; Hexagon light",
			"fab fa-hexagon": "&#xf312; Hexagon duotone",
			"fas fa-helmet-battle": "&#xf6eb; Battle Helmet solid",
			"far fa-helmet-battle": "&#xf6eb; Battle Helmet regular",
			"fal fa-helmet-battle": "&#xf6eb; Battle Helmet light",
			"fab fa-helmet-battle": "&#xf6eb; Battle Helmet duotone",
			"fas fa-helicopter": "&#xf533; Helicopter solid",
			"far fa-helicopter": "&#xf533; Helicopter regular",
			"fal fa-helicopter": "&#xf533; Helicopter light",
			"fab fa-helicopter": "&#xf533; Helicopter duotone",
			"fas fa-heartbeat": "&#xf21e; Heartbeat solid",
			"far fa-heartbeat": "&#xf21e; Heartbeat regular",
			"fal fa-heartbeat": "&#xf21e; Heartbeat light",
			"fab fa-heartbeat": "&#xf21e; Heartbeat duotone",
			"fas fa-heart-square": "&#xf4c8; Heart Square solid",
			"far fa-heart-square": "&#xf4c8; Heart Square regular",
			"fal fa-heart-square": "&#xf4c8; Heart Square light",
			"fab fa-heart-square": "&#xf4c8; Heart Square duotone",
			"fas fa-heart-rate": "&#xf5f8; Heart Rate solid",
			"far fa-heart-rate": "&#xf5f8; Heart Rate regular",
			"fal fa-heart-rate": "&#xf5f8; Heart Rate light",
			"fab fa-heart-rate": "&#xf5f8; Heart Rate duotone",
			"fas fa-heart-circle": "&#xf4c7; Heart Circle solid",
			"far fa-heart-circle": "&#xf4c7; Heart Circle regular",
			"fal fa-heart-circle": "&#xf4c7; Heart Circle light",
			"fab fa-heart-circle": "&#xf4c7; Heart Circle duotone",
			"fas fa-heart-broken": "&#xf7a9; Heart Broken solid",
			"far fa-heart-broken": "&#xf7a9; Heart Broken regular",
			"fal fa-heart-broken": "&#xf7a9; Heart Broken light",
			"fab fa-heart-broken": "&#xf7a9; Heart Broken duotone",
			"fas fa-heart": "&#xf004; Heart solid",
			"far fa-heart": "&#xf004; Heart regular",
			"fal fa-heart": "&#xf004; Heart light",
			"fab fa-heart": "&#xf004; Heart duotone",
			"fas fa-headset": "&#xf590; Headset solid",
			"far fa-headset": "&#xf590; Headset regular",
			"fal fa-headset": "&#xf590; Headset light",
			"fab fa-headset": "&#xf590; Headset duotone",
			"fas fa-headphones-alt": "&#xf58f; Alternate Headphones solid",
			"far fa-headphones-alt": "&#xf58f; Alternate Headphones regular",
			"fal fa-headphones-alt": "&#xf58f; Alternate Headphones light",
			"fab fa-headphones-alt": "&#xf58f; Alternate Headphones duotone",
			"fas fa-headphones": "&#xf025; headphones solid",
			"far fa-headphones": "&#xf025; headphones regular",
			"fal fa-headphones": "&#xf025; headphones light",
			"fab fa-headphones": "&#xf025; headphones duotone",
			"fas fa-heading": "&#xf1dc; heading solid",
			"far fa-heading": "&#xf1dc; heading regular",
			"fal fa-heading": "&#xf1dc; heading light",
			"fab fa-heading": "&#xf1dc; heading duotone",
			"fas fa-head-vr": "&#xf6ea; Head VR solid",
			"far fa-head-vr": "&#xf6ea; Head VR regular",
			"fal fa-head-vr": "&#xf6ea; Head VR light",
			"fab fa-head-vr": "&#xf6ea; Head VR duotone",
			"fas fa-head-side-medical": "&#xf809; Head Side with Medical Symbol solid",
			"far fa-head-side-medical": "&#xf809; Head Side with Medical Symbol regular",
			"fal fa-head-side-medical": "&#xf809; Head Side with Medical Symbol light",
			"fab fa-head-side-medical": "&#xf809; Head Side with Medical Symbol duotone",
			"fas fa-head-side-headphones": "&#xf8c2; Head Side with Headphones solid",
			"far fa-head-side-headphones": "&#xf8c2; Head Side with Headphones regular",
			"fal fa-head-side-headphones": "&#xf8c2; Head Side with Headphones light",
			"fab fa-head-side-headphones": "&#xf8c2; Head Side with Headphones duotone",
			"fas fa-head-side-brain": "&#xf808; Head Side with Brain solid",
			"far fa-head-side-brain": "&#xf808; Head Side with Brain regular",
			"fal fa-head-side-brain": "&#xf808; Head Side with Brain light",
			"fab fa-head-side-brain": "&#xf808; Head Side with Brain duotone",
			"fas fa-head-side": "&#xf6e9; Head Side solid",
			"far fa-head-side": "&#xf6e9; Head Side regular",
			"fal fa-head-side": "&#xf6e9; Head Side light",
			"fab fa-head-side": "&#xf6e9; Head Side duotone",
			"fas fa-hdd": "&#xf0a0; HDD solid",
			"far fa-hdd": "&#xf0a0; HDD regular",
			"fal fa-hdd": "&#xf0a0; HDD light",
			"fab fa-hdd": "&#xf0a0; HDD duotone",
			"fas fa-haykal": "&#xf666; Haykal solid",
			"far fa-haykal": "&#xf666; Haykal regular",
			"fal fa-haykal": "&#xf666; Haykal light",
			"fab fa-haykal": "&#xf666; Haykal duotone",
			"fas fa-hat-wizard": "&#xf6e8; Wizard's Hat solid",
			"far fa-hat-wizard": "&#xf6e8; Wizard's Hat regular",
			"fal fa-hat-wizard": "&#xf6e8; Wizard's Hat light",
			"fab fa-hat-wizard": "&#xf6e8; Wizard's Hat duotone",
			"fas fa-hat-witch": "&#xf6e7; Witch's Hat solid",
			"far fa-hat-witch": "&#xf6e7; Witch's Hat regular",
			"fal fa-hat-witch": "&#xf6e7; Witch's Hat light",
			"fab fa-hat-witch": "&#xf6e7; Witch's Hat duotone",
			"fas fa-hat-winter": "&#xf7a8; Hat Winter solid",
			"far fa-hat-winter": "&#xf7a8; Hat Winter regular",
			"fal fa-hat-winter": "&#xf7a8; Hat Winter light",
			"fab fa-hat-winter": "&#xf7a8; Hat Winter duotone",
			"fas fa-hat-santa": "&#xf7a7; Santa's Hat solid",
			"far fa-hat-santa": "&#xf7a7; Santa's Hat regular",
			"fal fa-hat-santa": "&#xf7a7; Santa's Hat light",
			"fab fa-hat-santa": "&#xf7a7; Santa's Hat duotone",
			"fal fa-hat-cowboy-side": "&#xf8c1; Cowboy Hat Side light",
			"far fa-hat-cowboy-side": "&#xf8c1; Cowboy Hat Side regular",
			"fas fa-hat-cowboy-side": "&#xf8c1; Cowboy Hat Side solid",
			"fab fa-hat-cowboy-side": "&#xf8c1; Cowboy Hat Side duotone",
			"fal fa-hat-cowboy": "&#xf8c0; Cowboy Hat light",
			"far fa-hat-cowboy": "&#xf8c0; Cowboy Hat regular",
			"fas fa-hat-cowboy": "&#xf8c0; Cowboy Hat solid",
			"fab fa-hat-cowboy": "&#xf8c0; Cowboy Hat duotone",
			"fas fa-hat-chef": "&#xf86b; Chef Hat solid",
			"far fa-hat-chef": "&#xf86b; Chef Hat regular",
			"fal fa-hat-chef": "&#xf86b; Chef Hat light",
			"fab fa-hat-chef": "&#xf86b; Chef Hat duotone",
			"fas fa-hashtag": "&#xf292; Hashtag solid",
			"far fa-hashtag": "&#xf292; Hashtag regular",
			"fal fa-hashtag": "&#xf292; Hashtag light",
			"fab fa-hashtag": "&#xf292; Hashtag duotone",
			"fas fa-hard-hat": "&#xf807; Hard Hat solid",
			"far fa-hard-hat": "&#xf807; Hard Hat regular",
			"fal fa-hard-hat": "&#xf807; Hard Hat light",
			"fab fa-hard-hat": "&#xf807; Hard Hat duotone",
			"fas fa-hanukiah": "&#xf6e6; Hanukiah solid",
			"far fa-hanukiah": "&#xf6e6; Hanukiah regular",
			"fal fa-hanukiah": "&#xf6e6; Hanukiah light",
			"fab fa-hanukiah": "&#xf6e6; Hanukiah duotone",
			"fas fa-handshake-alt": "&#xf4c6; Alternate Handshake solid",
			"far fa-handshake-alt": "&#xf4c6; Alternate Handshake regular",
			"fal fa-handshake-alt": "&#xf4c6; Alternate Handshake light",
			"fab fa-handshake-alt": "&#xf4c6; Alternate Handshake duotone",
			"fas fa-handshake": "&#xf2b5; Handshake solid",
			"far fa-handshake": "&#xf2b5; Handshake regular",
			"fal fa-handshake": "&#xf2b5; Handshake light",
			"fab fa-handshake": "&#xf2b5; Handshake duotone",
			"fas fa-hands-usd": "&#xf4c5; Hands with US Dollar solid",
			"far fa-hands-usd": "&#xf4c5; Hands with US Dollar regular",
			"fal fa-hands-usd": "&#xf4c5; Hands with US Dollar light",
			"fab fa-hands-usd": "&#xf4c5; Hands with US Dollar duotone",
			"fas fa-hands-helping": "&#xf4c4; Helping Hands solid",
			"far fa-hands-helping": "&#xf4c4; Helping Hands regular",
			"fal fa-hands-helping": "&#xf4c4; Helping Hands light",
			"fab fa-hands-helping": "&#xf4c4; Helping Hands duotone",
			"fas fa-hands-heart": "&#xf4c3; Hands Heart solid",
			"far fa-hands-heart": "&#xf4c3; Hands Heart regular",
			"fal fa-hands-heart": "&#xf4c3; Hands Heart light",
			"fab fa-hands-heart": "&#xf4c3; Hands Heart duotone",
			"fas fa-hands": "&#xf4c2; Hands solid",
			"far fa-hands": "&#xf4c2; Hands regular",
			"fal fa-hands": "&#xf4c2; Hands light",
			"fab fa-hands": "&#xf4c2; Hands duotone",
			"fas fa-hand-spock": "&#xf259; Spock (Hand) solid",
			"far fa-hand-spock": "&#xf259; Spock (Hand) regular",
			"fal fa-hand-spock": "&#xf259; Spock (Hand) light",
			"fab fa-hand-spock": "&#xf259; Spock (Hand) duotone",
			"fas fa-hand-scissors": "&#xf257; Scissors (Hand) solid",
			"far fa-hand-scissors": "&#xf257; Scissors (Hand) regular",
			"fal fa-hand-scissors": "&#xf257; Scissors (Hand) light",
			"fab fa-hand-scissors": "&#xf257; Scissors (Hand) duotone",
			"fas fa-hand-rock": "&#xf255; Rock (Hand) solid",
			"far fa-hand-rock": "&#xf255; Rock (Hand) regular",
			"fal fa-hand-rock": "&#xf255; Rock (Hand) light",
			"fab fa-hand-rock": "&#xf255; Rock (Hand) duotone",
			"fas fa-hand-receiving": "&#xf47c; Hand Receiving solid",
			"far fa-hand-receiving": "&#xf47c; Hand Receiving regular",
			"fal fa-hand-receiving": "&#xf47c; Hand Receiving light",
			"fab fa-hand-receiving": "&#xf47c; Hand Receiving duotone",
			"fas fa-hand-pointer": "&#xf25a; Pointer (Hand) solid",
			"far fa-hand-pointer": "&#xf25a; Pointer (Hand) regular",
			"fal fa-hand-pointer": "&#xf25a; Pointer (Hand) light",
			"fab fa-hand-pointer": "&#xf25a; Pointer (Hand) duotone",
			"fas fa-hand-point-up": "&#xf0a6; Hand Pointing Up solid",
			"far fa-hand-point-up": "&#xf0a6; Hand Pointing Up regular",
			"fal fa-hand-point-up": "&#xf0a6; Hand Pointing Up light",
			"fab fa-hand-point-up": "&#xf0a6; Hand Pointing Up duotone",
			"fas fa-hand-point-right": "&#xf0a4; Hand Pointing Right solid",
			"far fa-hand-point-right": "&#xf0a4; Hand Pointing Right regular",
			"fal fa-hand-point-right": "&#xf0a4; Hand Pointing Right light",
			"fab fa-hand-point-right": "&#xf0a4; Hand Pointing Right duotone",
			"fas fa-hand-point-left": "&#xf0a5; Hand Pointing Left solid",
			"far fa-hand-point-left": "&#xf0a5; Hand Pointing Left regular",
			"fal fa-hand-point-left": "&#xf0a5; Hand Pointing Left light",
			"fab fa-hand-point-left": "&#xf0a5; Hand Pointing Left duotone",
			"fas fa-hand-point-down": "&#xf0a7; Hand Pointing Down solid",
			"far fa-hand-point-down": "&#xf0a7; Hand Pointing Down regular",
			"fal fa-hand-point-down": "&#xf0a7; Hand Pointing Down light",
			"fab fa-hand-point-down": "&#xf0a7; Hand Pointing Down duotone",
			"fas fa-hand-peace": "&#xf25b; Peace (Hand) solid",
			"far fa-hand-peace": "&#xf25b; Peace (Hand) regular",
			"fal fa-hand-peace": "&#xf25b; Peace (Hand) light",
			"fab fa-hand-peace": "&#xf25b; Peace (Hand) duotone",
			"fas fa-hand-paper": "&#xf256; Paper (Hand) solid",
			"far fa-hand-paper": "&#xf256; Paper (Hand) regular",
			"fal fa-hand-paper": "&#xf256; Paper (Hand) light",
			"fab fa-hand-paper": "&#xf256; Paper (Hand) duotone",
			"fas fa-hand-middle-finger": "&#xf806; Hand with Middle Finger Raised solid",
			"far fa-hand-middle-finger": "&#xf806; Hand with Middle Finger Raised regular",
			"fal fa-hand-middle-finger": "&#xf806; Hand with Middle Finger Raised light",
			"fab fa-hand-middle-finger": "&#xf806; Hand with Middle Finger Raised duotone",
			"fas fa-hand-lizard": "&#xf258; Lizard (Hand) solid",
			"far fa-hand-lizard": "&#xf258; Lizard (Hand) regular",
			"fal fa-hand-lizard": "&#xf258; Lizard (Hand) light",
			"fab fa-hand-lizard": "&#xf258; Lizard (Hand) duotone",
			"fas fa-hand-holding-water": "&#xf4c1; Hand Holding Water solid",
			"far fa-hand-holding-water": "&#xf4c1; Hand Holding Water regular",
			"fal fa-hand-holding-water": "&#xf4c1; Hand Holding Water light",
			"fab fa-hand-holding-water": "&#xf4c1; Hand Holding Water duotone",
			"fas fa-hand-holding-usd": "&#xf4c0; Hand Holding US Dollar solid",
			"far fa-hand-holding-usd": "&#xf4c0; Hand Holding US Dollar regular",
			"fal fa-hand-holding-usd": "&#xf4c0; Hand Holding US Dollar light",
			"fab fa-hand-holding-usd": "&#xf4c0; Hand Holding US Dollar duotone",
			"fas fa-hand-holding-seedling": "&#xf4bf; Hand Holding Seedling solid",
			"far fa-hand-holding-seedling": "&#xf4bf; Hand Holding Seedling regular",
			"fal fa-hand-holding-seedling": "&#xf4bf; Hand Holding Seedling light",
			"fab fa-hand-holding-seedling": "&#xf4bf; Hand Holding Seedling duotone",
			"fas fa-hand-holding-magic": "&#xf6e5; Hand Holding-magic solid",
			"far fa-hand-holding-magic": "&#xf6e5; Hand Holding-magic regular",
			"fal fa-hand-holding-magic": "&#xf6e5; Hand Holding-magic light",
			"fab fa-hand-holding-magic": "&#xf6e5; Hand Holding-magic duotone",
			"fas fa-hand-holding-heart": "&#xf4be; Hand Holding Heart solid",
			"far fa-hand-holding-heart": "&#xf4be; Hand Holding Heart regular",
			"fal fa-hand-holding-heart": "&#xf4be; Hand Holding Heart light",
			"fab fa-hand-holding-heart": "&#xf4be; Hand Holding Heart duotone",
			"fas fa-hand-holding-box": "&#xf47b; Hand Holding Box solid",
			"far fa-hand-holding-box": "&#xf47b; Hand Holding Box regular",
			"fal fa-hand-holding-box": "&#xf47b; Hand Holding Box light",
			"fab fa-hand-holding-box": "&#xf47b; Hand Holding Box duotone",
			"fas fa-hand-holding": "&#xf4bd; Hand Holding solid",
			"far fa-hand-holding": "&#xf4bd; Hand Holding regular",
			"fal fa-hand-holding": "&#xf4bd; Hand Holding light",
			"fab fa-hand-holding": "&#xf4bd; Hand Holding duotone",
			"fas fa-hand-heart": "&#xf4bc; Hand with Heart solid",
			"far fa-hand-heart": "&#xf4bc; Hand with Heart regular",
			"fal fa-hand-heart": "&#xf4bc; Hand with Heart light",
			"fab fa-hand-heart": "&#xf4bc; Hand with Heart duotone",
			"fas fa-hamsa": "&#xf665; Hamsa solid",
			"far fa-hamsa": "&#xf665; Hamsa regular",
			"fal fa-hamsa": "&#xf665; Hamsa light",
			"fab fa-hamsa": "&#xf665; Hamsa duotone",
			"fas fa-hammer-war": "&#xf6e4; Hammer War solid",
			"far fa-hammer-war": "&#xf6e4; Hammer War regular",
			"fal fa-hammer-war": "&#xf6e4; Hammer War light",
			"fab fa-hammer-war": "&#xf6e4; Hammer War duotone",
			"fas fa-hammer": "&#xf6e3; Hammer solid",
			"far fa-hammer": "&#xf6e3; Hammer regular",
			"fal fa-hammer": "&#xf6e3; Hammer light",
			"fab fa-hammer": "&#xf6e3; Hammer duotone",
			"fas fa-hamburger": "&#xf805; Hamburger solid",
			"far fa-hamburger": "&#xf805; Hamburger regular",
			"fal fa-hamburger": "&#xf805; Hamburger light",
			"fab fa-hamburger": "&#xf805; Hamburger duotone",
			"fab fa-hackerrank": "&#xf5f7; Hackerrank brands",
			"fab fa-hacker-news-square": "&#xf3af; Hacker News Square brands",
			"fab fa-hacker-news": "&#xf1d4; Hacker News brands",
			"fas fa-h4": "&#xf86a; H4 solid",
			"far fa-h4": "&#xf86a; H4 regular",
			"fal fa-h4": "&#xf86a; H4 light",
			"fab fa-h4": "&#xf86a; H4 duotone",
			"fas fa-h3": "&#xf315; H3 Heading solid",
			"far fa-h3": "&#xf315; H3 Heading regular",
			"fal fa-h3": "&#xf315; H3 Heading light",
			"fab fa-h3": "&#xf315; H3 Heading duotone",
			"fas fa-h2": "&#xf314; H2 Heading solid",
			"far fa-h2": "&#xf314; H2 Heading regular",
			"fal fa-h2": "&#xf314; H2 Heading light",
			"fab fa-h2": "&#xf314; H2 Heading duotone",
			"fas fa-h1": "&#xf313; H1 Heading solid",
			"far fa-h1": "&#xf313; H1 Heading regular",
			"fal fa-h1": "&#xf313; H1 Heading light",
			"fab fa-h1": "&#xf313; H1 Heading duotone",
			"fas fa-h-square": "&#xf0fd; H Square solid",
			"far fa-h-square": "&#xf0fd; H Square regular",
			"fal fa-h-square": "&#xf0fd; H Square light",
			"fab fa-h-square": "&#xf0fd; H Square duotone",
			"fab fa-gulp": "&#xf3ae; Gulp brands",
			"fas fa-guitars": "&#xf8bf; Guitars solid",
			"far fa-guitars": "&#xf8bf; Guitars regular",
			"fal fa-guitars": "&#xf8bf; Guitars light",
			"fab fa-guitars": "&#xf8bf; Guitars duotone",
			"fas fa-guitar-electric": "&#xf8be; Guitar Electric solid",
			"far fa-guitar-electric": "&#xf8be; Guitar Electric regular",
			"fal fa-guitar-electric": "&#xf8be; Guitar Electric light",
			"fab fa-guitar-electric": "&#xf8be; Guitar Electric duotone",
			"fas fa-guitar": "&#xf7a6; Guitar solid",
			"far fa-guitar": "&#xf7a6; Guitar regular",
			"fal fa-guitar": "&#xf7a6; Guitar light",
			"fab fa-guitar": "&#xf7a6; Guitar duotone",
			"fab fa-grunt": "&#xf3ad; Grunt brands",
			"fab fa-gripfire": "&#xf3ac; Gripfire, Inc. brands",
			"fas fa-grip-vertical": "&#xf58e; Grip Vertical solid",
			"far fa-grip-vertical": "&#xf58e; Grip Vertical regular",
			"fal fa-grip-vertical": "&#xf58e; Grip Vertical light",
			"fab fa-grip-vertical": "&#xf58e; Grip Vertical duotone",
			"fas fa-grip-lines-vertical": "&#xf7a5; Grip Lines Vertical solid",
			"far fa-grip-lines-vertical": "&#xf7a5; Grip Lines Vertical regular",
			"fal fa-grip-lines-vertical": "&#xf7a5; Grip Lines Vertical light",
			"fab fa-grip-lines-vertical": "&#xf7a5; Grip Lines Vertical duotone",
			"fas fa-grip-lines": "&#xf7a4; Grip Lines solid",
			"far fa-grip-lines": "&#xf7a4; Grip Lines regular",
			"fal fa-grip-lines": "&#xf7a4; Grip Lines light",
			"fab fa-grip-lines": "&#xf7a4; Grip Lines duotone",
			"fas fa-grip-horizontal": "&#xf58d; Grip Horizontal solid",
			"far fa-grip-horizontal": "&#xf58d; Grip Horizontal regular",
			"fal fa-grip-horizontal": "&#xf58d; Grip Horizontal light",
			"fab fa-grip-horizontal": "&#xf58d; Grip Horizontal duotone",
			"fas fa-grin-wink": "&#xf58c; Grinning Winking Face solid",
			"far fa-grin-wink": "&#xf58c; Grinning Winking Face regular",
			"fal fa-grin-wink": "&#xf58c; Grinning Winking Face light",
			"fab fa-grin-wink": "&#xf58c; Grinning Winking Face duotone",
			"fas fa-grin-tongue-wink": "&#xf58b; Winking Face With Tongue solid",
			"far fa-grin-tongue-wink": "&#xf58b; Winking Face With Tongue regular",
			"fal fa-grin-tongue-wink": "&#xf58b; Winking Face With Tongue light",
			"fab fa-grin-tongue-wink": "&#xf58b; Winking Face With Tongue duotone",
			"fas fa-grin-tongue-squint": "&#xf58a; Squinting Face With Tongue solid",
			"far fa-grin-tongue-squint": "&#xf58a; Squinting Face With Tongue regular",
			"fal fa-grin-tongue-squint": "&#xf58a; Squinting Face With Tongue light",
			"fab fa-grin-tongue-squint": "&#xf58a; Squinting Face With Tongue duotone",
			"fas fa-grin-tongue": "&#xf589; Face With Tongue solid",
			"far fa-grin-tongue": "&#xf589; Face With Tongue regular",
			"fal fa-grin-tongue": "&#xf589; Face With Tongue light",
			"fab fa-grin-tongue": "&#xf589; Face With Tongue duotone",
			"fas fa-grin-tears": "&#xf588; Face With Tears of Joy solid",
			"far fa-grin-tears": "&#xf588; Face With Tears of Joy regular",
			"fal fa-grin-tears": "&#xf588; Face With Tears of Joy light",
			"fab fa-grin-tears": "&#xf588; Face With Tears of Joy duotone",
			"fas fa-grin-stars": "&#xf587; Star-Struck solid",
			"far fa-grin-stars": "&#xf587; Star-Struck regular",
			"fal fa-grin-stars": "&#xf587; Star-Struck light",
			"fab fa-grin-stars": "&#xf587; Star-Struck duotone",
			"fas fa-grin-squint-tears": "&#xf586; Rolling on the Floor Laughing solid",
			"far fa-grin-squint-tears": "&#xf586; Rolling on the Floor Laughing regular",
			"fal fa-grin-squint-tears": "&#xf586; Rolling on the Floor Laughing light",
			"fab fa-grin-squint-tears": "&#xf586; Rolling on the Floor Laughing duotone",
			"fas fa-grin-squint": "&#xf585; Grinning Squinting Face solid",
			"far fa-grin-squint": "&#xf585; Grinning Squinting Face regular",
			"fal fa-grin-squint": "&#xf585; Grinning Squinting Face light",
			"fab fa-grin-squint": "&#xf585; Grinning Squinting Face duotone",
			"fas fa-grin-hearts": "&#xf584; Smiling Face With Heart-Eyes solid",
			"far fa-grin-hearts": "&#xf584; Smiling Face With Heart-Eyes regular",
			"fal fa-grin-hearts": "&#xf584; Smiling Face With Heart-Eyes light",
			"fab fa-grin-hearts": "&#xf584; Smiling Face With Heart-Eyes duotone",
			"fas fa-grin-beam-sweat": "&#xf583; Grinning Face With Sweat solid",
			"far fa-grin-beam-sweat": "&#xf583; Grinning Face With Sweat regular",
			"fal fa-grin-beam-sweat": "&#xf583; Grinning Face With Sweat light",
			"fab fa-grin-beam-sweat": "&#xf583; Grinning Face With Sweat duotone",
			"fas fa-grin-beam": "&#xf582; Grinning Face With Smiling Eyes solid",
			"far fa-grin-beam": "&#xf582; Grinning Face With Smiling Eyes regular",
			"fal fa-grin-beam": "&#xf582; Grinning Face With Smiling Eyes light",
			"fab fa-grin-beam": "&#xf582; Grinning Face With Smiling Eyes duotone",
			"fas fa-grin-alt": "&#xf581; Alternate Grinning Face solid",
			"far fa-grin-alt": "&#xf581; Alternate Grinning Face regular",
			"fal fa-grin-alt": "&#xf581; Alternate Grinning Face light",
			"fab fa-grin-alt": "&#xf581; Alternate Grinning Face duotone",
			"fas fa-grin": "&#xf580; Grinning Face solid",
			"far fa-grin": "&#xf580; Grinning Face regular",
			"fal fa-grin": "&#xf580; Grinning Face light",
			"fab fa-grin": "&#xf580; Grinning Face duotone",
			"fas fa-grimace": "&#xf57f; Grimacing Face solid",
			"far fa-grimace": "&#xf57f; Grimacing Face regular",
			"fal fa-grimace": "&#xf57f; Grimacing Face light",
			"fab fa-grimace": "&#xf57f; Grimacing Face duotone",
			"fas fa-greater-than-equal": "&#xf532; Greater Than Equal To solid",
			"far fa-greater-than-equal": "&#xf532; Greater Than Equal To regular",
			"fal fa-greater-than-equal": "&#xf532; Greater Than Equal To light",
			"fab fa-greater-than-equal": "&#xf532; Greater Than Equal To duotone",
			"fas fa-greater-than": "&#xf531; Greater Than solid",
			"far fa-greater-than": "&#xf531; Greater Than regular",
			"fal fa-greater-than": "&#xf531; Greater Than light",
			"fab fa-greater-than": "&#xf531; Greater Than duotone",
			"fab fa-grav": "&#xf2d6; Grav brands",
			"fab fa-gratipay": "&#xf184; Gratipay (Gittip) brands",
			"fas fa-gramophone": "&#xf8bd; Gramophone solid",
			"far fa-gramophone": "&#xf8bd; Gramophone regular",
			"fal fa-gramophone": "&#xf8bd; Gramophone light",
			"fab fa-gramophone": "&#xf8bd; Gramophone duotone",
			"fas fa-graduation-cap": "&#xf19d; Graduation Cap solid",
			"far fa-graduation-cap": "&#xf19d; Graduation Cap regular",
			"fal fa-graduation-cap": "&#xf19d; Graduation Cap light",
			"fab fa-graduation-cap": "&#xf19d; Graduation Cap duotone",
			"fas fa-gopuram": "&#xf664; Gopuram solid",
			"far fa-gopuram": "&#xf664; Gopuram regular",
			"fal fa-gopuram": "&#xf664; Gopuram light",
			"fab fa-gopuram": "&#xf664; Gopuram duotone",
			"fab fa-google-wallet": "&#xf1ee; Google Wallet brands",
			"fab fa-google-plus-square": "&#xf0d4; Google Plus Square brands",
			"fab fa-google-plus-g": "&#xf0d5; Google Plus G brands",
			"fab fa-google-plus": "&#xf2b3; Google Plus brands",
			"fab fa-google-play": "&#xf3ab; Google Play brands",
			"fab fa-google-drive": "&#xf3aa; Google Drive brands",
			"fab fa-google": "&#xf1a0; Google Logo brands",
			"fab fa-goodreads-g": "&#xf3a9; Goodreads G brands",
			"fab fa-goodreads": "&#xf3a8; Goodreads brands",
			"fas fa-golf-club": "&#xf451; Golf Club solid",
			"far fa-golf-club": "&#xf451; Golf Club regular",
			"fal fa-golf-club": "&#xf451; Golf Club light",
			"fab fa-golf-club": "&#xf451; Golf Club duotone",
			"fas fa-golf-ball": "&#xf450; Golf Ball solid",
			"far fa-golf-ball": "&#xf450; Golf Ball regular",
			"fal fa-golf-ball": "&#xf450; Golf Ball light",
			"fab fa-golf-ball": "&#xf450; Golf Ball duotone",
			"fab fa-gofore": "&#xf3a7; Gofore brands",
			"fas fa-globe-stand": "&#xf5f6; Globe Stand solid",
			"far fa-globe-stand": "&#xf5f6; Globe Stand regular",
			"fal fa-globe-stand": "&#xf5f6; Globe Stand light",
			"fab fa-globe-stand": "&#xf5f6; Globe Stand duotone",
			"fas fa-globe-snow": "&#xf7a3; Globe Snow solid",
			"far fa-globe-snow": "&#xf7a3; Globe Snow regular",
			"fal fa-globe-snow": "&#xf7a3; Globe Snow light",
			"fab fa-globe-snow": "&#xf7a3; Globe Snow duotone",
			"fas fa-globe-europe": "&#xf7a2; Globe with Europe shown solid",
			"far fa-globe-europe": "&#xf7a2; Globe with Europe shown regular",
			"fal fa-globe-europe": "&#xf7a2; Globe with Europe shown light",
			"fab fa-globe-europe": "&#xf7a2; Globe with Europe shown duotone",
			"fas fa-globe-asia": "&#xf57e; Globe with Asia shown solid",
			"far fa-globe-asia": "&#xf57e; Globe with Asia shown regular",
			"fal fa-globe-asia": "&#xf57e; Globe with Asia shown light",
			"fab fa-globe-asia": "&#xf57e; Globe with Asia shown duotone",
			"fas fa-globe-americas": "&#xf57d; Globe with Americas shown solid",
			"far fa-globe-americas": "&#xf57d; Globe with Americas shown regular",
			"fal fa-globe-americas": "&#xf57d; Globe with Americas shown light",
			"fab fa-globe-americas": "&#xf57d; Globe with Americas shown duotone",
			"fas fa-globe-africa": "&#xf57c; Globe with Africa shown solid",
			"far fa-globe-africa": "&#xf57c; Globe with Africa shown regular",
			"fal fa-globe-africa": "&#xf57c; Globe with Africa shown light",
			"fab fa-globe-africa": "&#xf57c; Globe with Africa shown duotone",
			"fas fa-globe": "&#xf0ac; Globe solid",
			"far fa-globe": "&#xf0ac; Globe regular",
			"fal fa-globe": "&#xf0ac; Globe light",
			"fab fa-globe": "&#xf0ac; Globe duotone",
			"fab fa-glide-g": "&#xf2a6; Glide G brands",
			"fab fa-glide": "&#xf2a5; Glide brands",
			"fas fa-glasses-alt": "&#xf5f5; Alternate Glasses solid",
			"far fa-glasses-alt": "&#xf5f5; Alternate Glasses regular",
			"fal fa-glasses-alt": "&#xf5f5; Alternate Glasses light",
			"fab fa-glasses-alt": "&#xf5f5; Alternate Glasses duotone",
			"fas fa-glasses": "&#xf530; Glasses solid",
			"far fa-glasses": "&#xf530; Glasses regular",
			"fal fa-glasses": "&#xf530; Glasses light",
			"fab fa-glasses": "&#xf530; Glasses duotone",
			"fas fa-glass-whiskey-rocks": "&#xf7a1; Glass Whiskey-rocks solid",
			"far fa-glass-whiskey-rocks": "&#xf7a1; Glass Whiskey-rocks regular",
			"fal fa-glass-whiskey-rocks": "&#xf7a1; Glass Whiskey-rocks light",
			"fab fa-glass-whiskey-rocks": "&#xf7a1; Glass Whiskey-rocks duotone",
			"fas fa-glass-whiskey": "&#xf7a0; Glass Whiskey solid",
			"far fa-glass-whiskey": "&#xf7a0; Glass Whiskey regular",
			"fal fa-glass-whiskey": "&#xf7a0; Glass Whiskey light",
			"fab fa-glass-whiskey": "&#xf7a0; Glass Whiskey duotone",
			"fas fa-glass-martini-alt": "&#xf57b; Alternate Glass Martini solid",
			"far fa-glass-martini-alt": "&#xf57b; Alternate Glass Martini regular",
			"fal fa-glass-martini-alt": "&#xf57b; Alternate Glass Martini light",
			"fab fa-glass-martini-alt": "&#xf57b; Alternate Glass Martini duotone",
			"fas fa-glass-martini": "&#xf000; Martini Glass solid",
			"far fa-glass-martini": "&#xf000; Martini Glass regular",
			"fal fa-glass-martini": "&#xf000; Martini Glass light",
			"fab fa-glass-martini": "&#xf000; Martini Glass duotone",
			"fas fa-glass-citrus": "&#xf869; Glass Citrus solid",
			"far fa-glass-citrus": "&#xf869; Glass Citrus regular",
			"fal fa-glass-citrus": "&#xf869; Glass Citrus light",
			"fab fa-glass-citrus": "&#xf869; Glass Citrus duotone",
			"fas fa-glass-cheers": "&#xf79f; Glass Cheers solid",
			"far fa-glass-cheers": "&#xf79f; Glass Cheers regular",
			"fal fa-glass-cheers": "&#xf79f; Glass Cheers light",
			"fab fa-glass-cheers": "&#xf79f; Glass Cheers duotone",
			"fas fa-glass-champagne": "&#xf79e; Glass Champagne solid",
			"far fa-glass-champagne": "&#xf79e; Glass Champagne regular",
			"fal fa-glass-champagne": "&#xf79e; Glass Champagne light",
			"fab fa-glass-champagne": "&#xf79e; Glass Champagne duotone",
			"fas fa-glass": "&#xf804; Glass solid",
			"far fa-glass": "&#xf804; Glass regular",
			"fal fa-glass": "&#xf804; Glass light",
			"fab fa-glass": "&#xf804; Glass duotone",
			"fab fa-gitter": "&#xf426; Gitter brands",
			"fab fa-gitlab": "&#xf296; GitLab brands",
			"fab fa-gitkraken": "&#xf3a6; GitKraken brands",
			"fab fa-github-square": "&#xf092; GitHub Square brands",
			"fab fa-github-alt": "&#xf113; Alternate GitHub brands",
			"fab fa-github": "&#xf09b; GitHub brands",
			"fab fa-git-square": "&#xf1d2; Git Square brands",
			"fab fa-git-alt": "&#xf841; Git Alt brands",
			"fab fa-git": "&#xf1d3; Git brands",
			"fas fa-gingerbread-man": "&#xf79d; Gingerbread Man solid",
			"far fa-gingerbread-man": "&#xf79d; Gingerbread Man regular",
			"fal fa-gingerbread-man": "&#xf79d; Gingerbread Man light",
			"fab fa-gingerbread-man": "&#xf79d; Gingerbread Man duotone",
			"fas fa-gifts": "&#xf79c; Gifts solid",
			"far fa-gifts": "&#xf79c; Gifts regular",
			"fal fa-gifts": "&#xf79c; Gifts light",
			"fab fa-gifts": "&#xf79c; Gifts duotone",
			"fas fa-gift-card": "&#xf663; Gift Card solid",
			"far fa-gift-card": "&#xf663; Gift Card regular",
			"fal fa-gift-card": "&#xf663; Gift Card light",
			"fab fa-gift-card": "&#xf663; Gift Card duotone",
			"fas fa-gift": "&#xf06b; gift solid",
			"far fa-gift": "&#xf06b; gift regular",
			"fal fa-gift": "&#xf06b; gift light",
			"fab fa-gift": "&#xf06b; gift duotone",
			"fas fa-ghost": "&#xf6e2; Ghost solid",
			"far fa-ghost": "&#xf6e2; Ghost regular",
			"fal fa-ghost": "&#xf6e2; Ghost light",
			"fab fa-ghost": "&#xf6e2; Ghost duotone",
			"fab fa-gg-circle": "&#xf261; GG Currency Circle brands",
			"fab fa-gg": "&#xf260; GG Currency brands",
			"fab fa-get-pocket": "&#xf265; Get Pocket brands",
			"fas fa-genderless": "&#xf22d; Genderless solid",
			"far fa-genderless": "&#xf22d; Genderless regular",
			"fal fa-genderless": "&#xf22d; Genderless light",
			"fab fa-genderless": "&#xf22d; Genderless duotone",
			"fas fa-gem": "&#xf3a5; Gem solid",
			"far fa-gem": "&#xf3a5; Gem regular",
			"fal fa-gem": "&#xf3a5; Gem light",
			"fab fa-gem": "&#xf3a5; Gem duotone",
			"fas fa-gavel": "&#xf0e3; Gavel solid",
			"far fa-gavel": "&#xf0e3; Gavel regular",
			"fal fa-gavel": "&#xf0e3; Gavel light",
			"fab fa-gavel": "&#xf0e3; Gavel duotone",
			"fas fa-gas-pump-slash": "&#xf5f4; Gas Pump Slash solid",
			"far fa-gas-pump-slash": "&#xf5f4; Gas Pump Slash regular",
			"fal fa-gas-pump-slash": "&#xf5f4; Gas Pump Slash light",
			"fab fa-gas-pump-slash": "&#xf5f4; Gas Pump Slash duotone",
			"fas fa-gas-pump": "&#xf52f; Gas Pump solid",
			"far fa-gas-pump": "&#xf52f; Gas Pump regular",
			"fal fa-gas-pump": "&#xf52f; Gas Pump light",
			"fab fa-gas-pump": "&#xf52f; Gas Pump duotone",
			"fas fa-gamepad-alt": "&#xf8bc; Alternate Gamepad solid",
			"far fa-gamepad-alt": "&#xf8bc; Alternate Gamepad regular",
			"fal fa-gamepad-alt": "&#xf8bc; Alternate Gamepad light",
			"fab fa-gamepad-alt": "&#xf8bc; Alternate Gamepad duotone",
			"fas fa-gamepad": "&#xf11b; Gamepad solid",
			"far fa-gamepad": "&#xf11b; Gamepad regular",
			"fal fa-gamepad": "&#xf11b; Gamepad light",
			"fab fa-gamepad": "&#xf11b; Gamepad duotone",
			"fas fa-game-console-handheld": "&#xf8bb; Handheld Game Console solid",
			"far fa-game-console-handheld": "&#xf8bb; Handheld Game Console regular",
			"fal fa-game-console-handheld": "&#xf8bb; Handheld Game Console light",
			"fab fa-game-console-handheld": "&#xf8bb; Handheld Game Console duotone",
			"fas fa-game-board-alt": "&#xf868; Alternate Game Board solid",
			"far fa-game-board-alt": "&#xf868; Alternate Game Board regular",
			"fal fa-game-board-alt": "&#xf868; Alternate Game Board light",
			"fab fa-game-board-alt": "&#xf868; Alternate Game Board duotone",
			"fas fa-game-board": "&#xf867; Game Board solid",
			"far fa-game-board": "&#xf867; Game Board regular",
			"fal fa-game-board": "&#xf867; Game Board light",
			"fab fa-game-board": "&#xf867; Game Board duotone",
			"fab fa-galactic-senate": "&#xf50d; Galactic Senate brands",
			"fab fa-galactic-republic": "&#xf50c; Galactic Republic brands",
			"fas fa-futbol": "&#xf1e3; Futbol solid",
			"far fa-futbol": "&#xf1e3; Futbol regular",
			"fal fa-futbol": "&#xf1e3; Futbol light",
			"fab fa-futbol": "&#xf1e3; Futbol duotone",
			"fas fa-funnel-dollar": "&#xf662; Funnel Dollar solid",
			"far fa-funnel-dollar": "&#xf662; Funnel Dollar regular",
			"fal fa-funnel-dollar": "&#xf662; Funnel Dollar light",
			"fab fa-funnel-dollar": "&#xf662; Funnel Dollar duotone",
			"fas fa-function": "&#xf661; Function solid",
			"far fa-function": "&#xf661; Function regular",
			"fal fa-function": "&#xf661; Function light",
			"fab fa-function": "&#xf661; Function duotone",
			"fab fa-fulcrum": "&#xf50b; Fulcrum brands",
			"fas fa-frown-open": "&#xf57a; Frowning Face With Open Mouth solid",
			"far fa-frown-open": "&#xf57a; Frowning Face With Open Mouth regular",
			"fal fa-frown-open": "&#xf57a; Frowning Face With Open Mouth light",
			"fab fa-frown-open": "&#xf57a; Frowning Face With Open Mouth duotone",
			"fas fa-frown": "&#xf119; Frowning Face solid",
			"far fa-frown": "&#xf119; Frowning Face regular",
			"fal fa-frown": "&#xf119; Frowning Face light",
			"fab fa-frown": "&#xf119; Frowning Face duotone",
			"fas fa-frosty-head": "&#xf79b; Frosty Head solid",
			"far fa-frosty-head": "&#xf79b; Frosty Head regular",
			"fal fa-frosty-head": "&#xf79b; Frosty Head light",
			"fab fa-frosty-head": "&#xf79b; Frosty Head duotone",
			"fas fa-frog": "&#xf52e; Frog solid",
			"far fa-frog": "&#xf52e; Frog regular",
			"fal fa-frog": "&#xf52e; Frog light",
			"fab fa-frog": "&#xf52e; Frog duotone",
			"fas fa-french-fries": "&#xf803; French Fries solid",
			"far fa-french-fries": "&#xf803; French Fries regular",
			"fal fa-french-fries": "&#xf803; French Fries light",
			"fab fa-french-fries": "&#xf803; French Fries duotone",
			"fab fa-freebsd": "&#xf3a4; FreeBSD brands",
			"fab fa-free-code-camp": "&#xf2c5; Free Code Camp brands",
			"fas fa-fragile": "&#xf4bb; Fragile solid",
			"far fa-fragile": "&#xf4bb; Fragile regular",
			"fal fa-fragile": "&#xf4bb; Fragile light",
			"fab fa-fragile": "&#xf4bb; Fragile duotone",
			"fab fa-foursquare": "&#xf180; Foursquare brands",
			"fas fa-forward": "&#xf04e; forward solid",
			"far fa-forward": "&#xf04e; forward regular",
			"fal fa-forward": "&#xf04e; forward light",
			"fab fa-forward": "&#xf04e; forward duotone",
			"fab fa-forumbee": "&#xf211; Forumbee brands",
			"fab fa-fort-awesome-alt": "&#xf3a3; Alternate Fort Awesome brands",
			"fab fa-fort-awesome": "&#xf286; Fort Awesome brands",
			"fas fa-forklift": "&#xf47a; Forklift solid",
			"far fa-forklift": "&#xf47a; Forklift regular",
			"fal fa-forklift": "&#xf47a; Forklift light",
			"fab fa-forklift": "&#xf47a; Forklift duotone",
			"fas fa-football-helmet": "&#xf44f; Football Helmet solid",
			"far fa-football-helmet": "&#xf44f; Football Helmet regular",
			"fal fa-football-helmet": "&#xf44f; Football Helmet light",
			"fab fa-football-helmet": "&#xf44f; Football Helmet duotone",
			"fas fa-football-ball": "&#xf44e; Football Ball solid",
			"far fa-football-ball": "&#xf44e; Football Ball regular",
			"fal fa-football-ball": "&#xf44e; Football Ball light",
			"fab fa-football-ball": "&#xf44e; Football Ball duotone",
			"fab fa-fonticons-fi": "&#xf3a2; Fonticons Fi brands",
			"fab fa-fonticons": "&#xf280; Fonticons brands",
			"fas fa-font-case": "&#xf866; Font Case solid",
			"far fa-font-case": "&#xf866; Font Case regular",
			"fal fa-font-case": "&#xf866; Font Case light",
			"fab fa-font-case": "&#xf866; Font Case duotone",
			"fab fa-font-awesome-flag": "&#xf425; Font Awesome Flag brands",
			"fab fa-font-awesome-alt": "&#xf35c; Alternate Font Awesome brands",
			"fab fa-font-awesome": "&#xf2b4; Font Awesome brands",
			"fas fa-font": "&#xf031; font solid",
			"far fa-font": "&#xf031; font regular",
			"fal fa-font": "&#xf031; font light",
			"fab fa-font": "&#xf031; font duotone",
			"fas fa-folders": "&#xf660; Folders solid",
			"far fa-folders": "&#xf660; Folders regular",
			"fal fa-folders": "&#xf660; Folders light",
			"fab fa-folders": "&#xf660; Folders duotone",
			"fas fa-folder-tree": "&#xf802; Folder Tree solid",
			"far fa-folder-tree": "&#xf802; Folder Tree regular",
			"fal fa-folder-tree": "&#xf802; Folder Tree light",
			"fab fa-folder-tree": "&#xf802; Folder Tree duotone",
			"fas fa-folder-times": "&#xf65f; Folder Times solid",
			"far fa-folder-times": "&#xf65f; Folder Times regular",
			"fal fa-folder-times": "&#xf65f; Folder Times light",
			"fab fa-folder-times": "&#xf65f; Folder Times duotone",
			"fas fa-folder-plus": "&#xf65e; Folder Plus solid",
			"far fa-folder-plus": "&#xf65e; Folder Plus regular",
			"fal fa-folder-plus": "&#xf65e; Folder Plus light",
			"fab fa-folder-plus": "&#xf65e; Folder Plus duotone",
			"fas fa-folder-open": "&#xf07c; Folder Open solid",
			"far fa-folder-open": "&#xf07c; Folder Open regular",
			"fal fa-folder-open": "&#xf07c; Folder Open light",
			"fab fa-folder-open": "&#xf07c; Folder Open duotone",
			"fas fa-folder-minus": "&#xf65d; Folder Minus solid",
			"far fa-folder-minus": "&#xf65d; Folder Minus regular",
			"fal fa-folder-minus": "&#xf65d; Folder Minus light",
			"fab fa-folder-minus": "&#xf65d; Folder Minus duotone",
			"fas fa-folder": "&#xf07b; Folder solid",
			"far fa-folder": "&#xf07b; Folder regular",
			"fal fa-folder": "&#xf07b; Folder light",
			"fab fa-folder": "&#xf07b; Folder duotone",
			"fas fa-fog": "&#xf74e; Fog solid",
			"far fa-fog": "&#xf74e; Fog regular",
			"fal fa-fog": "&#xf74e; Fog light",
			"fab fa-fog": "&#xf74e; Fog duotone",
			"fab fa-fly": "&#xf417; Fly brands",
			"fas fa-flux-capacitor": "&#xf8ba; Flux Capacitor solid",
			"far fa-flux-capacitor": "&#xf8ba; Flux Capacitor regular",
			"fal fa-flux-capacitor": "&#xf8ba; Flux Capacitor light",
			"fab fa-flux-capacitor": "&#xf8ba; Flux Capacitor duotone",
			"fas fa-flute": "&#xf8b9; Flute solid",
			"far fa-flute": "&#xf8b9; Flute regular",
			"fal fa-flute": "&#xf8b9; Flute light",
			"fab fa-flute": "&#xf8b9; Flute duotone",
			"fas fa-flushed": "&#xf579; Flushed Face solid",
			"far fa-flushed": "&#xf579; Flushed Face regular",
			"fal fa-flushed": "&#xf579; Flushed Face light",
			"fab fa-flushed": "&#xf579; Flushed Face duotone",
			"fas fa-flower-tulip": "&#xf801; Flower Tulip solid",
			"far fa-flower-tulip": "&#xf801; Flower Tulip regular",
			"fal fa-flower-tulip": "&#xf801; Flower Tulip light",
			"fab fa-flower-tulip": "&#xf801; Flower Tulip duotone",
			"fas fa-flower-daffodil": "&#xf800; Flower Daffodil solid",
			"far fa-flower-daffodil": "&#xf800; Flower Daffodil regular",
			"fal fa-flower-daffodil": "&#xf800; Flower Daffodil light",
			"fab fa-flower-daffodil": "&#xf800; Flower Daffodil duotone",
			"fas fa-flower": "&#xf7ff; Flower solid",
			"far fa-flower": "&#xf7ff; Flower regular",
			"fal fa-flower": "&#xf7ff; Flower light",
			"fab fa-flower": "&#xf7ff; Flower duotone",
			"fab fa-flipboard": "&#xf44d; Flipboard brands",
			"fab fa-flickr": "&#xf16e; Flickr brands",
			"fas fa-flask-potion": "&#xf6e1; Flask Potion solid",
			"far fa-flask-potion": "&#xf6e1; Flask Potion regular",
			"fal fa-flask-potion": "&#xf6e1; Flask Potion light",
			"fab fa-flask-potion": "&#xf6e1; Flask Potion duotone",
			"fas fa-flask-poison": "&#xf6e0; Flask Poison solid",
			"far fa-flask-poison": "&#xf6e0; Flask Poison regular",
			"fal fa-flask-poison": "&#xf6e0; Flask Poison light",
			"fab fa-flask-poison": "&#xf6e0; Flask Poison duotone",
			"fas fa-flask": "&#xf0c3; Flask solid",
			"far fa-flask": "&#xf0c3; Flask regular",
			"fal fa-flask": "&#xf0c3; Flask light",
			"fab fa-flask": "&#xf0c3; Flask duotone",
			"fas fa-flashlight": "&#xf8b8; Flashlight solid",
			"far fa-flashlight": "&#xf8b8; Flashlight regular",
			"fal fa-flashlight": "&#xf8b8; Flashlight light",
			"fab fa-flashlight": "&#xf8b8; Flashlight duotone",
			"fas fa-flame": "&#xf6df; Flame solid",
			"far fa-flame": "&#xf6df; Flame regular",
			"fal fa-flame": "&#xf6df; Flame light",
			"fab fa-flame": "&#xf6df; Flame duotone",
			"fas fa-flag-usa": "&#xf74d; United States of America Flag solid",
			"far fa-flag-usa": "&#xf74d; United States of America Flag regular",
			"fal fa-flag-usa": "&#xf74d; United States of America Flag light",
			"fab fa-flag-usa": "&#xf74d; United States of America Flag duotone",
			"fas fa-flag-checkered": "&#xf11e; flag-checkered solid",
			"far fa-flag-checkered": "&#xf11e; flag-checkered regular",
			"fal fa-flag-checkered": "&#xf11e; flag-checkered light",
			"fab fa-flag-checkered": "&#xf11e; flag-checkered duotone",
			"fas fa-flag-alt": "&#xf74c; Alternate Flag solid",
			"far fa-flag-alt": "&#xf74c; Alternate Flag regular",
			"fal fa-flag-alt": "&#xf74c; Alternate Flag light",
			"fab fa-flag-alt": "&#xf74c; Alternate Flag duotone",
			"fas fa-flag": "&#xf024; flag solid",
			"far fa-flag": "&#xf024; flag regular",
			"fal fa-flag": "&#xf024; flag light",
			"fab fa-flag": "&#xf024; flag duotone",
			"fas fa-fist-raised": "&#xf6de; Raised Fist solid",
			"far fa-fist-raised": "&#xf6de; Raised Fist regular",
			"fal fa-fist-raised": "&#xf6de; Raised Fist light",
			"fab fa-fist-raised": "&#xf6de; Raised Fist duotone",
			"fas fa-fish-cooked": "&#xf7fe; Cooked Fish solid",
			"far fa-fish-cooked": "&#xf7fe; Cooked Fish regular",
			"fal fa-fish-cooked": "&#xf7fe; Cooked Fish light",
			"fab fa-fish-cooked": "&#xf7fe; Cooked Fish duotone",
			"fas fa-fish": "&#xf578; Fish solid",
			"far fa-fish": "&#xf578; Fish regular",
			"fal fa-fish": "&#xf578; Fish light",
			"fab fa-fish": "&#xf578; Fish duotone",
			"fab fa-firstdraft": "&#xf3a1; firstdraft brands",
			"fab fa-first-order-alt": "&#xf50a; Alternate First Order brands",
			"fab fa-first-order": "&#xf2b0; First Order brands",
			"fas fa-first-aid": "&#xf479; First Aid solid",
			"far fa-first-aid": "&#xf479; First Aid regular",
			"fal fa-first-aid": "&#xf479; First Aid light",
			"fab fa-first-aid": "&#xf479; First Aid duotone",
			"fas fa-fireplace": "&#xf79a; Fireplace solid",
			"far fa-fireplace": "&#xf79a; Fireplace regular",
			"fal fa-fireplace": "&#xf79a; Fireplace light",
			"fab fa-fireplace": "&#xf79a; Fireplace duotone",
			"fab fa-firefox": "&#xf269; Firefox brands",
			"fas fa-fire-smoke": "&#xf74b; Fire and Smoke solid",
			"far fa-fire-smoke": "&#xf74b; Fire and Smoke regular",
			"fal fa-fire-smoke": "&#xf74b; Fire and Smoke light",
			"fab fa-fire-smoke": "&#xf74b; Fire and Smoke duotone",
			"fas fa-fire-extinguisher": "&#xf134; fire-extinguisher solid",
			"far fa-fire-extinguisher": "&#xf134; fire-extinguisher regular",
			"fal fa-fire-extinguisher": "&#xf134; fire-extinguisher light",
			"fab fa-fire-extinguisher": "&#xf134; fire-extinguisher duotone",
			"fas fa-fire-alt": "&#xf7e4; Alternate Fire solid",
			"far fa-fire-alt": "&#xf7e4; Alternate Fire regular",
			"fal fa-fire-alt": "&#xf7e4; Alternate Fire light",
			"fab fa-fire-alt": "&#xf7e4; Alternate Fire duotone",
			"fas fa-fire": "&#xf06d; fire solid",
			"far fa-fire": "&#xf06d; fire regular",
			"fal fa-fire": "&#xf06d; fire light",
			"fab fa-fire": "&#xf06d; fire duotone",
			"fas fa-fingerprint": "&#xf577; Fingerprint solid",
			"far fa-fingerprint": "&#xf577; Fingerprint regular",
			"fal fa-fingerprint": "&#xf577; Fingerprint light",
			"fab fa-fingerprint": "&#xf577; Fingerprint duotone",
			"fas fa-filter": "&#xf0b0; Filter solid",
			"far fa-filter": "&#xf0b0; Filter regular",
			"fal fa-filter": "&#xf0b0; Filter light",
			"fab fa-filter": "&#xf0b0; Filter duotone",
			"fas fa-film-canister": "&#xf8b7; Film Canister solid",
			"far fa-film-canister": "&#xf8b7; Film Canister regular",
			"fal fa-film-canister": "&#xf8b7; Film Canister light",
			"fab fa-film-canister": "&#xf8b7; Film Canister duotone",
			"fas fa-film-alt": "&#xf3a0; Alternate Film solid",
			"far fa-film-alt": "&#xf3a0; Alternate Film regular",
			"fal fa-film-alt": "&#xf3a0; Alternate Film light",
			"fab fa-film-alt": "&#xf3a0; Alternate Film duotone",
			"fas fa-film": "&#xf008; Film solid",
			"far fa-film": "&#xf008; Film regular",
			"fal fa-film": "&#xf008; Film light",
			"fab fa-film": "&#xf008; Film duotone",
			"fas fa-fill-drip": "&#xf576; Fill Drip solid",
			"far fa-fill-drip": "&#xf576; Fill Drip regular",
			"fal fa-fill-drip": "&#xf576; Fill Drip light",
			"fab fa-fill-drip": "&#xf576; Fill Drip duotone",
			"fas fa-fill": "&#xf575; Fill solid",
			"far fa-fill": "&#xf575; Fill regular",
			"fal fa-fill": "&#xf575; Fill light",
			"fab fa-fill": "&#xf575; Fill duotone",
			"fas fa-files-medical": "&#xf7fd; Medical Files solid",
			"far fa-files-medical": "&#xf7fd; Medical Files regular",
			"fal fa-files-medical": "&#xf7fd; Medical Files light",
			"fab fa-files-medical": "&#xf7fd; Medical Files duotone",
			"fas fa-file-word": "&#xf1c2; Word File solid",
			"far fa-file-word": "&#xf1c2; Word File regular",
			"fal fa-file-word": "&#xf1c2; Word File light",
			"fab fa-file-word": "&#xf1c2; Word File duotone",
			"fas fa-file-video": "&#xf1c8; Video File solid",
			"far fa-file-video": "&#xf1c8; Video File regular",
			"fal fa-file-video": "&#xf1c8; Video File light",
			"fab fa-file-video": "&#xf1c8; Video File duotone",
			"fas fa-file-user": "&#xf65c; User File solid",
			"far fa-file-user": "&#xf65c; User File regular",
			"fal fa-file-user": "&#xf65c; User File light",
			"fab fa-file-user": "&#xf65c; User File duotone",
			"fas fa-file-upload": "&#xf574; File Upload solid",
			"far fa-file-upload": "&#xf574; File Upload regular",
			"fal fa-file-upload": "&#xf574; File Upload light",
			"fab fa-file-upload": "&#xf574; File Upload duotone",
			"fas fa-file-times": "&#xf317; Times File solid",
			"far fa-file-times": "&#xf317; Times File regular",
			"fal fa-file-times": "&#xf317; Times File light",
			"fab fa-file-times": "&#xf317; Times File duotone",
			"fas fa-file-spreadsheet": "&#xf65b; Spreadsheet File solid",
			"far fa-file-spreadsheet": "&#xf65b; Spreadsheet File regular",
			"fal fa-file-spreadsheet": "&#xf65b; Spreadsheet File light",
			"fab fa-file-spreadsheet": "&#xf65b; Spreadsheet File duotone",
			"fas fa-file-signature": "&#xf573; File Signature solid",
			"far fa-file-signature": "&#xf573; File Signature regular",
			"fal fa-file-signature": "&#xf573; File Signature light",
			"fab fa-file-signature": "&#xf573; File Signature duotone",
			"fas fa-file-search": "&#xf865; File Search solid",
			"far fa-file-search": "&#xf865; File Search regular",
			"fal fa-file-search": "&#xf865; File Search light",
			"fab fa-file-search": "&#xf865; File Search duotone",
			"fas fa-file-prescription": "&#xf572; File Prescription solid",
			"far fa-file-prescription": "&#xf572; File Prescription regular",
			"fal fa-file-prescription": "&#xf572; File Prescription light",
			"fab fa-file-prescription": "&#xf572; File Prescription duotone",
			"fas fa-file-powerpoint": "&#xf1c4; Powerpoint File solid",
			"far fa-file-powerpoint": "&#xf1c4; Powerpoint File regular",
			"fal fa-file-powerpoint": "&#xf1c4; Powerpoint File light",
			"fab fa-file-powerpoint": "&#xf1c4; Powerpoint File duotone",
			"fas fa-file-plus": "&#xf319; Plus File solid",
			"far fa-file-plus": "&#xf319; Plus File regular",
			"fal fa-file-plus": "&#xf319; Plus File light",
			"fab fa-file-plus": "&#xf319; Plus File duotone",
			"fas fa-file-pdf": "&#xf1c1; PDF File solid",
			"far fa-file-pdf": "&#xf1c1; PDF File regular",
			"fal fa-file-pdf": "&#xf1c1; PDF File light",
			"fab fa-file-pdf": "&#xf1c1; PDF File duotone",
			"fas fa-file-music": "&#xf8b6; File Music solid",
			"far fa-file-music": "&#xf8b6; File Music regular",
			"fal fa-file-music": "&#xf8b6; File Music light",
			"fab fa-file-music": "&#xf8b6; File Music duotone",
			"fas fa-file-minus": "&#xf318; Minus File solid",
			"far fa-file-minus": "&#xf318; Minus File regular",
			"fal fa-file-minus": "&#xf318; Minus File light",
			"fab fa-file-minus": "&#xf318; Minus File duotone",
			"fas fa-file-medical-alt": "&#xf478; Alternate Medical File solid",
			"far fa-file-medical-alt": "&#xf478; Alternate Medical File regular",
			"fal fa-file-medical-alt": "&#xf478; Alternate Medical File light",
			"fab fa-file-medical-alt": "&#xf478; Alternate Medical File duotone",
			"fas fa-file-medical": "&#xf477; Medical File solid",
			"far fa-file-medical": "&#xf477; Medical File regular",
			"fal fa-file-medical": "&#xf477; Medical File light",
			"fab fa-file-medical": "&#xf477; Medical File duotone",
			"fas fa-file-invoice-dollar": "&#xf571; File Invoice with US Dollar solid",
			"far fa-file-invoice-dollar": "&#xf571; File Invoice with US Dollar regular",
			"fal fa-file-invoice-dollar": "&#xf571; File Invoice with US Dollar light",
			"fab fa-file-invoice-dollar": "&#xf571; File Invoice with US Dollar duotone",
			"fas fa-file-invoice": "&#xf570; File Invoice solid",
			"far fa-file-invoice": "&#xf570; File Invoice regular",
			"fal fa-file-invoice": "&#xf570; File Invoice light",
			"fab fa-file-invoice": "&#xf570; File Invoice duotone",
			"fas fa-file-import": "&#xf56f; File Import solid",
			"far fa-file-import": "&#xf56f; File Import regular",
			"fal fa-file-import": "&#xf56f; File Import light",
			"fab fa-file-import": "&#xf56f; File Import duotone",
			"fas fa-file-image": "&#xf1c5; Image File solid",
			"far fa-file-image": "&#xf1c5; Image File regular",
			"fal fa-file-image": "&#xf1c5; Image File light",
			"fab fa-file-image": "&#xf1c5; Image File duotone",
			"fas fa-file-export": "&#xf56e; File Export solid",
			"far fa-file-export": "&#xf56e; File Export regular",
			"fal fa-file-export": "&#xf56e; File Export light",
			"fab fa-file-export": "&#xf56e; File Export duotone",
			"fas fa-file-exclamation": "&#xf31a; Exclamation File solid",
			"far fa-file-exclamation": "&#xf31a; Exclamation File regular",
			"fal fa-file-exclamation": "&#xf31a; Exclamation File light",
			"fab fa-file-exclamation": "&#xf31a; Exclamation File duotone",
			"fas fa-file-excel": "&#xf1c3; Excel File solid",
			"far fa-file-excel": "&#xf1c3; Excel File regular",
			"fal fa-file-excel": "&#xf1c3; Excel File light",
			"fab fa-file-excel": "&#xf1c3; Excel File duotone",
			"fas fa-file-edit": "&#xf31c; Edit File solid",
			"far fa-file-edit": "&#xf31c; Edit File regular",
			"fal fa-file-edit": "&#xf31c; Edit File light",
			"fab fa-file-edit": "&#xf31c; Edit File duotone",
			"fas fa-file-download": "&#xf56d; File Download solid",
			"far fa-file-download": "&#xf56d; File Download regular",
			"fal fa-file-download": "&#xf56d; File Download light",
			"fab fa-file-download": "&#xf56d; File Download duotone",
			"fas fa-file-csv": "&#xf6dd; File CSV solid",
			"far fa-file-csv": "&#xf6dd; File CSV regular",
			"fal fa-file-csv": "&#xf6dd; File CSV light",
			"fab fa-file-csv": "&#xf6dd; File CSV duotone",
			"fas fa-file-contract": "&#xf56c; File Contract solid",
			"far fa-file-contract": "&#xf56c; File Contract regular",
			"fal fa-file-contract": "&#xf56c; File Contract light",
			"fab fa-file-contract": "&#xf56c; File Contract duotone",
			"fas fa-file-code": "&#xf1c9; Code File solid",
			"far fa-file-code": "&#xf1c9; Code File regular",
			"fal fa-file-code": "&#xf1c9; Code File light",
			"fab fa-file-code": "&#xf1c9; Code File duotone",
			"fas fa-file-check": "&#xf316; Check File solid",
			"far fa-file-check": "&#xf316; Check File regular",
			"fal fa-file-check": "&#xf316; Check File light",
			"fab fa-file-check": "&#xf316; Check File duotone",
			"fas fa-file-chart-pie": "&#xf65a; Pie Chart File solid",
			"far fa-file-chart-pie": "&#xf65a; Pie Chart File regular",
			"fal fa-file-chart-pie": "&#xf65a; Pie Chart File light",
			"fab fa-file-chart-pie": "&#xf65a; Pie Chart File duotone",
			"fas fa-file-chart-line": "&#xf659; Chart Line File solid",
			"far fa-file-chart-line": "&#xf659; Chart Line File regular",
			"fal fa-file-chart-line": "&#xf659; Chart Line File light",
			"fab fa-file-chart-line": "&#xf659; Chart Line File duotone",
			"fas fa-file-certificate": "&#xf5f3; File Certificate solid",
			"far fa-file-certificate": "&#xf5f3; File Certificate regular",
			"fal fa-file-certificate": "&#xf5f3; File Certificate light",
			"fab fa-file-certificate": "&#xf5f3; File Certificate duotone",
			"fas fa-file-audio": "&#xf1c7; Audio File solid",
			"far fa-file-audio": "&#xf1c7; Audio File regular",
			"fal fa-file-audio": "&#xf1c7; Audio File light",
			"fab fa-file-audio": "&#xf1c7; Audio File duotone",
			"fas fa-file-archive": "&#xf1c6; Archive File solid",
			"far fa-file-archive": "&#xf1c6; Archive File regular",
			"fal fa-file-archive": "&#xf1c6; Archive File light",
			"fab fa-file-archive": "&#xf1c6; Archive File duotone",
			"fas fa-file-alt": "&#xf15c; Alternate File solid",
			"far fa-file-alt": "&#xf15c; Alternate File regular",
			"fal fa-file-alt": "&#xf15c; Alternate File light",
			"fab fa-file-alt": "&#xf15c; Alternate File duotone",
			"fas fa-file": "&#xf15b; File solid",
			"far fa-file": "&#xf15b; File regular",
			"fal fa-file": "&#xf15b; File light",
			"fab fa-file": "&#xf15b; File duotone",
			"fab fa-figma": "&#xf799; Figma brands",
			"fas fa-fighter-jet": "&#xf0fb; fighter-jet solid",
			"far fa-fighter-jet": "&#xf0fb; fighter-jet regular",
			"fal fa-fighter-jet": "&#xf0fb; fighter-jet light",
			"fab fa-fighter-jet": "&#xf0fb; fighter-jet duotone",
			"fas fa-field-hockey": "&#xf44c; Field Hockey solid",
			"far fa-field-hockey": "&#xf44c; Field Hockey regular",
			"fal fa-field-hockey": "&#xf44c; Field Hockey light",
			"fab fa-field-hockey": "&#xf44c; Field Hockey duotone",
			"fas fa-female": "&#xf182; Female solid",
			"far fa-female": "&#xf182; Female regular",
			"fal fa-female": "&#xf182; Female light",
			"fab fa-female": "&#xf182; Female duotone",
			"fab fa-fedora": "&#xf798; Fedora brands",
			"fab fa-fedex": "&#xf797; FedEx brands",
			"fas fa-feather-alt": "&#xf56b; Alternate Feather solid",
			"far fa-feather-alt": "&#xf56b; Alternate Feather regular",
			"fal fa-feather-alt": "&#xf56b; Alternate Feather light",
			"fab fa-feather-alt": "&#xf56b; Alternate Feather duotone",
			"fas fa-feather": "&#xf52d; Feather solid",
			"far fa-feather": "&#xf52d; Feather regular",
			"fal fa-feather": "&#xf52d; Feather light",
			"fab fa-feather": "&#xf52d; Feather duotone",
			"fas fa-fax": "&#xf1ac; Fax solid",
			"far fa-fax": "&#xf1ac; Fax regular",
			"fal fa-fax": "&#xf1ac; Fax light",
			"fab fa-fax": "&#xf1ac; Fax duotone",
			"fas fa-fast-forward": "&#xf050; fast-forward solid",
			"far fa-fast-forward": "&#xf050; fast-forward regular",
			"fal fa-fast-forward": "&#xf050; fast-forward light",
			"fab fa-fast-forward": "&#xf050; fast-forward duotone",
			"fas fa-fast-backward": "&#xf049; fast-backward solid",
			"far fa-fast-backward": "&#xf049; fast-backward regular",
			"fal fa-fast-backward": "&#xf049; fast-backward light",
			"fab fa-fast-backward": "&#xf049; fast-backward duotone",
			"fas fa-farm": "&#xf864; Farm solid",
			"far fa-farm": "&#xf864; Farm regular",
			"fal fa-farm": "&#xf864; Farm light",
			"fab fa-farm": "&#xf864; Farm duotone",
			"fab fa-fantasy-flight-games": "&#xf6dc; Fantasy Flight-games brands",
			"fas fa-fan": "&#xf863; Fan solid",
			"far fa-fan": "&#xf863; Fan regular",
			"fal fa-fan": "&#xf863; Fan light",
			"fab fa-fan": "&#xf863; Fan duotone",
			"fab fa-facebook-square": "&#xf082; Facebook Square brands",
			"fab fa-facebook-messenger": "&#xf39f; Facebook Messenger brands",
			"fab fa-facebook-f": "&#xf39e; Facebook F brands",
			"fab fa-facebook": "&#xf09a; Facebook brands",
			"fas fa-eye-slash": "&#xf070; Eye Slash solid",
			"far fa-eye-slash": "&#xf070; Eye Slash regular",
			"fal fa-eye-slash": "&#xf070; Eye Slash light",
			"fab fa-eye-slash": "&#xf070; Eye Slash duotone",
			"fas fa-eye-evil": "&#xf6db; Evil Eye solid",
			"far fa-eye-evil": "&#xf6db; Evil Eye regular",
			"fal fa-eye-evil": "&#xf6db; Evil Eye light",
			"fab fa-eye-evil": "&#xf6db; Evil Eye duotone",
			"fas fa-eye-dropper": "&#xf1fb; Eye Dropper solid",
			"far fa-eye-dropper": "&#xf1fb; Eye Dropper regular",
			"fal fa-eye-dropper": "&#xf1fb; Eye Dropper light",
			"fab fa-eye-dropper": "&#xf1fb; Eye Dropper duotone",
			"fas fa-eye": "&#xf06e; Eye solid",
			"far fa-eye": "&#xf06e; Eye regular",
			"fal fa-eye": "&#xf06e; Eye light",
			"fab fa-eye": "&#xf06e; Eye duotone",
			"fas fa-external-link-square-alt": "&#xf360; Alternate External Link Square solid",
			"far fa-external-link-square-alt": "&#xf360; Alternate External Link Square regular",
			"fal fa-external-link-square-alt": "&#xf360; Alternate External Link Square light",
			"fab fa-external-link-square-alt": "&#xf360; Alternate External Link Square duotone",
			"fas fa-external-link-square": "&#xf14c; External Link Square solid",
			"far fa-external-link-square": "&#xf14c; External Link Square regular",
			"fal fa-external-link-square": "&#xf14c; External Link Square light",
			"fab fa-external-link-square": "&#xf14c; External Link Square duotone",
			"fas fa-external-link-alt": "&#xf35d; Alternate External Link solid",
			"far fa-external-link-alt": "&#xf35d; Alternate External Link regular",
			"fal fa-external-link-alt": "&#xf35d; Alternate External Link light",
			"fab fa-external-link-alt": "&#xf35d; Alternate External Link duotone",
			"fas fa-external-link": "&#xf08e; External Link solid",
			"far fa-external-link": "&#xf08e; External Link regular",
			"fal fa-external-link": "&#xf08e; External Link light",
			"fab fa-external-link": "&#xf08e; External Link duotone",
			"fab fa-expeditedssl": "&#xf23e; ExpeditedSSL brands",
			"fas fa-expand-wide": "&#xf320; Expand Wide solid",
			"far fa-expand-wide": "&#xf320; Expand Wide regular",
			"fal fa-expand-wide": "&#xf320; Expand Wide light",
			"fab fa-expand-wide": "&#xf320; Expand Wide duotone",
			"fas fa-expand-arrows-alt": "&#xf31e; Alternate Expand Arrows solid",
			"far fa-expand-arrows-alt": "&#xf31e; Alternate Expand Arrows regular",
			"fal fa-expand-arrows-alt": "&#xf31e; Alternate Expand Arrows light",
			"fab fa-expand-arrows-alt": "&#xf31e; Alternate Expand Arrows duotone",
			"fas fa-expand-arrows": "&#xf31d; Expand Arrows solid",
			"far fa-expand-arrows": "&#xf31d; Expand Arrows regular",
			"fal fa-expand-arrows": "&#xf31d; Expand Arrows light",
			"fab fa-expand-arrows": "&#xf31d; Expand Arrows duotone",
			"fas fa-expand-alt": "&#xf424; Alternate Expand solid",
			"far fa-expand-alt": "&#xf424; Alternate Expand regular",
			"fal fa-expand-alt": "&#xf424; Alternate Expand light",
			"fab fa-expand-alt": "&#xf424; Alternate Expand duotone",
			"fas fa-expand": "&#xf065; Expand solid",
			"far fa-expand": "&#xf065; Expand regular",
			"fal fa-expand": "&#xf065; Expand light",
			"fab fa-expand": "&#xf065; Expand duotone",
			"fas fa-exclamation-triangle": "&#xf071; Exclamation Triangle solid",
			"far fa-exclamation-triangle": "&#xf071; Exclamation Triangle regular",
			"fal fa-exclamation-triangle": "&#xf071; Exclamation Triangle light",
			"fab fa-exclamation-triangle": "&#xf071; Exclamation Triangle duotone",
			"fas fa-exclamation-square": "&#xf321; Exclamation Square solid",
			"far fa-exclamation-square": "&#xf321; Exclamation Square regular",
			"fal fa-exclamation-square": "&#xf321; Exclamation Square light",
			"fab fa-exclamation-square": "&#xf321; Exclamation Square duotone",
			"fas fa-exclamation-circle": "&#xf06a; Exclamation Circle solid",
			"far fa-exclamation-circle": "&#xf06a; Exclamation Circle regular",
			"fal fa-exclamation-circle": "&#xf06a; Exclamation Circle light",
			"fab fa-exclamation-circle": "&#xf06a; Exclamation Circle duotone",
			"fas fa-exclamation": "&#xf12a; exclamation solid",
			"far fa-exclamation": "&#xf12a; exclamation regular",
			"fal fa-exclamation": "&#xf12a; exclamation light",
			"fab fa-exclamation": "&#xf12a; exclamation duotone",
			"fas fa-exchange-alt": "&#xf362; Alternate Exchange solid",
			"far fa-exchange-alt": "&#xf362; Alternate Exchange regular",
			"fal fa-exchange-alt": "&#xf362; Alternate Exchange light",
			"fab fa-exchange-alt": "&#xf362; Alternate Exchange duotone",
			"fas fa-exchange": "&#xf0ec; Exchange solid",
			"far fa-exchange": "&#xf0ec; Exchange regular",
			"fal fa-exchange": "&#xf0ec; Exchange light",
			"fab fa-exchange": "&#xf0ec; Exchange duotone",
			"fab fa-evernote": "&#xf839; Evernote brands",
			"fas fa-euro-sign": "&#xf153; Euro Sign solid",
			"far fa-euro-sign": "&#xf153; Euro Sign regular",
			"fal fa-euro-sign": "&#xf153; Euro Sign light",
			"fab fa-euro-sign": "&#xf153; Euro Sign duotone",
			"fab fa-etsy": "&#xf2d7; Etsy brands",
			"fas fa-ethernet": "&#xf796; Ethernet solid",
			"far fa-ethernet": "&#xf796; Ethernet regular",
			"fal fa-ethernet": "&#xf796; Ethernet light",
			"fab fa-ethernet": "&#xf796; Ethernet duotone",
			"fab fa-ethereum": "&#xf42e; Ethereum brands",
			"fab fa-erlang": "&#xf39d; Erlang brands",
			"fas fa-eraser": "&#xf12d; eraser solid",
			"far fa-eraser": "&#xf12d; eraser regular",
			"fal fa-eraser": "&#xf12d; eraser light",
			"fab fa-eraser": "&#xf12d; eraser duotone",
			"fas fa-equals": "&#xf52c; Equals solid",
			"far fa-equals": "&#xf52c; Equals regular",
			"fal fa-equals": "&#xf52c; Equals light",
			"fab fa-equals": "&#xf52c; Equals duotone",
			"fab fa-envira": "&#xf299; Envira Gallery brands",
			"fas fa-envelope-square": "&#xf199; Envelope Square solid",
			"far fa-envelope-square": "&#xf199; Envelope Square regular",
			"fal fa-envelope-square": "&#xf199; Envelope Square light",
			"fab fa-envelope-square": "&#xf199; Envelope Square duotone",
			"fas fa-envelope-open-text": "&#xf658; Envelope Open-text solid",
			"far fa-envelope-open-text": "&#xf658; Envelope Open-text regular",
			"fal fa-envelope-open-text": "&#xf658; Envelope Open-text light",
			"fab fa-envelope-open-text": "&#xf658; Envelope Open-text duotone",
			"fas fa-envelope-open-dollar": "&#xf657; Envelope Open-dollar solid",
			"far fa-envelope-open-dollar": "&#xf657; Envelope Open-dollar regular",
			"fal fa-envelope-open-dollar": "&#xf657; Envelope Open-dollar light",
			"fab fa-envelope-open-dollar": "&#xf657; Envelope Open-dollar duotone",
			"fas fa-envelope-open": "&#xf2b6; Envelope Open solid",
			"far fa-envelope-open": "&#xf2b6; Envelope Open regular",
			"fal fa-envelope-open": "&#xf2b6; Envelope Open light",
			"fab fa-envelope-open": "&#xf2b6; Envelope Open duotone",
			"fas fa-envelope": "&#xf0e0; Envelope solid",
			"far fa-envelope": "&#xf0e0; Envelope regular",
			"fal fa-envelope": "&#xf0e0; Envelope light",
			"fab fa-envelope": "&#xf0e0; Envelope duotone",
			"fas fa-engine-warning": "&#xf5f2; Engine Warning solid",
			"far fa-engine-warning": "&#xf5f2; Engine Warning regular",
			"fal fa-engine-warning": "&#xf5f2; Engine Warning light",
			"fab fa-engine-warning": "&#xf5f2; Engine Warning duotone",
			"fas fa-empty-set": "&#xf656; Empty Set solid",
			"far fa-empty-set": "&#xf656; Empty Set regular",
			"fal fa-empty-set": "&#xf656; Empty Set light",
			"fab fa-empty-set": "&#xf656; Empty Set duotone",
			"fab fa-empire": "&#xf1d1; Galactic Empire brands",
			"fab fa-ember": "&#xf423; Ember brands",
			"fab fa-ello": "&#xf5f1; Ello brands",
			"fas fa-ellipsis-v-alt": "&#xf39c; Alternate Vertical Ellipsis solid",
			"far fa-ellipsis-v-alt": "&#xf39c; Alternate Vertical Ellipsis regular",
			"fal fa-ellipsis-v-alt": "&#xf39c; Alternate Vertical Ellipsis light",
			"fab fa-ellipsis-v-alt": "&#xf39c; Alternate Vertical Ellipsis duotone",
			"fas fa-ellipsis-v": "&#xf142; Vertical Ellipsis solid",
			"far fa-ellipsis-v": "&#xf142; Vertical Ellipsis regular",
			"fal fa-ellipsis-v": "&#xf142; Vertical Ellipsis light",
			"fab fa-ellipsis-v": "&#xf142; Vertical Ellipsis duotone",
			"fas fa-ellipsis-h-alt": "&#xf39b; Alternate Horizontal Ellipsis solid",
			"far fa-ellipsis-h-alt": "&#xf39b; Alternate Horizontal Ellipsis regular",
			"fal fa-ellipsis-h-alt": "&#xf39b; Alternate Horizontal Ellipsis light",
			"fab fa-ellipsis-h-alt": "&#xf39b; Alternate Horizontal Ellipsis duotone",
			"fas fa-ellipsis-h": "&#xf141; Horizontal Ellipsis solid",
			"far fa-ellipsis-h": "&#xf141; Horizontal Ellipsis regular",
			"fal fa-ellipsis-h": "&#xf141; Horizontal Ellipsis light",
			"fab fa-ellipsis-h": "&#xf141; Horizontal Ellipsis duotone",
			"fas fa-elephant": "&#xf6da; Elephant solid",
			"far fa-elephant": "&#xf6da; Elephant regular",
			"fal fa-elephant": "&#xf6da; Elephant light",
			"fab fa-elephant": "&#xf6da; Elephant duotone",
			"fab fa-elementor": "&#xf430; Elementor brands",
			"fas fa-eject": "&#xf052; eject solid",
			"far fa-eject": "&#xf052; eject regular",
			"fal fa-eject": "&#xf052; eject light",
			"fab fa-eject": "&#xf052; eject duotone",
			"fas fa-egg-fried": "&#xf7fc; Fried Egg solid",
			"far fa-egg-fried": "&#xf7fc; Fried Egg regular",
			"fal fa-egg-fried": "&#xf7fc; Fried Egg light",
			"fab fa-egg-fried": "&#xf7fc; Fried Egg duotone",
			"fas fa-egg": "&#xf7fb; Egg solid",
			"far fa-egg": "&#xf7fb; Egg regular",
			"fal fa-egg": "&#xf7fb; Egg light",
			"fab fa-egg": "&#xf7fb; Egg duotone",
			"fas fa-edit": "&#xf044; Edit solid",
			"far fa-edit": "&#xf044; Edit regular",
			"fal fa-edit": "&#xf044; Edit light",
			"fab fa-edit": "&#xf044; Edit duotone",
			"fab fa-edge": "&#xf282; Edge Browser brands",
			"fas fa-eclipse-alt": "&#xf74a; Alternate Eclipse solid",
			"far fa-eclipse-alt": "&#xf74a; Alternate Eclipse regular",
			"fal fa-eclipse-alt": "&#xf74a; Alternate Eclipse light",
			"fab fa-eclipse-alt": "&#xf74a; Alternate Eclipse duotone",
			"fas fa-eclipse": "&#xf749; Eclipse solid",
			"far fa-eclipse": "&#xf749; Eclipse regular",
			"fal fa-eclipse": "&#xf749; Eclipse light",
			"fab fa-eclipse": "&#xf749; Eclipse duotone",
			"fab fa-ebay": "&#xf4f4; eBay brands",
			"fab fa-earlybirds": "&#xf39a; Earlybirds brands",
			"fas fa-ear-muffs": "&#xf795; Ear Muffs solid",
			"far fa-ear-muffs": "&#xf795; Ear Muffs regular",
			"fal fa-ear-muffs": "&#xf795; Ear Muffs light",
			"fab fa-ear-muffs": "&#xf795; Ear Muffs duotone",
			"fas fa-ear": "&#xf5f0; Ear solid",
			"far fa-ear": "&#xf5f0; Ear regular",
			"fal fa-ear": "&#xf5f0; Ear light",
			"fab fa-ear": "&#xf5f0; Ear duotone",
			"fab fa-dyalog": "&#xf399; Dyalog brands",
			"fas fa-dungeon": "&#xf6d9; Dungeon solid",
			"far fa-dungeon": "&#xf6d9; Dungeon regular",
			"fal fa-dungeon": "&#xf6d9; Dungeon light",
			"fab fa-dungeon": "&#xf6d9; Dungeon duotone",
			"fas fa-dumpster-fire": "&#xf794; Dumpster Fire solid",
			"far fa-dumpster-fire": "&#xf794; Dumpster Fire regular",
			"fal fa-dumpster-fire": "&#xf794; Dumpster Fire light",
			"fab fa-dumpster-fire": "&#xf794; Dumpster Fire duotone",
			"fas fa-dumpster": "&#xf793; Dumpster solid",
			"far fa-dumpster": "&#xf793; Dumpster regular",
			"fal fa-dumpster": "&#xf793; Dumpster light",
			"fab fa-dumpster": "&#xf793; Dumpster duotone",
			"fas fa-dumbbell": "&#xf44b; Dumbbell solid",
			"far fa-dumbbell": "&#xf44b; Dumbbell regular",
			"fal fa-dumbbell": "&#xf44b; Dumbbell light",
			"fab fa-dumbbell": "&#xf44b; Dumbbell duotone",
			"fas fa-duck": "&#xf6d8; Duck solid",
			"far fa-duck": "&#xf6d8; Duck regular",
			"fal fa-duck": "&#xf6d8; Duck light",
			"fab fa-duck": "&#xf6d8; Duck duotone",
			"fas fa-dryer-alt": "&#xf862; Alternate Dryer solid",
			"far fa-dryer-alt": "&#xf862; Alternate Dryer regular",
			"fal fa-dryer-alt": "&#xf862; Alternate Dryer light",
			"fab fa-dryer-alt": "&#xf862; Alternate Dryer duotone",
			"fas fa-dryer": "&#xf861; Dryer solid",
			"far fa-dryer": "&#xf861; Dryer regular",
			"fal fa-dryer": "&#xf861; Dryer light",
			"fab fa-dryer": "&#xf861; Dryer duotone",
			"fab fa-drupal": "&#xf1a9; Drupal Logo brands",
			"fas fa-drumstick-bite": "&#xf6d7; Drumstick with Bite Taken Out solid",
			"far fa-drumstick-bite": "&#xf6d7; Drumstick with Bite Taken Out regular",
			"fal fa-drumstick-bite": "&#xf6d7; Drumstick with Bite Taken Out light",
			"fab fa-drumstick-bite": "&#xf6d7; Drumstick with Bite Taken Out duotone",
			"fas fa-drumstick": "&#xf6d6; Drumstick solid",
			"far fa-drumstick": "&#xf6d6; Drumstick regular",
			"fal fa-drumstick": "&#xf6d6; Drumstick light",
			"fab fa-drumstick": "&#xf6d6; Drumstick duotone",
			"fas fa-drum-steelpan": "&#xf56a; Drum Steelpan solid",
			"far fa-drum-steelpan": "&#xf56a; Drum Steelpan regular",
			"fal fa-drum-steelpan": "&#xf56a; Drum Steelpan light",
			"fab fa-drum-steelpan": "&#xf56a; Drum Steelpan duotone",
			"fas fa-drum": "&#xf569; Drum solid",
			"far fa-drum": "&#xf569; Drum regular",
			"fal fa-drum": "&#xf569; Drum light",
			"fab fa-drum": "&#xf569; Drum duotone",
			"fab fa-dropbox": "&#xf16b; Dropbox brands",
			"fas fa-drone-alt": "&#xf860; Alternate Drone solid",
			"far fa-drone-alt": "&#xf860; Alternate Drone regular",
			"fal fa-drone-alt": "&#xf860; Alternate Drone light",
			"fab fa-drone-alt": "&#xf860; Alternate Drone duotone",
			"fas fa-drone": "&#xf85f; Drone solid",
			"far fa-drone": "&#xf85f; Drone regular",
			"fal fa-drone": "&#xf85f; Drone light",
			"fab fa-drone": "&#xf85f; Drone duotone",
			"fab fa-dribbble-square": "&#xf397; Dribbble Square brands",
			"fab fa-dribbble": "&#xf17d; Dribbble brands",
			"fas fa-dreidel": "&#xf792; Dreidel solid",
			"far fa-dreidel": "&#xf792; Dreidel regular",
			"fal fa-dreidel": "&#xf792; Dreidel light",
			"fab fa-dreidel": "&#xf792; Dreidel duotone",
			"fas fa-draw-square": "&#xf5ef; Draw Square solid",
			"far fa-draw-square": "&#xf5ef; Draw Square regular",
			"fal fa-draw-square": "&#xf5ef; Draw Square light",
			"fab fa-draw-square": "&#xf5ef; Draw Square duotone",
			"fas fa-draw-polygon": "&#xf5ee; Draw Polygon solid",
			"far fa-draw-polygon": "&#xf5ee; Draw Polygon regular",
			"fal fa-draw-polygon": "&#xf5ee; Draw Polygon light",
			"fab fa-draw-polygon": "&#xf5ee; Draw Polygon duotone",
			"fas fa-draw-circle": "&#xf5ed; Draw Circle solid",
			"far fa-draw-circle": "&#xf5ed; Draw Circle regular",
			"fal fa-draw-circle": "&#xf5ed; Draw Circle light",
			"fab fa-draw-circle": "&#xf5ed; Draw Circle duotone",
			"fas fa-dragon": "&#xf6d5; Dragon solid",
			"far fa-dragon": "&#xf6d5; Dragon regular",
			"fal fa-dragon": "&#xf6d5; Dragon light",
			"fab fa-dragon": "&#xf6d5; Dragon duotone",
			"fas fa-drafting-compass": "&#xf568; Drafting Compass solid",
			"far fa-drafting-compass": "&#xf568; Drafting Compass regular",
			"fal fa-drafting-compass": "&#xf568; Drafting Compass light",
			"fab fa-drafting-compass": "&#xf568; Drafting Compass duotone",
			"fab fa-draft2digital": "&#xf396; Draft2digital brands",
			"fas fa-download": "&#xf019; Download solid",
			"far fa-download": "&#xf019; Download regular",
			"fal fa-download": "&#xf019; Download light",
			"fab fa-download": "&#xf019; Download duotone",
			"fas fa-dove": "&#xf4ba; Dove solid",
			"far fa-dove": "&#xf4ba; Dove regular",
			"fal fa-dove": "&#xf4ba; Dove light",
			"fab fa-dove": "&#xf4ba; Dove duotone",
			"fas fa-dot-circle": "&#xf192; Dot Circle solid",
			"far fa-dot-circle": "&#xf192; Dot Circle regular",
			"fal fa-dot-circle": "&#xf192; Dot Circle light",
			"fab fa-dot-circle": "&#xf192; Dot Circle duotone",
			"fas fa-door-open": "&#xf52b; Door Open solid",
			"far fa-door-open": "&#xf52b; Door Open regular",
			"fal fa-door-open": "&#xf52b; Door Open light",
			"fab fa-door-open": "&#xf52b; Door Open duotone",
			"fas fa-door-closed": "&#xf52a; Door Closed solid",
			"far fa-door-closed": "&#xf52a; Door Closed regular",
			"fal fa-door-closed": "&#xf52a; Door Closed light",
			"fab fa-door-closed": "&#xf52a; Door Closed duotone",
			"fas fa-donate": "&#xf4b9; Donate solid",
			"far fa-donate": "&#xf4b9; Donate regular",
			"fal fa-donate": "&#xf4b9; Donate light",
			"fab fa-donate": "&#xf4b9; Donate duotone",
			"fas fa-dolly-flatbed-empty": "&#xf476; Dolly Flatbed-empty solid",
			"far fa-dolly-flatbed-empty": "&#xf476; Dolly Flatbed-empty regular",
			"fal fa-dolly-flatbed-empty": "&#xf476; Dolly Flatbed-empty light",
			"fab fa-dolly-flatbed-empty": "&#xf476; Dolly Flatbed-empty duotone",
			"fas fa-dolly-flatbed-alt": "&#xf475; Alternate Dolly Flatbed solid",
			"far fa-dolly-flatbed-alt": "&#xf475; Alternate Dolly Flatbed regular",
			"fal fa-dolly-flatbed-alt": "&#xf475; Alternate Dolly Flatbed light",
			"fab fa-dolly-flatbed-alt": "&#xf475; Alternate Dolly Flatbed duotone",
			"fas fa-dolly-flatbed": "&#xf474; Dolly Flatbed solid",
			"far fa-dolly-flatbed": "&#xf474; Dolly Flatbed regular",
			"fal fa-dolly-flatbed": "&#xf474; Dolly Flatbed light",
			"fab fa-dolly-flatbed": "&#xf474; Dolly Flatbed duotone",
			"fas fa-dolly-empty": "&#xf473; Dolly Empty solid",
			"far fa-dolly-empty": "&#xf473; Dolly Empty regular",
			"fal fa-dolly-empty": "&#xf473; Dolly Empty light",
			"fab fa-dolly-empty": "&#xf473; Dolly Empty duotone",
			"fas fa-dolly": "&#xf472; Dolly solid",
			"far fa-dolly": "&#xf472; Dolly regular",
			"fal fa-dolly": "&#xf472; Dolly light",
			"fab fa-dolly": "&#xf472; Dolly duotone",
			"fas fa-dollar-sign": "&#xf155; Dollar Sign solid",
			"far fa-dollar-sign": "&#xf155; Dollar Sign regular",
			"fal fa-dollar-sign": "&#xf155; Dollar Sign light",
			"fab fa-dollar-sign": "&#xf155; Dollar Sign duotone",
			"fas fa-dog-leashed": "&#xf6d4; Leashed Dog solid",
			"far fa-dog-leashed": "&#xf6d4; Leashed Dog regular",
			"fal fa-dog-leashed": "&#xf6d4; Leashed Dog light",
			"fab fa-dog-leashed": "&#xf6d4; Leashed Dog duotone",
			"fas fa-dog": "&#xf6d3; Dog solid",
			"far fa-dog": "&#xf6d3; Dog regular",
			"fal fa-dog": "&#xf6d3; Dog light",
			"fab fa-dog": "&#xf6d3; Dog duotone",
			"fab fa-docker": "&#xf395; Docker brands",
			"fab fa-dochub": "&#xf394; DocHub brands",
			"fas fa-do-not-enter": "&#xf5ec; Do Not-enter solid",
			"far fa-do-not-enter": "&#xf5ec; Do Not-enter regular",
			"fal fa-do-not-enter": "&#xf5ec; Do Not-enter light",
			"fab fa-do-not-enter": "&#xf5ec; Do Not-enter duotone",
			"fas fa-dna": "&#xf471; DNA solid",
			"far fa-dna": "&#xf471; DNA regular",
			"fal fa-dna": "&#xf471; DNA light",
			"fab fa-dna": "&#xf471; DNA duotone",
			"fas fa-dizzy": "&#xf567; Dizzy Face solid",
			"far fa-dizzy": "&#xf567; Dizzy Face regular",
			"fal fa-dizzy": "&#xf567; Dizzy Face light",
			"fab fa-dizzy": "&#xf567; Dizzy Face duotone",
			"fas fa-divide": "&#xf529; Divide solid",
			"far fa-divide": "&#xf529; Divide regular",
			"fal fa-divide": "&#xf529; Divide light",
			"fab fa-divide": "&#xf529; Divide duotone",
			"fas fa-disease": "&#xf7fa; Disease solid",
			"far fa-disease": "&#xf7fa; Disease regular",
			"fal fa-disease": "&#xf7fa; Disease light",
			"fab fa-disease": "&#xf7fa; Disease duotone",
			"fab fa-discourse": "&#xf393; Discourse brands",
			"fab fa-discord": "&#xf392; Discord brands",
			"fas fa-disc-drive": "&#xf8b5; Disc Drive solid",
			"far fa-disc-drive": "&#xf8b5; Disc Drive regular",
			"fal fa-disc-drive": "&#xf8b5; Disc Drive light",
			"fab fa-disc-drive": "&#xf8b5; Disc Drive duotone",
			"fas fa-directions": "&#xf5eb; Directions solid",
			"far fa-directions": "&#xf5eb; Directions regular",
			"fal fa-directions": "&#xf5eb; Directions light",
			"fab fa-directions": "&#xf5eb; Directions duotone",
			"fas fa-diploma": "&#xf5ea; Diploma solid",
			"far fa-diploma": "&#xf5ea; Diploma regular",
			"fal fa-diploma": "&#xf5ea; Diploma light",
			"fab fa-diploma": "&#xf5ea; Diploma duotone",
			"fas fa-digital-tachograph": "&#xf566; Digital Tachograph solid",
			"far fa-digital-tachograph": "&#xf566; Digital Tachograph regular",
			"fal fa-digital-tachograph": "&#xf566; Digital Tachograph light",
			"fab fa-digital-tachograph": "&#xf566; Digital Tachograph duotone",
			"fab fa-digital-ocean": "&#xf391; Digital Ocean brands",
			"fas fa-digging": "&#xf85e; Digging solid",
			"far fa-digging": "&#xf85e; Digging regular",
			"fal fa-digging": "&#xf85e; Digging light",
			"fab fa-digging": "&#xf85e; Digging duotone",
			"fab fa-digg": "&#xf1a6; Digg Logo brands",
			"fas fa-dice-two": "&#xf528; Dice Two solid",
			"far fa-dice-two": "&#xf528; Dice Two regular",
			"fal fa-dice-two": "&#xf528; Dice Two light",
			"fab fa-dice-two": "&#xf528; Dice Two duotone",
			"fas fa-dice-three": "&#xf527; Dice Three solid",
			"far fa-dice-three": "&#xf527; Dice Three regular",
			"fal fa-dice-three": "&#xf527; Dice Three light",
			"fab fa-dice-three": "&#xf527; Dice Three duotone",
			"fas fa-dice-six": "&#xf526; Dice Six solid",
			"far fa-dice-six": "&#xf526; Dice Six regular",
			"fal fa-dice-six": "&#xf526; Dice Six light",
			"fab fa-dice-six": "&#xf526; Dice Six duotone",
			"fas fa-dice-one": "&#xf525; Dice One solid",
			"far fa-dice-one": "&#xf525; Dice One regular",
			"fal fa-dice-one": "&#xf525; Dice One light",
			"fab fa-dice-one": "&#xf525; Dice One duotone",
			"fas fa-dice-four": "&#xf524; Dice Four solid",
			"far fa-dice-four": "&#xf524; Dice Four regular",
			"fal fa-dice-four": "&#xf524; Dice Four light",
			"fab fa-dice-four": "&#xf524; Dice Four duotone",
			"fas fa-dice-five": "&#xf523; Dice Five solid",
			"far fa-dice-five": "&#xf523; Dice Five regular",
			"fal fa-dice-five": "&#xf523; Dice Five light",
			"fab fa-dice-five": "&#xf523; Dice Five duotone",
			"fas fa-dice-d8": "&#xf6d2; Dice D8 solid",
			"far fa-dice-d8": "&#xf6d2; Dice D8 regular",
			"fal fa-dice-d8": "&#xf6d2; Dice D8 light",
			"fab fa-dice-d8": "&#xf6d2; Dice D8 duotone",
			"fas fa-dice-d6": "&#xf6d1; Dice D6 solid",
			"far fa-dice-d6": "&#xf6d1; Dice D6 regular",
			"fal fa-dice-d6": "&#xf6d1; Dice D6 light",
			"fab fa-dice-d6": "&#xf6d1; Dice D6 duotone",
			"fas fa-dice-d4": "&#xf6d0; Dice D4 solid",
			"far fa-dice-d4": "&#xf6d0; Dice D4 regular",
			"fal fa-dice-d4": "&#xf6d0; Dice D4 light",
			"fab fa-dice-d4": "&#xf6d0; Dice D4 duotone",
			"fas fa-dice-d20": "&#xf6cf; Dice D20 solid",
			"far fa-dice-d20": "&#xf6cf; Dice D20 regular",
			"fal fa-dice-d20": "&#xf6cf; Dice D20 light",
			"fab fa-dice-d20": "&#xf6cf; Dice D20 duotone",
			"fas fa-dice-d12": "&#xf6ce; Dice D12 solid",
			"far fa-dice-d12": "&#xf6ce; Dice D12 regular",
			"fal fa-dice-d12": "&#xf6ce; Dice D12 light",
			"fab fa-dice-d12": "&#xf6ce; Dice D12 duotone",
			"fas fa-dice-d10": "&#xf6cd; Dice D10 solid",
			"far fa-dice-d10": "&#xf6cd; Dice D10 regular",
			"fal fa-dice-d10": "&#xf6cd; Dice D10 light",
			"fab fa-dice-d10": "&#xf6cd; Dice D10 duotone",
			"fas fa-dice": "&#xf522; Dice solid",
			"far fa-dice": "&#xf522; Dice regular",
			"fal fa-dice": "&#xf522; Dice light",
			"fab fa-dice": "&#xf522; Dice duotone",
			"fab fa-diaspora": "&#xf791; Diaspora brands",
			"fas fa-diamond": "&#xf219; Diamond solid",
			"far fa-diamond": "&#xf219; Diamond regular",
			"fal fa-diamond": "&#xf219; Diamond light",
			"fab fa-diamond": "&#xf219; Diamond duotone",
			"fas fa-diagnoses": "&#xf470; Diagnoses solid",
			"far fa-diagnoses": "&#xf470; Diagnoses regular",
			"fal fa-diagnoses": "&#xf470; Diagnoses light",
			"fab fa-diagnoses": "&#xf470; Diagnoses duotone",
			"fab fa-dhl": "&#xf790; DHL brands",
			"fas fa-dharmachakra": "&#xf655; Dharmachakra solid",
			"far fa-dharmachakra": "&#xf655; Dharmachakra regular",
			"fal fa-dharmachakra": "&#xf655; Dharmachakra light",
			"fab fa-dharmachakra": "&#xf655; Dharmachakra duotone",
			"fas fa-dewpoint": "&#xf748; Dewpoint solid",
			"far fa-dewpoint": "&#xf748; Dewpoint regular",
			"fal fa-dewpoint": "&#xf748; Dewpoint light",
			"fab fa-dewpoint": "&#xf748; Dewpoint duotone",
			"fab fa-deviantart": "&#xf1bd; deviantART brands",
			"fab fa-dev": "&#xf6cc; DEV brands",
			"fas fa-desktop-alt": "&#xf390; Alternate Desktop solid",
			"far fa-desktop-alt": "&#xf390; Alternate Desktop regular",
			"fal fa-desktop-alt": "&#xf390; Alternate Desktop light",
			"fab fa-desktop-alt": "&#xf390; Alternate Desktop duotone",
			"fas fa-desktop": "&#xf108; Desktop solid",
			"far fa-desktop": "&#xf108; Desktop regular",
			"fal fa-desktop": "&#xf108; Desktop light",
			"fab fa-desktop": "&#xf108; Desktop duotone",
			"fab fa-deskpro": "&#xf38f; Deskpro brands",
			"fab fa-deploydog": "&#xf38e; deploy.dog brands",
			"fas fa-democrat": "&#xf747; Democrat solid",
			"far fa-democrat": "&#xf747; Democrat regular",
			"fal fa-democrat": "&#xf747; Democrat light",
			"fab fa-democrat": "&#xf747; Democrat duotone",
			"fab fa-delicious": "&#xf1a5; Delicious brands",
			"fas fa-deer-rudolph": "&#xf78f; Deer Rudolph solid",
			"far fa-deer-rudolph": "&#xf78f; Deer Rudolph regular",
			"fal fa-deer-rudolph": "&#xf78f; Deer Rudolph light",
			"fab fa-deer-rudolph": "&#xf78f; Deer Rudolph duotone",
			"fas fa-deer": "&#xf78e; Deer solid",
			"far fa-deer": "&#xf78e; Deer regular",
			"fal fa-deer": "&#xf78e; Deer light",
			"fab fa-deer": "&#xf78e; Deer duotone",
			"fas fa-debug": "&#xf7f9; Debug solid",
			"far fa-debug": "&#xf7f9; Debug regular",
			"fal fa-debug": "&#xf7f9; Debug light",
			"fab fa-debug": "&#xf7f9; Debug duotone",
			"fas fa-deaf": "&#xf2a4; Deaf solid",
			"far fa-deaf": "&#xf2a4; Deaf regular",
			"fal fa-deaf": "&#xf2a4; Deaf light",
			"fab fa-deaf": "&#xf2a4; Deaf duotone",
			"fas fa-database": "&#xf1c0; Database solid",
			"far fa-database": "&#xf1c0; Database regular",
			"fal fa-database": "&#xf1c0; Database light",
			"fab fa-database": "&#xf1c0; Database duotone",
			"fab fa-dashcube": "&#xf210; DashCube brands",
			"fas fa-dagger": "&#xf6cb; Dagger solid",
			"far fa-dagger": "&#xf6cb; Dagger regular",
			"fal fa-dagger": "&#xf6cb; Dagger light",
			"fab fa-dagger": "&#xf6cb; Dagger duotone",
			"fab fa-d-and-d-beyond": "&#xf6ca; D&D Beyond brands",
			"fab fa-d-and-d": "&#xf38d; Dungeons & Dragons brands",
			"fab fa-cuttlefish": "&#xf38c; Cuttlefish brands",
			"fas fa-cut": "&#xf0c4; Cut solid",
			"far fa-cut": "&#xf0c4; Cut regular",
			"fal fa-cut": "&#xf0c4; Cut light",
			"fab fa-cut": "&#xf0c4; Cut duotone",
			"fas fa-curling": "&#xf44a; Curling solid",
			"far fa-curling": "&#xf44a; Curling regular",
			"fal fa-curling": "&#xf44a; Curling light",
			"fab fa-curling": "&#xf44a; Curling duotone",
			"fas fa-cubes": "&#xf1b3; Cubes solid",
			"far fa-cubes": "&#xf1b3; Cubes regular",
			"fal fa-cubes": "&#xf1b3; Cubes light",
			"fab fa-cubes": "&#xf1b3; Cubes duotone",
			"fas fa-cube": "&#xf1b2; Cube solid",
			"far fa-cube": "&#xf1b2; Cube regular",
			"fal fa-cube": "&#xf1b2; Cube light",
			"fab fa-cube": "&#xf1b2; Cube duotone",
			"fab fa-css3-alt": "&#xf38b; Alternate CSS3 Logo brands",
			"fab fa-css3": "&#xf13c; CSS 3 Logo brands",
			"fas fa-crutches": "&#xf7f8; Crutches solid",
			"far fa-crutches": "&#xf7f8; Crutches regular",
			"fal fa-crutches": "&#xf7f8; Crutches light",
			"fab fa-crutches": "&#xf7f8; Crutches duotone",
			"fas fa-crutch": "&#xf7f7; Crutch solid",
			"far fa-crutch": "&#xf7f7; Crutch regular",
			"fal fa-crutch": "&#xf7f7; Crutch light",
			"fab fa-crutch": "&#xf7f7; Crutch duotone",
			"fas fa-crown": "&#xf521; Crown solid",
			"far fa-crown": "&#xf521; Crown regular",
			"fal fa-crown": "&#xf521; Crown light",
			"fab fa-crown": "&#xf521; Crown duotone",
			"fas fa-crow": "&#xf520; Crow solid",
			"far fa-crow": "&#xf520; Crow regular",
			"fal fa-crow": "&#xf520; Crow light",
			"fab fa-crow": "&#xf520; Crow duotone",
			"fas fa-crosshairs": "&#xf05b; Crosshairs solid",
			"far fa-crosshairs": "&#xf05b; Crosshairs regular",
			"fal fa-crosshairs": "&#xf05b; Crosshairs light",
			"fab fa-crosshairs": "&#xf05b; Crosshairs duotone",
			"fas fa-cross": "&#xf654; Cross solid",
			"far fa-cross": "&#xf654; Cross regular",
			"fal fa-cross": "&#xf654; Cross light",
			"fab fa-cross": "&#xf654; Cross duotone",
			"fas fa-crop-alt": "&#xf565; Alternate Crop solid",
			"far fa-crop-alt": "&#xf565; Alternate Crop regular",
			"fal fa-crop-alt": "&#xf565; Alternate Crop light",
			"fab fa-crop-alt": "&#xf565; Alternate Crop duotone",
			"fas fa-crop": "&#xf125; crop solid",
			"far fa-crop": "&#xf125; crop regular",
			"fal fa-crop": "&#xf125; crop light",
			"fab fa-crop": "&#xf125; crop duotone",
			"fas fa-croissant": "&#xf7f6; Croissant solid",
			"far fa-croissant": "&#xf7f6; Croissant regular",
			"fal fa-croissant": "&#xf7f6; Croissant light",
			"fab fa-croissant": "&#xf7f6; Croissant duotone",
			"fab fa-critical-role": "&#xf6c9; Critical Role brands",
			"fas fa-cricket": "&#xf449; Cricket solid",
			"far fa-cricket": "&#xf449; Cricket regular",
			"fal fa-cricket": "&#xf449; Cricket light",
			"fab fa-cricket": "&#xf449; Cricket duotone",
			"fas fa-credit-card-front": "&#xf38a; Credit Card Front solid",
			"far fa-credit-card-front": "&#xf38a; Credit Card Front regular",
			"fal fa-credit-card-front": "&#xf38a; Credit Card Front light",
			"fab fa-credit-card-front": "&#xf38a; Credit Card Front duotone",
			"fas fa-credit-card-blank": "&#xf389; Credit Card Blank solid",
			"far fa-credit-card-blank": "&#xf389; Credit Card Blank regular",
			"fal fa-credit-card-blank": "&#xf389; Credit Card Blank light",
			"fab fa-credit-card-blank": "&#xf389; Credit Card Blank duotone",
			"fas fa-credit-card": "&#xf09d; Credit Card solid",
			"far fa-credit-card": "&#xf09d; Credit Card regular",
			"fal fa-credit-card": "&#xf09d; Credit Card light",
			"fab fa-credit-card": "&#xf09d; Credit Card duotone",
			"fab fa-creative-commons-zero": "&#xf4f3; Creative Commons CC0 brands",
			"fab fa-creative-commons-share": "&#xf4f2; Creative Commons Share brands",
			"fab fa-creative-commons-sampling-plus": "&#xf4f1; Creative Commons Sampling + brands",
			"fab fa-creative-commons-sampling": "&#xf4f0; Creative Commons Sampling brands",
			"fab fa-creative-commons-sa": "&#xf4ef; Creative Commons Share Alike brands",
			"fab fa-creative-commons-remix": "&#xf4ee; Creative Commons Remix brands",
			"fab fa-creative-commons-pd-alt": "&#xf4ed; Alternate Creative Commons Public Domain brands",
			"fab fa-creative-commons-pd": "&#xf4ec; Creative Commons Public Domain brands",
			"fab fa-creative-commons-nd": "&#xf4eb; Creative Commons No Derivative Works brands",
			"fab fa-creative-commons-nc-jp": "&#xf4ea; Creative Commons Noncommercial (Yen Sign) brands",
			"fab fa-creative-commons-nc-eu": "&#xf4e9; Creative Commons Noncommercial (Euro Sign) brands",
			"fab fa-creative-commons-nc": "&#xf4e8; Creative Commons Noncommercial brands",
			"fab fa-creative-commons-by": "&#xf4e7; Creative Commons Attribution brands",
			"fab fa-creative-commons": "&#xf25e; Creative Commons brands",
			"fab fa-cpanel": "&#xf388; cPanel brands",
			"fas fa-cowbell-more": "&#xf8b4; Cowbell More solid",
			"far fa-cowbell-more": "&#xf8b4; Cowbell More regular",
			"fal fa-cowbell-more": "&#xf8b4; Cowbell More light",
			"fab fa-cowbell-more": "&#xf8b4; Cowbell More duotone",
			"fas fa-cowbell": "&#xf8b3; Cowbell solid",
			"far fa-cowbell": "&#xf8b3; Cowbell regular",
			"fal fa-cowbell": "&#xf8b3; Cowbell light",
			"fab fa-cowbell": "&#xf8b3; Cowbell duotone",
			"fas fa-cow": "&#xf6c8; Cow solid",
			"far fa-cow": "&#xf6c8; Cow regular",
			"fal fa-cow": "&#xf6c8; Cow light",
			"fab fa-cow": "&#xf6c8; Cow duotone",
			"fas fa-couch": "&#xf4b8; Couch solid",
			"far fa-couch": "&#xf4b8; Couch regular",
			"fal fa-couch": "&#xf4b8; Couch light",
			"fab fa-couch": "&#xf4b8; Couch duotone",
			"fab fa-cotton-bureau": "&#xf89e; Cotton Bureau brands",
			"fas fa-corn": "&#xf6c7; Corn solid",
			"far fa-corn": "&#xf6c7; Corn regular",
			"fal fa-corn": "&#xf6c7; Corn light",
			"fab fa-corn": "&#xf6c7; Corn duotone",
			"fas fa-copyright": "&#xf1f9; Copyright solid",
			"far fa-copyright": "&#xf1f9; Copyright regular",
			"fal fa-copyright": "&#xf1f9; Copyright light",
			"fab fa-copyright": "&#xf1f9; Copyright duotone",
			"fas fa-copy": "&#xf0c5; Copy solid",
			"far fa-copy": "&#xf0c5; Copy regular",
			"fal fa-copy": "&#xf0c5; Copy light",
			"fab fa-copy": "&#xf0c5; Copy duotone",
			"fas fa-cookie-bite": "&#xf564; Cookie Bite solid",
			"far fa-cookie-bite": "&#xf564; Cookie Bite regular",
			"fal fa-cookie-bite": "&#xf564; Cookie Bite light",
			"fab fa-cookie-bite": "&#xf564; Cookie Bite duotone",
			"fas fa-cookie": "&#xf563; Cookie solid",
			"far fa-cookie": "&#xf563; Cookie regular",
			"fal fa-cookie": "&#xf563; Cookie light",
			"fab fa-cookie": "&#xf563; Cookie duotone",
			"fas fa-conveyor-belt-alt": "&#xf46f; Alternate Conveyor Belt solid",
			"far fa-conveyor-belt-alt": "&#xf46f; Alternate Conveyor Belt regular",
			"fal fa-conveyor-belt-alt": "&#xf46f; Alternate Conveyor Belt light",
			"fab fa-conveyor-belt-alt": "&#xf46f; Alternate Conveyor Belt duotone",
			"fas fa-conveyor-belt": "&#xf46e; Conveyor Belt solid",
			"far fa-conveyor-belt": "&#xf46e; Conveyor Belt regular",
			"fal fa-conveyor-belt": "&#xf46e; Conveyor Belt light",
			"fab fa-conveyor-belt": "&#xf46e; Conveyor Belt duotone",
			"fab fa-contao": "&#xf26d; Contao brands",
			"fas fa-container-storage": "&#xf4b7; Container Storage solid",
			"far fa-container-storage": "&#xf4b7; Container Storage regular",
			"fal fa-container-storage": "&#xf4b7; Container Storage light",
			"fab fa-container-storage": "&#xf4b7; Container Storage duotone",
			"fas fa-construction": "&#xf85d; Construction solid",
			"far fa-construction": "&#xf85d; Construction regular",
			"fal fa-construction": "&#xf85d; Construction light",
			"fab fa-construction": "&#xf85d; Construction duotone",
			"fab fa-connectdevelop": "&#xf20e; Connect Develop brands",
			"fab fa-confluence": "&#xf78d; Confluence brands",
			"fas fa-concierge-bell": "&#xf562; Concierge Bell solid",
			"far fa-concierge-bell": "&#xf562; Concierge Bell regular",
			"fal fa-concierge-bell": "&#xf562; Concierge Bell light",
			"fab fa-concierge-bell": "&#xf562; Concierge Bell duotone",
			"fas fa-computer-speaker": "&#xf8b2; Computer Speaker solid",
			"far fa-computer-speaker": "&#xf8b2; Computer Speaker regular",
			"fal fa-computer-speaker": "&#xf8b2; Computer Speaker light",
			"fab fa-computer-speaker": "&#xf8b2; Computer Speaker duotone",
			"fas fa-computer-classic": "&#xf8b1; Classic Computer solid",
			"far fa-computer-classic": "&#xf8b1; Classic Computer regular",
			"fal fa-computer-classic": "&#xf8b1; Classic Computer light",
			"fab fa-computer-classic": "&#xf8b1; Classic Computer duotone",
			"fas fa-compress-wide": "&#xf326; Compress Wide solid",
			"far fa-compress-wide": "&#xf326; Compress Wide regular",
			"fal fa-compress-wide": "&#xf326; Compress Wide light",
			"fab fa-compress-wide": "&#xf326; Compress Wide duotone",
			"fas fa-compress-arrows-alt": "&#xf78c; Alternate Compress Arrows solid",
			"far fa-compress-arrows-alt": "&#xf78c; Alternate Compress Arrows regular",
			"fal fa-compress-arrows-alt": "&#xf78c; Alternate Compress Arrows light",
			"fab fa-compress-arrows-alt": "&#xf78c; Alternate Compress Arrows duotone",
			"fas fa-compress-alt": "&#xf422; Alternate Compress solid",
			"far fa-compress-alt": "&#xf422; Alternate Compress regular",
			"fal fa-compress-alt": "&#xf422; Alternate Compress light",
			"fab fa-compress-alt": "&#xf422; Alternate Compress duotone",
			"fas fa-compress": "&#xf066; Compress solid",
			"far fa-compress": "&#xf066; Compress regular",
			"fal fa-compress": "&#xf066; Compress light",
			"fab fa-compress": "&#xf066; Compress duotone",
			"fas fa-compass-slash": "&#xf5e9; Compass Slash solid",
			"far fa-compass-slash": "&#xf5e9; Compass Slash regular",
			"fal fa-compass-slash": "&#xf5e9; Compass Slash light",
			"fab fa-compass-slash": "&#xf5e9; Compass Slash duotone",
			"fas fa-compass": "&#xf14e; Compass solid",
			"far fa-compass": "&#xf14e; Compass regular",
			"fal fa-compass": "&#xf14e; Compass light",
			"fab fa-compass": "&#xf14e; Compass duotone",
			"fas fa-compact-disc": "&#xf51f; Compact Disc solid",
			"far fa-compact-disc": "&#xf51f; Compact Disc regular",
			"fal fa-compact-disc": "&#xf51f; Compact Disc light",
			"fab fa-compact-disc": "&#xf51f; Compact Disc duotone",
			"fas fa-comments-dollar": "&#xf653; Comments Dollar solid",
			"far fa-comments-dollar": "&#xf653; Comments Dollar regular",
			"fal fa-comments-dollar": "&#xf653; Comments Dollar light",
			"fab fa-comments-dollar": "&#xf653; Comments Dollar duotone",
			"fas fa-comments-alt-dollar": "&#xf652; Alternate Comments Dollar solid",
			"far fa-comments-alt-dollar": "&#xf652; Alternate Comments Dollar regular",
			"fal fa-comments-alt-dollar": "&#xf652; Alternate Comments Dollar light",
			"fab fa-comments-alt-dollar": "&#xf652; Alternate Comments Dollar duotone",
			"fas fa-comments-alt": "&#xf4b6; Alternate Comments solid",
			"far fa-comments-alt": "&#xf4b6; Alternate Comments regular",
			"fal fa-comments-alt": "&#xf4b6; Alternate Comments light",
			"fab fa-comments-alt": "&#xf4b6; Alternate Comments duotone",
			"fas fa-comments": "&#xf086; comments solid",
			"far fa-comments": "&#xf086; comments regular",
			"fal fa-comments": "&#xf086; comments light",
			"fab fa-comments": "&#xf086; comments duotone",
			"fas fa-comment-times": "&#xf4b5; Comment Times solid",
			"far fa-comment-times": "&#xf4b5; Comment Times regular",
			"fal fa-comment-times": "&#xf4b5; Comment Times light",
			"fab fa-comment-times": "&#xf4b5; Comment Times duotone",
			"fas fa-comment-smile": "&#xf4b4; Comment Smile solid",
			"far fa-comment-smile": "&#xf4b4; Comment Smile regular",
			"fal fa-comment-smile": "&#xf4b4; Comment Smile light",
			"fab fa-comment-smile": "&#xf4b4; Comment Smile duotone",
			"fas fa-comment-slash": "&#xf4b3; Comment Slash solid",
			"far fa-comment-slash": "&#xf4b3; Comment Slash regular",
			"fal fa-comment-slash": "&#xf4b3; Comment Slash light",
			"fab fa-comment-slash": "&#xf4b3; Comment Slash duotone",
			"fas fa-comment-plus": "&#xf4b2; Comment Plus solid",
			"far fa-comment-plus": "&#xf4b2; Comment Plus regular",
			"fal fa-comment-plus": "&#xf4b2; Comment Plus light",
			"fab fa-comment-plus": "&#xf4b2; Comment Plus duotone",
			"fas fa-comment-music": "&#xf8b0; Comment Music solid",
			"far fa-comment-music": "&#xf8b0; Comment Music regular",
			"fal fa-comment-music": "&#xf8b0; Comment Music light",
			"fab fa-comment-music": "&#xf8b0; Comment Music duotone",
			"fas fa-comment-minus": "&#xf4b1; Comment Minus solid",
			"far fa-comment-minus": "&#xf4b1; Comment Minus regular",
			"fal fa-comment-minus": "&#xf4b1; Comment Minus light",
			"fab fa-comment-minus": "&#xf4b1; Comment Minus duotone",
			"fas fa-comment-medical": "&#xf7f5; Alternate Medical Chat solid",
			"far fa-comment-medical": "&#xf7f5; Alternate Medical Chat regular",
			"fal fa-comment-medical": "&#xf7f5; Alternate Medical Chat light",
			"fab fa-comment-medical": "&#xf7f5; Alternate Medical Chat duotone",
			"fas fa-comment-lines": "&#xf4b0; Comment Lines solid",
			"far fa-comment-lines": "&#xf4b0; Comment Lines regular",
			"fal fa-comment-lines": "&#xf4b0; Comment Lines light",
			"fab fa-comment-lines": "&#xf4b0; Comment Lines duotone",
			"fas fa-comment-exclamation": "&#xf4af; Comment Exclamation solid",
			"far fa-comment-exclamation": "&#xf4af; Comment Exclamation regular",
			"fal fa-comment-exclamation": "&#xf4af; Comment Exclamation light",
			"fab fa-comment-exclamation": "&#xf4af; Comment Exclamation duotone",
			"fas fa-comment-edit": "&#xf4ae; Comment Edit solid",
			"far fa-comment-edit": "&#xf4ae; Comment Edit regular",
			"fal fa-comment-edit": "&#xf4ae; Comment Edit light",
			"fab fa-comment-edit": "&#xf4ae; Comment Edit duotone",
			"fas fa-comment-dots": "&#xf4ad; Comment Dots solid",
			"far fa-comment-dots": "&#xf4ad; Comment Dots regular",
			"fal fa-comment-dots": "&#xf4ad; Comment Dots light",
			"fab fa-comment-dots": "&#xf4ad; Comment Dots duotone",
			"fas fa-comment-dollar": "&#xf651; Comment Dollar solid",
			"far fa-comment-dollar": "&#xf651; Comment Dollar regular",
			"fal fa-comment-dollar": "&#xf651; Comment Dollar light",
			"fab fa-comment-dollar": "&#xf651; Comment Dollar duotone",
			"fas fa-comment-check": "&#xf4ac; Comment Check solid",
			"far fa-comment-check": "&#xf4ac; Comment Check regular",
			"fal fa-comment-check": "&#xf4ac; Comment Check light",
			"fab fa-comment-check": "&#xf4ac; Comment Check duotone",
			"fas fa-comment-alt-times": "&#xf4ab; Alternate Comment Times solid",
			"far fa-comment-alt-times": "&#xf4ab; Alternate Comment Times regular",
			"fal fa-comment-alt-times": "&#xf4ab; Alternate Comment Times light",
			"fab fa-comment-alt-times": "&#xf4ab; Alternate Comment Times duotone",
			"fas fa-comment-alt-smile": "&#xf4aa; Alternate Comment Smile solid",
			"far fa-comment-alt-smile": "&#xf4aa; Alternate Comment Smile regular",
			"fal fa-comment-alt-smile": "&#xf4aa; Alternate Comment Smile light",
			"fab fa-comment-alt-smile": "&#xf4aa; Alternate Comment Smile duotone",
			"fas fa-comment-alt-slash": "&#xf4a9; Alternate Comment Slash solid",
			"far fa-comment-alt-slash": "&#xf4a9; Alternate Comment Slash regular",
			"fal fa-comment-alt-slash": "&#xf4a9; Alternate Comment Slash light",
			"fab fa-comment-alt-slash": "&#xf4a9; Alternate Comment Slash duotone",
			"fas fa-comment-alt-plus": "&#xf4a8; Alternate Comment Plus solid",
			"far fa-comment-alt-plus": "&#xf4a8; Alternate Comment Plus regular",
			"fal fa-comment-alt-plus": "&#xf4a8; Alternate Comment Plus light",
			"fab fa-comment-alt-plus": "&#xf4a8; Alternate Comment Plus duotone",
			"fas fa-comment-alt-music": "&#xf8af; Alternate Comment Music solid",
			"far fa-comment-alt-music": "&#xf8af; Alternate Comment Music regular",
			"fal fa-comment-alt-music": "&#xf8af; Alternate Comment Music light",
			"fab fa-comment-alt-music": "&#xf8af; Alternate Comment Music duotone",
			"fas fa-comment-alt-minus": "&#xf4a7; Alternate Comment Minus solid",
			"far fa-comment-alt-minus": "&#xf4a7; Alternate Comment Minus regular",
			"fal fa-comment-alt-minus": "&#xf4a7; Alternate Comment Minus light",
			"fab fa-comment-alt-minus": "&#xf4a7; Alternate Comment Minus duotone",
			"fas fa-comment-alt-medical": "&#xf7f4; Medical Chat solid",
			"far fa-comment-alt-medical": "&#xf7f4; Medical Chat regular",
			"fal fa-comment-alt-medical": "&#xf7f4; Medical Chat light",
			"fab fa-comment-alt-medical": "&#xf7f4; Medical Chat duotone",
			"fas fa-comment-alt-lines": "&#xf4a6; Alternate Comment Lines solid",
			"far fa-comment-alt-lines": "&#xf4a6; Alternate Comment Lines regular",
			"fal fa-comment-alt-lines": "&#xf4a6; Alternate Comment Lines light",
			"fab fa-comment-alt-lines": "&#xf4a6; Alternate Comment Lines duotone",
			"fas fa-comment-alt-exclamation": "&#xf4a5; Alternate Comment Exclamation solid",
			"far fa-comment-alt-exclamation": "&#xf4a5; Alternate Comment Exclamation regular",
			"fal fa-comment-alt-exclamation": "&#xf4a5; Alternate Comment Exclamation light",
			"fab fa-comment-alt-exclamation": "&#xf4a5; Alternate Comment Exclamation duotone",
			"fas fa-comment-alt-edit": "&#xf4a4; Alternate Comment Edit solid",
			"far fa-comment-alt-edit": "&#xf4a4; Alternate Comment Edit regular",
			"fal fa-comment-alt-edit": "&#xf4a4; Alternate Comment Edit light",
			"fab fa-comment-alt-edit": "&#xf4a4; Alternate Comment Edit duotone",
			"fas fa-comment-alt-dots": "&#xf4a3; Alternate Comment Dots solid",
			"far fa-comment-alt-dots": "&#xf4a3; Alternate Comment Dots regular",
			"fal fa-comment-alt-dots": "&#xf4a3; Alternate Comment Dots light",
			"fab fa-comment-alt-dots": "&#xf4a3; Alternate Comment Dots duotone",
			"fas fa-comment-alt-dollar": "&#xf650; Comment Alt-dollar solid",
			"far fa-comment-alt-dollar": "&#xf650; Comment Alt-dollar regular",
			"fal fa-comment-alt-dollar": "&#xf650; Comment Alt-dollar light",
			"fab fa-comment-alt-dollar": "&#xf650; Comment Alt-dollar duotone",
			"fas fa-comment-alt-check": "&#xf4a2; Alternate Comment Check solid",
			"far fa-comment-alt-check": "&#xf4a2; Alternate Comment Check regular",
			"fal fa-comment-alt-check": "&#xf4a2; Alternate Comment Check light",
			"fab fa-comment-alt-check": "&#xf4a2; Alternate Comment Check duotone",
			"fas fa-comment-alt": "&#xf27a; Alternate Comment solid",
			"far fa-comment-alt": "&#xf27a; Alternate Comment regular",
			"fal fa-comment-alt": "&#xf27a; Alternate Comment light",
			"fab fa-comment-alt": "&#xf27a; Alternate Comment duotone",
			"fas fa-comment": "&#xf075; comment solid",
			"far fa-comment": "&#xf075; comment regular",
			"fal fa-comment": "&#xf075; comment light",
			"fab fa-comment": "&#xf075; comment duotone",
			"fas fa-columns": "&#xf0db; Columns solid",
			"far fa-columns": "&#xf0db; Columns regular",
			"fal fa-columns": "&#xf0db; Columns light",
			"fab fa-columns": "&#xf0db; Columns duotone",
			"fas fa-coins": "&#xf51e; Coins solid",
			"far fa-coins": "&#xf51e; Coins regular",
			"fal fa-coins": "&#xf51e; Coins light",
			"fab fa-coins": "&#xf51e; Coins duotone",
			"fas fa-coin": "&#xf85c; Coin solid",
			"far fa-coin": "&#xf85c; Coin regular",
			"fal fa-coin": "&#xf85c; Coin light",
			"fab fa-coin": "&#xf85c; Coin duotone",
			"fas fa-cogs": "&#xf085; cogs solid",
			"far fa-cogs": "&#xf085; cogs regular",
			"fal fa-cogs": "&#xf085; cogs light",
			"fab fa-cogs": "&#xf085; cogs duotone",
			"fas fa-cog": "&#xf013; cog solid",
			"far fa-cog": "&#xf013; cog regular",
			"fal fa-cog": "&#xf013; cog light",
			"fab fa-cog": "&#xf013; cog duotone",
			"fas fa-coffin": "&#xf6c6; Coffin solid",
			"far fa-coffin": "&#xf6c6; Coffin regular",
			"fal fa-coffin": "&#xf6c6; Coffin light",
			"fab fa-coffin": "&#xf6c6; Coffin duotone",
			"fas fa-coffee-togo": "&#xf6c5; To-Go Coffee solid",
			"far fa-coffee-togo": "&#xf6c5; To-Go Coffee regular",
			"fal fa-coffee-togo": "&#xf6c5; To-Go Coffee light",
			"fab fa-coffee-togo": "&#xf6c5; To-Go Coffee duotone",
			"fas fa-coffee": "&#xf0f4; Coffee solid",
			"far fa-coffee": "&#xf0f4; Coffee regular",
			"fal fa-coffee": "&#xf0f4; Coffee light",
			"fab fa-coffee": "&#xf0f4; Coffee duotone",
			"fab fa-codiepie": "&#xf284; Codie Pie brands",
			"fab fa-codepen": "&#xf1cb; Codepen brands",
			"fas fa-code-merge": "&#xf387; Code Merge solid",
			"far fa-code-merge": "&#xf387; Code Merge regular",
			"fal fa-code-merge": "&#xf387; Code Merge light",
			"fab fa-code-merge": "&#xf387; Code Merge duotone",
			"fas fa-code-commit": "&#xf386; Code Commit solid",
			"far fa-code-commit": "&#xf386; Code Commit regular",
			"fal fa-code-commit": "&#xf386; Code Commit light",
			"fab fa-code-commit": "&#xf386; Code Commit duotone",
			"fas fa-code-branch": "&#xf126; Code Branch solid",
			"far fa-code-branch": "&#xf126; Code Branch regular",
			"fal fa-code-branch": "&#xf126; Code Branch light",
			"fab fa-code-branch": "&#xf126; Code Branch duotone",
			"fas fa-code": "&#xf121; Code solid",
			"far fa-code": "&#xf121; Code regular",
			"fal fa-code": "&#xf121; Code light",
			"fab fa-code": "&#xf121; Code duotone",
			"fas fa-cocktail": "&#xf561; Cocktail solid",
			"far fa-cocktail": "&#xf561; Cocktail regular",
			"fal fa-cocktail": "&#xf561; Cocktail light",
			"fab fa-cocktail": "&#xf561; Cocktail duotone",
			"fas fa-club": "&#xf327; Club solid",
			"far fa-club": "&#xf327; Club regular",
			"fal fa-club": "&#xf327; Club light",
			"fab fa-club": "&#xf327; Club duotone",
			"fab fa-cloudversify": "&#xf385; cloudversify brands",
			"fab fa-cloudsmith": "&#xf384; Cloudsmith brands",
			"fab fa-cloudscale": "&#xf383; cloudscale.ch brands",
			"fas fa-clouds-sun": "&#xf746; Clouds with Sun solid",
			"far fa-clouds-sun": "&#xf746; Clouds with Sun regular",
			"fal fa-clouds-sun": "&#xf746; Clouds with Sun light",
			"fab fa-clouds-sun": "&#xf746; Clouds with Sun duotone",
			"fas fa-clouds-moon": "&#xf745; Clouds with Moon solid",
			"far fa-clouds-moon": "&#xf745; Clouds with Moon regular",
			"fal fa-clouds-moon": "&#xf745; Clouds with Moon light",
			"fab fa-clouds-moon": "&#xf745; Clouds with Moon duotone",
			"fas fa-clouds": "&#xf744; Clouds solid",
			"far fa-clouds": "&#xf744; Clouds regular",
			"fal fa-clouds": "&#xf744; Clouds light",
			"fab fa-clouds": "&#xf744; Clouds duotone",
			"fas fa-cloud-upload-alt": "&#xf382; Alternate Cloud Upload solid",
			"far fa-cloud-upload-alt": "&#xf382; Alternate Cloud Upload regular",
			"fal fa-cloud-upload-alt": "&#xf382; Alternate Cloud Upload light",
			"fab fa-cloud-upload-alt": "&#xf382; Alternate Cloud Upload duotone",
			"fas fa-cloud-upload": "&#xf0ee; Cloud Upload solid",
			"far fa-cloud-upload": "&#xf0ee; Cloud Upload regular",
			"fal fa-cloud-upload": "&#xf0ee; Cloud Upload light",
			"fab fa-cloud-upload": "&#xf0ee; Cloud Upload duotone",
			"fas fa-cloud-sun-rain": "&#xf743; Cloud with Sun and Rain solid",
			"far fa-cloud-sun-rain": "&#xf743; Cloud with Sun and Rain regular",
			"fal fa-cloud-sun-rain": "&#xf743; Cloud with Sun and Rain light",
			"fab fa-cloud-sun-rain": "&#xf743; Cloud with Sun and Rain duotone",
			"fas fa-cloud-sun": "&#xf6c4; Cloud with Sun solid",
			"far fa-cloud-sun": "&#xf6c4; Cloud with Sun regular",
			"fal fa-cloud-sun": "&#xf6c4; Cloud with Sun light",
			"fab fa-cloud-sun": "&#xf6c4; Cloud with Sun duotone",
			"fas fa-cloud-snow": "&#xf742; Cloud with Snow solid",
			"far fa-cloud-snow": "&#xf742; Cloud with Snow regular",
			"fal fa-cloud-snow": "&#xf742; Cloud with Snow light",
			"fab fa-cloud-snow": "&#xf742; Cloud with Snow duotone",
			"fas fa-cloud-sleet": "&#xf741; Cloud with Sleet solid",
			"far fa-cloud-sleet": "&#xf741; Cloud with Sleet regular",
			"fal fa-cloud-sleet": "&#xf741; Cloud with Sleet light",
			"fab fa-cloud-sleet": "&#xf741; Cloud with Sleet duotone",
			"fas fa-cloud-showers-heavy": "&#xf740; Cloud with Heavy Showers solid",
			"far fa-cloud-showers-heavy": "&#xf740; Cloud with Heavy Showers regular",
			"fal fa-cloud-showers-heavy": "&#xf740; Cloud with Heavy Showers light",
			"fab fa-cloud-showers-heavy": "&#xf740; Cloud with Heavy Showers duotone",
			"fas fa-cloud-showers": "&#xf73f; Cloud with Showers solid",
			"far fa-cloud-showers": "&#xf73f; Cloud with Showers regular",
			"fal fa-cloud-showers": "&#xf73f; Cloud with Showers light",
			"fab fa-cloud-showers": "&#xf73f; Cloud with Showers duotone",
			"fas fa-cloud-rainbow": "&#xf73e; Cloud with Rainbow solid",
			"far fa-cloud-rainbow": "&#xf73e; Cloud with Rainbow regular",
			"fal fa-cloud-rainbow": "&#xf73e; Cloud with Rainbow light",
			"fab fa-cloud-rainbow": "&#xf73e; Cloud with Rainbow duotone",
			"fas fa-cloud-rain": "&#xf73d; Cloud with Rain solid",
			"far fa-cloud-rain": "&#xf73d; Cloud with Rain regular",
			"fal fa-cloud-rain": "&#xf73d; Cloud with Rain light",
			"fab fa-cloud-rain": "&#xf73d; Cloud with Rain duotone",
			"fas fa-cloud-music": "&#xf8ae; Cloud Music solid",
			"far fa-cloud-music": "&#xf8ae; Cloud Music regular",
			"fal fa-cloud-music": "&#xf8ae; Cloud Music light",
			"fab fa-cloud-music": "&#xf8ae; Cloud Music duotone",
			"fas fa-cloud-moon-rain": "&#xf73c; Cloud with Moon and Rain solid",
			"far fa-cloud-moon-rain": "&#xf73c; Cloud with Moon and Rain regular",
			"fal fa-cloud-moon-rain": "&#xf73c; Cloud with Moon and Rain light",
			"fab fa-cloud-moon-rain": "&#xf73c; Cloud with Moon and Rain duotone",
			"fas fa-cloud-moon": "&#xf6c3; Cloud with Moon solid",
			"far fa-cloud-moon": "&#xf6c3; Cloud with Moon regular",
			"fal fa-cloud-moon": "&#xf6c3; Cloud with Moon light",
			"fab fa-cloud-moon": "&#xf6c3; Cloud with Moon duotone",
			"fas fa-cloud-meatball": "&#xf73b; Cloud with (a chance of) Meatball solid",
			"far fa-cloud-meatball": "&#xf73b; Cloud with (a chance of) Meatball regular",
			"fal fa-cloud-meatball": "&#xf73b; Cloud with (a chance of) Meatball light",
			"fab fa-cloud-meatball": "&#xf73b; Cloud with (a chance of) Meatball duotone",
			"fas fa-cloud-hail-mixed": "&#xf73a; Cloud with Mixed Hail solid",
			"far fa-cloud-hail-mixed": "&#xf73a; Cloud with Mixed Hail regular",
			"fal fa-cloud-hail-mixed": "&#xf73a; Cloud with Mixed Hail light",
			"fab fa-cloud-hail-mixed": "&#xf73a; Cloud with Mixed Hail duotone",
			"fas fa-cloud-hail": "&#xf739; Cloud with Hail solid",
			"far fa-cloud-hail": "&#xf739; Cloud with Hail regular",
			"fal fa-cloud-hail": "&#xf739; Cloud with Hail light",
			"fab fa-cloud-hail": "&#xf739; Cloud with Hail duotone",
			"fas fa-cloud-drizzle": "&#xf738; Cloud with Drizzle solid",
			"far fa-cloud-drizzle": "&#xf738; Cloud with Drizzle regular",
			"fal fa-cloud-drizzle": "&#xf738; Cloud with Drizzle light",
			"fab fa-cloud-drizzle": "&#xf738; Cloud with Drizzle duotone",
			"fas fa-cloud-download-alt": "&#xf381; Alternate Cloud Download solid",
			"far fa-cloud-download-alt": "&#xf381; Alternate Cloud Download regular",
			"fal fa-cloud-download-alt": "&#xf381; Alternate Cloud Download light",
			"fab fa-cloud-download-alt": "&#xf381; Alternate Cloud Download duotone",
			"fas fa-cloud-download": "&#xf0ed; Cloud Download solid",
			"far fa-cloud-download": "&#xf0ed; Cloud Download regular",
			"fal fa-cloud-download": "&#xf0ed; Cloud Download light",
			"fab fa-cloud-download": "&#xf0ed; Cloud Download duotone",
			"fas fa-cloud": "&#xf0c2; Cloud solid",
			"far fa-cloud": "&#xf0c2; Cloud regular",
			"fal fa-cloud": "&#xf0c2; Cloud light",
			"fab fa-cloud": "&#xf0c2; Cloud duotone",
			"fas fa-closed-captioning": "&#xf20a; Closed Captioning solid",
			"far fa-closed-captioning": "&#xf20a; Closed Captioning regular",
			"fal fa-closed-captioning": "&#xf20a; Closed Captioning light",
			"fab fa-closed-captioning": "&#xf20a; Closed Captioning duotone",
			"fas fa-clone": "&#xf24d; Clone solid",
			"far fa-clone": "&#xf24d; Clone regular",
			"fal fa-clone": "&#xf24d; Clone light",
			"fab fa-clone": "&#xf24d; Clone duotone",
			"fas fa-clock": "&#xf017; Clock solid",
			"far fa-clock": "&#xf017; Clock regular",
			"fal fa-clock": "&#xf017; Clock light",
			"fab fa-clock": "&#xf017; Clock duotone",
			"fas fa-clipboard-user": "&#xf7f3; Clipboard with User solid",
			"far fa-clipboard-user": "&#xf7f3; Clipboard with User regular",
			"fal fa-clipboard-user": "&#xf7f3; Clipboard with User light",
			"fab fa-clipboard-user": "&#xf7f3; Clipboard with User duotone",
			"fas fa-clipboard-prescription": "&#xf5e8; Clipboard Prescription solid",
			"far fa-clipboard-prescription": "&#xf5e8; Clipboard Prescription regular",
			"fal fa-clipboard-prescription": "&#xf5e8; Clipboard Prescription light",
			"fab fa-clipboard-prescription": "&#xf5e8; Clipboard Prescription duotone",
			"fas fa-clipboard-list-check": "&#xf737; Clipboard List with Check solid",
			"far fa-clipboard-list-check": "&#xf737; Clipboard List with Check regular",
			"fal fa-clipboard-list-check": "&#xf737; Clipboard List with Check light",
			"fab fa-clipboard-list-check": "&#xf737; Clipboard List with Check duotone",
			"fas fa-clipboard-list": "&#xf46d; Clipboard List solid",
			"far fa-clipboard-list": "&#xf46d; Clipboard List regular",
			"fal fa-clipboard-list": "&#xf46d; Clipboard List light",
			"fab fa-clipboard-list": "&#xf46d; Clipboard List duotone",
			"fas fa-clipboard-check": "&#xf46c; Clipboard with Check solid",
			"far fa-clipboard-check": "&#xf46c; Clipboard with Check regular",
			"fal fa-clipboard-check": "&#xf46c; Clipboard with Check light",
			"fab fa-clipboard-check": "&#xf46c; Clipboard with Check duotone",
			"fas fa-clipboard": "&#xf328; Clipboard solid",
			"far fa-clipboard": "&#xf328; Clipboard regular",
			"fal fa-clipboard": "&#xf328; Clipboard light",
			"fab fa-clipboard": "&#xf328; Clipboard duotone",
			"fas fa-clinic-medical": "&#xf7f2; Medical Clinic solid",
			"far fa-clinic-medical": "&#xf7f2; Medical Clinic regular",
			"fal fa-clinic-medical": "&#xf7f2; Medical Clinic light",
			"fab fa-clinic-medical": "&#xf7f2; Medical Clinic duotone",
			"fas fa-claw-marks": "&#xf6c2; Claw Marks solid",
			"far fa-claw-marks": "&#xf6c2; Claw Marks regular",
			"fal fa-claw-marks": "&#xf6c2; Claw Marks light",
			"fab fa-claw-marks": "&#xf6c2; Claw Marks duotone",
			"fas fa-clarinet": "&#xf8ad; Clarinet solid",
			"far fa-clarinet": "&#xf8ad; Clarinet regular",
			"fal fa-clarinet": "&#xf8ad; Clarinet light",
			"fab fa-clarinet": "&#xf8ad; Clarinet duotone",
			"fas fa-city": "&#xf64f; City solid",
			"far fa-city": "&#xf64f; City regular",
			"fal fa-city": "&#xf64f; City light",
			"fab fa-city": "&#xf64f; City duotone",
			"fas fa-circle-notch": "&#xf1ce; Circle Notched solid",
			"far fa-circle-notch": "&#xf1ce; Circle Notched regular",
			"fal fa-circle-notch": "&#xf1ce; Circle Notched light",
			"fab fa-circle-notch": "&#xf1ce; Circle Notched duotone",
			"fas fa-circle": "&#xf111; Circle solid",
			"far fa-circle": "&#xf111; Circle regular",
			"fal fa-circle": "&#xf111; Circle light",
			"fab fa-circle": "&#xf111; Circle duotone",
			"fas fa-church": "&#xf51d; Church solid",
			"far fa-church": "&#xf51d; Church regular",
			"fal fa-church": "&#xf51d; Church light",
			"fab fa-church": "&#xf51d; Church duotone",
			"fab fa-chromecast": "&#xf838; Chromecast brands",
			"fab fa-chrome": "&#xf268; Chrome brands",
			"fas fa-chimney": "&#xf78b; Chimney solid",
			"far fa-chimney": "&#xf78b; Chimney regular",
			"fal fa-chimney": "&#xf78b; Chimney light",
			"fab fa-chimney": "&#xf78b; Chimney duotone",
			"fas fa-child": "&#xf1ae; Child solid",
			"far fa-child": "&#xf1ae; Child regular",
			"fal fa-child": "&#xf1ae; Child light",
			"fab fa-child": "&#xf1ae; Child duotone",
			"fas fa-chevron-up": "&#xf077; chevron-up solid",
			"far fa-chevron-up": "&#xf077; chevron-up regular",
			"fal fa-chevron-up": "&#xf077; chevron-up light",
			"fab fa-chevron-up": "&#xf077; chevron-up duotone",
			"fas fa-chevron-square-up": "&#xf32c; Chevron Square Up solid",
			"far fa-chevron-square-up": "&#xf32c; Chevron Square Up regular",
			"fal fa-chevron-square-up": "&#xf32c; Chevron Square Up light",
			"fab fa-chevron-square-up": "&#xf32c; Chevron Square Up duotone",
			"fas fa-chevron-square-right": "&#xf32b; Chevron Square Right solid",
			"far fa-chevron-square-right": "&#xf32b; Chevron Square Right regular",
			"fal fa-chevron-square-right": "&#xf32b; Chevron Square Right light",
			"fab fa-chevron-square-right": "&#xf32b; Chevron Square Right duotone",
			"fas fa-chevron-square-left": "&#xf32a; Chevron Square Left solid",
			"far fa-chevron-square-left": "&#xf32a; Chevron Square Left regular",
			"fal fa-chevron-square-left": "&#xf32a; Chevron Square Left light",
			"fab fa-chevron-square-left": "&#xf32a; Chevron Square Left duotone",
			"fas fa-chevron-square-down": "&#xf329; Chevron Square Down solid",
			"far fa-chevron-square-down": "&#xf329; Chevron Square Down regular",
			"fal fa-chevron-square-down": "&#xf329; Chevron Square Down light",
			"fab fa-chevron-square-down": "&#xf329; Chevron Square Down duotone",
			"fas fa-chevron-right": "&#xf054; chevron-right solid",
			"far fa-chevron-right": "&#xf054; chevron-right regular",
			"fal fa-chevron-right": "&#xf054; chevron-right light",
			"fab fa-chevron-right": "&#xf054; chevron-right duotone",
			"fas fa-chevron-left": "&#xf053; chevron-left solid",
			"far fa-chevron-left": "&#xf053; chevron-left regular",
			"fal fa-chevron-left": "&#xf053; chevron-left light",
			"fab fa-chevron-left": "&#xf053; chevron-left duotone",
			"fas fa-chevron-down": "&#xf078; chevron-down solid",
			"far fa-chevron-down": "&#xf078; chevron-down regular",
			"fal fa-chevron-down": "&#xf078; chevron-down light",
			"fab fa-chevron-down": "&#xf078; chevron-down duotone",
			"fas fa-chevron-double-up": "&#xf325; Chevron Double Up solid",
			"far fa-chevron-double-up": "&#xf325; Chevron Double Up regular",
			"fal fa-chevron-double-up": "&#xf325; Chevron Double Up light",
			"fab fa-chevron-double-up": "&#xf325; Chevron Double Up duotone",
			"fas fa-chevron-double-right": "&#xf324; Chevron Double Right solid",
			"far fa-chevron-double-right": "&#xf324; Chevron Double Right regular",
			"fal fa-chevron-double-right": "&#xf324; Chevron Double Right light",
			"fab fa-chevron-double-right": "&#xf324; Chevron Double Right duotone",
			"fas fa-chevron-double-left": "&#xf323; Chevron Double Left solid",
			"far fa-chevron-double-left": "&#xf323; Chevron Double Left regular",
			"fal fa-chevron-double-left": "&#xf323; Chevron Double Left light",
			"fab fa-chevron-double-left": "&#xf323; Chevron Double Left duotone",
			"fas fa-chevron-double-down": "&#xf322; Chevron Double Down solid",
			"far fa-chevron-double-down": "&#xf322; Chevron Double Down regular",
			"fal fa-chevron-double-down": "&#xf322; Chevron Double Down light",
			"fab fa-chevron-double-down": "&#xf322; Chevron Double Down duotone",
			"fas fa-chevron-circle-up": "&#xf139; Chevron Circle Up solid",
			"far fa-chevron-circle-up": "&#xf139; Chevron Circle Up regular",
			"fal fa-chevron-circle-up": "&#xf139; Chevron Circle Up light",
			"fab fa-chevron-circle-up": "&#xf139; Chevron Circle Up duotone",
			"fas fa-chevron-circle-right": "&#xf138; Chevron Circle Right solid",
			"far fa-chevron-circle-right": "&#xf138; Chevron Circle Right regular",
			"fal fa-chevron-circle-right": "&#xf138; Chevron Circle Right light",
			"fab fa-chevron-circle-right": "&#xf138; Chevron Circle Right duotone",
			"fas fa-chevron-circle-left": "&#xf137; Chevron Circle Left solid",
			"far fa-chevron-circle-left": "&#xf137; Chevron Circle Left regular",
			"fal fa-chevron-circle-left": "&#xf137; Chevron Circle Left light",
			"fab fa-chevron-circle-left": "&#xf137; Chevron Circle Left duotone",
			"fas fa-chevron-circle-down": "&#xf13a; Chevron Circle Down solid",
			"far fa-chevron-circle-down": "&#xf13a; Chevron Circle Down regular",
			"fal fa-chevron-circle-down": "&#xf13a; Chevron Circle Down light",
			"fab fa-chevron-circle-down": "&#xf13a; Chevron Circle Down duotone",
			"fas fa-chess-rook-alt": "&#xf448; Alternate Chess Rook solid",
			"far fa-chess-rook-alt": "&#xf448; Alternate Chess Rook regular",
			"fal fa-chess-rook-alt": "&#xf448; Alternate Chess Rook light",
			"fab fa-chess-rook-alt": "&#xf448; Alternate Chess Rook duotone",
			"fas fa-chess-rook": "&#xf447; Chess Rook solid",
			"far fa-chess-rook": "&#xf447; Chess Rook regular",
			"fal fa-chess-rook": "&#xf447; Chess Rook light",
			"fab fa-chess-rook": "&#xf447; Chess Rook duotone",
			"fas fa-chess-queen-alt": "&#xf446; Alternate Chess Queen solid",
			"far fa-chess-queen-alt": "&#xf446; Alternate Chess Queen regular",
			"fal fa-chess-queen-alt": "&#xf446; Alternate Chess Queen light",
			"fab fa-chess-queen-alt": "&#xf446; Alternate Chess Queen duotone",
			"fas fa-chess-queen": "&#xf445; Chess Queen solid",
			"far fa-chess-queen": "&#xf445; Chess Queen regular",
			"fal fa-chess-queen": "&#xf445; Chess Queen light",
			"fab fa-chess-queen": "&#xf445; Chess Queen duotone",
			"fas fa-chess-pawn-alt": "&#xf444; Alternate Chess Pawn solid",
			"far fa-chess-pawn-alt": "&#xf444; Alternate Chess Pawn regular",
			"fal fa-chess-pawn-alt": "&#xf444; Alternate Chess Pawn light",
			"fab fa-chess-pawn-alt": "&#xf444; Alternate Chess Pawn duotone",
			"fas fa-chess-pawn": "&#xf443; Chess Pawn solid",
			"far fa-chess-pawn": "&#xf443; Chess Pawn regular",
			"fal fa-chess-pawn": "&#xf443; Chess Pawn light",
			"fab fa-chess-pawn": "&#xf443; Chess Pawn duotone",
			"fas fa-chess-knight-alt": "&#xf442; Alternate Chess Knight solid",
			"far fa-chess-knight-alt": "&#xf442; Alternate Chess Knight regular",
			"fal fa-chess-knight-alt": "&#xf442; Alternate Chess Knight light",
			"fab fa-chess-knight-alt": "&#xf442; Alternate Chess Knight duotone",
			"fas fa-chess-knight": "&#xf441; Chess Knight solid",
			"far fa-chess-knight": "&#xf441; Chess Knight regular",
			"fal fa-chess-knight": "&#xf441; Chess Knight light",
			"fab fa-chess-knight": "&#xf441; Chess Knight duotone",
			"fas fa-chess-king-alt": "&#xf440; Alternate Chess King solid",
			"far fa-chess-king-alt": "&#xf440; Alternate Chess King regular",
			"fal fa-chess-king-alt": "&#xf440; Alternate Chess King light",
			"fab fa-chess-king-alt": "&#xf440; Alternate Chess King duotone",
			"fas fa-chess-king": "&#xf43f; Chess King solid",
			"far fa-chess-king": "&#xf43f; Chess King regular",
			"fal fa-chess-king": "&#xf43f; Chess King light",
			"fab fa-chess-king": "&#xf43f; Chess King duotone",
			"fas fa-chess-clock-alt": "&#xf43e; Alternate Chess Clock solid",
			"far fa-chess-clock-alt": "&#xf43e; Alternate Chess Clock regular",
			"fal fa-chess-clock-alt": "&#xf43e; Alternate Chess Clock light",
			"fab fa-chess-clock-alt": "&#xf43e; Alternate Chess Clock duotone",
			"fas fa-chess-clock": "&#xf43d; Chess Clock solid",
			"far fa-chess-clock": "&#xf43d; Chess Clock regular",
			"fal fa-chess-clock": "&#xf43d; Chess Clock light",
			"fab fa-chess-clock": "&#xf43d; Chess Clock duotone",
			"fas fa-chess-board": "&#xf43c; Chess Board solid",
			"far fa-chess-board": "&#xf43c; Chess Board regular",
			"fal fa-chess-board": "&#xf43c; Chess Board light",
			"fab fa-chess-board": "&#xf43c; Chess Board duotone",
			"fas fa-chess-bishop-alt": "&#xf43b; Alternate Chess Bishop solid",
			"far fa-chess-bishop-alt": "&#xf43b; Alternate Chess Bishop regular",
			"fal fa-chess-bishop-alt": "&#xf43b; Alternate Chess Bishop light",
			"fab fa-chess-bishop-alt": "&#xf43b; Alternate Chess Bishop duotone",
			"fas fa-chess-bishop": "&#xf43a; Chess Bishop solid",
			"far fa-chess-bishop": "&#xf43a; Chess Bishop regular",
			"fal fa-chess-bishop": "&#xf43a; Chess Bishop light",
			"fab fa-chess-bishop": "&#xf43a; Chess Bishop duotone",
			"fas fa-chess": "&#xf439; Chess solid",
			"far fa-chess": "&#xf439; Chess regular",
			"fal fa-chess": "&#xf439; Chess light",
			"fab fa-chess": "&#xf439; Chess duotone",
			"fas fa-cheeseburger": "&#xf7f1; Cheeseburger solid",
			"far fa-cheeseburger": "&#xf7f1; Cheeseburger regular",
			"fal fa-cheeseburger": "&#xf7f1; Cheeseburger light",
			"fab fa-cheeseburger": "&#xf7f1; Cheeseburger duotone",
			"fas fa-cheese-swiss": "&#xf7f0; Swiss Cheese solid",
			"far fa-cheese-swiss": "&#xf7f0; Swiss Cheese regular",
			"fal fa-cheese-swiss": "&#xf7f0; Swiss Cheese light",
			"fab fa-cheese-swiss": "&#xf7f0; Swiss Cheese duotone",
			"fas fa-cheese": "&#xf7ef; Cheese solid",
			"far fa-cheese": "&#xf7ef; Cheese regular",
			"fal fa-cheese": "&#xf7ef; Cheese light",
			"fab fa-cheese": "&#xf7ef; Cheese duotone",
			"fas fa-check-square": "&#xf14a; Check Square solid",
			"far fa-check-square": "&#xf14a; Check Square regular",
			"fal fa-check-square": "&#xf14a; Check Square light",
			"fab fa-check-square": "&#xf14a; Check Square duotone",
			"fas fa-check-double": "&#xf560; Double Check solid",
			"far fa-check-double": "&#xf560; Double Check regular",
			"fal fa-check-double": "&#xf560; Double Check light",
			"fab fa-check-double": "&#xf560; Double Check duotone",
			"fas fa-check-circle": "&#xf058; Check Circle solid",
			"far fa-check-circle": "&#xf058; Check Circle regular",
			"fal fa-check-circle": "&#xf058; Check Circle light",
			"fab fa-check-circle": "&#xf058; Check Circle duotone",
			"fas fa-check": "&#xf00c; Check solid",
			"far fa-check": "&#xf00c; Check regular",
			"fal fa-check": "&#xf00c; Check light",
			"fab fa-check": "&#xf00c; Check duotone",
			"fas fa-chart-scatter": "&#xf7ee; Scatter Chart solid",
			"far fa-chart-scatter": "&#xf7ee; Scatter Chart regular",
			"fal fa-chart-scatter": "&#xf7ee; Scatter Chart light",
			"fab fa-chart-scatter": "&#xf7ee; Scatter Chart duotone",
			"fas fa-chart-pie-alt": "&#xf64e; Alternate Pie Chart solid",
			"far fa-chart-pie-alt": "&#xf64e; Alternate Pie Chart regular",
			"fal fa-chart-pie-alt": "&#xf64e; Alternate Pie Chart light",
			"fab fa-chart-pie-alt": "&#xf64e; Alternate Pie Chart duotone",
			"fas fa-chart-pie": "&#xf200; Pie Chart solid",
			"far fa-chart-pie": "&#xf200; Pie Chart regular",
			"fal fa-chart-pie": "&#xf200; Pie Chart light",
			"fab fa-chart-pie": "&#xf200; Pie Chart duotone",
			"fas fa-chart-network": "&#xf78a; Network Chart solid",
			"far fa-chart-network": "&#xf78a; Network Chart regular",
			"fal fa-chart-network": "&#xf78a; Network Chart light",
			"fab fa-chart-network": "&#xf78a; Network Chart duotone",
			"fas fa-chart-line-down": "&#xf64d; Line Chart in Down Direction solid",
			"far fa-chart-line-down": "&#xf64d; Line Chart in Down Direction regular",
			"fal fa-chart-line-down": "&#xf64d; Line Chart in Down Direction light",
			"fab fa-chart-line-down": "&#xf64d; Line Chart in Down Direction duotone",
			"fas fa-chart-line": "&#xf201; Line Chart solid",
			"far fa-chart-line": "&#xf201; Line Chart regular",
			"fal fa-chart-line": "&#xf201; Line Chart light",
			"fab fa-chart-line": "&#xf201; Line Chart duotone",
			"fas fa-chart-bar": "&#xf080; Bar Chart solid",
			"far fa-chart-bar": "&#xf080; Bar Chart regular",
			"fal fa-chart-bar": "&#xf080; Bar Chart light",
			"fab fa-chart-bar": "&#xf080; Bar Chart duotone",
			"fas fa-chart-area": "&#xf1fe; Area Chart solid",
			"far fa-chart-area": "&#xf1fe; Area Chart regular",
			"fal fa-chart-area": "&#xf1fe; Area Chart light",
			"fab fa-chart-area": "&#xf1fe; Area Chart duotone",
			"fas fa-charging-station": "&#xf5e7; Charging Station solid",
			"far fa-charging-station": "&#xf5e7; Charging Station regular",
			"fal fa-charging-station": "&#xf5e7; Charging Station light",
			"fab fa-charging-station": "&#xf5e7; Charging Station duotone",
			"fas fa-chalkboard-teacher": "&#xf51c; Chalkboard Teacher solid",
			"far fa-chalkboard-teacher": "&#xf51c; Chalkboard Teacher regular",
			"fal fa-chalkboard-teacher": "&#xf51c; Chalkboard Teacher light",
			"fab fa-chalkboard-teacher": "&#xf51c; Chalkboard Teacher duotone",
			"fas fa-chalkboard": "&#xf51b; Chalkboard solid",
			"far fa-chalkboard": "&#xf51b; Chalkboard regular",
			"fal fa-chalkboard": "&#xf51b; Chalkboard light",
			"fab fa-chalkboard": "&#xf51b; Chalkboard duotone",
			"fas fa-chair-office": "&#xf6c1; Office Chair solid",
			"far fa-chair-office": "&#xf6c1; Office Chair regular",
			"fal fa-chair-office": "&#xf6c1; Office Chair light",
			"fab fa-chair-office": "&#xf6c1; Office Chair duotone",
			"fas fa-chair": "&#xf6c0; Chair solid",
			"far fa-chair": "&#xf6c0; Chair regular",
			"fal fa-chair": "&#xf6c0; Chair light",
			"fab fa-chair": "&#xf6c0; Chair duotone",
			"fas fa-certificate": "&#xf0a3; certificate solid",
			"far fa-certificate": "&#xf0a3; certificate regular",
			"fal fa-certificate": "&#xf0a3; certificate light",
			"fab fa-certificate": "&#xf0a3; certificate duotone",
			"fab fa-centos": "&#xf789; Centos brands",
			"fab fa-centercode": "&#xf380; Centercode brands",
			"fas fa-cctv": "&#xf8ac; CCTV solid",
			"far fa-cctv": "&#xf8ac; CCTV regular",
			"fal fa-cctv": "&#xf8ac; CCTV light",
			"fab fa-cctv": "&#xf8ac; CCTV duotone",
			"fab fa-cc-visa": "&#xf1f0; Visa Credit Card brands",
			"fab fa-cc-stripe": "&#xf1f5; Stripe Credit Card brands",
			"fab fa-cc-paypal": "&#xf1f4; Paypal Credit Card brands",
			"fab fa-cc-mastercard": "&#xf1f1; MasterCard Credit Card brands",
			"fab fa-cc-jcb": "&#xf24b; JCB Credit Card brands",
			"fab fa-cc-discover": "&#xf1f2; Discover Credit Card brands",
			"fab fa-cc-diners-club": "&#xf24c; Diner's Club Credit Card brands",
			"fab fa-cc-apple-pay": "&#xf416; Apple Pay Credit Card brands",
			"fab fa-cc-amex": "&#xf1f3; American Express Credit Card brands",
			"fab fa-cc-amazon-pay": "&#xf42d; Amazon Pay Credit Card brands",
			"fas fa-cauldron": "&#xf6bf; Cauldron solid",
			"far fa-cauldron": "&#xf6bf; Cauldron regular",
			"fal fa-cauldron": "&#xf6bf; Cauldron light",
			"fab fa-cauldron": "&#xf6bf; Cauldron duotone",
			"fas fa-cat": "&#xf6be; Cat solid",
			"far fa-cat": "&#xf6be; Cat regular",
			"fal fa-cat": "&#xf6be; Cat light",
			"fab fa-cat": "&#xf6be; Cat duotone",
			"fas fa-cassette-tape": "&#xf8ab; Cassette Tape solid",
			"far fa-cassette-tape": "&#xf8ab; Cassette Tape regular",
			"fal fa-cassette-tape": "&#xf8ab; Cassette Tape light",
			"fab fa-cassette-tape": "&#xf8ab; Cassette Tape duotone",
			"fas fa-cash-register": "&#xf788; Cash Register solid",
			"far fa-cash-register": "&#xf788; Cash Register regular",
			"fal fa-cash-register": "&#xf788; Cash Register light",
			"fab fa-cash-register": "&#xf788; Cash Register duotone",
			"fas fa-cart-plus": "&#xf217; Add to Shopping Cart solid",
			"far fa-cart-plus": "&#xf217; Add to Shopping Cart regular",
			"fal fa-cart-plus": "&#xf217; Add to Shopping Cart light",
			"fab fa-cart-plus": "&#xf217; Add to Shopping Cart duotone",
			"fas fa-cart-arrow-down": "&#xf218; Shopping Cart Arrow Down solid",
			"far fa-cart-arrow-down": "&#xf218; Shopping Cart Arrow Down regular",
			"fal fa-cart-arrow-down": "&#xf218; Shopping Cart Arrow Down light",
			"fab fa-cart-arrow-down": "&#xf218; Shopping Cart Arrow Down duotone",
			"fas fa-cars": "&#xf85b; Cars solid",
			"far fa-cars": "&#xf85b; Cars regular",
			"fal fa-cars": "&#xf85b; Cars light",
			"fab fa-cars": "&#xf85b; Cars duotone",
			"fas fa-carrot": "&#xf787; Carrot solid",
			"far fa-carrot": "&#xf787; Carrot regular",
			"fal fa-carrot": "&#xf787; Carrot light",
			"fab fa-carrot": "&#xf787; Carrot duotone",
			"fas fa-caret-up": "&#xf0d8; Caret Up solid",
			"far fa-caret-up": "&#xf0d8; Caret Up regular",
			"fal fa-caret-up": "&#xf0d8; Caret Up light",
			"fab fa-caret-up": "&#xf0d8; Caret Up duotone",
			"fas fa-caret-square-up": "&#xf151; Caret Square Up solid",
			"far fa-caret-square-up": "&#xf151; Caret Square Up regular",
			"fal fa-caret-square-up": "&#xf151; Caret Square Up light",
			"fab fa-caret-square-up": "&#xf151; Caret Square Up duotone",
			"fas fa-caret-square-right": "&#xf152; Caret Square Right solid",
			"far fa-caret-square-right": "&#xf152; Caret Square Right regular",
			"fal fa-caret-square-right": "&#xf152; Caret Square Right light",
			"fab fa-caret-square-right": "&#xf152; Caret Square Right duotone",
			"fas fa-caret-square-left": "&#xf191; Caret Square Left solid",
			"far fa-caret-square-left": "&#xf191; Caret Square Left regular",
			"fal fa-caret-square-left": "&#xf191; Caret Square Left light",
			"fab fa-caret-square-left": "&#xf191; Caret Square Left duotone",
			"fas fa-caret-square-down": "&#xf150; Caret Square Down solid",
			"far fa-caret-square-down": "&#xf150; Caret Square Down regular",
			"fal fa-caret-square-down": "&#xf150; Caret Square Down light",
			"fab fa-caret-square-down": "&#xf150; Caret Square Down duotone",
			"fas fa-caret-right": "&#xf0da; Caret Right solid",
			"far fa-caret-right": "&#xf0da; Caret Right regular",
			"fal fa-caret-right": "&#xf0da; Caret Right light",
			"fab fa-caret-right": "&#xf0da; Caret Right duotone",
			"fas fa-caret-left": "&#xf0d9; Caret Left solid",
			"far fa-caret-left": "&#xf0d9; Caret Left regular",
			"fal fa-caret-left": "&#xf0d9; Caret Left light",
			"fab fa-caret-left": "&#xf0d9; Caret Left duotone",
			"fas fa-caret-down": "&#xf0d7; Caret Down solid",
			"far fa-caret-down": "&#xf0d7; Caret Down regular",
			"fal fa-caret-down": "&#xf0d7; Caret Down light",
			"fab fa-caret-down": "&#xf0d7; Caret Down duotone",
			"fas fa-caret-circle-up": "&#xf331; Caret Circle Up solid",
			"far fa-caret-circle-up": "&#xf331; Caret Circle Up regular",
			"fal fa-caret-circle-up": "&#xf331; Caret Circle Up light",
			"fab fa-caret-circle-up": "&#xf331; Caret Circle Up duotone",
			"fas fa-caret-circle-right": "&#xf330; Caret Circle Right solid",
			"far fa-caret-circle-right": "&#xf330; Caret Circle Right regular",
			"fal fa-caret-circle-right": "&#xf330; Caret Circle Right light",
			"fab fa-caret-circle-right": "&#xf330; Caret Circle Right duotone",
			"fas fa-caret-circle-left": "&#xf32e; Caret Circle Left solid",
			"far fa-caret-circle-left": "&#xf32e; Caret Circle Left regular",
			"fal fa-caret-circle-left": "&#xf32e; Caret Circle Left light",
			"fab fa-caret-circle-left": "&#xf32e; Caret Circle Left duotone",
			"fas fa-caret-circle-down": "&#xf32d; Caret Circle Down solid",
			"far fa-caret-circle-down": "&#xf32d; Caret Circle Down regular",
			"fal fa-caret-circle-down": "&#xf32d; Caret Circle Down light",
			"fab fa-caret-circle-down": "&#xf32d; Caret Circle Down duotone",
			"fas fa-car-wash": "&#xf5e6; Car Wash solid",
			"far fa-car-wash": "&#xf5e6; Car Wash regular",
			"fal fa-car-wash": "&#xf5e6; Car Wash light",
			"fab fa-car-wash": "&#xf5e6; Car Wash duotone",
			"fas fa-car-tilt": "&#xf5e5; Car Tilt solid",
			"far fa-car-tilt": "&#xf5e5; Car Tilt regular",
			"fal fa-car-tilt": "&#xf5e5; Car Tilt light",
			"fab fa-car-tilt": "&#xf5e5; Car Tilt duotone",
			"fas fa-car-side": "&#xf5e4; Car Side solid",
			"far fa-car-side": "&#xf5e4; Car Side regular",
			"fal fa-car-side": "&#xf5e4; Car Side light",
			"fab fa-car-side": "&#xf5e4; Car Side duotone",
			"fas fa-car-mechanic": "&#xf5e3; Car Mechanic solid",
			"far fa-car-mechanic": "&#xf5e3; Car Mechanic regular",
			"fal fa-car-mechanic": "&#xf5e3; Car Mechanic light",
			"fab fa-car-mechanic": "&#xf5e3; Car Mechanic duotone",
			"fas fa-car-garage": "&#xf5e2; Car Garage solid",
			"far fa-car-garage": "&#xf5e2; Car Garage regular",
			"fal fa-car-garage": "&#xf5e2; Car Garage light",
			"fab fa-car-garage": "&#xf5e2; Car Garage duotone",
			"fas fa-car-crash": "&#xf5e1; Car Crash solid",
			"far fa-car-crash": "&#xf5e1; Car Crash regular",
			"fal fa-car-crash": "&#xf5e1; Car Crash light",
			"fab fa-car-crash": "&#xf5e1; Car Crash duotone",
			"fas fa-car-bus": "&#xf85a; Car and Bus solid",
			"far fa-car-bus": "&#xf85a; Car and Bus regular",
			"fal fa-car-bus": "&#xf85a; Car and Bus light",
			"fab fa-car-bus": "&#xf85a; Car and Bus duotone",
			"fas fa-car-bump": "&#xf5e0; Car Bump solid",
			"far fa-car-bump": "&#xf5e0; Car Bump regular",
			"fal fa-car-bump": "&#xf5e0; Car Bump light",
			"fab fa-car-bump": "&#xf5e0; Car Bump duotone",
			"fas fa-car-building": "&#xf859; Car and Building solid",
			"far fa-car-building": "&#xf859; Car and Building regular",
			"fal fa-car-building": "&#xf859; Car and Building light",
			"fab fa-car-building": "&#xf859; Car and Building duotone",
			"fas fa-car-battery": "&#xf5df; Car Battery solid",
			"far fa-car-battery": "&#xf5df; Car Battery regular",
			"fal fa-car-battery": "&#xf5df; Car Battery light",
			"fab fa-car-battery": "&#xf5df; Car Battery duotone",
			"fas fa-car-alt": "&#xf5de; Alternate Car solid",
			"far fa-car-alt": "&#xf5de; Alternate Car regular",
			"fal fa-car-alt": "&#xf5de; Alternate Car light",
			"fab fa-car-alt": "&#xf5de; Alternate Car duotone",
			"fas fa-car": "&#xf1b9; Car solid",
			"far fa-car": "&#xf1b9; Car regular",
			"fal fa-car": "&#xf1b9; Car light",
			"fab fa-car": "&#xf1b9; Car duotone",
			"fas fa-capsules": "&#xf46b; Capsules solid",
			"far fa-capsules": "&#xf46b; Capsules regular",
			"fal fa-capsules": "&#xf46b; Capsules light",
			"fab fa-capsules": "&#xf46b; Capsules duotone",
			"fas fa-cannabis": "&#xf55f; Cannabis solid",
			"far fa-cannabis": "&#xf55f; Cannabis regular",
			"fal fa-cannabis": "&#xf55f; Cannabis light",
			"fab fa-cannabis": "&#xf55f; Cannabis duotone",
			"fas fa-candy-corn": "&#xf6bd; Candy Corn solid",
			"far fa-candy-corn": "&#xf6bd; Candy Corn regular",
			"fal fa-candy-corn": "&#xf6bd; Candy Corn light",
			"fab fa-candy-corn": "&#xf6bd; Candy Corn duotone",
			"fas fa-candy-cane": "&#xf786; Candy Cane solid",
			"far fa-candy-cane": "&#xf786; Candy Cane regular",
			"fal fa-candy-cane": "&#xf786; Candy Cane light",
			"fab fa-candy-cane": "&#xf786; Candy Cane duotone",
			"fas fa-candle-holder": "&#xf6bc; Candle Holder solid",
			"far fa-candle-holder": "&#xf6bc; Candle Holder regular",
			"fal fa-candle-holder": "&#xf6bc; Candle Holder light",
			"fab fa-candle-holder": "&#xf6bc; Candle Holder duotone",
			"fab fa-canadian-maple-leaf": "&#xf785; Canadian Maple Leaf brands",
			"fas fa-campground": "&#xf6bb; Campground solid",
			"far fa-campground": "&#xf6bb; Campground regular",
			"fal fa-campground": "&#xf6bb; Campground light",
			"fab fa-campground": "&#xf6bb; Campground duotone",
			"fas fa-campfire": "&#xf6ba; Campfire solid",
			"far fa-campfire": "&#xf6ba; Campfire regular",
			"fal fa-campfire": "&#xf6ba; Campfire light",
			"fab fa-campfire": "&#xf6ba; Campfire duotone",
			"fas fa-camera-retro": "&#xf083; Retro Camera solid",
			"far fa-camera-retro": "&#xf083; Retro Camera regular",
			"fal fa-camera-retro": "&#xf083; Retro Camera light",
			"fab fa-camera-retro": "&#xf083; Retro Camera duotone",
			"fas fa-camera-polaroid": "&#xf8aa; Polaroid Camera solid",
			"far fa-camera-polaroid": "&#xf8aa; Polaroid Camera regular",
			"fal fa-camera-polaroid": "&#xf8aa; Polaroid Camera light",
			"fab fa-camera-polaroid": "&#xf8aa; Polaroid Camera duotone",
			"fas fa-camera-movie": "&#xf8a9; Movie Camera solid",
			"far fa-camera-movie": "&#xf8a9; Movie Camera regular",
			"fal fa-camera-movie": "&#xf8a9; Movie Camera light",
			"fab fa-camera-movie": "&#xf8a9; Movie Camera duotone",
			"fas fa-camera-alt": "&#xf332; Alternate Camera solid",
			"far fa-camera-alt": "&#xf332; Alternate Camera regular",
			"fal fa-camera-alt": "&#xf332; Alternate Camera light",
			"fab fa-camera-alt": "&#xf332; Alternate Camera duotone",
			"fas fa-camera": "&#xf030; camera solid",
			"far fa-camera": "&#xf030; camera regular",
			"fal fa-camera": "&#xf030; camera light",
			"fab fa-camera": "&#xf030; camera duotone",
			"fas fa-camcorder": "&#xf8a8; Camcorder solid",
			"far fa-camcorder": "&#xf8a8; Camcorder regular",
			"fal fa-camcorder": "&#xf8a8; Camcorder light",
			"fab fa-camcorder": "&#xf8a8; Camcorder duotone",
			"fas fa-calendar-week": "&#xf784; Calendar with Week Focus solid",
			"far fa-calendar-week": "&#xf784; Calendar with Week Focus regular",
			"fal fa-calendar-week": "&#xf784; Calendar with Week Focus light",
			"fab fa-calendar-week": "&#xf784; Calendar with Week Focus duotone",
			"fas fa-calendar-times": "&#xf273; Calendar Times solid",
			"far fa-calendar-times": "&#xf273; Calendar Times regular",
			"fal fa-calendar-times": "&#xf273; Calendar Times light",
			"fab fa-calendar-times": "&#xf273; Calendar Times duotone",
			"fas fa-calendar-star": "&#xf736; Calendar Star solid",
			"far fa-calendar-star": "&#xf736; Calendar Star regular",
			"fal fa-calendar-star": "&#xf736; Calendar Star light",
			"fab fa-calendar-star": "&#xf736; Calendar Star duotone",
			"fas fa-calendar-plus": "&#xf271; Calendar Plus solid",
			"far fa-calendar-plus": "&#xf271; Calendar Plus regular",
			"fal fa-calendar-plus": "&#xf271; Calendar Plus light",
			"fab fa-calendar-plus": "&#xf271; Calendar Plus duotone",
			"fas fa-calendar-minus": "&#xf272; Calendar Minus solid",
			"far fa-calendar-minus": "&#xf272; Calendar Minus regular",
			"fal fa-calendar-minus": "&#xf272; Calendar Minus light",
			"fab fa-calendar-minus": "&#xf272; Calendar Minus duotone",
			"fas fa-calendar-exclamation": "&#xf334; Calendar Exclamation solid",
			"far fa-calendar-exclamation": "&#xf334; Calendar Exclamation regular",
			"fal fa-calendar-exclamation": "&#xf334; Calendar Exclamation light",
			"fab fa-calendar-exclamation": "&#xf334; Calendar Exclamation duotone",
			"fas fa-calendar-edit": "&#xf333; Calendar Edit solid",
			"far fa-calendar-edit": "&#xf333; Calendar Edit regular",
			"fal fa-calendar-edit": "&#xf333; Calendar Edit light",
			"fab fa-calendar-edit": "&#xf333; Calendar Edit duotone",
			"fas fa-calendar-day": "&#xf783; Calendar with Day Focus solid",
			"far fa-calendar-day": "&#xf783; Calendar with Day Focus regular",
			"fal fa-calendar-day": "&#xf783; Calendar with Day Focus light",
			"fab fa-calendar-day": "&#xf783; Calendar with Day Focus duotone",
			"fas fa-calendar-check": "&#xf274; Calendar Check solid",
			"far fa-calendar-check": "&#xf274; Calendar Check regular",
			"fal fa-calendar-check": "&#xf274; Calendar Check light",
			"fab fa-calendar-check": "&#xf274; Calendar Check duotone",
			"fas fa-calendar-alt": "&#xf073; Alternate Calendar solid",
			"far fa-calendar-alt": "&#xf073; Alternate Calendar regular",
			"fal fa-calendar-alt": "&#xf073; Alternate Calendar light",
			"fab fa-calendar-alt": "&#xf073; Alternate Calendar duotone",
			"fas fa-calendar": "&#xf133; Calendar solid",
			"far fa-calendar": "&#xf133; Calendar regular",
			"fal fa-calendar": "&#xf133; Calendar light",
			"fab fa-calendar": "&#xf133; Calendar duotone",
			"fas fa-calculator-alt": "&#xf64c; Alternate Calculator solid",
			"far fa-calculator-alt": "&#xf64c; Alternate Calculator regular",
			"fal fa-calculator-alt": "&#xf64c; Alternate Calculator light",
			"fab fa-calculator-alt": "&#xf64c; Alternate Calculator duotone",
			"fas fa-calculator": "&#xf1ec; Calculator solid",
			"far fa-calculator": "&#xf1ec; Calculator regular",
			"fal fa-calculator": "&#xf1ec; Calculator light",
			"fab fa-calculator": "&#xf1ec; Calculator duotone",
			"fal fa-cactus": "&#xf8a7; Cactus light",
			"far fa-cactus": "&#xf8a7; Cactus regular",
			"fas fa-cactus": "&#xf8a7; Cactus solid",
			"fab fa-cactus": "&#xf8a7; Cactus duotone",
			"fas fa-cabinet-filing": "&#xf64b; Filing Cabinet solid",
			"far fa-cabinet-filing": "&#xf64b; Filing Cabinet regular",
			"fal fa-cabinet-filing": "&#xf64b; Filing Cabinet light",
			"fab fa-cabinet-filing": "&#xf64b; Filing Cabinet duotone",
			"fab fa-buysellads": "&#xf20d; BuySellAds brands",
			"fab fa-buy-n-large": "&#xf8a6; Buy n Large brands",
			"fas fa-business-time": "&#xf64a; Business Time solid",
			"far fa-business-time": "&#xf64a; Business Time regular",
			"fal fa-business-time": "&#xf64a; Business Time light",
			"fab fa-business-time": "&#xf64a; Business Time duotone",
			"fas fa-bus-school": "&#xf5dd; Bus School solid",
			"far fa-bus-school": "&#xf5dd; Bus School regular",
			"fal fa-bus-school": "&#xf5dd; Bus School light",
			"fab fa-bus-school": "&#xf5dd; Bus School duotone",
			"fas fa-bus-alt": "&#xf55e; Bus Alt solid",
			"far fa-bus-alt": "&#xf55e; Bus Alt regular",
			"fal fa-bus-alt": "&#xf55e; Bus Alt light",
			"fab fa-bus-alt": "&#xf55e; Bus Alt duotone",
			"fas fa-bus": "&#xf207; Bus solid",
			"far fa-bus": "&#xf207; Bus regular",
			"fal fa-bus": "&#xf207; Bus light",
			"fab fa-bus": "&#xf207; Bus duotone",
			"fas fa-burrito": "&#xf7ed; Burrito solid",
			"far fa-burrito": "&#xf7ed; Burrito regular",
			"fal fa-burrito": "&#xf7ed; Burrito light",
			"fab fa-burrito": "&#xf7ed; Burrito duotone",
			"fab fa-buromobelexperte": "&#xf37f; B\u00fcrom\u00f6bel-Experte GmbH & Co. KG. brands",
			"fas fa-burn": "&#xf46a; Burn solid",
			"far fa-burn": "&#xf46a; Burn regular",
			"fal fa-burn": "&#xf46a; Burn light",
			"fab fa-burn": "&#xf46a; Burn duotone",
			"fas fa-burger-soda": "&#xf858; Burger and Soda solid",
			"far fa-burger-soda": "&#xf858; Burger and Soda regular",
			"fal fa-burger-soda": "&#xf858; Burger and Soda light",
			"fab fa-burger-soda": "&#xf858; Burger and Soda duotone",
			"fas fa-bullseye-pointer": "&#xf649; Bullseye Pointer solid",
			"far fa-bullseye-pointer": "&#xf649; Bullseye Pointer regular",
			"fal fa-bullseye-pointer": "&#xf649; Bullseye Pointer light",
			"fab fa-bullseye-pointer": "&#xf649; Bullseye Pointer duotone",
			"fas fa-bullseye-arrow": "&#xf648; Bullseye Arrow solid",
			"far fa-bullseye-arrow": "&#xf648; Bullseye Arrow regular",
			"fal fa-bullseye-arrow": "&#xf648; Bullseye Arrow light",
			"fab fa-bullseye-arrow": "&#xf648; Bullseye Arrow duotone",
			"fas fa-bullseye": "&#xf140; Bullseye solid",
			"far fa-bullseye": "&#xf140; Bullseye regular",
			"fal fa-bullseye": "&#xf140; Bullseye light",
			"fab fa-bullseye": "&#xf140; Bullseye duotone",
			"fas fa-bullhorn": "&#xf0a1; bullhorn solid",
			"far fa-bullhorn": "&#xf0a1; bullhorn regular",
			"fal fa-bullhorn": "&#xf0a1; bullhorn light",
			"fab fa-bullhorn": "&#xf0a1; bullhorn duotone",
			"fas fa-building": "&#xf1ad; Building solid",
			"far fa-building": "&#xf1ad; Building regular",
			"fal fa-building": "&#xf1ad; Building light",
			"fab fa-building": "&#xf1ad; Building duotone",
			"fas fa-bug": "&#xf188; Bug solid",
			"far fa-bug": "&#xf188; Bug regular",
			"fal fa-bug": "&#xf188; Bug light",
			"fab fa-bug": "&#xf188; Bug duotone",
			"fab fa-buffer": "&#xf837; Buffer brands",
			"fab fa-btc": "&#xf15a; BTC brands",
			"fas fa-brush": "&#xf55d; Brush solid",
			"far fa-brush": "&#xf55d; Brush regular",
			"fal fa-brush": "&#xf55d; Brush light",
			"fab fa-brush": "&#xf55d; Brush duotone",
			"fas fa-browser": "&#xf37e; Browser solid",
			"far fa-browser": "&#xf37e; Browser regular",
			"fal fa-browser": "&#xf37e; Browser light",
			"fab fa-browser": "&#xf37e; Browser duotone",
			"fas fa-broom": "&#xf51a; Broom solid",
			"far fa-broom": "&#xf51a; Broom regular",
			"fal fa-broom": "&#xf51a; Broom light",
			"fab fa-broom": "&#xf51a; Broom duotone",
			"fas fa-broadcast-tower": "&#xf519; Broadcast Tower solid",
			"far fa-broadcast-tower": "&#xf519; Broadcast Tower regular",
			"fal fa-broadcast-tower": "&#xf519; Broadcast Tower light",
			"fab fa-broadcast-tower": "&#xf519; Broadcast Tower duotone",
			"fas fa-bring-front": "&#xf857; Bring Front solid",
			"far fa-bring-front": "&#xf857; Bring Front regular",
			"fal fa-bring-front": "&#xf857; Bring Front light",
			"fab fa-bring-front": "&#xf857; Bring Front duotone",
			"fas fa-bring-forward": "&#xf856; Bring Forward solid",
			"far fa-bring-forward": "&#xf856; Bring Forward regular",
			"fal fa-bring-forward": "&#xf856; Bring Forward light",
			"fab fa-bring-forward": "&#xf856; Bring Forward duotone",
			"fas fa-briefcase-medical": "&#xf469; Medical Briefcase solid",
			"far fa-briefcase-medical": "&#xf469; Medical Briefcase regular",
			"fal fa-briefcase-medical": "&#xf469; Medical Briefcase light",
			"fab fa-briefcase-medical": "&#xf469; Medical Briefcase duotone",
			"fas fa-briefcase": "&#xf0b1; Briefcase solid",
			"far fa-briefcase": "&#xf0b1; Briefcase regular",
			"fal fa-briefcase": "&#xf0b1; Briefcase light",
			"fab fa-briefcase": "&#xf0b1; Briefcase duotone",
			"fas fa-bread-slice": "&#xf7ec; Bread Slice solid",
			"far fa-bread-slice": "&#xf7ec; Bread Slice regular",
			"fal fa-bread-slice": "&#xf7ec; Bread Slice light",
			"fab fa-bread-slice": "&#xf7ec; Bread Slice duotone",
			"fas fa-bread-loaf": "&#xf7eb; Loaf of Bread solid",
			"far fa-bread-loaf": "&#xf7eb; Loaf of Bread regular",
			"fal fa-bread-loaf": "&#xf7eb; Loaf of Bread light",
			"fab fa-bread-loaf": "&#xf7eb; Loaf of Bread duotone",
			"fas fa-brain": "&#xf5dc; Brain solid",
			"far fa-brain": "&#xf5dc; Brain regular",
			"fal fa-brain": "&#xf5dc; Brain light",
			"fab fa-brain": "&#xf5dc; Brain duotone",
			"fas fa-braille": "&#xf2a1; Braille solid",
			"far fa-braille": "&#xf2a1; Braille regular",
			"fal fa-braille": "&#xf2a1; Braille light",
			"fab fa-braille": "&#xf2a1; Braille duotone",
			"fas fa-brackets-curly": "&#xf7ea; Curly Brackets solid",
			"far fa-brackets-curly": "&#xf7ea; Curly Brackets regular",
			"fal fa-brackets-curly": "&#xf7ea; Curly Brackets light",
			"fab fa-brackets-curly": "&#xf7ea; Curly Brackets duotone",
			"fas fa-brackets": "&#xf7e9; Brackets solid",
			"far fa-brackets": "&#xf7e9; Brackets regular",
			"fal fa-brackets": "&#xf7e9; Brackets light",
			"fab fa-brackets": "&#xf7e9; Brackets duotone",
			"fas fa-boxing-glove": "&#xf438; Boxing Glove solid",
			"far fa-boxing-glove": "&#xf438; Boxing Glove regular",
			"fal fa-boxing-glove": "&#xf438; Boxing Glove light",
			"fab fa-boxing-glove": "&#xf438; Boxing Glove duotone",
			"fas fa-boxes-alt": "&#xf4a1; Alternate Boxes solid",
			"far fa-boxes-alt": "&#xf4a1; Alternate Boxes regular",
			"fal fa-boxes-alt": "&#xf4a1; Alternate Boxes light",
			"fab fa-boxes-alt": "&#xf4a1; Alternate Boxes duotone",
			"fas fa-boxes": "&#xf468; Boxes solid",
			"far fa-boxes": "&#xf468; Boxes regular",
			"fal fa-boxes": "&#xf468; Boxes light",
			"fab fa-boxes": "&#xf468; Boxes duotone",
			"fas fa-box-usd": "&#xf4a0; Box with US Dollar solid",
			"far fa-box-usd": "&#xf4a0; Box with US Dollar regular",
			"fal fa-box-usd": "&#xf4a0; Box with US Dollar light",
			"fab fa-box-usd": "&#xf4a0; Box with US Dollar duotone",
			"fas fa-box-up": "&#xf49f; Box Up solid",
			"far fa-box-up": "&#xf49f; Box Up regular",
			"fal fa-box-up": "&#xf49f; Box Up light",
			"fab fa-box-up": "&#xf49f; Box Up duotone",
			"fas fa-box-open": "&#xf49e; Box Open solid",
			"far fa-box-open": "&#xf49e; Box Open regular",
			"fal fa-box-open": "&#xf49e; Box Open light",
			"fab fa-box-open": "&#xf49e; Box Open duotone",
			"fas fa-box-heart": "&#xf49d; Box with Heart solid",
			"far fa-box-heart": "&#xf49d; Box with Heart regular",
			"fal fa-box-heart": "&#xf49d; Box with Heart light",
			"fab fa-box-heart": "&#xf49d; Box with Heart duotone",
			"fas fa-box-full": "&#xf49c; Box Full solid",
			"far fa-box-full": "&#xf49c; Box Full regular",
			"fal fa-box-full": "&#xf49c; Box Full light",
			"fab fa-box-full": "&#xf49c; Box Full duotone",
			"fas fa-box-fragile": "&#xf49b; Box Fragile solid",
			"far fa-box-fragile": "&#xf49b; Box Fragile regular",
			"fal fa-box-fragile": "&#xf49b; Box Fragile light",
			"fab fa-box-fragile": "&#xf49b; Box Fragile duotone",
			"fas fa-box-check": "&#xf467; Box Check solid",
			"far fa-box-check": "&#xf467; Box Check regular",
			"fal fa-box-check": "&#xf467; Box Check light",
			"fab fa-box-check": "&#xf467; Box Check duotone",
			"fas fa-box-ballot": "&#xf735; Box Ballot solid",
			"far fa-box-ballot": "&#xf735; Box Ballot regular",
			"fal fa-box-ballot": "&#xf735; Box Ballot light",
			"fab fa-box-ballot": "&#xf735; Box Ballot duotone",
			"fas fa-box-alt": "&#xf49a; Alternate Box solid",
			"far fa-box-alt": "&#xf49a; Alternate Box regular",
			"fal fa-box-alt": "&#xf49a; Alternate Box light",
			"fab fa-box-alt": "&#xf49a; Alternate Box duotone",
			"fas fa-box": "&#xf466; Box solid",
			"far fa-box": "&#xf466; Box regular",
			"fal fa-box": "&#xf466; Box light",
			"fab fa-box": "&#xf466; Box duotone",
			"fas fa-bowling-pins": "&#xf437; Bowling Pins solid",
			"far fa-bowling-pins": "&#xf437; Bowling Pins regular",
			"fal fa-bowling-pins": "&#xf437; Bowling Pins light",
			"fab fa-bowling-pins": "&#xf437; Bowling Pins duotone",
			"fas fa-bowling-ball": "&#xf436; Bowling Ball solid",
			"far fa-bowling-ball": "&#xf436; Bowling Ball regular",
			"fal fa-bowling-ball": "&#xf436; Bowling Ball light",
			"fab fa-bowling-ball": "&#xf436; Bowling Ball duotone",
			"fas fa-bow-arrow": "&#xf6b9; Bow Arrow solid",
			"far fa-bow-arrow": "&#xf6b9; Bow Arrow regular",
			"fal fa-bow-arrow": "&#xf6b9; Bow Arrow light",
			"fab fa-bow-arrow": "&#xf6b9; Bow Arrow duotone",
			"fas fa-border-top": "&#xf855; Border Top solid",
			"far fa-border-top": "&#xf855; Border Top regular",
			"fal fa-border-top": "&#xf855; Border Top light",
			"fab fa-border-top": "&#xf855; Border Top duotone",
			"fas fa-border-style-alt": "&#xf854; Border Style-alt solid",
			"far fa-border-style-alt": "&#xf854; Border Style-alt regular",
			"fal fa-border-style-alt": "&#xf854; Border Style-alt light",
			"fab fa-border-style-alt": "&#xf854; Border Style-alt duotone",
			"fas fa-border-style": "&#xf853; Border Style solid",
			"far fa-border-style": "&#xf853; Border Style regular",
			"fal fa-border-style": "&#xf853; Border Style light",
			"fab fa-border-style": "&#xf853; Border Style duotone",
			"fas fa-border-right": "&#xf852; Border Right solid",
			"far fa-border-right": "&#xf852; Border Right regular",
			"fal fa-border-right": "&#xf852; Border Right light",
			"fab fa-border-right": "&#xf852; Border Right duotone",
			"fas fa-border-outer": "&#xf851; Border Outer solid",
			"far fa-border-outer": "&#xf851; Border Outer regular",
			"fal fa-border-outer": "&#xf851; Border Outer light",
			"fab fa-border-outer": "&#xf851; Border Outer duotone",
			"fas fa-border-none": "&#xf850; Border None solid",
			"far fa-border-none": "&#xf850; Border None regular",
			"fal fa-border-none": "&#xf850; Border None light",
			"fab fa-border-none": "&#xf850; Border None duotone",
			"fas fa-border-left": "&#xf84f; Border Left solid",
			"far fa-border-left": "&#xf84f; Border Left regular",
			"fal fa-border-left": "&#xf84f; Border Left light",
			"fab fa-border-left": "&#xf84f; Border Left duotone",
			"fas fa-border-inner": "&#xf84e; Border Inner solid",
			"far fa-border-inner": "&#xf84e; Border Inner regular",
			"fal fa-border-inner": "&#xf84e; Border Inner light",
			"fab fa-border-inner": "&#xf84e; Border Inner duotone",
			"fas fa-border-center-v": "&#xf89d; Border Center - Vertical solid",
			"far fa-border-center-v": "&#xf89d; Border Center - Vertical regular",
			"fal fa-border-center-v": "&#xf89d; Border Center - Vertical light",
			"fab fa-border-center-v": "&#xf89d; Border Center - Vertical duotone",
			"fas fa-border-center-h": "&#xf89c; Border Center - Horizontal solid",
			"far fa-border-center-h": "&#xf89c; Border Center - Horizontal regular",
			"fal fa-border-center-h": "&#xf89c; Border Center - Horizontal light",
			"fab fa-border-center-h": "&#xf89c; Border Center - Horizontal duotone",
			"fas fa-border-bottom": "&#xf84d; Border Bottom solid",
			"far fa-border-bottom": "&#xf84d; Border Bottom regular",
			"fal fa-border-bottom": "&#xf84d; Border Bottom light",
			"fab fa-border-bottom": "&#xf84d; Border Bottom duotone",
			"fas fa-border-all": "&#xf84c; Border All solid",
			"far fa-border-all": "&#xf84c; Border All regular",
			"fal fa-border-all": "&#xf84c; Border All light",
			"fab fa-border-all": "&#xf84c; Border All duotone",
			"fab fa-bootstrap": "&#xf836; Bootstrap brands",
			"fas fa-booth-curtain": "&#xf734; Booth with Curtain solid",
			"far fa-booth-curtain": "&#xf734; Booth with Curtain regular",
			"fal fa-booth-curtain": "&#xf734; Booth with Curtain light",
			"fab fa-booth-curtain": "&#xf734; Booth with Curtain duotone",
			"fas fa-boot": "&#xf782; Boot solid",
			"far fa-boot": "&#xf782; Boot regular",
			"fal fa-boot": "&#xf782; Boot light",
			"fab fa-boot": "&#xf782; Boot duotone",
			"fas fa-boombox": "&#xf8a5; Boombox solid",
			"far fa-boombox": "&#xf8a5; Boombox regular",
			"fal fa-boombox": "&#xf8a5; Boombox light",
			"fab fa-boombox": "&#xf8a5; Boombox duotone",
			"fas fa-books-medical": "&#xf7e8; Medical Books solid",
			"far fa-books-medical": "&#xf7e8; Medical Books regular",
			"fal fa-books-medical": "&#xf7e8; Medical Books light",
			"fab fa-books-medical": "&#xf7e8; Medical Books duotone",
			"fas fa-books": "&#xf5db; Books solid",
			"far fa-books": "&#xf5db; Books regular",
			"fal fa-books": "&#xf5db; Books light",
			"fab fa-books": "&#xf5db; Books duotone",
			"fas fa-bookmark": "&#xf02e; bookmark solid",
			"far fa-bookmark": "&#xf02e; bookmark regular",
			"fal fa-bookmark": "&#xf02e; bookmark light",
			"fab fa-bookmark": "&#xf02e; bookmark duotone",
			"fas fa-book-user": "&#xf7e7; Book with User solid",
			"far fa-book-user": "&#xf7e7; Book with User regular",
			"fal fa-book-user": "&#xf7e7; Book with User light",
			"fab fa-book-user": "&#xf7e7; Book with User duotone",
			"fas fa-book-spells": "&#xf6b8; Book of Spells solid",
			"far fa-book-spells": "&#xf6b8; Book of Spells regular",
			"fal fa-book-spells": "&#xf6b8; Book of Spells light",
			"fab fa-book-spells": "&#xf6b8; Book of Spells duotone",
			"fas fa-book-reader": "&#xf5da; Book Reader solid",
			"far fa-book-reader": "&#xf5da; Book Reader regular",
			"fal fa-book-reader": "&#xf5da; Book Reader light",
			"fab fa-book-reader": "&#xf5da; Book Reader duotone",
			"fas fa-book-open": "&#xf518; Book Open solid",
			"far fa-book-open": "&#xf518; Book Open regular",
			"fal fa-book-open": "&#xf518; Book Open light",
			"fab fa-book-open": "&#xf518; Book Open duotone",
			"fas fa-book-medical": "&#xf7e6; Medical Book solid",
			"far fa-book-medical": "&#xf7e6; Medical Book regular",
			"fal fa-book-medical": "&#xf7e6; Medical Book light",
			"fab fa-book-medical": "&#xf7e6; Medical Book duotone",
			"fas fa-book-heart": "&#xf499; Book with Heart solid",
			"far fa-book-heart": "&#xf499; Book with Heart regular",
			"fal fa-book-heart": "&#xf499; Book with Heart light",
			"fab fa-book-heart": "&#xf499; Book with Heart duotone",
			"fas fa-book-dead": "&#xf6b7; Book of the Dead solid",
			"far fa-book-dead": "&#xf6b7; Book of the Dead regular",
			"fal fa-book-dead": "&#xf6b7; Book of the Dead light",
			"fab fa-book-dead": "&#xf6b7; Book of the Dead duotone",
			"fas fa-book-alt": "&#xf5d9; Alternate Book solid",
			"far fa-book-alt": "&#xf5d9; Alternate Book regular",
			"fal fa-book-alt": "&#xf5d9; Alternate Book light",
			"fab fa-book-alt": "&#xf5d9; Alternate Book duotone",
			"fas fa-book": "&#xf02d; book solid",
			"far fa-book": "&#xf02d; book regular",
			"fal fa-book": "&#xf02d; book light",
			"fab fa-book": "&#xf02d; book duotone",
			"fas fa-bong": "&#xf55c; Bong solid",
			"far fa-bong": "&#xf55c; Bong regular",
			"fal fa-bong": "&#xf55c; Bong light",
			"fab fa-bong": "&#xf55c; Bong duotone",
			"fas fa-bone-break": "&#xf5d8; Bone Break solid",
			"far fa-bone-break": "&#xf5d8; Bone Break regular",
			"fal fa-bone-break": "&#xf5d8; Bone Break light",
			"fab fa-bone-break": "&#xf5d8; Bone Break duotone",
			"fas fa-bone": "&#xf5d7; Bone solid",
			"far fa-bone": "&#xf5d7; Bone regular",
			"fal fa-bone": "&#xf5d7; Bone light",
			"fab fa-bone": "&#xf5d7; Bone duotone",
			"fas fa-bomb": "&#xf1e2; Bomb solid",
			"far fa-bomb": "&#xf1e2; Bomb regular",
			"fal fa-bomb": "&#xf1e2; Bomb light",
			"fab fa-bomb": "&#xf1e2; Bomb duotone",
			"fas fa-bolt": "&#xf0e7; Lightning Bolt solid",
			"far fa-bolt": "&#xf0e7; Lightning Bolt regular",
			"fal fa-bolt": "&#xf0e7; Lightning Bolt light",
			"fab fa-bolt": "&#xf0e7; Lightning Bolt duotone",
			"fas fa-bold": "&#xf032; bold solid",
			"far fa-bold": "&#xf032; bold regular",
			"fal fa-bold": "&#xf032; bold light",
			"fab fa-bold": "&#xf032; bold duotone",
			"fab fa-bluetooth-b": "&#xf294; Bluetooth brands",
			"fab fa-bluetooth": "&#xf293; Bluetooth brands",
			"fab fa-blogger-b": "&#xf37d; Blogger B brands",
			"fab fa-blogger": "&#xf37c; Blogger brands",
			"fas fa-blog": "&#xf781; Blog solid",
			"far fa-blog": "&#xf781; Blog regular",
			"fal fa-blog": "&#xf781; Blog light",
			"fab fa-blog": "&#xf781; Blog duotone",
			"fas fa-blind": "&#xf29d; Blind solid",
			"far fa-blind": "&#xf29d; Blind regular",
			"fal fa-blind": "&#xf29d; Blind light",
			"fab fa-blind": "&#xf29d; Blind duotone",
			"fas fa-blender-phone": "&#xf6b6; Blender Phone solid",
			"far fa-blender-phone": "&#xf6b6; Blender Phone regular",
			"fal fa-blender-phone": "&#xf6b6; Blender Phone light",
			"fab fa-blender-phone": "&#xf6b6; Blender Phone duotone",
			"fas fa-blender": "&#xf517; Blender solid",
			"far fa-blender": "&#xf517; Blender regular",
			"fal fa-blender": "&#xf517; Blender light",
			"fab fa-blender": "&#xf517; Blender duotone",
			"fas fa-blanket": "&#xf498; Blanket solid",
			"far fa-blanket": "&#xf498; Blanket regular",
			"fal fa-blanket": "&#xf498; Blanket light",
			"fab fa-blanket": "&#xf498; Blanket duotone",
			"fab fa-blackberry": "&#xf37b; BlackBerry brands",
			"fab fa-black-tie": "&#xf27e; Font Awesome Black Tie brands",
			"fab fa-bity": "&#xf37a; Bity brands",
			"fab fa-bitcoin": "&#xf379; Bitcoin brands",
			"fab fa-bitbucket": "&#xf171; Bitbucket brands",
			"fas fa-birthday-cake": "&#xf1fd; Birthday Cake solid",
			"far fa-birthday-cake": "&#xf1fd; Birthday Cake regular",
			"fal fa-birthday-cake": "&#xf1fd; Birthday Cake light",
			"fab fa-birthday-cake": "&#xf1fd; Birthday Cake duotone",
			"fas fa-biohazard": "&#xf780; Biohazard solid",
			"far fa-biohazard": "&#xf780; Biohazard regular",
			"fal fa-biohazard": "&#xf780; Biohazard light",
			"fab fa-biohazard": "&#xf780; Biohazard duotone",
			"fas fa-binoculars": "&#xf1e5; Binoculars solid",
			"far fa-binoculars": "&#xf1e5; Binoculars regular",
			"fal fa-binoculars": "&#xf1e5; Binoculars light",
			"fab fa-binoculars": "&#xf1e5; Binoculars duotone",
			"fab fa-bimobject": "&#xf378; BIMobject brands",
			"fas fa-biking-mountain": "&#xf84b; Biking Mountain solid",
			"far fa-biking-mountain": "&#xf84b; Biking Mountain regular",
			"fal fa-biking-mountain": "&#xf84b; Biking Mountain light",
			"fab fa-biking-mountain": "&#xf84b; Biking Mountain duotone",
			"fas fa-biking": "&#xf84a; Biking solid",
			"far fa-biking": "&#xf84a; Biking regular",
			"fal fa-biking": "&#xf84a; Biking light",
			"fab fa-biking": "&#xf84a; Biking duotone",
			"fas fa-bicycle": "&#xf206; Bicycle solid",
			"far fa-bicycle": "&#xf206; Bicycle regular",
			"fal fa-bicycle": "&#xf206; Bicycle light",
			"fab fa-bicycle": "&#xf206; Bicycle duotone",
			"fas fa-bible": "&#xf647; Bible solid",
			"far fa-bible": "&#xf647; Bible regular",
			"fal fa-bible": "&#xf647; Bible light",
			"fab fa-bible": "&#xf647; Bible duotone",
			"fas fa-bezier-curve": "&#xf55b; Bezier Curve solid",
			"far fa-bezier-curve": "&#xf55b; Bezier Curve regular",
			"fal fa-bezier-curve": "&#xf55b; Bezier Curve light",
			"fab fa-bezier-curve": "&#xf55b; Bezier Curve duotone",
			"fas fa-betamax": "&#xf8a4; Betamax solid",
			"far fa-betamax": "&#xf8a4; Betamax regular",
			"fal fa-betamax": "&#xf8a4; Betamax light",
			"fab fa-betamax": "&#xf8a4; Betamax duotone",
			"fas fa-bells": "&#xf77f; Bells solid",
			"far fa-bells": "&#xf77f; Bells regular",
			"fal fa-bells": "&#xf77f; Bells light",
			"fab fa-bells": "&#xf77f; Bells duotone",
			"fas fa-bell-slash": "&#xf1f6; Bell Slash solid",
			"far fa-bell-slash": "&#xf1f6; Bell Slash regular",
			"fal fa-bell-slash": "&#xf1f6; Bell Slash light",
			"fab fa-bell-slash": "&#xf1f6; Bell Slash duotone",
			"fas fa-bell-school-slash": "&#xf5d6; Bell School Slash solid",
			"far fa-bell-school-slash": "&#xf5d6; Bell School Slash regular",
			"fal fa-bell-school-slash": "&#xf5d6; Bell School Slash light",
			"fab fa-bell-school-slash": "&#xf5d6; Bell School Slash duotone",
			"fas fa-bell-school": "&#xf5d5; Bell School solid",
			"far fa-bell-school": "&#xf5d5; Bell School regular",
			"fal fa-bell-school": "&#xf5d5; Bell School light",
			"fab fa-bell-school": "&#xf5d5; Bell School duotone",
			"fas fa-bell-plus": "&#xf849; Bell Plus solid",
			"far fa-bell-plus": "&#xf849; Bell Plus regular",
			"fal fa-bell-plus": "&#xf849; Bell Plus light",
			"fab fa-bell-plus": "&#xf849; Bell Plus duotone",
			"fas fa-bell-exclamation": "&#xf848; Bell Exclamation solid",
			"far fa-bell-exclamation": "&#xf848; Bell Exclamation regular",
			"fal fa-bell-exclamation": "&#xf848; Bell Exclamation light",
			"fab fa-bell-exclamation": "&#xf848; Bell Exclamation duotone",
			"fas fa-bell": "&#xf0f3; bell solid",
			"far fa-bell": "&#xf0f3; bell regular",
			"fal fa-bell": "&#xf0f3; bell light",
			"fab fa-bell": "&#xf0f3; bell duotone",
			"fab fa-behance-square": "&#xf1b5; Behance Square brands",
			"fab fa-behance": "&#xf1b4; Behance brands",
			"fas fa-beer": "&#xf0fc; beer solid",
			"far fa-beer": "&#xf0fc; beer regular",
			"fal fa-beer": "&#xf0fc; beer light",
			"fab fa-beer": "&#xf0fc; beer duotone",
			"fas fa-bed": "&#xf236; Bed solid",
			"far fa-bed": "&#xf236; Bed regular",
			"fal fa-bed": "&#xf236; Bed light",
			"fab fa-bed": "&#xf236; Bed duotone",
			"fab fa-battle-net": "&#xf835; Battle.net brands",
			"fas fa-battery-three-quarters": "&#xf241; Battery 3\/4 Full solid",
			"far fa-battery-three-quarters": "&#xf241; Battery 3\/4 Full regular",
			"fal fa-battery-three-quarters": "&#xf241; Battery 3\/4 Full light",
			"fab fa-battery-three-quarters": "&#xf241; Battery 3\/4 Full duotone",
			"fas fa-battery-slash": "&#xf377; Battery Slash solid",
			"far fa-battery-slash": "&#xf377; Battery Slash regular",
			"fal fa-battery-slash": "&#xf377; Battery Slash light",
			"fab fa-battery-slash": "&#xf377; Battery Slash duotone",
			"fas fa-battery-quarter": "&#xf243; Battery 1\/4 Full solid",
			"far fa-battery-quarter": "&#xf243; Battery 1\/4 Full regular",
			"fal fa-battery-quarter": "&#xf243; Battery 1\/4 Full light",
			"fab fa-battery-quarter": "&#xf243; Battery 1\/4 Full duotone",
			"fas fa-battery-half": "&#xf242; Battery 1\/2 Full solid",
			"far fa-battery-half": "&#xf242; Battery 1\/2 Full regular",
			"fal fa-battery-half": "&#xf242; Battery 1\/2 Full light",
			"fab fa-battery-half": "&#xf242; Battery 1\/2 Full duotone",
			"fas fa-battery-full": "&#xf240; Battery Full solid",
			"far fa-battery-full": "&#xf240; Battery Full regular",
			"fal fa-battery-full": "&#xf240; Battery Full light",
			"fab fa-battery-full": "&#xf240; Battery Full duotone",
			"fas fa-battery-empty": "&#xf244; Battery Empty solid",
			"far fa-battery-empty": "&#xf244; Battery Empty regular",
			"fal fa-battery-empty": "&#xf244; Battery Empty light",
			"fab fa-battery-empty": "&#xf244; Battery Empty duotone",
			"fas fa-battery-bolt": "&#xf376; Battery Bolt solid",
			"far fa-battery-bolt": "&#xf376; Battery Bolt regular",
			"fal fa-battery-bolt": "&#xf376; Battery Bolt light",
			"fab fa-battery-bolt": "&#xf376; Battery Bolt duotone",
			"fas fa-bath": "&#xf2cd; Bath solid",
			"far fa-bath": "&#xf2cd; Bath regular",
			"fal fa-bath": "&#xf2cd; Bath light",
			"fab fa-bath": "&#xf2cd; Bath duotone",
			"fas fa-bat": "&#xf6b5; Bat solid",
			"far fa-bat": "&#xf6b5; Bat regular",
			"fal fa-bat": "&#xf6b5; Bat light",
			"fab fa-bat": "&#xf6b5; Bat duotone",
			"fas fa-basketball-hoop": "&#xf435; Basketball Hoop solid",
			"far fa-basketball-hoop": "&#xf435; Basketball Hoop regular",
			"fal fa-basketball-hoop": "&#xf435; Basketball Hoop light",
			"fab fa-basketball-hoop": "&#xf435; Basketball Hoop duotone",
			"fas fa-basketball-ball": "&#xf434; Basketball Ball solid",
			"far fa-basketball-ball": "&#xf434; Basketball Ball regular",
			"fal fa-basketball-ball": "&#xf434; Basketball Ball light",
			"fab fa-basketball-ball": "&#xf434; Basketball Ball duotone",
			"fas fa-baseball-ball": "&#xf433; Baseball Ball solid",
			"far fa-baseball-ball": "&#xf433; Baseball Ball regular",
			"fal fa-baseball-ball": "&#xf433; Baseball Ball light",
			"fab fa-baseball-ball": "&#xf433; Baseball Ball duotone",
			"fas fa-baseball": "&#xf432; Baseball solid",
			"far fa-baseball": "&#xf432; Baseball regular",
			"fal fa-baseball": "&#xf432; Baseball light",
			"fab fa-baseball": "&#xf432; Baseball duotone",
			"fas fa-bars": "&#xf0c9; Bars solid",
			"far fa-bars": "&#xf0c9; Bars regular",
			"fal fa-bars": "&#xf0c9; Bars light",
			"fab fa-bars": "&#xf0c9; Bars duotone",
			"fas fa-barcode-scan": "&#xf465; Barcode Scan solid",
			"far fa-barcode-scan": "&#xf465; Barcode Scan regular",
			"fal fa-barcode-scan": "&#xf465; Barcode Scan light",
			"fab fa-barcode-scan": "&#xf465; Barcode Scan duotone",
			"fas fa-barcode-read": "&#xf464; Barcode Read solid",
			"far fa-barcode-read": "&#xf464; Barcode Read regular",
			"fal fa-barcode-read": "&#xf464; Barcode Read light",
			"fab fa-barcode-read": "&#xf464; Barcode Read duotone",
			"fas fa-barcode-alt": "&#xf463; Alternate Barcode solid",
			"far fa-barcode-alt": "&#xf463; Alternate Barcode regular",
			"fal fa-barcode-alt": "&#xf463; Alternate Barcode light",
			"fab fa-barcode-alt": "&#xf463; Alternate Barcode duotone",
			"fas fa-barcode": "&#xf02a; barcode solid",
			"far fa-barcode": "&#xf02a; barcode regular",
			"fal fa-barcode": "&#xf02a; barcode light",
			"fab fa-barcode": "&#xf02a; barcode duotone",
			"fas fa-banjo": "&#xf8a3; Banjo solid",
			"far fa-banjo": "&#xf8a3; Banjo regular",
			"fal fa-banjo": "&#xf8a3; Banjo light",
			"fab fa-banjo": "&#xf8a3; Banjo duotone",
			"fab fa-bandcamp": "&#xf2d5; Bandcamp brands",
			"fas fa-band-aid": "&#xf462; Band-Aid solid",
			"far fa-band-aid": "&#xf462; Band-Aid regular",
			"fal fa-band-aid": "&#xf462; Band-Aid light",
			"fab fa-band-aid": "&#xf462; Band-Aid duotone",
			"fas fa-ban": "&#xf05e; ban solid",
			"far fa-ban": "&#xf05e; ban regular",
			"fal fa-ban": "&#xf05e; ban light",
			"fab fa-ban": "&#xf05e; ban duotone",
			"fas fa-ballot-check": "&#xf733; Ballot Check solid",
			"far fa-ballot-check": "&#xf733; Ballot Check regular",
			"fal fa-ballot-check": "&#xf733; Ballot Check light",
			"fab fa-ballot-check": "&#xf733; Ballot Check duotone",
			"fas fa-ballot": "&#xf732; Ballot solid",
			"far fa-ballot": "&#xf732; Ballot regular",
			"fal fa-ballot": "&#xf732; Ballot light",
			"fab fa-ballot": "&#xf732; Ballot duotone",
			"fas fa-ball-pile": "&#xf77e; Ball Pile solid",
			"far fa-ball-pile": "&#xf77e; Ball Pile regular",
			"fal fa-ball-pile": "&#xf77e; Ball Pile light",
			"fab fa-ball-pile": "&#xf77e; Ball Pile duotone",
			"fas fa-balance-scale-right": "&#xf516; Balance Scale (Right-Weighted) solid",
			"far fa-balance-scale-right": "&#xf516; Balance Scale (Right-Weighted) regular",
			"fal fa-balance-scale-right": "&#xf516; Balance Scale (Right-Weighted) light",
			"fab fa-balance-scale-right": "&#xf516; Balance Scale (Right-Weighted) duotone",
			"fas fa-balance-scale-left": "&#xf515; Balance Scale (Left-Weighted) solid",
			"far fa-balance-scale-left": "&#xf515; Balance Scale (Left-Weighted) regular",
			"fal fa-balance-scale-left": "&#xf515; Balance Scale (Left-Weighted) light",
			"fab fa-balance-scale-left": "&#xf515; Balance Scale (Left-Weighted) duotone",
			"fas fa-balance-scale": "&#xf24e; Balance Scale solid",
			"far fa-balance-scale": "&#xf24e; Balance Scale regular",
			"fal fa-balance-scale": "&#xf24e; Balance Scale light",
			"fab fa-balance-scale": "&#xf24e; Balance Scale duotone",
			"fas fa-bags-shopping": "&#xf847; Shopping Bags solid",
			"far fa-bags-shopping": "&#xf847; Shopping Bags regular",
			"fal fa-bags-shopping": "&#xf847; Shopping Bags light",
			"fab fa-bags-shopping": "&#xf847; Shopping Bags duotone",
			"fas fa-badger-honey": "&#xf6b4; Honey Badger solid",
			"far fa-badger-honey": "&#xf6b4; Honey Badger regular",
			"fal fa-badger-honey": "&#xf6b4; Honey Badger light",
			"fab fa-badger-honey": "&#xf6b4; Honey Badger duotone",
			"fal fa-badge-sheriff": "&#xf8a2; Sheriff Badge light",
			"far fa-badge-sheriff": "&#xf8a2; Sheriff Badge regular",
			"fas fa-badge-sheriff": "&#xf8a2; Sheriff Badge solid",
			"fab fa-badge-sheriff": "&#xf8a2; Sheriff Badge duotone",
			"fas fa-badge-percent": "&#xf646; Badge Percent solid",
			"far fa-badge-percent": "&#xf646; Badge Percent regular",
			"fal fa-badge-percent": "&#xf646; Badge Percent light",
			"fab fa-badge-percent": "&#xf646; Badge Percent duotone",
			"fas fa-badge-dollar": "&#xf645; Badge Dollar solid",
			"far fa-badge-dollar": "&#xf645; Badge Dollar regular",
			"fal fa-badge-dollar": "&#xf645; Badge Dollar light",
			"fab fa-badge-dollar": "&#xf645; Badge Dollar duotone",
			"fas fa-badge-check": "&#xf336; Check Badge solid",
			"far fa-badge-check": "&#xf336; Check Badge regular",
			"fal fa-badge-check": "&#xf336; Check Badge light",
			"fab fa-badge-check": "&#xf336; Check Badge duotone",
			"fas fa-badge": "&#xf335; Badge solid",
			"far fa-badge": "&#xf335; Badge regular",
			"fal fa-badge": "&#xf335; Badge light",
			"fab fa-badge": "&#xf335; Badge duotone",
			"fas fa-bacon": "&#xf7e5; Bacon solid",
			"far fa-bacon": "&#xf7e5; Bacon regular",
			"fal fa-bacon": "&#xf7e5; Bacon light",
			"fab fa-bacon": "&#xf7e5; Bacon duotone",
			"fas fa-backward": "&#xf04a; backward solid",
			"far fa-backward": "&#xf04a; backward regular",
			"fal fa-backward": "&#xf04a; backward light",
			"fab fa-backward": "&#xf04a; backward duotone",
			"fas fa-backspace": "&#xf55a; Backspace solid",
			"far fa-backspace": "&#xf55a; Backspace regular",
			"fal fa-backspace": "&#xf55a; Backspace light",
			"fab fa-backspace": "&#xf55a; Backspace duotone",
			"fas fa-backpack": "&#xf5d4; Backpack solid",
			"far fa-backpack": "&#xf5d4; Backpack regular",
			"fal fa-backpack": "&#xf5d4; Backpack light",
			"fab fa-backpack": "&#xf5d4; Backpack duotone",
			"fas fa-baby-carriage": "&#xf77d; Baby Carriage solid",
			"far fa-baby-carriage": "&#xf77d; Baby Carriage regular",
			"fal fa-baby-carriage": "&#xf77d; Baby Carriage light",
			"fab fa-baby-carriage": "&#xf77d; Baby Carriage duotone",
			"fas fa-baby": "&#xf77c; Baby solid",
			"far fa-baby": "&#xf77c; Baby regular",
			"fal fa-baby": "&#xf77c; Baby light",
			"fab fa-baby": "&#xf77c; Baby duotone",
			"fas fa-axe-battle": "&#xf6b3; Axe Battle solid",
			"far fa-axe-battle": "&#xf6b3; Axe Battle regular",
			"fal fa-axe-battle": "&#xf6b3; Axe Battle light",
			"fab fa-axe-battle": "&#xf6b3; Axe Battle duotone",
			"fas fa-axe": "&#xf6b2; Axe solid",
			"far fa-axe": "&#xf6b2; Axe regular",
			"fal fa-axe": "&#xf6b2; Axe light",
			"fab fa-axe": "&#xf6b2; Axe duotone",
			"fab fa-aws": "&#xf375; Amazon Web Services (AWS) brands",
			"fas fa-award": "&#xf559; Award solid",
			"far fa-award": "&#xf559; Award regular",
			"fal fa-award": "&#xf559; Award light",
			"fab fa-award": "&#xf559; Award duotone",
			"fab fa-aviato": "&#xf421; Aviato brands",
			"fab fa-avianex": "&#xf374; avianex brands",
			"fab fa-autoprefixer": "&#xf41c; Autoprefixer brands",
			"fas fa-audio-description": "&#xf29e; Audio Description solid",
			"far fa-audio-description": "&#xf29e; Audio Description regular",
			"fal fa-audio-description": "&#xf29e; Audio Description light",
			"fab fa-audio-description": "&#xf29e; Audio Description duotone",
			"fab fa-audible": "&#xf373; Audible brands",
			"fas fa-atom-alt": "&#xf5d3; Atom Alt solid",
			"far fa-atom-alt": "&#xf5d3; Atom Alt regular",
			"fal fa-atom-alt": "&#xf5d3; Atom Alt light",
			"fab fa-atom-alt": "&#xf5d3; Atom Alt duotone",
			"fas fa-atom": "&#xf5d2; Atom solid",
			"far fa-atom": "&#xf5d2; Atom regular",
			"fal fa-atom": "&#xf5d2; Atom light",
			"fab fa-atom": "&#xf5d2; Atom duotone",
			"fab fa-atlassian": "&#xf77b; Atlassian brands",
			"fas fa-atlas": "&#xf558; Atlas solid",
			"far fa-atlas": "&#xf558; Atlas regular",
			"fal fa-atlas": "&#xf558; Atlas light",
			"fab fa-atlas": "&#xf558; Atlas duotone",
			"fas fa-at": "&#xf1fa; At solid",
			"far fa-at": "&#xf1fa; At regular",
			"fal fa-at": "&#xf1fa; At light",
			"fab fa-at": "&#xf1fa; At duotone",
			"fab fa-asymmetrik": "&#xf372; Asymmetrik, Ltd. brands",
			"fas fa-asterisk": "&#xf069; asterisk solid",
			"far fa-asterisk": "&#xf069; asterisk regular",
			"fal fa-asterisk": "&#xf069; asterisk light",
			"fab fa-asterisk": "&#xf069; asterisk duotone",
			"fas fa-assistive-listening-systems": "&#xf2a2; Assistive Listening Systems solid",
			"far fa-assistive-listening-systems": "&#xf2a2; Assistive Listening Systems regular",
			"fal fa-assistive-listening-systems": "&#xf2a2; Assistive Listening Systems light",
			"fab fa-assistive-listening-systems": "&#xf2a2; Assistive Listening Systems duotone",
			"fab fa-artstation": "&#xf77a; Artstation brands",
			"fas fa-arrows-v": "&#xf07d; Arrows Vertical solid",
			"far fa-arrows-v": "&#xf07d; Arrows Vertical regular",
			"fal fa-arrows-v": "&#xf07d; Arrows Vertical light",
			"fab fa-arrows-v": "&#xf07d; Arrows Vertical duotone",
			"fas fa-arrows-h": "&#xf07e; Arrows Horizontal solid",
			"far fa-arrows-h": "&#xf07e; Arrows Horizontal regular",
			"fal fa-arrows-h": "&#xf07e; Arrows Horizontal light",
			"fab fa-arrows-h": "&#xf07e; Arrows Horizontal duotone",
			"fas fa-arrows-alt-v": "&#xf338; Alternate Arrows Vertical solid",
			"far fa-arrows-alt-v": "&#xf338; Alternate Arrows Vertical regular",
			"fal fa-arrows-alt-v": "&#xf338; Alternate Arrows Vertical light",
			"fab fa-arrows-alt-v": "&#xf338; Alternate Arrows Vertical duotone",
			"fas fa-arrows-alt-h": "&#xf337; Alternate Arrows Horizontal solid",
			"far fa-arrows-alt-h": "&#xf337; Alternate Arrows Horizontal regular",
			"fal fa-arrows-alt-h": "&#xf337; Alternate Arrows Horizontal light",
			"fab fa-arrows-alt-h": "&#xf337; Alternate Arrows Horizontal duotone",
			"fas fa-arrows-alt": "&#xf0b2; Alternate Arrows solid",
			"far fa-arrows-alt": "&#xf0b2; Alternate Arrows regular",
			"fal fa-arrows-alt": "&#xf0b2; Alternate Arrows light",
			"fab fa-arrows-alt": "&#xf0b2; Alternate Arrows duotone",
			"fas fa-arrows": "&#xf047; Arrows solid",
			"far fa-arrows": "&#xf047; Arrows regular",
			"fal fa-arrows": "&#xf047; Arrows light",
			"fab fa-arrows": "&#xf047; Arrows duotone",
			"fas fa-arrow-up": "&#xf062; arrow-up solid",
			"far fa-arrow-up": "&#xf062; arrow-up regular",
			"fal fa-arrow-up": "&#xf062; arrow-up light",
			"fab fa-arrow-up": "&#xf062; arrow-up duotone",
			"fas fa-arrow-to-top": "&#xf341; Arrow to Top solid",
			"far fa-arrow-to-top": "&#xf341; Arrow to Top regular",
			"fal fa-arrow-to-top": "&#xf341; Arrow to Top light",
			"fab fa-arrow-to-top": "&#xf341; Arrow to Top duotone",
			"fas fa-arrow-to-right": "&#xf340; Arrow to Right solid",
			"far fa-arrow-to-right": "&#xf340; Arrow to Right regular",
			"fal fa-arrow-to-right": "&#xf340; Arrow to Right light",
			"fab fa-arrow-to-right": "&#xf340; Arrow to Right duotone",
			"fas fa-arrow-to-left": "&#xf33e; Arrow to Left solid",
			"far fa-arrow-to-left": "&#xf33e; Arrow to Left regular",
			"fal fa-arrow-to-left": "&#xf33e; Arrow to Left light",
			"fab fa-arrow-to-left": "&#xf33e; Arrow to Left duotone",
			"fas fa-arrow-to-bottom": "&#xf33d; Arrow to Bottom solid",
			"far fa-arrow-to-bottom": "&#xf33d; Arrow to Bottom regular",
			"fal fa-arrow-to-bottom": "&#xf33d; Arrow to Bottom light",
			"fab fa-arrow-to-bottom": "&#xf33d; Arrow to Bottom duotone",
			"fas fa-arrow-square-up": "&#xf33c; Arrow Square Up solid",
			"far fa-arrow-square-up": "&#xf33c; Arrow Square Up regular",
			"fal fa-arrow-square-up": "&#xf33c; Arrow Square Up light",
			"fab fa-arrow-square-up": "&#xf33c; Arrow Square Up duotone",
			"fas fa-arrow-square-right": "&#xf33b; Arrow Square Right solid",
			"far fa-arrow-square-right": "&#xf33b; Arrow Square Right regular",
			"fal fa-arrow-square-right": "&#xf33b; Arrow Square Right light",
			"fab fa-arrow-square-right": "&#xf33b; Arrow Square Right duotone",
			"fas fa-arrow-square-left": "&#xf33a; Arrow Square Left solid",
			"far fa-arrow-square-left": "&#xf33a; Arrow Square Left regular",
			"fal fa-arrow-square-left": "&#xf33a; Arrow Square Left light",
			"fab fa-arrow-square-left": "&#xf33a; Arrow Square Left duotone",
			"fas fa-arrow-square-down": "&#xf339; Arrow Square Down solid",
			"far fa-arrow-square-down": "&#xf339; Arrow Square Down regular",
			"fal fa-arrow-square-down": "&#xf339; Arrow Square Down light",
			"fab fa-arrow-square-down": "&#xf339; Arrow Square Down duotone",
			"fas fa-arrow-right": "&#xf061; arrow-right solid",
			"far fa-arrow-right": "&#xf061; arrow-right regular",
			"fal fa-arrow-right": "&#xf061; arrow-right light",
			"fab fa-arrow-right": "&#xf061; arrow-right duotone",
			"fas fa-arrow-left": "&#xf060; arrow-left solid",
			"far fa-arrow-left": "&#xf060; arrow-left regular",
			"fal fa-arrow-left": "&#xf060; arrow-left light",
			"fab fa-arrow-left": "&#xf060; arrow-left duotone",
			"fas fa-arrow-from-top": "&#xf345; Arrow from Top solid",
			"far fa-arrow-from-top": "&#xf345; Arrow from Top regular",
			"fal fa-arrow-from-top": "&#xf345; Arrow from Top light",
			"fab fa-arrow-from-top": "&#xf345; Arrow from Top duotone",
			"fas fa-arrow-from-right": "&#xf344; Arrow from Right solid",
			"far fa-arrow-from-right": "&#xf344; Arrow from Right regular",
			"fal fa-arrow-from-right": "&#xf344; Arrow from Right light",
			"fab fa-arrow-from-right": "&#xf344; Arrow from Right duotone",
			"fas fa-arrow-from-left": "&#xf343; Arrow from Left solid",
			"far fa-arrow-from-left": "&#xf343; Arrow from Left regular",
			"fal fa-arrow-from-left": "&#xf343; Arrow from Left light",
			"fab fa-arrow-from-left": "&#xf343; Arrow from Left duotone",
			"fas fa-arrow-from-bottom": "&#xf342; Arrow from Bottom solid",
			"far fa-arrow-from-bottom": "&#xf342; Arrow from Bottom regular",
			"fal fa-arrow-from-bottom": "&#xf342; Arrow from Bottom light",
			"fab fa-arrow-from-bottom": "&#xf342; Arrow from Bottom duotone",
			"fas fa-arrow-down": "&#xf063; arrow-down solid",
			"far fa-arrow-down": "&#xf063; arrow-down regular",
			"fal fa-arrow-down": "&#xf063; arrow-down light",
			"fab fa-arrow-down": "&#xf063; arrow-down duotone",
			"fas fa-arrow-circle-up": "&#xf0aa; Arrow Circle Up solid",
			"far fa-arrow-circle-up": "&#xf0aa; Arrow Circle Up regular",
			"fal fa-arrow-circle-up": "&#xf0aa; Arrow Circle Up light",
			"fab fa-arrow-circle-up": "&#xf0aa; Arrow Circle Up duotone",
			"fas fa-arrow-circle-right": "&#xf0a9; Arrow Circle Right solid",
			"far fa-arrow-circle-right": "&#xf0a9; Arrow Circle Right regular",
			"fal fa-arrow-circle-right": "&#xf0a9; Arrow Circle Right light",
			"fab fa-arrow-circle-right": "&#xf0a9; Arrow Circle Right duotone",
			"fas fa-arrow-circle-left": "&#xf0a8; Arrow Circle Left solid",
			"far fa-arrow-circle-left": "&#xf0a8; Arrow Circle Left regular",
			"fal fa-arrow-circle-left": "&#xf0a8; Arrow Circle Left light",
			"fab fa-arrow-circle-left": "&#xf0a8; Arrow Circle Left duotone",
			"fas fa-arrow-circle-down": "&#xf0ab; Arrow Circle Down solid",
			"far fa-arrow-circle-down": "&#xf0ab; Arrow Circle Down regular",
			"fal fa-arrow-circle-down": "&#xf0ab; Arrow Circle Down light",
			"fab fa-arrow-circle-down": "&#xf0ab; Arrow Circle Down duotone",
			"fas fa-arrow-alt-up": "&#xf357; Alternate Arrow Up solid",
			"far fa-arrow-alt-up": "&#xf357; Alternate Arrow Up regular",
			"fal fa-arrow-alt-up": "&#xf357; Alternate Arrow Up light",
			"fab fa-arrow-alt-up": "&#xf357; Alternate Arrow Up duotone",
			"fas fa-arrow-alt-to-top": "&#xf34d; Alternate Arrow to Top solid",
			"far fa-arrow-alt-to-top": "&#xf34d; Alternate Arrow to Top regular",
			"fal fa-arrow-alt-to-top": "&#xf34d; Alternate Arrow to Top light",
			"fab fa-arrow-alt-to-top": "&#xf34d; Alternate Arrow to Top duotone",
			"fas fa-arrow-alt-to-right": "&#xf34c; Alternate Arrow to Right solid",
			"far fa-arrow-alt-to-right": "&#xf34c; Alternate Arrow to Right regular",
			"fal fa-arrow-alt-to-right": "&#xf34c; Alternate Arrow to Right light",
			"fab fa-arrow-alt-to-right": "&#xf34c; Alternate Arrow to Right duotone",
			"fas fa-arrow-alt-to-left": "&#xf34b; Alternate Arrow to Left solid",
			"far fa-arrow-alt-to-left": "&#xf34b; Alternate Arrow to Left regular",
			"fal fa-arrow-alt-to-left": "&#xf34b; Alternate Arrow to Left light",
			"fab fa-arrow-alt-to-left": "&#xf34b; Alternate Arrow to Left duotone",
			"fas fa-arrow-alt-to-bottom": "&#xf34a; Alternate Arrow to Bottom solid",
			"far fa-arrow-alt-to-bottom": "&#xf34a; Alternate Arrow to Bottom regular",
			"fal fa-arrow-alt-to-bottom": "&#xf34a; Alternate Arrow to Bottom light",
			"fab fa-arrow-alt-to-bottom": "&#xf34a; Alternate Arrow to Bottom duotone",
			"fas fa-arrow-alt-square-up": "&#xf353; Alternate Arrow Square Up solid",
			"far fa-arrow-alt-square-up": "&#xf353; Alternate Arrow Square Up regular",
			"fal fa-arrow-alt-square-up": "&#xf353; Alternate Arrow Square Up light",
			"fab fa-arrow-alt-square-up": "&#xf353; Alternate Arrow Square Up duotone",
			"fas fa-arrow-alt-square-right": "&#xf352; Alternate Arrow Square Right solid",
			"far fa-arrow-alt-square-right": "&#xf352; Alternate Arrow Square Right regular",
			"fal fa-arrow-alt-square-right": "&#xf352; Alternate Arrow Square Right light",
			"fab fa-arrow-alt-square-right": "&#xf352; Alternate Arrow Square Right duotone",
			"fas fa-arrow-alt-square-left": "&#xf351; Alternate Arrow Square Left solid",
			"far fa-arrow-alt-square-left": "&#xf351; Alternate Arrow Square Left regular",
			"fal fa-arrow-alt-square-left": "&#xf351; Alternate Arrow Square Left light",
			"fab fa-arrow-alt-square-left": "&#xf351; Alternate Arrow Square Left duotone",
			"fas fa-arrow-alt-square-down": "&#xf350; Alternate Arrow Square Down solid",
			"far fa-arrow-alt-square-down": "&#xf350; Alternate Arrow Square Down regular",
			"fal fa-arrow-alt-square-down": "&#xf350; Alternate Arrow Square Down light",
			"fab fa-arrow-alt-square-down": "&#xf350; Alternate Arrow Square Down duotone",
			"fas fa-arrow-alt-right": "&#xf356; Alternate Arrow Right solid",
			"far fa-arrow-alt-right": "&#xf356; Alternate Arrow Right regular",
			"fal fa-arrow-alt-right": "&#xf356; Alternate Arrow Right light",
			"fab fa-arrow-alt-right": "&#xf356; Alternate Arrow Right duotone",
			"fas fa-arrow-alt-left": "&#xf355; Alternate Arrow Left solid",
			"far fa-arrow-alt-left": "&#xf355; Alternate Arrow Left regular",
			"fal fa-arrow-alt-left": "&#xf355; Alternate Arrow Left light",
			"fab fa-arrow-alt-left": "&#xf355; Alternate Arrow Left duotone",
			"fas fa-arrow-alt-from-top": "&#xf349; Alternate Arrow from Top solid",
			"far fa-arrow-alt-from-top": "&#xf349; Alternate Arrow from Top regular",
			"fal fa-arrow-alt-from-top": "&#xf349; Alternate Arrow from Top light",
			"fab fa-arrow-alt-from-top": "&#xf349; Alternate Arrow from Top duotone",
			"fas fa-arrow-alt-from-right": "&#xf348; Alternate Arrow from Right solid",
			"far fa-arrow-alt-from-right": "&#xf348; Alternate Arrow from Right regular",
			"fal fa-arrow-alt-from-right": "&#xf348; Alternate Arrow from Right light",
			"fab fa-arrow-alt-from-right": "&#xf348; Alternate Arrow from Right duotone",
			"fas fa-arrow-alt-from-left": "&#xf347; Alternate Arrow from Left solid",
			"far fa-arrow-alt-from-left": "&#xf347; Alternate Arrow from Left regular",
			"fal fa-arrow-alt-from-left": "&#xf347; Alternate Arrow from Left light",
			"fab fa-arrow-alt-from-left": "&#xf347; Alternate Arrow from Left duotone",
			"fas fa-arrow-alt-from-bottom": "&#xf346; Alternate Arrow from Bottom solid",
			"far fa-arrow-alt-from-bottom": "&#xf346; Alternate Arrow from Bottom regular",
			"fal fa-arrow-alt-from-bottom": "&#xf346; Alternate Arrow from Bottom light",
			"fab fa-arrow-alt-from-bottom": "&#xf346; Alternate Arrow from Bottom duotone",
			"fas fa-arrow-alt-down": "&#xf354; Alternate Arrow Down solid",
			"far fa-arrow-alt-down": "&#xf354; Alternate Arrow Down regular",
			"fal fa-arrow-alt-down": "&#xf354; Alternate Arrow Down light",
			"fab fa-arrow-alt-down": "&#xf354; Alternate Arrow Down duotone",
			"fas fa-arrow-alt-circle-up": "&#xf35b; Alternate Arrow Circle Up solid",
			"far fa-arrow-alt-circle-up": "&#xf35b; Alternate Arrow Circle Up regular",
			"fal fa-arrow-alt-circle-up": "&#xf35b; Alternate Arrow Circle Up light",
			"fab fa-arrow-alt-circle-up": "&#xf35b; Alternate Arrow Circle Up duotone",
			"fas fa-arrow-alt-circle-right": "&#xf35a; Alternate Arrow Circle Right solid",
			"far fa-arrow-alt-circle-right": "&#xf35a; Alternate Arrow Circle Right regular",
			"fal fa-arrow-alt-circle-right": "&#xf35a; Alternate Arrow Circle Right light",
			"fab fa-arrow-alt-circle-right": "&#xf35a; Alternate Arrow Circle Right duotone",
			"fas fa-arrow-alt-circle-left": "&#xf359; Alternate Arrow Circle Left solid",
			"far fa-arrow-alt-circle-left": "&#xf359; Alternate Arrow Circle Left regular",
			"fal fa-arrow-alt-circle-left": "&#xf359; Alternate Arrow Circle Left light",
			"fab fa-arrow-alt-circle-left": "&#xf359; Alternate Arrow Circle Left duotone",
			"fas fa-arrow-alt-circle-down": "&#xf358; Alternate Arrow Circle Down solid",
			"far fa-arrow-alt-circle-down": "&#xf358; Alternate Arrow Circle Down regular",
			"fal fa-arrow-alt-circle-down": "&#xf358; Alternate Arrow Circle Down light",
			"fab fa-arrow-alt-circle-down": "&#xf358; Alternate Arrow Circle Down duotone",
			"fas fa-archway": "&#xf557; Archway solid",
			"far fa-archway": "&#xf557; Archway regular",
			"fal fa-archway": "&#xf557; Archway light",
			"fab fa-archway": "&#xf557; Archway duotone",
			"fas fa-archive": "&#xf187; Archive solid",
			"far fa-archive": "&#xf187; Archive regular",
			"fal fa-archive": "&#xf187; Archive light",
			"fab fa-archive": "&#xf187; Archive duotone",
			"fab fa-apple-pay": "&#xf415; Apple Pay brands",
			"fas fa-apple-crate": "&#xf6b1; Apple Crate solid",
			"far fa-apple-crate": "&#xf6b1; Apple Crate regular",
			"fal fa-apple-crate": "&#xf6b1; Apple Crate light",
			"fab fa-apple-crate": "&#xf6b1; Apple Crate duotone",
			"fas fa-apple-alt": "&#xf5d1; Fruit Apple solid",
			"far fa-apple-alt": "&#xf5d1; Fruit Apple regular",
			"fal fa-apple-alt": "&#xf5d1; Fruit Apple light",
			"fab fa-apple-alt": "&#xf5d1; Fruit Apple duotone",
			"fab fa-apple": "&#xf179; Apple brands",
			"fab fa-apper": "&#xf371; Apper Systems AB brands",
			"fab fa-app-store-ios": "&#xf370; iOS App Store brands",
			"fab fa-app-store": "&#xf36f; App Store brands",
			"fas fa-ankh": "&#xf644; Ankh solid",
			"far fa-ankh": "&#xf644; Ankh regular",
			"fal fa-ankh": "&#xf644; Ankh light",
			"fab fa-ankh": "&#xf644; Ankh duotone",
			"fab fa-angular": "&#xf420; Angular brands",
			"fab fa-angrycreative": "&#xf36e; Angry Creative brands",
			"fas fa-angry": "&#xf556; Angry Face solid",
			"far fa-angry": "&#xf556; Angry Face regular",
			"fal fa-angry": "&#xf556; Angry Face light",
			"fab fa-angry": "&#xf556; Angry Face duotone",
			"fas fa-angle-up": "&#xf106; angle-up solid",
			"far fa-angle-up": "&#xf106; angle-up regular",
			"fal fa-angle-up": "&#xf106; angle-up light",
			"fab fa-angle-up": "&#xf106; angle-up duotone",
			"fas fa-angle-right": "&#xf105; angle-right solid",
			"far fa-angle-right": "&#xf105; angle-right regular",
			"fal fa-angle-right": "&#xf105; angle-right light",
			"fab fa-angle-right": "&#xf105; angle-right duotone",
			"fas fa-angle-left": "&#xf104; angle-left solid",
			"far fa-angle-left": "&#xf104; angle-left regular",
			"fal fa-angle-left": "&#xf104; angle-left light",
			"fab fa-angle-left": "&#xf104; angle-left duotone",
			"fas fa-angle-down": "&#xf107; angle-down solid",
			"far fa-angle-down": "&#xf107; angle-down regular",
			"fal fa-angle-down": "&#xf107; angle-down light",
			"fab fa-angle-down": "&#xf107; angle-down duotone",
			"fas fa-angle-double-up": "&#xf102; Angle Double Up solid",
			"far fa-angle-double-up": "&#xf102; Angle Double Up regular",
			"fal fa-angle-double-up": "&#xf102; Angle Double Up light",
			"fab fa-angle-double-up": "&#xf102; Angle Double Up duotone",
			"fas fa-angle-double-right": "&#xf101; Angle Double Right solid",
			"far fa-angle-double-right": "&#xf101; Angle Double Right regular",
			"fal fa-angle-double-right": "&#xf101; Angle Double Right light",
			"fab fa-angle-double-right": "&#xf101; Angle Double Right duotone",
			"fas fa-angle-double-left": "&#xf100; Angle Double Left solid",
			"far fa-angle-double-left": "&#xf100; Angle Double Left regular",
			"fal fa-angle-double-left": "&#xf100; Angle Double Left light",
			"fab fa-angle-double-left": "&#xf100; Angle Double Left duotone",
			"fas fa-angle-double-down": "&#xf103; Angle Double Down solid",
			"far fa-angle-double-down": "&#xf103; Angle Double Down regular",
			"fal fa-angle-double-down": "&#xf103; Angle Double Down light",
			"fab fa-angle-double-down": "&#xf103; Angle Double Down duotone",
			"fab fa-angellist": "&#xf209; AngelList brands",
			"fas fa-angel": "&#xf779; Angel solid",
			"far fa-angel": "&#xf779; Angel regular",
			"fal fa-angel": "&#xf779; Angel light",
			"fab fa-angel": "&#xf779; Angel duotone",
			"fab fa-android": "&#xf17b; Android brands",
			"fas fa-anchor": "&#xf13d; Anchor solid",
			"far fa-anchor": "&#xf13d; Anchor regular",
			"fal fa-anchor": "&#xf13d; Anchor light",
			"fab fa-anchor": "&#xf13d; Anchor duotone",
			"fas fa-analytics": "&#xf643; Analytics solid",
			"far fa-analytics": "&#xf643; Analytics regular",
			"fal fa-analytics": "&#xf643; Analytics light",
			"fab fa-analytics": "&#xf643; Analytics duotone",
			"fal fa-amp-guitar": "&#xf8a1; Guitar Amplifier light",
			"far fa-amp-guitar": "&#xf8a1; Guitar Amplifier regular",
			"fas fa-amp-guitar": "&#xf8a1; Guitar Amplifier solid",
			"fab fa-amp-guitar": "&#xf8a1; Guitar Amplifier duotone",
			"fab fa-amilia": "&#xf36d; Amilia brands",
			"fas fa-american-sign-language-interpreting": "&#xf2a3; American Sign Language Interpreting solid",
			"far fa-american-sign-language-interpreting": "&#xf2a3; American Sign Language Interpreting regular",
			"fal fa-american-sign-language-interpreting": "&#xf2a3; American Sign Language Interpreting light",
			"fab fa-american-sign-language-interpreting": "&#xf2a3; American Sign Language Interpreting duotone",
			"fas fa-ambulance": "&#xf0f9; ambulance solid",
			"far fa-ambulance": "&#xf0f9; ambulance regular",
			"fal fa-ambulance": "&#xf0f9; ambulance light",
			"fab fa-ambulance": "&#xf0f9; ambulance duotone",
			"fab fa-amazon-pay": "&#xf42c; Amazon Pay brands",
			"fab fa-amazon": "&#xf270; Amazon brands",
			"fas fa-allergies": "&#xf461; Allergies solid",
			"far fa-allergies": "&#xf461; Allergies regular",
			"fal fa-allergies": "&#xf461; Allergies light",
			"fab fa-allergies": "&#xf461; Allergies duotone",
			"fab fa-alipay": "&#xf642; Alipay brands",
			"fas fa-align-slash": "&#xf846; Align Slash solid",
			"far fa-align-slash": "&#xf846; Align Slash regular",
			"fal fa-align-slash": "&#xf846; Align Slash light",
			"fab fa-align-slash": "&#xf846; Align Slash duotone",
			"fas fa-align-right": "&#xf038; align-right solid",
			"far fa-align-right": "&#xf038; align-right regular",
			"fal fa-align-right": "&#xf038; align-right light",
			"fab fa-align-right": "&#xf038; align-right duotone",
			"fas fa-align-left": "&#xf036; align-left solid",
			"far fa-align-left": "&#xf036; align-left regular",
			"fal fa-align-left": "&#xf036; align-left light",
			"fab fa-align-left": "&#xf036; align-left duotone",
			"fas fa-align-justify": "&#xf039; align-justify solid",
			"far fa-align-justify": "&#xf039; align-justify regular",
			"fal fa-align-justify": "&#xf039; align-justify light",
			"fab fa-align-justify": "&#xf039; align-justify duotone",
			"fas fa-align-center": "&#xf037; align-center solid",
			"far fa-align-center": "&#xf037; align-center regular",
			"fal fa-align-center": "&#xf037; align-center light",
			"fab fa-align-center": "&#xf037; align-center duotone",
			"fas fa-alicorn": "&#xf6b0; Alicorn solid",
			"far fa-alicorn": "&#xf6b0; Alicorn regular",
			"fal fa-alicorn": "&#xf6b0; Alicorn light",
			"fab fa-alicorn": "&#xf6b0; Alicorn duotone",
			"fab fa-algolia": "&#xf36c; Algolia brands",
			"fas fa-album-collection": "&#xf8a0; Album Collection solid",
			"far fa-album-collection": "&#xf8a0; Album Collection regular",
			"fal fa-album-collection": "&#xf8a0; Album Collection light",
			"fab fa-album-collection": "&#xf8a0; Album Collection duotone",
			"fas fa-album": "&#xf89f; Album solid",
			"far fa-album": "&#xf89f; Album regular",
			"fal fa-album": "&#xf89f; Album light",
			"fab fa-album": "&#xf89f; Album duotone",
			"fas fa-alarm-snooze": "&#xf845; Alarm Snooze solid",
			"far fa-alarm-snooze": "&#xf845; Alarm Snooze regular",
			"fal fa-alarm-snooze": "&#xf845; Alarm Snooze light",
			"fab fa-alarm-snooze": "&#xf845; Alarm Snooze duotone",
			"fas fa-alarm-plus": "&#xf844; Alarm Plus solid",
			"far fa-alarm-plus": "&#xf844; Alarm Plus regular",
			"fal fa-alarm-plus": "&#xf844; Alarm Plus light",
			"fab fa-alarm-plus": "&#xf844; Alarm Plus duotone",
			"fas fa-alarm-exclamation": "&#xf843; Alarm Exclamation solid",
			"far fa-alarm-exclamation": "&#xf843; Alarm Exclamation regular",
			"fal fa-alarm-exclamation": "&#xf843; Alarm Exclamation light",
			"fab fa-alarm-exclamation": "&#xf843; Alarm Exclamation duotone",
			"fas fa-alarm-clock": "&#xf34e; Alarm Clock solid",
			"far fa-alarm-clock": "&#xf34e; Alarm Clock regular",
			"fal fa-alarm-clock": "&#xf34e; Alarm Clock light",
			"fab fa-alarm-clock": "&#xf34e; Alarm Clock duotone",
			"fab fa-airbnb": "&#xf834; Airbnb brands",
			"fas fa-air-freshener": "&#xf5d0; Air Freshener solid",
			"far fa-air-freshener": "&#xf5d0; Air Freshener regular",
			"fal fa-air-freshener": "&#xf5d0; Air Freshener light",
			"fab fa-air-freshener": "&#xf5d0; Air Freshener duotone",
			"fab fa-affiliatetheme": "&#xf36b; affiliatetheme brands",
			"fab fa-adversal": "&#xf36a; Adversal brands",
			"fab fa-adobe": "&#xf778; Adobe brands",
			"fab fa-adn": "&#xf170; App.net brands",
			"fas fa-adjust": "&#xf042; adjust solid",
			"far fa-adjust": "&#xf042; adjust regular",
			"fal fa-adjust": "&#xf042; adjust light",
			"fab fa-adjust": "&#xf042; adjust duotone",
			"fas fa-address-card": "&#xf2bb; Address Card solid",
			"far fa-address-card": "&#xf2bb; Address Card regular",
			"fal fa-address-card": "&#xf2bb; Address Card light",
			"fab fa-address-card": "&#xf2bb; Address Card duotone",
			"fas fa-address-book": "&#xf2b9; Address Book solid",
			"far fa-address-book": "&#xf2b9; Address Book regular",
			"fal fa-address-book": "&#xf2b9; Address Book light",
			"fab fa-address-book": "&#xf2b9; Address Book duotone",
			"fas fa-ad": "&#xf641; Ad solid",
			"far fa-ad": "&#xf641; Ad regular",
			"fal fa-ad": "&#xf641; Ad light",
			"fab fa-ad": "&#xf641; Ad duotone",
			"fab fa-acquisitions-incorporated": "&#xf6af; Acquisitions Incorporated brands",
			"fas fa-acorn": "&#xf6ae; Acorn solid",
			"far fa-acorn": "&#xf6ae; Acorn regular",
			"fal fa-acorn": "&#xf6ae; Acorn light",
			"fab fa-acorn": "&#xf6ae; Acorn duotone",
			"fab fa-accusoft": "&#xf369; Accusoft brands",
			"fab fa-accessible-icon": "&#xf368; Accessible Icon brands",
			"fas fa-abacus": "&#xf640; Abacus solid",
			"far fa-abacus": "&#xf640; Abacus regular",
			"fal fa-abacus": "&#xf640; Abacus light",
			"fab fa-abacus": "&#xf640; Abacus duotone",
			"fab fa-500px": "&#xf26e; 500px brands"
		}
    }
}


