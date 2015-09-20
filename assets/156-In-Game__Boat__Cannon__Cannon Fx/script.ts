class CannonFxBehavior extends Sup.Behavior {
  
  time : number;
  timeDuration : number;

  initialScale : Sup.Math.Vector3;
  finalScale : Sup.Math.Vector3;

  animCompleted : boolean;

  addScaleValue : number;

  state : boolean;
  
  awake() {
    this.state = true;
    
    this.time = 0;
    this.timeDuration = 60;
    
    this.animCompleted = false;
    this.finalScale = new Sup.Math.Vector3(1.3, 1.3, 1.3);
    
    this.initialScale = new Sup.Math.Vector3(0.2, 0.2, 0.2);
    this.actor.setLocalScale(this.initialScale);
    
    this.addScaleValue = (this.finalScale.x - this.actor.getLocalScale().x) / this.timeDuration;
    
    this.actor.modelRenderer = new Sup.ModelRenderer(this.actor, Sup.get("In-Game/Boat/Cannon/Fx Yellow", Sup.Model));
        
  }

  update() {
    this.time ++;
    if(this.time == this.timeDuration){
      this.animCompleted = true;
    }
    
    
    if (this.state){
      this.state = false;
      this.actor.modelRenderer.setModel( Sup.get("In-Game/Boat/Cannon/Fx Yellow", Sup.Model));
    } else {
      this.state = true;
      this.actor.modelRenderer.setModel( Sup.get("In-Game/Boat/Cannon/Fx Purple", Sup.Model));
    }
    
    
    let scale : Sup.Math.Vector3;
    if (this.animCompleted){
      let value = 0.41*Math.sin(this.time * Math.PI/10);
        scale = this.finalScale.clone().add(value, value, value);
    } else {
      scale = this.actor.getLocalScale().clone().add(this.addScaleValue, this.addScaleValue, this.addScaleValue);
    }
      
     this.actor.setLocalScale(scale);
  }
}
Sup.registerBehavior(CannonFxBehavior);
