import Shapes from "./shapes";

export default class Circle extends Shapes {
    constructor(canvas) {
        super(canvas,1,10,1);
        this.det = {cx:null,cy:null,r:null};
        this.MinDist = 50 + 10 * this.linewidth;
        this.val = 1;

    }

    setBorder(){
        this.Border.x = (this.det.cx - this.det.r)-this.frame/2 ;
        this.Border.y = (this.det.cy - this.det.r)-this.frame/2;

        this.Border.width = this.Border.height = 2 * this.det.r + this.frame; 
    }

    adjustCoordinates(x, y, r,scale,canvasx,canvasy){
        this.scale = scale;
        this.canvasPos.x = canvasx;
        this.canvasPos.y = canvasy;
        this.det.r = r;
        let rect = this.canvas.getBoundingClientRect();
        x = x - rect.left;
        y = y - rect.top;
        r = r * this.scale;
        this.det.cx = (x - canvasx ) / this.scale ;
        this.det.cy = (y - canvasy ) / this.scale;
        return {x,y,r};
    }

    draw(x, y, r,scale,canvasx,canvasy) {
        let modpos = this.adjustCoordinates(x, y, r,scale,canvasx,canvasy);
        this.context.beginPath();
        this.context.lineWidth = this.linewidth * scale;
        this.context.arc(modpos.x, modpos.y, modpos.r, 0, 2 * Math.PI);
        this.context.stroke();
        this.setBorder();
    }

    redraw() {
        this.context.beginPath();
        this.context.lineWidth = this.linewidth
        this.det.cx -= this.movex;
        this.det.cy -= this.movey;
        this.MinDist *= this.scale
        this.context.arc( this.det.cx , this.det.cy , this.det.r, 0, 2 * Math.PI);
        this.context.stroke();
        this.Border.x -= this.movex;
        this.Border. y -= this.movey;
        (this.drag || this.hover) && this.border()
        this.movex = 0;
        this.movey = 0;
    }

    isHoveringOver(x,y){
        let rect = this.canvas.getBoundingClientRect();
        x = x - rect.left;
        y = y - rect.top;
        const modifiedX = (this.det.cx * this.scale) + this.canvasPos.x;
        const modifiedy = (this.det.cy  * this.scale) + this.canvasPos.y;
        
        let dist = Math.abs(Math.pow(Math.abs(x- modifiedX),2) + Math.pow(Math.abs(y - modifiedy),2) -  Math.pow((this.det.r * this.scale),2))
        
        this.hover = dist > -this.MinDist && dist < this.MinDist;
        return this.hover;
    }
    cache(){
        return{
            shape:this.shape,
            Border:this.Border,
            linewidth:this.linewidth,
            borderwidth:this.borderwidth,
            canvasPos:this.canvasPos,
           det:this.det
        }
    }
}