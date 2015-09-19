class WheelBehavior extends InteractiveBehavior {
  action(playerIndex: number) {
    Game.boatBehavior.control(playerIndex);
    if (Game.boatBehavior.playerIndex === playerIndex) {
      let characterBehavior = Game.characterBehaviors[playerIndex];
      characterBehavior.setState(CharacterState.Boat);
      
      let targetPosition = this.actor.getChild("Trigger").getLocalPosition();
      targetPosition.add(this.actor.getLocalPosition());
      characterBehavior.setTarget(targetPosition, 0);
    } else Game.characterBehaviors[playerIndex].setState(CharacterState.Free);
  }
}
Sup.registerBehavior(WheelBehavior);
