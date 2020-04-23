/*
Classe Position
*/
class Position{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    //retourne une nouvelle Position qui est la somme de this et de celle passée en paramètre
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

    //retourne true si la hitbox passée en paramètre croise celle sur laquelle est appelée la méthode
    areIntersecting(hitbox){
        if(((this.position.x+this.width-2)<=hitbox.position.x) 
        || ((hitbox.position.x+hitbox.width-2)<=this.position.x)
        || ((this.position.y+this.height-6)<=hitbox.position.y)
        || ((hitbox.position.y+hitbox.height-6)<=this.position.y)){
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
        this.img.setAttribute("src", imgPath);
        //lui attribut une position relative
        this.img.setAttribute("style",'position : absolute');
        //règle sa position en css en fonction de l'attribut position de l'objet
        this.img.style.left = this.position.x+"px"; 
        this.img.style.top = this.position.y+"px";
        this.loadImage(this.img).then(this.processImage.bind(this)).catch(err => console.log(err));
    }

    processImage() {
        //ajoute cet élément créé dans le conteneur
        this.insideDOM.appendChild(this.img);
        this.width = this.img.naturalWidth;
        this.height = this.img.naturalHeight;
        this.hitbox = new Hitbox(this.position,this.width,this.height)
        if(this.width == 0 || this.height == 0){
            console.log("Height width image: "+ this.img.src);
        }
        if(this.hitbox.width == 0 || this.hitbox.height == 0){
            console.log("Height width hitbox: "+ this.img.src);
        }
    }

    loadImage(image) {
        return new Promise((resolve, reject) => {
          image.addEventListener("load", () => resolve(image));
          image.addEventListener("error", err => reject(err));
        });
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

    //fait disparaitre l'allie de l'écran et fait passé son attribut sauve à true quand l'allie est sauvé
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
    }
    
    //déplace sans transition le Sprite à la position passée en paramètre
    moveTo(position){
        this.position = position;
        this.hitbox.position = position;//met à jour la position de la hitbox de l'objet
        this.img.style.left = position.x+"px"; 
        this.img.style.top = position.y+"px";
    }

    //ajoute la position fournie à la position actuelle poir déplacer le Sprite avec transition
    moveRel(position) {
        const nouvellePos = this.position.add(position);
        if(this.insideDOMcontient(nouvellePos)){
            this.moveTo(nouvellePos);
            
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

    //déplacement de l'ennemi entre deux positions prédéfinies
    patrouiller(duree){
        let vitesse = 0.75;
        //si déplacement à l'horizontal
        if(this.orientation == 1){
            if(this.direction == 1){//se dirige vert quart1
                //si dépasse la position, va à la position
                if((this.position.x+vitesse) > this.quart1.x){
                    vitesse = this.quart1.x-this.position.x;
                }
                this.moveRel(new Position(vitesse,0));
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
                    this.moveRel(new Position(-vitesse,0));
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
                    this.moveRel(new Position(0,-vitesse));
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
sert à limiter le temps pour compléter un niveau
*/

class Vador extends Sprite{   
    constructor(imgPath, dom,position){
        super(imgPath, dom,position);
        this.speedX=0.1;
    }
    //déplacement de vador toujours dans la même direction
    avancer(duree){
        this.moveRel(new Position(1,0));
    }
}

