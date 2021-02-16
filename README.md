# Videochat Dokumentation
## Ziel des Projekts
Das Ziel des Projektes ist es ein P2P Videochat Tool zu entwickeln, welches ohne jeglichen Speichern von Personenbezogenen Daten auskommt (Serverlog ausgenommen). Dazu wird ein Accountsystem mit anmelden sowie Neuerstellung eines Accounts geschaffen. Diese Accounts sollen sich über ihren Benutzernamen + Tag anfreunden können und so Videotelefonate starten können. Diese sollen über ein Raumsystem funktionieren. Für die Räume bracht man dementsprechend die richtige Berechtigung. Das Raumsystem soll es ermöglichen Später einfacher Gruppen hinzuzufügen, da diese Räume von sich aus mehr Teilnehmer als 2 erlauben. Des Weiteren soll sofern die Zeit bleibt an einer Desktop Version gearbeitet werden, und ein P2P Chat Tool erstellt werden.

## Tagebuch

### 16.02.21
Ich habe im Moment noch einen Fehler in dem Call Code, denn ich verbinde mich mit dem anderen sobald eine Anruf kommt, von jemandem den ich angerufen habe, wenn ich allerdings zurückrufe, werde ich nicht verbunden, das lässt sich aber relativ leicht beheben. Ich habe das jetzt gelöst indem ich bei einem Anruf speichere wer mich anruft und sobald ich jemanden anrufe checke ob die Person mich schon angerufen hat, wenn ja dann verbinde ich mich auch gleich, sonst mache ich einen normalen Anruf, das ist zwar nicht optimal, aber funktioniert, und in anbetracht der verkürzten Zeit ist es zumindest zum Testen ok, in einem Endprodukt müsste man das überarbeiten.

### 09.02.21, 16.02.21
Aktuell habe ich das Problem, das die PeerJS library nicht funktioniert, der Verbindungscode, sprich die IDs etc. werden richtig ziwschen den Clients hin und her geschickt, aber sobald man die PeerID des anderen für den Verbindungsaufbau verwendet gibt es keine weitere Reaktion. Das Problem war, das ich schon beim aufrufen der Seite die PeerID mit in die Datenbank geschickt habe, dann der PeerClient seine ID vom Server allerdings noch nicht bekommen hatte, und so der Wert falsch war. Das habe ich behoben indem ich die PeerID zu begin des Anrufens schicke, das klappt.

### 09.02.21
Heute hatte ich beim einbinden der Peerjs library ein clientseitigen Problem, bei dem die Klasse Peer nicht definiert war, meine erste Idee war, das die scripte in der falschen Reiheinfolge geladen werden also habe ich das geändert, danach gab es das Problem weiter, nachdem ich alles neugestartet habe, hat es wieder geklappt. Ich vermute das die Scripte falschrum eingelesen wurden, und das beim ersten Versuch nicht alles richtig geladen war.

### 15.12.20, 19.01.21
Ich habe den Fehler des letzten Males, das die Socket.io Connection nicht funktioniert behoben, der Fehler lag darin, dass ich Client Seitig nicht die Socket.io Library eingebunden hatte, was nötig für das Funktionieren der Verbindung ist.

```javascript
<script src="/socket.io/socket.io.js"></script>
```

### 8.12.20, 15.11.20
Ich habe versucht einen .sccs Stylesheet in Bootstrap einzubauen, um eine globale möglichkeit zu haben die Bootstrap Colors (primary, secondary, etc.) zu verändern, das hat nicht so gut geklappt obwohl es keine Errors gibt bleiben die Werte bei den alten. Ich kann mir nicht erklären woran das liegt, da diese Problem auch nur kosmetischer Natur ist werde ich das erstmal nach hinten auf die To Do Liste setzen.

### 10.11.20, 17.11.20
Aktuell arbeite ich am Stylen der Website und haben mehrere Probleme, auf der einen Seite kriege ich es nicht hin die Sidebar vernünftig zu Stylen und auch die Einstellungen. Das Sidebar Problem hab ich 50% gelöst (Es gibt jetzt eine Sidebar) aber man kann die größe noch nicht verändern, und die Einstellungen sehen auch ganz gut aus.

### 20.10.20
Ich hatte das Problem, das ich beim Neuladen der Userlists (also Friends, Pending, Blocked) immer bevor das alte Ergebis gelöscht wurde ein kurzer Augenblick mit einer leeren Liste war. Das habe ich behoben in dem ich einen neuen Table Body erstellt haben, dem alle neuen Einträge angehängt, und danach den alten Table Body mit dem neuen ersetzt habe. 

```javascript
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
``` 

