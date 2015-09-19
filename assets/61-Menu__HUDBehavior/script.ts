class HUDBehavior extends Sup.Behavior {
  private behavior;
  private construct : Constructeur;
  
  awake() {
    this.behavior = Sup.getActor("testEffect").getBehavior(TextBehavior);
    this.behavior.modify(`Hey ! \ntexte multiligne loul`);
    
    this.construct = new Constructeur(this.actor);
    this.construct.analyze(["^DIALOG:"]);
  }
  
  start() {
    // Création de tout les dialogues automatiquement en scène!
    this.construct.view("DIALOG:",(Actor : Sup.Actor) => {
      let key = Actor.getName().substr(7);
      Actor.addBehavior(DialogueBehavior,{ "keyName" : key });
    });
  }

  update() {
    if(Sup.Input.wasKeyJustPressed("A")) {
      this.behavior.end();
    }
  }
}
Sup.registerBehavior(HUDBehavior);
