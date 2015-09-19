class ChunkBehavior extends Sup.Behavior {
  awake() {
    //let generator = new ChunkGenerator();
    //generator.generate();
    
    //let chunkActor = new Sup.Actor("Chunk_");
    //chunkActor.setPosition( new Sup.Math.Vector3(0, 0, 0) );

    //Sup.appendScene(Sup.get("Chunk/Scenes Prefab/Sea/Blue Prefab", Sup.Scene), chunkActor);
  }

  update() {
    
  }
}
Sup.registerBehavior(ChunkBehavior);
