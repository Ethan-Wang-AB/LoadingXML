/*readrecords.js*/
"use strict;"

// Declare some global variables
var xmlRecords = undefined;
var answers=[]

// Add the onload event handler that will be called when the web page is loaded and read
window.addEventListener('load',InitializeWebpage,false);

function InitializeWebpage() {

	if (document.createElement("template").content) {
		console.log("Your browser supports templates!");
	} else {
		console.log("Your browser does not support templates!");
	}

	LoadXMLData();
}

function LoadXMLData() {
	debugger

	var xhr = new XMLHttpRequest();
	// Setup the callback function
	xhr.onreadystatechange = function () {
	//	debugger

		if (xhr.readyState == 4) {
			switch (xhr.status) {
				case 200:
			xmlAnswer = xhr.responseXML.getElementsByTagName("rightanswers");
			answers=xmlAnswer[0].innerHTML.split(",")
		//answers=xmlAnswer.split(',');
          xmlRecords = xhr.responseXML.getElementsByTagName("question");
					if (xmlRecords) {
						ProcessDataSet();
					}
					break;
				case 404:
					xmlRecords = undefined;
					var errMessage = `
<div class='error-message'>
	Could not load JSON file ../DataFiles/data.xml due to 404 error<br/>
	Please check the URL or file path is valid
</div>`;
					SetElementInnerHTML('output-grid', errMessage);
					break;
				default:
					xmlRecords = undefined;
					var errMessage = `
<div class='error-message'>
Could not load JSON file ../DataFiles/data.xml due to ${xhr.status} error
</div>`;
					SetElementInnerHTML('output-grid', errMessage);
					break;
			}
		}

	};

	// Setup the request and send it off
	xhr.open("GET", "FinalQuiz.xml", true);
	xhr.send();

}

// Help function that allows us to set the .innerHTML of an element on the web page
function SetElementInnerHTML(id, htmlFragment) {
	var element = document.getElementById(id);
	if (element && element.innerHTML !== undefined) {
		element.innerHTML = htmlFragment;
	}
	else {
		console.log(`Could not find element id='${id} on the web page`);
	}
	return element;
}

// Helper function that allows us to toggle a class on an element in the web page
function ToggleElementClass(id, className, force) {
	var element = document.getElementById(id);
	if (element && element.classList !== undefined) {
		element.classList.toggle(className, force);
	}
	else {
		console.log(`Could not find element id='${id} on the row`);
	}
	return element;
}

// Helper function that lets us add a row to the collection
function AddRowToCollection(id, row) {
	var element = document.getElementById(id);
	if (element) {
		element.appendChild(row);
	}
}

function GetNewRow(templateId, newRowId, addClass) {
	// see https://www.w3schools.com/tags/tag_template.asp
	var rowTemplate = document.getElementById(templateId);
	if (rowTemplate && rowTemplate.content !== undefined) {
		// Make a clone of the template
		var newRow = null;
		// Find the first child node that is and element (nodeType = 1) and clone it
		// see https://www.w3schools.com/jsref/prop_node_nodetype.asp
		for (let idx = 0; idx < rowTemplate.content.childNodes.length; idx++) {
			if (rowTemplate.content.childNodes[idx].nodeType === 1) {
				newRow = rowTemplate.content.childNodes[idx].cloneNode(true);
				if (newRow) {
					if (newRowId) {
						// Populate the id
						newRow.setAttribute('id', newRowId);
					}
					if (addClass) {
						newRow.classList.add(addClass);
					}
					break;
				}
			}
		}
	}
	else {
		console.log(`Could not find template row id='${id}'`);
	}
	return newRow;
}

function SetRowElementValue(row, className, htmlFragment) {
	var element = row.getElementsByClassName(className);
	if (element && element.length > 0) {
		element[0].innerHTML = htmlFragment;
	}
	else {
		console.log(`Could not find element id='${className}' on the row`);
	}
	return element;
}

function ProcessDataSet() {
	debugger
	SetElementInnerHTML("row-count", xmlRecords.length);
	ToggleElementClass('output-area', 'hidden', false);
	SetElementInnerHTML('output-grid', "");

	// Output the heading for the grid
	var headingRow = GetNewRow('hdr-template', null);
	if (headingRow) {
		AddRowToCollection('output-grid', headingRow);
	}

	// Now output the rows
	var recordId = 0;
	for (var idx = 0; idx < xmlRecords.length; idx++) {
		// Retrieve a record from the xmlRecords so we can process it
		var currentRecord = xmlRecords[idx];
		if (currentRecord) {
			// Each row must have a unique id
			var newRowId = `row-${recordId}`;
			var evenOddRow = (recordId % 2 === 0) ? "even-row" : "odd-row";
			// Retrieve a clone of the template, and assign it the id we generated
			var newRow = GetNewRow('row-template', newRowId, evenOddRow);
			var qnum = currentRecord.getElementsByTagName("qnumber")[0].childNodes[0].nodeValue
			if (newRow) {
		/* 	var element1 = newRow.getElementsByClassName('row-a1');
		
			
				// We have a copy the row template, so populate it
				for(var idx1=0;idx1<element1.length;idx1++){
					element1[idx1].setAttribute('name',recordId)
				} */

       
				SetRowElementValue(newRow, 'row-rowId', qnum);
        
        var title = currentRecord.getElementsByTagName("qtitle")[0].childNodes[0].nodeValue
				SetRowElementValue(newRow, 'row-question', title);

        var achoice = currentRecord.getElementsByTagName("a")[0].childNodes[0].nodeValue
		achoice=`<input type="radio" name="${recordId}" value="a"> a.${achoice}`
				SetRowElementValue(newRow, 'row-a', achoice);
			
				//element.setAttribute('name',qnum)
				var bchoice = currentRecord.getElementsByTagName("b")[0].childNodes[0].nodeValue
				bchoice=`<input type="radio" name="${recordId}" value="b"> b.${bchoice}`
				SetRowElementValue(newRow, 'row-b', bchoice);
			//	element1 = newRow.getElementById('row-b1');
				//element1.setAttribute('name',qnum)
				var cchoice = currentRecord.getElementsByTagName("c")[0].childNodes[0].nodeValue
				cchoice=`<input type="radio" name="${recordId}" value="c"> c.${cchoice}`
				SetRowElementValue(newRow, 'row-c', cchoice);
			//	element2 = newRow.getElementById('row-c1');
			//	element2.setAttribute('name',qnum)
				var dchoice = currentRecord.getElementsByTagName("d")[0].childNodes[0].nodeValue
				dchoice=`<input type="radio" name="${recordId}" value="d"> d.${dchoice}`
				SetRowElementValue(newRow, 'row-d', dchoice);
				//element3 = newRow.getElementById('row-d1');
				//element3.setAttribute('name',qnum)
				// Add the new row to the collection
				AddRowToCollection('output-grid', newRow);
			}
			else {
				console.log(`Could not create new row template from template id='row-template'`);
			}
			recordId++;
		}
	}
}
function calctotal(){
	debugger
	var questions=[]
	for(var idx=0;idx<xmlRecords.length;idx++){
		questions[idx]=RetrieveRadioButtonValue(idx) 
	}

    var grades=0;
	for (var idx=0;idx<xmlRecords.length;idx++){
		if(questions[idx].trim()==answers[idx].trim()){
			grades++;
		}
	}
	var result=document.getElementById('result')
      result.innerHTML=`Your grade is ${grades} / ${xmlRecords.length}`


}