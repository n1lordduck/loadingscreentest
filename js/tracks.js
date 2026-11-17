var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Tracks = (function () {
    var SEMITONE = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

    function freq(name) {
        var match = /^([A-G])([#b]?)(\d)$/.exec(name);
        var offset = SEMITONE[match[1]] + (match[2] === "#" ? 1 : match[2] === "b" ? -1 : 0) + (parseInt(match[3], 10) - 4) * 12;
        return 440 * Math.pow(2, offset / 12);
    }

    function notes(text) {
        var parts = text.split(/\s+/);
        var out = [];
        for (var i = 0; i < parts.length; i++) out.push(parts[i] === "." ? 0 : freq(parts[i]));
        return out;
    }

    function chords(list) {
        var out = [];
        for (var i = 0; i < list.length; i++) out.push(notes(list[i]));
        return out;
    }

    return {
        "default": {
            bpm: 88,
            filter: 2200,
            chords: chords(["C4 E4 G4", "A3 C4 E4", "F3 A3 C4", "G3 B3 D4"]),
            melody: notes("C5 . E5 D5 C5 . A4 . C5 . A4 G4 F4 . G4 . A4 . C5 . D5 C5 A4 . G4 . A4 . G4 . . ."),
            lead: { type: "square", gain: 0.12, len: 0.9 },
            bass: { type: "triangle", gain: 0.5, len: 1.8, shift: 0.5, pattern: [0, -1, 1, -1, 2, -1, 0, -1] },
            pad: { type: "sine", gain: 0.35, shift: 0.25 }
        },

        lake: {
            bpm: 68,
            filter: 1900,
            chords: chords(["G3 B3 D4", "E3 G3 B3", "C3 E3 G3", "D3 F#3 A3"]),
            melody: notes("D5 . B4 . G4 . B4 . E5 . D5 . B4 . . . C5 . E5 . G5 . E5 . F#5 . E5 . D5 . . ."),
            lead: { type: "triangle", gain: 0.2, len: 1.9 },
            bass: { type: "sine", gain: 0.4, len: 3.2, shift: 0.5, pattern: [0, -1, -1, -1, 2, -1, -1, -1] },
            pad: { type: "triangle", gain: 0.22, shift: 0.5 },
            echo: { time: 0.88, feedback: 0.4, mix: 0.35 }
        },

        range: {
            bpm: 126,
            filter: 3200,
            chords: chords(["D4 F#4 A4", "G3 B3 D4", "A3 C#4 E4", "D4 F#4 A4"]),
            melody: notes("F#5 . A5 F#5 D5 . F#5 . G5 . B5 G5 D5 . G5 . E5 . A5 E5 C#5 . E5 . D5 F#5 A5 D6 A5 . D5 ."),
            lead: { type: "square", gain: 0.13, len: 0.55 },
            bass: { type: "triangle", gain: 0.55, len: 1.2, shift: 0.5, pattern: [0, -1, 2, -1, 0, -1, 2, -1] },
            drums: "khshkhsh"
        },

        war: {
            bpm: 112,
            filter: 2800,
            chords: chords(["D4 F4 A4", "Bb3 D4 F4", "C4 E4 G4", "D4 F4 A4"]),
            melody: notes("A4 . D5 . F5 D5 F5 . F5 . D5 . Bb4 . D5 . E5 . G5 . C6 . G5 E5 D5 . F5 E5 D5 . . ."),
            lead: { type: "sawtooth", gain: 0.1, len: 0.8 },
            bass: { type: "triangle", gain: 0.6, len: 3.4, shift: 0.5, pattern: [0, -1, -1, -1, 2, -1, -1, -1] },
            pad: { type: "sawtooth", gain: 0.07, shift: 0.25 },
            drums: "k.s.k.ss"
        },

        space: {
            bpm: 76,
            filter: 3600,
            chords: chords(["A3 C4 E4", "F3 A3 C4", "C4 E4 G4", "G3 B3 D4"]),
            melody: notes("E6 . . . C6 . . . A5 . . . C6 . E6 . G5 . . . E5 . . . D6 . . . B5 . . ."),
            lead: { type: "sine", gain: 0.16, len: 2.6 },
            bass: { type: "sine", gain: 0.2, len: 1.2, shift: 1, pattern: [0, 1, 2, 1, 0, 1, 2, 1] },
            pad: { type: "triangle", gain: 0.28, shift: 0.5 },
            echo: { time: 0.79, feedback: 0.5, mix: 0.45 }
        },

        halloween: {
            bpm: 92,
            filter: 2400,
            chords: chords(["A3 C4 E4", "D3 F3 A3", "E3 G#3 B3", "A3 C4 E4"]),
            melody: notes("A4 C5 E5 C5 A4 . E4 . D5 F5 A5 F5 D5 . A4 . E5 G#5 B5 G#5 E5 . B4 . C6 B5 A5 G#5 A5 . . ."),
            lead: { type: "square", gain: 0.12, len: 0.6 },
            bass: { type: "sine", gain: 0.55, len: 3.2, shift: 0.5, pattern: [0, -1, -1, -1, 0, -1, -1, -1] },
            pad: { type: "triangle", gain: 0.2, shift: 0.25 },
            drums: "k.k.....",
            echo: { time: 0.65, feedback: 0.35, mix: 0.25 }
        },

        christmas: {
            bpm: 108,
            filter: 3600,
            chords: chords(["C4 E4 G4", "A3 C4 E4", "F3 A3 C4", "G3 B3 D4"]),
            melody: notes("G5 E5 C5 E5 G5 . C6 . A5 E5 C5 E5 A5 . G5 . F5 A5 C6 A5 F5 . A5 . G5 B5 D6 B5 G5 . . ."),
            lead: { type: "triangle", gain: 0.18, len: 0.7 },
            bass: { type: "triangle", gain: 0.45, len: 1.4, shift: 0.5, pattern: [0, -1, 2, -1, 1, -1, 2, -1] },
            drums: "kbbbkbbb"
        }
    };
})();
