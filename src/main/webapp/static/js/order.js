let globalOrderId = 1,
$orderAddForm = $("#order-form"),
orderEditModal = $('#order-edit-modal'),
orderAddModal = $('#add-order-modal'),
orderTable = $('#order-table'),
orderEditTable = $('#order-edit-table'),
orderAddTable = $('#order-add-table'),
orderItemsTable = $('#order-items-table'),
orderItemsModal = $('#order-items-modal');

$(document).ready(init);

function init(){
	getOrderList();
	$('#refresh-data').click(getOrderList);
	$("#order-link")[0].classList.add("active");
}

const getOrderUrl = () => getBaseUrl() + "/api/order";
const getProductUrl = () => getBaseUrl() + "/api/product";

function addOrder(event){
	let json = convertJson($orderAddForm),
	url = getOrderUrl();

	sendAjaxRequest(url,'POST', json,(response)=>{
			orderAddModal.modal('toggle');
			$orderAddForm[0].reset();
	   		getOrderList();  
	});

	return false;
}

function getOrderList(){
	let url = getOrderUrl();
	sendAjaxRequest(url,'GET','',(data) =>{
	   		displayOrderList(data);  
	   });
}

//HELPER FUNCTIONS
function convertJson($form){
    let serialized = $form.serializeArray();
    let s = '';
	let arr = [];
    
    for(let i=0;i<serialized.length;i+=3){
		let data = {};
        data[serialized[i]['name']] = serialized[i]['value'];
		data[serialized[s+1]['name']] = serialized[i+1]['value'];
		data[serialized[s+2]['name']] = serialized[i+2]['value'];
		arr.push(data);
    }
    let json = JSON.stringify(arr);
    return json;
}

//UI DISPLAY METHODS

function displayOrderList(data){
	let $tbody = orderTable.find('tbody');
	$tbody.empty();
	data.reverse();
	for(let i in data){
		let e = data[i];

		let newDate = new Date(e.date);
		let buttonHtml = `<button title="Details" class="btn" onclick="displayOrderDetails(${e.id})"><img src="${getBaseUrl()}/static/images/details.png" alt="Details" /></button>`
		if(e.invoiceGenerated) {
			buttonHtml += `<button title="Edit" class="btn supervisor-only disabled"><img src="${getBaseUrl()}/static/images/edit2.png" alt="Edit" /></button>`
		} else {
			buttonHtml += `<button title="Edit" class="btn supervisor-only" onclick="displayEditOrder(${e.id})"><img src="${getBaseUrl()}/static/images/edit1.png" alt="Edit" /></button>`
		}
		
		buttonHtml += ' <button title="Invoice" class="btn" onclick="generateInvoice(' + e.id + ')"><img src="'+getBaseUrl()+'/static/images/invoice.png" alt="Invoice" /></button>'
		let row = `<tr>`
		+ `<td> ${e.id} </td>`
		+ `<td> ${newDate.toString()} </td>`
		+ `<td class="text-right"> ${numberWithCommas(parseFloat(e.amount).toFixed(2))} </td>`
		+ `<td class="text-center"> ${buttonHtml} </td>`
		+ `</tr>`;
        $tbody.append(row);
	}
	verifyRole();
}

//_____________________________________________EDIT BUTTON FUNCTIONALITY____________________________________

function displayEditOrder(id){
	let url = getOrderUrl() + "/" + id;
	globalOrderId = id;
	sendAjaxRequest(url, 'GET', '',(data)=> {
	   		editOrderForm(data);
	});
}

function editOrderForm(data) {
	let $orderId = document.querySelector("#order-id-edit")
	$orderId.innerText = ` (Id: ${data[0].orderId})`;
	let $tbody = orderEditTable.find('tbody');
	$tbody.empty();
	for(let i in data) {
		let e = data[i];
		let buttonHtml = `<button title="Delete" class="btn" onclick=removeFromModal(event)><img src="${getBaseUrl()}/static/images/delete.png" alt="Delete" /></button>`
		let row = `<tr class="update-row">`
		+ `<td class="update-barcode"> ${e.barcode} </td>`
		+ `<td> ${e.name} </td>`
		+ `<td><input type="number" step="1" min="1" class="form-control update-quantity" value="${e.quantity}" required></td>`
		+ `<td class="text-right"><input step="0.01" min="0.01" type="number" class="form-control text-right update-price" value="${parseFloat(e.sellingPrice).toFixed(2)}" required></td>`
		+ `<td class="text-center"> ${buttonHtml} </td>`
		+ `</tr>`;
        $tbody.append(row);
	}
	verifyNumberInput();	
	orderEditModal.modal('toggle');
}

