class CannonBallBehavior extends Sup.Behavior {
  velocity: Sup.Math.Vector3;
  speed = 1.5;

  size = 2;

  scale : Sup.Math.Vector3;
  
  setup(position: Sup.Math.Vector3, angle: number) {
    this.actor.setPosition(position);
    this.actor.setEulerY(angle);

    let cannonBallSpeed = this.speed;
    let selfVelocity = new Sup.Math.Vector3(Math.sin(angle) * cannonBallSpeed, 0.4 , Math.cos(angle) * cannonBallSpeed);
    this.velocity = selfVelocity.add(Game.boatBehavior.speed);
    
    this.scale = new Sup.Math.Vector3(0.8, 0.8, 0.8);
    this.actor.setLocalScale(this.scale);
  }

  update() {
    this.scale = this.scale.lerp(new Sup.Math.Vector3(2, 2, 2), 0.08);
    this.actor.setLocalScale(this.scale);
    
    let position = this.actor.getPosition();
    for (let damageable of Game.damageables) {
      let distance = damageable.actor.getPosition().distanceTo(position);
      if (distance < damageable.radius + this.size) {
        damageable.takeDamage(10);
        this.actor.destroy();
        return;
      }
    }
    
    this.actor.lookAt(Game.cameraBehavior.position);
    if (this.actor.getY() < 0){
      this.actor.destroy();
      return;
    }
    
    this.velocity.y -= 0.02;
    
    this.actor.move(this.velocity);
  }
}
Sup.registerBehavior(CannonBallBehavior);