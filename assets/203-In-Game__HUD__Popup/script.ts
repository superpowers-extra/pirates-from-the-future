class PopupBehavior extends Sup.Behavior {
  
  public dt : number;
  public duration : number;
  public callback : () => void;

  private messageLocation : Sup.Actor;
  private spriteLocation : Sup.Actor;

  awake() {
    this.messageLocation = this.actor.getChild("message");
    this.spriteLocation = this.actor.getChild("sprite");
  }
  
  open(message: string,spriteAsset : string,duration? : number,callback?: () => void) {
    callback = callback || function() {}
    this.dt = 0;
    this.duration = duration || 180;
    this.callback = callback;
    this.actor.setVisible(true);
  }

  close() {
    this.dt = undefined;
    this.callback();
    this.actor.setVisible(false);
  }

  update() {
    if(this.dt != undefined) {
      if(this.dt >= this.duration) {
        this.close();
      }
      else {
        this.dt++;
      }
    }
  }
}
Sup.registerBehavior(PopupBehavior);
