function initializeLastRow() {
  // const submSheet = SpreadsheetApp.openById(BACKEND_ID).getSheetByName("Submissions");
  scriptProps.setProperty("lr",(8790).toString()); // change number to the last row you want to do. 
}

// /**
//  * row 1576 shows an example of the race condition of using a form submit with a getLastRow() 
//  */

// function initializeFormTrigger(){
//   const form = FormApp.openById("17sSSqjmpEeb1an8KtRYqEP29ms7FhAE-oMlqteGkFU0")
//   ScriptApp.newTrigger("mainWrapper")
//     .forForm(form)
//     .onFormSubmit()
//     .create();
// }

function setScriptProperties(){
  
  // if in production, this should be true
  scriptProps.setProperty("IS_PRODUCTION","true");
  scriptProps.setProperty("IS_CALL","true");
  
  // this will depend on chat or call schema/headers
  scriptProps.setProperty("DATE_SENT_HEADER","Date Sent");
  scriptProps.setProperty("TRANSCRIPT_ID_HEADER","Record ID");
  scriptProps.setProperty("TICKET_HEADER","Ticket#");
  scriptProps.setProperty("AGENT_NAME","Agents Name");
  scriptProps.setProperty("EMAIL_SENT","Email Sent");
  scriptProps.setProperty("SCORE_HEADER","Score");
  scriptProps.setProperty("AGENT_LOCATION","Agent Location");
  scriptProps.setProperty("TEAM_HEADER","Team");
  scriptProps.setProperty("CC_EMAIL_HEADER","CC Email");
  scriptProps.setProperty("<3_MONTHS_HEADER","<3 Months Hire");
  scriptProps.setProperty(">3_MONTHS_HEADER",">3 Months Hire");
  scriptProps.setProperty("TIMESTAMP_HEADER","Timestamp");
  scriptProps.setProperty("DATE_HEADER","Date");
  scriptProps.setProperty("MONTH_YEAR_HEADER","Month & Year");
  scriptProps.setProperty("PERC_SCORE_HEADER","% Score");
  scriptProps.setProperty("SUBMISSION_SHEET_NAME","'Call Scorecard Form Responses'");
  
  // coaching status header/field on form sheet
  scriptProps.setProperty("Coaching Status","Copied to coaching form? And when");
  
  // criteria fields/headers
  scriptProps.setProperty("DESCRIPTION_HEADER", "Description");
  scriptProps.setProperty("INTERNAL_NOTES_HEADER", "Internal Notes");
  scriptProps.setProperty("SECURITY_HEADER", "Did the agent adhere to all account security guidelines during the call?");
  scriptProps.setProperty("FILED_TICKET_HEADER","Did the agent file/document a ticket to record this interaction with the caller?");
  scriptProps.setProperty("BUSINESS_INFO_ACCORDINGLY_HEADER", "Did the agent fill out the business information accordingly?");
  scriptProps.setProperty("CALLER_NAME_HEADER", "Caller's Name");
  scriptProps.setProperty("CALLER_POSITION_HEADER", "Caller's Position");
  scriptProps.setProperty("CALLER_PHONE_HEADER", "Caller's Phone#");
  scriptProps.setProperty("CALLER_EMAIL_HEADER", "Caller's Email");
  scriptProps.setProperty("SUBJECT_HEADER", "Subject");
  scriptProps.setProperty("PROBLEM_DESCRIPTION_HEADER", "Problem Description ");
  scriptProps.setProperty("ACTION_PLAN_HEADER", "Action Plan");
  scriptProps.setProperty("SOLUTION_HEADER", "Solution Description");

  scriptProps.setProperty("WORK_AVOIDANCE_HEADER","Did the agent work efficiently?");
  scriptProps.setProperty("EVALUATOR_HEADER","Evaluators Name");
  scriptProps.setProperty("MID_DBA_HEADER","MID & DBA Name");
  
  // All these need to be granted permissions if you want to run the script
  scriptProps.setProperty("Response Sheet Name","Call Scorecard Form Responses");
  scriptProps.setProperty("BACKEND_ID","1Fsw8e7Htowi9uaB50XEbJXRAK3IuaNSoYFY9sNUpt8Y");
  scriptProps.setProperty("REPORTING_ID","1zQ98-rxOzfeq1QOmVeaC7OgOcZ0IaD7vv7_Vak7rclE");
  
  // reliability coaching reporting
  scriptProps.setProperty("REPORTING_SS_ID","1-h8et_sdVVSmUbKq-ZK86-K93VRyX80xW2r2fgmIIhQ");
  scriptProps.setProperty("REPORTING_SHEET_NAME","Coaching_Form_Data");
  
}