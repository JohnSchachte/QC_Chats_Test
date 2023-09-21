/**
 *
 *
 * @param {*} row
 * @param {*} colMap
 * @param {*} categories
 */
function transformReliabilityReporting(row,colMap,categories,rowIndex,reliabilityColMap,agentObj){
    /**
     * SCHEMA DEFINITION FOR THIS TABLE:
     * Evaluator
     * Date Scored:
     * Agent's Name
     * Record ID/Chat line # w/hyperlink
     * Score
     * Ticket# w/Hyperlink
     * Below 75%
     * Ticket handling(3 or more)
     * Security Violation
     * No Ticket/Documents
     * Work Avoidance  */
    const transFormedRow = new Array(12);
    let colMapString = "";
    colMap.forEach((value,key) => colMapString += `${key} : ${value} \n` );
    colMapString = "";
    reliabilityColMap.forEach((value,key) => colMapString += `${key} : ${value} \n` );
    transFormedRow[reliabilityColMap.get("Evaluator")] = row[colMap.get(EVALUATOR_HEADER)]; 
    transFormedRow[reliabilityColMap.get("Date Scored:")] = new Date().toLocaleDateString();
    transFormedRow[reliabilityColMap.get("Agent's Name")] = row[colMap.get(AGENT_NAME_HEADER)];
    transFormedRow[reliabilityColMap.get("Agent's Team")] = agentObj["Team"];
    transFormedRow[reliabilityColMap.get("Record ID/Chat line # w/hyperlink")] =  transformTranscriptIds(row[colMap.get(TRANSCRIPT_ID_HEADER)]).map(({href}) => href).join(",\n");
    transFormedRow[reliabilityColMap.get("Score")] = calculateScore(row[colMap.get(SCORE_HEADER)]);
    let ticketNumber = row[colMap.get(TICKET_HEADER)];
    transFormedRow[reliabilityColMap.get("Ticket# w/HyperLink")] = ((/\d{7}/g).test(ticketNumber) ? ticketNumber.match((/\d{7}/g)).map(el => {return "https://tickets.shift4.com/#/tickets/"+el}) : ["No Ticket Link"]).join(",\n");
    transFormedRow[reliabilityColMap.get("Below 75%")] = categories.includes("Scored Below 75%");
    transFormedRow[reliabilityColMap.get("Ticket Handling(3 or more)")] = categories.includes("Ticket Handling");
    transFormedRow[reliabilityColMap.get("Security Violation")] = categories.includes("Security Violation");
    transFormedRow[reliabilityColMap.get("No Ticket Filed/Documents")] = categories.includes("No ticket filed/documented");
    transFormedRow[reliabilityColMap.get("Work Avoidance")] = categories.includes("Work Avoidance");
    transFormedRow[reliabilityColMap.get("Row Index")] = rowIndex;
    Logger.log("reportRow = %s",transFormedRow);
    return transFormedRow;
}

function sendReportingData(row,colMap,categories,rowIndex,agentObj){
    const reportingSS = "1-h8et_sdVVSmUbKq-ZK86-K93VRyX80xW2r2fgmIIhQ";
    const reportingSheet = SpreadsheetApp.openById(reportingSS).getSheetByName(RELIABILITY_REPORTING_SHEET_NAME);
    const reliabilityColMap = Custom_Utilities.mkColMap(reportingSheet.getSheetValues(1,1,1,reportingSheet.getLastColumn())[0]);
    const reportingRow = transformReliabilityReporting(row,colMap,categories,rowIndex,reliabilityColMap,agentObj);
    reportingSheet.appendRow(reportingRow);
}