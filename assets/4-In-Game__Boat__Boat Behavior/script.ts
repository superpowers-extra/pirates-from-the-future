let colliderPosition = new Sup.Math.Vector3();

class BoatBehavior extends Sup.Behavior {
  playerIndex: number;
  position: Sup.Math.Vector3;
  chunkOffset = { x: 0, z: 0 };
  angle: number;
  motorSoundPlay = false
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
  
  static maxLightIntensity = 1.0;

  static radius = 30;

  private animationTimer = 0;

  private reactorLeft: Sup.Actor;
  private reactorRight: Sup.Actor;
  private burstLeft: Sup.Actor;
  private burstRight: Sup.Actor;
  private lightLeft: Sup.Light;
  private lightRight: Sup.Light;
  private particuleList: { actor: Sup.Actor, speed: Sup.Math.Vector3 }[] = [];

  private splashRndr: Sup.ModelRenderer;
  private wheelActor: Sup.Actor;

  private frozen = false;

  private boatMotorSound = Sup.Audio.playSound("In-Game/Boat/Motor", 0, { loop: true });

  pirateSpawnpoints: { position: Sup.Math.Vector3; angle: number; }[] = [];

  awake() {
    this.actor["onDamaged"] = this.onDamaged.bind(this);
    
    Game.boatBehavior = this;
    this.position = this.actor.getLocalPosition();
    this.angle = this.actor.getLocalEulerY();
    
    this.reactorLeft = this.actor.getChild("Reactor Left");
    this.reactorRight = this.actor.getChild("Reactor Right");
    this.burstLeft = this.reactorLeft.getChild("Burst");
    this.burstRight = this.reactorRight.getChild("Burst");
    this.lightLeft = this.reactorLeft.getChild("Light").light;
    this.lightRight = this.reactorRight.getChild("Light").light;
    
    this.splashRndr = this.actor.getChild("Splash").modelRenderer;
    this.wheelActor = this.actor.getChild("Wheel").getChild("Model");
    
    let spawnpoints = this.actor.getChild("Pirates Spawns").getChildren();
    for (let spawnpoint of spawnpoints) this.pirateSpawnpoints.push({ position: spawnpoint.getLocalPosition(), angle: spawnpoint.getLocalEulerY() });
  }

  onDamaged() {
    Game.cameraBehavior.shake(0.8, 50);
  }

  setPosition(position) {
    this.position.copy(position);
    this.actor.setLocalPosition(position);
    Game.cameraBehavior.forcePosition();
  }

  freeze() {
    this.frozen = true;
  }
    
  unfreeze() {
    this.frozen = false;
    this.rotationAcceleration = 0;
    this.acceleration = 0;
    this.rotationSpeed = 0;
    this.speed.set(0, 0, 0);
  }

