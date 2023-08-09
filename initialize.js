function initializeLastRow() {
  const scriptProps = PropertiesService.getScriptProperties();
  // const submSheet = SpreadsheetApp.openById(BACKEND_ID).getSheetByName("Submissions");
  scriptProps.setProperty("lr",(5517).toString());
}

/**
 * row 1576 shows an example of the race condition of using a form submit with a getLastRow() 
 */

function initializeFormTrigger(){
  const form = FormApp.openById("17sSSqjmpEeb1an8KtRYqEP29ms7FhAE-oMlqteGkFU0")
  ScriptApp.newTrigger("mainWrapper")
    .forForm(form)
    .onFormSubmit()
    .create();
}