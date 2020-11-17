const apiUrl = 'http://localhost:3001/'

//calls get user api
async function getUserInfo(uuid) {
    if(uuid) {
        return fetch(apiUrl+'user/?uuid='+uuid, {credentials: 'include'})
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(err => {throw err;})
    }
    else{
        return fetch(apiUrl+'user/', {credentials: 'include'})
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(err => {throw err;})
    }

}

//calls get user info and sets the panels
async function loadUserPanel(name, tag) {
    getUserInfo().then(data => {
        name.innerHTML = data.name
        tag.innerHTML = "#" + data.tag
    })
}

//get all(of one type request, requested, friends) relations of a user
async function getRelations(url)
{
    return fetch(apiUrl+url, {credentials: 'include'})
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(err => {throw err;})
}

//loads evers relation of one type in the table and adds actionbuttons
function loadRelationsList(url, tableid, actionButtonsFunction, menu)
{
    var entrys = [];
    var tbody = document.createElement('tbody')
    getRelations(url).then(async function(data){
        for (let i = 0; i < data.length; i++) {
            var entry = await createTableEntry(data[i], actionButtonsFunction, menu)
            entrys.push(entry)
        }
        for (let i = 0; i < entrys.length; i++) {
            tbody.appendChild(entrys[i])
        }
        var table = document.getElementById(tableid)
        tbody.id = table.id
        tbody.classList = table.classList
        table.parentNode.replaceChild(tbody, table)
    })

}

//create a table entry with action buttons and returns it
async function createTableEntry(id, actionButtonsFunction, menu)
{
    var entry = document.createElement('tr')
    var nameEntry = document.createElement('td')
    var nameHTML = document.createElement('p')
    var tagHTML = document.createElement('p')
    var container = document.createElement('div')
    tagHTML.className = 'tag'

    entry.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        activateMenu(menu)
        menuData = id

        return false;
    })

    return getUserInfo(id).then(data=> {
        nameHTML.innerHTML = data.name
        tagHTML.innerHTML = '#'+data.tag
        container.appendChild(nameHTML)
        container.appendChild(tagHTML)
        nameEntry.appendChild(container)
        entry.appendChild(nameEntry)
        entry.appendChild(actionButtonsFunction())

        return entry
    })



}

//returns the action button for the friends list
function generateFriendsListActionButtons()
{
    var actionsEntry = document.createElement('td')
    var button = document.createElement('button')
    button.innerHTML='<i class="fas fa-phone"></i>'
    actionsEntry.appendChild(button)

    return actionsEntry
}

//returns the action button for the incoming requests list
function generateRequestsListActionButtons()
{
    var actionsEntry = document.createElement('td')
    var acceptButton = document.createElement('button')
    var dismissButton = document.createElement('button')
    acceptButton.innerHTML='<i class="fas fa-check"></i>'
    dismissButton.innerHTML='<i class="fas fa-times"></i>'
    actionsEntry.appendChild(acceptButton)
    actionsEntry.appendChild(dismissButton)

    return actionsEntry
}

//returns the action button for the incoming requests list
function generateRequestedListActionButtons()
{
    var actionsEntry = document.createElement('td')
    var dismissButton = document.createElement('button')
    dismissButton.innerHTML='<i class="fas fa-times"></i>'
    actionsEntry.appendChild(dismissButton)

    return actionsEntry
}

//returns the action button for the incoming requests list
function generateBlocksListActionButtons(id)
{
    var actionsEntry = document.createElement('td')
    var dismissButton = document.createElement('button')
    dismissButton.addEventListener('click', () =>{
        
    })
    dismissButton.innerHTML='<i class="fas fa-times"></i>'
    actionsEntry.appendChild(dismissButton)

    return actionsEntry
}

function block(id) {
    fetch(apiUrl +'block?uuid='+id, {credentials: 'include'})
    .then(()=> {
        reloadAllLists()
    })
    .catch((err)=>{
        if(err) throw err
    })
}

function unblock(id) {
    fetch(apiUrl +'unblock?uuid='+id, {credentials: 'include'})
    .then(()=> {
        reloadAllLists()
    })
    .catch((err)=>{
        if(err) throw err
    })
}

function call(id) {
    console.log('Call '+id)
}

function deleteRelation(id) {
    fetch(apiUrl +'deleteRelation?uuid='+id, {credentials: 'include'})
    .then(()=> {
        reloadAllLists()
    })
    .catch((err)=>{
        if(err) throw err
    })
}

function request(id)
{
    console.log('Accept Request '+id)
    reloadAllLists()
}

