enum CharacterState { Free, Boat, Canon };

class CharacterBehavior extends Sup.Behavior {
  
  index: number;
  position: Sup.Math.Vector3;
  angle: number;

  state = CharacterState.Free;

  modelRndr: Sup.ModelRenderer;

  interactiveActor: Sup.Actor;
  interactiveY: number;
  interactiveTimer = 0;

  awake() { Game.characterBehaviors.push(this); }
  
  start() {
    this.modelRndr = this.actor.getChild("Model").modelRenderer;
    this.modelRndr.setModel(`In-Game/Characters/Character ${this.index + 1}`);
    this.actor.moveLocal(0, 12, this.index == 0 ? -5 : 5);
    this.position = this.actor.getLocalPosition();
    
    this.interactiveActor = this.actor.getChild("Interactive Marker");
    this.interactiveActor.setParent(Game.boatBehavior.actor);
  }

  update() {
    this.movements();
    this.interactions();
  }

  private movements() {
    if (this.state !== CharacterState.Free) return;
    
    let targetAngle = Input.getTargetAngle(this.index);
    if (targetAngle != null) {
      let globalAngle = targetAngle - Game.boatBehavior.angle;

      const speed = 0.5;
      this.position.add(Math.sin(globalAngle) * speed, 0, Math.cos(globalAngle) * speed);
      this.actor.setLocalPosition(this.position);
      
      this.angle = globalAngle;
      this.actor.setLocalEulerY(this.angle);
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
      if (Math.abs(diffAngle) > Math.PI / 6) continue;

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
    if (this.state === CharacterState.Free) this.modelRndr.setColor(0, 0, 1);
    else this.modelRndr.setColor(1, 0, 0);
  }
}
Sup.registerBehavior(CharacterBehavior);
