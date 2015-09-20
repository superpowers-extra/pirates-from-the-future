class DamageableBehavior extends Sup.Behavior {
  radius = 5;
  private health: number;
  maxHealth = 10;
  onboard = false;
  private immune = false;
  friendly = false;

  private healthBar: Sup.Actor;
  private healthFill: Sup.Actor;

  awake() {
    this.health = this.maxHealth;
    
    this.healthBar = Sup.appendScene("In-Game/Health Bar/Prefab", this.actor)[0];
    this.healthBar.setLocalY(12);
    this.healthFill = this.healthBar.getChild("Fill");
    if (this.friendly) this.healthFill.spriteRenderer.setSprite("In-Game/Health Bar/Fill Friendly");
    
    if (!this.onboard) Game.damageables.push(this);
    else Game.onboardDamageables.push(this);
  }

  onDestroy() {
    if (!this.onboard) Game.damageables.splice(Game.damageables.indexOf(this), 1);
    else Game.onboardDamageables.splice(Game.onboardDamageables.indexOf(this), 1);
  }

  update() {
    if (this.friendly) {
      // Only show friendly healthbars during fights
      this.healthBar.setVisible(Game.onboardDamageables.length > 2 || Game.octopusBehavior.state != OctopusState.Hidden);
    } 
    
    this.healthBar.lookAt(Game.cameraBehavior.position);
  }

  refillHealth() {
    this.health = this.maxHealth;
    this.updateHealthBar();
  }

  takeDamage(damage: number) {
    if(this.health - damage <= 0) {
      if (!this.immune) {
        this.health = 0;
        this.updateHealthBar();
        if (this.actor["onDead"] != null) this.actor["onDead"]();
      }
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
