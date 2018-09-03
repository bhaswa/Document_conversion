//processFile.js

var loc;
var sample = "false";

function fileUpload(){
	var fileToLoad = document.getElementById("my-file-selector").files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) 
	{
		var textFromFileLoaded = fileLoadedEvent.target.result;
		localStorage.setItem("FlData", textFromFileLoaded);
		loc = localStorage.getItem("FlData");
	};
	fileReader.readAsDataURL(fileToLoad, "UTF-8");
	document.getElementById('upload-file-info').innerHTML = document.getElementById("my-file-selector").value;
    document.getElementById('res').style.visibility = 'visible';
}

function samplehtmlUpload(){
	loc = 'files/Sample.html';
	sample = "true";
	document.getElementById('res').style.visibility = 'visible';
}

function samplepdfUpload(){
	loc = 'files/Sample.pdf';
	sample = "true";
	document.getElementById('res').style.visibility = 'visible';
}

function sampledocUpload(){
	loc = 'files/Sample.docx';
	sample = "true";
	document.getElementById('res').style.visibility = 'visible';
}

function convert(){
	xhrGet("ConvertDoc", function(responseText){
		var text = document.createTextNode(responseText);
		var p = document.createElement("PRE");
		p.appendChild(text);
		var docm = document.getElementById('out_doc');
		//i=0;
		if (docm.hasChildNodes()) {
			//alert(i++);
			docm.removeChild(docm.childNodes[0]);
		}
		docm.appendChild(p);
	}, function(err){
		console.log(err);
	});
	loadFileAsURL();
}

function createXHR(){
	if(typeof XMLHttpRequest != 'undefined'){
		return new XMLHttpRequest();
	}else{
		try{
			return new ActiveXObject('Msxml2.XMLHTTP');
		}catch(e){
			try{
				return new ActiveXObject('Microsoft.XMLHTTP');
			}catch(e){}
		}
	}
	return null;
}

function xhrGet(url, callback, errback){
	var xhr = new createXHR();
	var radios = document.getElementsByName('optradio');
	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
	       break;
	    }
	}
	form = new FormData();
	form.append("upload",document.getElementById("my-file-selector").files[0]);
	form.append("target",radios[i].value);
	form.append("sample",sample);
	form.append("loc",loc);
	//var params = "upload="+prettyJson(loc);
	//params=params+"&target="+radios[i].value;
	xhr.open("POST", url, true);
	//xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				callback(xhr.responseText);
				document.getElementById('output').style.visibility = 'visible';
			}else{
				errback('service not available');
			}
		}
	};
	xhr.timeout = 30000;
	xhr.ontimeout = errback;
	//xhr.setRequestHeader("Content-Type", "multipart/form-data");
	xhr.send(form);
}

function parseJson(str){
	return window.JSON ? JSON.parse(str) : eval('(' + str + ')');
}

function prettyJson(str){
	// If browser does not have JSON utilities, just print the raw string value.
	return window.JSON ? JSON.stringify(JSON.parse(str), null, '  ') : str;
}


function savetextarea() {
	var textToWrite = document.getElementById("out_doc").childNodes[0].childNodes[0].nodeValue;
	var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
	var fileNameToSaveAs = "ConvertedFile.txt";
	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "My Hidden Link";
	window.URL = window.URL || window.webkitURL;
	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	downloadLink.onclick = destroyClickedElement;
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
}

function saveinputarea(){
	//alert(document.getElementById("in_doc").childNodes[1].src);
	new_loc = document.getElementById("in_doc").childNodes[1].src;
	//alert(new_loc.substring(87,new_loc.len));
	window.location = new_loc.substring(87,new_loc.len)+"?download=true";
	/*var textToWrite = document.getElementById("in_doc").childNodes[1].childNodes[0].nodeValue;
	var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
	var fileNameToSaveAs = "InputFile.txt";
	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "My Hidden Link";
	window.URL = window.URL || window.webkitURL;
	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	downloadLink.onclick = destroyClickedElement;
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();*/
}


function destroyClickedElement(event) {
	// remove the link from the DOM
	document.body.removeChild(event.target);
}


function loadFileAsURL()
{
	if(sample =="false")
	{
		var fileToLoad = document.getElementById("my-file-selector").files[0];
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) 
		{
			//var textFromFileLoaded = fileLoadedEvent.target.result;
			document.getElementById("iframe").src = "https://docs.google.com/viewer?embedded=true&url=http%3A%2F%2Fbluemixgrp7.mybluemix.net/files"+document.getElementById("my-file-selector").value;;
		};
	}
	else
		document.getElementById("iframe").src = "https://docs.google.com/viewer?embedded=true&url=http%3A%2F%2Fbluemixgrp7.mybluemix.net/"+loc;
	fileReader.readAsDataURL(fileToLoad, "UTF-8");
}