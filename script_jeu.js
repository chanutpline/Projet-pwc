//script du prototype jeu

/*
Classe Jeu
*/
class Game {

    constructor(robot) {
        this.ArrowRight = false;
        this.ArrowLeft = false;
        this.ArrowUp = false;
        this.ArrowDown = false;
        this.vies = 3;
        this.run = false;
        this.gagne = false;
        this.perdu = false;
        //numéro du niveau actuel
        this.niveau = 1;
        this.termine = false;
        //l'objet à déplacer
        this.robot = robot;
        //tous les ennemis d'un niveau sont stockés dedans
        this.ennemis = {};
        //tous les alliés d'un niveau sont stockés dedans
        this.allies = {};
        //tous les obstacles d'un niveau sont stockés dedans
        this.obstacles = {}
        //l'objet à atteindre pour terminer le niveau
        this.objectif = null;
        //si cet objet atteint l'objectif avant le robot le niveau est perdu
        this.chrono = null;
    }

    //gère le déplacement du robot
    deplacementRobot(duree) {
        const vitesse = 2;
        let deplacement = new Position(0, 0);
        if (this.ArrowDown) {
            deplacement.y = deplacement.y + vitesse;
        }
        if (this.ArrowUp) {
            deplacement.y = deplacement.y - vitesse;
        }
        if (this.ArrowLeft) {
            deplacement.x = deplacement.x - vitesse;
        }
        if (this.ArrowRight) {
            deplacement.x = deplacement.x + vitesse;
        }
        const hitoboxTest = new Hitbox(this.robot.hitbox.position, this.robot.hitbox.width, this.robot.hitbox.height)
        if (!(deplacement.x == 0 && deplacement.y == 0) && !this.vaPercuter(hitoboxTest, deplacement)) {
            this.robot.moveRel(deplacement);
        }
    }

    //retourne true si la hitbox va percuter un obstacle en avançant de deplacement
    vaPercuter(hitbox, deplacement) {
        let hitbox2 = hitbox;
        hitbox2.position = deplacement.add(hitbox.position);
        for (let obstacle in this.obstacles) {
            if (this.obstacles[obstacle].hitbox.areIntersecting(hitbox2)) {
                return true;
            }
        }
        return false;
    }

    //retourne true si tous les allies sont sauvés
    alliesSauve() {
        for (let allie in this.allies) {
            if (this.allies[allie].sauve == false) {
                return false;
            }
        }
        return true;
    }

    //toutes les actoins effectuées à chaque boucle de jeu
    updateFrame(duree) {
        //si vador est à un quart, la moitié ou trois quart du chemin, lance l'audio
        if(this.chrono.position.x == 165 || this.chrono.position.x == 325 || this.chrono.position.x == 488){
            audio.vador.play();
        }
        //gère le déplacement du robot
        this.deplacementRobot(duree);
        //parcours tous les ennemis du niveau pour gérer leur deplacement et s'ils touchent le robot le niveau est perdu
        for (let attr in this.ennemis) {
            this.ennemis[attr].patrouiller(duree);
            if (this.robot.hitbox.areIntersecting(this.ennemis[attr].hitbox)) {
                this.perdu = true;
            }
        }
        //déplacement du chrono toutes les 24 boucles
        if (jeu.frameNb % 6 == 0) {
            this.chrono.avancer(duree);
        }
        //si le chrono atteint l'objectif la partie est perdue
        if (this.chrono.hitbox.areIntersecting(this.objectif.hitbox)) {
            this.perdu = true;
        }
        //parcours tous les alliés, si le robot les touche et qu'il n'ont pas encore été sauvés ils sont sauvés
        for (let allie in this.allies) {
            if (this.robot.hitbox.areIntersecting(this.allies[allie].hitbox) && this.allies[allie].sauve == false) {
                this.allies[allie].estSauve();
            }
        }
        //si tous les alliés sont sauvés et que le robot touche l'objectif le niveau est gagné
        if (this.alliesSauve() && this.robot.hitbox.areIntersecting(this.objectif.hitbox)) {
            this.gagne = true;
        }
    }

    //affiche un message de félicitations et lance le niveau suivant ou marque le jeu comme terminé
    aGagne() {
        audio.gagneN.play();
        this.niveau = this.niveau + 1;
        alert("Félicitations vous avez terminé ce niveau !");
        this.reInitisalise();
        //affiche le numéro du niveau dans le cadre "niveau"
        window.document.getElementById("niveau").innerHTML = "Niveau " + this.niveau;
        switch (this.niveau) {
            case 2:
                this.initialiseNiveau2();
                break;
            default:
                //affiche terminé dans le cadre indiquant le niveau
                window.document.getElementById("niveau").innerHTML = "Terminé";
                this.termine = true;
        }
    }

