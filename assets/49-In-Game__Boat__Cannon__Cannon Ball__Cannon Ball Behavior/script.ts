class CannonBallBehavior extends Sup.Behavior {
  velocity: Sup.Math.Vector3;
  speed = 3;

  size = 3;

  senderActor: Sup.Actor;
  scale : Sup.Math.Vector3;

//   ploufActor : Sup.Actor;

  // Valeur pour les gros tirs modifiés dans CannonBehavior
  damageValue : number = 10;
  
  setup(position: Sup.Math.Vector3, angle: number) {
    this.actor.setPosition(position);
    this.actor.setEulerY(angle);

    let cannonBallSpeed = this.speed;
    let selfVelocity = new Sup.Math.Vector3(Math.sin(angle) * cannonBallSpeed, 0.4 , Math.cos(angle) * cannonBallSpeed);
    this.velocity = selfVelocity.add(Game.boatBehavior.speed);
    
    this.scale = new Sup.Math.Vector3(0.8);
    this.actor.setLocalScale(this.scale);
    
//     this.ploufActor = this.actor.getChild("Plouf");
  }

  update() {
    this.scale = this.scale.lerp(new Sup.Math.Vector3(this.size), 0.08);
    this.actor.setLocalScale(this.scale);
    
    let position = this.actor.getPosition();
    for (let damageable of Game.damageables) {
      if (damageable.actor === this.senderActor) continue;
      
      let distance = damageable.actor.getPosition().distanceTo(position);
      if (distance < damageable.radius + this.size) {
        Game.cameraBehavior.shake(this.damageValue / 20, 20);
        damageable.takeDamage(this.damageValue);
        this.actor.destroy();
        return;
      }
    }
    
    this.actor.lookAt(Game.cameraBehavior.position);
    if (this.actor.getY() < 0){
//       this.ploufActor.setVisible(true);
//       this.ploufActor.addBehavior(PloufBehavior);
      this.actor.destroy();
      return;
    }
    
    this.velocity.y -= 0.04;
    
    this.actor.move(this.velocity);
  }
}
Sup.registerBehavior(CannonBallBehavior);