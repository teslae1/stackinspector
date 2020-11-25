const buttonId = "saveSettings";
const widthInputFieldId = "width";
const shouldUseCustomWidthCheckboxId = "shouldUseCustomWidth";
const fontSizeFieldId = "fontSize";
const codeColorPickerFieldId = "codeColorPicker";
const defaultFontSize = 16;
const defaultWidthSize = 40;
const defualtCodeColor = "gruvbox-dark";
const gitLinkId = "GitLink";
const repoLink = "https://www.freecodecamp.org/news/how-to-publish-your-chrome-extension-dd8400a3d53/";

var btn = document.getElementById(buttonId);
btn.addEventListener("click", SaveSettings);

var dragbarWidth = document.getElementById(widthInputFieldId);
dragbarWidth.addEventListener("mousemove", OnWidthSettingChangeEvent);

var checkBox = document.getElementById(shouldUseCustomWidthCheckboxId);
checkBox.addEventListener("click", OnShouldUseCustomWidthCheckboxCheckEvent);

var gitLink = document.getElementById(gitLinkId);
gitLink.addEventListener("click", RedirectToGitRepo);

window.onload = function () {
    LoadAllCurrentUserSettings();
}

function LoadAllCurrentUserSettings() {
    LoadWidthSetting();
    LoadFontSizeSetting();
    LoadCodeColorSetting();
}

async function LoadWidthSetting() {
    var shouldUseCustomWidth = await GetShouldUseCustomWidthSettingFromLocalStorage();
    if (shouldUseCustomWidth == null ) {
        shouldUseCustomWidth = false;
    }
    document.getElementById(shouldUseCustomWidthCheckboxId).checked = shouldUseCustomWidth;

    var width = await GetWidthSettingFromLocalStorage();
    if (width == null) {
        width = defaultWidthSize;
    } 
    document.getElementById(widthInputFieldId).value = width;

    if (!shouldUseCustomWidth) {
        document.getElementById(widthInputFieldId).disabled = true;
    }
}

async function LoadFontSizeSetting() {
    var fontSize = await GetFontSizeSettingFromLocalStorage();
    if (fontSize == null) {
        fontSize = defaultFontSize;
    }
    document.getElementById(fontSizeFieldId).value = fontSize;
}

async function LoadCodeColorSetting() {
    var codeColor = await GetCodehighlightCssFromLocalStorage();
    if (codeColor == null) {
        codeColor = defualtCodeColor;
    }
    document.getElementById(codeColorPickerFieldId).value = codeColor;
}

function SaveSettings() {
    var width = document.getElementById(widthInputFieldId).value;
    SaveWidthSettingToLocalStorage(width);

    var shouldUseCustomWidth = document.getElementById(shouldUseCustomWidthCheckboxId).checked;
    SaveShouldUseCustomWidthSettingToLocalStorage(shouldUseCustomWidth);

    var fontSize = document.getElementById(fontSizeFieldId).value;
    SaveFontSizeSettingToLocalStorage(fontSize);

    var codeColor = document.getElementById(codeColorPickerFieldId).value;
    SaveCodeHighlightCssToLocalStorage(codeColor);
}

function OnWidthSettingChangeEvent() {
    var newWidthSetting = document.getElementById(widthInputFieldId).value;
    //save width setting
    //call width setting in displayanswer
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(tab.id, { width: newWidthSetting }, function (response) {
        });
    });
}

function OnShouldUseCustomWidthCheckboxCheckEvent() {
    var checked = document.getElementById(shouldUseCustomWidthCheckboxId).checked;
    if (checked) {
        document.getElementById(widthInputFieldId).disabled = false;
    }
    else {
        document.getElementById(widthInputFieldId).disabled = true;
    }
}

function RedirectToGitRepo() {
    chrome.tabs.create({ url: repoLink });
}

