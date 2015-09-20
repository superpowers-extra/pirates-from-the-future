class PirateBehavior extends Sup.Behavior {
  private position: Sup.Math.Vector3;
  private modelRndr: Sup.ModelRenderer;

  private isAttacking = false;
  private hasStruck = false;

  attackCooldownTimer = 0;
  static attackCooldownDelay = 20;

  static attackRange = 5;
  private speed : number = 0.15;

  waitTimer = 2 * 60;

  awake() {
    this.actor["onDead"] = this.onDead.bind(this);
    
    this.modelRndr = this.actor.getChild("Model").modelRenderer;
  }

  start() {
    this.position = this.actor.getLocalPosition();
  }
  
  onDead() {
    this.actor.destroy();
  }

  update() {
    if (this.waitTimer > 0) {
      this.waitTimer -= 1;
      return;
    }
    
    // Find target
    let target: CharacterBehavior;
    let targetDistance = Infinity;
    for(let player of Game.characterBehaviors) {
      if (player.dead) continue;

      let distance = this.position.distanceTo(player.position);
      if(distance < targetDistance){
        targetDistance = distance;
        target = player;
      }
    }
    
    if (target == null) {
      this.modelRndr.setAnimation("Idle");
      
    } else if (targetDistance >= PirateBehavior.attackRange) {
      this.modelRndr.setAnimation("Walk");
      
      let direction = target.position.clone().subtract(this.position);
      direction.y = 0;
      let angle = Math.atan2(direction.x, direction.z);
      this.actor.setLocalEulerY(angle);
      this.position.add(direction.normalize().multiplyScalar(this.speed));
      
      let offset = new Sup.Math.Vector3(Math.sin(angle) * this.speed, 0, Math.cos(angle) * this.speed);
      
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
      
    } else if (this.isAttacking) {
      if (!this.modelRndr.isAnimationPlaying()) {
        this.isAttacking = false;
        this.attackCooldownTimer = PirateBehavior.attackCooldownDelay;
      } else if (!this.hasStruck && this.modelRndr.getAnimationTime() / this.modelRndr.getAnimationDuration() > 0.5) {
        this.hasStruck = true;
        if (targetDistance < PirateBehavior.attackRange) target.actor.getBehavior(DamageableBehavior).takeDamage(5);
      }
      
    } else if (this.attackCooldownTimer > 0) {
      this.attackCooldownTimer -= 1;
      this.modelRndr.setAnimation("Idle");
      
    } else {
      // Launch attack
      this.isAttacking = true;
      this.hasStruck = false;
      this.modelRndr.setAnimation("Attack", false);
    }
  }
}
Sup.registerBehavior(PirateBehavior);
