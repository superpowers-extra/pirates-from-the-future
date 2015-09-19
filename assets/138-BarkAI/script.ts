class BarkAIBehavior extends Sup.Behavior {
  private boat : Sup.Actor;
  private boatPos : Sup.Math.Vector3;
  private isCloseAt : number = 10;

  speed = 0.2;

  awake(){
    this.boat = Game.boatBehavior.actor;
  }

  update(){
    this.boatPos = Game.boatBehavior.position//this.boat.getPosition();
    let pos = this.actor.getPosition();
    let distance = pos.clone().distanceTo(this.boatPos);
    
    //Sup.log(pos);
    if( distance <= this.isCloseAt){
      //destroy l'objet bark et faire des nouveaux acteurs
      this.actor.destroy();
    }
    else{
      // regarder le bateau de nos joueurs et s'en raproche
      let boatPosFromBark = new Sup.Math.Vector3(this.boatPos.x, 0, this.boatPos.z).subtract( new Sup.Math.Vector3(pos.x, 0 , pos.z )).normalize();
      
      this.actor.lookTowards(boatPosFromBark);
      this.actor.move(boatPosFromBark.x * this.speed, 0, boatPosFromBark.z * this.speed);
    }
  }

  SpawnAI(){
    
  }
}
Sup.registerBehavior(BarkAIBehavior);
