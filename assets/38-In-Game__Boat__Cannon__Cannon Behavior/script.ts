class CannonBehavior extends InteractiveBehavior {
  
  cooldown : number;
  cooldownDuration : number;
  
  playerIndex : number;
  
  angleY: number;
  minAngleY: number;
  maxAngleY: number;
  maxRotationSpeed = 0.2;

  chargeTimer: number;
  chargeDuration: number;
  chargeMultiplier: number;

  isAttacking : boolean;
  chargeAttack : boolean;

  chargeFXActor : Sup.Actor;
  

  awake(){
    super.awake();
    this.cooldown = 0;
    this.cooldownDuration = 20;
    
    this.angleY = this.actor.getLocalEulerY();
    this.minAngleY = this.angleY - Math.PI / 4;
    this.maxAngleY = this.angleY + Math.PI / 4;
    
    this.isAttacking = false;

    this.chargeTimer = 0;
    this.chargeDuration = 60;
    this.chargeMultiplier = 1.2;
    
    this.chargeFXActor = Sup.getActor("chargeFx");
    
    
  }

  update(){
    if (this.cooldown > 0){
      this.cooldown --;
    }
    
    if (this.playerIndex != null) {
      
      // Move player with cannon
      let trigger = this.actor.getChild("Trigger");
      let targetPosition = trigger.getLocalPosition().rotate(this.actor.getLocalOrientation());
      targetPosition.add(this.actor.getLocalPosition());
      let characterBehavior = Game.characterBehaviors[this.playerIndex];
      characterBehavior.setTarget(targetPosition, this.actor.getLocalEulerY() + Math.PI);
      
      
      if (! this.isAttacking) {
        if (Input.keyDownAction2(this.playerIndex) && this.cooldown == 0) {
          this.isAttacking = true;
          this.chargeTimer = 0;
          // get Sprite d'attaque 
          this.chargeFXActor.spriteRenderer.setSprite("In-Game/Boat/Cannon/Fx Charge");
        }
      }
      else {
        if (Input.wasReleasedAction2(this.playerIndex)) {
          this.isAttacking = false;
          // Jouer animation d'attaque
          

          if (this.chargeTimer == this.chargeDuration) {
            // Jouer animation de charge complète
          }
          let cannonBall = Sup.appendScene("In-Game/Boat/Cannon/Cannon Ball/Prefab")[0];
          cannonBall.getBehavior(CannonBallBehavior).speed *= 0.5 + this.chargeMultiplier * this.chargeTimer*0.01;
          cannonBall.getBehavior(CannonBallBehavior).setup(this.actor.getChild("Cannon Ball Spawn").getPosition(), this.actor.getEulerY() + Math.PI);
        }
        else {
          this.chargeTimer = Math.min( this.chargeDuration, this.chargeTimer + 1 );
          // Augmenter scale du Sprite
        }
      }
      // Destroy le sprite si l'animation d'attaque est passée
    }
    
    
    
    
    
    if (this.playerIndex != null) {
      let Yrotation = -Input.horizontal(this.playerIndex) * this.maxRotationSpeed;
      this.angleY = Sup.Math.clamp(this.angleY + Yrotation, this.minAngleY, this.maxAngleY);
      this.actor.setLocalEulerY(this.angleY);
    }
    
  }
  
  action(playerIndex: number) {
    this.control(playerIndex);
  }

  control(index: number) {
    if (index === this.playerIndex) {
      this.playerIndex = null;
      Game.characterBehaviors[index].setState(CharacterState.Free);
    } else if (this.playerIndex == null) {
      this.playerIndex = index;
      let characterBehavior = Game.characterBehaviors[index];
      characterBehavior.setState(CharacterState.Cannon);
    }
  }
}
Sup.registerBehavior(CannonBehavior);
