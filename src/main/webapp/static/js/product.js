let fileData = [],
errorData = [],
processCount = 0,
$productAddForm = $("#product-form"),
$productEditForm = $("#product-edit-form"),
editProductModal = $('#edit-product-modal'),
addProductModal = $('#add-product-modal'),
uploadProductModal = $('#upload-product-modal'),
productTable = $('#product-table'),
$downloadErrors = $("#download-errors"),
productFile = $('#productFile'),
productFileName = $('#productFileName'),
rowCount = $('#rowCount'),
errorCount= $('#errorCount'),
processCountHtml = $('#processCount');
$selectBrand = $("#inputBrand"),
$selectCategory = $("#inputCategory"),

$(document).ready(init);

function init(){
	getProductList();
	$('#refresh-data').click(getProductList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);
	$downloadErrors.click(downloadErrors);
   	productFile.on('change', updateFileName)
   	fillOptions();

	let element = document.querySelector("#product-link");
	element.classList.add("active");
}

const getProductUrl = () => getBaseUrl() + "/api/product";
const getBrandUrl = (brand="", category="") => getBaseUrl() + `/api/brand?brand=${brand}&category=${category}`;

let primaryField = null;

//BUTTON ACTIONS
function addProduct(event){
	event.preventDefault();
	let barcode = $("#inputBarcode")[0];
	if(barcode.value.match("/")) {
		throwError("Invalid barcode");
		return;
	}
	if(barcode.value.trim()==""){
		throwError("Empty barcode!!");
		return;
	}

	//Set the values to update
	let json = toJson($productAddForm);
	let url = getProductUrl();

	sendAjaxRequest(url, 'POST', json, (response) => {
			addProductModal.modal('toggle');
			$form[0].reset();
			handleAjaxSuccess("Product added successfully!!")
			getProductList();
	});
	return false;
}

function updateProduct(e){
	e.preventDefault();
	let id = $("#product-edit-form input[name=id]").val(),
		url = getProductUrl() + "/" + id,
		json = toJson($productEditForm);

	sendAjaxRequest(url, 'PUT', json, (response) => {
			handleAjaxSuccess("Product edited successfully!!")
	   		getProductList();
			editProductModal.modal('toggle');
	});

	return false;
}

function getProductList(){
	let url = getProductUrl();

	sendAjaxRequest(url, 'GET', '', (data) => {
	   		displayProductList(data);
	});
}

