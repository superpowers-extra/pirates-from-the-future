class WaveAIManagerBehavior extends Sup.Behavior {
  private cooldown : number = 60;
  private timer : number = 0;

  // avoir dans le game tout les point de spawn possible sur la map des bark,
  // ensuite faire spawn au point le plus près

  awake() {
    
  }

  update() {
    if(this.timer == this.cooldown){
      this.spawnBark(2);
      this.timer++;
    }else{
      this.timer++;
    }
  }
  spawnBark( nbEnemies : number ){
    Sup.appendScene("Wave AI Prefab", new Sup.Actor("BarkEnemies")/*.setPosition(new Sup.Math.Vector3(0,0,0))*/);
  }
}
Sup.registerBehavior(WaveAIManagerBehavior);
