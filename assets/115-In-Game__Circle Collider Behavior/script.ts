class CircleColliderBehavior extends Sup.Behavior {
  radius: number;
  position: Sup.Math.Vector3;

  awake() {
    Game.circleColliders.push(this);
  }

  start() {
      this.position = this.actor.getPosition();
  }

  onDestroy() {
    Game.circleColliders.splice(Game.circleColliders.indexOf(this), 1);
  }
}
Sup.registerBehavior(CircleColliderBehavior);
