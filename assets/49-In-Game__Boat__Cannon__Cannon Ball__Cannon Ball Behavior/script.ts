class CannonBallBehavior extends Sup.Behavior {
  velocity: Sup.Math.Vector3;
  static speed = 1;
  
  setup(position: Sup.Math.Vector3, angle: number) {
    this.actor.setPosition(position);
    this.actor.setEulerY(angle);

    let cannonBallSpeed = CannonBallBehavior.speed;
    let selfVelocity = new Sup.Math.Vector3(Math.sin(angle) * cannonBallSpeed, 0.3, Math.cos(angle) * cannonBallSpeed);
    this.velocity = selfVelocity.add(Game.boatBehavior.speed);
  }

  update() {
    if (this.actor.getY() < 0){
      this.actor.destroy();
      return;
    }
    
    this.velocity.y -= 0.02;
    
    this.actor.move(this.velocity);
  }
}
Sup.registerBehavior(CannonBallBehavior);
