let userForm = $("#user-form"),
userTable = $('#user-table');
$userEditForm = $("#user-edit-form"),
userEditModal = $('#edit-user-modal');

$(document).ready(init);

function init(){
	getUserList()
	$('#add-user').click(addUser);
	$('#refresh-data').click(getUserList);
	$('#update-user').click(updateUser);
}

const getUserUrl = () => getBaseUrl() + "/api/admin/user";

//BUTTON ACTIONS
function addUser(event){
	let json = toJson(userForm);
	let url = getUserUrl();

	sendAjaxRequest(url,'POST',json,(response)=>{
	   		getUserList();    
	   });

	return false;
}

function getUserList(){
	let url = getUserUrl();
	sendAjaxRequest(url,'GET','',(data)=>{
	   		displayUserList(data);   
	   });
}

function deleteUser(id){
	let url = getUserUrl() + "/" + id;

	sendAjaxRequest(url,'DELETE','',(data)=>{
	   		getUserList();    
	   });
}

//UI DISPLAY METHODS
function displayUserList(data){
	let $tbody = userTable.find('tbody');
	$tbody.empty();
	for(let i in data){
		let e = data[i];
		let buttonHtml = `<button class="btn" title="Edit" onclick="displayEditUser(${e.id})"><img src="${getBaseUrl()}/static/images/edit1.png" alt="Edit" /></button>`
		// buttonHtml += `<button class="btn" title="Delete" onclick="deleteUser(${e.id})"><img src="${getBaseUrl()}/static/images/delete.png" alt="Delete" /></button>`
		let row = `<tr>`
		+ `<td> ${e.id} </td>`
		+ `<td> ${e.email} </td>`
		+ `<td> ${e.role} </td>`
		+ `<td class="text-center"> ${buttonHtml} </td>`
		+ `</tr>`;
        $tbody.append(row);
	}
}

function displayEditUser(id){
	let url = getUserUrl() + "/" + id;
	sendAjaxRequest(url,'GET','', (data)=>{
	   		displayUser(data);
	   });
}

function displayUser(data){
	if(data.role=="supervisor") {
		throwError("Can't edit supervisor!!");
		return;
	}
	$("#user-edit-form input[name=email]").val(data.email);
	$("#user-edit-form select[name=role]").val(data.role);
	userEditModal.modal('toggle');
}

function updateUser(event){
	let url = getUserUrl();

	//Set the values to update
	let json = toJson($userEditForm);

	sendAjaxRequest(url,'PUT',json,(response)=>{
	   		getUserList();
			userEditModal.modal('toggle');
	   });
}