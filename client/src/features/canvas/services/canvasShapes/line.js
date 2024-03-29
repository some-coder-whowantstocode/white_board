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

        setBorderWidth(x){
            if(this.Border.x === null || this.Border.x > x - this.frame/2){
                this.Border.x = x - this.frame/2;
            } 

            if(this.right === null || this.right < x+ this.frame){
                this.right = x + this.frame;
            } 

            this.Border.width = Math.abs(this.Border.x - this.right) ;
        }

        setBorderHeight(y){
            if(this.Border.y === null || this.Border.y > y - this.frame/2){
                this.Border.y = y - this.frame/2;
            }

            if(this.bottom === null || this.bottom < y+ this.frame){
                this.bottom =y+ this.frame;
            } 
            this.Border.height = Math.abs(this.Border.y - this.bottom);
        }

        setBorders(x,y){
            this.setBorderWidth(x);
            this.setBorderHeight(y);
        }

        adjustCoordinates(x,y,scale,canvasx,canvasy){
            this.scale = scale
            this.canvasPos.x = canvasx;
            this.canvasPos.y = canvasy;
            let rect = this.canvas.getBoundingClientRect();
            x = x - rect.left;
            y = y - rect.top;
            /* pos is for finding accurate position within canvas so that the position i draw a picture persists its position even if the scale is different */
            let pos = {x:(x-canvasx) / scale,y:(y-canvasy)/scale};
            this.prev.push(pos);
            return {x,y};
        }

        draw(x,y,scale,canvasx,canvasy){
            let coordinates = this.adjustCoordinates(x,y,scale,canvasx,canvasy);
            this.context.lineWidth = this.linewidth * this.scale;
            this.context.lineTo(coordinates.x,coordinates.y);
            this.context.stroke();
            this.setBorders((x - canvasx)/this.scale ,(y - canvasy)/this.scale);
        }

        moveBorder(){
            this.Border.x -= this.movex;
            this.Border.y -= this.movey;
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

            this.moveBorder();

            (this.drag || this.hover) && this.border()
            this.movex = 0;
            this.movey = 0;
        }

        isHoveringOver(x, y) {
            const rect = this.canvas.getBoundingClientRect();
            const adjustedX = x - rect.left;
            const adjustedY = y - rect.top;
        
            const isWithinXBounds = adjustedX >= this.canvasPos.x + (this.Border.x * this.scale) &&
             adjustedX <= this.canvasPos.x + (this.Border.x * this.scale) + (this.Border.width * this.scale);
            
            const isWithinYBounds = adjustedY >= this.canvasPos.y + (this.Border.y * this.scale) &&
             adjustedY <= this.canvasPos.y + (this.Border.y * this.scale) + (this.Border.height * this.scale);
        
            this.hover = isWithinXBounds && isWithinYBounds;
        
            return this.hover;
        }

        cache(){
            return {
                shape:this.shape,
                Border:this.Border,
                linewidth:this.linewidth,
                prev:this.prev,
                borderwidth:this.borderwidth,
                canvasPos:this.canvasPos
            }
        }
}