  getWorldPosition() {
    return this.position.clone().subtract(Game.boatBehavior.chunkOffset.x * Game.settings.chunkSize, 0, Game.boatBehavior.chunkOffset.z * Game.settings.chunkSize);
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
    
    if (!this.frozen) {
      this.angle += this.rotationSpeed;
      this.actor.setLocalEulerY(this.angle);
    }
    this.wheelActor.rotateLocalEulerZ(-this.rotationSpeed * 3);
    
    // Movement
    
    this.acceleration = Sup.Math.lerp(this.acceleration, targetAcceleration, 0.15);
    this.speed.add(Math.sin(this.angle) * this.acceleration, 0, Math.cos(this.angle) * this.acceleration);
    this.speed.multiplyScalar(BoatBehavior.speedDrag);
    let speedLength = this.speed.length();
    if (speedLength > BoatBehavior.maxSpeed) this.speed.multiplyScalar(BoatBehavior.maxSpeed / speedLength);
    
    let previousY = this.actor.getLocalY();
    
    if (!this.frozen) {
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
            if (collider.actor["onHardHit"] != null) collider.actor["onHardHit"]();
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
    }
    
    // Motor sound
    let soundFactor = -0.1+speedLength / BoatBehavior.maxSpeed;
    this.boatMotorSound.setVolume(soundFactor).setPitch(soundFactor);
    
    // Animation
    this.animationTimer += 1;
    let currentY: number;
    if (!this.frozen && speedLength > 0.6 * BoatBehavior.maxSpeed)
      currentY = Sup.Math.lerp(previousY, 5 * Math.sin(this.animationTimer / 20) - 2, 0.05);
    else
      currentY = Sup.Math.lerp(previousY, -5 + speedLength * 1.5 + Math.sin(this.animationTimer / 30), 0.01);
    this.actor.setLocalY(currentY);
    this.actor.setLocalEulerX(-speedLength / 10);
    this.actor.setLocalEulerZ(-this.rotationSpeed * 6);
    
    this.reactorLeft.setLocalEulerY(this.rotationSpeed * 6);
    this.reactorRight.setLocalEulerY(this.rotationSpeed * 6);
    
    let scale = this.acceleration * 300;
    if (this.acceleration > 0.8 * BoatBehavior.maxAcceleration) scale += Math.sin(this.animationTimer / 1.5);
    
    this.burstLeft.lookAt(Game.cameraBehavior.position);
    let scaleLeft = Math.max(0.01, scale / (1 + this.rotationSpeed * 12));
    this.burstLeft.setLocalScale(scaleLeft, scaleLeft, 1);
    
    let lightMult = scaleLeft / 300 / BoatBehavior.maxAcceleration;
    this.lightLeft.setIntensity(  BoatBehavior.maxLightIntensity * lightMult );
    
    this.burstRight.lookAt(Game.cameraBehavior.position);
    let scaleRight = Math.max(0.01, scale / (1 - this.rotationSpeed * 12));
    this.burstRight.setLocalScale(scaleRight, scaleRight, 1);
    
    lightMult = scaleRight / 300 / BoatBehavior.maxAcceleration;
    this.lightRight.setIntensity(  BoatBehavior.maxLightIntensity * lightMult );
    
    // Particules
    if (!this.frozen && speedLength > 0.3 * BoatBehavior.maxSpeed && targetAcceleration !== 0) {
      let direction = new Sup.Math.Vector3(Math.sin(this.angle), 0, Math.cos(this.angle));
      
      let particuleLeftActor = new Sup.Actor("Particule");
      particuleLeftActor.setLocalPosition(this.burstLeft.getPosition()).moveLocal(direction.clone().multiplyScalar(8)).moveLocalY(2);
      particuleLeftActor.setLocalEulerAngles(-Math.PI / 4, 0, this.angle);
      
      new Sup.SpriteRenderer(particuleLeftActor, "In-Game/Boat/Reactor/Particle").setAnimation("Animation", false);
      this.particuleList.push({ actor: particuleLeftActor, speed: direction.clone().multiplyScalar(-speedLength * 8) });
      
      let particuleRightActor = new Sup.Actor("Particule");
      particuleRightActor.setLocalPosition(this.burstRight.getPosition()).moveLocal(direction.clone().multiplyScalar(8)).moveLocalY(2);
      particuleRightActor.setLocalEulerAngles(-Math.PI / 4, 0, this.angle);
      new Sup.SpriteRenderer(particuleRightActor, "In-Game/Boat/Reactor/Particle").setAnimation("Animation", false);
      this.particuleList.push({ actor: particuleRightActor, speed: direction.clone().multiplyScalar(-speedLength * 8) }); 
    }
    
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
    
    // Splash
    this.splashRndr.getUniforms()["factor"].value = this.frozen ? 0 : Sup.Math.clamp(speedLength / BoatBehavior.maxSpeed, 0, 1);
    this.splashRndr.getUniforms()["moveDirection"].value = -this.rotationSpeed / BoatBehavior.maxRotationSpeed;
  }

  control(index: number) {
    if (index === this.playerIndex) this.playerIndex = null;
    else if (this.playerIndex == null) this.playerIndex = index;
  }
}
Sup.registerBehavior(BoatBehavior);
