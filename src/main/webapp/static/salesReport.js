function getSalesReportUrl(){
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    return baseUrl + "/api/reports/sales";
 }

 const getBrandUrl = (brand="", category="") => {
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/brand?brand="+brand+"&category="+category;
}

let primaryField = null;
 
 function filterSalesReport(e) {
    e.preventDefault();
     var $form = $("#sales-form");
     var json = toJson($form);
     var url = getSalesReportUrl();

     $.ajax({
        url: url,
        type: 'POST',
        data: json,
        headers: {
         'Content-Type': 'application/json'
        },
        success: function(response) {
             displaySalesReport(response);
        },
        error: handleAjaxError
     });
 }
 
 function displaySalesReport(data) {
     var $tbody = $('#sales-table').find('tbody');
     $tbody.empty();
     let index = 1;
     for(var i in data){
         var b = data[i];
         var row = '<tr>'
         + '<td>' + index++ +'</td>'
         + '<td>' + b.brand + '</td>'
         + '<td>' + b.category + '</td>'
         + '<td>' + b.quantity + '</td>'
         + '<td class="text-right">' + numberWithCommas(parseFloat(b.revenue ).toFixed(2))+ '</td>'
         + '</tr>';
         $tbody.append(row);
     }
     $('thead').show();

	primaryField = null;
	fillOptions();
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
	initial += '<option value="">All</option>';
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
	initial += '<option value="">All</option>';
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
    $('thead').hide();
    fillOptions();
    $("#inputEndDate")[0].max = new Date().toISOString().split("T")[0];

	let element = document.querySelector("#salesReportLink");
	element.classList.add("active");
 }
 
 $(document).ready(init);