import Shapes from "./shapes";

export default class Line extends Shapes{
    constructor(canvas){
        super(canvas,0,4,1);
        this.right = null;
        this.bottom = null;
        this.prev = [];
        this.MinDist = this.linewidth;
        this.val = 0;
    }

        setsize(x,y){

            if(this.x === null || this.x > x - this.frame/2){
                this.x = x - this.frame/2;
            } 

            if(this.y === null || this.y > y - this.frame/2){
                this.y = y - this.frame/2;
            } 
            if(this.right === null || this.right < x+ this.frame){
                this.right = x + this.frame;
            } 

            if(this.bottom === null || this.bottom < y+ this.frame){
                this.bottom =y+ this.frame;
            } 
            this.width = Math.abs(this.x - this.right) ;
            this.height = Math.abs(this.y - this.bottom);

        }

        resize(scale){
            this.scale = scale;
        }

        draw(x,y,scale){
            this.scale = scale
            let rect = this.canvas.getBoundingClientRect();
            x = x- rect.left;
            y = y - rect.top;
            let pos = {x,y};
            this.prev.push(pos);
            this.context.lineWidth = this.linewidth * this.scale;
            this.context.lineTo(x, y);
            this.context.stroke();
            this.setsize(x,y);
        }

        redraw(){
            this.context.lineWidth = this.linewidth * this.scale;
            this.context.beginPath();
            this.prev = this.prev.map((POS)=>{
                POS.x = POS.x - this.movex;
                POS.y = POS.y - this.movey;
                this.context.lineTo(POS.x,POS.y);
                this.context.stroke();
                return POS;
            })

            this.x -= this.movex;
            this.y -= this.movey;

            (this.drag || this.hover) && this.border()
            this.movex = 0;
            this.movey = 0;
        }

        // issue with changing scale 
        hovering_over(x,y){
            // console.log(this.scale)
            let rect = this.canvas.getBoundingClientRect();
            x = x - rect.left;
            y = y - rect.top;

            const extensionx = (this.canvas.width - (this.canvas.width * this.scale) )/2;
            const exty = (this.canvas.height - (this.canvas.height * this.scale) )/2

            console.log("X",x, (this.canvas.width - (this.canvas.width * this.scale) )/2 + (this.x * this.scale),(this.x * this.scale) +  (this.width * this.scale))
            console.log("Y",y, (this.canvas.height - (this.canvas.height * this.scale) )/2 + (this.y * this.scale),(this.y * this.scale) + (this.height * this.scale))

            if(x < extensionx + (this.x * this.scale) ||
             y < exty + (this.y * this.scale) ||
              x > extensionx + (this.x * this.scale) +  (this.width * this.scale) ||
               y > exty + (this.y * this.scale) + (this.height * this.scale) ){
                this.hover = false;
                return false;
                }

            this.hover = true;
            return true;
        }

        

}