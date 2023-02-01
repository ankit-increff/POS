function getProductUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/product";
}

const getBrandUrl = (brand="", category="") => {
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/brand?brand="+brand+"&category="+category;
}

let primaryField = null;

//BUTTON ACTIONS
function addProduct(event){
	event.preventDefault();

	let barcode = $("#inputBarcode")[0];
	if(barcode.value.match("/")) {
		throwError("Invalid barcode");
		return;
	}
	
	//Set the values to update
	var $form = $("#product-form");
	var json = toJson($form);
	var url = getProductUrl();
	
	$.ajax({
		url: url,
		type: 'POST',
		data: json,
		headers: {
			'Content-Type': 'application/json'
		},
		success: function(response) {
			$('#add-product-modal').modal('toggle');
			$form[0].reset();
			handleAjaxSuccess("Product added successfully!!")
			getProductList();
		},
		error: handleAjaxError
	});
	
	return false;
}

function updateProduct(e){
	e.preventDefault();
	
	//Get the ID
	var id = $("#product-edit-form input[name=id]").val();
	var url = getProductUrl() + "/" + id;

	//Set the values to update
	var $form = $("#product-edit-form");
	var json = toJson($form);

	$.ajax({
	   url: url,
	   type: 'PUT',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },	   
	   success: function(response) {
			handleAjaxSuccess("Product edited successfully!!")
	   		getProductList();
			$('#edit-product-modal').modal('toggle');
	   },
	   error: handleAjaxError
	});

	return false;
}


function getProductList(){
	var url = getProductUrl();
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayProductList(data);
	   },
	   error: handleAjaxError
	});
}

// FILE UPLOAD METHODS
var fileData = [];
var errorData = [];
var processCount = 0;


function processData(){
	var file = $('#productFile')[0].files[0];
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
	var url = getProductUrl();

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
			getProductList();
	   },
	   error: function(response){
	   		row.error=response.responseText
	   		errorData.push(row);
	   		uploadRows();
			getProductList();
	   }
	});

}

function downloadErrors(){
	writeFileData(errorData);
}

//UI DISPLAY METHODS

function displayProductList(data){
	var $tbody = $('#product-table').find('tbody');
	$tbody.empty();
	data.reverse();
	let index = 1;

	for(var i in data){
		var e = data[i];
		var buttonHtml = ' <button title="Edit" class="btn" onclick="displayEditProduct(' + e.id + ')"><img src="'+getBaseUrl()+'/static/images/edit1.png" alt="Edit" /></button>'
		var row = '<tr>'
		+ '<td>' + index++ + '</td>'
		+ '<td>' + e.name + '</td>'
		+ '<td>'  + e.barcode + '</td>'
		+ '<td>'  + e.brand + '</td>'
		+ '<td>'  + e.category + '</td>'
		+ '<td class="text-right">'  + numberWithCommas(parseFloat(e.mrp).toFixed(2)) + '</td>'
		+ '<td class="supervisor-only text-center">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
	verifyRole();
	fillOptions();
}

function displayEditProduct(id){
	var url = getProductUrl() + "/" + id;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayProduct(data);
	   },
	   error: handleAjaxError
	});	
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#productFile');
	$file.val('');
	$('#productFileName').html("Choose File");
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
	var $file = $('#productFile');
	var fileName = $file.val();
	$('#productFileName').html(fileName);
}

function displayUploadData(){
 	resetUploadDialog(); 	
	$('#upload-product-modal').modal('toggle');
}

function displayProduct(data){
	$("#product-edit-form input[name=name]").val(data.name);
	$("#product-edit-form input[name=barcode]").val(data.barcode);
	$("#product-edit-form input[name=id]").val(data.id);
	$("#product-edit-form input[name=brand]").val(data.brand);
	$("#product-edit-form input[name=category]").val(data.category);
	$("#product-edit-form input[name=mrp]").val(parseFloat(data.mrp).toFixed(2));
	$('#edit-product-modal').modal('toggle');
}

const fillOptions = (brand="", category="") => {
	var url = getBrandUrl(brand, category);

	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(response) {
			populateBrand(response);
			populateCategory(response);
	   },
	   error: handleAjaxError
	});
}

const populateBrand = data => {
	let $selectBrand = $("#inputBrand");
	$selectBrand.empty();

	var initial = '<option value="" selected disabled>Choose a brand...</option>';
    $selectBrand.append(initial);

	let brands = new Set();
	for(var i in data){
		var e = data[i];
		brands.add(e.name);
	}
	const sortedBrands = new Set(Array.from(brands).sort());

	for(brand of sortedBrands.values()) {
		var ele = '<option value="'+brand+'">' + brand + '</option>';
        $selectBrand.append(ele);
	}
}

const populateCategory = data => {
	let $selectCategory = $("#inputCategory");
	$selectCategory.empty();

	var initial = '<option value="" selected disabled>Choose a category...</option>';
    $selectCategory.append(initial);

	let categories = new Set();
	for(var i in data){
		var e = data[i];
		categories.add(e.category);
	}
	const sortedCategories = new Set(Array.from(categories).sort());

	for(category of sortedCategories.values()) {
		var ele = '<option value="'+category+'">' + category + '</option>';
        $selectCategory.append(ele);
	}
}


const brandChanged = () => {
	if(primaryField=="category") return;
	primaryField = "brand";

	let brand = $("#inputBrand")[0].value;
	var url = getBrandUrl(brand);

	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(response) {
			populateCategory(response);
	   },
	   error: handleAjaxError
	});
}

const categoryChanged = () => {
	if(primaryField=="brand") return;
	primaryField = "category";

	let category = $("#inputCategory")[0].value;
	var url = getBrandUrl("", category);

	$.ajax({
		url: url,
		type: 'GET',
		success: function(response) {
			 populateBrand(response);
		},
		error: handleAjaxError
	 });
}


//INITIALIZATION CODE
function init(){
	$('#refresh-data').click(getProductList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);
	$('#download-errors').click(downloadErrors);
   $('#productFile').on('change', updateFileName)
   fillOptions();

	let element = document.querySelector("#product-link");
	element.classList.add("active");
}

$(document).ready(init);
$(document).ready(getProductList);

