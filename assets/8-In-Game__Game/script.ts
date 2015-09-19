namespace Game {
  export let cameraBehavior: CameraBehavior;
  export let boatBehavior: BoatBehavior;
  
  export let characterBehaviors: CharacterBehavior[];
  export let interactiveBehaviors: InteractiveBehavior[]; 
  
  export function start() {
    characterBehaviors = [];
    interactiveBehaviors = [];

    Sup.loadScene("In-Game/Scene");
    
    for (let i = 0; i < 2; i++) {
      let character = Sup.appendScene("In-Game/Characters/Prefab", boatBehavior.actor)[0];
      character.getBehavior(CharacterBehavior).index = i;
    }
  }
}
