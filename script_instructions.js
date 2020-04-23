//crée le jeu
const robot = new Robot ("images/R2D2.png", "playground",new Position(20,20));
let game = new Game(robot);
//bouton de démarrage et de pauses
let element = window.document.getElementById('demarrer');

//action du bouton de démarrage
changeBouton = function(){
    //lance le jeu et transforme le bouton en bouton pause
    if(element.innerHTML == "Démarrer"){
        game.run = true;
        element.innerHTML = "Pause";
    } else{
        //met le jeu en pause et transforme le bouton en bouton démarrer
        if(element.innerHTML == "Pause"){
            game.run = false;
            element.innerHTML = "Démarrer";
        }
    }
}

//gestions des touches appuyées
window.onkeydown = function(e) {
    switch(e.key) {
        case "ArrowLeft" :
            e.preventDefault();
            game.ArrowLeft = true;
            break;
        case "ArrowUp" :
            e.preventDefault();
            game.ArrowUp = true;
            break;
        case "ArrowRight" :
            e.preventDefault();
            game.ArrowRight = true;
            break;
        case "ArrowDown" :
            e.preventDefault();
            game.ArrowDown = true;
            break;
        case 's' :
            //mets le jeu en pause et mets le bouton de démarrage à jours
            element.innerHTML = "Démarrer";
            game.run = false;
            break;
        case 'd' :
            //lance le jeu et mets le bouton de démarrage à jour
            element.innerHTML = "Pause";
            game.run = true;
            break;
        case 't':
            game.gagne = true;
        default :
            break;
        }
}  

//gestion des touches relachées
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

//initialise l'objet qui contient la boucle du jeu
let jeu = {};
jeu.frameNb = 0;
jeu.requestId;
//fonction de la boucle du jeu
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
        }
        if(game.gagne){
            game.aGagne();
            game.reInitisalise();
            switch(game.niveau){
                case 2 :
                    game.initialiseNiveau2();
                    break;
                default :
                    window.document.getElementById("niveau").innerHTML = "Terminé";
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
        if(!game.run) {
            jeu.requestId = window.requestAnimationFrame(jeu.fonction);
        }
        if(game.termine){
            game.fin();
        }
     } else {  
        jeu.requestId = window.requestAnimationFrame(jeu.fonction);   
    } 
}
//initialise le niveau 1
game.initialiseNiveau1();
//lannce la boucle du jeu
jeu.fonction(0);




