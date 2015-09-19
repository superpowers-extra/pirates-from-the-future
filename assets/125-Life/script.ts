class LifeBehavior extends Sup.Behavior {
  life : number;
  awake() {
    let lifeBar = this.actor.getChild("LifeBar");
    let lifeBarRndr = lifeBar.spriteRenderer
    new Sup.SpriteRenderer(lifeBar, "");
  }

  update() {
    
  }
  
  takeDamage(damage : number){
    if(this.life - damage <= 0){
      this.actor["onDead"]();
    }
    else{
      this.life -= damage;
      this.actualizeLifeBar();
    }
  }

  actualizeLifeBar(){
    
  }
}
Sup.registerBehavior(LifeBehavior);
