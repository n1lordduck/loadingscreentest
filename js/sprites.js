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
        var pending = NAMES.length;
        for (var i = 0; i < NAMES.length; i++) {
            (function (name) {
                var img = new Image();
                img.onload = img.onerror = function () {
                    pending -= 1;
                    if (pending === 0) done();
                };
                img.src = "assets/sprites/" + name + ".png";
                images[name] = img;
            })(NAMES[i]);
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

    return { load: load, get: get, paintInto: paintInto, disableSmoothing: disableSmoothing };
})();
