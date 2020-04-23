/*
Classe Position
*/
class Position{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    
    //retourne une nouvelle Position qui est la somme de this et celle passée en paramètr
    add(position){
        return new Position(this.x + position.x, this.y + position.y);
    }
}

/*
Classe Hitbox
*/
class Hitbox{

    constructor(position,width,height){
        this.position = position;
        this.width = width;
        this.height = height;
    }

    areIntersecting(hitbox){
        if(((this.position.x+this.width)<hitbox.position.x) 
        || ((hitbox.position.x+hitbox.width)<this.position.x)
        || ((this.position.y+this.height)<hitbox.position.y)
        || ((hitbox.position.y+hitbox.height)<this.position.y)){
            return false;
        }
        return true;
    }  
}

/*
Classe Image
*/
class Image{

    constructor(imgPath, dom,position){
        this.position = position;
        //récupère l'élément conteneur
        this.insideDOM=window.document.getElementById(dom);
        // crée un élément image
        this.img = document.createElement("img");
        //lui ajoute l'attribut src avec le chemin vers l'image fourni en paramètre
        this.img.setAttribute("src",imgPath);
        //lui attribut une position relative
        this.img.setAttribute("style",'position : absolute');
        //règle sa position en css en fonction de l'attribut position de l'objet
        this.img.style.left = this.position.x+"px"; 
        this.img.style.top = this.position.y+"px";
        //ajoute cet élément créé dans le conteneur
        this.insideDOM.appendChild(this.img);
        this.width = this.img.naturalWidth;
        this.height = this.img.naturalHeight;
        this.hitbox = new Hitbox(this.position,this.width,this.height)
        if(this.width == 0 || this.height == 0){
            console.log("Height width image: "+imgPath);
        }
        if(this.hitbox.width == 0 || this.hitbox.height == 0){
            console.log("Height width hitbox: "+imgPath);
        }
    }

    //vérifie que la postion en paramètre est dans l'élément insideDOM de this
    insideDOMcontient(position){
        let insideDOMCss = window.getComputedStyle(this.insideDOM);
        if(position.x >= 0 && position.x <= (parseInt(insideDOMCss.width)-this.width) && position.y >= 0 && position.y <= (parseInt(insideDOMCss.height)-this.height)){
            return true;
        }
        return false;
    }
}

/*
Classe Obstacle
*/
class Obstacle extends Image{

    constructor(imgPath, dom,position){
        super(imgPath,dom,position);
    }
}

/*
Classe Allie
*/
class Allie extends Image{

    constructor(imgPath, dom,position){
        super(imgPath,dom,position);
        this.sauve = false;
    }

    estSauve(){
        this.img.remove();
        this.sauve = true;
    }
}

/*
Classe Sprite
*/
class Sprite extends Image{

    constructor(imgPath, dom, position){
        super(imgPath,dom,position);
        this.speedX= 0.2;
        this.speedY= 0.2;
    }
    
    //déplace sans transition le Sprite à la position passée en paramètre
    moveTo(position){
        //vérifie que la position fournie est correcte et que le sprite ne sortira pas de son élément conteneur
        if(this.insideDOMcontient(position)){
            this.position = position;
            this.hitbox.position = position;
            this.img.style.left = position.x+"px"; 
            this.img.style.top = position.y+"px";
        }
    }

    //ajoute la position fournie à la position actuelle poir déplacer le Sprite avec transition
    moveRel(position,duration) {
        const nouvellePos = this.position.add(position);
        if(this.insideDOMcontient(nouvellePos)){
            //boucle pour chaque frame
            const deplacement = new Position (this.speedX*duration,this.speedY*duration);
            let time = window.setInterval(function (){
                    if(this.position.x == nouvellePos.x && this.position.y == nouvellePos.y){
                        clearInterval(time);
                    }
                    let tempPos = this.position.add(deplacement);
                    //si la nouvelle position dépasse l'arrivé souhaitée dans un un des axes, est corrigé
                    if(tempPos.x > nouvellePos.x){
                        tempPos.x = nouvellePos.x;
                    }
                    if(tempPos.y > nouvellePos.y){
                        tempPos.y = nouvellePos.y;;
                    } 
                    //déplace le sprite
                    this.moveTo(tempPos);

            }.bind(this), duration);
        }
    }
}


/*
Classe Robot
*/
class Robot extends Sprite{

    constructor(imgPath, dom,position){
        super(imgPath, dom,position);
    }
}

/*
Classe Ennemi
*/
class Ennemi extends Sprite{

    constructor(imgPath, dom, position, orientation, amplitude){
        super(imgPath, dom,position);
        this.orientation = orientation;
        //déplacement à l'horizontal
        if(orientation == 1){
            this.quart1 = this.position.add(new Position(amplitude,0));
            this.quart0 = this.position.add(new Position(-amplitude,0));
        }
        //déplacement à la vertical
        if(orientation == 0){
            this.quart1 = this.position.add(new Position(0,amplitude));
            this.quart0 = this.position.add(new Position(0,-amplitude,0));
        }
        this.direction = 1;
    }

    patrouiller(duree){
        let vitesse = 1;
        //si déplacement à l'horizontal
        if(this.orientation == 1){
            if(this.direction == 1){//se dirige vert quart1
                //si dépasse la position, va à la position
                if((this.position.x+vitesse) > this.quart1.x){
                    vitesse = this.quart1.x-this.position.x;
                }
                this.moveRel(new Position(vitesse,0),duree);
                //si atteint la position, change de direction
                if(this.position.x == this.quart1.x && this.position.y == this.quart1.y){
                    this.direction = 0;
                }
            } else{ //this.direction == 0 donc se dirige vers quart0
                if(this.direction == 0){
                    //si dépasse la position, va à la position
                    if((this.position.x-vitesse) < this.quart0.x){
                        vitesse = this.quart0.x-this.position.x;
                    }
                    this.moveRel(new Position(-vitesse,0),duree);
                    //si atteint la position change de direction
                    if(this.position.x == this.quart0.x && this.position.y == this.quart0.y){
                        this.direction = 1;
                    }
                }
            }
        }
        //si déplacement à la verticale
        if(this.orientation == 0){
            if(this.direction == 1){//se dirige vert quart1
                //si dépasse la position, va à la position
                if((this.position.y+vitesse) > this.quart1.y){
                    vitesse = this.quart1.y-this.position.y;
                }
                this.moveRel(new Position(0,vitesse),duree);
                //si atteint la position, change de direction
                if(this.position.x == this.quart1.x && this.position.y == this.quart1.y){
                    this.direction = 0;
                }
            } else{ //this.direction == 0 donc se dirige vers quart0
                if(this.direction == 0){
                    //si dépasse la position, va à la position
                    if((this.position.y-vitesse) < this.quart0.y){
                        vitesse = this.quart0.y-this.position.y;
                    }
                    this.moveRel(new Position(0,-vitesse),duree);
                    //si atteint la position change de direction
                    if(this.position.x == this.quart0.x && this.position.y == this.quart0.y){
                        this.direction = 1;
                    }
                }
            }
        }
    }
}

/*
Class Vador
*/

class Vador extends Sprite{   
    constructor(imgPath, dom,position){
        super(imgPath, dom,position);
        this.speedX=0.1;
    }

    avancer(duree){
        this.moveRel(new Position(1,0),duree);
    }
}

