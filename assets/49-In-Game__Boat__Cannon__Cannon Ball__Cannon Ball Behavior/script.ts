class CannonBallBehavior extends Sup.Behavior {
  velocity: Sup.Math.Vector3;
  speed = 1.5;
  
  setup(position: Sup.Math.Vector3, angle: number) {
    this.actor.setPosition(position);
    this.actor.setEulerY(angle);

    let cannonBallSpeed = this.speed;
    let selfVelocity = new Sup.Math.Vector3(Math.sin(angle) * cannonBallSpeed, 0.6 , Math.cos(angle) * cannonBallSpeed);
    this.velocity = selfVelocity.add(Game.boatBehavior.speed);
  }

  update() {
    if (this.actor.getY() < 0){
      this.actor.destroy();
      return;
    }
    
    this.velocity.y -= 0.025;
    
    this.actor.move(this.velocity);
  }
}
Sup.registerBehavior(CannonBallBehavior);