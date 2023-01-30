let globalOrderId = 1;

function getOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/order";
}

//BUTTON ACTIONS
function addOrder(event){
	//Set the values to update
	var $rawForm = $("#order-form");	

	var json = convertJson($rawForm);
	var url = getOrderUrl();
	console.log(json);

	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },	 
	   success: function(response) {
			$('#add-order-modal').modal('toggle');
			$rawForm[0].reset();
	   		getOrderList();  
	   },
	   error: handleAjaxError
	});
//	location.reload();

	return false;
}

// function orderDetails(event){

//     console.log("update running...");
// 	$('#order-items-modal').modal('toggle');
// 	//Get the ID
// 	var id = $("#brand-edit-form input[name=id]").val();
// 	var url = getBrandUrl() + "/" + id;


// 	//Set the values to update
// 	var $form = $("#brand-edit-form");
// 	var json = toJson($form);

// 	$.ajax({
// 	   url: url,
// 	   type: 'PUT',
// 	   data: json,
// 	   headers: {
//        	'Content-Type': 'application/json'
//        },
// 	   success: function(response) {
// 	   		getBrandList();
// 	   },
// 	   error: handleAjaxError
// 	});

// 	return false;
// }


function getOrderList(){
	var url = getOrderUrl();
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayOrderList(data);  
	   },
	   error: handleAjaxError
	});
}

//HELPER FUNCTIONS
function convertJson($form){
    var serialized = $form.serializeArray();
    console.log("look ",serialized);
    var s = '';
	var arr = [];
    
    for(let i=0;i<serialized.length;i+=3){
		let data = {};
        data[serialized[i]['name']] = serialized[i]['value'];
		data[serialized[s+1]['name']] = serialized[i+1]['value'];
		data[serialized[s+2]['name']] = serialized[i+2]['value'];
		arr.push(data);
    }
    var json = JSON.stringify(arr);
    return json;
}

//UI DISPLAY METHODS

function displayOrderList(data){
	var $tbody = $('#order-table').find('tbody');
	$tbody.empty();
	data.reverse();
	for(var i in data){
		var e = data[i];
		console.log(e);

		var newDate = new Date(e.date);
		var buttonHtml = '<button title="Details" class="btn" onclick="displayOrderDetails(' + e.id + ')"><img src="'+getBaseUrl()+'/static/images/details.png" alt="Details" /></button>'
		if(e.invoiceGenerated) {
			buttonHtml += ' <button title="Edit" class="btn supervisor-only disabled"><img src="'+getBaseUrl()+'/static/images/edit2.png" alt="Edit" /></button>'
		} else {
			buttonHtml += ' <button title="Edit" class="btn supervisor-only" onclick="displayEditOrder(' + e.id + ')"><img src="'+getBaseUrl()+'/static/images/edit1.png" alt="Edit" /></button>'
		}
		
		buttonHtml += ' <button title="Invoice" class="btn" onclick="generateInvoice(' + e.id + ')"><img src="'+getBaseUrl()+'/static/images/invoice.png" alt="Invoice" /></button>'
		
		var row = '<tr>'
		+ '<td>' + e.id + '</td>'
		+ '<td>' + newDate.toString() + '</td>'
		+ '<td class="text-right">'  + numberWithCommas(parseFloat(e.amount).toFixed(2)) + '</td>'
		+ '<td class="text-center">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
	verifyRole();
}

//_____________________________________________EDIT BUTTON FUNCTIONALITY____________________________________

function displayEditOrder(id){
	var url = getOrderUrl() + "/" + id;
	globalOrderId = id;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		editOrderForm(data);
	   },
	   error: handleAjaxError
	});
}

