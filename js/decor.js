var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Decor = (function () {
    var STAR_COUNT = 70;
    var SNOW_COUNT = 90;
    var LIGHT_COLORS = ["#ff4650", "#ffe25a", "#5abeff", "#7cf06a"];

    var BAT_FRAMES = [
        ["x.......x", "xx.xxx.xx", "xxxxxxxxx", ".xx.x.xx.", "..x...x.."],
        ["....x....", "..xxxxx..", "xxxxxxxxx", "xx.xxx.xx", "x.......x"]
    ];

    var GROUND_ITEMS = {
        halloween: [
            [0.06, "pumpkin"], [0.17, "pumpkin_small"], [0.33, "cauldron"], [0.52, "pumpkin"],
            [0.70, "pumpkin_small"], [0.81, "cauldron"], [0.94, "pumpkin"]
        ],
        christmas: [
            [0.05, "pine"], [0.15, "gift_red"], [0.30, "snowman"], [0.47, "pine"],
            [0.60, "gift_blue"], [0.74, "pine"], [0.88, "gift_red"], [0.96, "pine"]
        ]
    };

    var stars = [];
    var flakes = [];

    function seeded(seed) {
        var value = seed;
        return function () {
            value = (value * 1664525 + 1013904223) % 4294967296;
            return value / 4294967296;
        };
    }

    function build() {
        var rand = seeded(7);
        for (var i = 0; i < STAR_COUNT; i++) {
            stars.push({ x: rand(), y: rand() * 0.5, phase: rand() * 6, big: rand() > 0.85 });
        }
        for (var j = 0; j < SNOW_COUNT; j++) {
            flakes.push({ x: rand(), y: rand(), speed: 6 + rand() * 10, sway: 1 + rand() * 3, size: rand() > 0.8 ? 2 : 1 });
        }
    }

    function drawStars(ctx, t, env) {
        ctx.fillStyle = "#fff6d0";
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            ctx.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(t * 1.3 + s.phase));
            ctx.fillRect(Math.floor(s.x * env.lw), Math.floor(s.y * env.lh), s.big ? 2 : 1, s.big ? 2 : 1);
        }
        ctx.globalAlpha = 1;
    }

    function drawBats(ctx, t, env) {
        ctx.fillStyle = "#120a1c";
        for (var i = 0; i < 4; i++) {
            var span = env.lw + 60;
            var x = ((i * span / 4 + t * (14 + i * 3)) % span) - 30;
            var y = env.lh * (0.12 + i * 0.07) + Math.sin(t * 1.7 + i * 2) * 7;
            var frame = BAT_FRAMES[Math.floor(t * 6 + i) % 2];
            for (var row = 0; row < frame.length; row++) {
                for (var col = 0; col < frame[row].length; col++) {
                    if (frame[row].charAt(col) === "x") ctx.fillRect(Math.floor(x) + col, Math.floor(y) + row, 1, 1);
                }
            }
        }
    }

    function drawGlow(ctx, cx, cy, t, i) {
        var flicker = 0.16 + 0.05 * Math.sin(t * 7 + i * 3);
        ctx.fillStyle = "rgba(255,138,31," + flicker + ")";
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, 6.2832);
        ctx.fill();
        ctx.fillStyle = "rgba(255,200,80," + flicker + ")";
        ctx.beginPath();
        ctx.arc(cx, cy, 11, 0, 6.2832);
        ctx.fill();
    }

    function drawBubbles(ctx, x, y, t, i) {
        ctx.fillStyle = "#9dff6a";
        for (var b = 0; b < 3; b++) {
            var phase = (t * 0.8 + b / 3 + i * 0.2) % 1;
            ctx.globalAlpha = 1 - phase;
            ctx.fillRect(Math.floor(x + (b - 1) * 4 + Math.sin(t * 3 + b * 2) * 2), Math.floor(y - phase * 14), 2, 2);
        }
        ctx.globalAlpha = 1;
    }

    function drawGroundItems(ctx, t, env, kind) {
        var items = GROUND_ITEMS[kind];
        var base = env.gy + 14;
        for (var i = 0; i < items.length; i++) {
            var img = Duck.Sprites.get(items[i][1]);
            if (!img) continue;
            var x = Math.floor(items[i][0] * env.lw - img.naturalWidth / 2);
            var y = base - img.naturalHeight;
            if (items[i][1] === "pumpkin") drawGlow(ctx, x + img.naturalWidth / 2, y + img.naturalHeight / 2, t, i);
            env.sprite(items[i][1], x, y, 1);
            if (items[i][1] === "cauldron") drawBubbles(ctx, x + img.naturalWidth / 2, y + 4, t, i);
        }
    }

    function drawLights(ctx, t, env) {
        var seg = 48;
        ctx.fillStyle = "#1b2a1b";
        for (var x = 0; x < env.lw; x++) {
            var u = (x % seg) / seg;
            ctx.fillRect(x, 2 + Math.round(20 * u * (1 - u)), 1, 1);
        }
        for (var j = 0, bx = 6; bx < env.lw; j++, bx += 12) {
            var u2 = (bx % seg) / seg;
            var by = 3 + Math.round(20 * u2 * (1 - u2));
            var lit = (Math.floor(t * 2) + j) % 3 !== 0;
            var color = LIGHT_COLORS[j % LIGHT_COLORS.length];
            ctx.globalAlpha = lit ? 1 : 0.35;
            ctx.fillStyle = color;
            ctx.fillRect(bx, by, 2, 3);
            if (lit) {
                ctx.globalAlpha = 0.18;
                ctx.fillRect(bx - 2, by - 1, 6, 5);
            }
        }
        ctx.globalAlpha = 1;
    }

    function drawSnow(ctx, t, env) {
        ctx.fillStyle = "#ffffff";
        for (var i = 0; i < flakes.length; i++) {
            var f = flakes[i];
            var x = f.x * env.lw + Math.sin(t * 0.8 + i) * f.sway;
            var y = (f.y * env.lh + t * f.speed) % (env.lh + 4);
            ctx.globalAlpha = f.size > 1 ? 0.95 : 0.75;
            ctx.fillRect(Math.floor(x), Math.floor(y), f.size, f.size);
        }
        ctx.globalAlpha = 1;
    }

    function hooks() {
        var kind = Duck.Theme.current().decor;
        return (Duck.Scenes && Duck.Scenes[kind]) || null;
    }

    function parade(ctx, t, env) {
        var scene = hooks();
        if (!scene || !scene.parade) return false;
        scene.parade(ctx, t, env);
        return true;
    }

    function back(ctx, t, env) {
        var scene = hooks();
        if (scene && scene.back) scene.back(ctx, t, env);
        if (Duck.Theme.current().stars) drawStars(ctx, t, env);
    }

    function ground(ctx, t, env) {
        var scene = hooks();
        if (scene) {
            if (scene.ground) scene.ground(ctx, t, env);
            return;
        }
        var kind = Duck.Theme.current().decor;
        if (kind) drawGroundItems(ctx, t, env, kind);
    }

    function front(ctx, t, env) {
        var scene = hooks();
        if (scene) {
            if (scene.front) scene.front(ctx, t, env);
            return;
        }
        var kind = Duck.Theme.current().decor;
        if (kind === "halloween") drawBats(ctx, t, env);
        if (kind === "christmas") {
            drawLights(ctx, t, env);
            drawSnow(ctx, t, env);
        }
    }

    build();

    return { back: back, ground: ground, front: front, parade: parade };
})();
