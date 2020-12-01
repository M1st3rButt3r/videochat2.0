var nameHTML = document.getElementById('name');
var tagHTML = document.getElementById('tag');
var friendmenu = document.getElementById('friendmenu');
var requestmenu = document.getElementById('requestmenu');
var requestButton = document.getElementById('requestbutton');
var requestInput = document.getElementById('requestinput');

loadUserPanel(nameHTML, tagHTML);
reloadAllLists().catch((err)=> {if(err) throw err});
window.setInterval(function(){
    reloadAllLists().catch((err)=> {if(err) throw err});
  }, 1000);


async function reloadAllLists()
{
    loadRelationsList('friends', 'friendslist', generateFriendsListActionButtons, friendmenu);
    loadRelationsList('requests', 'requestslist', generateRequestsListActionButtons, requestmenu);
    loadRelationsList('requested', 'requestedlist', generateRequestedListActionButtons);
    loadRelationsList('blocks', 'blockslist', generateBlocksListActionButtons);
}

requestButton.addEventListener('click', () => {
    var user = requestInput.value.split('#');
    requestInput.value = '';
    requestWithName(user[0], user[1])
});