var friendmenu = document.getElementById('friendmenu');
var requestmenu = document.getElementById('requestmenu');
var requestButton = document.getElementById('requestbutton');
var requestInput = document.getElementById('requestinput');

loadUserPanels("name", "tag");
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

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }