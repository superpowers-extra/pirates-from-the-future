class CannonBehavior extends InteractiveBehavior {
  
  cooldown : number;
  cooldownDuration : number;
  
  playerIndex : number;
  
  angleY: number;
  minAngleY: number;
  maxAngleY: number;
  maxRotationSpeed = 0.05;

  distance = 8;

  chargeTimer: number;
  chargeDuration: number;
  chargeMultiplier: number;

  isAttacking : boolean;

  chargeFXActor : Sup.Actor;
  explosionFxActor : Sup.Actor;

  explosionFxScale : Sup.Math.Vector3;

  awake(){
    super.awake();
    this.cooldown = 0;
    this.cooldownDuration = 30;
    
    this.angleY = this.actor.getLocalEulerY();
    this.minAngleY = this.angleY - Math.PI / 2;
    this.maxAngleY = this.angleY + Math.PI / 2;
    
    this.isAttacking = false;

    this.chargeTimer = 0;
    this.chargeDuration = 60;
    this.chargeMultiplier = 1.2;
    
    this.chargeFXActor = new Sup.Actor("Fx Charge", this.actor);
    this.chargeFXActor.setLocalPosition(this.actor.getChild("Cannon Ball Spawn").getLocalPosition());
    
    this.explosionFxActor = this.actor.getChild("Explosion Fx");
    this.explosionFxScale = this.explosionFxActor.getLocalScale();
    this.explosionFxActor.setLocalScale(new Sup.Math.Vector3(0.01,0.01,0.01));

  }

  update(){
    if (!this.isAttacking) this.chargeTimer = Sup.Math.lerp(this.chargeTimer, 0, 0.2);
    let color = 1+(this.chargeTimer/20);
    this.actor.getChild("Model").modelRenderer.setColor(color,color,color);
    
    if (this.cooldown > 0) this.cooldown --;
    if (!this.explosionFxActor.spriteRenderer.isAnimationPlaying())
      this.explosionFxActor.setLocalScale(new Sup.Math.Vector3(0.01));
    if (this.playerIndex == null) return;
      
    // Move player with cannon
    let target = this.actor.getChild("Pilote");
    let targetPosition = target.getLocalPosition().rotate(this.actor.getLocalOrientation());
    targetPosition.add(this.actor.getLocalPosition());
    let characterBehavior = Game.characterBehaviors[this.playerIndex];
    targetPosition.y = characterBehavior.position.y;
    characterBehavior.setTarget(targetPosition, this.actor.getLocalEulerY() + Math.PI);

    let Yrotation = -Input.horizontal(this.playerIndex) * this.maxRotationSpeed;
    this.angleY = Sup.Math.clamp(this.angleY + Yrotation, this.minAngleY, this.maxAngleY);
    this.actor.setLocalEulerY(this.angleY); 

    if (!this.isAttacking) {
      if (Input.keyDownAction2(this.playerIndex) && this.cooldown == 0) {
        this.isAttacking = true;
        this.chargeFXActor = new Sup.Actor("Fx Charge", this.actor);
        this.chargeFXActor.setPosition(this.actor.getChild("Cannon Ball Spawn").getPosition());
        this.chargeFXActor.addBehavior(CannonFxBehavior);
      }
    } else {
      if (Input.wasReleasedAction2(this.playerIndex) && this.cooldown == 0) this.shoot();
      else this.chargeTimer = Math.min(this.chargeDuration, this.chargeTimer + 1);
    }
  }
  
  action(playerIndex: number) {
    if (playerIndex === this.playerIndex) {
      this.playerIndex = null;
      Game.characterBehaviors[playerIndex].setState(CharacterState.Free);
      if (this.isAttacking) this.shoot();
      
    } else if (this.playerIndex == null) {
      this.playerIndex = playerIndex;
      Game.characterBehaviors[playerIndex].setState(CharacterState.Cannon);
    }
  }

  shoot() {
    Sup.Audio.playSound("In-Game/Boat/Cannon/Shoot", 0.8, { loop: false, pitch : -1+(Math.random()/2)});
    this.explosionFxActor.spriteRenderer.setAnimation("Explosion", false);
    this.explosionFxActor.setLocalScale(new Sup.Math.Vector3(1.5, 1.5, 1.5));
    
    this.chargeFXActor.destroy();
    this.isAttacking = false;
    this.cooldown = this.cooldownDuration;
    let cannonBall = Sup.appendScene("In-Game/Boat/Cannon/Cannon Ball/Prefab")[0];
    let behavior = cannonBall.getBehavior(CannonBallBehavior);
    behavior.senderActor = Game.boatBehavior.actor;
    // Charge Max ball
    if (this.chargeTimer == this.chargeDuration) {
      cannonBall.modelRenderer.setModel("In-Game/Boat/Cannon/Fx Purple");
      behavior.size = 6;
      behavior.damageValue = 30;
    }
    behavior.speed *= 0.5 + this.chargeMultiplier * this.chargeTimer*0.01;
    behavior.setup(this.actor.getChild("Cannon Ball Spawn").getPosition(), this.actor.getEulerY() + Math.PI);
  }
}
Sup.registerBehavior(CannonBehavior);