//_____________________________________________MODIFY EDIT TABLE____________________________________
function addInEditTable(e) {
	e.preventDefault();

	let barcode = document.querySelector(".edit-barcode");
	let quantity = document.querySelector(".edit-quantity");
	let price = document.querySelector(".edit-price");

	if(checkValue(quantity.value, price.value)===false) return;

	let url = getProductUrl() + "?barcode=" + barcode.value;
	sendAjaxRequest(url,'GET', '',(data)=>{
	   		displayInEditTable(data);
	});
}

function displayInEditTable(e) {
	let quantity = document.querySelector(".edit-quantity"),
	 price = document.querySelector(".edit-price");
	let barcode = document.querySelector(".edit-barcode");
	
	if(parseFloat(price.value)>parseFloat(e.mrp)) {
		throwError(`Selling price should not be greater than MRP (i.e. ${parseFloat(e.mrp).toFixed(2)})`);
		return;
	}
	
	let $tbody = orderEditTable.find('tbody');
	let barcodes = $tbody[0].querySelectorAll(".update-barcode");

	for(ele of barcodes) {
		if(ele.innerText == barcode.value){
			let qty = ele.parentElement.querySelector('.update-quantity');
			qty.value = parseInt(quantity.value) + parseInt(qty.value);
			quantity.value = null;
			price.value = null;
			barcode.value = null;

			return;
		}
	}

	let buttonHtml = `<button title="Delete" class="btn" onclick=removeFromModal(event)><img src="${getBaseUrl()}/static/images/delete.png" alt="Delete" /></button>`
	let row = `<tr class="update-row">`
		+ `<td class="update-barcode">${e.barcode}</td>`
		+ `<td>${e.name}</td>`
		+ `<td><input type="number" min="1" class="form-control update-quantity" value="${quantity.value}" required></td>`
		+ `<td><input type="number" step="0.01" min="0.01" max="${parseFloat(e.mrp).toFixed(2)}" class="form-control text-right update-price" value="${parseFloat(price.value).toFixed(2)}" required></td>`
		+ `<td class="text-center">${buttonHtml}</td>`
		+ `</tr>`;
     $tbody.append(row);
	 verifyNumberInput();

	 quantity.value = null;
	 price.value = null;
	 barcode.value = null;
}


function removeFromModal(e) {
	e.target.parentElement.parentElement.parentElement.remove();
}

function checkValue(quantity, price) {
	
	//check
	if(quantity<1) {
		throwError("Quantity should be greater than 0");
		return false;
	}
	if(parseFloat(price)<=0) {
		throwError("Price should be greater than 0");
		return false;
	}
	return true;
}


//_______________________________CREATE NEW ORDER____________________________
let createOrderBarcode = [];
function addInCreateTable(event) {
	event.preventDefault();

	let barcode = document.querySelector(".add-barcode");
	let quantity = document.querySelector(".add-quantity");
	let price = document.querySelector(".add-price");

	if(checkValue(quantity.value, price.value)===false) return;

	let url = getProductUrl() + "?barcode=" + barcode.value;

	sendAjaxRequest(url,'GET','',(data)=>{
	   		displayInCreateTable(data);
	   });
}

function displayInCreateTable(e) {
	let quantity = document.querySelector(".add-quantity");
	let price = document.querySelector(".add-price");
	let barcode = document.querySelector(".add-barcode");

	if(parseFloat(price.value)>parseFloat(e.mrp)) {
		throwError(`Selling price should not be greater than MRP (i.e.${parseFloat(e.mrp).toFixed(2)})`);
		return;
	}
	
	let $tbody = orderAddTable.find('tbody');
	let barcodes = $tbody[0].querySelectorAll(".new-barcode");
	for(ele of barcodes) {
		if(ele.innerText == barcode.value){
			let qty = ele.parentElement.querySelector('.new-quantity');
			qty.value = parseInt(quantity.value) + parseInt(qty.value);
			quantity.value = null;
			price.value = null;
			barcode.value = null;

			return;
		}
	}

	let buttonHtml = `<button title="Delete" class="btn" onclick=removeFromModal(event)><img src="${getBaseUrl()}/static/images/delete.png" alt="Delete" /></button>`
	let row = `<tr class="new-row">`
		+ `<td class="new-barcode">${e.barcode}</td>`
		+ `<td>${e.name}</td>`
		+ `<td><input type="number" class="form-control new-quantity" value="${quantity.value}" min="1" required></td>`
		+ `<td class="text-right"><input type="number" step="0.01" class="form-control text-right new-price" min="0.01" max="${parseFloat(e.mrp).toFixed(2)}" value="${parseFloat(price.value).toFixed(2)}" required></td>`
		+ `<td class="text-center">${buttonHtml}</td>`
		+ `</tr>`;
     $tbody.append(row);
	 verifyNumberInput();

	 quantity.value = null;
	 price.value = null;
	 barcode.value = null;
}

