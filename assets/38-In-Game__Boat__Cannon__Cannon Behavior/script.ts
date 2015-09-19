class CannonBehavior extends InteractiveBehavior {
  action(playerIndex: number) {
    let cannonBall = Sup.appendScene("In-Game/Boat/Cannon/Cannon Ball/Prefab")[0];
    cannonBall.setPosition(this.actor.getChild("Cannon Ball Spawn").getPosition());
    cannonBall.setEulerY(this.actor.getChild("Cannon Ball Spawn").getEulerY() + Math.PI);
  }
}
Sup.registerBehavior(CannonBehavior);
