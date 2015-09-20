enum OctopusState {
  Hidden,
  Rising,
  RiseIdleTentacles,
  Idle,
  PrepareAttack,
  Tentacles,
  Slash,
  Spooked,
  Sinking
}

class OctopusBehavior extends Sup.Behavior {
  
  private state = OctopusState.Hidden;

  private modelActor: Sup.Actor;
  private hiddenY: number;
  static risenY = 85;
  static risingDuration = 60 * 3;
  private hasJustRisen = true;

  private seaLineActor: Sup.Actor;
  private hiddenSeaLineScale: number;
  static risenSeaLineScale = 15;

  private eyeActors: Sup.Actor[] = [];

  private timer: number;

  static riseIdleTentaclesDuration = 60;

  private idleTentaclesActor: Sup.Actor;
  static prepareDuration = 60;
  private idleTentaclesHiddenY: number;
  static idleTentaclesY = -85;

  private aliveTentacles = 2;
  
  awake() {
    Game.octopusBehavior = this;
    this.actor["onDamaged"] = this.onDamaged.bind(this);
    this.actor["onHardHit"] = this.goRising.bind(this);
    
    this.modelActor = this.actor.getChild("Model");
    this.hiddenY = this.modelActor.getLocalY();
    
    this.seaLineActor = this.actor.getParent().getChild("Sea Line");
    this.hiddenSeaLineScale = this.seaLineActor.getLocalScale().x;
    
    this.eyeActors.push(this.modelActor.getChild("Left Eye"));
    this.eyeActors.push(this.modelActor.getChild("Right Eye"));
    
    this.idleTentaclesActor = this.modelActor.getChild("Idle Tentacles");
    this.idleTentaclesHiddenY = this.idleTentaclesActor.getLocalY();
  }
  
  update() {
    switch (this.state) {
        
      case OctopusState.Sinking: {
        this.timer--;
        
        let progress = 1 - this.timer / OctopusBehavior.risingDuration;
        let y = Sup.Math.lerp(OctopusBehavior.risenY, this.hiddenY, progress);
        this.modelActor.setLocalY(y);

        if (this.timer <= 0) {
          this.state = OctopusState.Hidden;
        }
        break;
      }
        
      case OctopusState.Rising: {
        Game.cameraBehavior.shake(1, 1);
        this.timer--;
        
        let progress = 1 - this.timer / OctopusBehavior.risingDuration;
        
        if (this.timer === OctopusBehavior.risingDuration - 15) Game.boatBehavior.freeze();
        if (progress >= 1) this.goRiseIdleTentacles();
        
        let y = Sup.Math.lerp(this.hiddenY, OctopusBehavior.risenY, progress);
        this.modelActor.setLocalY(y);
        
        let scale = Sup.Math.lerp(this.hiddenSeaLineScale, OctopusBehavior.risenSeaLineScale, progress);
        this.seaLineActor.setLocalScale(scale, scale, scale);
        break;
      }
        
      case OctopusState.RiseIdleTentacles: {
        this.timer--;
        
        let progress = 1 - this.timer / OctopusBehavior.riseIdleTentaclesDuration;
        let y = Sup.Math.lerp(this.idleTentaclesHiddenY, OctopusBehavior.idleTentaclesY, progress);
        this.idleTentaclesActor.setLocalY(y);
        
        if (this.timer <= 0) {
          if (this.hasJustRisen) {
            this.hasJustRisen = false;
            Game.cameraBehavior.trackBoss(false);
            Game.boatBehavior.unfreeze();
          }
          this.goIdle();
        }
        break;
      }
      
      case OctopusState.Idle: {
        this.timer--;
        if (this.timer <= 0) this.goPrepareAttack(); 
        break;
      }
      
      case OctopusState.PrepareAttack: {
        this.timer--;
        
        let progress = 1 - this.timer / OctopusBehavior.prepareDuration;
        let y = Sup.Math.lerp(OctopusBehavior.idleTentaclesY, this.idleTentaclesHiddenY, progress);
        this.idleTentaclesActor.setLocalY(y);
        
        if (this.timer <= 0) {
          if (this.resetIfTooFar()) return;
          
          /*if (Sup.Math.Random.integer(0, 1) === 0) */this.goTentacles();
          //else this.goSlash();
        }
        break;
      }
    }
  }

  resetIfTooFar() {
    let pos = Game.boatBehavior.position.clone().add(Game.boatBehavior.chunkOffset.x * Game.settings.chunkSize, 0, Game.boatBehavior.chunkOffset.z * Game.settings.chunkSize);
    pos.y = 0;
    if (pos.length() > 150) {
      this.state = OctopusState.Sinking;
      Game.cameraBehavior.trackBoss(false);
      this.idleTentaclesActor.setLocalY(this.idleTentaclesHiddenY);
      return true;
    }
    return false;
  }

  onDamaged() {
    if (this.state === OctopusState.Hidden) this.goRising();
    else {
      // TODO: State.Stun & tout
    }
  }

  goRising() {
    if (this.state !== OctopusState.Hidden) return;
    
    this.hasJustRisen = true;
    
    this.state = OctopusState.Rising;
    this.timer = OctopusBehavior.risingDuration;
    
    Game.cameraBehavior.trackBoss(true);
  }

  goRiseIdleTentacles() {
    this.state = OctopusState.RiseIdleTentacles;
    this.timer = OctopusBehavior.riseIdleTentaclesDuration;
  }

  goIdle() {
    this.state = OctopusState.Idle;
    this.timer = Sup.Math.Random.integer(120, 240);
  }

  goPrepareAttack() {
    this.state = OctopusState.PrepareAttack;
    this.timer = OctopusBehavior.prepareDuration;
  }

  goTentacles() {
    this.state = OctopusState.Tentacles;
    this.aliveTentacles = 2;
    
    let leftTentacle = Sup.appendScene("In-Game/Boat Tentacle/Prefab", Game.boatBehavior.actor)[0];
    leftTentacle.setLocalPosition(54 - 42, 6, 8);
    leftTentacle.setLocalEulerY(-Math.PI / 2);
    
    let rightTentacle = Sup.appendScene("In-Game/Boat Tentacle/Prefab", Game.boatBehavior.actor)[0];
    rightTentacle.setLocalPosition(-54 + 42, 6, 12);
    rightTentacle.setLocalEulerY(Math.PI / 2);
    
    Game.boatBehavior.freeze();
  }

  onTentacleDead() {
    this.aliveTentacles--;
    
    if (this.aliveTentacles === 0) {
      Game.boatBehavior.unfreeze();
      this.goRiseIdleTentacles();
    }
  }

  goSlash() {
    this.state = OctopusState.Slash;
  }
}
Sup.registerBehavior(OctopusBehavior);
