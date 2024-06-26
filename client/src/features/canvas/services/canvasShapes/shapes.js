
export default class Shapes {
    constructor(canvas,shape,line,border){
        this.drag = false;
        this.shapes = ['line','circle','rect']
        this.shape = this.shapes[shape];
        this.hover = false;
        this.scale = 1;
        /* init x and y will be null at the start and when a mouse clicks on the element they will be locked and moved accoring to the movement of the mouse and then again they will be null */
        this.initx = null;
        this.inity = null;
        /* move x and y decide how much the element will move */
        this.movex = 0;
        this.movey = 0;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.linewidth = line;
        this.borderwidth = border;
        this.frame = 10;
        this.Border = {x:null,y:null,height:null,width:null};
        this.canvasPos = {x:null,y:null};
    }

    updateBorder(x,y){
        if(!this.initx){
            this.initx = x;
            this.inity = y;
        }else{
            this.movex = 2 *( ( this.initx -  x)/ this.scale)  ;
            this.movey = 2 *( (this.inity -  y)/ this.scale) ;
            this.initx = x;
            this.inity = y;
        }
    }

    release(){
        this.initx = this.inity =  null;
        this.drag = false;
        this.movex = this.movey = 0;
    }

    border(){
        console.log('border',this.Border.x,this.Border.y,this.Border.width,this.Border.height)
        this.context.lineWidth = this.borderwidth;
        this.context.rect(this.Border.x,this.Border.y,this.Border.width,this.Border.height)
        this.context.stroke()
    }

    resize(scale,x,y){
        this.scale = scale;
        this.canvasPos.x = x;
        this.canvasPos.y = y;
    }
}