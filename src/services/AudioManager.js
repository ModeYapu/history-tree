/**
 * 音效管理器 - Web Audio API 实现
 * 提供环境音效、交互音效、可静音切换
 */
class AudioManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.masterGain = null;
        this.ambientSource = null;
        this.ambientGain = null;
        this.initialized = false;
        this.currentAmbient = null;
    }

    /** 延迟初始化（需要用户交互后才能创建 AudioContext） */
    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.6;
            this.masterGain.connect(this.ctx.destination);

            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.value = 0.15;
            this.ambientGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {
            console.warn('AudioManager: Web Audio API 不可用', e);
        }
    }

    /** 确保已初始化 */
    ensure() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // ── 环境音效 ──────────────────────────────────

    /** 播放环境音（古琴风格的柔和音调） */
    playAmbient(type = 'guqin') {
        this.ensure();
        if (!this.ctx || this.muted) return;
        this.stopAmbient();

        const notes = {
            guqin: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
            wind: [180, 220, 260, 200, 240],
            water: [300, 350, 400, 320, 380]
        };

        const scale = notes[type] || notes.guqin;
        let noteIndex = 0;

        const playNote = () => {
            if (this.muted || !this.ctx) return;
            const freq = scale[noteIndex % scale.length];
            const osc = this.ctx.createOscillator();
            const noteGain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            // 添加轻微颤音
            const vibrato = this.ctx.createOscillator();
            const vibratoGain = this.ctx.createGain();
            vibrato.frequency.value = 5;
            vibratoGain.gain.value = 2;
            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);
            vibrato.start();

            const now = this.ctx.currentTime;
            noteGain.gain.setValueAtTime(0, now);
            noteGain.gain.linearRampToValueAtTime(0.12, now + 0.3);
            noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

            osc.connect(noteGain);
            noteGain.connect(this.ambientGain);

            osc.start(now);
            osc.stop(now + 2.6);
            vibrato.stop(now + 2.6);

            noteIndex++;
            this._ambientTimer = setTimeout(playNote, 2000 + Math.random() * 2000);
        };

        playNote();
        this.currentAmbient = type;
    }

    stopAmbient() {
        clearTimeout(this._ambientTimer);
        this.currentAmbient = null;
    }

    // ── 交互音效 ──────────────────────────────────

    /** 点击音效 - 清脆的木质敲击 */
    playClick() {
        this.ensure();
        if (!this.ctx || this.muted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.15);
    }

    /** 切换视图音效 - 如翻页 */
    playTransition() {
        this.ensure();
        if (!this.ctx || this.muted) return;

        // 白噪音模拟翻页
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.02;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
    }

    /** 事件弹出音效 - 铃声 */
    playEventOpen() {
        this.ensure();
        if (!this.ctx || this.muted) return;

        const freqs = [523.25, 659.25, 783.99];
        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const t = this.ctx.currentTime + i * 0.08;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.4);
        });
    }

    /** 重要事件发现音效 */
    playDiscovery() {
        this.ensure();
        if (!this.ctx || this.muted) return;

        const melody = [392, 440, 523.25, 659.25, 783.99];
        melody.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const t = this.ctx.currentTime + i * 0.1;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.12, t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.5);
        });
    }

    // ── 控制 ──────────────────────────────────────

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopAmbient();
            if (this.masterGain) this.masterGain.gain.value = 0;
        } else {
            if (this.masterGain) this.masterGain.gain.value = 0.6;
        }
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }

    destroy() {
        this.stopAmbient();
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
        this.initialized = false;
    }
}

window.AudioManager = AudioManager;
