function SaveWidthSettingToLocalStorage(width) {
    chrome.storage.local.set({ answerWidth: width }, function () {
    });
}

async function GetWidthSettingFromLocalStorage() {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get("answerWidth", function (result) {
            resolve(result.answerWidth);
        })
    }).then(function (value) { return value });
}

function SaveFontSizeSettingToLocalStorage(fontSize) {
    chrome.storage.local.set({ answerFontSize: fontSize }, function () { });
}

async function GetFontSizeSettingFromLocalStorage() {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get("answerFontSize", function (result) {
            resolve(result.answerFontSize);
        })
    }).then(function (value) { return value });
}

function SaveCodeHighlightCssToLocalStorage(setting) {
    chrome.storage.local.set({ codeHighlightCss: setting }, function () { });
}

async function GetCodehighlightCssFromLocalStorage() {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get("codeHighlightCss", function (result) {
            resolve(result.codeHighlightCss);
        })
    }).then(function (value) { return value });
}

function SaveShouldUseCustomWidthSettingToLocalStorage(setting) {
    chrome.storage.local.set({ shouldUseCustomWidth: setting }, function () { });
}

async function GetShouldUseCustomWidthSettingFromLocalStorage() {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get("shouldUseCustomWidth", function (result) {
            resolve(result.shouldUseCustomWidth);
        })
    }).then(function (value) { return value });
}

