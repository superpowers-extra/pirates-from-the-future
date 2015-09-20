class WorldMapBehavior extends Sup.Behavior {
  shipMarker: Sup.Actor;
  static mapSize = 3;
  
  awake() {
    //this.map = this.actor.tileMapRenderer.getTileMap();
    this.shipMarker = this.actor.getChild("Ship");
  }

  start() {
    for (let x = 0; x < Game.settings.mapSize; x++) {
      for (let z = 0; z < Game.settings.mapSize; z++) {
        let chunk = Game.map[x][z];
        if (chunk.type === "island") {
          let islandActor = new Sup.Actor("Island", this.actor);
          let islandX = (x - Game.settings.mapSize / 2 + 0.5) * WorldMapBehavior.mapSize / Game.settings.mapSize;
          let islandY = (z - Game.settings.mapSize / 2 + 0.5) * WorldMapBehavior.mapSize / Game.settings.mapSize;;
          islandActor.setLocalPosition(islandX, islandY, 0.5);
          islandActor.setLocalScale(0.5, 0.5, 0.5);
          let spritePath = `In-Game/HUD/World Map/Icons/`;
          if (chunk.name.charAt(0) == 'R')
            spritePath += `Rock`;
          else
            spritePath += `Island ${Sup.Math.Random.integer(1, 2)}`;

          new Sup.SpriteRenderer(islandActor, spritePath);
        }
      }
    }
  }

  update() {
    this.shipMarker.setEulerZ(Game.boatBehavior.angle - Math.PI / 2);
    let x = Game.boatBehavior.position.x / Game.settings.chunkSize - Game.boatBehavior.chunkOffset.x;
    this.shipMarker.setLocalX(x * WorldMapBehavior.mapSize / Game.settings.mapSize);
    let y = -Game.boatBehavior.position.z / Game.settings.chunkSize + Game.boatBehavior.chunkOffset.z;
    this.shipMarker.setLocalY(y * WorldMapBehavior.mapSize / Game.settings.mapSize);
  }
}
Sup.registerBehavior(WorldMapBehavior);
