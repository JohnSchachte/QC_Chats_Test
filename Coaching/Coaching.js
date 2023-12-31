/**
 * Initializes the alert and coaching process after verifying cache value.
 * If the cache is not available, sends an email alert.
 *
 * @param {Object} e - Event object from the trigger.
 * @returns {void} 
 */
function initializeAlertAndCoaching(e) {
    // Delete the trigger that initiated this script
    Custom_Utilities.deleteSelfTrigger(e, ScriptApp);

    const cache = CacheService.getScriptCache();
    const cacheValue = cache.get(e.triggerUid);

    // If cache value is missing, log it and send an email alert
    if (!cacheValue) {
        Logger.log("No cache value found");
        GmailApp.sendEmail("jschachte@shift4.com,pi@shift4.com", "No cache value found", "No cache value found. Script Id: 1Yts8oTB89I_dvkIMkxIaDcrqsnLL_d7vSmtmDxPzkjqOI43gA5so84kk");
        return;
    }

    // Parse cached values
    const { row, agentObj, score, updateValues, rowIndex } = JSON.parse(cacheValue);
    Logger.log("parameters: %s", { row, agentObj, score, updateValues, rowIndex });

    // Initiate coaching process
    alertAndCoach(row, agentObj, score, rowIndex);
}

/**
 * Main function to process the coaching for the given row data.
 *
 * @param {Array} row - The row data from the spreadsheet.
 * @param {Object} agentObj - Information about the agent.
 * @param {Number} score - The score or rating for the coaching session.
 * @param {Number} rowIndex - The index of the row being processed.
 * @returns {boolean|void} - False if process is stopped early, otherwise no return.
 */
function alertAndCoach(row, agentObj, score, rowIndex) {
    Logger.log("alertAndCoach called for row: %s", rowIndex);
    Logger.log("agentObj: %s", JSON.stringify(agentObj));
    Logger.log("score: %s", score);
    Logger.log("row: %s", JSON.stringify(row));

    // Open the response sheet and fetch column mapping
    const responseSheet = SpreadsheetApp.openById(BACKEND_ID).getSheetByName(RESPONSE_SHEET_NAME);
    const colMap = getColMap();

    const transactionWriter = Custom_Utilities.writeTransactionManagerFactory(responseSheet,colMap);
    const addValueToTransactionWriter = (value) => transactionWriter.addValue(COACHING_STATUS_HEADER,rowIndex,value,false);
    // If agent is not part of the coaching set, log it and send an email alert
    if (!OperationCoachingMembers.isInEmailSet(agentObj["Email Address"].toLowerCase())) {
        addValueToTransactionWriter ("Agent's Team is Not in Coaching Process. Timestamp: " + new Date().toLocaleString());
        GmailApp.sendEmail("jschachte@shift4.com,pi@shift4.com", "Agent Not in Coaching Process: " + agentObj["Employee Name"], "Script: 1Yts8oTB89I_dvkIMkxIaDcrqsnLL_d7vSmtmDxPzkjqOI43gA5so84kk\n\nRow: " + rowIndex + "\n\n" + JSON.stringify(agentObj));
        transactionWriter.commit();
        return false;
    }

    const { severity, categories } = determineCoachingNeed(row, colMap, score);

    // If no coaching is needed, log it and update the sheet
    if (!severity) {
        addValueToTransactionWriter("No Coaching needed. Timestamp: " + new Date().toLocaleString());
        transactionWriter.commit();
        return false;
    }
    Logger.log("severity: %s", severity);
    Logger.log("categories: %s", categories);
    // Header information for coaching
    const coachingHeaders = {
        "Request Id" : 0,
        "Timestamp" : 1,
        "Agent's Name" : 2,
        "Supervisor" : 3,
        "Email Address" : 4,
        "Coaching Identifier?" : 5,
        "Ticket Link" :6,
        "Severity?":7,
        "Category?":8,
        "Describe?":9
    };

    let coachingRow, coachingId;
    try {
        ({ coachingRow, coachingId } = sendCoachingData(row, colMap, agentObj, severity, categories, rowIndex, coachingHeaders));
    } catch (f) {
      // object in Error file
        if (f instanceof CoachingIdNull) {
            addValueToTransactionWriter(f.message);
            transactionWriter.commit();
            return;
        } else if (f instanceof HTTPError) {
            addValueToTransactionWriter(f.message);
            transactionWriter.commit();
            return;
        } else {
            throw f;
        }
    }
    
    // No errors so keep going
    addValueToTransactionWriter(`Coaching Id: ${coachingId}\n Timestamp: ${new Date().toLocaleString()}\nSeverity: ${severity}\nCategories: ${categories}`);
    console.log("coachingRow = %s", coachingRow);
    console.log("coachingId = %s",coachingId);
    
    // Sending management email with coaching details
    const sendManagementCoachingEmailBound = sendManagementCoachingEmail.bind({ coachingHeaders });
    try{
        
        const emailArray = DoEmails.mkEmailArray(row, colMap, (score*10000).toFixed(2));
        Logger.log(emailArray);
        sendManagementCoachingEmailBound(coachingRow, agentObj, emailArray,coachingId );
    }catch(f){
      Logger.log(f);
      Logger.log(f.name)
      if(f.name === "NoManagementEmailFound" || f.name === "NonMemberTeam"){
        addValueToTransactionWriter(f.message);
      }
    }
    sendReportingData(row, colMap, categories, rowIndex, agentObj);
    transactionWriter.commit();
}