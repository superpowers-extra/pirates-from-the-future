class MenuBehavior extends Sup.Behavior {
  
  private buttons : ButtonBehavior[] = [];

  private buttonSelected : number;
  
    
  awake() {
    // Récupération de tous les boutons
    for (let i = 0; i < this.actor.getChild("Buttons").getChildren().length; i++) {
      let item = this.actor.getChild("Buttons").getChildren()[i].getBehavior(ButtonBehavior);
      this.buttons.push(item);
    }
    
    this.buttonSelected = -1;
  }

  update() {
    if (Input.pressLeft(0)) {
      if (this.buttonSelected > 0){
        this.buttonSelected --;
      }
    } else if (Input.pressRight(0)) {
      if (this.buttonSelected < this.buttons.length-1){
        this.buttonSelected ++;
      }
    }
    
    // unFocus de tous les boutons
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].unFocus();
    }
    
    // onFocus que du bouton sélectionné
    if (this.buttons[this.buttonSelected] != undefined) {
      this.buttons[this.buttonSelected].onFocus();
    }
    
      
    if(Input.pressAction1(0)){
      if(this.buttons[this.buttonSelected].actor.getName() == "Sound"){
        // Game.SoundVolume();
      }
      // Executer l'action du bouton
      // On récupe l'action selon le nom du bouton ? 
    }
  }
}
Sup.registerBehavior(MenuBehavior);
