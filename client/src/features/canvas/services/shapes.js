
export default class Shapes {
    constructor(canvas,shape,line,border){
        this.x = null;
        this.y = null;
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
        this.height = null;
        this.width = null;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.linewidth = line;
        this.borderwidth = border;
        this.frame = 10;

    }

    move(x,y){
        if(!this.initx){
            this.initx = x;
            this.inity = y;
        }else{
            this.movex = this.initx -  x ;
            this.movey = this.inity -  y ;
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
        this.context.lineWidth = this.borderwidth;
        this.context.rect(this.x,this.y,this.width,this.height)
        this.context.stroke()
    }

    while_moving(){
        
    }
}