    //affiche un message quand le niveau est perdu et relance le niveau en cours
    aPerdu() {
        audio.perduN.play();
        //le joueur perd une vie, le nombre restant est actualisé dans l'objet jeu et l'affichage est adapté
        game.vies = game.vies - 1;
        retireVie("vie" + this.vies);
        //si le joueur n'a plus de vie il de définitivement perdu et la partie est finie
        if (this.vies == 0) {
            alert("Vous avez perdu");
            this.reInitisalise();
            this.termine = true;
        //si le joueur a encore une ou des vies le niveau actuel est lancé de nouveau
        } else {
            alert("Vous avez perdu, mais vous pouvez retenter votre chance ! Il vous reste " + this.vies + " essais");
            this.reInitisalise();
            switch (this.niveau) {
                case 1:
                    this.initialiseNiveau1();
                    break;
                case 2:
                    this.initialiseNiveau2();
                    break;
            }
        }

    }

    //animation de fin quand tous les niveaux sont terminées
    fin() {
        desactiveClavier();
        //si le joueur a gagné
        if (this.vies > 0) {
            //si l'objectif est null (première fois que la méthode fin est appelée) 
            if (this.objectif == null) {
                audio.gagne.play();
                //affiche un message de félicitation
                this.message = document.createElement('img');
                this.message.setAttribute('src', "images/felicitations.png");
                this.message.setAttribute("style", "position : absolute; top :100px; left:125px")
                //bloque les boutons de démarrage de niveau et pour recommencer le niveau
                bloqueBouton('demarrer');
                bloqueBouton('recommencer');
                //crée l'objectif
                window.document.getElementById("playground").appendChild(this.message);
                game.objectif = new Sprite("images/faucon.png", "playground", new Position((654), (500)));
            }

            //déplacement de l'objectif
            if (this.objectif.position.y > 430) {

                this.objectif.moveRel(new Position(-1, -2));
            }
            if (this.objectif.position.y <= 430) {
                this.objectif.moveRel(new Position(-2, -1));
            }
            if (this.objectif.position.x <= 1) {
                this.objectif.img.remove();
            }
            //si le joueur a perdu
        } else {
            //première fois que la méthode est appelée
            if (this.objectif == null) {
                //lance la musique
                audio.perdu.play();
                //affiche un message de félicitation
                this.message = document.createElement('img');
                this.message.setAttribute('src', "images/perdu.png");
                this.message.setAttribute("style", "position : absolute; top :150px; left:200px")
                //bloque les boutons de démarrage de niveau et pour recommencer le niveau
                bloqueBouton('demarrer');
                bloqueBouton('recommencer');
                //crée l'objectif
                window.document.getElementById("playground").appendChild(this.message);
                game.objectif = new Image("images/faucon.png", "playground", new Position(654, 500));
                game.chrono = new Image("images/vador.png", "playground", new Position(480, 500));
                game.robot = new Image("images/R2D2.png", "playground", new Position(530, 520));

            }
        }
    }

    //remets à zéro tous les éléments du jeu sauf le niveau actuel
    reInitisalise() {
        audio.fond.pause();
        for (let ennemi in this.ennemis) {
            this.ennemis[ennemi].img.remove();
        }
        this.ennemis = {};
        for (let allie in this.allies) {
            this.allies[allie].img.remove();
        }
        this.allies = {};
        for (let obstacle in this.obstacles) {
            this.obstacles[obstacle].img.remove();
        }
        this.obstacles = {};
        if (this.chrono != null) {
            this.chrono.img.remove();
            this.chrono = null;
        }
        if (this.objectif != null) {
            this.objectif.img.remove();
            this.objectif = null
        }
        if (this.robot != null) {
            this.robot.img.remove();
            this.robot = null;
        }
        this.perdu = false;
        this.gagne = false;
        this.run = false;
        this.ArrowDown = false;
        this.ArrowUp = false;
        this.ArrowLeft = false;
        this.ArrowRight = false;
        let element = window.document.getElementById('demarrer');
        if (element != null) {
            element.innerHTML = "Démarrer";
        }
    }

    //relance le premier niveau du jeu
    retourNiveau1() {
        //si le jeu vient d'être terminé
        if (this.termine) {
            //retire le message
            this.message.remove();
            this.message = null;
            //débloque les boutons
            bloqueBouton('demarrer');
            bloqueBouton('recommencer');
            //débloque le clavier
            activeClavier();
            //remet l'attribut termine à false
            this.termine = false;
            if(this.vies == 0){
                audio.perdu.pause();
                audio.perdu.load();
            } else {
                audio.gagne.pause();
                audio.gagne.load();
            }
        }
        this.vies = 3;
        afficheVies();
        //reinitialise le jeu et remet les paramètres au niveau 1
        this.reInitisalise();
        this.niveau = 1;
        this.initialiseNiveau1();
        //remets les pistes audios au début
        console.log("test");
        audio.fond.load();
    }

