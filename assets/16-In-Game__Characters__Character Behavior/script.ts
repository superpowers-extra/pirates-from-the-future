enum CharacterState { Free, Boat, Cannon };

class CharacterBehavior extends Sup.Behavior {
  static radius = 1.8;

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
  weaponRange = 5;

  interactiveActor: Sup.Actor;
  interactiveY: number;
  interactiveTimer = 0;

  hasStruck = false;

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
    
    // DEBUG
    //if (Sup.Input.wasKeyJustPressed("U")) Sup.log(this.position);
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
      let offset = new Sup.Math.Vector3(Math.sin(this.angle) * this.speed, 0, Math.cos(this.angle) * this.speed);
      
      const stairsLeftX = -4.8;
      const stairsRightX = 4.8;
      
      const stairsEndZ = -5.2;
      const stairsStartZ = 1.2;
      
      const stairsLowY = 7.1;
      const stairsHighY = 8.55;
      
      if (offset.z != 0) {
        if (this.position.x > stairsLeftX && this.position.x < stairsRightX) {
          if (offset.z < 0 && this.position.z > stairsEndZ) {
            offset.z = Math.max(offset.z, stairsEndZ - this.position.z + CharacterBehavior.radius);
          } /*else if (offset.z > 0 && this.position.z < stairsEndZ) {
            offset.z = Math.min(offset.z, stairsEndZ - this.position.z - CharacterBehavior.radius);
          }*/
        }
      }
      
      if (this.position.z < stairsStartZ) {
        if ((this.position.x <= stairsLeftX || this.position.x >= stairsRightX)) {
          this.position.y = Sup.Math.lerp(stairsLowY, stairsHighY, Math.min(1, (this.position.z - stairsStartZ) / (stairsEndZ - stairsStartZ)));
        } else if (this.position.z > stairsEndZ) {
          this.position.y -= Math.min(0.4, this.position.y - stairsLowY);
        }
      }
      
      this.position.add(offset);
      
      // Boat borders
      this.position.x = Sup.Math.clamp(this.position.x, -11, 11);
      this.position.z = Sup.Math.clamp(this.position.z, -14, 26);
      
      if (this.position.z < -1) {
        let diff = this.position.clone().subtract(0, 0, -1);
        diff.y = 0;
        let penetration = diff.length() - 14;
        if (penetration > 0) this.position.add(diff.normalize().multiplyScalar(-penetration));
      }
      
      else if (this.position.z > 12) {
        let diff = this.position.clone().subtract(0, 0, 12);
        diff.y = 0;
        let penetration = diff.length() - 14;
        if (penetration > 0) this.position.add(diff.normalize().multiplyScalar(-penetration));
      }

      // Collision
      for (let collider of Game.onboardCircleColliders) {
        colliderPosition.copy(collider.position).y = this.position.y;

        let diff = colliderPosition.subtract(this.position);
        let penetration = (collider.radius + CharacterBehavior.radius) - diff.length();
        if (penetration > 0) this.position.add(diff.normalize().multiplyScalar(-penetration));
      }

      this.actor.setLocalPosition(this.position);
    }
    
    // Attack
    if (Input.pressAction2(this.index) && this.weaponTween == null) {
      this.hasStruck = false;
      
      this.weaponTween = new Sup.Tween(this.weaponActor, { angle: 0, progress: 0 })
        .to({ angle: Math.PI / 2, progress: 1 }, 200)
        .yoyo(true)
        .repeat(1)
        .onUpdate((object) => {
          this.weaponActor.setLocalEulerZ(object.angle);
          
          if (object.progress > 0.5 && !this.hasStruck) {
            this.hasStruck = true;
            this.dealDamage();
          }
        
        }).onComplete(() => { this.weaponTween = null; })
        .start();
    }
  }

  private dealDamage() {
    for (let damageable of Game.onboardDamageables) {
      let diff = damageable.actor.getLocalPosition().subtract(this.position);
      let angle = Math.atan2(diff.x, diff.z);
      
      if (diff.length() < damageable.radius + this.weaponRange && Math.abs(Sup.Math.wrapAngle(angle - this.angle)) < Math.PI / 3) {
        damageable.takeDamage(10);
      }
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
