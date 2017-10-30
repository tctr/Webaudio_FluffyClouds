class LFO {
    
  constructor( options ) {

    this.audioContext = options.audioContext;

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = options.type || "sine";
    this.oscillator.frequency.value = options.frequency || 2;
    this.oscillator.start();

    this.depth = this.audioContext.createGain();

    this.oscillator.connect( this.depth );

    this.paramMap = new Map();

  }

  start() {

    this.oscillator.start();

  }

  stop() {

    this.oscillator.stop();
    this.oscillator.disconnect( this.depth );

    let oscillator = audioContext.createOscillator();
    oscillator.type = this.oscillator.type;
    oscillator.frequency.value = this.oscillator.frequency.value;

    this.oscillator = oscillator;

  }

  connect( param, magnitude = 1 ) {

    let gain = this.audioContext.createGain();
    gain.gain.value = magnitude;

    this.depth.connect( gain );
    gain.connect( param );

    this.paramMap.set( param, { param, gain } );

  }

  disconnect( param ) {

    if ( this.paramMap.get( param ) ) {

      let gain = this.paramMap.get( param ).gain;
      this.depth.disconnect( gain );
      gain.disconnect ( param );

      this.paramMap.delete( param );

    }

  }

}