    //relance le niveau actuel (réinitialise le jeu et remet le niveau actuel)
    recommenceNiveau() {
        audio.fond.pause();
        audio.fond.load();
        this.reInitisalise();
        switch (this.niveau) {
            case 1:
                this.initialiseNiveau1();
                break;
            case 2:
                this.initialiseNiveau2();
                break;
            default:
                break;
        }
    }

    //mets à jour tous les attributs du jeu pour commencer le niveau 1
    initialiseNiveau1() {
        //mets lefond du niveau
        window.document.getElementById("playground").setAttribute("style", "background: url(\"images/desert_sand.jpg\")");
        window.document.getElementById("niveau").innerHTML = "Niveau 1";
        //initialise l'attribut robot s'il ne l'est pas déjà (après une réinitialisation)
        if (this.robot == null) {
            this.robot = new Robot("images/R2D2.png", "playground", new Position(20, 20));
        }

        //Ennemis : crée et range dans l'attribut ennemis tous les ennemis du niveau
        this.ennemis.ennemi1 = new Ennemi("images/stormtrooper.png", "playground", new Position(160, 200), 0, 180);
        this.ennemis.ennemi2 = new Ennemi("images/stormtrooper.png", "playground", new Position(530, 20), 1, 220);;
        this.ennemis.ennemi3 = new Ennemi("images/stormtrooper.png", "playground", new Position(470, 200), 1, 120);

        //objectif
        this.objectif = new Image("images/faucon.png", "playground", new Position((654), (500)));

        //Chrono 
        this.chrono = new Vador("images/vador.png", "playground", new Position(0, 600 - 90));

        //Allies 
        this.allies.luke = new Allie("images/luke.png", "playground", new Position(30, 360));
        this.allies.obiwan = new Allie("images/obiwan.png", "playground", new Position(580, 370));
        this.allies.solo = new Allie("images/solo.png", "playground", new Position(300, 200));

        //Obstacles
        this.obstacles.obs = new Obstacle("images/obstacle1.png", "playground", new Position(0, 600 - 30 - 91));
        this.obstacles.obs2 = new Obstacle("images/obstacle.png", "playground", new Position(20, 320));
        this.obstacles.obs3 = new Obstacle("images/obstacle.png", "playground", new Position(20, 120));
        this.obstacles.obs4 = new Obstacle("images/obstacle3.png", "playground", new Position(240, 0));
        this.obstacles.obs5 = new Obstacle("images/obstacle3.png", "playground", new Position(640, 120));
        this.obstacles.obs6 = new Obstacle("images/obstacle.png", "playground", new Position(400, 120));
        this.obstacles.obs7 = new Obstacle("images/obstacle.png", "playground", new Position(300, 320));
        this.obstacles.obs8 = new Obstacle("images/obstacle2.png", "playground", new Position(520, 330));
    }

    initialiseNiveau2() {
        this.robot = new Robot("images/R2D2.png", "playground", new Position(20, 20));
        window.document.getElementById("playground").setAttribute("style", "background: url(\"images/fondPave.jpg\");border: 1px solid white");
        //Ennemis
        this.ennemis.ennemi1 = new Ennemi("images/stormtrooper.png", "playground", new Position(190, 160), 0, 130);
        this.ennemis.ennemi2 = new Ennemi("images/stormtrooper.png", "playground", new Position(360, 380), 1, 200);
        this.ennemis.ennemi3 = new Ennemi("images/stormtrooper.png", "playground", new Position(570, 160), 0, 130);

        //objectif
        this.objectif = new Image("images/faucon.png", "playground", new Position((654), (500)));

        //Chrono
        this.chrono = new Vador("images/vador.png", "playground", new Position(0, 600 - 90));

        //Allies
        this.allies.leila = new Allie("images/leila.png", "playground", new Position(330, 220));
        this.allies.luke = new Allie("images/luke.png", "playground", new Position(710, 10));
        this.allies.solo = new Allie("images/solo.png", "playground", new Position(30, 360));

        //Obstacles
        this.obstacles.obs = new Obstacle("images/obstacleN2_2.png", "playground", new Position(20, 470));
        this.obstacles.obs2 = new Obstacle("images/obstacleN2_4.png", "playground", new Position(260, 110));
        this.obstacles.obs4 = new Obstacle("images/obstacleN2_4.png", "playground", new Position(410, 110));
        this.obstacles.obs5 = new Obstacle("images/obstacleN2_4.png", "playground", new Position(10, 110));
        this.obstacles.obs6 = new Obstacle("images/obstacleN2_4.png", "playground", new Position(650, 110));
        this.obstacles.obs3 = new Obstacle("images/obstacleN2_4.png", "playground", new Position(10, 290));
        this.obstacles.obs7 = new Obstacle("images/obstacleN2.jpg", "playground", new Position(260, 150));
        this.obstacles.obs8 = new Obstacle("images/obstacleN2.jpg", "playground", new Position(640, 240));
    }

}