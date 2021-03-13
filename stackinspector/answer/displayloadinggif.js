
const hideLoadingIconFadeMiliseconds = 500;
const gifSizePixels = 45;
const loadingIconHtmlId = "LoadingIconDiv";

async function ShowLoadingIcon() {
    var rightOffsetInPixels = (GetTotalBrowserWidth() / 100) * await GetAnswerWidthSettingFromLocalStorageOrDefault();
    rightOffsetInPixels = rightOffsetInPixels + 30;
    var html = "<div id='" + loadingIconHtmlId + "' class='col-12 gruvbox' style='position:absolute; color:black;  right:" + rightOffsetInPixels + "px; top:145px;'>" + CreateLoadingImgHtml() + "  </div>";
    var rcntDiv = document.getElementById("atvcap");
    rcntDiv.insertAdjacentHTML("afterend", html);
}

function GetTotalBrowserWidth() {
    return document.getElementById("appbar").offsetWidth;
}

function CreateLoadingImgHtml() {
    return "<div class='background-gif' style='width:" + gifSizePixels + "px; height:" + gifSizePixels + "px; '></div>";
}

function HideLoadingIcon() {
    $("#" + loadingIconHtmlId).fadeOut(hideLoadingIconFadeMiliseconds);
}

