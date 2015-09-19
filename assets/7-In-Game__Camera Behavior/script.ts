class CameraBehavior extends Sup.Behavior {
  position = new Sup.Math.Vector3();
  
  private offset: Sup.Math.Vector3;
  private waterOffset: Sup.Math.Vector3;
  private lightOffset: Sup.Math.Vector3;
  private lightTargetOffset: Sup.Math.Vector3;

  private water: Sup.Actor;
  private light: Sup.Light;

  private shakeTimer = 0;
  private shakeAmplitude: number;
  
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

  shake(amplitude: number, duration: number) {
    if (this.shakeTimer > 0) return;
    
    this.shakeTimer = duration;
    this.shakeAmplitude = amplitude;
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
      this.actor.moveLocal(Sup.Math.Random.float(-this.shakeAmplitude, this.shakeAmplitude), Sup.Math.Random.float(-this.shakeAmplitude, this.shakeAmplitude), 0);
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
