
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
        //this.tFrameLast = 0;
        this.robot = robot;
        this.ennemis = {};
        this.allies = {};
        this.obstacles = {}
    }

    initialiseNiveau1(){
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
        const leila = new Allie("images/leila.png", "playground", new Position(580,370));
        const solo = new Allie("images/solo.png", "playground", new Position(300,200));
       this.allies.luke = luke;
       this.allies.leila = leila;
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

    reInitisalise(){
        for(let ennemi in this.ennemis){
            this.ennemis[ennemi].img.remove();
        }
        this.ennemis = {};
        for(let allie in this.allies){
            this.allies[allie].img.remove();
        }
        this.allies = {};
        for(this.obstacle in this.obstacles){
            this.obstacles[this.obstacle].img.remove();
        }
        this.obstacles = {};
        this.chrono.img.remove();
        this.objectif.img.remove();
        this.robot.img.remove();
        this.robot = new Robot ("images/R2D2.png", "playground",new Position(20,20));
        this.perdu = false;
        this.gagne = false;
        this.run = false;
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
        if(!this.vaPercuter(this.robot.hitbox,deplacement)){
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
        if(jeu.frameNb%10 == 0){
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
        alert("Félicitations vous avez gagné !");
    }

    aPerdu(){
        alert("Vous avez perdu, mais vous pouvez retenter votre chance !");
    }
}