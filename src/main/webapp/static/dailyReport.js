console.log("Report running");
let element = document.querySelector("#dailyReportLink");
element.classList.add("active");


function getReportUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/reports/daily-report";
}

function getReportList(){
	var url = getReportUrl();
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		console.log("succesfully fetched list");
	   		displayReportList(data);
	   },
	   error: handleAjaxError
	});
}

//UI DISPLAY METHODS

function displayReportList(data){
	var $tbody = $('#daily-table').find('tbody');
	$tbody.empty();
	data.reverse();
	let index = 1;
	for(var i in data){
		var e = data[i];
		console.log(e);
		var row = '<tr>'
		+ '<td>' + index++ + '</td>'
		+ '<td>' + convertTimeStampToDateTime(e.date) + '</td>'
		+ '<td>' + e.orders + '</td>'
		+ '<td>'  + e.items + '</td>'
		+ '<td class="text-right">'  + numberWithCommas(parseFloat(e.revenue ).toFixed(2)) + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
}

function convertTimeStampToDateTime(timestamp) {
    var date = new Date(timestamp);
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
    );
  }

$(document).ready(getReportList);

