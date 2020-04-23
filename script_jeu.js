
/*
Classe Jeu
*/
class Game {

    constructor(robot){
        this.ArrowRight = false;
        this.ArrowLeft = false;
        this.ArrowUp = false;
        this.ArrowDown = false;
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

    //remets à zéro tous les éléments du jeu sauf le niveau
    reInitisalise(){
        for(let ennemi in this.ennemis){
            this.ennemis[ennemi].img.remove();
        }
        this.ennemis = {};
        for(let allie in this.allies){
            this.allies[allie].img.remove();
        }
        this.allies = {};
        for(let obstacle in this.obstacles){
            this.obstacles[obstacle].img.remove();
        }
        this.obstacles = {};
        if(this.chrono != null){
            this.chrono.img.remove();
            this.chrono = null;
        }
        if(this.objectif != null){
            this.objectif.img.remove();
            this.objectif = null
        }
        if(this.robot != null){
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
        if(element != null){
            element.innerHTML = "Démarrer";
        }
    }

    //gère le déplacement du robot
    deplacementRobot(duree){
        const vitesse = 2;
        let deplacement = new Position(0,0);
        
        if(this.ArrowDown){
            deplacement.y = deplacement.y + vitesse;
        } 

        if(this.ArrowUp){
            deplacement.y = deplacement.y - vitesse;
        }

        if(this.ArrowLeft){
            deplacement.x = deplacement.x - vitesse;
        } 
        if(this.ArrowRight){
            deplacement.x = deplacement.x + vitesse;
        }
        const hitoboxTest = new Hitbox(this.robot.hitbox.position,this.robot.hitbox.width,this.robot.hitbox.height)
        if(!(deplacement.x == 0 && deplacement.y == 0) && !this.vaPercuter(hitoboxTest,deplacement)){
            this.robot.moveRel(deplacement);
        }
    }
    
    //retourne true si la hitbox va percuter un obstacle en avançant de deplacement
    vaPercuter(hitbox, deplacement){
        let hitbox2 = hitbox;
        hitbox2.position = deplacement.add(hitbox.position);
        for(let obstacle in this.obstacles){
            if(this.obstacles[obstacle].hitbox.areIntersecting(hitbox2)){
                return true;
            }
        }
        return false;
    }

    //toutes les actoins effectuées à chaque boucle de jeu
    updateFrame(duree) {
            //gère le déplacement du robot
            this.deplacementRobot(duree);
            //parcours tous les ennemis du niveau pour gérer leur deplacement et s'ils touchent le robot le niveau est perdu
            for(let attr in this.ennemis){
                this.ennemis[attr].patrouiller(duree);
                if(this.robot.hitbox.areIntersecting(this.ennemis[attr].hitbox)){
                    this.perdu = true;
                }
            }
            //déplacement du chrono toutes les 24 boucles
            if(jeu.frameNb%6 == 0){
                this.chrono.avancer(duree);
            }
            //si le chrono atteint l'objectif la partie est perdue
            if(this.chrono.hitbox.areIntersecting(this.objectif.hitbox)){
                this.perdu = true;
            }
            //parcours tous les alliés, si le robot les touche et qu'il n'ont pas encore été sauvés ils sont sauvés
            for(let allie in this.allies){
                if(this.robot.hitbox.areIntersecting(this.allies[allie].hitbox) && this.allies[allie].sauve == false){
                    this.allies[allie].estSauve();
                }
            }
            //si tous les alliés sont sauvés et que le robot touche l'objectif le niveau est gagné
            if(this.alliesSauve() && this.robot.hitbox.areIntersecting(this.objectif.hitbox)){
                this.gagne = true;
            }
    }
        

    //retourne true si tous les allies sont sauvés
    alliesSauve(){
        for(let allie in this.allies){
            if(this.allies[allie].sauve == false){
                return false;
            }
        }
        return true;
    }

    //actualise le niveau actuel quand un niveau est gagné et affiche un message de félicitations
    aGagne(){
        this.niveau = this.niveau+1;
        alert("Félicitations vous avez terminé ce niveau !");
    }

    //affiche un message quand le niveau est perdu
    aPerdu(){
        alert("Vous avez perdu, mais vous pouvez retenter votre chance !");
    }
    
    //mets à jour tous les attributs du jeu pour commencer le niveau 1
    initialiseNiveau1(){
        //mets lefond du niveau
        window.document.getElementById("playground").setAttribute("style","background: url(\"images/desert_sand.jpg\")");
        //affiche le numéro du niveau dans le cadre "niveau"
        window.document.getElementById("niveau").innerHTML = "Niveau 1";
        //initialise l'attribut robot s'il ne l'est pas déjà (après une réinitialisation)
        if(this.robot == null){
            this.robot = new Robot ("images/R2D2.png", "playground",new Position(20,20));
        }
        
        //Ennemis : crée et range dans l'attribut ennemis tous les ennemis du niveau
        this.ennemis.ennemi1 = new Ennemi("images/stormtrooper.png", "playground",new Position(160,200),0,180);
        this.ennemis.ennemi2 = new Ennemi("images/stormtrooper.png", "playground",new Position(530,20),1,220);;
        this.ennemis.ennemi3 = new Ennemi("images/stormtrooper.png", "playground",new Position(470,200),1,120);
    
        //objectif
       this.objectif = new Image ("images/faucon.png", "playground",new Position((654),(500)));
    
        //Chrono 
       this.chrono = new Vador("images/vador.png", "playground",new Position(0,600-90));
    
        //Allies 
       this.allies.luke = new Allie("images/luke.png", "playground", new Position(30,360));
       this.allies.obiwan = new Allie("images/obiwan.png", "playground", new Position(580,370));
       this.allies.solo = new Allie("images/solo.png", "playground", new Position(300,200));
    
        //Obstacles
         this.obstacles.obs = new Obstacle("images/obstacle1.png","playground",new Position(0,600-30-91));
         this.obstacles.obs2 = new Obstacle("images/obstacle.png","playground",new Position(20,320));
         this.obstacles.obs3 = new Obstacle("images/obstacle.png","playground",new Position(20,120));
         this.obstacles.obs4 = new Obstacle("images/obstacle3.png","playground",new Position(240,0));
         this.obstacles.obs5 = new Obstacle("images/obstacle3.png","playground",new Position(640,120));
         this.obstacles.obs6 = new Obstacle("images/obstacle.png","playground",new Position(400,120));
         this.obstacles.obs7 = new Obstacle("images/obstacle.png","playground",new Position(300,320));
         this.obstacles.obs8 = new Obstacle("images/obstacle2.png","playground",new Position(520,330));
    }

    initialiseNiveau2(){
        this.robot = new Robot ("images/R2D2.png", "playground",new Position(20,20));
        window.document.getElementById("playground").setAttribute("style","background: url(\"images/fondPave.jpg\");border: 1px solid white");
        window.document.getElementById("niveau").innerHTML = "Niveau 2";
        //Ennemis
        this.ennemis.ennemi1 = new Ennemi("images/stormtrooper.png", "playground",new Position(190,170),0,130);
        this.ennemis.ennemi2 = new Ennemi("images/stormtrooper.png", "playground",new Position(360,390),1,200);
        this.ennemis.ennemi3 = new Ennemi("images/stormtrooper.png", "playground",new Position(570,170),0,130);
     
         //objectif
        this.objectif = new Image ("images/faucon.png", "playground",new Position((654),(500)));
     
         //Chrono
        this.chrono = new Vador("images/vador.png", "playground",new Position(0,600-90));
     
         //Allies
         this.allies.leila = new Allie("images/leila.png", "playground", new Position(330,230));
         this.allies.luke = new Allie("images/luke.png", "playground", new Position(710,10));
         this.allies.solo = new Allie("images/solo.png", "playground", new Position(30,370));
     
         //Obstacles
         this.obstacles.obs = new Obstacle("images/obstacleN2_2.png","playground",new Position(20,600-30-91));
         this.obstacles.obs2 = new Obstacle("images/obstacleN2_4.png","playground",new Position(260,120));
         this.obstacles.obs4 = new Obstacle("images/obstacleN2_4.png","playground",new Position(410,120));
         this.obstacles.obs5 = new Obstacle("images/obstacleN2_4.png","playground",new Position(10,120));
         this.obstacles.obs6 = new Obstacle("images/obstacleN2_4.png","playground",new Position(650,120));
         this.obstacles.obs3 = new Obstacle("images/obstacleN2_4.png","playground",new Position(10,300));
         this.obstacles.obs7 = new Obstacle("images/obstacleN2.jpg","playground",new Position(260,160));
         this.obstacles.obs8 = new Obstacle("images/obstacleN2.jpg","playground",new Position(640,250));   
    }

    //animation de fin quand tous les niveaux sont terminées
    fin(){  
        
        //si l'objectif est null (première fois que la méthode fin est appelée) crée l'objectif et affiche un message de félicitation
        if(this.objectif == null){
            this.felicitation = document.createElement('img');
            this.felicitation.setAttribute('src',"images/felicitations.png");
            this.felicitation.setAttribute("style","position : absolute; top :100px; left:125px")
            window.document.getElementById("playground").appendChild(this.felicitation);
            game.objectif = new Sprite ("images/faucon.png", "playground",new Position((654),(500)));
        }
        
        //déplacement de l'objectif
        if(this.objectif.position.y > 430){
            
            this.objectif.moveRel(new Position(-1,-2));
        }
        if(this.objectif.position.y <= 430){
            this.objectif.moveRel(new Position(-2,-1));
        }
        if(this.objectif.position.x <= 1){
            this.objectif.img.remove();
        }
    }

    //relance le premier niveau du jeu
    retourNiveau1(){
        //efface le message de félicitation s'il existe (après la page de fin du jeu)
        if(this.felicitation != null){
            this.felicitation.remove();
            this.felicitation = null;
            this.termine = false;
        }
        //reinitialise le jeu et remet les paramètres au niveau 1
        this.reInitisalise();
        this.niveau = 1;
        this.initialiseNiveau1();
    }

    //relance le niveau actuel (réinitialise le jeu et remet le niveau actuel)
    recommenceNiveau(){
        this.reInitisalise();
        switch(this.niveau){
            case 1 :
                this.initialiseNiveau1();
                break;
            case 2 :
                this.initialiseNiveau2();
                break;
            default :
                break;
        }
    }

}