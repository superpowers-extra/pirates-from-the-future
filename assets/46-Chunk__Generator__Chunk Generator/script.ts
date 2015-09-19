class ChunkGeneratorBehavior {
  private chunkStart;
  private chunkIsland;
  private chunkSea;
  private chunkMonsterIsland;
  private chunkWidth  : number = 50;
  private chunkHeight : number = 50;

  constructor() {
    
    this.chunkStart = Sup.get("Chunk/Scenes Prefab/Islands/Start", Sup.Scene);
    this.chunkIsland = {
      1 : {
        prefab : Sup.get("Chunk/Scenes Prefab/Islands", Sup.Scene),
        connection : {
          1 : "Chunk/Scenes Prefab/Sea",
          2 : "Chunk/Scenes Prefab/Sea"
        }
      },
      2 : {
        prefab : Sup.get("Chunk/Scenes Prefab/Islands", Sup.Scene),
        connection : {
          1 : "Chunk/Scenes Prefab/Sea",
          2 : "Chunk/Scenes Prefab/Sea"
        }
      },
      3 : {
        prefab : Sup.get("Chunk/Scenes Prefab/Islands", Sup.Scene),
        connection : {
          1 : "Chunk/Scenes Prefab/Sea",
          2 : "Chunk/Scenes Prefab/Sea"
        }
      }
    };
    
    
    this.chunkSea = {
      1 : {
        prefab : Sup.get("Chunk/Scenes Prefab/Sea", Sup.Scene),
        connection : {
          1 : "Chunk/Scenes Prefab/Islands",
          2 : "Chunk/Scenes Prefab/Islands"
        }
      },
      2 : {
        prefab : Sup.get("Chunk/Scenes Prefab/Sea", Sup.Scene),
        connection : {
          1 : "Chunk/Scenes Prefab/Islands",
          2 : "Chunk/Scenes Prefab/Islands"
        }
      },
      3 : {
        prefab : Sup.get("Chunk/Scenes Prefab/Sea", Sup.Scene),
        connection : {
          1 : "Chunk/Scenes Prefab/Islands",
          2 : "Chunk/Scenes Prefab/Islands"
        }
      }
    };
    
    this.chunkMonsterIsland = {
      1 : Sup.get("Chunk/Scenes Prefab/MonsterIslands", Sup.Scene),
      2 : Sup.get("Chunk/Scenes Prefab/MonsterIslands", Sup.Scene),
      3 : Sup.get("Chunk/Scenes Prefab/MonsterIslands", Sup.Scene),
      4 : Sup.get("Chunk/Scenes Prefab/MonsterIslands", Sup.Scene)      
    };
  }
  
  generate() {
    // Création du chunk de départ
    Sup.appendScene(this.chunkStart, new Sup.Actor("Chunk_1_1"));
    for(let x =1; x <10; x++)
      for(let y =1; y <10; y++){
        let chunkActor = new Sup.Actor("Chunk_"+x+1 +"_"+y+1);
        
      }
    
  }
  
  
}