import Shapes from "./shapes";

export default class Circle extends Shapes {
    constructor(canvas) {
        super(canvas.current,1,10,1);
        this.cx =null;
        this.cy = null;
        this.r = null; 
        this.MinDist = 50 + 10 * this.linewidth;
        this.val = 1;

    }

    setsize(){
        this.x = (this.cx - this.r)-this.frame/2 ;
        this.y = (this.cy - this.r)-this.frame/2;

        this.width = this.height = 2 * this.r + this.frame; 
    }

    draw(x, y, r) {
        this.r = r;
        let rect = this.canvas.getBoundingClientRect();
        x = x - rect.left;
        y = y - rect.top;
        this.cx = x;
        this.cy = y;
        this.context.beginPath();
        this.context.lineWidth = this.linewidth
        this.context.arc(x, y, r, 0, 2 * Math.PI);
        this.context.stroke();
        this.setsize();
    }

    redraw() {
        this.context.beginPath();
        this.context.lineWidth = this.linewidth
        this.cx -= this.movex;
        this.cy -= this.movey;
        this.context.arc( this.cx , this.cy , this.r, 0, 2 * Math.PI);
        this.context.stroke();
        this.x -= this.movex;
        this.y -= this.movey;
        (this.drag || this.hover) && this.border()
        this.movex = 0;
        this.movey = 0;
    }

    hovering_over(x,y){
        let rect = this.canvas.getBoundingClientRect();
        x = x - rect.left;
        y = y - rect.top;

        let dist = Math.abs(Math.pow(Math.abs(x-this.cx),2) + Math.pow(Math.abs(y - this.cy),2) -  Math.pow(this.r,2))

        if (dist > -this.MinDist && dist < this.MinDist) {
            this.hover = true;
            return true;
        }
        this.hover = false;
        return false;
    }
}