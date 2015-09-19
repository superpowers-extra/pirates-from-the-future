class CameraBehavior extends Sup.Behavior {
  
  private offset: Sup.Math.Vector3;
  private waterOffset: Sup.Math.Vector3;
  private lightOffset: Sup.Math.Vector3;
  private lightTargetOffset: Sup.Math.Vector3;

  water: Sup.Actor;
  light: Sup.Light;
  
  awake() {
    Game.cameraBehavior = this;

    this.water = this.actor.getChild("Water");
    this.waterOffset = this.water.getPosition().subtract(this.actor.getPosition());

    this.light = Sup.getActor("Directional Light").light;
    this.lightOffset = this.light.actor.getPosition().subtract(this.actor.getPosition());
    this.lightTargetOffset = this.light.getTarget().subtract(this.light.actor.getPosition());
    
    this.offset = this.actor.getLocalPosition().subtract(Sup.getActor("Boat").getLocalPosition());
  }
  
  forcePosition() {
    let pos = Game.boatBehavior.position.clone().add(this.offset);
    this.actor.setLocalPosition(pos);
  }

  update() {
    let pos = Game.boatBehavior.position.clone().add(this.offset);
    this.actor.setLocalPosition(pos);
    
    let waterPosition = this.actor.getLocalPosition().add(this.waterOffset);
    waterPosition.x = Math.round(waterPosition.x);
    waterPosition.z = Math.round(waterPosition.z);
    this.water.setPosition(waterPosition);
    
    let lightPos = this.actor.getLocalPosition().add(this.lightOffset);
    this.light.actor.setPosition(lightPos);
    
    let lightTarget = lightPos.add(this.lightTargetOffset);
    this.light.setTarget(lightTarget);
    
    // TMP DEBUG
    if (Sup.Input.isKeyDown("I")){
      Sup.loadScene("Menu/HUD");
    }
    else if(Sup.Input.isKeyDown("O")) {
      Sup.loadScene("Menu/Dialog");
    }
  }
  
}
Sup.registerBehavior(CameraBehavior);
