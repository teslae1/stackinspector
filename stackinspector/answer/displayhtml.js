

const maxAnswerWidthInPixels = 950;
const answerHtmlId = "question";
const answerZIndex = 2;
const htmlFadeInMiliseconds = 1000;
const defaultFontSize = 16;

async function LoadHtmlIntoRightHandSideOfSearchPage(html) {
    var width = await GetAnswerWidthSettingFromLocalStorageOrDefault();
    var fontSize = await GetAnswerFontSizeSettingFromLocalStorageOrDefault();
    var lineBreaksForTopOffset = GetTopOffsetAsHtmlLineBreaks(fontSize);
    var startHtml = "<div id='" + answerHtmlId + "' class='col-12'  style=' font-size:" + fontSize + "px; display:none;  width:" + width + "%;  text-overflow:ellipsis; z-index:" + answerZIndex + "; position:absolute; right:5%; text-align:left;'> " + lineBreaksForTopOffset + html + " </div>"
    var atvcapDiv = document.getElementById("atvcap");
    atvcapDiv.insertAdjacentHTML("afterend", startHtml);
    $("#" + answerHtmlId).fadeIn(htmlFadeInMiliseconds);
    HideLoadingIcon();
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

async function GetAnswerFontSizeSettingFromLocalStorageOrDefault() {
    var fontSizeFromLocalStorage = await GetFontSizeSettingFromLocalStorage();
    if (fontSizeFromLocalStorage != null) {
        return fontSizeFromLocalStorage;
    }
    else {
        return defaultFontSize;
    }
}

function GetTopOffsetAsHtmlLineBreaks(fontSize) {
    var rightSideContent = GetRightSideContent();
    if (rightSideContent == null) {
        return "";
    }

    return GetTopOffsetLineBreaksCalculatedWidthFontSize(fontSize, rightSideContent.clientHeight);
}

function GetRightSideContent() {
    var rightSideContent = document.getElementById("rhs");
    if (rightSideContent != null
        && rightSideContent.offsetHeight > 20) {
        return rightSideContent;
    }


    var container = document.getElementById("rcnt");
    if (container == null) {
        return null;
    }

    var fullWidthContent = container.firstChild;
    while(fullWidthContent != null  
        && (!fullWidthContent.firstChild || fullWidthContent.firstChild.tagName != "H1")) {
        fullWidthContent = fullWidthContent.nextSibling;
    }


    return fullWidthContent;
}


function GetTopOffsetLineBreaksCalculatedWidthFontSize(fontSize, offSetHeight) {
    var inches = fontSize * (1 / 73);
    var pixelsPrLineBreak = inches * 96;

    var lineBreaks = "<br/>";
    var currentPixelHeight = 0;
    while (currentPixelHeight < offSetHeight) {
        lineBreaks += "<br/>";
        currentPixelHeight += pixelsPrLineBreak;
    }
    return lineBreaks;
}