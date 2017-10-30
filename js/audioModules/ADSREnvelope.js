class ADSREnvelope {

  constructor( options ) {

    this.audioContext = options.audioContext;
    this.attack = options.attack || 0;
    this.decay = options.decay || 1;
    this.sustain = options.sustain || 1;
    this.release = options.release || 0;

    this.paramMap = new Map();

  }

  start( time = this.audioContext.currentTime ) {


    // console.log( this.param.value )

    this.paramMap.forEach( ( obj ) => {

      //pin value
      //obj.param.cancelAndHoldAtTime( time );

      obj.param.cancelScheduledValues( time );

      obj.param.setValueAtTime( 0, time );

      //attack
      if( this.attack > 0 )
        obj.param.linearRampToValueAtTime( obj.magnitude, time + this.attack );
      else
        obj.param.setValueAtTime( obj.magnitude, time );


      //decay
      if( this.decay > 0 )
        obj.param.exponentialRampToValueAtTime( ( this.sustain * obj.magnitude ), time + this.attack + this.decay );
      else
        obj.param.setValueAtTime( ( this.sustain * obj.magnitude ), time + this.attack  );

    } );



  }

  stop( time = this.audioContext.currentTime ) {

    this.paramMap.forEach( ( obj ) => {

      //release
      //obj.param.cancelAndHoldAtTime( obj.param.value, time );
      obj.param.linearRampToValueAtTime( 0.0, time + this.release );

    } );

  }

  connect( param, magnitude = 1 ) {

    this.paramMap.set( param, { param, magnitude } );

  }

  disconnect( param ) {

    if ( this.paramMap.get( param ) ) {

      param.cancelScheduledValues( this.audioContext.currentTime );
      this.paramMap.delete( param );

    }

  }

}
