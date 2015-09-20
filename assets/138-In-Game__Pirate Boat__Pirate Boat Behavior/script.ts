enum PirateBoatState { Idle, Chase, Attack, Board, Dying }

class PirateBoatBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  speed = new Sup.Math.Vector3();
  private acceleration = 0;
  static maxSpeed = 1;
  static maxAcceleration = 0.015;
  static speedDrag = 0.7;

  static  sinkSpeed = 0.1;
  private pirateCount = 2;

  private state: PirateBoatState;
  
  static boardDistance = 30;
  static chaseDistance = 150;

  private shootTimer = 0;
  static shootCooldown = 2 * 60;

  private cannonSpawn: Sup.Actor;
  
  awake() {
    this.actor["onDead"] = this.onDead.bind(this);
    
    this.state = Sup.Math.Random.integer(0, 1) === 0 ? PirateBoatState.Chase : PirateBoatState.Board;
    this.cannonSpawn = this.actor.getChild("Mesh").getChild("Cannon Ball Spawn");
  }

  start() {
    this.position = this.actor.getLocalPosition();
  }

  onDead() {
    this.state = PirateBoatState.Dying;
  }

  update() {
    let distance = this.position.distanceTo(Game.boatBehavior.position);
    
    switch (this.state) {
      case PirateBoatState.Dying:
        this.position.y -= PirateBoatBehavior.sinkSpeed;
        this.actor.setLocalY(this.position.y);
        if (this.position.y < -10) this.actor.destroy();
        return;
        break;
      
      case PirateBoatState.Board: {
        let targetAcceleration = distance > PirateBoatBehavior.boardDistance ? PirateBoatBehavior.maxAcceleration : 0;
        this.acceleration = Sup.Math.lerp(this.acceleration, targetAcceleration, 0.15);
        break;
      }
      
      case PirateBoatState.Chase: {
        let targetAcceleration = distance > PirateBoatBehavior.chaseDistance ? PirateBoatBehavior.maxAcceleration : 0;
        this.acceleration = Sup.Math.lerp(this.acceleration, targetAcceleration, 0.15);
        
        this.shootTimer -= 1;
        if (distance < PirateBoatBehavior.chaseDistance && this.shootTimer <= 0) {
          this.shootTimer = PirateBoatBehavior.shootCooldown;
          
          Sup.Audio.playSound("In-Game/Boat/Cannon/Shoot", 0.8, { loop: false, pitch : -1+(Math.random()/2)});
          let cannonBall = Sup.appendScene("In-Game/Boat/Cannon/Cannon Ball/Prefab")[0];
          let behavior = cannonBall.getBehavior(CannonBallBehavior);
          behavior.senderActor = this.actor;
          behavior.speed *= 0.7;
          behavior.setup(this.cannonSpawn.getPosition(), this.cannonSpawn.getEulerY() + Math.PI);
        }
        break;
      }
    }
    
    if (distance <= PirateBoatBehavior.boardDistance) {
      Game.cameraBehavior.shake(0.5, 30);

      for(let i = 0 ; i < this.pirateCount; i++){
        let enemyActor = Sup.appendScene("In-Game/Pirate/Prefab", Game.boatBehavior.actor)[0];
        let spawnpoint = Sup.Math.Random.sample(Game.boatBehavior.pirateSpawnpoints);
        enemyActor.setLocalPosition(spawnpoint.position);
        enemyActor.setLocalEulerY(spawnpoint.angle);
      }
      this.actor.destroy();
      return;
    }
    
    let direction = Game.boatBehavior.position.clone().subtract(this.position).normalize();
    direction.y = 0;
    let angle = Math.atan2(direction.x, direction.z);
    this.actor.setLocalEulerY(angle);
    
    this.speed.add(Math.sin(angle) * this.acceleration, 0, Math.cos(angle) * this.acceleration);
    let speedLength = this.speed.length();
    if (speedLength > BoatBehavior.maxSpeed) this.speed.multiplyScalar(BoatBehavior.maxSpeed / speedLength);
    this.speed.multiplyScalar(BoatBehavior.speedDrag);
    this.position.add(this.speed);

    for (let collider of Game.circleColliders) {
      colliderPosition.copy(collider.position).y = this.position.y;

      let diff = colliderPosition.subtract(this.position);
      let penetration = (collider.radius + BoatBehavior.radius) - diff.length();
      if (penetration > 0) {
        if (speedLength > 1.5) {
          this.speed.subtract(diff);
        } else {
          let oldPosition = this.position.clone();
          this.position.add(diff.normalize().multiplyScalar(-penetration));
          this.speed.subtract(diff.normalize().multiplyScalar(-penetration));
        }
      }
    }
    this.actor.setLocalPosition(this.position);
  }
}
Sup.registerBehavior(PirateBoatBehavior);
