let fileData = [],
errorData = [],
processCount = 0,
$brandAddForm = $("#brand-add-form"),
$brandEditForm = $("#brand-edit-form"),
brandEditModal = $('#edit-brand-modal'),
addBrandModal = $('#add-brand-modal'),
uploadBrandModal = $('#upload-brand-modal'),
brandTable = $('#brand-table'),
$downloadErrors = $("#download-errors"),
$brandFile = $('#brandFile'),
brandFileName = $('#brandFileName'),
rowCount = $('#rowCount'),
errorCount= $('#errorCount'),
processCountHtml = $('#processCount');

$(document).ready(init);

function init(){
	getBrandList();
	$('#refresh-data').click(getBrandList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);
	$downloadErrors.click(downloadErrors);
    $brandFile.on('change', updateFileName);

	$("#brand-link")[0].classList.add("active");
}

const getBrandUrl = () => getBaseUrl() + "/api/brand";

function addBrand(event){
	event.preventDefault();
	let json = toJson($brandAddForm),
	url = getBrandUrl();

	sendAjaxRequest(url, 'POST', json, (response) => {
		addBrandModal.modal('toggle');
		$brandAddForm[0].reset();
		handleAjaxSuccess("Brand added successfully!!")
		getBrandList();
	});
	return false;
}


function updateBrand(event){
	event.preventDefault();

	let id = $("#brand-edit-form input[name=id]").val(),
	url = getBrandUrl() + "/" + id,
	json = toJson($brandEditForm);

	sendAjaxRequest(url, 'PUT', json, (response) => {
		brandEditModal.modal('toggle');
		handleAjaxSuccess("Brand edited successfully!!");
		getBrandList();
    })

	return false;
}


function getBrandList(){
	sendAjaxRequest(getBrandUrl(), 'GET', "",(data) => {
	   		displayBrandList(data);
	});
}

function processData(){
	let file = $brandFile[0].files[0];
	if(!file) {
        throwError("Please select a file!")
        return;
    }
	readFileData(file, readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	let meta = results.meta;
    if(meta.fields.length!=2) {
        let row = {};
        row.error="Number of headers do not match!";
        errorData.push(row);
        updateUploadDialog();
		$downloadErrors.show();
        return;
    }
    if(meta.fields[0]!="name" || meta.fields[1]!="category") {
        let row = {};
        row.error="Incorrect headers name!";
        errorData.push(row);
        updateUploadDialog()
		$downloadErrors.show();
        return;
    }
    const MAX_ROWS = 5000
    if(results.data.length>MAX_ROWS) {
        throwError("File too big!");
        return;
    }
	uploadRows();
}

function uploadRows() {
	updateUploadDialog();
	if(processCount==fileData.length){
		if(errorData.length===0) {
			handleAjaxSuccess("Brand File uploaded successfully")
			uploadBrandModal.modal('toggle');
			return;
		}
		$downloadErrors.show();
		return;
	}

	let row = fileData[processCount];
	processCount++;
	let json = JSON.stringify(row),
	url = getBrandUrl();

	sendAjaxRequest(url, 'POST', json, 
		(response)=>{
	   		uploadRows();
			getBrandList();
	   }, 
	   (response)=>{
			let data = JSON.parse(response.responseText);
			row.error=data["message"];
			row.error_in_row_no = processCount
			errorData.push(row);
			uploadRows();
			getBrandList();
   });
}

function downloadErrors(){
	writeFileData(errorData);
}

//UI DISPLAY METHODS
function displayBrandList(data){
	let $tbody = brandTable.find('tbody');
	$tbody.empty();
	data.reverse();
	for(let i in data){
		let e = data[i];
		let buttonHtml = `<button title="Edit" class="btn" onclick="displayEditBrand(${e.id})"><img src="${getBaseUrl()}/static/images/edit1.png" alt="Edit" /></button>`
		let row = `<tr>
			<td> ${parseInt(+i+1)} </td>
			<td> ${e.name} </td>
			<td> ${e.category} </td>
			<td class="supervisor-only text-center"> ${buttonHtml} </td>
		</tr>`;
        $tbody.append(row);
	}
	verifyRole();
}

function displayEditBrand(id){
	let url = getBrandUrl() + "/" + id;
	sendAjaxRequest(url,'GET', '', (data) => {
	   		displayBrand(data);
	   });
}

function resetUploadDialog(){
	$brandFile.val('');
	brandFileName.html("Choose File");
	processCount = 0;
	fileData = [];
	errorData = [];
	updateUploadDialog();
}

function updateUploadDialog(){
	rowCount.html("" + fileData.length);
	processCountHtml.html("" + processCount);
	errorCount.html("" + errorData.length);
}

function updateFileName(){
	let fileName = $brandFile.val().split('\\').pop();
	brandFileName.html(fileName);
}

function displayUploadData(){
 	resetUploadDialog();
	$downloadErrors.hide();
	uploadBrandModal.modal('toggle');
}

function displayBrand(data){
	$brandEditForm.find("input[name=name]").val(data.name);
	$brandEditForm.find("input[name=category]").val(data.category);
	$brandEditForm.find("input[name=id]").val(data.id);
	brandEditModal.modal('toggle');
}