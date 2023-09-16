/**
 * @param {*} e - event object from trigger
 * @returns {void} 
 */
function initializeAlertAndCoachingOnLowScore(e){
    Custom_Utilities.deleteSelfTrigger(ScriptApp,e.triggerUid);
    const cache = CacheService.getScriptCache();
    const cacheValue = cache.get(e.triggerUid);
    if(!cacheValue){
        Logger.log("No cache value found");
        Gmail.sendEmail("jscahchte@shift4.com,pi@shift4.com","No cache value found","No cache value found. Script Id: 1Yts8oTB89I_dvkIMkxIaDcrqsnLL_d7vSmtmDxPzkjqOI43gA5so84kk");
        return;
    }
    const {row,agentObj,score,updateValues,rowIndex} = JSON.parse(cacheValue);
    alertAndCoachOnLowScore(row,agentObj,score,updateValues,rowIndex);

}
function alertAndCoachOnLowScore(row,agentObj,score,updateValues,rowIndex){

    /**TODO:
     * 1. get column map - done
     * 2. ensure agent is apart of the coaching process
     * 4. assign categories based on On Demand Coaching Form
     * 5. Assign severities based on JIRA TICKET: https://shift4.atlassian.net/browse/PIP-821
     * 3. setup coaching row
     * 4. send to coaching sheet endpoint
     * 5. send email to supervisor,manager
     * 6. write back to the sheet in "Copied to coaching form? And when"
     */
    const colMap = getColMap();
    if(!OperationCoachingMembers.isInEmailSet(agentObj["Email Address"].toLowerCase())){
        /** TODO
         * 1. write to sheet in column "Copied to coaching form? And when"
         */
        return false;
    }
    
    const {severity,categories} = determineCoachingNeed(row,colMap,score);
    if(!severity){
        /**TODO
         * 1. write to sheet in column "Copied to coaching form? And when" as not added or something.
         */
        return false;
    }

    const getHttp = function (team,cache){
        const getTeams = Custom_Utilities.memoize( () => CoachingRequestScripts.getTeams(REPORTING_ID),cache);
        const teams = getTeams();
        for(let i=0;i<teams.length;i++){
            if(teams[i].values[0].includes(team)){
            return teams[i].values[0][2]; // replace this with web app url
            }
        }
        throw new Error("Team is not on Operation Coaching Master Sheet");
    };

    const memoizedGetHttp = Custom_Utilities.memoize(getHttp,cache);

    const caseArray = mkCaseArray(row,colMap,agentObj,severity,categories);
    
    const requestOptions = {
        method: 'post',
        contentType: 'application/json',
        headers: {
            Authorization: 'Bearer ' + CoachingRequestScripts.getOAuthService().getAccessToken()
        }
    };
    
    const endPoint = memoizedGetHttp(agentObj["Team"],cache);

    const name = agentObj["Employee Name"].toLowerCase().trim();

    requestOptions["payload"] = JSON.stringify(caseArray); // prepare for request
    
    const result = retry(() => sendHttpWIthRetry(endPoint,requestOptions));
    
    return result; // return denied or stopped
}

function sendHttpWIthRetry(endPoint,requestOptions){
    const response = UrlFetchApp.fetch(endPoint,requestOptions);
    return JSON.parse(response.getContentText());
}