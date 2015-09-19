class CannonBehavior extends InteractiveBehavior {
  
  cooldown : number;
  cooldownDuration : number;
  
  playerIndex : number;
  
  angleY: number;
  minAngleY: number;
  maxAngleY: number;
  maxRotationSpeed = 0.05;

  chargeTimer: number;
  chargeDuration: number;
  chargeMultiplier: number;

  isAttacking : boolean;
  chargeAttack : boolean;

  chargeFXActor : Sup.Actor;
  

  awake(){
    super.awake();
    this.cooldown = 0;
    this.cooldownDuration = 30;
    
    this.angleY = this.actor.getLocalEulerY();
    this.minAngleY = this.angleY - Math.PI / 4;
    this.maxAngleY = this.angleY + Math.PI / 4;
    
    this.isAttacking = false;

    this.chargeTimer = 0;
    this.chargeDuration = 60;
    this.chargeMultiplier = 1.2;
    
    this.chargeFXActor = new Sup.Actor("Fx Charge", this.actor);
    this.chargeFXActor.setLocalPosition(this.actor.getChild("Cannon Ball Spawn").getLocalPosition());
    
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
      targetPosition.y = characterBehavior.position.y;
      characterBehavior.setTarget(targetPosition, this.actor.getLocalEulerY() + Math.PI);
      
      let Yrotation = -Input.horizontal(this.playerIndex) * this.maxRotationSpeed;
      this.angleY = Sup.Math.clamp(this.angleY + Yrotation, this.minAngleY, this.maxAngleY);
      this.actor.setLocalEulerY(this.angleY); 
      
      
      if (! this.isAttacking) {
        if (Input.keyDownAction2(this.playerIndex) && this.cooldown == 0) {
          this.isAttacking = true;
          this.chargeTimer = 0;
          this.chargeFXActor.spriteRenderer = new Sup.SpriteRenderer(this.chargeFXActor, "In-Game/Boat/Cannon/Fx Charge");
          this.chargeFXActor.spriteRenderer.setAnimation("Charge");
        }
      }
      else {
        if (Input.wasReleasedAction2(this.playerIndex) && this.cooldown == 0) {
          this.isAttacking = false;
            // Play Sprite explosion          

          if (this.chargeTimer == this.chargeDuration) {
            this.chargeFXActor.setLocalScale( new Sup.Math.Vector3(1, 1, 1) );
//             this.chargeFXActor.spriteRenderer.setAnimation("Explose", false);
            // Jouer animation de charge complète
          }
          let cannonBall = Sup.appendScene("In-Game/Boat/Cannon/Cannon Ball/Prefab")[0];
          cannonBall.getBehavior(CannonBallBehavior).speed *= 0.5 + this.chargeMultiplier * this.chargeTimer*0.01;
          cannonBall.getBehavior(CannonBallBehavior).setup(this.actor.getChild("Cannon Ball Spawn").getPosition(), this.actor.getEulerY() + Math.PI);
        }
        else {
          this.chargeTimer = Math.min( this.chargeDuration, this.chargeTimer + 1 );
        
          if (this.chargeTimer == 10) {
            this.chargeFXActor.setLocalScale(new Sup.Math.Vector3(1,1,1));
            this.chargeFXActor.spriteRenderer.setAnimation("Charge", false);
          }
        }
      }
      // Destroy le sprite si l'animation d'attaque est passée
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
