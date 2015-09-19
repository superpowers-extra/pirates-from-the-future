interface Chunk {
  x: number; z: number;
  type: string;
  index: number;
}

namespace Game {
  export let settings = {
    mapSize: 12,
    chunkSize: 200
  }
  
  export let cameraBehavior: CameraBehavior;
  export let boatBehavior: BoatBehavior;
  
  export let characterBehaviors: CharacterBehavior[];
  export let interactiveBehaviors: InteractiveBehavior[]; 
  
  export let map: Chunk[][];
  export let chunkActors: Sup.Actor[];
  export let circleColliders: CircleColliderBehavior[];
  
  export function start() {
    characterBehaviors = [];
    interactiveBehaviors = [];
    circleColliders = [];

    Sup.loadScene("In-Game/Scene");
    let startPosition = generateWorld();
    boatBehavior.setPosition(startPosition);
    
    for (let i = 0; i < 2; i++) {
      let character = Sup.appendScene("In-Game/Characters/Prefab", boatBehavior.actor)[0];
      character.getBehavior(CharacterBehavior).index = i;
    }
  }
}
