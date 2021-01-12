
const loadingImageHtml = "<img style='height:80; color:red; background-color:transparent; width:60px; padding-right:44px;' src='https://infallible-aryabhata-eaf64f.netlify.app/cloadinggif.gif' />";
const loadingIconHtmlId = "loadingIcon";
const questionHtmlId = "question";
const questionHtmlFadeInMiliseconds = 1000;
const defaultFontSize = 16;
const answerZIndex = 2;
const defaultCodeHighlightSetting = "gruvbox-dark";
const maxAnswerWidthInPixels = 950;
const gifSizePixels = 45;

async function LoadHtmlIntoRightHandSideOfSearchPage(html) {
    var width = await GetAnswerWidthSettingFromLocalStorageOrDefault();
    var fontSize = await GetAnswerFontSizeSettingFromLocalStorageOrDefault();
    var lineBreaksForTopOffset = GetTopOffsetAsHtmlLineBreaks(fontSize);
    var startHtml = "<div id='" + questionHtmlId + "' class='col-12'  style=' font-size:" + fontSize + "px; display:none;  width:" + width + "%;  text-overflow:ellipsis; z-index:" + answerZIndex + "; position:absolute; right:5%; text-align:left;'> " + lineBreaksForTopOffset + html + " </div>"
    var atvcapDiv = document.getElementById("atvcap");
    atvcapDiv.insertAdjacentHTML("afterend", startHtml);
    $("#" + questionHtmlId).fadeIn(questionHtmlFadeInMiliseconds);
    HideLoadingIcon();
}

function GetTopOffsetAsHtmlLineBreaks(fontSize) {
    var elementWhichHoldsRightSideContent = document.getElementById("rhs");
    var offSetHeight = elementWhichHoldsRightSideContent.offsetHeight;
    var googleDidAddItsOwnRightSideContent = offSetHeight > 20;

    if (googleDidAddItsOwnRightSideContent) {
        return GetTopOffsetLineBreaksCalculatedWidthFontSize(fontSize, offSetHeight);
    }

    return "";
}

function GetTopOffsetLineBreaksCalculatedWidthFontSize(fontSize, offSetHeight) {
    var inches = fontSize * (1 / 73);
    var pixelsPrLineBreak = inches * 96;

    var lineBreaks = "";
    var currentPixelHeight = 0;
    while (currentPixelHeight < offSetHeight) {
        lineBreaks += "<br/>";
        currentPixelHeight += pixelsPrLineBreak;
    }
    return lineBreaks;
    
}

function GetAutoDetectedWidth() {
    var centerCol = document.getElementById("center_col");
    var searchResultWidth = centerCol.offsetWidth;

    var body = document.getElementById("gsr");
    var fullWidth = body.offsetWidth;


    var marginLeftWidth = 180;
    var occupiedWidth = searchResultWidth + marginLeftWidth;
    var emptySpacing = fullWidth - occupiedWidth;

    var emptySpacingPercentage = (emptySpacing / fullWidth) * 100;
    var roomForPadding = 10;
    var width = emptySpacingPercentage - roomForPadding;

    var widthInPixels = (fullWidth / 100) * width;
    if (widthInPixels > maxAnswerWidthInPixels) {
        var maxAnswerWidthInPercentage = (maxAnswerWidthInPixels / fullWidth) * 100;
        return maxAnswerWidthInPercentage;
    }
    else {
        return width;
    }
}

async function AddCodeHighlightStyleSheetToHeadFromLocalStorageSettingOrDefault() {
    var cssFileSettingFromLocalStorage = await GetCodehighlightCssFromLocalStorage();
    if (cssFileSettingFromLocalStorage == null) {
        cssFileSettingFromLocalStorage = defaultCodeHighlightSetting;
    }
    var styleSheetHref = chrome.extension.getURL("answer/codehighlights/styles/" + cssFileSettingFromLocalStorage + ".css");
    $("<link rel='stylesheet' type='text/css' href='" + styleSheetHref + "'> ").appendTo("head");
}

