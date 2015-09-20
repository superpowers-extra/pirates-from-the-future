class BoatTentacleBehavior extends Sup.Behavior {
  awake() {
    this.actor["onDead"] = this.onDead.bind(this);
    this.actor["onDamaged"] = this.onDamaged.bind(this);
    this.actor.getChild("Model").modelRenderer.setAnimation("Attack_Near", false);
  }
  
  onDead() {
    this.actor.destroy();
    Game.octopusBehavior.onTentacleDead();
  }
  onDamaged() {
    Game.cameraBehavior.shake(0.3, 30);
  }
}
Sup.registerBehavior(BoatTentacleBehavior);
