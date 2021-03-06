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
                var target = $(this).closest('.inputsDiv');
                var inviteeName = (target.find(inviteeNameSelector).val() || "").trim();
                if(inviteeName.length===0){
                    target.find(addInviteeButtonSelector).attr('disabled','disabled');
                    target.find(addDependentDivSelector).addClass('hidden');
                    return;
                }
                target.find(addDependentDivSelector).removeClass('hidden');
                target.find(addInviteeButtonSelector).removeAttr('disabled');
                
                if(target.find(dependentsDivSelector).html().trim()!==""){
                    target.find(dependentsDivSelector).find(dependentNameSelector).first().val(inviteeName);
                }else{
                    var dependents= getTemplate(attendingInputsTemplateSelector);
                    dependents.find(dependentNameSelector).val(inviteeName).attr('disabled','disabled');
                    dependents.find(removeDependentSelector).remove();
                    dependents.find(attendingFlagSelector).val("yes");
                    dependents.appendTo(target.find(dependentsDivSelector));
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
                var target = $(this).closest('.inputsDiv');
                var numberOfDependents = target.find('input[name="numberOfDependents"]').val() || 0;
                numberOfDependents = (Number.isNaN(numberOfDependents))?1:numberOfDependents*1;
                for(var i=0;i<numberOfDependents;i++){
                    getTemplate(attendingInputsTemplateSelector).appendTo(dependentsDivSelector);
                }
            });

            $(document).on('click','.showDemoContent',function(e){
                storeInvitees({"Robert Baratheon":{"location":"Kings Landing","address":"Palace Kings Landing.","tags":{"King" : " ", "Baratheon": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Robert Baratheon":"No","Cersei Lannister":"Maybe","Gendry":"Maybe"}},"Stannis Baratheon":{"location":"Dragonstone","address":"Fort Dragonstone","tags":{"Baratheon" : " ", "King": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Stannis Baratheon":"Maybe","Melisandre":"Maybe","Selyse Florent":"Maybe","Shireen Baratheon":"Maybe"}},"Renly Baratheon":{"location":"","address":"Graveyard","tags":{"King" : " ", "deceased" :" ", "Baratheon" : " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Renly Baratheon":"No"}},"Tywin Lannister":{"location":"Casterly Rock","address":"Palace Casterly Rock","tags":{"deceased" : " ", "Lannister": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Tywin Lannister":"No","Joanna Lannister":"No"}},"Daenerys Targaryen":{"location":"Free cities","address":"Free Cities","tags":{"Queen" : " ", "Targaryen": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Daenerys Targaryen":"Maybe","Drogon":"Maybe","Viserion":"Maybe","Rhaegal":"Maybe"}},"Jamie Lannister":{"location":"Kings Landing","address":"Palace Kings Landing","tags":{"Lannister" : " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Jamie Lannister":"Maybe","Joffrey Baratheon":"No","Myrcella Baratheon":"Maybe","Tommen Baratheon":"Maybe"}},"Eddard Stark":{"location":"Winterfell","address":"Winterfell","tags":{"deceased" : " ", "Stark": " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Eddard Stark":"Maybe","Catelyn Stark":"Maybe","Jon Snow":"Maybe","Robb Stark":"Maybe","Sansa Stark":"Maybe","Arya Stark":"Maybe","Bran Stark":"Maybe","Rickon Stark":"Maybe"}},"Tyrion Lannister":{"location":"Free cities","address":"Free cities","tags":{"Lannister" : " "},"inviteMode":"Visit","invitedFlag":"No","dependents":{"Tyrion Lannister":"Maybe"}}});
                displayContent();
            });

            $(document).on('click','.removeAll',function(e){
                storeInvitees({});
                displayContent();
               
            });

            $(document).on('click',removeDependentSelector,function(e){
                $(e.target).closest(dependentDetailsSelector).remove();
            });

            var updateInviteeJSON = function(inputFormDiv){
                var inviteeJSON = getInviteeJSON();
                var inputForm = inputFormDiv || '.inputForm';
                var inviteeName = $(inputForm).find(inviteeNameSelector).val();
                var tagsJSON ={};
                var tagsArray = ($(inputForm).find(inviteeTagsSelector).val() || "").split(/\s/);
                for(var i=0;i<tagsArray.length;i++){
                    tagsJSON[tagsArray[i]]=" ";
                }
                var inviteeDetails = {
                    location:($(inputForm).find(inviteeLocationSelector).val() || ""),
                    address:($(inputForm).find(inviteeAddressSelector).val() || ""),
                    tags:tagsJSON,
                    inviteMode:($(inputForm).find(inviteModeSelector).val() || ""),
                    invitedFlag:($(inputForm).find(invitedFlagSelector).val() || ""),
                    dependents:{}
                };
                $(inputForm).find(dependentsDivSelector).find(dependentDetailsSelector).each(function(index,element){
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

            var showRawContent = function(inviteeJSON){
                $(rawContentSelector).val(JSON.stringify(inviteeJSON));
            };

            var importFromRawContent = function(){
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
            };

            $(document).on('click','.importFromRawContent',importFromRawContent);

            var populateInputForm = function(invitee,inviteeDetails,target){
                target = target || $(".inputForm");
                resetInputs();
                target.find(inviteeNameSelector).val(invitee).attr('disabled','disabled');
                target.find(inviteeLocationSelector).val(inviteeDetails.location);
                target.find(inviteeAddressSelector).val(inviteeDetails.address);
                target.find(inviteeTagsSelector).val(Object.keys(inviteeDetails.tags).join(" "));
                target.find(invitedFlagSelector).val(inviteeDetails.invitedFlag);
                target.find(inviteModeSelector).val(inviteeDetails.inviteMode);

                var dependentsDiv = target.find(dependentsDivSelector);
                dependentsDiv.html("");
                for(var dependent in inviteeDetails.dependents){
                    var dependents= getTemplate(attendingInputsTemplateSelector);
                    dependents.find(dependentNameSelector).val(dependent);
                    dependents.find(attendingFlagSelector).val(inviteeDetails.dependents[dependent]);
                    dependents.appendTo(dependentsDiv);
                }
                dependentsDiv.find(removeDependentSelector).first().remove();
                dependentsDiv.find(dependentNameSelector).first().attr('disabled','disabled');
                dependentsDiv.find(dependentDetailsSelector).first().find(removeDependentSelector).remove();
                if(dependentsDiv.html().trim()!==""){
                    target.find(addDependentDivSelector).removeClass("hidden");
                }
            };

            $(document).on('click',showEditFormSelector,function(e){
                var inviteeJSON = getInviteeJSON();
                var invitee = $(e.target).closest('tr').data(data_invitee);
                populateInputForm(invitee,inviteeJSON[invitee]);
                setTimeout(function(){
                    $(actionButtonSelector).removeAttr('disabled').html("Update").removeClass(addInviteeClass).addClass(editInviteeClass);
                    removeInviteeRows(invitee);
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

            var filterInvitees = function(searchDiv){
                var searchInviteeName = ($(searchDiv).find('input[name="search_inviteeName"]').val() || "").trim();
                
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

                var searchLocation = ($(searchDiv).find('input[name="search_inviteeLocation"]').val() || "").trim();
                
                var searchInviteMode = ($(searchDiv).find('select[name="search_inviteModeFlag"]').val() || "").trim();
                var searchInvitedFlag = ($(searchDiv).find('select[name="search_invitedFlag"]').val() || "").trim();
                var searchTags = {};
                $(searchDiv).find('input[name="tagName"]:checked').each(function(){
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
                return filteredJSON;
            };

            var searchInvitees = function(){
                var filteredJSON = filterInvitees('.searchDiv');
                showInvitees(filteredJSON);
            };

            $('.searchDiv').on('keyup','input[name="search_inviteeName"]',searchInvitees);
            $('.searchDiv').on('keyup','input[name="search_inviteeLocation"]',searchInvitees);
            $('.searchDiv').on('change','select[name="search_inviteModeFlag"]',searchInvitees);
            $('.searchDiv').on('change','select[name="search_invitedFlag"]',searchInvitees);
            $('.searchDiv').on('change','input[name="tagName"]',searchInvitees);

            var showPerson = function(filteredJSON,index){
                var dialog = $('.dialog');
                dialog.find('button').remove();
                var dialogContent = $('.dialogContent').html("");
                var personName = Object.keys(filteredJSON)[index];
                populateInputForm(personName,filteredJSON[personName]);
                setTimeout(function(){
                    var inputForm = $('.inputForm').clone().removeClass('hidden');
                    inputForm.find('.hint').remove();
                    inputForm.find('button').remove();
                    inputForm.appendTo(dialogContent);
                    if(Object.keys(filteredJSON)[index+1]){
                        $('<button>',{class:"showNext floatRight"}).html("Next").on('click',function(){
                            updateInviteeJSON('.dialog');
                            searchInvitees();
                            inputForm.fadeOut('slow',function(){
                                showPerson(filteredJSON,index+1);
                            });
                        }).insertAfter(dialogContent);
                    }
                    if(index>0){
                        $('<button>',{class:"showPrevious floatLeft"}).html("Previous").on('click',function(){
                            updateInviteeJSON('.dialog');
                            searchInvitees();
                            inputForm.fadeOut('slow',function(){
                                showPerson(filteredJSON,index-1);
                            });
                        }).insertAfter(dialogContent);
                    }
                    if(!dialog.is(":visible")){
                        dialog.fadeIn('slow');
                    }else{
                        inputForm.fadeIn('slow');
                    }
                },20);
            };
            $(".startProcessing").click(function(){
                var filteredJSON = filterInvitees('.searchDiv');
                console.log(filteredJSON);
                $('.mask').show();
                showPerson(filteredJSON,0);
            });

            $(".closeDialog").click(function(){
                $('.mask').fadeOut('slow');
                resetInputs();
                $('.dialog').fadeOut('slow');
            });

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
                    if(inviteeDetails.inviteMode=="Post"){
                        summaryJSON["Total post"] = (summaryJSON["Total post"] || 0)+1;
                        if(inviteeDetails.invitedFlag!="Yes"){
                            summaryJSON["Post pending"] = (summaryJSON["Post pending"] || 0)+1;
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
                showRawContent(getInviteeJSON());
                $('.tab.showInviteeList').click();
            };

            displayContent();

            var showSearchScreen = function(searchDivInput){
                var searchDiv = $(searchDivInput);
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
            showSearchScreen('.searchDiv');

            var inviteeFields = [
                {inviteeName:{content:"text"}},
                {dependentName:{content:"text"}},
                {location:{content:"text"}},
                {address:{content:"text"}},
                {tags:{content:"text"}},
                {inviteMode:"Visit,Call,Post"},
                {invitedFlag:"Yes,No"},
                {attendingFlag:"Yes,No"},
            ];

            var getInviteeFieldsAsArray = function(){
                var inviteeFieldArray = [];
                for(var i=0;i<inviteeFields.length;i++){
                    inviteeFieldArray = inviteeFieldArray.concat(Object.keys(inviteeFields[i])[0]);
                }
                return inviteeFieldArray;
            };

            var getFieldRepresentation = function(input){
                if(typeof input =="string"){
                    return input;
                }
                if(Array.isArray(input)){
                    return input.join(" ");
                }
                if(typeof input == 'object'){
                    return Object.keys(input).join(" ");
                }
            };

            $(document).on('click','.exportToCSV',function(){
                var inviteeJSON = getInviteeJSON();
                var inviteeFieldsArray = getInviteeFieldsAsArray();
                var csvContent = inviteeFieldsArray.join(',');
                for(var inviteeName in inviteeJSON){
                    var inviteeDetails = inviteeJSON[inviteeName];
                    for(var dependentName in inviteeDetails.dependents){
                        var line =inviteeName+","+dependentName;
                        for(var i=0;i<inviteeFieldsArray.length;i++){
                            var fieldName = inviteeFieldsArray[i];
                            if(fieldName == 'inviteeName' || fieldName == 'dependentName'){
                                continue;
                            }
                            var fieldToPass = (typeof inviteeDetails[fieldName] == "undefined")?inviteeDetails.dependents[dependentName]:inviteeDetails[fieldName];
                            var fieldRepresentation = getFieldRepresentation(fieldToPass);
                            line = line +"," + fieldRepresentation;
                        }
                        csvContent = csvContent +"\n"+ line;
                    }
                }
                $('.csvContainer').html(csvContent);
            });

            $(document).on('click','.importFromCSV',function(){
                var invitees = [];
                var csvContent = $('.csvContainer').html() || "";
                var inviteeFieldsArray = getInviteeFieldsAsArray();
                var lines = csvContent.split('\n');
                for(var i=1;i<lines.length;i++){
                    var line = lines[i];
                    var lineFields = line.split(',');
                    if(lineFields.length!=inviteeFieldsArray.length){
                        alert('Did not find the necessary number of fields in line '+ i);
                        return;
                    }
                    var inviteeDetails = {};
                    for(var j=0;j<inviteeFieldsArray.length;j++){
                        inviteeDetails[inviteeFieldsArray[j]]=lineFields[j];
                    }
                    invitees = invitees.concat(inviteeDetails);
                }
                var inviteeJSON = {};
                for(i=0;i<invitees.length;i++){
                    var lineInviteeDetails = invitees[i];
                    if(!inviteeJSON[lineInviteeDetails.inviteeName]){
                        var tagsArray = (lineInviteeDetails.tags).split(/\s/);
                        var tagsJSON  ={};
                        for(var i=0;i<tagsArray.length;i++){
                            tagsJSON[tagsArray[i]]=" ";
                        }
                        var inviteeDetails = {
                            invitedFlag:lineInviteeDetails.invitedFlag,
                            inviteMode:lineInviteeDetails.inviteMode,
                            location:lineInviteeDetails.location,
                            tags:tagsJSON,
                            address:lineInviteeDetails.address,
                            dependents:{}
                        };
                        inviteeDetails.dependents[lineInviteeDetails.inviteeName] = lineInviteeDetails.attendingFlag;
                        inviteeJSON[lineInviteeDetails.inviteeName] = inviteeDetails;
                    }else{
                        inviteeJSON[lineInviteeDetails.inviteeName].dependents[lineInviteeDetails.dependentName]=lineInviteeDetails.attendingFlag;
                    }
                }
                showRawContent(inviteeJSON);
                setTimeout(importFromRawContent,20);
                
            });
        });
    },
    function (err) {
        console.error(err.message,err.stack);
        alert(err);
    }
);