async function GetAnswerWidthSettingFromLocalStorageOrDefault() {
    var widthFromLocalStorage = await GetWidthSettingFromLocalStorage();
    var shouldUseCustomWidth = await GetShouldUseCustomWidthSettingFromLocalStorage();
    if (widthFromLocalStorage != null && shouldUseCustomWidth) {
        return widthFromLocalStorage;
    }
    else {
        return GetAutoDetectedWidth();
    }
}

async function GetAnswerFontSizeSettingFromLocalStorageOrDefault() {
    var fontSizeFromLocalStorage = await GetFontSizeSettingFromLocalStorage();
    if (fontSizeFromLocalStorage != null) {
        return fontSizeFromLocalStorage;
    }
    else {
        return defaultFontSize;
    }
}

async function ShowLoadingIcon() {
    var rightOffsetInPixels = (GetTotalBrowserWidth() / 100) * await GetAnswerWidthSettingFromLocalStorageOrDefault();
    rightOffsetInPixels = rightOffsetInPixels + 30;
    var rcntDiv = document.getElementById("atvcap");
    var html = "<div id='" + loadingIconHtmlId + "' class='col-12 gruvbox' style='position:absolute; color:black;  right:" + rightOffsetInPixels + "px; top:145px;'>" + CreateLoadingImgHtml() + "  </div>";
    rcntDiv.insertAdjacentHTML("afterend", html);
}

function CreateLoadingImgHtml() {
    return "<div class='background-gif' style='width:" + gifSizePixels + "px; height:" + gifSizePixels + "px; '></div>";
}

function GetTotalBrowserWidth() {
    return document.getElementById("appbar").offsetWidth;
}

function HideLoadingIcon() {
    $("#" + loadingIconHtmlId).fadeOut(questionHtmlFadeInMiliseconds / 2);
}

async function DisplayAnswer(answerModel) {
    await AddCodeHighlightStyleSheetToHeadFromLocalStorageSettingOrDefault();
    var displayableHtml = CreateDisplayableHtml(answerModel);
    await LoadHtmlIntoRightHandSideOfSearchPage(displayableHtml);
    HighlightCodeBlocks();
}

function CreateDisplayableHtml(answerModel) {
    var answer = answerModel.answerInHtmlFormat;
    var scoreBadgeHtml = GetScoreBadgeHtml(answerModel);
    var displayableHtml = "Answer for question: <a style='color:blue; font-weight:bold;' href='" + answerModel.link + "'>" + answerModel.question + "</a> <br><br>";
    var displayableHtmlWithScoreBadgeAndAnswer = displayableHtml + scoreBadgeHtml + answer;
    return displayableHtmlWithScoreBadgeAndAnswer;
}

function GetScoreBadgeHtml(answerModel) {
    let score = answerModel.score;
    return `<div><img src="https://img.shields.io/badge/-${score}-blue.svg?label=Answer%20Score&color=F8752E&&style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjIwIDEwIDgwIDkwIj48c3R5bGU+LnN0MHtmaWxsOiNiY2JiYmJ9LnN0MXtmaWxsOiNmNDgwMjN9PC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNODQuNCA5My44VjcwLjZoNy43djMwLjlIMjIuNlY3MC42aDcuN3YyMy4yeiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zOC44IDY4LjRsMzcuOCA3LjkgMS42LTcuNi0zNy44LTcuOS0xLjYgNy42em01LTE4bDM1IDE2LjMgMy4yLTctMzUtMTYuNC0zLjIgNy4xem05LjctMTcuMmwyOS43IDI0LjcgNC45LTUuOS0yOS43LTI0LjctNC45IDUuOXptMTkuMi0xOC4zbC02LjIgNC42IDIzIDMxIDYuMi00LjYtMjMtMzF6TTM4IDg2aDM4LjZ2LTcuN0gzOFY4NnoiLz48L3N2Zz4="></img></div>`;
}

function HighlightCodeBlocks() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block)
    });
}

chrome.extension.onRequest.addListener(function (newSettings, sender, sendResponse) {

    UpdateDisplayedAnswerWidthSetting(newSettings.width);
});

function UpdateDisplayedAnswerWidthSetting(width) {

    document.getElementById(questionHtmlId).style.width = width + "%";
}