class CameraBehavior extends Sup.Behavior {
  
  private offset: Sup.Math.Vector3;
  
  awake() {
    Game.cameraBehavior = this;
  }
  
  start() {
    this.offset = this.actor.getLocalPosition().subtract(Game.boatBehavior.position);
  }

  update() {
    let pos = Game.boatBehavior.position.clone().add(this.offset);
    this.actor.setLocalPosition(pos);
    
    // TMP DEBUG
    if (Sup.Input.isKeyDown("I")){
      Sup.loadScene("Menu/Scene");
    }
    

  }
  
}
Sup.registerBehavior(CameraBehavior);
