class BoatBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  angle: number;

  playerIndex: number;

  private moveSpeed = 0;
  static rotateMoveSpeed = 0.3;
  static maxMoveSpeed = 0.5;

  private rotateSpeed = 0;
  static minRotateSpeed = 0.002;
  static maxRotateSpeed = 0.015;
  static breakAngleOffset = 0.2;

  wheelPosition: Sup.Math.Vector3;
  
  awake() {
    Game.boatBehavior = this;
    this.position = this.actor.getLocalPosition();
    this.angle = this.actor.getLocalEulerY();
    
    this.wheelPosition = this.actor.getChild("Wheel").getLocalPosition();
    this.wheelPosition.z -= 3;
  }

  update() {
    let targetMoveSpeed = 0;
    
    if (this.playerIndex != null) {
      let targetAngle = Input.getTargetAngle(this.playerIndex);
      if (targetAngle != null) {
        let angleOffset = Sup.Math.wrapAngle(targetAngle - this.angle);

        if (Math.abs(angleOffset) < BoatBehavior.breakAngleOffset) {
          targetMoveSpeed = BoatBehavior.maxMoveSpeed;

          this.rotateSpeed = Sup.Math.lerp(this.rotateSpeed, BoatBehavior.minRotateSpeed, 0.1);
          if (Math.abs(angleOffset) > this.rotateSpeed) this.angle += angleOffset / Math.abs(angleOffset) * this.rotateSpeed;
          else this.angle = targetAngle;

        } else {
          targetMoveSpeed = BoatBehavior.rotateMoveSpeed;

          this.rotateSpeed = Sup.Math.lerp(this.rotateSpeed, BoatBehavior.maxRotateSpeed, 0.05);
          this.angle += angleOffset / Math.abs(angleOffset) * this.rotateSpeed;
        }
        this.actor.setEulerY(this.angle);

      } else this.rotateSpeed = 0;
    }
    
    this.moveSpeed = Sup.Math.lerp(this.moveSpeed, targetMoveSpeed, 0.05);
    this.position.add(this.moveSpeed * Math.sin(this.angle), 0, this.moveSpeed * Math.cos(this.angle));
    this.actor.setLocalPosition(this.position);
  }

  control(index: number) {
    if (index === this.playerIndex) this.playerIndex = null;
    else if (this.playerIndex == null) this.playerIndex = index;
  }
}
Sup.registerBehavior(BoatBehavior);
