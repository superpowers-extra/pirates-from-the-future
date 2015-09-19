let colliderPosition = new Sup.Math.Vector3();

class BoatBehavior extends Sup.Behavior {
  playerIndex: number;
  position: Sup.Math.Vector3;
  chunkOffset = { x: 0, z: 0 };
  angle: number;

  private acceleration = 0;
  static maxAcceleration = 0.02;
  speed = new Sup.Math.Vector3();
  static maxSpeed = 2;
  static speedDrag = 0.99;

  private rotationAcceleration = 0;
  static maxRotationAcceleration = 0.002;
  private rotationSpeed = 0;
  static maxRotationSpeed = 0.03;
  static rotationSpeedDrag = 0.95;

  static radius = 30;

  private animationTimer = 0;

  private reactorLeft: Sup.Actor;
  private reactorRight: Sup.Actor;
  private burstLeft: Sup.Actor;
  private burstRight: Sup.Actor;
  private particuleList: { actor: Sup.Actor, speed: Sup.Math.Vector3 }[] = [];

  private splashRndr: Sup.ModelRenderer;
  
  awake() {
    Game.boatBehavior = this;
    this.position = this.actor.getLocalPosition();
    this.angle = this.actor.getLocalEulerY();
    
    this.reactorLeft = this.actor.getChild("Reactor Left");
    this.reactorRight = this.actor.getChild("Reactor Right");
    this.burstLeft = this.reactorLeft.getChild("Burst");
    this.burstRight = this.reactorRight.getChild("Burst");
    
    this.splashRndr = this.actor.getChild("Splash").modelRenderer;
  }

  setPosition(position) {
    this.position.copy(position);
    this.actor.setLocalPosition(position);
    Game.cameraBehavior.forcePosition();
  }

