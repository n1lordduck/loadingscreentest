var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Scene = (function () {
    var Sprites = Duck.Sprites;

    var canvas, ctx, buffer, bctx;
    var lw = 0, lh = 0, px = 4;
    var cheering = false;
    var startTime = 0;

    var CLOUDS = [
        { name: "cloud1", x: 0.05, y: 0.10, speed: 3.0, size: 2 },
        { name: "cloud2", x: 0.40, y: 0.05, speed: 2.0, size: 1 },
        { name: "cloud3", x: 0.62, y: 0.18, speed: 4.0, size: 1 },
        { name: "cloud2", x: 0.85, y: 0.30, speed: 2.5, size: 2 },
        { name: "cloud3", x: 0.20, y: 0.36, speed: 3.5, size: 1 },
        { name: "cloud1", x: 0.70, y: 0.46, speed: 1.6, size: 1 }
    ];

    var HILLS = [
        { color: "#9ad86b", edge: "#5fa847", base: 0.66, a: 7, period: 23, b: 3, period2: 9, phase: 0.4 },
        { color: "#7cc552", edge: "#4c9440", base: 0.74, a: 5, period: 17, b: 2, period2: 6, phase: 2.1 }
    ];

    var GROUND = "#6cc24a";

    function now() {
        return (window.performance && performance.now ? performance.now() : Date.now()) / 1000;
    }

    function pixelScale() {
        return Math.max(2, Math.floor(window.innerHeight / 270));
    }

    function resize() {
        px = pixelScale();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        lw = Math.ceil(canvas.width / px);
        lh = Math.ceil(canvas.height / px);
        buffer.width = lw;
        buffer.height = lh;
        Sprites.disableSmoothing(ctx);
        Sprites.disableSmoothing(bctx);
        if (Duck.onScaleChanged) Duck.onScaleChanged(px);
    }

    function drawSprite(name, x, y, scale) {
        var img = Sprites.get(name);
        if (!img) return 0;
        scale = scale || 1;
        bctx.drawImage(img, Math.floor(x), Math.floor(y), img.naturalWidth * scale, img.naturalHeight * scale);
        return img.naturalWidth * scale;
    }

    function drawSky() {
        var grad = bctx.createLinearGradient(0, 0, 0, lh);
        grad.addColorStop(0, "#79c4f2");
        grad.addColorStop(0.7, "#bfe6fb");
        grad.addColorStop(1, "#d9f1ff");
        bctx.fillStyle = grad;
        bctx.fillRect(0, 0, lw, lh);
    }

    function drawSun(t) {
        var bob = Math.round(Math.sin(t * 1.2) * 1.5);
        drawSprite("sun", lw - 92, 8 + bob, 1);
    }

    function drawClouds(t) {
        for (var i = 0; i < CLOUDS.length; i++) {
            var c = CLOUDS[i];
            var w = 48 * c.size;
            var span = lw + w;
            var x = ((c.x * span + t * c.speed) % span) - w;
            drawSprite(c.name, x, c.y * lh, c.size);
        }
    }

    function hillHeight(hill, x) {
        return hill.a * Math.sin(x / hill.period + hill.phase) + hill.b * Math.sin(x / hill.period2 + hill.phase * 2);
    }

    function drawHills() {
        for (var i = 0; i < HILLS.length; i++) {
            var hill = HILLS[i];
            for (var x = 0; x < lw; x++) {
                var top = Math.round(hill.base * lh - hillHeight(hill, x));
                bctx.fillStyle = hill.edge;
                bctx.fillRect(x, top, 1, 1);
                bctx.fillStyle = hill.color;
                bctx.fillRect(x, top + 1, 1, lh - top);
            }
        }
    }

    function groundTop() {
        return lh - 22;
    }

    function drawGround() {
        var gy = groundTop();
        var img = Sprites.get("grass");
        bctx.fillStyle = GROUND;
        bctx.fillRect(0, gy + 8, lw, lh - gy);
        if (!img) return;
        for (var x = 0; x < lw; x += img.naturalWidth) {
            bctx.drawImage(img, 0, 0, img.naturalWidth, 9, x, gy, img.naturalWidth, 9);
        }
    }

    function drawParade(t) {
        var feet = groundTop() + 4;
        var spacing = 28;
        var count = 5;
        var span = lw + spacing * count + 40;
        var head = ((t * 18 + lw * 0.45) % span) - 32;

        for (var i = 0; i < count; i++) {
            var scale = 1;
            var x = head - i * spacing - (i > 0 ? 18 : 0);
            var y = feet - 28 * scale;
            var name = (Math.floor(t * 5 + i) % 2 === 0) ? "duck_walk1" : "duck_walk2";
            if (cheering) {
                name = "duck_cheer";
                y -= Math.abs(Math.sin(t * 7 + i)) * 5;
            }
            drawSprite(name, x, y, scale);
        }
    }

    function frame() {
        var t = now() - startTime;
        drawSky();
        drawSun(t);
        drawClouds(t);
        drawHills();
        drawGround();
        drawParade(t);
        ctx.drawImage(buffer, 0, 0, lw * px, lh * px);
        schedule();
    }

    function schedule() {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(frame);
        } else {
            setTimeout(frame, 33);
        }
    }

    function start(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext("2d");
        buffer = document.createElement("canvas");
        bctx = buffer.getContext("2d");
        startTime = now();
        resize();
        window.addEventListener("resize", resize);
        schedule();
    }

    function setCheering(value) {
        cheering = !!value;
    }

    function scale() {
        return px;
    }

    return { start: start, setCheering: setCheering, scale: scale };
})();
