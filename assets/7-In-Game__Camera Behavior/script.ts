class CameraBehavior extends Sup.Behavior {
  position = new Sup.Math.Vector3();
  targetPosition = new Sup.Math.Vector3();
  
  private offset: Sup.Math.Vector3;
  private waterOffset: Sup.Math.Vector3;
  private lightOffset: Sup.Math.Vector3;
  private lightTargetOffset: Sup.Math.Vector3;

  private water: Sup.Actor;
  private light: Sup.Light;

  private shakeTimer = 0;
  private shakeAmplitude: number;

  private trackingBoss = false;

  static defaultLerpFactor = 0.15;
  static bossLerpFactor = 0.05;
  private lerpFactor = CameraBehavior.defaultLerpFactor;
  
  awake() {
    Game.cameraBehavior = this;

    this.water = Sup.getActor("Water");
    //this.waterOffset = this.water.getPosition().subtract(this.actor.getPosition());

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

  trackBoss(trackingBoss: boolean) {
    this.trackingBoss = trackingBoss;
    this.lerpFactor = CameraBehavior.bossLerpFactor;
  }

  update() {
    if (!this.trackingBoss) {
      this.targetPosition.copy(Game.boatBehavior.position).add(this.offset);
      this.lerpFactor = Sup.Math.lerp(this.lerpFactor, CameraBehavior.defaultLerpFactor, 0.15);
    } else {
      // TODO: APPLY MAP OFFSET
      this.targetPosition.copy(this.offset).multiplyScalar(1.5).add(Game.boatBehavior.chunkOffset.x * Game.settings.chunkSize, 0, Game.boatBehavior.chunkOffset.z * Game.settings.chunkSize);
    }
    
    this.position.lerp(this.targetPosition, this.lerpFactor);
    this.actor.setLocalPosition(this.position);
    
    let ray = new Sup.Math.Ray();
    let plane = new Sup.Math.Plane(new Sup.Math.Vector3(0, 1, 0), 0);
    ray.setFromCamera(this.actor.camera, { x: 0, y: 0});
    this.water.setPosition(ray.intersectPlane(plane).point);
    
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