function processData(){
	let file = productFile[0].files[0];
	if(!file)
    {
        throwError("Please select a file!")
        return;
    }
	readFileData(file, readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	let meta = results.meta;
    if(meta.fields.length!=5 ) {
        let row = {};
        row.error="Number of headers do not match!";
        errorData.push(row);
        updateUploadDialog()
		$downloadErrors.show();
        return;
    }
    if(meta.fields[0]!="name" || meta.fields[1]!="barcode" || meta.fields[2]!="brand" || meta.fields[3]!="category"|| meta.fields[4]!="mrp")
    {
        let row = {};
        row.error="Incorrect headers name!";
        errorData.push(row);
        updateUploadDialog();
		$downloadErrors.show();
        return;
    }
    const MAX_ROWS = 5000
    if(results.data.length>MAX_ROWS){
        throwError("File too big!");
        return;
    }
	uploadRows();
}

function uploadRows(){
	//Update progress
	updateUploadDialog();
	if(processCount==fileData.length){
		if(errorData.length===0)
		{
			handleAjaxSuccess("Product File uploaded successfully")
			uploadProductModal.modal('toggle');
			return;
		}

		$downloadErrors.show();
		return;
	}
	
	//Process next row
	let row = fileData[processCount];
	processCount++;
	
	let json = JSON.stringify(row);
	let url = getProductUrl();

	//Make ajax call
	sendAjaxRequest(url, 'POST', json, 
		(response) => {
	   		uploadRows();  
			getProductList();
		}, 
		(response) => {
			let data = JSON.parse(response.responseText);
			row.error=data?.["message"] || 'Error not found!';
			row.error_in_row_no = processCount
			errorData.push(row);
			uploadRows();
			getProductList();
		});
}

function downloadErrors(){
	writeFileData(errorData);
}

//UI DISPLAY METHODS
function displayProductList(data){
	let $tbody = productTable.find('tbody');
	$tbody.empty();
	data.reverse();
////////////TODO................................
	for(let i in data){
		let e = data[i];
		let buttonHtml = `<button title="Edit" class="btn" onclick="displayEditProduct(${e.id})"><img src="${getBaseUrl()}/static/images/edit1.png" alt="Edit" /></button>`
		let row = `<tr>
			<td> ${parseInt(+i+1)} </td>
			<td> ${e.name} </td>`
		+ `<td> ${e.barcode} </td>`
		+ `<td> ${e.brand} </td>`
		+ `<td> ${e.category} </td>`
		+ `<td class="text-right"> ${numberWithCommas(parseFloat(e.mrp).toFixed(2))} </td>`
		+ `<td class="supervisor-only text-center"> ${buttonHtml} </td>`
		+ `</tr>`;
        $tbody.append(row);
	}
	verifyRole();
	fillOptions();
}

function displayEditProduct(id){
	let url = getProductUrl() + "/" + id;
	sendAjaxRequest(url,'GET','',(data) => displayProduct(data));
}

function resetUploadDialog(){
	productFile.val('');
	productFileName.html("Choose File");
	processCount = 0;
	fileData = [];
	errorData = [];
	//Update counts	
	updateUploadDialog();
}
//TODO remove all comments.....................................
function updateUploadDialog(){
	rowCount.html("" + fileData.length);
	processCountHtml.html("" + processCount);
	errorCount.html("" + errorData.length);
}

function updateFileName(){
	let fileName = productFile.val().split('\\').pop();
	productFileName.html(fileName);
}

function displayUploadData(){
 	resetUploadDialog();
	$downloadErrors.hide();	
	uploadProductModal.modal('toggle');
}

function displayProduct(data){
	$productEditForm("input[name=name]").val(data.name); //or check.................
	$productEditForm("input[name=barcode]").val(data.barcode);
	$productEditForm("input[name=id]").val(data.id);
	$productEditForm("input[name=brand]").val(data.brand);
	$productEditForm("input[name=category]").val(data.category);
	$productEditForm("input[name=mrp]").val(parseFloat(data.mrp).toFixed(2));
	editProductModal.modal('toggle');
}

const fillOptions = (brand="", category="") => {
	let url = getBrandUrl(brand, category);
	sendAjaxRequest(url,'GET','',(response)=>{
			populateBrand(response);
			populateCategory(response);
	   })
}

const populateBrand = data => {
	$selectBrand.empty();

	let initial = '<option value="" selected disabled>Choose a brand...</option>';
    $selectBrand.append(initial);

	let brands = new Set();
	for(let i in data){ //////////////////TODO use "of"..................
		let e = data[i];
		brands.add(e.name);
	}
	const sortedBrands = new Set(Array.from(brands).sort());

	for(brand of sortedBrands.values()) {
		let ele = `<option value="${brand}"> ${brand} </option>`;
        $selectBrand.append(ele);
	}
}

const populateCategory = data => {
	$selectCategory.empty();

	let initial = '<option value="" selected disabled>Choose a category...</option>';
    $selectCategory.append(initial);

	let categories = new Set();
	for(let i in data){
		let e = data[i];
		categories.add(e.category);
	}
	const sortedCategories = new Set(Array.from(categories).sort());

	for(category of sortedCategories.values()) {
		let ele = `<option value="${category}"> ${category}</option>`;
        $selectCategory.append(ele);
	}
}

const brandChanged = () => {
	if(primaryField=="category") return;
	primaryField = "brand";

	let brand = $selectBrand[0].value;
	let url = getBrandUrl(brand);

	sendAjaxRequest(url,'GET', '', (response)=>{
			populateCategory(response);
	   });
}

const categoryChanged = () => {
	if(primaryField=="brand") return;
	primaryField = "category";

	let category = $selectCategory[0].value;
	let url = getBrandUrl("", category);

	sendAjaxRequest(url,'GET','',(response)=>{
			 populateBrand(response);
		});
}