function editOrderForm(data) {
	var $orderId = document.querySelector("#order-id-edit")
	$orderId.innerText = ` (Id: ${data[0].orderId})`;
	var $tbody = $('#order-edit-table').find('tbody');
	$tbody.empty();
	for(var i in data) {
		var e = data[i];
		var buttonHtml = '<button title="Delete" class="btn" onclick=removeFromModal(event)><img src="'+getBaseUrl()+'/static/images/delete.png" alt="Delete" /></button>'
		var row = '<tr class="update-row">'
		+ '<td class="update-barcode">' + e.barcode + '</td>'
		+ '<td>' + e.name + '</td>'
		+ '<td><input type="number" step="1" min="1" class="form-control update-quantity" value="'  + e.quantity + '" required></td>'
		+ '<td class="text-right"><input step="0.01" min="0.01" type="number" class="form-control text-right update-price" value="'  + parseFloat(e.sellingPrice).toFixed(2) + '" required></td>'
		+ '<td class="text-center">' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
	verifyNumberInput();	
	$('#order-edit-modal').modal('toggle');
}

//_____________________________________________MODIFY EDIT TABLE____________________________________
function addInEditTable(e) {
	e.preventDefault();

	let barcode = document.querySelector(".edit-barcode");
	let quantity = document.querySelector(".edit-quantity");
	let price = document.querySelector(".edit-price");

	if(checkValue(quantity.value, price.value)===false) return;

	var baseUrl = $("meta[name=baseUrl]").attr("content")
	var productUrl = baseUrl + "/api/product"

	var url = productUrl + "?barcode=" + barcode.value;
	console.log(url);
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
			console.log(data);
	   		displayInEditTable(data);
	   },
	   error: handleAjaxError
	});
}

function displayInEditTable(e) {
	let quantity = document.querySelector(".edit-quantity");
	let price = document.querySelector(".edit-price");
	let barcode = document.querySelector(".edit-barcode");
	
	if(parseFloat(price.value)>parseFloat(e.mrp)) {
		throwError("Selling price should not be greater than MRP (i.e. "+parseFloat(e.mrp).toFixed(2)+")");
		return;
	}
	
	var $tbody = $('#order-edit-table').find('tbody');
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

	var buttonHtml = '<button title="Delete" class="btn" onclick=removeFromModal(event)><img src="'+getBaseUrl()+'/static/images/delete.png" alt="Delete" /></button>'
	var row = '<tr class="update-row">'
		+ '<td class="update-barcode">' + e.barcode + '</td>'
		+ '<td>' + e.name + '</td>'
		+ '<td><input type="number" min="1" class="form-control update-quantity" value="'  + quantity.value + '" required></td>'
		+ '<td><input type="number" step="0.01" min="0.01" max="'+ parseFloat(e.mrp).toFixed(2) +'" class="form-control text-right update-price" value="'  + parseFloat(price.value).toFixed(2) + '" required></td>'
		+ '<td class="text-center">' + buttonHtml + '</td>'
		+ '</tr>';
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

	var baseUrl = $("meta[name=baseUrl]").attr("content")
	var productUrl = baseUrl + "/api/product"

	var url = productUrl + "?barcode=" + barcode.value;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayInCreateTable(data);
	   },
	   error: handleAjaxError
	});
}

function displayInCreateTable(e) {
	let quantity = document.querySelector(".add-quantity");
	let price = document.querySelector(".add-price");
	let barcode = document.querySelector(".add-barcode");

	if(parseFloat(price.value)>parseFloat(e.mrp)) {
		throwError("Selling price should not be greater than MRP (i.e. "+parseFloat(e.mrp).toFixed(2)+")");
		return;
	}
	
	var $tbody = $('#order-add-table').find('tbody');
	let barcodes = $tbody[0].querySelectorAll(".new-barcode");
	console.log(barcodes);
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

	var buttonHtml = '<button title="Delete" class="btn" onclick=removeFromModal(event)><img src="'+getBaseUrl()+'/static/images/delete.png" alt="Delete" /></button>'
	var row = '<tr class="new-row">'
		+ '<td class="new-barcode">' + e.barcode + '</td>'
		+ '<td>' + e.name + '</td>'
		+ '<td><input type="number" class="form-control new-quantity" value="'  + quantity.value + '" min="1" required></td>'
		+ '<td class="text-right"><input type="number" step="0.01" class="form-control text-right new-price" min="0.01" max="'+ parseFloat(e.mrp).toFixed(2) +'" value="'  + parseFloat(price.value).toFixed(2) + '" required></td>'
		+ '<td class="text-center">' + buttonHtml + '</td>'
		+ '</tr>';
     $tbody.append(row);
	 verifyNumberInput();

	 quantity.value = null;
	 price.value = null;
	 barcode.value = null;
}

