// Constructeur de groupe par fraxken
// La class analyse une scène et construit des groupes en fonction des noms! (Va nous permettre de récupérer nos éléments de dialogue, nos clés etc..)
class Constructeur {
  
  static SchemaBase = []
  
  private GO : Sup.Actor; 
  private store : any = {
    "undefined" : {}
  }
  private schema : any;
  public active : boolean = false;
  private buildID : number = 0;

  constructor(GO : Sup.Actor) {
    this.GO = GO; 
  }

  public analyze(schema: any) : boolean {
    this.schema = schema;
    for(let i in Constructeur.SchemaBase) {
      this.schema.push(Constructeur.SchemaBase[i])
    }
    this.buildID++;
    if(this.buildID != 1) {
      this.store = {
        "undefined" : {}
      }
    }
    for(let a in schema) {
      let final : string = schema[a].substring(1);
      if(this.store[final] == undefined) {
        this.store[final] = {};
      }
    }
    let children = this.GO.getChildren();
    for(let i in children) {
      this.recursive(children[i]);
    }
    
    this.active = true;
    return true;
  }

  public recursive(actor : Sup.Actor) : void {
    let name = actor.getName();
    let children = actor.getChildren();
    
    let find = false;
    for(let r in this.schema) {
      let a = this.schema[r];
      let regex : string = a.substring(0, 1);
      let final : string = a.substring(1);
      
      if(regex == "^" && name.match(new RegExp('^' + final, 'i'))) {
        find = true;
        this.store[final][name] = actor;
        break;
      }
      else if(regex == "$" && name.match(new RegExp(final + '$','i'))) {
        find = true;
        this.store[final][name] = actor;
        break;
      }
      else if(regex == "*" && name.match(new RegExp(final,'g'))) {
        find = true;
        this.store[final][name] = actor;
        break;
      }
    }
    
    if(!find) {
      this.store["undefined"][name] = actor;
    }
    
    if(actor.getChildren().length > 0) {
      for(let i in children) {
        this.recursive(children[i]);
      }
    }
  }

  public get(name : string) : any {
    if(this.active) {
      if(this.store[name] !== undefined && this.store[name] !== null) {
        return this.store[name];
      }
    }
  }

  public list() : any {
    if(this.active) {
      let tab = [];
      for(let k in this.store) {
        tab.push(k);
      }
      return tab;
    }
  }

  public view(name : string, action : (Actor : Sup.Actor) => void) : void {
    if(this.active) {
      if(this.store[name] !== undefined && this.store[name] !== null) {
        let env = this.store[name];
        for(let i in env) {
          let r = env[i];
          action(r);
        }
      }
    }
  }

  public event(groupe: string, action : () => any) : void {
    
  }
  
}
