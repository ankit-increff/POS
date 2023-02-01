function getInventoryUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/inventory";
}

//BUTTON ACTIONS
function addInventory(event){
	event.preventDefault();
	//Set the values to update
	var $form = $("#inventory-form");
	var json = toJson($form);
	var url = getInventoryUrl();

	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
			$('#add-inventory-modal').modal('toggle');
			$form[0].reset();	
	   		getInventoryList();
			handleAjaxSuccess("Inventory updated successfully!!");

	   },
	   error: handleAjaxError
	});

	return false;
}

function updateInventory(event){
	event.preventDefault();
	var barcode = $("#inventory-edit-form input[name=barcode]").val();
	var url = getInventoryUrl() + "/" + barcode;

	//Set the values to update
	var $form = $("#inventory-edit-form");
	var json = toJson($form);

	$.ajax({
	   url: url,
	   type: 'PUT',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
			handleAjaxSuccess("Inventory updated successfully!!");
	   		getInventoryList();
			$('#edit-inventory-modal').modal('toggle');
			
	   },
	   error: handleAjaxError
	});

	return false;
}


function getInventoryList(){
	var url = getInventoryUrl();
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayInventoryList(data);
	   },
	   error: handleAjaxError
	});
}

// FILE UPLOAD METHODS
var fileData = [];
var errorData = [];
var processCount = 0;


function processData(){
	var file = $('#inventoryFile')[0].files[0];
	readFileData(file, readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function uploadRows(){
	//Update progress
	updateUploadDialog();
	//If everything processed then return
	if(processCount==fileData.length){
		return;
	}

	//Process next row
	var row = fileData[processCount];
	processCount++;

	var json = JSON.stringify(row);
	var url = getInventoryUrl();

	//Make ajax call
	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
      	'Content-Type': 'application/json'
      },
	   success: function(response) {
	   		uploadRows();
			getInventoryList();
	   },
	   error: function(response){
	   		row.error=response.responseText
	   		errorData.push(row);
	   		uploadRows();
			getInventoryList();
	   }
	});

}

function downloadErrors(){
	writeFileData(errorData);
}

//UI DISPLAY METHODS

function displayInventoryList(data){
	var $tbody = $('#inventory-table').find('tbody');
	$tbody.empty();
	data.reverse();
	let index = 1;
	for(var i in data){
		var e = data[i];
		var buttonHtml = ' <button title="Edit" class="btn supervisor-only" onclick="displayEditInventory(\'' + e.barcode + '\')"><img src="'+getBaseUrl()+'/static/images/edit1.png" alt="Edit" /></button>'
		var row = '<tr>'
		+ '<td>' + index++ + '</td>'
		+ '<td>' + e.barcode + '</td>'
		+ '<td>' + e.name + '</td>'
		+ '<td>' + numberWithCommas(e.quantity) + '</td>'
		+ '<td class="supervisor-only text-center">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
	verifyRole();
}

function displayEditInventory(barcode){
	var url = getInventoryUrl() + "/" + barcode;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayInventory(data);
	   },
	   error: handleAjaxError
	});
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#inventoryFile');
	$file.val('');
	$('#inventoryFileName').html("Choose File");
	//Reset various counts
	processCount = 0;
	fileData = [];
	errorData = [];
	//Update counts
	updateUploadDialog();
}

function updateUploadDialog(){
	$('#rowCount').html("" + fileData.length);
	$('#processCount').html("" + processCount);
	$('#errorCount').html("" + errorData.length);
}

function updateFileName(){
	var $file = $('#inventoryFile');
	var fileName = $file.val();
	$('#inventoryFileName').html(fileName);
}

function displayUploadData(){
 	resetUploadDialog();
	$('#upload-inventory-modal').modal('toggle');
}

function displayInventory(data){
	$("#inventory-edit-form input[name=barcode]").val(data.barcode);
	$("#inventory-edit-form input[name=quantity]").val(data.quantity);
//	$("#inventory-edit-form input[name=id]").val(data.id);
	$('#edit-inventory-modal').modal('toggle');
}


//INITIALIZATION CODE
function init(){
	$('#refresh-data').click(getInventoryList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);
	$('#download-errors').click(downloadErrors);
   $('#inventoryFile').on('change', updateFileName)
	let element = document.querySelector("#inventory-link");
	element.classList.add("active");
}

$(document).ready(init);
$(document).ready(getInventoryList);

