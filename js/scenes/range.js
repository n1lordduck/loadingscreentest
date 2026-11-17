var Duck = window.Duck || {};
window.Duck = Duck;
Duck.Scenes = Duck.Scenes || {};

Duck.Scenes.range = (function () {
    var Fx = Duck.Fx;

    var SHOOTERS = [
        { x: 0.07, period: 1.9, offset: 0.0, burst: 3, helmet: true },
        { x: 0.15, period: 2.3, offset: 0.7, burst: 2, helmet: false },
        { x: 0.23, period: 1.7, offset: 1.1, burst: 3, helmet: true },
        { x: 0.31, period: 2.6, offset: 0.3, burst: 2, helmet: false }
    ];
    var TARGET_X = [0.58, 0.68, 0.78, 0.88];
    var GAP = 0.13;
    var FLIGHT = 0.42;

    function feetY(env) {
        return env.gy + 4;
    }

    function targetPos(env, i) {
        return { x: TARGET_X[i] * env.lw, y: env.gy + 9 - 31 };
    }

    function ground(ctx, t, env) {
        env.sprite("tree", 4, env.gy - 30, 1);
        env.sprite("bush", env.lw * 0.37, env.gy - 6, 1);
        env.sprite("hay", env.lw * 0.43, env.gy - 6, 1);
        env.sprite("hay", env.lw * 0.47, env.gy - 10, 1);
        env.sprite("sandbags", env.lw * 0.5, env.gy - 8, 1);
        env.sprite("tree", env.lw - 44, env.gy - 34, 1, true);
        env.sprite("bush", env.lw * 0.96, env.gy - 5, 1);
    }

    function wobble(t, env, i) {
        var hitAge = 99;
        var s = SHOOTERS[i];
        Fx.eachShot(t, s.period, s.offset, s.burst, GAP, FLIGHT + 0.5, function (age) {
            if (age >= FLIGHT && age - FLIGHT < hitAge) hitAge = age - FLIGHT;
        });
        return hitAge;
    }

    function drawTargets(ctx, t, env) {
        for (var i = 0; i < TARGET_X.length; i++) {
            var pos = targetPos(env, i);
            var hit = wobble(t, env, i);
            var shake = hit < 0.25 ? Math.round(Math.sin(hit * 60) * 1.2) : 0;
            env.sprite("target", pos.x + shake, pos.y, 1);
        }
    }

    function drawShooter(ctx, t, env, i) {
        var s = SHOOTERS[i];
        var x = s.x * env.lw;
        var y = feetY(env) - 28;
        var recoil = 0;
        Fx.eachShot(t, s.period, s.offset, s.burst, GAP, 0.07, function () {
            recoil = -1;
        });
        var overlays = s.helmet ? ["ov_helmet", "ov_rifle"] : ["ov_rifle"];
        var frame = env.cheering() ? "duck_cheer" : "duck_idle";
        env.duck(x + recoil, y, frame, env.cheering() ? [] : overlays, false);
    }

    function drawShots(ctx, t, env, i) {
        var s = SHOOTERS[i];
        var tipX = s.x * env.lw + 39;
        var tipY = feetY(env) - 28 + 18;
        var target = targetPos(env, i);
        var endX = target.x + 9;
        var endY = target.y + 9;
        if (env.cheering()) return;
        Fx.eachShot(t, s.period, s.offset, s.burst, GAP, FLIGHT + 0.3, function (age, id, k) {
            Fx.flash(ctx, tipX + 1, tipY, age, 1);
            if (age < FLIGHT) {
                var u = age / FLIGHT;
                Fx.bullet(ctx, Fx.lerp(tipX, endX, u), Fx.lerp(tipY, endY, u), 1);
            } else {
                Fx.spark(ctx, endX - 3, endY, age - FLIGHT);
            }
            if (age < 0.5) {
                var c = age / 0.5;
                Fx.rect(ctx, tipX - 18 + c * 8 + k * 2, tipY + 2 - 7 * c + 20 * c * c, 2, 1, "#e8c35a", 1 - c);
            }
            if (age < 0.3) Fx.rect(ctx, tipX + 2 + age * 12, tipY - 2 - age * 14, 1, 1, "#d8d8e0", 0.5 * (1 - age / 0.3));
        });
    }

    function parade(ctx, t, env) {
        drawTargets(ctx, t, env);
        for (var i = 0; i < SHOOTERS.length; i++) drawShooter(ctx, t, env, i);
        for (var j = 0; j < SHOOTERS.length; j++) drawShots(ctx, t, env, j);
    }

    function back(ctx, t, env) {
        for (var i = 0; i < 4; i++) {
            var span = env.lw + 40;
            var x = ((t * (6 + i) + i * 120) % span) - 20;
            var y = env.lh * (0.12 + i * 0.06) + Math.sin(t + i) * 3;
            var flap = Math.floor(t * 4 + i) % 2 === 0;
            var pts = flap ? [[0, 1], [1, 0], [2, 0], [3, 1], [4, 0], [5, 0], [6, 1]] : [[0, 0], [1, 1], [2, 1], [3, 0], [4, 1], [5, 1], [6, 0]];
            for (var p = 0; p < pts.length; p++) Fx.rect(ctx, x + pts[p][0], y + pts[p][1], 1, 1, "#2d3b5c");
        }
    }

    return { back: back, ground: ground, parade: parade };
})();
