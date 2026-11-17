var Duck = window.Duck || {};
window.Duck = Duck;
Duck.Scenes = Duck.Scenes || {};

Duck.Scenes.space = (function () {
    var Fx = Duck.Fx;

    var STARS = 130;
    var UFO_PERIOD = 16;
    var ROCKET_PERIOD = 22;
    var CRATERS = [[0.06, 3], [0.2, 2], [0.38, 4], [0.52, 2], [0.66, 3], [0.8, 2], [0.93, 4]];

    function drawStars(ctx, t, env) {
        for (var i = 0; i < STARS; i++) {
            var x = Math.floor(Fx.hash(i, 1) * env.lw);
            var y = Math.floor(Fx.hash(i, 2) * env.lh * 0.7);
            var a = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + Fx.hash(i, 3)) + i));
            Fx.rect(ctx, x, y, Fx.hash(i, 4) > 0.9 ? 2 : 1, Fx.hash(i, 4) > 0.9 ? 2 : 1, i % 7 === 0 ? "#bfe4ff" : "#fff6d0", a);
        }
    }

    function drawNebula(ctx, env) {
        var blobs = [[0.7, 0.3, 46, "#7a3cc8"], [0.62, 0.36, 34, "#c83c9a"], [0.12, 0.55, 40, "#3c5ac8"], [0.9, 0.6, 30, "#3cc8b8"]];
        for (var i = 0; i < blobs.length; i++) {
            Fx.disc(ctx, blobs[i][0] * env.lw, blobs[i][1] * env.lh, blobs[i][2], blobs[i][3], 0.09);
            Fx.disc(ctx, blobs[i][0] * env.lw, blobs[i][1] * env.lh, Math.floor(blobs[i][2] * 0.6), blobs[i][3], 0.08);
        }
    }

    function drawRing(ctx, cx, cy, front) {
        for (var i = 0; i < 90; i++) {
            var a = i / 90 * 6.2832;
            var y = Math.sin(a);
            if ((y > 0) !== front) continue;
            Fx.rect(ctx, cx + Math.cos(a) * 46, cy + y * 9 - 4, 1, 2, "#f2d8a0");
        }
    }

    function drawPlanet(ctx, env) {
        var cx = env.lw * 0.14;
        var cy = env.lh * 0.28;
        drawRing(ctx, cx, cy, false);
        var bands = ["#e8864a", "#f0a868", "#d9703a", "#f4b87a", "#e8864a", "#c9602e"];
        for (var dy = -28; dy <= 28; dy++) {
            var w = Math.floor(Math.sqrt(28 * 28 - dy * dy));
            var band = Math.floor((dy + 28 + Math.sin(dy * 0.4) * 2) / 9.5) % bands.length;
            Fx.rect(ctx, cx - w, cy + dy, w * 2, 1, bands[band]);
            Fx.rect(ctx, cx - w, cy + dy, Math.max(1, Math.floor(w * 0.35)), 1, "#fff0d0", 0.18);
            Fx.rect(ctx, cx + Math.floor(w * 0.45), cy + dy, Math.ceil(w * 0.55), 1, "#3a1a3a", 0.22);
        }
        drawRing(ctx, cx, cy, true);
    }

    function drawEarth(ctx, env) {
        var cx = env.lw * 0.755;
        var cy = env.lh * 0.43;
        Fx.disc(ctx, cx, cy, 8, "#2f6ad8");
        Fx.disc(ctx, cx - 2, cy - 1, 3, "#4fb44f");
        Fx.disc(ctx, cx + 3, cy + 3, 2, "#4fb44f");
        Fx.rect(ctx, cx - 4, cy - 5, 5, 1, "#ffffff", 0.7);
    }

    function drawShootingStar(ctx, t, env) {
        var cycle = Math.floor(t / 5);
        var age = (t % 5) / 0.8;
        if (age > 1) return;
        var x = Fx.hash(cycle, 6) * env.lw * 0.8 + 40;
        var y = Fx.hash(cycle, 7) * env.lh * 0.3;
        for (var k = 0; k < 10; k++) {
            Fx.rect(ctx, x + age * 90 - k * 2, y + age * 40 - k, 1, 1, "#ffffff", 1 - k / 10);
        }
    }

    function back(ctx, t, env) {
        drawNebula(ctx, env);
        drawStars(ctx, t, env);
        drawPlanet(ctx, env);
        drawEarth(ctx, env);
        drawShootingStar(ctx, t, env);
    }

    function ground(ctx, t, env) {
        for (var i = 0; i < CRATERS.length; i++) {
            var x = CRATERS[i][0] * env.lw;
            var r = CRATERS[i][1] * 3;
            Fx.rect(ctx, x - r, env.gy + 11, r * 2, 2, "#5f667f");
            Fx.rect(ctx, x - r + 2, env.gy + 10, r * 2 - 4, 1, "#a6adc4");
        }
    }

    function drawUfo(ctx, t, env) {
        var cycle = Math.floor(t / UFO_PERIOD);
        var p = t % UFO_PERIOD;
        var anchor = env.lw * (0.22 + Fx.hash(cycle, 8) * 0.56);
        var x;
        if (p < 4) {
            x = Fx.lerp(-40, anchor, 1 - Math.pow(1 - p / 4, 2));
        } else if (p < 12) {
            x = anchor + Math.sin(t * 1.5) * 3;
        } else {
            var q = (p - 12) / 4;
            x = Fx.lerp(anchor, env.lw + 40, q * q);
        }
        var y = env.lh * 0.16 + Math.sin(t * 1.3) * 3;
        var beam = p > 4.5 && p < 11.5;
        if (beam) {
            var fade = Math.min(1, Math.min(p - 4.5, 11.5 - p) * 2);
            ctx.globalAlpha = 0.16 * fade;
            ctx.fillStyle = "#8dffb0";
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 17);
            ctx.lineTo(x + 22, y + 17);
            ctx.lineTo(x + 32, env.gy + 8);
            ctx.lineTo(x, env.gy + 8);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            var rise = p < 8 ? (p - 4.5) / 3.5 : (11.5 - p) / 3.5;
            var dy = Fx.lerp(env.gy - 24, y + 14, Math.max(0, Math.min(1, rise)));
            env.duck(x, dy, "duck_cheer", ["ov_astro"], false);
        }
        env.sprite("ufo", x, y, 1);
    }

    function drawRocket(ctx, t, env) {
        var age = t % ROCKET_PERIOD;
        if (age > 6) return;
        var x = env.lw * 0.9;
        var y = env.gy - 22 - age * age * 15;
        for (var k = 0; k < 10; k++) {
            var ky = y + 30 + k * 6;
            Fx.disc(ctx, x + 10 + Math.sin(k + age * 4) * 2, ky, 2 + Math.floor(k / 3), "#d8d8e8", 0.5 * (1 - k / 10));
        }
        Fx.disc(ctx, x + 10, y + 33, 3, "#ffb030");
        Fx.disc(ctx, x + 10, y + 33, 1, "#ffffff");
        env.sprite("rocket", x, y, 1);
    }

    function drawAstronauts(ctx, t, env) {
        var span = env.lw + 120;
        for (var i = 0; i < 5; i++) {
            var x = ((t * 15 + i * 75) % span) - 40;
            var hop = Math.abs(Math.sin(t * 2.4 + i * 1.3)) * 14;
            var y = env.gy + 4 - 28 - hop;
            var frame = hop < 2 ? env.walk(t, i) : "duck_cheer";
            Fx.rect(ctx, x + 8 + hop * 0.3, env.gy + 7, Math.max(8, 18 - Math.floor(hop * 0.6)), 2, "#3a3f55", 0.45);
            env.duck(x, y, frame, ["ov_astro"], false);
        }
    }

    function parade(ctx, t, env) {
        drawRocket(ctx, t, env);
        drawUfo(ctx, t, env);
        drawAstronauts(ctx, t, env);
    }

    return { back: back, ground: ground, parade: parade };
})();
