//instructions de quand la page est chargée

//crée le jeu
const robot = new Robot("images/R2D2.png", "playground", new Position(20, 20));
let game = new Game(robot);

//bouton démarrer/pause
let element = window.document.getElementById('demarrer');

//contient les pistes audio utilisées
let audio = {};
audio.perduN = window.document.getElementById("perduN");
audio.gagneN = window.document.getElementById("gagneN");
audio.perdu = window.document.getElementById("perdu");
audio.gagne = window.document.getElementById("gagne");
audio.fond = window.document.getElementById("fond");
audio.vador = window.document.getElementById("vador");


//action du bouton de démarrage
changeBouton = function () {
    //lance le jeu et transforme le bouton en bouton pause
    if (element.innerHTML == "Démarrer") {
        game.run = true;
        element.innerHTML = "Pause";
        audio.fond.play();
    } else {
        //met le jeu en pause et transforme le bouton en bouton démarrer
        if (element.innerHTML == "Pause") {
            game.run = false;
            element.innerHTML = "Démarrer";
            audio.play.pause();
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

//crée les images des vies du joueur et les affiche dans la div 'vies'
afficheVies = function(){
    let cadre = window.document.getElementById("vies");
    //boucle trois fois car trois vies
    for(let i = 1;i <4;i++){
        //s'il y a encore des vies de la partie précédante, les enlève
        if(window.document.getElementById("vie"+i) != null){
            window.document.getElementById("vie"+i).remove();
        }
        //crée une image de vie numérotée
        let image = document.createElement('img');
        image.setAttribute('src',"images/faucon.png");
        image.setAttribute('style',"position : relative; height : 25px; margin-left : 10px");
        image.setAttribute('id',"vie"+i);
        cadre.appendChild(image);
    }
}

//retire l'image de vie dont l'id a été passé en paramètre
retireVie = function(vie){
    window.document.getElementById(vie).remove();
}

//active les touches du jeu
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
            audio.fond.pause();
            break;
        case 'd':
            //lance le jeu et mets le bouton de démarrage à jour
            element.innerHTML = "Pause";
            game.run = true;
            audio.fond.play();
            break;
        case 't':
            game.gagne = true;
        default:
            break;
    }
}

//desactive les touches du jeu
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

//actions effectuées quand la page est chargée
activeClavier();
afficheVies();
game.initialiseNiveau1();
//lannce la boucle du jeu
jeu.fonction(0);




