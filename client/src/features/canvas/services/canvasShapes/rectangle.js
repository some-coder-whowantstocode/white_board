import Shapes from "./shapes";

export default class Rectangle extends Shapes{
    constructor(canvas){
        super(canvas,2,5,1);
        this.MinDist = this.linewidth/2 
        this.det = {rx:null,ry:null,rheight:null,rwidth:null};
        this.val = 1;
    }

    setBorder(x,y,width,height){
        this.Border.x = x - this.frame/2;
        this.Border.y = y - this.frame/2;
        this.Border.height = height + this.frame;
        this.Border.width = width + this.frame;
    }

    adjustCoordinates(x,y,width,height,scale,canvasx,canvasy){
        this.scale = scale;
        this.det.rwidth = width;
        this.det.rheight = height;
        this.canvasPos.x = canvasx;
        this.canvasPos.y = canvasy;
        x = x - (width * this.scale)/2  ;
        y = y - (height  * this.scale)/2;
        this.det.rx = (x -canvasx) / scale;
        this.det.ry = (y -canvasy) / scale;

        return {x,y};
    }

    draw(x,y,width,height,scale,canvasx,canvasy){
        let coordinates = this.adjustCoordinates(x,y,width,height,scale,canvasx,canvasy);
        this.context.beginPath();
        this.context.lineWidth = this.linewidth * this.scale;
        this.context.rect(coordinates.x,coordinates.y,this.det.rwidth * this.scale,this.det.rheight * this.scale);
        this.context.stroke();
        this.setBorder(this.det.rx,this.det.ry,this.det.rwidth,this.det.rheight);
    }

    redraw(){
        this.context.beginPath();
        this.context.lineWidth = this.linewidth
        this.det.rx -= this.movex;
        this.det.ry -= this.movey;
        this.setBorder(this.det.rx,this.det.ry,this.det.rwidth,this.det.rheight)
        this.context.rect( this.det.rx , this.det.ry , this.det.rwidth,this.det.rheight);
        this.context.stroke();
        (this.drag || this.hover) && this.border()
        this.movex = 0;
        this.movey = 0;
    }

    modifycoordinates(x,y){
        let rect = this.canvas.getBoundingClientRect();
        x = x - rect.left;
        y = y - rect.top;

        const moded ={};

        moded.mindist = this.MinDist * this.scale;
        moded.x = this.canvasPos.x + (this.det.rx * this.scale);
        moded.y = this.canvasPos.y + (this.det.ry * this.scale);
        moded.width = this.det.rwidth * this.scale;
        moded.height = this.det.rheight * this.scale;

        return moded;


    }

    isHoveringOver(x,y){
        const moded = this.modifycoordinates(x,y);

        const onXaxis =  
        x > moded.x - moded.mindist && 
        x < moded.x + moded.mindist  ||  
        x > moded.x + moded.width - moded.mindist && 
        x < moded.x + moded.width + moded.mindist && 
        y>=moded.y && y <= moded.y + moded.height;

        const onYaxis =  
        y > moded.y - moded.mindist && 
        y < moded.y + moded.mindist  ||  
        y > moded.y + moded.height - moded.mindist && 
        y < moded.y + moded.height + moded.mindist && 
        x >= moded.x && x <= moded.x + moded.width;
        
        this.hover = onXaxis || onYaxis;
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