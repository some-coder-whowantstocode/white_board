import Shapes from "./shapes";

export default class Rectangle extends Shapes{
    constructor(canvas){
        super(canvas,2,5,1);
        this.MinDist = this.linewidth/2 
        this.rx = null;
        this.ry = null;
        this.rheight = null;
        this.rwidth = null;
        this.val = 1;
    }

    setsize(x,y,width,height){
        this.x = x - this.frame/2;
        this.y = y - this.frame/2;
        this.height = height + this.frame;
        this.width = width + this.frame;
    }

    draw(x,y,width,height){
        this.context.beginPath();
        this.rwidth = width;
        this.rheight = height;
        this.rx = x - width/2 ;
        this.ry = y - height/2;
        this.context.lineWidth = this.linewidth
        this.context.rect(this.rx,this.ry,this.rwidth,this.rheight);
        this.context.stroke();
        this.setsize(this.rx,this.ry,this.rwidth,this.rheight);
    }

    redraw(){
        this.context.beginPath();
        this.context.lineWidth = this.linewidth
        this.rx -= this.movex;
        this.ry -= this.movey;
        this.setsize(this.rx,this.ry,this.rwidth,this.rheight)
        this.context.rect( this.rx , this.ry , this.rwidth,this.rheight);
        this.context.stroke();
        (this.drag || this.hover) && this.border()
        this.movex = 0;
        this.movey = 0;
    }

    hovering_over(x,y){
        let rect = this.canvas.getBoundingClientRect();
        x = x - rect.left;
        y = y - rect.top;

        if((( x > this.rx - this.MinDist && x < this.rx + this.MinDist)  || ( x > this.rx + this.rwidth - this.MinDist && x < this.rx + this.rwidth + this.MinDist)) && (y>=this.ry && y <= this.ry + this.rheight)){
            this.hover = true;
            return true;
        }
        if((( y > this.ry - this.MinDist && y < this.ry + this.MinDist)  || ( y > this.ry + this.rheight - this.MinDist && y < this.ry + this.rheight + this.MinDist)) && (x >= this.rx && x <= this.rx + this.rwidth)){
            this.hover = true;
            return true;
        }
        this.hover = false;
        return false;
    }
}