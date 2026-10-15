var Duck = window.Duck || {};
window.Duck = Duck;

// Procedural chiptune made with WebAudio, so the page ships no audio files.
Duck.Music = (function () {
    var BASE_VOLUME = 0.05;
    var BPM = 88;
    var STEP = 60 / BPM / 2;
    var LOOKAHEAD = 0.25;

    var CHORDS = [
        [261.63, 329.63, 392.00],
        [220.00, 261.63, 329.63],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66]
    ];
    var MELODY = [
        523.25, 0, 659.25, 587.33, 523.25, 0, 440.00, 0,
        523.25, 0, 440.00, 392.00, 349.23, 0, 392.00, 0,
        440.00, 0, 523.25, 0, 587.33, 523.25, 440.00, 0,
        392.00, 0, 440.00, 0, 392.00, 0, 0, 0
    ];

    var audio, master, nextTime = 0, step = 0;
    var gameVolume = 1;
    var muted = false;
    var started = false;

    function contextClass() {
        return window.AudioContext || window.webkitAudioContext || null;
    }

    function applyVolume() {
        if (!master) return;
        master.gain.value = muted ? 0 : BASE_VOLUME * gameVolume;
    }

    function note(freq, time, length, type, gain) {
        var osc = audio.createOscillator();
        var env = audio.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, time);
        env.gain.linearRampToValueAtTime(gain, time + 0.02);
        env.gain.linearRampToValueAtTime(0, time + length);
        osc.connect(env);
        env.connect(master);
        osc.start(time);
        osc.stop(time + length + 0.05);
    }

    function scheduleStep(time) {
        var bar = Math.floor(step / 8) % CHORDS.length;
        var chord = CHORDS[bar];
        var pos = step % 8;

        if (pos % 2 === 0) note(chord[(pos / 2) % 3] / 2, time, STEP * 1.8, "triangle", 0.5);
        if (pos === 0) note(chord[0] / 4, time, STEP * 7, "sine", 0.35);

        var melody = MELODY[step % MELODY.length];
        if (melody) note(melody, time, STEP * 0.9, "square", 0.12);

        step += 1;
    }

    function pump() {
        while (nextTime < audio.currentTime + LOOKAHEAD) {
            scheduleStep(nextTime);
            nextTime += STEP;
        }
    }

    function start() {
        var Context = contextClass();
        if (!Context || started) return;
        started = true;

        audio = new Context();
        master = audio.createGain();
        var filter = audio.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 2200;
        master.connect(filter);
        filter.connect(audio.destination);
        applyVolume();

        nextTime = audio.currentTime + 0.1;
        setInterval(pump, 100);
        resume();
    }

    function resume() {
        if (audio && audio.state === "suspended" && audio.resume) audio.resume();
    }

    function setGameVolume(volume) {
        gameVolume = Math.max(0, Math.min(1, volume));
        applyVolume();
    }

    function toggleMute() {
        muted = !muted;
        applyVolume();
        resume();
        return muted;
    }

    return { start: start, resume: resume, setGameVolume: setGameVolume, toggleMute: toggleMute, isMuted: function () { return muted; } };
})();
