
window.onresize = async function (event) {
      await OnRezizeWindowEventAsync();
};

const defaultCodeHighlightSetting = "gruvbox-dark";
const minWindowWidth = 1040;
const codeBlockCornerRadius = "5px";



async function AddCodeHighlightStyleSheetToHeadFromLocalStorageSettingOrDefault() {
    var cssFileSettingFromLocalStorage = await GetCodehighlightCssFromLocalStorage();
    if (cssFileSettingFromLocalStorage == null) {
        cssFileSettingFromLocalStorage = defaultCodeHighlightSetting;
    }
    var styleSheetHref = chrome.extension.getURL("answer/codehighlights/styles/" + cssFileSettingFromLocalStorage + ".css");
    $("<link rel='stylesheet' type='text/css' href='" + styleSheetHref + "'> ").appendTo("head");
}


async function DisplayAnswer(answerModel) {
    await AddCodeHighlightStyleSheetToHeadFromLocalStorageSettingOrDefault();
    var displayableHtml = CreateDisplayableAnswerHtml(answerModel, true);
    await LoadHtmlIntoRightHandSideOfSearchPage(displayableHtml);
    InitFocusMode(CreateDisplayableAnswerHtml(answerModel, false));
    SetupCodeBlocks();
    if (ScreenWidthTooSmallForAnswer()) {
        Hide(answerHtmlId);
    }
}

function SetupCodeBlocks(){
    HighlightCodeBlocks();
    RoundCornersCodeBlocks();
    RemoveShellClassFromCodeBlocks();
}

function RemoveShellClassFromCodeBlocks(){
	var codeBlocks = document.getElementsByTagName("code");
    for(var i = 0; i < codeBlocks.length;i++){
        codeBlocks[i].classList.remove("shell");
    }
}

function CreateDisplayableAnswerHtml(answerModel, withFocusModeButton) {

    var html = GetQuestionLinkHtml(answerModel);
    html += "<br/>" + GetDateHtml(answerModel);
    html += "<br/>";
    if (answerModel.isAccepted) {
        html += GetAcceptedAnswerHtml() + "<br/>";
    }

    html += " <br/>"+ GetScoreBadgeHtml(answerModel);

    if(withFocusModeButton){
        html += GetFocusButtonHtml();
    }

    html += answerModel.answerInHtmlFormat;
	
    return html;
}

function GetQuestionLinkHtml(answerModel) {
	var readableQuestion = GetHtmlAsReadableText(answerModel.question);
    return "Answer for question: <a style='color:blue; font-weight:bold;' href='" + answerModel.link + "'>"
        + readableQuestion +
        "</a> ";
}

function GetHtmlAsReadableText(html){
	html = html.replaceAll("<", "&lt;");
	html = html.replaceAll(">", "&gt;");
    html = html.replaceAll("stackoverflow.com", "");
	return "<code style='font-family:inherit;'>" + html + "</code>";
}

function GetDateHtml(answerModel) {
    var date = answerModel.lastEditedDate == null ? answerModel.creationDate : answerModel.lastEditedDate;
    return "<i style='font-style:italic; color:gray; '>Posted: " + date + "</i> ";
}

function GetScoreBadgeHtml(answerModel) {
    let score = answerModel.score;
    return `<img style="border-radius:2px;" src="https://img.shields.io/badge/-${score}-blue.svg?label=Answer%20Score&color=F8752E&&style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjIwIDEwIDgwIDkwIj48c3R5bGU+LnN0MHtmaWxsOiNiY2JiYmJ9LnN0MXtmaWxsOiNmNDgwMjN9PC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNODQuNCA5My44VjcwLjZoNy43djMwLjlIMjIuNlY3MC42aDcuN3YyMy4yeiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zOC44IDY4LjRsMzcuOCA3LjkgMS42LTcuNi0zNy44LTcuOS0xLjYgNy42em01LTE4bDM1IDE2LjMgMy4yLTctMzUtMTYuNC0zLjIgNy4xem05LjctMTcuMmwyOS43IDI0LjcgNC45LTUuOS0yOS43LTI0LjctNC45IDUuOXptMTkuMi0xOC4zbC02LjIgNC42IDIzIDMxIDYuMi00LjYtMjMtMzF6TTM4IDg2aDM4LjZ2LTcuN0gzOFY4NnoiLz48L3N2Zz4="></img>`;
}

function GetAcceptedAnswerHtml() {
    return " <i style='color:green; width='20px;' height='20px;'> &#10004;</i> <i style='font-style:italic; color:gray; '>Answer accepted by question owner</i>  ";
}

function HighlightCodeBlocks() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block)
    });
}

function RoundCornersCodeBlocks(){
	var codeBlocks = document.getElementsByTagName("code");
	for(var i = 0; i < codeBlocks.length;i++){
		codeBlocks[i].style.borderRadius = codeBlockCornerRadius;
	}
}

chrome.extension.onRequest.addListener(function (newSettings, sender, sendResponse) {

    UpdateDisplayedAnswerWidthSetting(newSettings.width);
});

function UpdateDisplayedAnswerWidthSetting(width) {

    document.getElementById(answerHtmlId).style.width = width + "%";
}

async function OnRezizeWindowEventAsync() {
    if (!IsDisplayingAnswer()) {
        return;
    }

    if (ScreenWidthTooSmallForAnswer()) {
        Hide(answerHtmlId);
    }
    else {
        Show(answerHtmlId);
    }

    await ReCalculateAnswerWidthAsync();
}


function ScreenWidthTooSmallForAnswer() {
    var width = $(window).width();
    return width < minWindowWidth;
}

function Hide(htmlId) {
    document.getElementById(htmlId).style.display = "none";
}

function Show(htmlId) {
    document.getElementById(htmlId).style.display = "";
}

function IsDisplayingAnswer() {
    var html = document.getElementById(answerHtmlId);
    return html != null;
}

async function ReCalculateAnswerWidthAsync() {
    var userDefinedTheirOwnWidth = await GetShouldUseCustomWidthSettingFromLocalStorage();
    if (userDefinedTheirOwnWidth) {
        return;
    }

    var autoWidth = GetAutoDetectedWidth();
    UpdateDisplayedAnswerWidthSetting(autoWidth);
}
