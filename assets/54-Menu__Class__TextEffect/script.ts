// Text effect
class TextBehavior extends Sup.Behavior {
  
  text : string;
  textShowSpeed : number;
  started : boolean = false;
  delay : number;
  maxLinelength : number = 10;

  private tick : number = 1;
  private tickShow : number = 0;
  private tickLength : number;
  private fastEnd : boolean = false;

  defaultText : string;

  awake() {
    this.actor["behavior"] = this;
    this.reset();
  }

  static wrapText(text: string) : string {
    let wrappedText = "";
    let lines = text.split("\n");
    for (let line of lines) {
      line += "\n";
      wrappedText += line;
    }
    return wrappedText;
  }

  public start() : void {
    this.started = true;
  }

  public end() : void {
    this.fastEnd = true;
  }

  public modify(text: string) : void {
    this.text = TextBehavior.wrapText(text);
  }

  public reset() : void {
    this.defaultText = "";
    this.tick = 0;
    this.tickLength = this.text.length;
    this.tickShow = 0;
  }

  public setText(text: string) : void {
    this.actor.textRenderer.setText(text);
  }

  update() {
    if(this.started) {
      if(this.tick == this.tickLength) {
        this.started = false;
      }
      else {
        if(this.fastEnd) {
          this.setText(this.text);
          this.started = false;
          this.reset();
        }
        else {
          if(this.tickShow > (this.textShowSpeed * 60)) {
            this.defaultText = this.defaultText + this.text.charAt(this.tick);
            this.setText(TextBehavior.wrapText(this.defaultText));
            this.tick++;
            this.tickShow = 0;
          }
          else {
            this.tickShow++;
          }
        }
      }
    }
  }
}
Sup.registerBehavior(TextBehavior);
