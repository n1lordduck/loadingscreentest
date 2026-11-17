var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Theme = (function () {
    var THEMES = {
        "default": {
            subtitle: "Sandbox brasileiro",
            sky: ["#79c4f2", "#bfe6fb", "#d9f1ff"],
            hills: [["#9ad86b", "#5fa847"], ["#7cc552", "#4c9440"]],
            ground: "#6cc24a",
            sun: "sun",
            stars: false,
            decor: "",
            hat: "",
            sprites: [],
            tints: {}
        },

        lake: {
            subtitle: "Sandbox brasileiro - Dia no lago",
            sky: ["#63bdf2", "#aee0fa", "#e2f5ff"],
            hills: [["#86c79a", "#5aa377"], ["#6fb48c", "#468a69"]],
            ground: "#4aa5d8",
            noGround: true,
            sun: "sun",
            stars: false,
            decor: "lake",
            hat: "",
            sprites: ["ov_rod", "boat", "lilypad", "lilyflower", "reed", "fish", "duckling", "tree", "bush"],
            tints: {}
        },

        range: {
            subtitle: "Sandbox brasileiro - Treino de tiro",
            sky: ["#7ec8f0", "#c6e9fb", "#f6efc8"],
            hills: [["#a4d86b", "#6fae45"], ["#86c657", "#5a9a3a"]],
            ground: "#7cc552",
            sun: "sun",
            stars: false,
            decor: "range",
            hat: "",
            sprites: ["ov_rifle", "ov_helmet", "target", "hay", "sandbags", "bush", "tree"],
            tints: {}
        },

        war: {
            subtitle: "Sandbox brasileiro - Guerra dos patos",
            sky: ["#2a2438", "#7a4a52", "#e8924e"],
            hills: [["#4a5538", "#2f3825"], ["#3a4430", "#262d1e"]],
            ground: "#5b4a33",
            sun: "sun",
            stars: false,
            decor: "war",
            hat: "",
            sprites: ["ov_rifle", "ov_helmet", "tank", "plane", "sandbags", "wire"],
            tints: {
                cloud1: ["#3a3238", 0.78],
                cloud2: ["#3a3238", 0.78],
                cloud3: ["#3a3238", 0.78],
                grass: ["#7a6340", 0.7],
                sun: ["#ff5a1a", 0.6]
            },
            aliases: {
                duck_walk1_r: ["duck_walk1", "#e04848", 0.5],
                duck_walk2_r: ["duck_walk2", "#e04848", 0.5],
                tank_r: ["tank", "#b5503a", 0.55],
                plane_b: ["plane", "#3f7fd8", 0.75]
            }
        },

        space: {
            subtitle: "Sandbox brasileiro - Patos no espaço",
            sky: ["#05061a", "#161446", "#3d2272"],
            hills: [["#6e7590", "#9aa1bb"], ["#585e78", "#848ba6"]],
            ground: "#7f86a0",
            noClouds: true,
            sun: "",
            stars: false,
            decor: "space",
            hat: "",
            sprites: ["ov_astro", "ufo", "rocket"],
            tints: { grass: ["#aeb4c8", 0.85] }
        },

        halloween: {
            subtitle: "Sandbox brasileiro - Noite de Halloween",
            sky: ["#1b0c33", "#5b2078", "#d9622b"],
            hills: [["#3a1d52", "#7a3f96"], ["#2b1540", "#5c2d78"]],
            ground: "#24122f",
            sun: "moon_orange",
            stars: true,
            decor: "halloween",
            hat: "hat_witch",
            sprites: ["moon_orange", "pumpkin", "pumpkin_small", "cauldron", "hat_witch"],
            tints: {
                cloud1: ["#3a1d5c", 0.72],
                cloud2: ["#3a1d5c", 0.72],
                cloud3: ["#3a1d5c", 0.72],
                rule_cloud: ["#ffcf8a", 0.45],
                grass: ["#5a2d7a", 0.6]
            }
        },

        christmas: {
            subtitle: "Sandbox brasileiro - Feliz Natal",
            sky: ["#0f1f4a", "#2d5aa0", "#8fc0ea"],
            hills: [["#eef7ff", "#b7d4ec"], ["#dfeefa", "#9fc2e0"]],
            ground: "#f1f8ff",
            sun: "moon_pale",
            stars: true,
            decor: "christmas",
            hat: "hat_santa",
            sprites: ["moon_pale", "pine", "gift_red", "gift_blue", "snowman", "hat_santa"],
            tints: {
                cloud1: ["#8fa9d6", 0.55],
                cloud2: ["#8fa9d6", 0.55],
                cloud3: ["#8fa9d6", 0.55],
                grass: ["#f6f9ff", 0.85]
            }
        }
    };

    var chosen = null;
    var name = "default";

    function fromQuery() {
        var match = /[?&]theme=([a-z]+)/.exec(window.location.search);
        return match && THEMES[match[1]] ? match[1] : "";
    }

    var RANDOM_POOL = ["default", "lake", "range", "war", "space"];

    function fromMonth() {
        var month = new Date().getMonth();
        if (month === 9) return "halloween";
        if (month === 11) return "christmas";
        return RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)];
    }

    function choose() {
        name = fromQuery() || fromMonth();
        chosen = THEMES[name];
        document.documentElement.className += " theme-" + name;
    }

    function current() {
        return chosen;
    }

    function currentName() {
        return name;
    }

    choose();

    return { current: current, name: currentName };
})();
