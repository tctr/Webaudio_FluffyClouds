class SynthVoice {
    constructor(options) {
        this.audioContext = options.audioContext

        this.output = this.audioContext.createGain()
        this.output.gain.value = 0

        //setup oscillator
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.frequency.value = 440;
        this.oscillator.type = "sine";
        this.oscillator.start();

        //setup ADSR
        this.envelope = new ADSREnvelope( { audioContext: this.audioContext} );
        this.envelope.attack = 3;
        this.envelope.decay = 2;
        this.envelope.sustain = .5;
        this.envelope.release = 2;
        this.envelope.connect( this.output.gain );
        // this.envelope.connect( this.oscillator.detune, 1200 );

        this.lfo = new LFO({audioContext: this.audioContext})
        // this.lfo.connect( this.oscillator.detune, 1200 );

        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = "lowpass"
        this.filter.frequency.value = 10;
        // this.filter.Q.value = 100
        this.filter.connect(this.output)
        // this.oscillator.connect(this.filter)
        this.lfo.connect(this.filter.frequency, 500)

        this.buffers = null;

        this.bufferPlayer = new AudioBufferPlayer({
            audioContext: this.audioContext
        })
    }

    start(offset = 0) {
        if (this.buffers) {
            let bufferSource = this.bufferPlayer.start(this.buffers.get(0), offset)
            bufferSource.connect(this.filter)
          //  this.lfo.connect( bufferSource.playbackRate );
        }
        this.envelope.start()
    }
    stop() {
        this.envelope.stop()
    }
}
