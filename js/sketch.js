

// // DEPRECATED :  P5 Sound Library
// function beatingsine(fosc1a,fosc1b,fosc2a,fosc2b,fosc3a,fosc3b) {
//
//   this.osc1a = new p5.Oscillator(); this.osc1a.setType('sine'); this.freq1a = fosc1a; this.osc1a.freq(this.fosc1a); this.osc1a.amp(0); this.osc1a.start();
//   this.osc1b = new p5.Oscillator(); this.osc1b.setType('sine'); this.fosc1b = fosc1b; this.osc1b.freq(this.fosc1b); this.osc1b.amp(0); this.osc1b.start();
//
//   this.osc2a = new p5.Oscillator(); this.osc2a.setType('sine'); this.fosc2a = fosc2a; this.osc2a.freq(this.fosc2a); this.osc2a.amp(0); this.osc2a.start();
//   this.osc2b = new p5.Oscillator(); this.osc2b.setType('sine'); this.fosc2b = fosc2b; this.osc2b.freq(this.fosc2b); this.osc2b.amp(0); this.osc2b.start();
//
//   this.osc3a = new p5.Oscillator(); this.osc3a.setType('sine'); this.fosc3a = fosc3a; this.osc3a.freq(this.fosc3a); this.osc3a.amp(0); this.osc3a.start();
//   this.osc3b = new p5.Oscillator(); this.osc3b.setType('sine'); this.fosc3b = fosc3b; this.osc3b.freq(this.fosc3b); this.osc3b.amp(0); this.osc3b.start();
//
//   this.modulator = new p5.Oscillator('triangle');
//   this.modulator.disconnect();  // disconnect the modulator from master output
//   this.modulator.freq(10);
//   this.modulator.amp(1);
//   this.modulator.start();
//
//   this.play = function(amp,timetoreach) {
//     this.osc1a.amp(amp,timetoreach); this.osc1b.amp(amp,timetoreach);
//     this.osc2a.amp(amp,timetoreach); this.osc2b.amp(amp,timetoreach);
//     this.osc3a.amp(amp,timetoreach); this.osc3b.amp(amp,timetoreach);
//   }
//
//   this.playmodulate = function() {
//     console.log(this.modulator.scale(-1,1,1,-1));
//     this.osc1.amp(this.modulator.scale(-1,1,1,-1));
//     this.osc2.amp(this.modulator.scale(-1,1,1,-1));
//   }
// }



class BeatingSineWA {

  constructor(options) {
        this.audioContext = options.AudioContext;
        this.output = this.audioContext.createGain();
        this.output.gain.value = 0.;

        this.lfo = this.audioContext.createOscillator();
        this.lfo.type = "sine"; this.lfo.frequency.value = 5; this.lfo.start(0);
        this.intermediateGain = this.audioContext.createGain();
        this.intermediateGain.gain.value = 0.;

        //setup oscillators
        this.osc1 = this.audioContext.createOscillator(); this.osc1.frequency.value = options.freq1; this.osc1.type = "sine"; this.osc1.start(0);
        this.osc2 = this.audioContext.createOscillator(); this.osc2.frequency.value = options.freq2; this.osc2.type = "sine"; this.osc2.start(0);
        this.osc3 = this.audioContext.createOscillator(); this.osc3.frequency.value = options.freq3; this.osc3.type = "sine"; this.osc3.start(0);
        this.osc4 = this.audioContext.createOscillator(); this.osc4.frequency.value = options.freq4; this.osc4.type = "sine"; this.osc4.start(0);
        this.osc5 = this.audioContext.createOscillator(); this.osc5.frequency.value = options.freq5; this.osc5.type = "sine"; this.osc5.start(0);
        this.osc6 = this.audioContext.createOscillator(); this.osc6.frequency.value = options.freq6; this.osc6.type = "sine"; this.osc6.start(0);

      }


      play(volume) {
        this.osc1.connect( this.output );
        this.osc2.connect( this.output );
        this.osc3.connect( this.output );
        this.osc4.connect( this.output );
        this.osc5.connect( this.output );
        this.osc6.connect( this.output );
        this.output.gain.value = volume;
      }

      playmodulate(volume, lfofreq) {
        this.osc1.connect( this.intermediateGain );
        this.osc2.connect( this.intermediateGain );
        this.osc3.connect( this.intermediateGain );
        this.osc4.connect( this.intermediateGain );
        this.osc5.connect( this.intermediateGain );
        this.osc6.connect( this.intermediateGain );
        this.lfo.frequency.value = lfofreq;
        this.lfo.connect(this.intermediateGain.gain);
        this.output.gain.value = volume;
        this.intermediateGain.connect(this.output);
      }

