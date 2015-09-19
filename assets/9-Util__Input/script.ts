namespace Input {
  export function pressUp(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.wasKeyJustPressed("Z") || Sup.Input.wasKeyJustPressed("W")) return true;
        break;
      case 1:
        if (Sup.Input.wasKeyJustPressed("UP")) return true;
        break;
    }
    if (Sup.Input.getGamepadAxisValue(index, 1) < -0.5) return true;
    
    return false;
  }
  export function pressDown(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.wasKeyJustPressed("S")) return true;
        break;
      case 1:
        if (Sup.Input.wasKeyJustPressed("DOWN")) return true;
        break;
    }
    if (Sup.Input.getGamepadAxisValue(index, 1) > 0.5) return true;
    
    return false;
  }
  export function pressLeft(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.wasKeyJustPressed("Q") || Sup.Input.wasKeyJustPressed("A")) return true;
        break;
      case 1:
        if (Sup.Input.wasKeyJustPressed("LEFT")) return true;
        break;
    }
    if (Sup.Input.getGamepadAxisValue(index, 0) < -0.5) return true;
    
    return false;
  }
  export function pressRight(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.wasKeyJustPressed("D")) return true;
        break;
      case 1:
        if (Sup.Input.wasKeyJustPressed("RIGHT")) return true;
        break;
    }
    if (Sup.Input.getGamepadAxisValue(index, 0) > 0.5) return true;
    
    return false;
  }
  
  export function keyDownLeft(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.isKeyDown("Q") || Sup.Input.isKeyDown("A")) return true;
        break;
      case 1:
        if (Sup.Input.isKeyDown("LEFT")) return true;
        break;
    }
    if (Sup.Input.getGamepadAxisValue(index, 0) < -0.5) return true;
    
    return false;
  }
    
  export function keyDownRight(index : number){
    switch (index) {
    case 0:
      if (Sup.Input.isKeyDown("D")) return true;
      break;
    case 1:
      if (Sup.Input.isKeyDown("RIGHT")) return true;
      break;
    }
    if (Sup.Input.getGamepadAxisValue(index, 0) > 0.5) return true;

    return false;
  }
  export function keyDownAction1(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.isKeyDown("H")) return true;
        break;
      case 1:
        if (Sup.Input.isKeyDown("NUMPAD1")) return true;
        break;
    }
    return Sup.Input.wasGamepadButtonJustPressed(index, 0);
  }
  export function keyDownAction2(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.isKeyDown("J")) return true;
        break;
      case 1:
        if (Sup.Input.isKeyDown("NUMPAD2")) return true;
        break;
    }
    return Sup.Input.wasGamepadButtonJustPressed(index, 2);
  }

  export function horizontal(index: number) {
    let gamepadValue = Sup.Input.getGamepadAxisValue(index, 0);
    if (Math.abs(gamepadValue) > 0.15) return gamepadValue;

    let value = 0;
    
    switch (index) {
      case 0:
        if (Sup.Input.isKeyDown("Q") || Sup.Input.isKeyDown("A")) value -= 1;
        if (Sup.Input.isKeyDown("D")) value += 1;
        break;
      
      case 1:
        if (Sup.Input.isKeyDown("LEFT")) value -= 1;
        if (Sup.Input.isKeyDown("RIGHT")) value += 1;
        break;
    }
    
    return value;
  }

  export function vertical(index: number) {
    let gamepadValue = Sup.Input.getGamepadAxisValue(index, 1);
    if (Math.abs(gamepadValue) > 0.15) return gamepadValue;

    let value = 0;
    
    switch (index) {
      case 0:
        if (Sup.Input.isKeyDown("S")) value += 1;
        if (Sup.Input.isKeyDown("W") || Sup.Input.isKeyDown("Z")) value -= 1;
        break;
      
      case 1:
        if (Sup.Input.isKeyDown("DOWN")) value -= 1;
        if (Sup.Input.isKeyDown("RIGHT")) value += 1;
        break;
    }
    
    return value;
  }
    
  export function getAcceleration(index: number) {
    let gamepadButtonValue = Sup.Input.getGamepadButtonValue(index, 7);
    if (gamepadButtonValue > 0.05) return gamepadButtonValue;
    
    let value = 0;
    
    switch (index) {
      case 0:
        if (Sup.Input.isKeyDown("W") || Sup.Input.isKeyDown("Z")) value = 1;
        break;
      case 1:
        if (Sup.Input.isKeyDown("UP")) value = 1;
        break;
    }
    
    return value;
  }

  export function pressAction1(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.wasKeyJustPressed("H")) return true;
        break;
      case 1:
        if (Sup.Input.wasKeyJustPressed("NUMPAD1")) return true;
        break;
    }
    return Sup.Input.wasGamepadButtonJustPressed(index, 0);
  }
  export function pressAction2(index: number) {
    switch (index) {
      case 0:
        if (Sup.Input.wasKeyJustPressed("J")) return true;
        break;
      case 1:
        if (Sup.Input.wasKeyJustPressed("NUMPAD2")) return true;
        break;
    }
    return Sup.Input.wasGamepadButtonJustPressed(index, 2);
  }
    
  export function getTargetAngle(index: number) {
    let horizontalAxis = Sup.Input.getGamepadAxisValue(index, 0);
    let verticalAxis = Sup.Input.getGamepadAxisValue(index, 1);
    
    switch (index) {
      case 0:
        if (Sup.Input.isKeyDown("Z") || Sup.Input.isKeyDown("W")) verticalAxis = -1;
        else if (Sup.Input.isKeyDown("S")) verticalAxis = 1;
        
        if (Sup.Input.isKeyDown("Q") || Sup.Input.isKeyDown("A")) horizontalAxis = -1;
        else if (Sup.Input.isKeyDown("D")) horizontalAxis = 1;
        break;
      
      case 1:
        if (Sup.Input.isKeyDown("UP")) verticalAxis = -1;
        else if (Sup.Input.isKeyDown("DOWN")) verticalAxis = 1;
        
        if (Sup.Input.isKeyDown("LEFT")) horizontalAxis = -1;
        else if (Sup.Input.isKeyDown("RIGHT")) horizontalAxis = 1;
        break;
    }
    
    if (Math.abs(horizontalAxis) <= 0.2 && Math.abs(verticalAxis) <= 0.2) return null;
    else return Math.atan2(horizontalAxis, verticalAxis);
  }
    
  export function pressExit() {
        return Sup.Input.isKeyDown("ESCAPE");
  }
}
