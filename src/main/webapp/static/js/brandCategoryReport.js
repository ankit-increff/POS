let thead = $('thead'),
$brandForm = $("#brand-form"),
brandTable = $('#brand-table'),
$selectBrand = $("#inputBrand"),
$selectCategory = $("#inputCategory"),
primaryField = null;

$(document).ready(init);
function init(){
	thead.hide();
	fillOptions();

	let element = document.querySelector("#brandCategoryReportLink");
	element.classList.add("active");
}

const getBrandCategoryUrl = () => getBaseUrl() + "/api/reports/brand-category";
const getBrandUrl = (brand="", category="") => getBaseUrl() + `/api/brand?brand=${brand}&category=${category}`;

function filterReport(e) {
	e.preventDefault();
	let json = toJson($brandForm);
	let url = getBrandCategoryUrl();

	sendAjaxRequest(url,'POST',json,(response)=>{
			displayBrandList(response);
	   });
}

//UI DISPLAY METHODS
function displayBrandList(data){
	let $tbody = brandTable.find('tbody');
	$tbody.empty();
	for(let i in data){
		let e = data[i];
		let row = `<tr>`
		+ `<td> ${parseInt(+i+1)} </td>`
		+ `<td> ${e.name} </td>`
		+ `<td> ${e.category} </td>`
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

	let initial = `<option value="" selected disabled>Choose a brand...</option>`;
	initial += `<option value="">All</option>`;
    $selectBrand.append(initial);

	let brands = new Set();
	for(let i in data){
		let e = data[i];
		brands.add(e.name);
	}
	const sortedBrands = new Set(Array.from(brands).sort());

	for(brand of sortedBrands.values()) {
		let ele = `<option value="${brand}">${brand}</option>`;
        $selectBrand.append(ele);
	}
}

const populateCategory = data => {
	$selectCategory.empty();

	let initial = `<option value="" selected disabled>Choose a category...</option>`;
	initial += `<option value="">All</option>`;
    $selectCategory.append(initial);

	let categories = new Set();
	for(let i in data){
		let e = data[i];
		categories.add(e.category);
	}
	const sortedCategories = new Set(Array.from(categories).sort());

	for(category of sortedCategories.values()) {
		let ele = `<option value="${category}">${category}</option>`;
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

	sendAjaxRequest(url,'GET',(response)=>{
			 populateBrand(response);
		});
}