      stop() { this.output.gain.value = 0.0; }
      stopmodulate() {
        this.lfo.disconnect(this.output.gain);
        this.output.gain.value = 0.0;
      }


}




//create audio context
const audioContext = new AudioContext();



//setup a master gain
const masterGain = audioContext.createGain();
//masterGain.connect( analyser );
masterGain.connect( audioContext.destination );

const reverb = new Reverb({
	audioContext,
	url: "audio/impulses/water.wav"
})

masterGain.connect(reverb.input )
reverb.output.connect(audioContext.destination)



//sound variables
var playing = false;
var playingonmouseClicked = false;
var isthatyou;
var beatingsineWA1;
var beatingsineWA2;
//var noise;




function setup() {

  //backgroundColor = color(255,0,255);
  textAlign(CENTER);

    createCanvas(window.innerWidth,window.innerHeight);
    size = 50;
    shape1 = new shape();
    shape2 = new shape();
    shape3 = new shape();
    shape4 = new shape();
    shape5 = new shape();
    //console.log(size);
    //blendMode(DODGE);

    beatingsineWA1 = new BeatingSineWA({AudioContext: audioContext, freq1: 330, freq2: 330.2, freq3: 440, freq4: 440.33, freq5: 587, freq6: 587.25});
    beatingsineWA2 = new BeatingSineWA({AudioContext: audioContext, freq1: 200, freq2: 200.2, freq3: 266, freq4: 266.3, freq5: 350, freq6: 350.25});
    beatingsineWA1.output.connect(masterGain);
    beatingsineWA2.output.connect(masterGain);


    // // LFO : THIS WORKS
    // //connect carrier to a filter then lfo is used to modulate the filter frequency
    // var carrier = audioContext.createOscillator();
    // carrier.type = "square";  carrier.start(0); //carrier.frequency.value = 10;
    // var lfo = audioContext.createOscillator();
    // lfo.type = "sine"; lfo.frequency.value = 10; lfo.start(0);
    // var filter = audioContext.createBiquadFilter();
    // filter.type = 'lowpass';
    // var gain = audioContext.createGain(); gain.gain.value = 500;
    // carrier.connect(filter);
    // lfo.connect(gain);
    // gain.connect(filter.frequency);
    // filter.connect(audioContext.destination);

    // // LFO : THIS WORKS
    // //connect carrier to a gain then lfo is used to modulate the gain value
    // var carrier = audioContext.createOscillator();
    // carrier.type = "sine";  carrier.start(0); //carrier.frequency.value = 10;
    // var lfo = audioContext.createOscillator();
    // lfo.type = "sine"; lfo.frequency.value = 10; lfo.start(0);
    // var gain = audioContext.createGain(); //gain.gain.value = 0.5;
    // carrier.connect(gain);
    // lfo.connect(gain.gain);
    // gain.connect(audioContext.destination);


    //noise = new p5.Noise(type);
    //noise.setType('white');
    //noise.start();
    //noise.amp(0.5);

}



//THis plays the is that you sound
function mouseClicked() {
//  if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
    if (!playingonmouseClicked) {
      //isthatyou.setVolume(1.0);
      //isthatyou.play();

      //beatingsineWA1.play(0.1);
      //beatingsineWA2.play(0.1);
      beatingsineWA1.playmodulate(0.1,3);
      beatingsineWA2.playmodulate(0.1,3);

      playingonmouseClicked = true;
      backgroundColor = color(0,255,255);
    } else {

      //beatingsineWA1.stop();
      //beatingsineWA2.stop();

      playingonmouseClicked = false;
      backgroundColor = color(255,0,255);
    }
//  }
}



function shape() {
  this.x = random(window.innerWidth);
  this.y = random(window.innerHeight);
  this.diameter = random(50, 150);
  this.speed = random(10, 50);

  this.move = function() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  };

  this.display = function() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}



function draw() {

  size  += 10;
  if (mouseIsPressed) {
    fill(100,0,255,1);
  }
  else {
    fill(255,0,200,0.5);
  }

  noStroke();
  ellipse(mouseX+random(-20,20),mouseY+random(-20,20),random(50,150),random(50,150));

  shape1.move(); shape1.display();
  shape2.move(); shape2.display();
  shape3.move(); shape3.display();
  shape4.move(); shape4.display();
  shape5.move(); shape5.display();

}
