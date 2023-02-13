let fileData = [],
errorData = [],
processCount = 0,
$inventoryAddForm = $("#inventory-form"),
$inventoryEditForm = $("#inventory-edit-form"),
inventoryEditModal = $('#edit-inventory-modal'),
inventoryAddModal = $('#add-inventory-modal')
inventoryUploadModal = $('#upload-inventory-modal'),
inventoryTable = $('#inventory-table'),
$downloadErrors = $("#download-errors"),
inventoryFile = $('#inventoryFile'),
inventoryFileName = $('#inventoryFileName'),
rowCount = $('#rowCount'),
errorCount= $('#errorCount'),
processCountHtml = $('#processCount');

$(document).ready(init)

function init(){
	getInventoryList();
	$('#refresh-data').click(getInventoryList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);
	$downloadErrors.click(downloadErrors);
   	inventoryFile.on('change', updateFileName)
	let element = document.querySelector("#inventory-link");
	element.classList.add("active");
}

const getInventoryUrl = () => getBaseUrl() + "/api/inventory";

//BUTTON ACTIONS
function addInventory(event){
	event.preventDefault();
	//Set the values to update
	let json = toJson($inventoryAddForm);
	let url = getInventoryUrl();

	sendAjaxRequest(url,'POST',json,(response)=>{
			inventoryAddModal.modal('toggle');
			$inventoryAddForm[0].reset();	
	   		getInventoryList();
			handleAjaxSuccess("Inventory updated successfully!!");

	   })
	return false;
}

function updateInventory(event){
	event.preventDefault();
	let barcode = $("#inventory-edit-form input[name=barcode]").val();
	let url = getInventoryUrl() + "/" + barcode;

	//Set the values to update
	let json = toJson($inventoryEditForm);

	sendAjaxRequest(url,'PUT',json,(response)=>{
			handleAjaxSuccess("Inventory updated successfully!!");
	   		getInventoryList();
			inventoryEditModal.modal('toggle');
			
	})

	return false;
}


function getInventoryList(){
	let url = getInventoryUrl();

	sendAjaxRequest(url,'GET','',(data)=>{
	   		displayInventoryList(data);
	})
}

function processData(){
	let file = inventoryFile[0].files[0];
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
	if(meta.fields.length!=2 ) {
		let row = {};
		row.error="Number of headers do not match!";
		errorData.push(row);
		updateUploadDialog()
		$downloadErrors.show();
		return;
	}
	if(meta.fields[0]!="barcode" || meta.fields[1]!="quantity")
	{
		let row = {};
		row.error="Incorrect headers name!";
		errorData.push(row);
		updateUploadDialog()
		$downloadErrors.show();
		return;
	}
	const MAX_ROWS = 5000
	if(results.data.length>MAX_ROWS){
		throwError("File too big!");
		return
	}
	uploadRows();
}

function uploadRows(){
	//Update progress
	updateUploadDialog();

	if(processCount==fileData.length){
		if(errorData.length===0)
		{
			handleAjaxSuccess("Inventory File uploaded successfully")
			inventoryUploadModal.modal('toggle');
			return;
		}

		$downloadErrors.show();
		return;
	}

	let row = fileData[processCount];
	processCount++;
	let json = JSON.stringify(row),
	url = getInventoryUrl();

	sendAjaxRequest(url,'POST',json,(response)=>{
	   		uploadRows();
			getInventoryList();
	   },
	   (response)=>{
			let data = JSON.parse(response.responseText);
			row.error=data["message"];
			row.error_in_row_no = processCount
	   		errorData.push(row);
	   		uploadRows();
			getInventoryList();
	   })
}

function downloadErrors(){
	writeFileData(errorData);
}

function displayInventoryList(data){
	let $tbody = inventoryTable.find('tbody');
	$tbody.empty();
	data.reverse();
	for(let i in data){
		let e = data[i];
		let buttonHtml = `<button title="Edit" class="btn supervisor-only" onclick="displayEditInventory('${e.barcode }')"><img src="${getBaseUrl()}/static/images/edit1.png" alt="Edit" /></button>`
		let row = `<tr>`
		+ `<td> ${parseInt(+i+1)} </td>`
		+ `<td> ${e.barcode} </td>`
		+ `<td> ${e.name} </td>`
		+ `<td> ${numberWithCommas(e.quantity)} </td>`
		+ `<td class="supervisor-only text-center"> ${buttonHtml} </td>`
		+ `</tr>`;
        $tbody.append(row);
	}
	verifyRole();
}

function displayEditInventory(barcode){
	let url = getInventoryUrl() + "/" + barcode;
	sendAjaxRequest(url,'GET','', (data) => {
	   		displayInventory(data);
	   })
}

function resetUploadDialog(){
	//Reset file name
	let $file = inventoryFile;
	$file.val('');
	inventoryFileName.html("Choose File");
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
	let $file = inventoryFile;
	let fileName = $file.val().split('\\').pop();
	inventoryFileName.html(fileName);
}

function displayUploadData(){
 	resetUploadDialog();
	$downloadErrors.hide();
	inventoryUploadModal.modal('toggle');
}

function displayInventory(data){
	$inventoryEditForm("input[name=barcode]").val(data.barcode);
	$inventoryEditForm("input[name=quantity]").val(data.quantity);
	inventoryEditModal.modal('toggle');
}