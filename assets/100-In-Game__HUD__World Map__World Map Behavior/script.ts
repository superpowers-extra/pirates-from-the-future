class WorldMapBehavior extends Sup.Behavior {
  map: Sup.TileMap;
  marker: Sup.Actor;
  
  awake() {
    this.map = this.actor.tileMapRenderer.getTileMap();
    this.marker = this.actor.getChild("Marker");
  }

  start() {
    
    for (let x = 0; x < Game.settings.mapSize; x++) {
      for (let z = 0; z < Game.settings.mapSize; z++) {
        let chunk = Game.map[x][z];
        
        switch (chunk.type) {
          case "sea":
            this.map.setTileAt(0, x, z, 0);
            break;
          case "island":
            this.map.setTileAt(0, x, z, chunk.index === 0 ? 1 : 2);
            break;
        }
      }
    }
  }

  update() {
    this.marker.setEulerZ(Game.boatBehavior.angle - Math.PI / 2);
    this.marker.setLocalX( Game.boatBehavior.position.x / Game.settings.chunkSize - Game.boatBehavior.offset.x + Game.settings.mapSize / 2 - 0);
    this.marker.setLocalY(-Game.boatBehavior.position.z / Game.settings.chunkSize + Game.boatBehavior.offset.z + Game.settings.mapSize / 2 - 0);
  }
}
Sup.registerBehavior(WorldMapBehavior);