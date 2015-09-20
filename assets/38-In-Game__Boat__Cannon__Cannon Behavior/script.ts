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
  attackLaunched : boolean;

  chargeFXActor : Sup.Actor;
  explosionFxActor : Sup.Actor;

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
    
    this.chargeFXActor = new Sup.Actor("Fx Charge", this.actor);
    this.chargeFXActor.setLocalPosition(this.actor.getChild("Cannon Ball Spawn").getLocalPosition());

    this.explosionFxActor = new Sup.Actor("Fx Explosion", this.actor);
    this.explosionFxActor.setLocalPosition(this.actor.getChild("Cannon Ball Spawn").getLocalPosition());
    this.explosionFxActor.setLocalScale(new Sup.Math.Vector3(0.01));
    this.explosionFxActor.spriteRenderer = new Sup.SpriteRenderer(this.actor, "In-Game/Boat/Cannon/Fx Explose");
  }

  update(){
    if (this.cooldown > 0)this.cooldown --;
    
    if (this.playerIndex == null) return;
      
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
        this.chargeFXActor = new Sup.Actor("Fx Charge", this.actor);
        this.chargeFXActor.setPosition(this.actor.getChild("Cannon Ball Spawn").getPosition());
        this.chargeFXActor.addBehavior(CannonFxBehavior);

      }
    } else {
      if (Input.wasReleasedAction2(this.playerIndex) && this.cooldown == 0) this.shoot();
      else this.chargeTimer = Math.min(this.chargeDuration, this.chargeTimer + 1);
    }
    if (!this.explosionFxActor.spriteRenderer.isAnimationPlaying())
      this.explosionFxActor.setLocalScale(new Sup.Math.Vector3(0.01));

    if (this.attackLaunched && this.explosionFxActor.spriteRenderer.isAnimationPlaying()) this.attackLaunched = false;
  }
  
  action(playerIndex: number) {
    this.control(playerIndex);
  }

  control(index: number) {
    if (index === this.playerIndex) {
      this.playerIndex = null;
      Game.characterBehaviors[index].setState(CharacterState.Free);
      if (this.isAttacking) this.shoot();
      
    } else if (this.playerIndex == null) {
      this.playerIndex = index;
      let characterBehavior = Game.characterBehaviors[index];
      characterBehavior.setState(CharacterState.Cannon);
    }
  }

  shoot() {
    this.explosionFxActor.spriteRenderer.setAnimation("Explosion", false);
    this.explosionFxActor.spriteRenderer.playAnimation(false);
    this.explosionFxActor.setLocalScale(new Sup.Math.Vector3(4, 4, 1));
    this.chargeFXActor.destroy();
    this.isAttacking = false;
    this.attackLaunched = true;

    if (this.chargeTimer == this.chargeDuration) {

    }
    this.cooldown = this.cooldownDuration;
    let cannonBall = Sup.appendScene("In-Game/Boat/Cannon/Cannon Ball/Prefab")[0];
    cannonBall.getBehavior(CannonBallBehavior).speed *= 0.5 + this.chargeMultiplier * this.chargeTimer*0.01;
    cannonBall.getBehavior(CannonBallBehavior).setup(this.actor.getChild("Cannon Ball Spawn").getPosition(), this.actor.getEulerY() + Math.PI);
  }
}
Sup.registerBehavior(CannonBehavior);

/*


      if (! this.isAttacking) {
        if (Input.keyDownAction2(this.playerIndex) && this.cooldown == 0) {
          this.isAttacking = true;
          this.chargeTimer = 0;
        this.chargeFXActor.spriteRenderer.setSprite( Sup.get("In-Game/Boat/Cannon/Fx Charge", Sup.Sprite) );
        this.chargeFXActor.spriteRenderer.setAnimation("Charge", false);
        this.chargeFXActor.setLocalScale(new Sup.Math.Vector3(1.5, 1.5, 1.5));
        }
      } else {
        if (Input.wasReleasedAction2(this.playerIndex) && this.cooldown == 0) {
          this.chargeFXActor.spriteRenderer.setSprite( Sup.get("In-Game/Boat/Cannon/Fx Explose", Sup.Sprite));
          this.chargeFXActor.spriteRenderer.setAnimation("Explosion", false);
          this.chargeFXActor.setLocalScale(new Sup.Math.Vector3(1.5, 1.5, 1.5));
          this.isAttacking = false;
          this.attackLaunched = true;

          if (this.chargeTimer == this.chargeDuration) {
            
          }
          this.cooldown = this.cooldownDuration;
          let cannonBall = Sup.appendScene("In-Game/Boat/Cannon/Cannon Ball/Prefab")[0];
          cannonBall.getBehavior(CannonBallBehavior).speed *= 0.5 + this.chargeMultiplier * this.chargeTimer*0.01;
          cannonBall.getBehavior(CannonBallBehavior).setup(this.actor.getChild("Cannon Ball Spawn").getPosition(), this.actor.getEulerY() + Math.PI);
        }
        else {
          this.chargeTimer = Math.min( this.chargeDuration, this.chargeTimer + 1 );
          
          
        }
      }
      if (! this.chargeFXActor.spriteRenderer.isAnimationPlaying()) {
        this.chargeFXActor.setLocalScale(new Sup.Math.Vector3(0.01,0.01,0.01));
      }
    
      if (this.attackLaunched && this.chargeFXActor.spriteRenderer.isAnimationPlaying()) {
          this.attackLaunched = false;
      }
      */