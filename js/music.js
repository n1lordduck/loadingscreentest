var Duck = window.Duck || {};
window.Duck = Duck;

// Procedural chiptune made with WebAudio, so the page ships no audio files.
// The notes of each theme live in tracks.js; this file is only the player.
Duck.Music = (function () {
    var BASE_VOLUME = 0.05;
    var LOOKAHEAD = 0.25;

    var track, stepLength;
    var audio, master, noiseBuffer, nextTime = 0, step = 0;
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

    function noiseHit(time, length, gain, filterType, frequency, q) {
        var source = audio.createBufferSource();
        var filter = audio.createBiquadFilter();
        var env = audio.createGain();
        source.buffer = noiseBuffer;
        filter.type = filterType;
        filter.frequency.value = frequency;
        filter.Q.value = q;
        env.gain.setValueAtTime(gain, time);
        env.gain.exponentialRampToValueAtTime(0.001, time + length);
        source.connect(filter);
        filter.connect(env);
        env.connect(master);
        source.start(time);
        source.stop(time + length + 0.02);
    }

    function kick(time) {
        var osc = audio.createOscillator();
        var env = audio.createGain();
        osc.frequency.setValueAtTime(130, time);
        osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);
        env.gain.setValueAtTime(0.7, time);
        env.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
        osc.connect(env);
        env.connect(master);
        osc.start(time);
        osc.stop(time + 0.2);
    }

    function drum(kind, time) {
        if (kind === "k") kick(time);
        if (kind === "s") noiseHit(time, 0.11, 0.32, "bandpass", 1800, 0.8);
        if (kind === "h") noiseHit(time, 0.04, 0.13, "highpass", 7000, 0.7);
        if (kind === "b") {
            noiseHit(time, 0.13, 0.1, "highpass", 5200, 0.7);
            note(2637, time, 0.14, "sine", 0.05);
            note(3951, time, 0.1, "sine", 0.03);
        }
    }

    function scheduleStep(time) {
        var chord = track.chords[Math.floor(step / 8) % track.chords.length];
        var pos = step % 8;

        var bassIndex = track.bass.pattern[pos];
        if (bassIndex >= 0) note(chord[bassIndex] * track.bass.shift, time, stepLength * track.bass.len, track.bass.type, track.bass.gain);
        if (pos === 0 && track.pad) note(chord[0] * track.pad.shift, time, stepLength * 7, track.pad.type, track.pad.gain);

        var tone = track.melody[step % track.melody.length];
        if (tone) note(tone, time, stepLength * track.lead.len, track.lead.type, track.lead.gain);

        var hit = track.drums ? track.drums.charAt(pos) : ".";
        if (hit !== ".") drum(hit, time);

        step += 1;
    }

    function pump() {
        while (nextTime < audio.currentTime + LOOKAHEAD) {
            scheduleStep(nextTime);
            nextTime += stepLength;
        }
    }

    function makeNoise() {
        var buffer = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        return buffer;
    }

    function addEcho(output) {
        var delay = audio.createDelay(2);
        var feedback = audio.createGain();
        var wet = audio.createGain();
        delay.delayTime.value = track.echo.time;
        feedback.gain.value = track.echo.feedback;
        wet.gain.value = track.echo.mix;
        master.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);
        wet.connect(output);
    }

    function start() {
        var Context = contextClass();
        if (!Context || started) return;
        started = true;

        track = Duck.Tracks[Duck.Theme.name()] || Duck.Tracks["default"];
        stepLength = 60 / track.bpm / 2;

        audio = new Context();
        master = audio.createGain();
        noiseBuffer = makeNoise();
        var filter = audio.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = track.filter;
        master.connect(filter);
        filter.connect(audio.destination);
        if (track.echo) addEcho(filter);
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
