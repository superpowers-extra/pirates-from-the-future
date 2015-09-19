class CreditsBehavior extends Sup.Behavior {
  awake() {
    let credits = [
      "ligne 1",
      "ligne 2"
    ];
    for(let i = 0; i < credits.length; i++){
      let texte = this.actor.textRenderer.getText();
      texte += credits[i];
      this.actor.textRenderer.setText(texte);
    }
  }

  update() {
  }
}
Sup.registerBehavior(CreditsBehavior);
