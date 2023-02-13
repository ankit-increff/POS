let primaryField = null,
thead = $('thead'),
$salesForm = $("#sales-form"),
salesTable = $('#sales-table'),
$selectBrand = $("#inputBrand"),
$selectCategory = $("#inputCategory"),
inputStartDate = $("#inputStartDate"),
inputEndDate = $("#inputEndDate");

$(document).ready(init);
 
function init(){
	thead.hide();
	fillOptions();
	inputEndDate[0].max = new Date().toISOString().split("T")[0];
	inputStartDate[0].max = new Date().toISOString().split("T")[0];

	let element = document.querySelector("#salesReportLink");
	element.classList.add("active");
}
 
const getSalesReportUrl = () => getBaseUrl() + "/api/reports/sales";
const getBrandUrl = (brand="", category="") => getBaseUrl() + `/api/brand?brand=${brand}&category=${category}`;
 
 function filterSalesReport(e) {
    e.preventDefault();
     let json = toJson($salesForm);
     let url = getSalesReportUrl();

     sendAjaxRequest(url,'POST',json,(response)=>{
             displaySalesReport(response);
        });
 }
 
 function displaySalesReport(data) {
     let $tbody = salesTable.find('tbody');
     $tbody.empty();
     for(let i in data){
         let b = data[i];
         let row = `<tr>`
         + `<td> ${parseInt(+i+1)} </td>`
         + `<td> ${b.brand } </td>`
         + `<td> ${b.category} </td>`
         + `<td> ${b.quantity} </td>`
         + `<td class="text-right"> ${numberWithCommas(parseFloat(b.revenue ).toFixed(2))} </td>`
         + `</tr>`;
         $tbody.append(row);
     }
     thead.show();

	primaryField = null;
	fillOptions();
 }

const fillOptions = (brand="", category="") => {
	let url = getBrandUrl(brand, category);

	sendAjaxRequest(url,'GET','',(response)=>{
			populateBrand(response);
			populateCategory(response);
	   });
}

const populateBrand = data => {
	$selectBrand.empty();

	let initial = '<option value="" selected disabled>Choose a brand...</option>';
	initial += '<option value="">All</option>';
    $selectBrand.append(initial);

	let brands = new Set();
	for(let i in data){
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
	initial += '<option value="">All</option>';
    $selectCategory.append(initial);

	let categories = new Set();
	for(let i in data){
		let e = data[i];
		categories.add(e.category);
	}
	const sortedCategories = new Set(Array.from(categories).sort());

	for(category of sortedCategories.values()) {
		let ele = `<option value="${category}"> ${category} </option>`;
        $selectCategory.append(ele);
	}
}

const brandChanged = () => {
	if(primaryField=="category") return;
	primaryField = "brand";

	let brand = $selectBrand[0].value;
	let url = getBrandUrl(brand);

	sendAjaxRequest(url,'GET','',(response)=>{
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