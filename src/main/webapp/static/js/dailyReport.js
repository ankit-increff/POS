let dailyTable = $('#daily-table');

$(document).ready(getReportList);

const getReportUrl = () => getBaseUrl() + `/api/reports/daily-report`;

function getReportList(){
	let url = getReportUrl();
	sendAjaxRequest(url,'GET','',(data)=>{
	   		displayReportList(data);
	   });
	   
	let element = document.querySelector("#dailyReportLink");
	element.classList.add("active");
}

//UI DISPLAY METHODS
function displayReportList(data){
	let $tbody = dailyTable.find('tbody');
	$tbody.empty();
	data.reverse();
	for(let i in data){
		let e = data[i];
		let row = `<tr>`
		+ `<td> ${parseInt(+i+1)} </td>`
		+ `<td> ${convertTimeStampToDateTime(e.date)} </td>`
		+ `<td> ${e.orders} </td>`
		+ `<td> ${e.items} </td>`
		+ `<td class="text-right"> ${numberWithCommas(parseFloat(e.revenue ).toFixed(2))} </td>`
		+ `</tr>`;
        $tbody.append(row);
	}
}

function convertTimeStampToDateTime(timestamp) {
    let date = new Date(timestamp);
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