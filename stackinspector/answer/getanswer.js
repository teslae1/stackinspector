chrome.extension.sendMessage({}, OnPageLoad);


const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];


function OnPageLoad() {
    if (!HasStackOverflowLinkInSearchResults()) {
        return;
    }
    StartGetAndShowAnswerProcess();
}

function HasStackOverflowLinkInSearchResults() {
    var html = document.getElementsByClassName("yuRUbf");
    for (let result of html) {
        if (IsValidSearchResult(result) &&
            IsStackOverflowSearchResult(result)) {
                return true;
        }
    }
    return false;
}

async function StartGetAndShowAnswerProcess() {

    ShowLoadingIcon();

    try {
        var answer = await GetFirstOrDefaultAnswer();
        await DisplayAnswer(answer);
    }
    catch (ee) {
        await HandleNoAnswerFound();
    }
}

async function HandleNoAnswerFound() {
    setTimeout(async function () {
        HideLoadingIcon();
	   await DisplayNoAnswerFoundMessageAsync(); 
    }, 200);
}

async function GetFirstOrDefaultAnswer() {
    var html = document.getElementsByClassName("yuRUbf");
    for (let result of html) {
        if (IsValidSearchResult(result) &&
            IsStackOverflowSearchResult(result)) {
            try {
                return await GetValidStackoverflowAnswerAsync(result);
            }
            catch (ee) {
            }
        }
    }
}

function IsValidSearchResult(result) {
    return result.nodeName === "DIV";
}

function IsStackOverflowSearchResult(result) {
    return result.textContent.includes("stackoverflow.com");
}

async function GetValidStackoverflowAnswerAsync(result) {
    let response = await GetResponse(result);
    let jsonResponse = await response.json();
    EnsureJsonResponseHoldsAnswers(jsonResponse);

    var allAnswers = jsonResponse.items;

    //sequence below favors accepted answers 
    var answer = GetAcceptedAnswer(allAnswers, result);
    if (answer != null) {
        return answer;
    }

        answer = GetTopMostRatedAnswer(allAnswers, result);
        if(answer.score < 1){
            throw ("No answers found rated more than 0");
        }

    return answer;
}


function EnsureJsonResponseHoldsAnswers(jsonResponse) {
    if (jsonResponse.items.length < 1) {
        throw ("no answers contained inside this question");
    }
}

function GetAcceptedAnswer(allAnswers, htmlResult) {
    for (var i = 0; i < allAnswers.length; i++) {
        if (allAnswers[i].is_accepted) {
            return CreateAnswerObject(allAnswers[i], htmlResult);
        }
    }
    return null;
}

function CreateAnswerObject(answer, htmlResult) {
    var lastEditedDate = GetDateAsString(answer.last_edit_date);
    var creationDate = GetDateAsString(answer.creation_date);
    return {
        answerInHtmlFormat: answer.body,
        score: answer.score,
        question: GetQuestionFromHtmlResult(htmlResult),
        link: GetQuestionLinkFromhtmlResult(htmlResult),
        lastEditedDate: lastEditedDate,
        creationDate: creationDate,
        isAccepted: answer.is_accepted
    };
}

function GetTopMostRatedAnswer(allAnswers, htmlResult) {
    //top most rated is always first in collection 
    return CreateAnswerObject(allAnswers[0], htmlResult);
}

function GetDateAsString(unixTimeStamp) {
    if (unixTimeStamp == null) {
        return null;
    }
    var date = new Date(unixTimeStamp * 1000);
    var monthName = months[date.getMonth()];

    return monthName + " " + date.getUTCDate() + "' " + date.getFullYear();
}


const regex = "stackoverflow.com/questions/(.*?)/";
const uriStart = "https://api.stackexchange.com/2.2/questions/";
const uriEnd = "/answers?&site=stackoverflow&filter=withbody&sort=votes";
async function GetResponse(result) {
    let part = GetPath(result);
    let response = await fetch(uriStart + part + uriEnd);
    if (IsBadResponse(response)) {
        throw ("bad response");
    }
    return response;
}

function GetPath(result) {
    let href = result.childNodes[0].href;
    let matches = href.match(regex);
    return matches[1];
}

function IsBadResponse(response) {
    return response == null || !response || response.status !== 200;
}

function GetQuestionFromHtmlResult(result) {
    var questionContent = result.textContent;
    var question = result.textContent.substring(0, result.textContent.indexOf("- Stack"));
    if (question == null || question.length == 0) {
        question = result.textContent.substring(0, result.textContent.indexOf("https://stackoverflow.com"))
    }
    return question;
}

function GetQuestionLinkFromhtmlResult(result) {
    return result.firstChild.href;
}
