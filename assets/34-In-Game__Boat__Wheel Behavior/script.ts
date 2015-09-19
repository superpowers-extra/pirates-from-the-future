class WheelBehavior extends InteractiveBehavior {
  action(playerIndex: number) {
    Game.boatBehavior.control(playerIndex);
    if (Game.boatBehavior.playerIndex === playerIndex) Game.characterBehaviors[playerIndex].setState(CharacterState.Boat);
    else Game.characterBehaviors[playerIndex].setState(CharacterState.Free);
  }
}
Sup.registerBehavior(WheelBehavior);
