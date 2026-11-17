var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Sprites = (function () {
    var NAMES = [
        "duck_idle", "duck_walk1", "duck_walk2", "duck_cheer",
        "cloud1", "cloud2", "cloud3", "grass", "crown", "star", "coin",
        "rule_cloud", "sun", "speaker_on", "speaker_off"
    ];

    var images = {};

    function load(done) {
        var names = NAMES.concat(Duck.Theme.current().sprites);
        var pending = names.length;
        for (var i = 0; i < names.length; i++) {
            (function (name) {
                var img = new Image();
                img.onload = img.onerror = function () {
                    pending -= 1;
                    if (pending === 0) done();
                };
                img.src = "assets/sprites/" + name + ".png";
                images[name] = img;
            })(names[i]);
        }
    }

    function get(name) {
        var img = images[name];
        return img && img.complete && img.naturalWidth > 0 ? img : null;
    }

    function disableSmoothing(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
    }

    function tintTo(dest, name, color, alpha) {
        var img = get(name);
        if (!img) return;
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvas.naturalWidth = canvas.width;
        canvas.naturalHeight = canvas.height;
        canvas.complete = true;
        images[dest] = canvas;
    }

    function applyTints(tints) {
        for (var name in tints) {
            if (tints.hasOwnProperty(name)) tintTo(name, name, tints[name][0], tints[name][1]);
        }
    }

    function applyAliases(aliases) {
        for (var name in aliases) {
            if (aliases.hasOwnProperty(name)) tintTo(name, aliases[name][0], aliases[name][1], aliases[name][2]);
        }
    }

    function paintInto(canvas, name, scale) {
        var img = get(name);
        if (!img) return;
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        var ctx = canvas.getContext("2d");
        disableSmoothing(ctx);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    return { load: load, get: get, applyTints: applyTints, applyAliases: applyAliases, paintInto: paintInto, disableSmoothing: disableSmoothing };
})();
