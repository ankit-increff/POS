const initialize = () => {
    verifyRole();
    verifyNumberInput();
}

$(document).ready(initialize);

const getBaseUrl = () => $("meta[name=baseUrl]").attr("content");
const getRole = () => $("meta[name=role]").attr("content");

const verifyRole = () => {
    if(getRole() !== "supervisor") {
        $(".supervisor-only").hide();
    }
}

//prevent 'e' press in number field
let invalidChars = [
    "-",
    "+",
    "e",
];

const verifyNumberInput = () =>  document.querySelectorAll('input[type="number"]').forEach( input => input.addEventListener("keydown", function(e) {
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  }));

//HELPER METHOD
function toJson($form){
    let serialized = $form.serializeArray();
    let s = '';
    let data = {};
    for(s in serialized){
        data[serialized[s]['name']] = serialized[s]['value']
    }
    let json = JSON.stringify(data);
    return json;
}

function handleAjaxError(response){
	var response = JSON.parse(response.responseText);////////////////////////////
    $('.notifyjs-wrapper').trigger('notify-hide');
    $.notify.defaults( {clickToHide:true,autoHide:false} );
    $.notify(response.message + " ❌", 'error');
}

function throwError(message){
    $('.notifyjs-wrapper').trigger('notify-hide');
    $.notify.defaults( {clickToHide:true,autoHide:false} );
    $.notify(message + " ❌", 'error');
}

function handleAjaxSuccess(response){
    $('.notifyjs-wrapper').trigger('notify-hide');
    $.notify.defaults( {clickToHide:true,autoHide:true} );
    $.notify(response, 'success');
}

function readFileData(file, callback){
	let config = {
		header: true,
		delimiter: "\t",
		skipEmptyLines: "greedy",
		complete: function(results) {
			callback(results);
	  	}	
	}
	Papa.parse(file, config);
}


function writeFileData(arr){
	let config = {
		quoteChar: '',
		escapeChar: '',
		delimiter: "\t"
	};
	
	let data = Papa.unparse(arr, config),
    blob = new Blob([data], {type: 'text/tsv;charset=utf-8;'}),
    fileUrl =  null;

    if (navigator.msSaveBlob) {
        fileUrl = navigator.msSaveBlob(blob, 'download.tsv');
    } else {
        fileUrl = window.URL.createObjectURL(blob);
    }
    let tempLink = document.createElement('a');
    tempLink.href = fileUrl;
    tempLink.setAttribute('download', 'download.tsv');
    tempLink.click(); 
    tempLink.remove();
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

const sendAjaxRequest = (url, type, data, callback, error=handleAjaxError) => {
    $.ajax({
        url,
        type,
        data,
        headers: {
            'Content-Type': 'application/json'
        },
        success: callback,
        error
     });
}