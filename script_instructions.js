
const robot = new Robot ("images/R2D2.png", "playground",new Position(20,20));
let game = new Game(robot);

window.onkeydown = function(e) {
    switch(e.key) {
        case "ArrowLeft" :
            game.ArrowLeft = true;
            break;
        case "ArrowUp" :
            game.ArrowUp = true;
            break;
        case "ArrowRight" :
            game.ArrowRight = true;
            break;
        case "ArrowDown" :
            game.ArrowDown = true;
            break;
        case 's' :
            game.run = false;
            break;
        case 'd' :
            game.run = true;
            break;
        case 't':
            game.gagne = true;
        default :
            break;
        }
}  

window.onkeyup = function(e) {
    switch(e.key) {
        case "ArrowLeft" :
            game.ArrowLeft = false;
            break;
        case "ArrowUp" :
            game.ArrowUp = false;
            break;
        case "ArrowRight" :
            game.ArrowRight = false;
            break;
        case "ArrowDown" :
            game.ArrowDown = false;
            break;
        default :
            break;
        }
}

        
changeBouton = function(element){
    if(element.innerHTML == "Démarrer"){
        game.run = true;
        element.innerHTML = "Pause";
    } else{
        if(element.innerHTML == "Pause"){
            game.run = false;
            element.innerHTML = "Démarrer";
        }
    }
}


let jeu = {};
jeu.frameNb = 0;
jeu.requestId;
jeu.fonction = function (temps){
    if(jeu.requestId != null){
        if(game.perdu){
            game.aPerdu();
            game.reInitisalise();
            switch(game.niveau){
                case 1 :
                    game.initialiseNiveau1();
                    break;
                case 2 :
                    game.initialiseNiveau2();
                    break;
            }
            jeu.frameNb = 0;
            jeu.requestId = null;
            window.requestAnimationFrame(jeu.fonction);
            //window.cancelAnimationFrame(jeu.requestId);            
        }
        if(game.gagne){
            game.aGagne();
            game.reInitisalise();
            switch(game.niveau){
                case 2 :
                    game.initialiseNiveau2();
                    break;
                default :
                    game.fin();
                    game.termine = true;
            }
            jeu.frameNb = 0;
            jeu.requestId = null;
            window.requestAnimationFrame(jeu.fonction);
            //window.cancelAnimationFrame(jeu.requestId);            
        }
        if(game.run && !game.termine){
            jeu.frameNb = jeu.frameNb+1;
            game.updateFrame(10);
            jeu.requestId = window.requestAnimationFrame(jeu.fonction);   
        }
        if(!game.run || game.termine) {
            jeu.requestId = window.requestAnimationFrame(jeu.fonction);
        }
     } else {  
        jeu.requestId = window.requestAnimationFrame(jeu.fonction);   
    } 
}

game.initialiseNiveau1();
jeu.fonction(0);




