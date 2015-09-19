class TextEffectBehavior extends Sup.Behavior {
  
  text : string;
  textShowSpeed : number;
  started : boolean = false;

  private tick : number = 1;
  private tickLength : number;

  defaultText : string;

  awake() {
    this.reset();
  }

  start() : void {
    this.started = true;
  }

  reset() {
    this.defaultText = "";
    this.tick = 0;
    this.tickLength = this.text.length;
  }

  update() {
    if(this.started) {
      if(this.tick > this.tickLength) {
        this.started = false;
      }
      else {
        this.defaultText = this.defaultText + this.text.charAt(this.tick);
        // Affect the font!
        Sup.log(this.defaultText)
        this.tick++;
      }
    }
  }
}
Sup.registerBehavior(TextEffectBehavior);
