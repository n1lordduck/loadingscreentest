var Duck = window.Duck || {};
window.Duck = Duck;
Duck.Scenes = Duck.Scenes || {};

Duck.Scenes.war = (function () {
    var Fx = Duck.Fx;

    var LEFT = [0.03, 0.10, 0.17];
    var RIGHT = [0.80, 0.87, 0.94];
    var TANK_L = 0.255;
    var TANK_R = 0.625;
    var SHELL_PERIOD = 4.4;
    var SHELL_FLIGHT = 1.1;

    function feetY(env) {
        return env.gy + 4;
    }

    function tankY(env) {
        return env.gy + 9 - 33;
    }

    function planeA(t, env) {
        var span = env.lw + 140;
        return { x: ((t * 26 + 60) % span) - 70, y: env.lh * 0.17 + Math.sin(t * 0.9) * 6 };
    }

    function planeB(t, env) {
        var span = env.lw + 140;
        return { x: env.lw + 70 - ((t * 22 + 220) % span), y: env.lh * 0.29 + Math.sin(t * 0.7) * 5 };
    }

    function back(ctx, t, env) {
        for (var i = 0; i < 2; i++) {
            var sweep = Math.sin(t * 0.5 + i * 2.2) * 36;
            var bx = env.lw * (0.22 + i * 0.56);
            ctx.globalAlpha = 0.07;
            ctx.fillStyle = "#fff2b0";
            ctx.beginPath();
            ctx.moveTo(bx - 3, env.gy);
            ctx.lineTo(bx + 3, env.gy);
            ctx.lineTo(bx + sweep + 18, 0);
            ctx.lineTo(bx + sweep - 18, 0);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        var cycle = Math.floor(t / 2.7);
        var age = t % 2.7;
        var ex = (0.08 + Fx.hash(cycle, 9) * 0.84) * env.lw;
        Fx.explosion(ctx, ex, env.lh * 0.7, age, 6 + Math.floor(Fx.hash(cycle, 2) * 6));
    }

    function ground(ctx, t, env) {
        var smokes = [0.12, 0.55, 0.89];
        for (var i = 0; i < smokes.length; i++) {
            Fx.smokeColumn(ctx, smokes[i] * env.lw, env.lh * 0.72, t + i * 3, 70, "#2b2630");
        }
        var craters = [0.36, 0.72, 0.5];
        for (var c = 0; c < craters.length; c++) {
            Fx.rect(ctx, craters[c] * env.lw - 8, env.gy + 12, 16, 2, "#3f3322");
            Fx.rect(ctx, craters[c] * env.lw - 6, env.gy + 11, 12, 1, "#7a6340");
        }
        env.sprite("sandbags", env.lw * 0.455, env.gy - 8, 1);
        env.sprite("wire", env.lw * 0.405, env.gy - 5, 1);
        env.sprite("wire", env.lw * 0.54, env.gy - 5, 1, true);
    }

    function drawSoldier(ctx, t, env, x, i, flip) {
        var y = feetY(env) - 28;
        var sway = Math.sin(t * 0.5 + i) * 4 * (flip ? -1 : 1);
        var frame = env.cheering() ? "duck_cheer" : env.walk(t, i);
        var name = flip && !env.cheering() ? frame + "_r" : frame;
        env.duck(x + sway, y, name, ["ov_helmet", "ov_rifle"], flip);
    }

    function soldierShots(ctx, t, env, x, i, flip) {
        if (env.cheering()) return;
        var dir = flip ? -1 : 1;
        var sway = Math.sin(t * 0.5 + i) * 4 * (flip ? -1 : 1);
        var tipX = flip ? x + sway - 7 : x + sway + 39;
        var tipY = feetY(env) - 28 + 18;
        var endX = flip ? env.lw * 0.2 : env.lw * 0.8;
        Fx.eachShot(t, 2.1 + i * 0.35, i * 0.6 + (flip ? 0.9 : 0), 3, 0.12, 0.7, function (age) {
            Fx.flash(ctx, tipX, tipY, age, dir);
            var u = age / 0.7;
            if (u < 1) Fx.bullet(ctx, Fx.lerp(tipX, endX, u), tipY - u * 2, dir);
        });
    }

    function tankTip(env, flip) {
        var x = (flip ? TANK_R : TANK_L) * env.lw;
        return flip ? { x: x - 1, y: tankY(env) + 8 } : { x: x + 53, y: tankY(env) + 8 };
    }

    function drawTank(ctx, t, env, flip) {
        var x = (flip ? TANK_R : TANK_L) * env.lw;
        var offset = flip ? SHELL_PERIOD / 2 : 0;
        var recoil = 0;
        Fx.eachShot(t, SHELL_PERIOD, -offset, 1, 0, 0.12, function () {
            recoil = flip ? 1 : -1;
        });
        var bump = Math.sin(t * 12) * 0.4 > 0.3 ? 1 : 0;
        env.sprite(flip ? "tank_r" : "tank", x + recoil, tankY(env) - bump, 1, flip);
    }

    function tankShots(ctx, t, env, flip) {
        var offset = flip ? SHELL_PERIOD / 2 : 0;
        var tip = tankTip(env, flip);
        var enemyX = (flip ? TANK_L : TANK_R) * env.lw + (flip ? 40 : 6);
        Fx.eachShot(t, SHELL_PERIOD, -offset, 1, 0, SHELL_FLIGHT + 2.2, function (age, id) {
            Fx.flash(ctx, tip.x, tip.y, age, flip ? -1 : 1);
            if (age < 1.6) {
                Fx.disc(ctx, tip.x + (flip ? -age * 14 : age * 14), tip.y - age * 6, 1 + Math.floor(age * 2), "#d8d8e0", 0.5 * (1 - age / 1.6));
            }
            var miss = (Fx.hash(id, 4) - 0.5) * 14;
            var hitX = enemyX + miss;
            var hitY = tankY(env) + 20;
            if (age < SHELL_FLIGHT) {
                var u = age / SHELL_FLIGHT;
                var sx = Fx.lerp(tip.x, hitX, u);
                var sy = Fx.lerp(tip.y, hitY, u) - 55 * Math.sin(u * 3.1416);
                Fx.rect(ctx, sx, sy, 3, 2, "#2a2630");
                Fx.rect(ctx, sx + (flip ? 3 : -3), sy, 2, 1, "#ffb040", 0.8);
            } else {
                Fx.explosion(ctx, hitX, hitY, age - SHELL_FLIGHT, 9);
            }
        });
    }

    function drawPlane(ctx, t, env, pos, name, flip) {
        for (var k = 1; k < 9; k++) {
            var tx = pos.x + (flip ? 40 + k * 5 : -k * 5 + 4);
            var ty = pos.y + 10 + Math.sin(t * 3 + k) * 1.2;
            Fx.disc(ctx, tx, ty, 1 + Math.floor(k / 4), "#d9d1c9", 0.55 * (1 - k / 9));
        }
        env.sprite(name, pos.x, pos.y, 1, flip);
        var propX = flip ? pos.x + 1 : pos.x + 42;
        var tall = Math.floor(t * 30) % 2 === 0;
        Fx.rect(ctx, propX, pos.y + (tall ? 6 : 9), 1, tall ? 10 : 4, "#3a3440", 0.8);
    }

    function drawBomb(ctx, t, env) {
        var period = 6.5;
        var cycle = Math.floor(t / period);
        var age = t % period;
        var dropT = cycle * period;
        var start = planeA(dropT, env);
        var g = 90;
        var endY = env.gy + 6;
        var fall = Math.sqrt(2 * (endY - start.y - 12) / g);
        var x = start.x + 28 + 26 * age;
        if (age < fall) {
            var y = start.y + 14 + 0.5 * g * age * age;
            Fx.rect(ctx, x, y, 2, 3, "#2a2630");
            Fx.rect(ctx, x, y - 2, 2, 1, "#ffb040", 0.8);
        } else {
            Fx.explosion(ctx, x, endY, age - fall, 10);
        }
    }

    function parade(ctx, t, env) {
        drawBomb(ctx, t, env);
        drawPlane(ctx, t, env, planeA(t, env), "plane", false);
        drawPlane(ctx, t, env, planeB(t, env), "plane_b", true);
        var i;
        for (i = 0; i < LEFT.length; i++) drawSoldier(ctx, t, env, LEFT[i] * env.lw, i, false);
        for (i = 0; i < RIGHT.length; i++) drawSoldier(ctx, t, env, RIGHT[i] * env.lw, i + 3, true);
        drawTank(ctx, t, env, false);
        drawTank(ctx, t, env, true);
        for (i = 0; i < LEFT.length; i++) soldierShots(ctx, t, env, LEFT[i] * env.lw, i, false);
        for (i = 0; i < RIGHT.length; i++) soldierShots(ctx, t, env, RIGHT[i] * env.lw, i + 3, true);
        tankShots(ctx, t, env, false);
        tankShots(ctx, t, env, true);
    }

    return { back: back, ground: ground, parade: parade };
})();
