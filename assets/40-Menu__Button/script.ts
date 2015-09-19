class ButtonBehavior extends Sup.Behavior {
  
  private initial_scale : Sup.Math.Vector3; 
  private initial_sprite; 

  focus_scale : Sup.Math.Vector3 = new Sup.Math.Vector3(0,0,0); 
  focus_sprite : string; 
  
  method : string;

  awake() {
    this.actor["behavior"] = this; 
    this.actor["onAction"] = undefined;
    this.initial_sprite = this.actor.spriteRenderer.getSprite();
    this.initial_scale = this.actor.getLocalScale();
  }
  
  onFocus() : void {
    this.actor.setLocalScale( this.initial_scale.clone().add( this.focus_scale ));
    if(this.focus_sprite != undefined) {
      this.actor.spriteRenderer.setSprite(this.focus_sprite);
    }
  }

  unFocus() : void {
    this.actor.setLocalScale( this.initial_scale );
    if(this.focus_sprite != undefined) {
      this.actor.spriteRenderer.setSprite(this.initial_sprite);
    }
  }

}
Sup.registerBehavior(ButtonBehavior);