//____________________________________PLACE NEW ORDER________________________________________
function createNewOrder(e) {
	e.preventDefault();
	console.log("update click registered!");
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
	console.log(req);
	var json = JSON.stringify(req);
	var url = getOrderUrl();

	console.log(json);

	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
			$('#add-order-modal').modal('toggle');
			$('#order-add-table').find('tbody').empty();
	   		getOrderList();
			handleAjaxSuccess("Order placed successfully!!")

	   },
	   error: handleAjaxError
	});
}


//____________________________________SUBMIT UPDATE ORDER________________________________________
function updateOrder(e) {
	e.preventDefault();
	console.log("update click registered!");
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
	console.log(req);
	var json = JSON.stringify(req);
	var url = getOrderUrl() + "/" + globalOrderId;

	console.log(json);

	$.ajax({
	   url: url,
	   type: 'PUT',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		getOrderList();
			$('#order-edit-modal').modal('toggle');
			handleAjaxSuccess("Order details updated successfully!!")

	   },
	   error: handleAjaxError
	});
	
}



//____________________________________DETAILS BUTTON FUNCTIONALITY______________________________

function displayOrderDetails(id){
	var url = getOrderUrl() + "/" + id;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayOrder(data);
	   },
	   error: handleAjaxError
	});
}

function displayUploadData(){
 	resetUploadDialog(); 	
	$('#upload-order-modal').modal('toggle');
}

function displayOrder(data){
	console.log(data);
	var $orderId = document.querySelector("#order-id")
	console.log($orderId);
	$orderId.innerText = ` (Id: ${data[0].orderId})`;
	var $tbody = $('#order-items-table').find('tbody');
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		var row = '<tr>'
		+ '<td>' + e.barcode + '</td>'
		+ '<td>' + e.name + '</td>'
		+ '<td>'  + e.quantity + '</td>'
		+ '<td class="text-right">'  + numberWithCommas(parseFloat(e.sellingPrice).toFixed(2)) + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}	
	$('#order-items-modal').modal('toggle');
}



function downloadBillPdf(blob){
	let link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	var currentdate = new Date();
	link.download = "bill_"+ currentdate.getDate() + "/"
	+ (currentdate.getMonth()+1)  + "/" 
	+ currentdate.getFullYear() + "@"  
	+ currentdate.getHours() + "h_"  
	+ currentdate.getMinutes() + "m_" 
	+ currentdate.getSeconds()+"s.pdf";
	link.click();
}

function generateInvoice(id){
	console.log(id);
	var url = getOrderUrl() + "/invoice/" + id;
	console.log(url);
	$.ajax({
		   url: url,
		   type: 'GET',
		   success: function(data) {
			console.log(data);
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
			  	var disableUrl = getOrderUrl() + "/invoice-disable/" + id;
				$.ajax({
					url : disableUrl,
					type : 'GET',
					success : function(){
							getOrderList();
					},
					error:handleAjaxError
				});
			  getOrderList();
		},
			error: handleAjaxError
		});
}


//INITIALIZATION CODE
function init(){
	// $('#add-order-confirm').click(CreateNewOrder);
	$('#refresh-data').click(getOrderList);
	$('#upload-data').click(displayUploadData);
	// $('#process-data').click(processData);
	// $('#download-errors').click(downloadErrors);
    // $('#orderFile').on('change', updateFileName)

	let element = document.querySelector("#order-link");
	element.classList.add("active");
}

$(document).ready(init);
$(document).ready(getOrderList);