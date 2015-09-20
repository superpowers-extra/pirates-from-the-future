/*
Penser à ajouter 

class PloufBehavior extends Sup.Behavior {
  
  scale : Sup.Math.Vector3;
  timer : number;
  
  awake() {    
    this.timer = 0;
  }

  update() {
    this.timer ++;
    
    if (this.timer == 10) this.actor.modelRenderer.setOpacity(1);
    if (this.timer > 25) this.actor.modelRenderer.setOpacity(0.7);
    
  }
}
Sup.registerBehavior(PloufBehavior);
*/