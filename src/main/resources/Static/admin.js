const url = 'http://localhost:8080/api/admin';


function getAllUsers() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            loadTable(data)
        })
}

function getAdminPage() {
    fetch(url).then(response => response.json()).then(user =>
        loadTable(user))
}

function loadTable(listAllUsers) {
    let res = '';
    for (let user of listAllUsers) {
        res +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td id=${'role' + user.id}>${user.roles.map(r => r.name).join(' ').replaceAll('ROLE_', '')}</td>
                <td>
                    <button class="btn btn-info" type="button"
                    data-bs-toggle="modal" data-bs-target="#editModal"
                    onclick="editModal(${user.id})">Edit</button></td>
                <td>
                    <button class="btn btn-danger" type="button"
                    data-bs-toggle="modal" data-bs-target="#deleteModal"
                    onclick="deleteModal(${user.id})">Delete</button></td>
            </tr>`
    }
    document.getElementById('tableBodyAdmin').innerHTML = res;
}


getAdminPage();


// Добавление пользователя
document.getElementById('newUserForm').addEventListener('submit', (e) => {
    e.preventDefault()
    let role = document.getElementById('role_select')
    let rolesAddUser = []
    let rolesAddUserValue = ''
    for (let i = 0; i < role.options.length; i++) {
        if (role.options[i].selected) {
            rolesAddUser.push({id: role.options[i].value, name: 'ROLE_' + role.options[i].innerHTML})
            rolesAddUserValue += role.options[i].innerHTML
        }
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            username: document.getElementById('newUsername').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            roles: rolesAddUser
        })
    })
        .then((response) => {
            if (response.ok) {
                getAllUsers()
                document.getElementById("all-users-tab").click()
            }
        })
})


// Закрытие модального окна
function closeModal() {
    document.querySelectorAll(".btn-close").forEach((btn) => btn.click())
}


//Редактирование пользователя
function editModal(id) {
    fetch(url + '/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(u => {

            document.getElementById('editId').value = u.id;
            document.getElementById('editUsername').value = u.username;
            document.getElementById('editEmail').value = u.email;
            document.getElementById('editPassword').value = "****";

        })
    });
}


async function editUser() {
    const form_ed = document.getElementById('modalEdit');
    let idValue = document.getElementById("editId").value;
    let usernameValue = document.getElementById("editUsername").value;
    let emailValue = document.getElementById("editEmail").value;
    let passwordValue = document.getElementById("editPassword").value;
    let listOfRole = [];
    for (let i = 0; i < form_ed.roles.options.length; i++) {
        if (form_ed.roles.options[i].selected) {
            let tmp = {};
            tmp["id"] = form_ed.roles.options[i].value
            listOfRole.push(tmp);
        }
    }
    let user = {
        id: idValue,
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        roles: listOfRole
    }
    await fetch(url + '/' + user.id, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(user)
    });
    closeModal()
    getAllUsers()
}


// Удаление пользователя
function deleteModal(id) {
    fetch(url + '/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(u => {
            document.getElementById('deleteId').value = u.id;
            document.getElementById('deleteUsername').value = u.username;
            document.getElementById('deleteEmail').value = u.email;
            document.getElementById('deleteRole').value = u.roles.map(r => r.roles);
        })
    });
}

async function deleteUser() {
    const id = document.getElementById('deleteId').value
    let urlDel = url + "/" + id;
    let method = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch(urlDel, method).then(() => {
        closeModal()
        getAllUsers()
    })
}

