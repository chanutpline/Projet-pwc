
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
        this.niveau = 1;
        this.termine = false;
        //this.tFrameLast = 0;
        this.robot = robot;
        this.ennemis = {};
        this.allies = {};
        this.obstacles = {}
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
        if(!this.vaPercuter(hitoboxTest,deplacement)){
            this.robot.moveRel(deplacement,duree);
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

    updateFrame(duree) {
        
        this.deplacementRobot(duree);
        for(let attr in this.ennemis){
            this.ennemis[attr].patrouiller(duree);
        }
        if(jeu.frameNb%12 == 0){
            this.chrono.avancer(duree);
        }
        for(let attr in this.ennemis){
            if(this.robot.hitbox.areIntersecting(this.ennemis[attr].hitbox)){
                this.perdu = true;
            }
        }
        if(this.chrono.hitbox.areIntersecting(this.objectif.hitbox)){
            this.perdu = true;
        }

        for(let allie in this.allies){
            if(this.robot.hitbox.areIntersecting(this.allies[allie].hitbox) && this.allies[allie].sauve == false){
                this.allies[allie].estSauve();
            }
        }
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

    aGagne(){
        this.niveau = this.niveau+1;
        alert("Félicitations vous avez gagné !");
    }

    aPerdu(){
        alert("Vous avez perdu, mais vous pouvez retenter votre chance !");
    }

    initialiseNiveau1(){
        window.document.getElementById("playground").setAttribute("style","background: url(\"images/desert_sand.jpg\")");
        
        if(this.robot == null){
            this.robot = new Robot ("images/R2D2.png", "playground",new Position(20,20));
        }
        
        //Ennemis
        const ennemi1 = new Ennemi("images/stormtrooper.png", "playground",new Position(160,200),0,180);
        const ennemi2 = new Ennemi("images/stormtrooper.png", "playground",new Position(530,20),1,220);
        const ennemi3 = new Ennemi("images/stormtrooper.png", "playground",new Position(470,200),1,120);
        this.ennemis.ennemi1 = ennemi1;
        this.ennemis.ennemi2 = ennemi2;
        this.ennemis.ennemi3 = ennemi3;
    
        //objectif
        const faucon = new Image ("images/faucon.png", "playground",new Position((654),(500)));
       this.objectif = faucon;
    
        //Chrono
        let vador = new Vador("images/vador.png", "playground",new Position(0,600-90));
       this.chrono = vador;
    
        //Allies
        const luke = new Allie("images/luke.png", "playground", new Position(30,360));
        const obiwan = new Allie("images/obiwan.png", "playground", new Position(580,370));
        const solo = new Allie("images/solo.png", "playground", new Position(300,200));
       this.allies.luke = luke;
       this.allies.obiwan = obiwan;
       this.allies.solo = solo;
    
        //Obstacles
        const obs = new Obstacle("images/obstacle1.png","playground",new Position(0,600-30-91));
        const obs2 = new Obstacle("images/obstacle.png","playground",new Position(20,320));
        const obs3 = new Obstacle("images/obstacle.png","playground",new Position(20,120));
        const obs4 = new Obstacle("images/obstacle4.png","playground",new Position(240,0));
        const obs5 = new Obstacle("images/obstacle4.png","playground",new Position(640,120));
        const obs6 = new Obstacle("images/obstacle.png","playground",new Position(400,120));
        const obs7 = new Obstacle("images/obstacle.png","playground",new Position(300,320));
        const obs8 = new Obstacle("images/obstacle2.png","playground",new Position(520,330));
       this.obstacles.obs = obs;
       this.obstacles.obs2 = obs2;
       this.obstacles.obs3 = obs3;
       this.obstacles.obs4 = obs4;
       this.obstacles.obs5 = obs5;
       this.obstacles.obs6 = obs6;
       this.obstacles.obs7 = obs7;
       this.obstacles.obs8 = obs8;
    
    }

    initialiseNiveau2(){
        this.robot = new Robot ("images/R2D2.png", "playground",new Position(20,20));
        window.document.getElementById("playground").setAttribute("style","background: url(\"images/fond_noir.jpg\")");
         //Ennemis
         const ennemi1 = new Ennemi("images/stormtrooper.png", "playground",new Position(190,170),0,130);
         const ennemi2 = new Ennemi("images/stormtrooper.png", "playground",new Position(360,390),1,200);
         const ennemi3 = new Ennemi("images/stormtrooper.png", "playground",new Position(570,170),0,130);
         this.ennemis.ennemi1 = ennemi1;
         this.ennemis.ennemi2 = ennemi2;
         this.ennemis.ennemi3 = ennemi3;
     
         //objectif
         const faucon = new Image ("images/faucon.png", "playground",new Position((654),(500)));
        this.objectif = faucon;
     
         //Chrono
         let vador = new Vador("images/vador.png", "playground",new Position(0,600-90));
        this.chrono = vador;
     
         //Allies
         const leila = new Allie("images/leila.png", "playground", new Position(330,230));
         const luke = new Allie("images/luke.png", "playground", new Position(710,10));
         const solo = new Allie("images/solo.png", "playground", new Position(30,330));
        this.allies.solo = solo;
        this.allies.leila = leila;
        this.allies.luke = luke;
     
         //Obstacles
         const obs = new Obstacle("images/obstacle1.png","playground",new Position(0,600-30-91));
         const obs2 = new Obstacle("images/obstacle.png","playground",new Position(250,120));
         const obs4 = new Obstacle("images/obstacle.png","playground",new Position(420,120));
         const obs5 = new Obstacle("images/obstacle.png","playground",new Position(50,120));
         const obs6 = new Obstacle("images/obstacle.png","playground",new Position(660,120));
         const obs3 = new Obstacle("images/obstacle.png","playground",new Position(50,280));
         const obs7 = new Obstacle("images/obstacle2.png","playground",new Position(260,190));
         const obs8 = new Obstacle("images/obstacle2.png","playground",new Position(640,330));

        this.obstacles.obs = obs;
        this.obstacles.obs2 = obs2;
        this.obstacles.obs3 = obs3;
        this.obstacles.obs4 = obs4;
        this.obstacles.obs5 = obs5;
        this.obstacles.obs6 = obs6;
        this.obstacles.obs7 = obs7;
        this.obstacles.obs8 = obs8;
     
    }

    //animation de fin quand tous les niveaux sont terminées
    fin(){
        let faucon = new Sprite ("images/faucon.png", "playground",new Position((654),(500)));
    }

    //relance le premier niveau du jeu
    retourNiveau1(){
        this.reInitisalise();
        game.termine = false;
        game.niveau = 1;
        this.initialiseNiveau1();
    }

    //relance le niveau actuel 
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