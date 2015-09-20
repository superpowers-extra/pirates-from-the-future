class BoatTentacleBehavior extends Sup.Behavior {
  awake() {
    this.actor["onDead"] = this.onDead.bind(this);
  }
  
  onDead() {
    Sup.log("I deded");
    this.actor.destroy();
    Game.octopusBehavior.onTentacleDead();
  }

  update() {
    
  }
}
Sup.registerBehavior(BoatTentacleBehavior);
