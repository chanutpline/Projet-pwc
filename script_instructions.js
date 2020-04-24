//crée le jeu
const robot = new Robot("images/R2D2.png", "playground", new Position(20, 20));
let game = new Game(robot);
//bouton de démarrage et de pauses
let element = window.document.getElementById('demarrer');

//action du bouton de démarrage
changeBouton = function () {
    //lance le jeu et transforme le bouton en bouton pause
    if (element.innerHTML == "Démarrer") {
        game.run = true;
        element.innerHTML = "Pause";
    } else {
        //met le jeu en pause et transforme le bouton en bouton démarrer
        if (element.innerHTML == "Pause") {
            game.run = false;
            element.innerHTML = "Démarrer";
        }
    }
}

//bloque ou débloque le bouton dont l'id est passé en paramètre
bloqueBouton = function (id) {
    //récupère le bouton
    let bouton = window.document.getElementById(id);
    //s'il est bloqué le débloque
    if (bouton.disabled) {
        bouton.disabled = false;
        //sinon le bloque
    } else {
        bouton.disabled = true;
    }
}

afficheVies = function(){
    let cadre = window.document.getElementById("vies");
    for(let i = 1;i <4;i++){
        if(window.document.getElementById("vie"+i) != null){
            window.document.getElementById("vie"+i).remove();
        }
        let image = document.createElement('img');
        image.setAttribute('src',"images/faucon.png");
        image.setAttribute('style',"position : relative; height : 25px; margin-left : 10px");
        image.setAttribute('id',"vie"+i);
        cadre.appendChild(image);
    }
}

retireVie = function(vie){
    window.document.getElementById(vie).remove();
}

activeClavier = function() {
//gestions des touches appuyées
window.onkeydown = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            e.preventDefault();
            game.ArrowLeft = true;
            break;
        case "ArrowUp":
            e.preventDefault();
            game.ArrowUp = true;
            break;
        case "ArrowRight":
            e.preventDefault();
            game.ArrowRight = true;
            break;
        case "ArrowDown":
            e.preventDefault();
            game.ArrowDown = true;
            break;
        case 's':
            //mets le jeu en pause et mets le bouton de démarrage à jours
            element.innerHTML = "Démarrer";
            game.run = false;
            break;
        case 'd':
            //lance le jeu et mets le bouton de démarrage à jour
            element.innerHTML = "Pause";
            game.run = true;
            break;
        case 't':
            game.gagne = true;
        default:
            break;
    }
}

desactiveClavier = function(){
    window.onkeydown = function (e){

    }
    window.onkeyup = function (e){

    }
}

//gestion des touches relachées
window.onkeyup = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            game.ArrowLeft = false;
            break;
        case "ArrowUp":
            game.ArrowUp = false;
            break;
        case "ArrowRight":
            game.ArrowRight = false;
            break;
        case "ArrowDown":
            game.ArrowDown = false;
            break;
        default:
            break;
    }
}
}


//initialise l'objet qui contient la boucle du jeu
let jeu = {};
//nombre de frame depuis le bébut du niveau
jeu.frameNb = 0;
//fonction de la boucle du jeu
jeu.fonction = function (temps) {
    //si un niveau est perdu appelle la méthode aPerdu et réinitialise frameNb
    if (game.perdu) {
        game.aPerdu();
        jeu.frameNb = 0;
    }
    //si le niveau est gagné appele la méthode aGagne est réinitialise frameNb
    if (game.gagne) {
        game.aGagne();
        jeu.frameNb = 0;
    }
    //si le niveau en en cours appele la méthode updateFrame (gère le déroulé du niveau) et mets à jours frameNb
    if (game.run && !game.termine) {
        console.log("run");
        game.updateFrame(10);
        jeu.frameNb = jeu.frameNb + 1;
        window.requestAnimationFrame(jeu.fonction);
    }
    //si le jeu est en pause ne fais rien
    if (!game.run) {
        window.requestAnimationFrame(jeu.fonction);
    }
    //si le jeu est terminé appelle la méthode fin
    if (game.termine) {
        game.fin();
    }
}
activeClavier();
afficheVies();
//initialise le niveau 1
game.initialiseNiveau1();
//lannce la boucle du jeu
jeu.fonction(0);




