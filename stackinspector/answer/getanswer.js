chrome.extension.sendMessage({}, OnPageLoad);

const minScoreForValidAnswers = 1;

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
            try {
                return true;
            }
            catch (ee) {
            }
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
    catch {
        WaitAndHideLoadingIcon(200);
    }
}

function WaitAndHideLoadingIcon(timeToWaitMilliseconds) {
    setTimeout(function () {
        HideLoadingIcon();
    }, timeToWaitMilliseconds);
}

function SleepMilisecondsAndHideLoadingIcon(milisecondsToWait) {
    setTimeout(function () {
        HideLoadingIcon();
    }, milisecondsToWait
    );
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
    var score = jsonResponse.items[0].score;
    if (score < minScoreForValidAnswers) {
        throw "invalid score";
    }

    var lastEditedDate = GetDateAsString(jsonResponse.items[0].last_edit_date);
    var creationDate = GetDateAsString(jsonResponse.items[0].creation_date);
    if (questionHadAnswers(jsonResponse)) {
        return {
            answerInHtmlFormat: jsonResponse.items[0].body,
            score: score,
            question: GetQuestionFromHtmlResult(result),
            link: GetQuestionLinkFromhtmlResult(result),
            lastEditedDate: lastEditedDate,
            creationDate: creationDate

        };
    }
    else {
        throw ("no answer");
    }

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

function questionHadAnswers(jsonResponse) {
    return jsonResponse.items.length;
}

function GetQuestionFromHtmlResult(result) {
    var question = result.textContent.substring(0, result.textContent.indexOf("- Stack"));
    if (question == null || question.length == 0) {
        question = result.textContent.substring(0, result.textContent.indexOf("stackoverflow.com"))
    }
    return question;
}

function GetQuestionLinkFromhtmlResult(result) {
    return result.firstChild.href;
}