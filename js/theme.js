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

    function fromMonth() {
        var month = new Date().getMonth();
        if (month === 9) return "halloween";
        if (month === 11) return "christmas";
        return "default";
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
