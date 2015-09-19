let colliderPosition = new Sup.Math.Vector3();

class BoatBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  offset = { x: 0, z: 0 };
  angle: number;

  acceleration = 0;
  static maxAcceleration = 0.02;
  speed = new Sup.Math.Vector3();
  static maxSpeed = 2;
  static speedDrag = 0.99;

  rotationAcceleration = 0;
  static maxRotationAcceleration = 0.002;
  rotationSpeed = 0;
  static maxRotationSpeed = 0.03;
  static rotationSpeedDrag = 0.95;

  static radius = 30;

  playerIndex: number;

  /*
  private moveSpeed = 0;
  static rotateMoveSpeed = 0.5;
  static maxMoveSpeed = 1;// 0.5;

  private rotateSpeed = 0;
  static minRotateSpeed = 0.002;
  static maxRotateSpeed = 0.015;
  static minBreakAngle = 0.2;
  */

  animationTimer = 0;
  
  awake() {
    Game.boatBehavior = this;
    this.position = this.actor.getLocalPosition();
    this.angle = this.actor.getLocalEulerY();
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
      
      let diff = colliderPosition.subtract(this.position);
      let penetration = diff.length() - (collider.radius + BoatBehavior.radius);
      if (penetration > 0) this.position.add(diff.normalize().multiplyScalar(penetration));
    }
    
    // Map edge teleportation
    if (this.position.x / Game.settings.chunkSize - this.offset.x > Game.settings.mapSize / 2) {
      this.offset.x += Game.settings.mapSize;
      for (let islandActor of Game.chunkActors) islandActor.moveLocalX(Game.settings.chunkSize * Game.settings.mapSize);
    } else if (this.position.x / Game.settings.chunkSize - this.offset.x < -Game.settings.mapSize / 2) {
      this.offset.x -= Game.settings.mapSize;
      for (let islandActor of Game.chunkActors) islandActor.moveLocalX(-Game.settings.chunkSize * Game.settings.mapSize);
    }
    if (this.position.z / Game.settings.chunkSize - this.offset.z > Game.settings.mapSize / 2) {
      this.offset.z += Game.settings.mapSize;
      for (let islandActor of Game.chunkActors) islandActor.moveLocalZ(Game.settings.chunkSize * Game.settings.mapSize);
    } else if (this.position.z / Game.settings.chunkSize - this.offset.z < -Game.settings.mapSize / 2) {
      this.offset.z -= Game.settings.mapSize;
      for (let islandActor of Game.chunkActors) islandActor.moveLocalZ(-Game.settings.chunkSize * Game.settings.mapSize);
    }
    this.actor.setLocalPosition(this.position);
    
    // Animation
    this.animationTimer += 1;
    this.actor.setLocalY(-5 + speedLength * 1.5 + Math.sin(this.animationTimer / 30));
    
    this.actor.setLocalEulerX(-speedLength / 10);
  }

  control(index: number) {
    if (index === this.playerIndex) this.playerIndex = null;
    else if (this.playerIndex == null) this.playerIndex = index;
  }
}
Sup.registerBehavior(BoatBehavior);
