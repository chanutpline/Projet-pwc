
const robot = new Robot ("images/R2D2.png", "playground",new Position(20,20));
let game = new Game(robot);

//Ennemis
const ennemi1 = new Ennemi("images/stormtrooper.png", "playground",new Position(160,200),0,180);
game.ennemi1 = ennemi1;
const ennemi2 = new Ennemi("images/stormtrooper.png", "playground",new Position(530,20),1,220);
game.ennemi2 = ennemi2;
const ennemi3 = new Ennemi("images/stormtrooper.png", "playground",new Position(470,200),1,120);
game.ennemi3 = ennemi3;

//Objectif
const faucon = new Image ("images/faucon.png", "playground",new Position((800-146),(600-100)));
game.faucon = faucon;

//Chrono
let vador = new Vador("images/vador.png", "playground",new Position(0,600-90));
game.vador = vador;

//Allies
const luke = new Allie("images/luke.png", "playground", new Position(30,360));
game.luke = luke;
game.lukeSauve = false;
const leila = new Allie("images/leila.png", "playground", new Position(580,370));
game.leila = leila;
game.leilaSauve = false;
const solo = new Allie("images/solo.png", "playground", new Position(300,200));
game.solo = solo;
game.soloSauve = false;


//Obstacles
const obs = new Obstacle("images/obstacle1.png","playground",new Position(0,600-30-91));
const obs2 = new Obstacle("images/obstacle.png","playground",new Position(20,320));
const obs3 = new Obstacle("images/obstacle.png","playground",new Position(20,120));
const obs4 = new Obstacle("images/obstacle4.png","playground",new Position(240,0));
const obs5 = new Obstacle("images/obstacle4.png","playground",new Position(640,120));
const obs6 = new Obstacle("images/obstacle.png","playground",new Position(400,120));
const obs7 = new Obstacle("images/obstacle.png","playground",new Position(300,320));
const obs8 = new Obstacle("images/obstacle2.png","playground",new Position(520,330));


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


    const move = 10;
        
    if(game.ArrowLeft){
        robot.moveRel(-move,0);
    }

    if(game.ArrowDown){
    robot.moveRel(0,move);

    }

    if(game.ArrowRight){
        robot.moveRel(move,0);
    }

    if(game.ArrowUp){
        robot.moveRel(0,-move);
    }
let Frame;
let Framep;
jeu = function (temps){
    Frame = temps;
    const duree = Frame-Framep;
    if(Framep != null){
        if(game.perdu){
            console.log("game over");
        }
        if(game.gagne){
            console.log("Félicitations vous avez gagné !")
        }
        if(game.run && !game.perdu && !game.gagne){
            game.updateFrame(10);
            Framep = Frame;
            window.requestAnimationFrame(jeu);   
        }
        if(!game.run) {
            Framep = Frame;
            window.requestAnimationFrame(jeu);
        }
    } else {  
        Framep = Frame;
        window.requestAnimationFrame(jeu);   
    }
}
jeu(0);
