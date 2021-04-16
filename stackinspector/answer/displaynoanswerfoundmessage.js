
const messageDivId = "noMessageFoundDiv";
const milisecondsBeforeHideMessage = 3000;

async function DisplayNoAnswerFoundMessageAsync(){
	var searchText = GetSearchText();
	var html =  "<div id='" +messageDivId + "'>No upvoted answers found when searching: '<i>" + searchText + "</i>'</div>";
	await LoadHtmlIntoRightHandSideOfSearchPage(html);

	setTimeout(function () {
	$("#" + messageDivId).fadeOut(2000);
	}, milisecondsBeforeHideMessage);
}


function GetSearchText(){
	var inputField = document.getElementsByClassName("gLFyf gsfi")[1];
	return inputField.value; 
}
