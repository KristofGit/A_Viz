document.addEventListener('DOMContentLoaded', function() {
printTraceInformation();
add_possible_events_to_UI();
registerOnAllRadioButtons();
registerSubmitButtons();
handleWebsiteLoaded();
}, false);

function registerSubmitButtons() {
var submitnext = document.getElementById('submitnext');
submitnext.onclick = function(){
searchForNextAnomaly();
}

var submitfinish = document.getElementById('submitfinish');
submitfinish.onclick = function(){
foundAllAnomalies();
}

var dbtoconsol = document.getElementById('dbtoconsol');
dbtoconsol.onclick = function(){
print_storage_to_console();
}
}

function printTraceInformation() {
 
 const s = getParticipantNumber();
 const t = getParticipantTrace();
 const p = getParticipantProcess();
 const sm = getSupportModeProcess();

 var paragraph = document.getElementById("TraceAndProcessInfo");
 var text = document.createTextNode(`Evaluation for process:${p}, trace:${t}, mode:${sm}, and participant:${s}`);  
 paragraph.appendChild(text);                                 
}

function getParticipantNumber()
{
   let params = extractUrlParameters();
   return params['?student'];
}

function getParticipantTrace()
{
   let params = extractUrlParameters();
   return parseInt(params['trace']);
}

function getParticipantProcess()
{
   let params = extractUrlParameters();
   return parseInt(params['process']);
}

function getSupportModeProcess()
{
   let params = extractUrlParameters();
   return (params['supportmode']);
}

function extractUrlParameters()
{
let parameters = window.location.search;
let parametersArray = parameters.split('&');

let result = new Array();
for (const eachParam of parametersArray) {
let paramSplit = eachParam.split('=');
let key = paramSplit[0];
let value = paramSplit[1];

result[key]=value;
}

return result;
}

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function store_object(json) {
   localStorage.setItem(get_unused_storage_key(), JSON.stringify(json));
}

function print_storage_to_console() {
      console.log("Printing DB console");
   for (var i = 0; i < localStorage.length; i++){
      let storageItem = localStorage.getItem(localStorage.key(i));
      console.log(storageItem);
   }
}

function get_unused_storage_key() {
   return localStorage.length+1;
}

function add_possible_events_to_UI() {

   const possibleEvents = get_all_possible_event_names();
   let eventForm = document.getElementById("EventSelection");

   console.log(possibleEvents);


   for (eachEvent of possibleEvents) {
   
      let label = document.createElement("label");
         
      let formInput = document.createElement("input");
      formInput.setAttribute('type',"radio");
      formInput.setAttribute('name', "affectedEvent");
      formInput.setAttribute('value', eachEvent);
      
      var radioButtonText = document.createTextNode("<="+eachEvent);

      label.appendChild(formInput);
      label.appendChild(radioButtonText);            
      eventForm.appendChild(label);
      
      formInput.onclick = enableIssueTypeForm;
   }
}

function registerOnAllRadioButtons()
{
    var inputs = document.getElementsByTagName('input');
   for (eachInput of inputs) {
      if (eachInput.type == 'radio') {
          eachInput.addEventListener('click', function(event) {
            handleRadioButtonChanged(event);
         });
      }
   }
}

function areTwoRadioButtonsChecked()
{
   var amountOfCheckedRadioButtons = 0;
   var inputs = document.getElementsByTagName('input');
   for (eachInput of inputs) {
      if (eachInput.type == 'radio') {
         if(eachInput.checked)
         {
            amountOfCheckedRadioButtons++;
         }
      }
   }

   return amountOfCheckedRadioButtons;
}

function getBaseRecordObject() {
   var recordChange = new Object();
   recordChange.entryid = get_unused_storage_key();
   recordChange.process = getParticipantProcess();
   recordChange.trace = getParticipantTrace();
   recordChange.participant = getParticipantNumber();
   recordChange.supportmode = getSupportModeProcess();
   recordChange.datetime = getDateTime();
   return recordChange;
}

function searchForNextAnomaly() {

   var enoughRadioChecked = areTwoRadioButtonsChecked();

   if(enoughRadioChecked==2)
   {
   var recordChange = getBaseRecordObject();
   recordChange.state="finished intermediate";
   
   store_object(recordChange);
   print_storage_to_console();
   
   window.alert("Thank you, you can now begin to search for an additonal anomaly.");   
   location.reload(true);
   }
   else
   {
   window.alert("It seems as that you have not selected an event number or type and an anomaly type.");   
   }
}

function foundAllAnomalies() {

   var recordChange = getBaseRecordObject();
   recordChange.state="finished completely";

   store_object(recordChange);
   print_storage_to_console();
   
   window.alert("Thank you, please wait for instructions.");
}

function getDateTime() {
   var today = new Date();
   var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
   var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
   var dateTime = date+' '+time;
   return dateTime;
}

function handleWebsiteLoaded() {
   
   var recordChange = getBaseRecordObject();
   recordChange.state = "website loaded";
   
   console.log(recordChange);
   store_object(recordChange);
   print_storage_to_console();
}


function handleRadioButtonChanged(event) {
   
   var radioButton = event.target || event.srcElement;
   
   var recordChange = getBaseRecordObject();
   recordChange.state = "new radio selection";
   recordChange.radiobuttonname = radioButton.name;
   recordChange.radiobuttonvalue = radioButton.value;
   recordChange.radiobuttonchecked = radioButton.checked;
   
   console.log(recordChange);
   store_object(recordChange);
   print_storage_to_console();
}


function enableIssueTypeForm() {

   let fieldsets = ["ActivityIssue", "ResourceIssue", "TimeIssue"];
   
   for (eachFieldSet of fieldsets) {
      let fieldSet = document.getElementById(eachFieldSet);
      fieldSet.disabled = false;
   }
}

function get_all_possible_event_names() {
  
  let eventCount = 0;
  let missingEnd = false;
  switch (getParticipantProcess()) {
  case 1:
    switch (getParticipantTrace()) {
      case 1:
        eventCount=5;
        break;
      case 2:
        eventCount=6;
        missingEnd = true;
        break;
      case 3:
        eventCount=4;
        break;
    }
    break;
  case 2:
    switch (getParticipantTrace()) {
      case 1:
        eventCount=3;
        break;
      case 2:
        eventCount=4;
        break;
      case 3:
        eventCount=5;
        break;
    }
    break;
  }
  
  let result = ["Missing Event", "Start E1"];
  
  for (i = 0; i < eventCount; i++) { 
    result.push(`Event number E${i+2}`);
  }
  
  if(!missingEnd) {
      result.push(`End E${eventCount+2}`);
  }
  
  return result;
}
