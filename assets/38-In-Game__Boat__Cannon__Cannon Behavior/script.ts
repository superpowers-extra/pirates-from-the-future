class CannonBehavior extends InteractiveBehavior {
  
  cooldown : number;
  cooldownDuration : number;
  
  playerIndex : number;
  
  angleY: number;
  minAngleY: number;
  maxAngleX: number;
  maxRotationSpeed = 0.1;

  awake(){
    super.awake();
    this.cooldown = 0;
    this.cooldownDuration = 20;
    
    this.angleY = this.actor.getLocalEulerY();
    this.minAngleY = this.angleY - Math.PI / 4;
    this.maxAngleX = this.angleY + Math.PI / 4;
    
  }

  update(){
    if (this.cooldown > 0){
      this.cooldown --;
    }
    
    
    if (this.playerIndex != null) {
      if (Input.pressAction2(this.playerIndex)){
        if (this.cooldown == 0){
          let cannonBall = Sup.appendScene("In-Game/Boat/Cannon/Cannon Ball/Prefab")[0];
          cannonBall.getBehavior(CannonBallBehavior).setup(this.actor.getChild("Cannon Ball Spawn").getPosition(), this.actor.getEulerY() + Math.PI);
          this.cooldown = this.cooldownDuration;
        }
      }

      let Yrotation = -Input.horizontal(this.playerIndex) * this.maxRotationSpeed;
      this.angleY = Sup.Math.clamp(this.angleY + Yrotation, this.minAngleY, this.maxAngleX);
      this.actor.setLocalEulerY(this.angleY);

      let Xrotation = -Input.vertical(this.playerIndex) * this.maxRotationSpeed;
      this.angleY = Sup.Math.clamp(this.angleY + Xrotation, this.minAngleY, this.maxAngleX);
      this.actor.setLocalEulerY(this.angleY);

    }
  }
  
  action(playerIndex: number) {
    this.control(playerIndex);
  }

  control(index: number) {
    if (index === this.playerIndex){
      this.playerIndex = null;
      Game.characterBehaviors[index].setState(CharacterState.Free);
    }
    else if (this.playerIndex == null) {
      this.playerIndex = index;
      Game.characterBehaviors[index].setState(CharacterState.Cannon);
    }
  }
}
Sup.registerBehavior(CannonBehavior);