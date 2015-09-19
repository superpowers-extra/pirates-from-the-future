class HUDBehavior extends Sup.Behavior {
  private behavior;
  private construct : Constructeur;
  
  awake() {
    this.behavior = Sup.getActor("testEffect").getBehavior(TextBehavior);
    this.behavior.modify(`Hey ! \ntexte multiligne loul`);
  }
  
  start() {
    // Création de tout les dialogues automatiquement en scène!
  }

  update() {
  }
}
Sup.registerBehavior(HUDBehavior);
