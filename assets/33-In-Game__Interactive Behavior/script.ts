abstract class InteractiveBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  triggerPosition: Sup.Math.Vector3;
  markerPosition: Sup.Math.Vector3;

  distance = 4;
  
  awake() {
    Game.interactiveBehaviors.push(this);
    
    let angle = this.actor.getEulerY();
    this.position = this.actor.getLocalPosition();
    
    this.triggerPosition = this.position.clone();
    let triggerActor = this.actor.getChild("Trigger");
    if (triggerActor != null) {
      let triggerOffset = triggerActor.getLocalPosition();
      this.triggerPosition.z -= triggerOffset.z * Math.cos(angle) + triggerOffset.x * Math.sin(angle);
      this.triggerPosition.x -= triggerOffset.z * Math.sin(angle) + triggerOffset.x * Math.cos(angle);
      this.triggerPosition.y += triggerOffset.y;
    }
    
    this.markerPosition = this.position.clone();
    let markerActor = this.actor.getChild("Marker");
    if (markerActor != null) {
      let markerOffset = markerActor.getLocalPosition();
      this.markerPosition.z -= markerOffset.z * Math.cos(angle) + markerOffset.x * Math.sin(angle);
      this.markerPosition.x -= markerOffset.z * Math.sin(angle) + markerOffset.x * Math.cos(angle);
      this.markerPosition.y += markerOffset.y;
    } else this.markerPosition.y += 5;
  }
  onDestroy() {
    Game.interactiveBehaviors.splice(Game.interactiveBehaviors.indexOf(this), 1);
  }
  
  abstract action(playerIndex: number);
}
