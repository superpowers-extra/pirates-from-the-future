interface Chunk {
  x: number; z: number;
  type: string;
  name: string;
}

namespace Game {
  export let settings = {
    mapSize: 12,
    chunkSize: 200
  }
  
  // Test Metylene afficher Menu           DEBUG
  export let started: boolean = false;
  export let firstGame: boolean = true;
  
  export let cameraBehavior: CameraBehavior;
  export let boatBehavior: BoatBehavior;
  export let octopusBehavior: OctopusBehavior;
  
  export let characterBehaviors: CharacterBehavior[];
  export let interactiveBehaviors: InteractiveBehavior[]; 
  
  export let map: Chunk[][];
  export let chunkActors: Sup.Actor[];
  export let circleColliders: CircleColliderBehavior[];
  export let onboardCircleColliders: CircleColliderBehavior[];
  
  export let damageables: DamageableBehavior[];
  export let onboardDamageables: DamageableBehavior[];
  
  export let musicPlay: Sup.Audio.SoundPlayer;
  export let musicPlayBoss: Sup.Audio.SoundPlayer;
  
  
  // Test Metylene afficher Menu
  export function initialize(){
//     if (Game.firstGame) {
//       Game.firstGame = false;
//       Game.showTitleScreen();
//     } else {
      Game.start();
//     }
  }
  
  export function start() {
    characterBehaviors = [];
    interactiveBehaviors = [];
    
    circleColliders = [];
    onboardCircleColliders = [];
    
    damageables = [];
    onboardDamageables = [];

    Sup.loadScene("In-Game/Scene");
    
    Sup.Audio.playSound("In-Game/Water/Ocean Wave", 1.0, { loop: true });
    musicPlay = Sup.Audio.playSound("In-Game/Musics/Theme 1", 1.0, { loop: true });
    musicPlayBoss = new Sup.Audio.SoundPlayer("In-Game/Musics/Theme 2", 1.0, { loop: true });
    let startPosition = generateWorld();
    boatBehavior.setPosition(startPosition);
    
    for (let i = 0; i < 2; i++) {
      let character = Sup.appendScene("In-Game/Characters/Prefab", boatBehavior.actor)[0];
      character.getBehavior(CharacterBehavior).index = i;
    }
  }

  export function showTitleScreen(){
    Sup.loadScene("Menu/Title Screen");
  }
}
