// Class gestion des dialogues ! 
class DialogueBehavior extends Sup.Behavior {
  
  public offset : number = -3;
  
  // Enfants de notre boîte de dialogue!
  private buttonsLocation   : Sup.Actor;
  private dialogueLocation  : Sup.Actor;
  private avatarLocation    : Sup.Actor;
  private nomPersonnageLocation : Sup.Actor;

  // Storage buttons instance (permettera d'effectuer des actions précise sur nos boutons!)
  public storeButtons = [];
  private selected : number = 0;
  private isOpen : boolean = false;
  
  awake() {
    // On recherche nos enfants!
    this.buttonsLocation  = this.actor.getChild("Buttons");
    this.dialogueLocation = this.actor.getChild("Dialogue");
    this.avatarLocation   = this.actor.getChild("Avatar")
    this.nomPersonnageLocation = this.actor.getChild("NomPersonnage");
    this.actor.setVisible(false);
    this.open("debutDialogue");
  }

  open(dialogueName: string) {
    this.storeButtons = [];
    let conf = Dialogues[dialogueName]
    
    Sup.getActor("World Map");
    
    // On applique le texte a notre fenêtre dialogue.
    this.dialogueLocation.textRenderer.setText(conf.dialogue);
    //this.dialogueLocation.addBehavior(TextBehavior,{"text":conf.dialogue,"textShowSpeed":"0.012"});
    
    // Set Sprite for avatar
    
    //
    if(conf.nomPersonnage != undefined) {
      this.nomPersonnageLocation.textRenderer.setText(conf.nomPersonnage);
    }
    else {
      this.nomPersonnageLocation.setVisible(false);
    }
    
    // Destroy all buttons 
    let buttonsChildren = this.buttonsLocation.getChildren();
    if(buttonsChildren.length > 0) {
      for(let k in buttonsChildren) {
        buttonsChildren[k].destroy();
      }
    }
    
    let vector = new Sup.Math.Vector3(0.42,0.42,0);
    
    // Construct all buttons
    let i = 0;
    for(let indice in conf.buttons) {
      let skin = conf.buttons[indice].skin || "Menu/TMP/Button2";
      let text = conf.buttons[indice].texte;
      let action = conf.buttons[indice].action;
      
      // Création du bouton
      let myButton = new Sup.Actor("Button_"+indice,this.buttonsLocation);
      myButton.setLocalPosition( new Sup.Math.Vector3( i*this.offset , 0 , 0 ) );
      myButton.setLocalScale( new Sup.Math.Vector3( 1 , 1 , 1 ) );
      
      // On applique le sprite au bouton!
      let buttonSprite = new Sup.SpriteRenderer(myButton,skin);
      let behavior = myButton.addBehavior(ButtonBehavior,{"focus_scale": vector.clone() });
      this.storeButtons.push(behavior);
      behavior["onAction"] = action;
      
      if(text != undefined) {
        // Création du texte dans le bouton!
        let myText = new Sup.Actor("Texte",myButton);
        myText.setLocalPosition( new Sup.Math.Vector3( 0 , 0 , 0.5 ));
        let textRndr = new Sup.TextRenderer(myText,indice,"Credits/Font");
        textRndr.setSize(14);
      }
      i++;
    }
    
    
    // On affiche la boîte de dialogue quand tout est bon!
    this.isOpen = true;
    this.selected = this.storeButtons.length-1;
    this.actor.setVisible(true);
  }
       
  close(dialogueName: string) {
    this.storeButtons = [];
    this.isOpen = false;
    this.actor.setVisible(false);
  }

  update() {
    
    // On vérifie que la boite de dialogue est ouverte !
    if(this.isOpen) {
     
      
      for(let k in this.storeButtons) {
        this.storeButtons[k].unFocus();
      }
      
      
      let pressed = false;
      
      // On détecte si le joueur veut passer d'une touche à l'autre
      if (Input.pressRight(0)) {
        if(this.selected > 0) {
          this.selected--;
        }
        else {
          this.selected = (this.storeButtons.length-1);
        }
        pressed = true;
      } else if (Input.pressLeft(0)) {
        if(this.selected == (this.storeButtons.length-1)) {
          this.selected = 0;
        }
        else {
          this.selected++;
        }
        pressed = true;
      }
      
      if(pressed)
        this.storeButtons[this.selected].onFocus();
      
      // Si le joueur éxecute une action sur notre menu !
      if (Sup.Input.isKeyDown("SPACE") || Sup.Input.isKeyDown("RETURN")) {
        this.storeButtons[this.selected]["onAction"](this);
      }
    } 
    
  }
}
Sup.registerBehavior(DialogueBehavior);
