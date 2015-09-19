class CannonBallBehavior extends Sup.Behavior {

  update() {
    this.actor.moveOrientedZ(0.3);
  }
}
Sup.registerBehavior(CannonBallBehavior);
