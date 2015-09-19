enum CharacterState { Free, Boat, Cannon };

class CharacterBehavior extends Sup.Behavior {
  
  index: number;
  position: Sup.Math.Vector3;
  angle: number;
  speed = 0;
  maxSpeed = 0.5;

  state = CharacterState.Free;

  targetPosition: Sup.Math.Vector3;
  targetAngle: number;

  modelRndr: Sup.ModelRenderer;

  weaponActor: Sup.Actor;
  weaponTween: Sup.Tween;

  interactiveActor: Sup.Actor;
  interactiveY: number;
  interactiveTimer = 0;

  awake() { Game.characterBehaviors.push(this); }
  
  start() {
    this.modelRndr = this.actor.getChild("Model").modelRenderer;
    this.modelRndr.setModel(`In-Game/Characters/Character ${this.index + 1}`);
    this.actor.moveLocal(0, 7, this.index == 0 ? -5 : 5);
    this.position = this.actor.getLocalPosition();
    
    this.weaponActor = this.actor.getChild("Weapon");
    
    this.interactiveActor = this.actor.getChild("Interactive Marker");
    this.interactiveActor.setParent(Game.boatBehavior.actor);
  }

  update() {
    this.movements();
    this.interactions();
  }

  private movements() {
    if (this.state !== CharacterState.Free) {
      if (this.targetPosition != null) {
        this.position.lerp(this.targetPosition, 0.15);
        this.angle = Sup.Math.lerpAngle(this.angle, this.targetAngle, 0.15);
        this.actor.setLocalPosition(this.position);
        this.actor.setLocalEulerY(this.angle);
      }
      
      return;
    }
    
    let targetAngle = Input.getTargetAngle(this.index);
    if (targetAngle != null) {
      this.speed = Sup.Math.lerp(this.speed, this.maxSpeed, 0.15);

      this.angle = targetAngle - Game.boatBehavior.angle;
      this.actor.setLocalEulerY(this.angle);
    } else {
      this.speed = Sup.Math.lerp(this.speed, 0, 0.3);
      if (this.speed < 0.1) this.speed = 0;
    }
    
    if (this.speed > 0) {
      this.position.add(Math.sin(this.angle) * this.speed, 0, Math.cos(this.angle) * this.speed);
      this.position.x = Sup.Math.clamp(this.position.x, -12, 12);
      this.position.z = Sup.Math.clamp(this.position.z, -16, 28);
      this.actor.setLocalPosition(this.position);
    }
    
    if (Input.pressAction2(this.index) && this.weaponTween == null) {
      this.weaponTween = new Sup.Tween(this.weaponActor, { angle: 0 })
        .to({ angle: Math.PI / 2 }, 200)
        .yoyo(true)
        .repeat(1)
        .onUpdate((object) => { this.weaponActor.setLocalEulerZ(object.angle); })
        .onComplete(() => { this.weaponTween = null; })
        .start();
    }
  }

  private interactions() {
    this.interactiveActor.setVisible(false);
    this.interactiveActor.setEulerY(0);
    for (let interaction of Game.interactiveBehaviors) {
      let distance = Math.sqrt(Math.pow(this.position.x - interaction.triggerPosition.x, 2) + Math.pow(this.position.z - interaction.triggerPosition.z, 2));
      if (distance > interaction.distance) continue;
      
      let diff = interaction.position.clone().subtract(this.position);
      let viewAngle = Math.atan2(diff.x, diff.z);
      let diffAngle = Sup.Math.wrapAngle(viewAngle - this.angle);
      if (Math.abs(diffAngle) > Math.PI / 2) continue;

      this.interactiveActor.setVisible(true);
      this.interactiveActor.setLocalPosition(interaction.markerPosition);
      this.interactiveY = interaction.markerPosition.y;

      if (Input.pressAction1(this.index)) interaction.action(this.index);
      break;
    }
    
    this.interactiveTimer += 1;
    this.interactiveActor.setLocalY(this.interactiveY + 0.5 * Math.sin(this.interactiveTimer / 10));
  }

  setState(state: CharacterState) {
    this.state = state;
    if (this.state === CharacterState.Free) {
      this.modelRndr.setColor(0, 0, 1);
      
      // Clear target
      this.targetPosition = null;
      this.targetAngle = null;
    } else {
      this.modelRndr.setColor(1, 0, 0);
    }
  }

  setTarget(position: Sup.Math.Vector3, angle: number) {
    this.targetPosition = position;
    this.targetAngle = angle;
  }
}
Sup.registerBehavior(CharacterBehavior);
