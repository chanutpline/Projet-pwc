
/*
Classe Jeu
*/
class Game {

    constructor(robot){
        this.ArrowRight = false;
        this.ArrowLeft = false;
        this.ArrowUp = false;
        this.ArrowDown = false;
        this.run = true;
        this.gagne = false;
        this.perdu = false;
        this.tFrameLast = 0;
        this.robot = robot;
        this.sauve = 3;
    }

    deplacementRobot(duree){
        const vitesseDroite = 2;
        const vitesseHor = 1;
        if(this.ArrowDown && !this.ArrowUp && !this.ArrowRight && !this.ArrowLeft){
            this.robot.moveRel(new Position(0,vitesseDroite),(duree));
        } 
        if(this.ArrowUp && !this.ArrowDown && !this.ArrowRight && !this.ArrowLeft){
            this.robot.moveRel(new Position(0,-vitesseDroite),(duree));
        } 
        if(this.ArrowLeft && !this.ArrowDown && !this.ArrowUp && !this.ArrowRight){
            this.robot.moveRel(new Position(-vitesseDroite,0),(duree));
        } 
        if(this.ArrowRight && !this.ArrowDown && !this.ArrowUp && !this.ArrowLeft){
            this.robot.moveRel(new Position(vitesseDroite,0),(duree));
        }
        if(this.ArrowDown && this.ArrowLeft){
            this.robot.moveRel(new Position(-vitesseHor,vitesseHor),(duree));
        }
        if(this.ArrowDown && this.ArrowRight){
            this.robot.moveRel(new Position(vitesseHor,vitesseHor),(duree));
        }
        if(this.ArrowUp && this.ArrowRight){
            this.robot.moveRel(new Position(vitesseHor,-vitesseHor),(duree));
        }
        if(this.ArrowUp && this.ArrowLeft){
            this.robot.moveRel(new Position(-vitesseHor,-vitesseHor),(duree));
        }
    }
    
    toucheObstacle(){
        if(this.robot.hitbox.areIntersecting(obs.hitbox)){
            return true;
        }
        if(this.robot.hitbox.areIntersecting(obs2.hitbox)){
            return true;
        }
        if(this.robot.hitbox.areIntersecting(obs3.hitbox)){
            return true;
        }
        if(this.robot.hitbox.areIntersecting(obs4.hitbox)){
            return true;
        }
        if(this.robot.hitbox.areIntersecting(obs5.hitbox)){
            return true;
        }
        if(this.robot.hitbox.areIntersecting(obs6.hitbox)){
            return true;
        }
        if(this.robot.hitbox.areIntersecting(obs7.hitbox)){
            return true;
        }
        if(this.robot.hitbox.areIntersecting(obs8.hitbox)){
            return true;
        }
        return false;
    }

    updateFrame(duree) {
        this.deplacementRobot(duree);
        this.ennemi1.patrouiller(duree);
        this.ennemi2.patrouiller(duree);
        this.ennemi3.patrouiller(duree);
        this.vador.avancer(duree);
        if(this.robot.hitbox.areIntersecting(this.ennemi1.hitbox)){
            this.perdu = true;
        }
        if(this.vador.hitbox.areIntersecting(this.faucon.hitbox)){
            this.perdu = true;
        }
        if(this.robot.hitbox.areIntersecting(this.luke.hitbox) && this.lukeSauve == false){
            this.luke.estSauve();
            this.lukeSauve = true;
        }
        if(this.robot.hitbox.areIntersecting(this.leila.hitbox) && this.leilaSauve == false){
            this.leila.estSauve();
            this.leilaSauve = true;
        }
        if(this.robot.hitbox.areIntersecting(this.solo.hitbox) && this.soloSauve == false){
            this.solo.estSauve();
            this.soloSauve = true;
        }

        if(this.sauve == 0 && this.robot.hitbox.areIntersecting(this.faucon.hitbox)){
            this.gagne = true;
        }
    }
}