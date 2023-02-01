function getBrandUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/brand";
}

//BUTTON ACTIONS
function addBrand(event){
	event.preventDefault();
	//Set the values to update
	var $form = $("#brand-add-form");
	var json = toJson($form);
	var url = getBrandUrl();

	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
			$('#add-brand-modal').modal('toggle');
			$form[0].reset();
			handleAjaxSuccess("Brand added successfully!!")
	   		getBrandList();
	   },
	   error: handleAjaxError
	});

	return false;
}


function updateBrand(event){
	event.preventDefault();

	//Get the ID
	var id = $("#brand-edit-form input[name=id]").val();
	var url = getBrandUrl() + "/" + id;


	//Set the values to update
	var $form = $("#brand-edit-form");
	var json = toJson($form);

	$.ajax({
	   url: url,
	   type: 'PUT',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
			$('#edit-brand-modal').modal('toggle');
			handleAjaxSuccess("Brand edited successfully!!");
	   		getBrandList();
	   },
	   error: handleAjaxError
	});

	return false;
}


function getBrandList(){
	var url = getBrandUrl();
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayBrandList(data);
	   },
	   error: handleAjaxError
	});
}

// FILE UPLOAD METHODS
var fileData = [];
var errorData = [];
var processCount = 0;


function processData(){
	var file = $('#brandFile')[0].files[0];
	if(!file)
    {
        throwError("Please select a file!")
        return;
    }
	readFileData(file, readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	var meta = results.meta;
	console.log(meta);
    if(meta.fields.length!=2 ) {
        var row = {};
        row.error="Number of headers do not match!";
        errorData.push(row);
        updateUploadDialog()
		$("#download-errors").show();
        return;
    }
    if(meta.fields[0]!="name" || meta.fields[1]!="category")
    {
        var row = {};
        row.error="Incorrect headers name!";
        errorData.push(row);
        updateUploadDialog()
		$("#download-errors").show();
        return;
    }
    const MAX_ROWS = 5000
    if(results.data.length>MAX_ROWS){
        throwError("File too big!")
        return
    }
	uploadRows();
}

function uploadRows(){
	//Update progress
	updateUploadDialog();
	//If everything processed then return
	if(processCount==fileData.length){
		if(errorData.length===0)
		{
			handleAjaxSuccess("Brand File uploaded successfully")
			$('#upload-brand-modal').modal('toggle');
			return;
		}

		$("#download-errors").show();
		return;
	}

	//Process next row
	var row = fileData[processCount];
	processCount++;

	var json = JSON.stringify(row);
	var url = getBrandUrl();

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
			getBrandList();
	   },
	   error: function(response){
			var data = JSON.parse(response.responseText);
			row.error=data["message"];
		    row.error_in_row_no = processCount
	   		errorData.push(row);
	   		uploadRows();
			getBrandList();
	   }
	});
}

function downloadErrors(){
	writeFileData(errorData);
}

//UI DISPLAY METHODS

function displayBrandList(data){
	let index=1;
	var $tbody = $('#brand-table').find('tbody');
	$tbody.empty();
	data.reverse();
	for(var i in data){
		var e = data[i];
		var buttonHtml = ' <button title="Edit" class="btn" onclick="displayEditBrand(' + e.id + ')"><img src="'+getBaseUrl()+'/static/images/edit1.png" alt="Edit" /></button>'
		var row = '<tr>'
		+ '<td>' + index++ + '</td>'
		+ '<td>' + e.name + '</td>'
		+ '<td>'  + e.category + '</td>'
		+ '<td class="supervisor-only text-center">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
	verifyRole();
}

function displayEditBrand(id){
	var url = getBrandUrl() + "/" + id;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayBrand(data);
	   },
	   error: handleAjaxError
	});
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#employeeFile');
	$file.val('');
	$('#employeeFileName').html("Choose File");
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
	var $file = $('#brandFile');
	var fileName = $file.val().split('\\').pop();
	$('#brandFileName').html(fileName);
}

function displayUploadData(){
 	resetUploadDialog();
	 $('#download-errors').hide();
	$('#upload-brand-modal').modal('toggle');
}

function displayBrand(data){
	$("#brand-edit-form input[name=name]").val(data.name);
	$("#brand-edit-form input[name=category]").val(data.category);
	$("#brand-edit-form input[name=id]").val(data.id);
	$('#edit-brand-modal').modal('toggle');
}




//INITIALIZATION CODE
function init(){
	$('#refresh-data').click(getBrandList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);
	$('#download-errors').click(downloadErrors);
    $('#brandFile').on('change', updateFileName)

	let element = document.querySelector("#brand-link");
	element.classList.add("active");
	
}

$(document).ready(init);
$(document).ready(getBrandList);

