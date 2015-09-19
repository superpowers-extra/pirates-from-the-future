class CameraBehavior extends Sup.Behavior {
  position = new Sup.Math.Vector3();
  
  private offset: Sup.Math.Vector3;
  private waterOffset: Sup.Math.Vector3;
  private lightOffset: Sup.Math.Vector3;
  private lightTargetOffset: Sup.Math.Vector3;

  water: Sup.Actor;
  light: Sup.Light;

  private shakeTimer = 0;
  static shakeDelay = 30;
  
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
    this.position.copy(Game.boatBehavior.position).add(this.offset);
    this.actor.setLocalPosition(this.position);
  }

  shake() {
    if (this.shakeTimer > 0) return;
    Sup.log("shake");
    this.shakeTimer = CameraBehavior.shakeDelay;
  }

  update() {
    this.position.copy(Game.boatBehavior.position).add(this.offset);
    this.actor.setLocalPosition(this.position);
    
    let waterPosition = this.actor.getLocalPosition().add(this.waterOffset);
    waterPosition.x = Math.round(waterPosition.x);
    waterPosition.z = Math.round(waterPosition.z);
    this.water.setPosition(waterPosition);
    
    let lightPos = this.actor.getLocalPosition().add(this.lightOffset);
    this.light.actor.setPosition(lightPos);
    
    let lightTarget = lightPos.add(this.lightTargetOffset);
    this.light.setTarget(lightTarget);
    
    if (this.shakeTimer > 0) {
      this.shakeTimer -= 1;
      let limit = 1;
      this.actor.moveLocal(Sup.Math.Random.float(-limit, limit), Sup.Math.Random.float(-limit, limit), 0);
    }
    
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