  update() {
    let targetAcceleration = 0;
    let targetRotationAcceleration = 0;
    
    if (this.playerIndex != null) {
      let horizontal = Input.horizontal(this.playerIndex);
      targetRotationAcceleration = -horizontal * BoatBehavior.maxRotationAcceleration;
      
      targetAcceleration = Sup.Math.lerp(0, BoatBehavior.maxAcceleration, Input.getAcceleration(this.playerIndex));
    }
    
    // Rotation
    this.rotationAcceleration = Sup.Math.lerp(this.rotationAcceleration, targetRotationAcceleration, 0.15);
    this.rotationSpeed += this.rotationAcceleration;
    this.rotationSpeed *= BoatBehavior.rotationSpeedDrag;
    if (Math.abs(this.rotationSpeed) > BoatBehavior.maxRotationSpeed) this.rotationSpeed *= BoatBehavior.maxRotationSpeed / Math.abs(this.rotationSpeed);
    this.angle += this.rotationSpeed;
    this.actor.setLocalEulerY(this.angle);
    
    // Movement
    this.acceleration = Sup.Math.lerp(this.acceleration, targetAcceleration, 0.15);
    this.speed.add(Math.sin(this.angle) * this.acceleration, 0, Math.cos(this.angle) * this.acceleration);
    this.speed.multiplyScalar(BoatBehavior.speedDrag);
    let speedLength = this.speed.length();
    if (speedLength > BoatBehavior.maxSpeed) this.speed.multiplyScalar(BoatBehavior.maxSpeed / this.speed.length());
    this.position.add(this.speed);
    
    // Collision
    for (let collider of Game.circleColliders) {
      colliderPosition.copy(collider.position).y = this.position.y;
      
      let diff = colliderPosition.subtract(this.position).add(this.chunkOffset.x * Game.settings.chunkSize, 0, this.chunkOffset.z * Game.settings.chunkSize);
      let penetration = (collider.radius + BoatBehavior.radius) - diff.length();
      if (penetration > 0) {
        if (speedLength > 1.5) {
          Game.cameraBehavior.shake(1, 30);
          this.speed.subtract(diff);
        } else {
          let oldPosition = this.position.clone();
          this.position.add(diff.normalize().multiplyScalar(-penetration));
          this.speed.subtract(diff.normalize().multiplyScalar(-penetration));
        }
      }
    }
    if (speedLength > BoatBehavior.maxSpeed * 0.8 && targetAcceleration !== 0) Game.cameraBehavior.shake(0.3, 1);
    
    // Map edge teleportation
    if (this.position.x / Game.settings.chunkSize - this.chunkOffset.x > Game.settings.mapSize / 2) {
      this.chunkOffset.x += Game.settings.mapSize;
      for (let islandActor of Game.chunkActors) islandActor.moveLocalX(Game.settings.chunkSize * Game.settings.mapSize);
    } else if (this.position.x / Game.settings.chunkSize - this.chunkOffset.x < -Game.settings.mapSize / 2) {
      this.chunkOffset.x -= Game.settings.mapSize;
      for (let islandActor of Game.chunkActors) islandActor.moveLocalX(-Game.settings.chunkSize * Game.settings.mapSize);
    }
    if (this.position.z / Game.settings.chunkSize - this.chunkOffset.z > Game.settings.mapSize / 2) {
      this.chunkOffset.z += Game.settings.mapSize;
      for (let islandActor of Game.chunkActors) islandActor.moveLocalZ(Game.settings.chunkSize * Game.settings.mapSize);
    } else if (this.position.z / Game.settings.chunkSize - this.chunkOffset.z < -Game.settings.mapSize / 2) {
      this.chunkOffset.z -= Game.settings.mapSize;
      for (let islandActor of Game.chunkActors) islandActor.moveLocalZ(-Game.settings.chunkSize * Game.settings.mapSize);
    }
    this.actor.setLocalPosition(this.position);
    
    // Animation
    this.animationTimer += 1;
    this.actor.setLocalY(-5 + speedLength * 1.5 + Math.sin(this.animationTimer / 30));
    
    this.actor.setLocalEulerX(-speedLength / 10);
    this.actor.setLocalEulerZ(-this.rotationSpeed * 6);
    
    this.reactorLeft.setLocalEulerY(this.rotationSpeed * 6);
    this.reactorRight.setLocalEulerY(this.rotationSpeed * 6);
    
    let scale = this.acceleration * 300;
    if (this.acceleration > 0.8 * BoatBehavior.maxAcceleration) scale += Math.sin(this.animationTimer / 1.5);
    
    this.burstLeft.lookAt(Game.cameraBehavior.position);
    let scaleLeft = Math.max(0.01, scale / (1 + this.rotationSpeed * 12));
    this.burstLeft.setLocalScale(scaleLeft, scaleLeft, 1);
    
    this.burstRight.lookAt(Game.cameraBehavior.position);
    let scaleRight = Math.max(0.01, scale / (1 - this.rotationSpeed * 12));
    this.burstRight.setLocalScale(scaleRight, scaleRight, 1);
    
    // Particules && splash
    if (speedLength > 0.6 * BoatBehavior.maxSpeed && targetAcceleration !== 0) {
      let direction = new Sup.Math.Vector3(Math.sin(this.angle), 0, Math.cos(this.angle));
      
      let particuleLeftActor = new Sup.Actor("Particule");
      particuleLeftActor.setLocalPosition(this.burstLeft.getPosition()).moveLocal(direction.clone().multiplyScalar(8)).setY(3);
      particuleLeftActor.setLocalEulerAngles(-Math.PI / 4, 0, this.angle);
      
      new Sup.SpriteRenderer(particuleLeftActor, "In-Game/Boat/Reactor/Particle").setAnimation("Animation", false);
      this.particuleList.push({ actor: particuleLeftActor, speed: direction.clone().multiplyScalar(-12) });
      
      let particuleRightActor = new Sup.Actor("Particule");
      particuleRightActor.setLocalPosition(this.burstRight.getPosition()).moveLocal(direction.clone().multiplyScalar(8)).setY(3);
      particuleRightActor.setLocalEulerAngles(-Math.PI / 4, 0, this.angle);
      new Sup.SpriteRenderer(particuleRightActor, "In-Game/Boat/Reactor/Particle").setAnimation("Animation", false);
      this.particuleList.push({ actor: particuleRightActor, speed: direction.clone().multiplyScalar(-12) }); 
    }
    
    this.splashRndr.getUniforms()["factor"].value = speedLength / BoatBehavior.maxSpeed;
    //this.splashRndr.getUniforms()["factor"].value = this.rotationSpeed / BoatBehavior.maxRotationSpeed;
    
    let speedAngle = Math.atan2(this.speed.x, this.speed.z);
    if (Sup.Input.isKeyDown("SPACE")) Sup.log(Sup.Math.clamp(Sup.Math.wrapAngle(speedAngle - this.angle), -1, 1));
    //this.splashRndr.getUniforms()["moveDirection"].value = Sup.Math.clamp(Sup.Math.wrapAngle(speedAngle - this.angle), -1, 1);
    this.splashRndr.getUniforms()["moveDirection"].value = -this.rotationSpeed / BoatBehavior.maxRotationSpeed;
    
    while (this.particuleList[0] != null && !this.particuleList[0].actor.spriteRenderer.isAnimationPlaying()) {
      this.particuleList[0].actor.destroy();
      this.particuleList.splice(0, 1);
    }
    
    for (let particule of this.particuleList) {
      particule.actor.moveLocal(particule.speed);
      particule.speed.multiplyScalar(0.1);
      
      let speedLength = particule.speed.length();
      let scale = Math.max(1, speedLength / 2);
      particule.actor.setLocalScale(1, scale, 1);
      
      if (speedLength < 4) particule.actor.moveOrientedX(Sup.Math.Random.float(-0.15, 0.15));
    }
  }

  control(index: number) {
    if (index === this.playerIndex) this.playerIndex = null;
    else if (this.playerIndex == null) this.playerIndex = index;
  }
}
Sup.registerBehavior(BoatBehavior);
