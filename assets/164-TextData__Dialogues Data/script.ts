let Dialogues = {
  "debutDialogue" : {
    dialogue:
`Hoh hoh, matelot ! Des rumeurs racontent qu'il y a
un trésor dans l'secteur. Faites tout de même
attention aux pirates ennemis qui naviguent
dans les environs, camarade !`,
    buttons: {
      "Suivant" : {
        skin : "In-Game/HUD/Dialogue/Next",
        action : (boiteDialogue) => {
          boiteDialogue.open("debutDialogue2")
        }
      }
    }
  },
  "debutDialogue2" : {
    dialogue: "En avant, marin d'eau douce !",
    buttons: {
      "Terminer" : {
        skin : "In-Game/HUD/Dialogue/Next",
        action : (boiteDialogue) => {
          boiteDialogue.close()
        }
      }
    }
  }
}
