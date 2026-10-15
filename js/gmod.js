var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Gmod = (function () {
    var connected = false;

    function setChip(id, text) {
        var el = document.getElementById(id);
        if (!el || !text) return;
        el.innerHTML = "";
        el.appendChild(document.createTextNode(text));
        el.style.display = "block";
    }

    window.GameDetails = function (serverName, serverUrl, mapName, maxPlayers, steamId, gamemode, volume) {
        connected = true;
        setChip("chip-map", mapName);
        setChip("chip-mode", gamemode);
        if (maxPlayers) setChip("chip-players", maxPlayers + " vagas");
        if (Duck.Music && typeof volume === "number") Duck.Music.setGameVolume(volume);
    };

    window.SetStatusChanged = function (status) {
        connected = true;
        Duck.Loading.setStatus(status);
    };

    window.SetFilesTotal = function (total) {
        connected = true;
        Duck.Loading.setFilesTotal(total);
    };

    window.SetFilesNeeded = function (needed) {
        connected = true;
        Duck.Loading.setFilesNeeded(needed);
    };

    window.DownloadingFile = function (file) {
        connected = true;
        Duck.Loading.setDownloading(file);
    };

    return {
        connected: function () { return connected; }
    };
})();
