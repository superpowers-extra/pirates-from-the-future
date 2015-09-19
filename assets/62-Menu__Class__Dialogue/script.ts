let Dialogues = {
  test1 : {
    dialogue: "salut !",
    buttons: {
      cancel : (self) => {
        self.close();
      },
      next : (self) => {
        Sup.log("lol");
      }
    }
  }
}

// Class gestion des dialogues ! 
class DialogueBehavior extends Sup.Behavior {
  
  keyName : string
  public storeWindow = [];

  defaultWindow : number;
  activeWindow : number;

  private buttonsLocation;

  awake() {
    let window = Sup.getActor("Window");
    this.buttonsLocation = window.getChild("Buttons");
    //this.actor.setVisible(false);
  }

  open() {
    let Dialogue = Dialogues[this.keyName];
    let i = 0;
    
    for(let k in Dialogue.buttons) {
      let v = Dialogue.buttons[k];
      let button = new Sup.Actor(k,this.buttonsLocation);
      
      // On configure le bouton
      if(i == 0) {
        button.setLocalPosition( new Sup.Math.Vector3(0,0,0) );
      }
      else {
        button.setLocalPosition( new Sup.Math.Vector3(i*-3.5,0,0) );
      }
      button.setLocalScale( new Sup.Math.Vector3( 3 , 3 , 1 ));
      let sprite = new Sup.SpriteRenderer(button);
      sprite.setSprite("Menu/TMP/Button2");
      let instance = button.addBehavior(ButtonBehavior);
      
      // On crée un texte sur notre bouton : 
      let text = new Sup.Actor("texte",button);
      text.setLocalPosition( new Sup.Math.Vector3( 0 , 0 , 1 ));
      let textRenderer = new Sup.TextRenderer(text,"Credits/Font");
      textRenderer.setText(k);
      
      instance["onAction"] = v;
      i++;
    }
    
    this.actor.setVisible(true);
  }
  
  close() {
    this.actor.setVisible(false);
  }

  update() {
    // Gérer action Skip
    // Gérer action next
    // Gérer action previous
  }
}
Sup.registerBehavior(DialogueBehavior);
