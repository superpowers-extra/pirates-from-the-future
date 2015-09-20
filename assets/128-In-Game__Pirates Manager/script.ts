class PiratesManagerBehavior extends Sup.Behavior {
  private timer: number = 0;
  static spawnDelay = 60 * 60;

  awake() {
    this.timer = 20;
  }

  update() {
    if (Game.octopusBehavior.state !== OctopusState.Hidden) return;
    
    this.timer--;
    if (this.timer === 0) {
      this.timer = PiratesManagerBehavior.spawnDelay;
      
      let position: Sup.Math.Vector3;
      while (position == null) {
        let x = Sup.Math.Random.integer(0, Game.settings.mapSize - 1);
        let z = Sup.Math.Random.integer(0, Game.settings.mapSize - 1);
        let chunk = Game.map[x][z];
        if (chunk.type === "sea")
          position = new Sup.Math.Vector3((x - Game.settings.mapSize / 2 + 0.5) * Game.settings.chunkSize, 0, (z - Game.settings.mapSize / 2 + 0.5) * Game.settings.chunkSize);
          position.add(Game.boatBehavior.chunkOffset.x * Game.settings.chunkSize, 0, Game.boatBehavior.chunkOffset.z * Game.settings.chunkSize);
      }
      let pirateBoatActor = Sup.appendScene("In-Game/Pirate Boat/Prefab")[0];
      pirateBoatActor.setPosition(position);
    }
  }
}
Sup.registerBehavior(PiratesManagerBehavior);
