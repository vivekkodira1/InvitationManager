require.config({
  waitSeconds: 200,
  urlArgs: 'cacheBuster=15_AUG_2014',
  paths: {
    jquery: 'thirdPartyScripts/jquery'
  },
  shim: {}
});

require(["jquery"], 
    function($){
        var addInviteeClass = 'addInvitee';
        var editInviteeClass = 'editInvitee';
        var searchInviteeClass = 'searchInvitee';
        var deleteDependentClass = 'deleteDependent';
        var showEditFormClass = 'showEditForm';
        var deleteDependentSelector = '.'+deleteDependentClass;
        var showEditFormSelector = '.'+showEditFormClass;
        var addInviteeButtonSelector = '.'+addInviteeClass;
        var editInviteeButtonSelector = '.'+editInviteeClass;
        var searchInviteeButtonSelector = '.'+searchInviteeClass;
        var actionButtonSelector = 'button[name="inviteeAction"]';
        var attendingInputsTemplateSelector = 'attendingInputs';
        var inviteeNameSelector = 'input[name="inviteeName"]';
        var inviteeLocationSelector = 'input[name="inviteeLocation"]';
        var inviteeTagsSelector = 'input[name="inviteeTags"]';
        var inviteModeSelector = 'select[name="inviteModeFlag"]';
        var invitedFlagSelector = 'select[name="invitedFlag"]';
        var inviteeAddressSelector = 'textarea[name="inviteeAddress"]';
        var dependentNameSelector = 'input[name="dependentName"]';
        var attendingFlagSelector = '[name="attendingFlag"]';
        var dependentsDivSelector =".dependents";
        var dependentDetailsSelector = '.dependentDetails';
        var removeDependentSelector ='.removeDependent';
        var addDependentsSelector = '.addDependents';
        var addDependentDivSelector = ".addDependentDiv";
        var data_invitee='invitee';
        var data_dependent='dependent';
        var rawContentSelector = '.rawOutputContainer';
        var inviteeSummaryDivSelector = '.inviteeSummaryDiv';

        var getTemplate = function(templateName){
            return $($("script."+templateName).html());
        };

        $(document).ready(function() {

            $(document).on('blur',inviteeNameSelector,function(){
                var inviteeName = ($(inviteeNameSelector).val() || "").trim();
                if(inviteeName.length===0){
                    $(addInviteeButtonSelector).attr('disabled','disabled');
                    $(addDependentDivSelector).addClass('hidden');
                    return;
                }
                $(addDependentDivSelector).removeClass('hidden');
                $(addInviteeButtonSelector).removeAttr('disabled');
                
                if($(dependentsDivSelector).html().trim()!==""){
                    $(dependentsDivSelector).find(dependentNameSelector).first().val(inviteeName);
                }else{
                    var dependents= getTemplate(attendingInputsTemplateSelector);
                    dependents.find(dependentNameSelector).val(inviteeName);
                    dependents.find(removeDependentSelector).remove();
                    dependents.find(attendingFlagSelector).val("yes");
                    dependents.appendTo($(dependentsDivSelector));
                }
            });

            var getInviteeJSON = function(){
                return JSON.parse(localStorage.invitees || '{}');
            };

            var storeInvitees = function(inviteesJSON){
                localStorage.invitees = JSON.stringify(inviteesJSON);
            };

            var getCSSSafeName = function(name){
                return name.replace(/\s/g,"_");
            };

            var getTags = function(){
                var inviteeJSON = getInviteeJSON();
                var tagJSON = {};
                for(var invitee in inviteeJSON){
                    var inviteeDetails = inviteeJSON[invitee];
                    var tags = inviteeDetails.tags || {};
                    for(var tagName in tags){
                        tagJSON[tagName] = (tagJSON[tagName])?tagJSON[tagName]+1:1;
                    }
                }
                return tagJSON;
            };
            
            $(document).on('click',addDependentsSelector,function(e){
                var numberOfDependents = $('input[name="numberOfDependents"]').val() || 0;
                numberOfDependents = (Number.isNaN(numberOfDependents))?1:numberOfDependents*1;
                for(var i=0;i<numberOfDependents;i++){
                    getTemplate(attendingInputsTemplateSelector).appendTo(dependentsDivSelector);
                }
            });

            $(document).on('click','.showDemoContent',function(e){
                storeInvitees({"Robert Baratheon":{"location":"Kings Landing","address":"Palace Kings Landing.","tags":{"King" : " ", "Baratheon": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Robert Baratheon":"No","Cersei Lannister":"Maybe","Gendry":"Maybe"}},"Stannis Baratheon":{"location":"Dragonstone","address":"Fort Dragonstone","tags":{"Baratheon" : " ", "King": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Stannis Baratheon":"Maybe","Melisandre":"Maybe","Selyse Florent":"Maybe","Shireen Baratheon":"Maybe"}},"Renly Baratheon":{"location":"","address":"Graveyard","tags":{"King" : " ", "deceased" :" ", "Baratheon" : " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Renly Baratheon":"No"}},"Tywin Lannister":{"location":"Casterly Rock","address":"Palace Casterly Rock","tags":{"deceased" : " ", "Lannister": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Tywin Lannister":"No","Joanna Lannister":"No"}},"Daenerys Targaryen":{"location":"Free cities","address":"Free Cities","tags":{"Queen" : " ", "Targaryen": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Daenerys Targaryen":"Maybe","Drogon":"Maybe","Viserion":"Maybe","Rhaegal":"Maybe"}},"Jamie Lannister":{"location":"Kings Landing","address":"Palace Kings Landing","tags":{"Lannister" : " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Jamie Lannister":"Maybe","Joffrey Baratheon":"No","Myrcella Baratheon":"Maybe","Tommen Baratheon":"Maybe"}},"Eddard Stark":{"location":"Winterfell","address":"Winterfell","tags":{"deceased" : " ", "Stark": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Eddard Stark":"Maybe","Catelyn Stark":"Maybe","Jon Snow":"Maybe","Robb Stark":"Maybe","Sansa Stark":"Maybe","Arya Stark":"Maybe","Bran Stark":"Maybe","Rickon Stark":"Maybe"}},"Tyrion Lannister":{"location":"Free cities","address":"Free cities","tags":{"Lannister" : " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Tyrion Lannister":"Maybe"}}});
                displayContent();
                $('.tab.showInviteeList').click();
            });

            $(document).on('click','.removeAll',function(e){
                storeInvitees({});
                displayContent();
                $('.tab.showInviteeList').click();
            });

            $(document).on('click',removeDependentSelector,function(e){
                $(e.target).closest(dependentDetailsSelector).remove();
            });

            var updateInviteeJSON = function(){
                var inviteeJSON = getInviteeJSON();
                var inviteeName = $(inviteeNameSelector).val();

                var tagsArray = ($(inviteeTagsSelector).val() || "").split(/\s/);
                for(var i=0;i<tagsArray.length;i++){
                    tagsJSON[tagsArray[i]]=" ";
                }
                var inviteeDetails = {
                    location:($(inviteeLocationSelector).val() || ""),
                    address:($(inviteeAddressSelector).val() || ""),
                    tags:tagsJSON,
                    inviteMode:($(inviteModeSelector).val() || ""),
                    invitedFlag:($(invitedFlagSelector).val() || ""),
                    dependents:{}
                };
                $(dependentsDivSelector).find(dependentDetailsSelector).each(function(index,element){
                    var dependentDetails = $(element);
                    var dependentName = (dependentDetails.find(dependentNameSelector).val() || "").trim();
                    if(dependentName!==""){
                        inviteeDetails.dependents[dependentName]= dependentDetails.find(attendingFlagSelector).val();
                    }
                });
                inviteeJSON[inviteeName]=inviteeDetails;
                storeInvitees(inviteeJSON);
                displayContent();
            };

            $(document).on('click',addInviteeButtonSelector,function(e){
                var inviteeJSON = getInviteeJSON();
                var inviteeName = $(inviteeNameSelector).val();
                if(inviteeJSON[inviteeName]){
                    alert("An invitee with this name already exists. Please provide a unique name");
                    return;
                }
                updateInviteeJSON();
                displayContent();
            });

            $(document).on('click',editInviteeButtonSelector,function(e){
                updateInviteeJSON();
                displayContent();
            });

            var removeInviteeRows = function(invitee){
                $('.listOfInvitees').find("tr."+getCSSSafeName(invitee)).remove();
            };

            var showRawContent = function(){
                $(rawContentSelector).val(localStorage.invitees);
            };

            $(document).on('click','.importFromRawContent',function(e){
              var rawContent = $(rawContentSelector).val() || "";
              if(rawContent.trim()===""){
                alert("Please enter some content");
                return;
              }
              try{
                var inviteeJSON = JSON.parse(rawContent);
                if(Object.keys(inviteeJSON).length==0){
                    alert("Please enter some content");   
                    return;  
                }
                storeInvitees(inviteeJSON);
                displayContent();
              }catch(e){
                alert("Could not understand/parse the content");
              } 
            });

            $(document).on('click',showEditFormSelector,function(e){
                var inviteeJSON = getInviteeJSON();
                var invitee = $(e.target).closest('tr').data(data_invitee);
                var inviteeDetails = inviteeJSON[invitee];

                $(inviteeNameSelector).val(invitee);
                $(inviteeLocationSelector).val(inviteeDetails.location);
                $(inviteeAddressSelector).val(inviteeDetails.address);
                $(inviteeTagsSelector).val(Object.keys(inviteeDetails.tags).join(" "));
                $(invitedFlagSelector).val(inviteeDetails.invitedFlag);
                $(inviteModeSelector).val(inviteeDetails.inviteMode);

                var dependentsDiv = $(dependentsDivSelector);
                dependentsDiv.html("");
                for(var dependent in inviteeDetails.dependents){
                    var dependents= getTemplate(attendingInputsTemplateSelector);
                    dependents.find(dependentNameSelector).val(dependent);
                    dependents.find(attendingFlagSelector).val(inviteeDetails.dependents[dependent]);
                    dependents.appendTo(dependentsDiv);
                }
                if(dependentsDiv.html().trim()!==""){
                    $(addDependentDivSelector).removeClass("hidden");
                }
                setTimeout(function(){
                    $(actionButtonSelector).removeAttr('disabled').html("Update").removeClass(addInviteeClass).addClass(editInviteeClass);
                    removeInviteeRows(invitee);
                    dependentsDiv.find(dependentDetailsSelector).first().find(removeDependentSelector).remove();
                    $('.tab.showAddEditInviteeScreen').click();
                },10);
            });

            $(document).on('click','.tab',function(e){
                var tab = $(e.target).closest('.tab');
                tab.addClass('active');
                $('.tab').not(tab).removeClass('active');
                var target = $('.'+tab.data('target'));
                target.removeClass('hidden');
                $('.tabContent').not(target).addClass('hidden');
            });

            $(document).on('click',deleteDependentSelector,function(e){
                var tableRow = $(e.target).closest('tr');
                var invitee = tableRow.data(data_invitee);
                var dependent = tableRow.data(data_dependent);
                var inviteeJSON = JSON.parse(localStorage.invitees);
                if(invitee==dependent){
                    delete inviteeJSON[invitee];
                    removeInviteeRows(invitee);
                }else{
                    delete inviteeJSON[invitee].dependents[dependent];
                    tableRow.remove();
                }
                storeInvitees(inviteeJSON);
                displayContent();
            });

            var searchInvitees = function(){
                var searchInviteeName = ($('input[name="search_inviteeName"]').val() || "").trim();
                
                var inviteeJSON = getInviteeJSON();
                var filteredJSON = {};
                // If name is not specified, consider all the invitees
                if(searchInviteeName.length==0){
                    filteredJSON = JSON.parse(JSON.stringify(inviteeJSON));
                }else{
                    for(var inviteeName in inviteeJSON){
                        var inviteeDetails = inviteeJSON[inviteeName];
                        if(inviteeName.toUpperCase().indexOf(searchInviteeName.toUpperCase())!=-1){
                            filteredJSON[inviteeName]=inviteeDetails;
                            continue;
                        }
                        for(var dependentName in inviteeDetails.dependents){
                            if(dependentName.toUpperCase().indexOf(searchInviteeName.toUpperCase())!=-1){
                                filteredJSON[inviteeName]=inviteeDetails;
                            }   
                        }
                    }
                }

                var searchLocation = ($('input[name="search_inviteeLocation"]').val() || "").trim();
                
                var searchInviteMode = ($('select[name="search_inviteModeFlag"]').val() || "").trim();
                var searchInvitedFlag = ($('select[name="search_invitedFlag"]').val() || "").trim();
                var searchTags = {};
                $('input[name="tagName"]:checked').each(function(){
                    searchTags[$(this).val()]=" ";
                });
                var searchTagsFlag = Object.keys(searchTags).length>0;

                for(var inviteeName in filteredJSON){
                    var inviteeDetails = inviteeJSON[inviteeName];
                    if(searchLocation.length > 0 
                        && inviteeDetails.location.toUpperCase().indexOf(searchLocation.toUpperCase())==-1){
                        delete filteredJSON[inviteeName];
                        continue;
                    }
                    if(searchInviteMode.length > 0 
                        && inviteeDetails.inviteMode != searchInviteMode){
                        delete filteredJSON[inviteeName];
                        continue;
                    }
                    if(searchInvitedFlag.length > 0 
                        && inviteeDetails.invitedFlag != searchInvitedFlag){
                        delete filteredJSON[inviteeName];
                        continue;
                    }
                    if(searchTagsFlag){
                        for(var tagName in searchTags){
                            if(!inviteeDetails.tags[tagName]){
                                delete filteredJSON[inviteeName];
                                continue;           
                            }
                        }
                    }
                }


                showInvitees(filteredJSON);
            };

            $(document).on('keyup','input[name="search_inviteeName"]',searchInvitees);
            $(document).on('keyup','input[name="search_inviteeLocation"]',searchInvitees);
            $(document).on('change','select[name="search_inviteModeFlag"]',searchInvitees);
            $(document).on('change','select[name="search_invitedFlag"]',searchInvitees);
            $(document).on('change','input[name="tagName"]',searchInvitees);

            var summarizeStatus= window.summarizeStatus = function(){
                var inviteeJSON = getInviteeJSON();
                var summaryJSON = {};
                for(var invitee in inviteeJSON){
                    summaryJSON["Invitations"] = (summaryJSON["Invitations"] || 0)+1;
                    var inviteeDetails = inviteeJSON[invitee];
                    if(inviteeDetails.inviteMode=="Visit"){
                        summaryJSON["Total visits"] = (summaryJSON["Total visits"] || 0)+1;
                        if(inviteeDetails.invitedFlag!="Yes"){
                            summaryJSON["Visits pending"] = (summaryJSON["Visits pending"] || 0)+1;
                        }
                    }
                    if(inviteeDetails.inviteMode=="Call"){
                        summaryJSON["Total calls"] = (summaryJSON["Total calls"] || 0)+1;
                        if(inviteeDetails.invitedFlag!="Yes"){
                            summaryJSON["Calls pending"] = (summaryJSON["Calls pending"] || 0)+1;
                        }
                    }
                    if(inviteeDetails.invitedFlag=="Yes"){
                        summaryJSON["Invited"] = (summaryJSON["Invited"] || 0)+1;
                    }
                    for(var dependent in inviteeDetails.dependents){
                        summaryJSON["Invitees"] = (summaryJSON["Invitees"] || 0)+1;
                        if(inviteeDetails.dependents[dependent]=="Yes"){
                            summaryJSON["Confirmed attendees"] = (summaryJSON["Confirmed attendees"] || 0)+1;
                        }
                    }
                }

                $(inviteeSummaryDivSelector).html("");
                for(var nodeName in summaryJSON){
                    var outputTemplate = getTemplate("displayContent");
                    outputTemplate.find('label').html(nodeName);
                    outputTemplate.find('span').html(summaryJSON[nodeName]);
                    outputTemplate.appendTo(inviteeSummaryDivSelector);
                }
                // console.log("summaryJSON",summaryJSON);
            };

            var showInvitees = window.showInvitees = function(inviteeJSON){
                var tableDiv = $('.listOfInvitees').find('tbody');
                tableDiv.html("");
                
                for(var invitee in inviteeJSON){
                    var inviteeDetails = inviteeJSON[invitee];
                    var dependents = inviteeDetails.dependents;
                    for(var dependent in dependents){
                        var tableRow = $('<tr>').addClass(getCSSSafeName(invitee)).data(data_invitee,invitee).data(data_dependent,dependent);
                        $('<td>').html((dependent == invitee)? dependent:"").appendTo(tableRow);
                        $('<td>').html((dependent == invitee)?(inviteeDetails.location || "NA"):"").appendTo(tableRow);
                        $('<td>').html((dependent == invitee)?(inviteeDetails.address || "NA"):"").appendTo(tableRow);
                        $('<td>').html(dependent).appendTo(tableRow);
                        $('<td>').html((dependent == invitee)?inviteeDetails.inviteMode:"").appendTo(tableRow);
                        $('<td>').html((dependent == invitee)?inviteeDetails.invitedFlag:"").appendTo(tableRow);
                        $('<td>').html(dependents[dependent] ).appendTo(tableRow);
                        $('<td>').html((dependent == invitee)?(Object.keys(inviteeDetails.tags).join(",") || "NA"):"").appendTo(tableRow);
                        var actionColumn = $('<td>')
                        $('<span>',{class:deleteDependentClass + ' fa fa-trash-o',"title":"delete this dependent/invitee"}).html(" ").appendTo(actionColumn);
                        if(dependent==invitee){
                            $('<span>',{class:showEditFormClass + " leftMargin5 fa fa-edit","title":"Edit this invitee\'s details"}).html(" ").appendTo(actionColumn);
                        }
                        actionColumn.appendTo(tableRow);
                        tableRow.appendTo(tableDiv);
                    }
                }
            };

            var resetInputs = function(){
               $('.inputForm').html(getTemplate('inputContentTemplate'));
            };

            var displayContent = function(){
                resetInputs();
                showInvitees(getInviteeJSON());
                summarizeStatus();
                showRawContent();
            };

            displayContent();



            var showSearchScreen = function(){
                var searchDiv = $('.searchDiv')
                getTemplate('inputContentTemplate').appendTo(searchDiv);
                searchDiv.find('.inputOnly').remove();
                searchDiv.find('input,select').each(function(index,element){
                    var inputElement = $(element);
                    var searchKey = inputElement.attr('name');
                    inputElement.data('key',searchKey);
                    inputElement.attr('name','search_'+searchKey);
                });

                searchDiv.find('select').each(function(index,element){
                    var inputElement = $(element);
                    $('<option>',{value:'',selected:"selected"}).html("All").appendTo(inputElement);
                });

                var outputTemplate = getTemplate("displayContent");
                outputTemplate.find('label').removeClass('bolder').html("Tags: ");
                var tagJSON = getTags();
                var labelElement = outputTemplate.find('label');
                for(var tagName in tagJSON){
                    var tagSpan = $('<span>',{class:"leftMargin5"});
                    tagSpan.html(tagName + "("+tagJSON[tagName]+")");
                    $('<input>',{type:"checkbox",name:"tagName",value:tagName}).html("").appendTo(tagSpan);
                    tagSpan.insertAfter(labelElement);
                }
                outputTemplate.insertAfter(searchDiv.find('.inputFormRow').last());
            };
            showSearchScreen();
        });
    },
    function (err) {
        alert(err);
    }
);