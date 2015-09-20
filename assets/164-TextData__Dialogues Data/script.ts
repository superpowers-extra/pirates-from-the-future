let Dialogues = {
  "marchandDialogue" : {
    dialogue: "salut les gars ça va bien ?!\nGOGO LES MECS!",
    nomPersonnage : "Marchand",
    buttons: {
      "Suivant" : {
        skin : "Menu/TMP/Button1",
        action : (boiteDialogue) => {
          boiteDialogue.open("queteMarchand")
        }
      },
      "Annuler" : {
        action : (boiteDialogue) => {
          boiteDialogue.close();
        }
      },
    }
  },
  "queteMarchand" : {
    dialogue: "WAOUH il est trop beau ce jeu!",
    nomPersonnage : "Moi",
    buttons: {
      "Terminer" : {
        skin : "Menu/TMP/Button1",
        action : (boiteDialogue) => {
          boiteDialogue.close()
        }
      },
      "Retour" : {
        skin : "Menu/TMP/Button1",
        action : (boiteDialogue) => {
          boiteDialogue.open("marchandDialogue")
        }
      },
    }
  }
}