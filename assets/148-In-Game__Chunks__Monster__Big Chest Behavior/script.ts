class BigChestBehavior extends Sup.Behavior {
  awake() {
    this.actor.modelRenderer.setAnimation("Open").pauseAnimation();
  }
}
Sup.registerBehavior(BigChestBehavior);
