var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Fx = (function () {
    function rect(ctx, x, y, w, h, color, alpha) {
        ctx.globalAlpha = alpha === undefined ? 1 : alpha;
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
        ctx.globalAlpha = 1;
    }

    function disc(ctx, cx, cy, r, color, alpha) {
        ctx.globalAlpha = alpha === undefined ? 1 : alpha;
        ctx.fillStyle = color;
        for (var dy = -r; dy <= r; dy++) {
            var w = Math.floor(Math.sqrt(r * r - dy * dy + 0.25));
            ctx.fillRect(Math.floor(cx) - w, Math.floor(cy) + dy, w * 2 + 1, 1);
        }
        ctx.globalAlpha = 1;
    }

    function hash(n, salt) {
        var x = Math.sin(n * 127.1 + (salt || 0) * 311.7) * 43758.5453;
        return x - Math.floor(x);
    }

    function lerp(a, b, u) {
        return a + (b - a) * u;
    }

    function eachShot(t, period, offset, burst, gap, maxAge, fn) {
        var cycle = Math.floor((t + offset) / period);
        for (var c = cycle - 1; c <= cycle; c++) {
            for (var k = 0; k < burst; k++) {
                var age = t - (c * period - offset + k * gap);
                if (age >= 0 && age <= maxAge) fn(age, c * 7 + k, k);
            }
        }
    }

    function flash(ctx, x, y, age, dir) {
        if (age > 0.13) return;
        var big = age < 0.07;
        rect(ctx, x - 1, y - 1, 3, 3, "#fffbe0");
        rect(ctx, dir > 0 ? x + 2 : x - (big ? 7 : 5), y, big ? 6 : 4, 1, "#ffd23f");
        rect(ctx, x, y - (big ? 3 : 2), 1, big ? 7 : 5, "#ffb030");
        rect(ctx, x + dir * 2, y - 2, 1, 1, "#ff8a1f");
        rect(ctx, x + dir * 2, y + 2, 1, 1, "#ff8a1f");
    }

    function bullet(ctx, x, y, dir) {
        rect(ctx, dir > 0 ? x - 10 : x + 1, y, 9, 1, "#ffb030", 0.4);
        rect(ctx, dir > 0 ? x - 5 : x, y, 5, 1, "#ffe25a", 0.8);
        rect(ctx, dir > 0 ? x - 2 : x, y, 3, 1, "#ffffff");
    }

    function spark(ctx, x, y, age) {
        if (age < 0 || age > 0.28) return;
        var d = 1 + age * 22;
        var a = 1 - age / 0.28;
        var pts = [[1, 0], [-1, 0], [0, -1], [0.7, -0.7], [-0.7, -0.7], [0, 0.5]];
        for (var i = 0; i < pts.length; i++) {
            rect(ctx, x + pts[i][0] * d, y + pts[i][1] * d, 1, 1, i % 2 ? "#ffe25a" : "#ffffff", a);
        }
    }

    function dust(ctx, x, y, age) {
        if (age < 0 || age > 0.8) return;
        var u = age / 0.8;
        disc(ctx, x - u * 3, y - u * 4, 1 + Math.floor(u * 3), "#c9bfa8", 0.6 * (1 - u));
        disc(ctx, x + u * 4, y - u * 3, 1 + Math.floor(u * 2), "#b8ad94", 0.5 * (1 - u));
    }

    function explosion(ctx, cx, cy, age, size) {
        if (age < 0 || age > 2.2) return;
        var grow = Math.min(1, age / 0.35);
        var r = Math.round(size * (0.3 + 0.7 * grow));
        if (age < 0.55) {
            var core = age < 0.12 ? "#ffffff" : age < 0.25 ? "#ffe25a" : age < 0.4 ? "#ff9a2a" : "#e8442a";
            disc(ctx, cx, cy, r, core, 1);
            disc(ctx, cx, cy, Math.max(1, Math.round(r * 0.55)), age < 0.3 ? "#fff6c0" : "#ffb030", 1);
        }
        var s = Math.max(0, age - 0.2) / 2;
        if (s < 1) {
            disc(ctx, cx + Math.sin(age * 3) * 2, cy - s * size * 1.6, Math.round(r * 0.8 + s * size * 0.5), "#3a3440", 0.6 * (1 - s));
        }
        if (age < 0.7) {
            for (var i = 0; i < 7; i++) {
                var ang = i * 0.9 + 0.3;
                var d = age * size * 3.2;
                rect(ctx, cx + Math.cos(ang) * d, cy + Math.sin(ang) * d * 0.8 + age * age * 26, 1, 1, "#ffcf5a", 1 - age / 0.7);
            }
        }
    }

    function smokeColumn(ctx, x, y, t, height, color) {
        for (var i = 0; i < 6; i++) {
            var phase = (t * 0.3 + i / 6) % 1;
            disc(ctx, x + Math.sin(phase * 6 + i) * 4, y - phase * height, 2 + Math.floor(phase * 5), color, 0.5 * (1 - phase));
        }
    }

    function ring(ctx, cx, cy, age, size) {
        if (age < 0 || age > 0.8) return;
        var u = age / 0.8;
        var rx = 2 + u * size;
        for (var i = 0; i < 18; i++) {
            var a = i / 18 * 6.2832;
            rect(ctx, cx + Math.cos(a) * rx, cy + Math.sin(a) * rx * 0.3, 1, 1, "#dff4ff", 0.9 * (1 - u));
        }
    }

    return {
        rect: rect, disc: disc, hash: hash, lerp: lerp, eachShot: eachShot, flash: flash, bullet: bullet,
        spark: spark, dust: dust, explosion: explosion, smokeColumn: smokeColumn, ring: ring
    };
})();
