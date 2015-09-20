class SlashTentacleBehavior extends Sup.Behavior {
  
  delayTimer = 0;
  static delayDuration = 60;
  static modelLowY = -35;
  static modelHighY = -5;

  slashTimer = 0;
  static slashDuration = 30;

  postSlashTimer = 0;
  static postSlashDuration = 30;

  modelActor: Sup.Actor;

  static maxHitDistance = 60;
  static maxHitAngle = Math.PI / 4;
  
  awake() {
    this.modelActor = this.actor.getChild("Model");
    this.modelActor.setVisible(false);
  }
  
  update() {
    if (this.delayTimer < SlashTentacleBehavior.delayDuration) {
      this.delayTimer++;
      
      if (this.delayTimer == 5) this.modelActor.setVisible(true);

      let progress = this.delayTimer / SlashTentacleBehavior.delayDuration;
      progress *= progress;
      
      this.modelActor.setLocalY(Sup.Math.lerp(SlashTentacleBehavior.modelLowY, SlashTentacleBehavior.modelHighY, progress));
    } else if (this.slashTimer < SlashTentacleBehavior.slashDuration) {
      if (this.slashTimer === 0) this.modelActor.modelRenderer.setAnimation("Attack_Near", false);
      this.slashTimer++;
      
      let progress = this.slashTimer / SlashTentacleBehavior.slashDuration;
      progress *= progress;
      //this.modelActor.setEulerX(Math.PI / 2 * (progress));
      
      if (this.slashTimer === 15) {
        let boatOffset = Game.boatBehavior.position.clone().subtract(this.actor.getPosition());
        boatOffset.y = 0;
        
        let angleOffset = Sup.Math.wrapAngle(Math.atan2(boatOffset.x, boatOffset.z) - this.actor.getLocalEulerY());
        
        if (boatOffset.length() < SlashTentacleBehavior.maxHitDistance && Math.abs(angleOffset) < SlashTentacleBehavior.maxHitAngle) {
          for (let character of Game.characterBehaviors) character.actor.getBehavior(DamageableBehavior).takeDamage(20);
        }
      }
      
    } else if (this.postSlashTimer < SlashTentacleBehavior.postSlashDuration) {
      this.postSlashTimer++;
    } else {
      this.actor.destroy();
      Game.octopusBehavior.onSlashOver();
    }
  }
}
Sup.registerBehavior(SlashTentacleBehavior);
