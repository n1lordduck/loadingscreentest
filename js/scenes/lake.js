var Duck = window.Duck || {};
window.Duck = Duck;
Duck.Scenes = Duck.Scenes || {};

Duck.Scenes.lake = (function () {
    var Fx = Duck.Fx;

    var PADS = [[0.12, 14, 0], [0.27, 26, 1], [0.43, 10, 0], [0.62, 30, 1], [0.78, 16, 0], [0.9, 24, 1]];
    var SWIMMERS = [
        { speed: 9, offset: 40, dir: 1, kids: 3 },
        { speed: 6, offset: 260, dir: -1, kids: 0 },
        { speed: 7, offset: 150, dir: 1, kids: 0 }
    ];

    function waterTop(env) {
        return Math.round(env.lh * 0.74);
    }

    function waterLine(env) {
        return env.lh - 27;
    }

    function mix(a, b, u) {
        return "rgb(" + Math.round(Fx.lerp(a[0], b[0], u)) + "," + Math.round(Fx.lerp(a[1], b[1], u)) + "," + Math.round(Fx.lerp(a[2], b[2], u)) + ")";
    }

    function drawWater(ctx, t, env) {
        var top = waterTop(env);
        var height = env.lh - top;
        for (var y = top; y < env.lh; y++) {
            ctx.fillStyle = mix([92, 190, 238], [34, 116, 192], (y - top) / height);
            ctx.fillRect(0, y, env.lw, 1);
        }
        Fx.rect(ctx, 0, top, env.lw, 1, "#d6f2ff", 0.8);
        for (var r = 0; r < 9; r++) {
            var y2 = top + 4 + r * Math.floor(height / 9);
            var len = 8 + (r % 3) * 3;
            for (var x = -((t * (5 + r * 1.6) + r * 17) % 36); x < env.lw; x += 36) {
                Fx.rect(ctx, x, y2, len, 1, "#bfe8ff", 0.45);
            }
        }
        for (var i = 0; i < 14; i++) {
            var gx = Math.floor(Fx.hash(i, 3) * env.lw);
            var gy = top + 2 + Math.floor(Fx.hash(i, 4) * 10);
            if (Math.sin(t * 2.4 + i * 1.7) > 0.4) Fx.rect(ctx, gx, gy, 2, 1, "#ffffff", 0.9);
        }
    }

    function drawBank(ctx, env, side) {
        var x0 = side < 0 ? 0 : env.lw;
        Fx.disc(ctx, x0 + side * 4, env.lh - 6, 30, "#4fa044");
        Fx.disc(ctx, x0 + side * 4, env.lh - 6, 26, "#5fb34f");
        Fx.disc(ctx, x0 + side * 28, env.lh + 2, 22, "#4fa044");
        Fx.disc(ctx, x0 + side * 28, env.lh + 2, 18, "#5fb34f");
    }

    function drawBanks(ctx, env) {
        drawBank(ctx, env, -1);
        drawBank(ctx, env, 1);
        env.sprite("tree", 3, env.lh - 56, 1);
        env.sprite("bush", 30, env.lh - 28, 1);
        env.sprite("tree", env.lw - 40, env.lh - 52, 1, true);
        env.sprite("bush", env.lw - 56, env.lh - 26, 1, true);
    }

    function drawPads(ctx, t, env) {
        for (var i = 0; i < PADS.length; i++) {
            var name = PADS[i][2] ? "lilyflower" : "lilypad";
            var x = PADS[i][0] * env.lw + Math.sin(t * 0.5 + i * 2) * 2;
            var y = env.lh - PADS[i][1] + Math.sin(t * 1.3 + i) * 0.8;
            env.sprite(name, x, y, 1);
        }
    }

    function ground(ctx, t, env) {
        drawWater(ctx, t, env);
        drawBanks(ctx, env);
        drawPads(ctx, t, env);
    }

    function immerse(ctx, x, y, width, depth) {
        Fx.rect(ctx, x, y + depth, width, 12, "#2f86c9", 0.82);
        Fx.rect(ctx, x + 1, y + depth - 1, width - 2, 1, "#cdeeff", 0.9);
    }

    function drawSwimmer(ctx, t, env, swimmer, index) {
        var span = env.lw + 90;
        var raw = (t * swimmer.speed + swimmer.offset) % span;
        var x = swimmer.dir > 0 ? raw - 45 : env.lw + 45 - raw;
        var bob = Math.sin(t * 1.8 + index * 2) * 0.8;
        var y = waterLine(env) - 20 + bob;
        env.duck(x, y, "duck_idle", [], swimmer.dir < 0);
        immerse(ctx, x + 2, y, 28, 20);
        Fx.ring(ctx, x + 16 - swimmer.dir * 12, waterLine(env) + 1, (t * 0.7 + index * 0.3) % 1, 12);
        for (var k = 0; k < swimmer.kids; k++) {
            var kx = x - swimmer.dir * (22 + k * 15);
            var ky = waterLine(env) - 11 + Math.sin(t * 2.2 + k) * 0.8;
            env.sprite("duckling", kx, ky, 1, swimmer.dir < 0);
            immerse(ctx, kx, ky, 17, 8);
        }
    }

    function biteAge(t) {
        return (t + 3) % 9;
    }

    function drawFisher(ctx, t, env) {
        var x0 = env.lw * 0.56 + Math.sin(t * 0.3) * 16;
        var bob = Math.sin(t * 1.4) * 1;
        var boatY = waterLine(env) - 10 + bob;
        env.sprite("boat", x0, boatY, 1);
        var dx = x0 + 6;
        var dy = boatY - 27;
        env.duck(dx, dy, "duck_idle", ["ov_rod"], false);
        var tipX = dx + 37;
        var tipY = dy + 3;
        var bite = biteAge(t);
        var dip = bite < 0.8 ? Math.sin(bite / 0.8 * 3.14) * 3 : 0;
        var bobberY = waterLine(env) + 3 + dip;
        Fx.rect(ctx, tipX, tipY, 1, bobberY - tipY, "#ffffff", 0.8);
        Fx.rect(ctx, tipX - 1, bobberY - 1, 3, 2, "#e84a4a");
        Fx.rect(ctx, tipX - 1, bobberY + 1, 3, 1, "#ffffff");
        Fx.ring(ctx, tipX, bobberY + 2, (t * 0.6) % 1, 9);
    }

    function drawJumper(ctx, t, env) {
        var period = 7;
        var cycle = Math.floor(t / period);
        var age = t % period;
        var x = (0.15 + Fx.hash(cycle, 5) * 0.7) * env.lw;
        var base = waterLine(env) + 4;
        Fx.ring(ctx, x, base, age, 12);
        if (age < 0.9) {
            var u = age / 0.9;
            env.sprite("fish", x - 6 + u * 12, base - 24 * Math.sin(u * 3.14) - 4, 1, u > 0.5);
        }
        Fx.ring(ctx, x + 12, base, Math.max(0, age - 0.9), 12);
    }

    function parade(ctx, t, env) {
        drawFisher(ctx, t, env);
        for (var i = 0; i < SWIMMERS.length; i++) drawSwimmer(ctx, t, env, SWIMMERS[i], i);
        drawJumper(ctx, t, env);
    }

    function drawBird(ctx, x, y, flap) {
        var pts = flap ? [[0, 1], [1, 0], [2, 0], [3, 1], [4, 0], [5, 0], [6, 1]] : [[0, 0], [1, 1], [2, 1], [3, 0], [4, 1], [5, 1], [6, 0]];
        for (var i = 0; i < pts.length; i++) Fx.rect(ctx, x + pts[i][0], y + pts[i][1], 1, 1, "#2d3b5c");
    }

    function back(ctx, t, env) {
        for (var i = 0; i < 4; i++) {
            var span = env.lw + 40;
            var x = ((t * (7 + i * 2) + i * 130) % span) - 20;
            drawBird(ctx, x, env.lh * (0.1 + i * 0.05) + Math.sin(t + i) * 3, Math.floor(t * 4 + i) % 2 === 0);
        }
    }

    function front(ctx, t, env) {
        for (var i = 0; i < 3; i++) {
            var x = env.lw * (0.25 + i * 0.25) + Math.sin(t * 1.1 + i * 2) * 28;
            var y = env.lh * 0.6 + Math.sin(t * 2.3 + i) * 7;
            Fx.rect(ctx, x, y, 3, 1, "#2a6ad8");
            Fx.rect(ctx, x + 1, y - 1, 1, 3, "#bfe8ff", Math.floor(t * 18 + i) % 2 ? 0.9 : 0.3);
        }
        var sway = Math.round(Math.sin(t * 1.2) * 1);
        env.sprite("reed", 6 + sway, env.lh - 30, 1);
        env.sprite("reed", 24 - sway, env.lh - 26, 1);
        env.sprite("reed", env.lw - 30 + sway, env.lh - 30, 1);
        env.sprite("reed", env.lw - 14 - sway, env.lh - 26, 1);
    }

    return { back: back, ground: ground, parade: parade, front: front };
})();
