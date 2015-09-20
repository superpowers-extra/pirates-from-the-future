function generateWorld() {
  Game.map = [];
  for (let x = 0; x < Game.settings.mapSize; x++) {
    Game.map[x] = [];
    for (let z = 0; z < Game.settings.mapSize; z++) {
      Game.map[x][z] = { x, z, type: "sea", name: "" };
    }
  }
  
  let chunkRegion: Chunk[][] = [];
  // Around regions
  for (let i = 1; i <= 9; i += 2) {
    let region1 = [];
    for (let j = 1; j < 5; j++) region1.push(Game.map[i][j], Game.map[i + 1][j]);
    chunkRegion.push(region1);
    
    let region2 = [];
    for (let j = 7; j < 11; j++) region2.push(Game.map[i][j], Game.map[i + 1][j]);
    chunkRegion.push(region2);
  }
  // Central regions
  let centralRegion1 = [];
  for (let i = 1; i < 5; i++) centralRegion1.push(Game.map[i][5], Game.map[i][6]);
  chunkRegion.push(centralRegion1);
  let centralRegion2 = [];
  for (let i = 7; i < 11; i++) centralRegion2.push(Game.map[i][5], Game.map[i][6]);
  chunkRegion.push(centralRegion2);
  
  // Randomly pick an island by region
  let islandPrefabs = Sup.get("In-Game/Chunks/Islands", Sup.Folder).children;
  for (let i = 0; i < 12; i++) {
    let chunk = chunkRegion[i][Sup.Math.Random.integer(0, 7)];
    chunk.type = "island";
    chunk.name = Sup.Math.Random.sample(islandPrefabs);
  }
  
  Game.chunkActors = [];
  for (let x = 0; x < Game.settings.mapSize; x++) {
    for (let z = 0; z < Game.settings.mapSize; z++) {
      let chunk = Game.map[x][z];
      if (chunk.type === "sea") continue;
      
      let rootActor = Sup.appendScene(`In-Game/Chunks/Islands/${chunk.name}/Prefab`)[0];
      let worldX = (chunk.x - Game.settings.mapSize / 2 + 0.5) * Game.settings.chunkSize;
      let worldZ = -(chunk.z - Game.settings.mapSize / 2 + 0.5) * Game.settings.chunkSize;
      rootActor.setPosition(new Sup.Math.Vector3(worldX, 0, worldZ));
      Game.chunkActors.push(rootActor);
    }
  }
  
  // Spawn the monster
  let monsterActor = Sup.appendScene("In-Game/Chunks/Monster/Prefab")[0];
  monsterActor.setPosition(new Sup.Math.Vector3(0, 0, 0));
  Game.chunkActors.push(monsterActor);
  
  let startPosition: Sup.Math.Vector3;
  while (startPosition == null) {
    let x = Sup.Math.Random.integer(0, Game.settings.mapSize - 1);
    let z = Sup.Math.Random.integer(0, Game.settings.mapSize - 1);
    
    let chunk = Game.map[x][z];
    if (chunk.type !== "sea") continue;
    
    let worldX = (x - Game.settings.mapSize / 2 + 0.5) * Game.settings.chunkSize;
    let worldZ = (z - Game.settings.mapSize / 2 + 0.5) * Game.settings.chunkSize;
    
    let distance = Math.sqrt(worldX * worldX + worldZ * worldZ);
    if (distance < 500) continue;
    
    startPosition = new Sup.Math.Vector3(worldX, 0, worldZ);
  }
  return startPosition;
}