//____________________________________PLACE NEW ORDER________________________________________
function createNewOrder(e) {
	e.preventDefault();
	let rows = document.getElementsByClassName("new-row");
	let req = [];
	for(let i=0;i<rows.length;i++) {
		let elem = rows[i];
		let barcode = elem.querySelector(".new-barcode").innerText;
		let quantity = elem.querySelector(".new-quantity").value;
		let price = elem.querySelector(".new-price").value;

		let obj = {
			barcode,
			quantity,
			"sellingPrice": price
		};
		req.push(obj);
	}
	let json = JSON.stringify(req);
	let url = getOrderUrl();

	sendAjaxRequest(url,'POST',json,(response) =>{
			orderAddModal.modal('toggle');
			orderAddTable.find('tbody').empty();
	   		getOrderList();
			handleAjaxSuccess("Order placed successfully!!")

	   });
}


//____________________________________SUBMIT UPDATE ORDER________________________________________
function updateOrder(e) {
	e.preventDefault();
	let rows = document.getElementsByClassName("update-row");
	let req = [];
	for(let i=0;i<rows.length;i++) {
		let elem = rows[i];
		let barcode = elem.querySelector(".update-barcode").innerText;
		let quantity = elem.querySelector(".update-quantity").value;
		let price = elem.querySelector(".update-price").value;

		let obj = {
			barcode,
			quantity,
			"sellingPrice": price
		};
		req.push(obj);
	}
	let json = JSON.stringify(req);
	let url = getOrderUrl() + "/" + globalOrderId;


	sendAjaxRequest(url,'PUT',json,(response)=>{
	   		getOrderList();
			orderEditModal.modal('toggle');
			handleAjaxSuccess("Order details updated successfully!!")

	   });
	
}

//____________________________________DETAILS BUTTON FUNCTIONALITY______________________________
function displayOrderDetails(id){
	let url = getOrderUrl() + "/" + id;
	sendAjaxRequest(url,'GET','',(data)=>{
	   		displayOrder(data);
	   });
}

function displayOrder(data){
	let $orderId = document.querySelector("#order-id")
	$orderId.innerText = ` (Id: ${data[0].orderId})`;
	let $tbody = orderItemsTable.find('tbody');
	$tbody.empty();
	for(let i in data){
		let e = data[i];
		let row = '<tr>'
		+ '<td>' + e.barcode + '</td>'
		+ '<td>' + e.name + '</td>'
		+ '<td>'  + e.quantity + '</td>'
		+ '<td class="text-right">'  + numberWithCommas(parseFloat(e.sellingPrice).toFixed(2)) + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}	
	orderItemsModal.modal('toggle');
}

function downloadBillPdf(blob){
	let link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	let currentdate = new Date();
	link.download = "bill_"+ currentdate.getDate() + "/"
	+ (currentdate.getMonth()+1)  + "/" 
	+ currentdate.getFullYear() + "@"  
	+ currentdate.getHours() + "h_"  
	+ currentdate.getMinutes() + "m_" 
	+ currentdate.getSeconds()+"s.pdf";
	link.click();
}

function generateInvoice(id){
	let url = getOrderUrl() + "/invoice/" + id;
	sendAjaxRequest(url,'GET','',(data)=>{
				// process recieved pdf
				let binaryString = window.atob(data);
				let binaryLen = binaryString.length;
				let bytes = new Uint8Array(binaryLen);

				for (let i = 0; i < binaryLen; i++) {
					let ascii = binaryString.charCodeAt(i);
					bytes[i] = ascii;
				}
				let blob = new Blob([bytes], {type: "application/pdf"});
			  	downloadBillPdf(blob);
				handleAjaxSuccess("Invoice printed successfully!!")
			  	let disableUrl = getOrderUrl() + "/invoice-disable/" + id;
				sendAjaxRequest(disableUrl,'GET','',()=>{
							getOrderList();
					});
			  getOrderList();
		});
}