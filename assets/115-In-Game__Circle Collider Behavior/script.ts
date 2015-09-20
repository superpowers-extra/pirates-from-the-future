class CircleColliderBehavior extends Sup.Behavior {
  radius: number;
  position: Sup.Math.Vector3;

  // Set to true if the collider is onboard the ship and should collide with characters
  onboard = false;

  awake() {
    if (!this.onboard) Game.circleColliders.push(this);
    else Game.onboardCircleColliders.push(this);
  }

  start() {
    this.position = this.onboard ? this.actor.getLocalPosition() : this.actor.getPosition();
  }

  onDestroy() {
    if (!this.onboard) Game.circleColliders.splice(Game.circleColliders.indexOf(this), 1);
    else Game.onboardCircleColliders.splice(Game.onboardCircleColliders.indexOf(this), 1);
  }
}
Sup.registerBehavior(CircleColliderBehavior);
