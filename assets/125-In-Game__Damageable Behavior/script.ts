class DamageableBehavior extends Sup.Behavior {
  radius = 5;
  health: number;
  maxHealth = 10;
  onboard = false;
  immune = false;

  healthBar: Sup.Actor;
  healthFill: Sup.Actor;

  awake() {
    this.health = this.maxHealth;
    
    this.healthBar = Sup.appendScene("In-Game/Health Bar/Prefab", this.actor)[0];
    this.healthBar.setLocalY(12);
    this.healthFill = this.healthBar.getChild("Fill");
    
    if (!this.onboard) Game.damageables.push(this);
    else Game.onboardDamageables.push(this);
  }

  onDestroy() {
    if (!this.onboard) Game.damageables.splice(Game.damageables.indexOf(this), 1);
    else Game.onboardDamageables.splice(Game.onboardDamageables.indexOf(this), 1);
  }

  update() {
    this.healthBar.lookAt(Game.cameraBehavior.position) /* .rotateLocalEulerY(Math.PI) - la tritesse d'un homme */ ;
  }

  takeDamage(damage: number) {
    if(this.health - damage <= 0) {
      if (!this.immune) this.actor["onDead"]();
    } else {
      if (this.actor["onDamaged"] != null) this.actor["onDamaged"]();
      if (!this.immune) {
        this.health -= damage;
        this.updateHealthBar();
      }
    }
  }

  updateHealthBar() {
    this.healthFill.setLocalScale(this.health / this.maxHealth, 1, 1);
  }
}
Sup.registerBehavior(DamageableBehavior);
