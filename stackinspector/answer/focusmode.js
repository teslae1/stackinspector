const focusBtnId = "focusbtn";
const focusBtnEyeImageId = "eyeimg";
const focusOverlayId = "focusOverlay";
const animationSpeed = 400;
const defaultImgSize = 30;

document.addEventListener('keydown', function (e){
    if(e.key == "Escape"){
        ExitFocusMode();
    }
});

function InitFocusMode(answerHtml){
    SetupFocusOverlay(answerHtml);
}

function SetupFocusOverlay(html){
    var mainDiv = GetMainDiv();
    var div = document.createElement("div");
    var style = div.style;
    style.paddingTop = "50px";
    style.margin = "0 auto";
    style.width = "1000px";
    style.align = "center";
    div.insertAdjacentHTML("beforeend", html);
    mainDiv.appendChild(div);
    document.body.appendChild(mainDiv);
}

function GetMainDiv(){
    var div = document.createElement("div");
    div.id = focusOverlayId;
    var style = div.style;
    style.position = "absolute";
    style.height = "20000px";
    style.width = "100%";
    style.top = 0;
    style.bottom =0;
    style.backgroundColor = "white";
    style.zIndex = 10000000000;
    style.display = "none";

    div.appendChild(GetExitFocusModeDiv());

    return div;
}

function GetExitFocusModeDiv(){
    var div = document.createElement("div");
    var style = div.style;
    style.textAlign = "right";
    style.paddingRight = "30px";
    style.paddingTop = "20px";
    var btn = document.createElement("btn");
    btn.innerHTML = "X";
    btn.style.fontSize = "18px";
    btn.style.color = "gray";
    btn.style.cursor = "pointer";
    btn.onclick = ExitFocusMode;
    div.appendChild(btn);
    return div;
}

function GetFocusButtonHtml(){
    //return "<div id='"+ focusBtnId + "' style='float:right'> FOCUS</div>";
    var url = chrome.runtime.getURL("answer/eye.png");
    return "<a id='"+focusBtnId+"'  style='float:right; border:none; background-color:transparent; cursor:pointer; outline:none; width:"+defaultImgSize+"; height:"+defaultImgSize+"'> <img id='"+focusBtnEyeImageId+"'src='" + url+ "' height='"+defaultImgSize+"' width='"+defaultImgSize+"'></img> </a>";

}

function SetupFocusModeEvents(){
    AddEnterFocusModeBtnEvents();
    AddExitOnEscapeFocus();
}

function AddExitOnEscapeFocus(){
    var e = document.getElementById(focusOverlayId);
    e.addEventListener("click", function(e) { 
        if(e.target == this){
            ExitFocusMode();
        }
    });
}

function AddEnterFocusModeBtnEvents(){
    var element = document.getElementById(focusBtnId);
    element.onclick = EnterFocusMode;
    element.onmouseover = OnHover;
    element.onmouseleave = OnLeave;
}

function EnterFocusMode(){
    $("#" + focusOverlayId).fadeIn(animationSpeed);
}

function ExitFocusMode(s, e){
    $("#" + focusOverlayId).fadeOut(animationSpeed);
}

function FocusModeIsOn(){
    return document.getElementById(focusOverlayId).display != "none";
}

function OnHover(){
    document.getElementById(focusBtnEyeImageId).width = defaultImgSize + 1;
    document.getElementById(focusBtnEyeImageId).height = defaultImgSize + 1;
}

function OnLeave(){
    document.getElementById(focusBtnEyeImageId).width = defaultImgSize;
    document.getElementById(focusBtnEyeImageId).height = defaultImgSize;
}

