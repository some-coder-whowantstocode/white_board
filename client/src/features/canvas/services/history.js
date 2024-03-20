export class Node{
    constructor(){
        this.prev = null;
        this.next = null;
        this.val =[];
    }
}

export class CanvasTree{
    constructor(canvas,root){
        this.root = root;
        this.current_node = root;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.nodes = [];
        this.animate = false;
        this.scale = 1;
        this.step = 0.1;
        this.canvas_color = 'white';
        this.screensize = {min:.2,max:2};
        this.x = 0;
        this.y = 0;
    }

    add(element){
        if(this.current_node.next !== null) this.current_node.next = null; 
        let newnode = new Node();
        newnode.val.push(element) ;
        newnode.prev = this.current_node;
        this.current_node.next = newnode;
        this.current_node = newnode;
        this.nodes.push(newnode)
    }

    back(){
        if(this.current_node.prev !== null){
            this.current_node = this.current_node.prev;
            this.draw();
        }
    }

    next(){
        if(this.current_node.next !== null){
            this.current_node = this.current_node.next;
            this.draw()
        }
    }

    clear(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
    
    draw(){
        this.clear();
        this.context.save();
        this.x = (this.canvas.width - (this.canvas.width * this.scale) )/2;
        this.y = (this.canvas.height - (this.canvas.height * this.scale) )/2;
        this.context.translate(this.x, this.y );
        this.context.scale(this.scale, this.scale);
        this.context.fillStyle = this.canvas_color;
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height)
        let arr = this.current_node.val;
        for(let i=0;i<arr.length;i++){
            arr[i].redraw();
        }
        this.context.restore();
    }

    /* for controlling size of canvas */
    akar_niyantranm(e){
        e.preventDefault();
        const direction = e.deltaY < 0 ? 1 : -1;
        this.scale += direction * this.step; 
        this.scale = Math.min(Math.max(this.screensize.min, this.scale), this.screensize.max);
        this.draw();
        this.current_node.val.forEach(element => element.resize(this.scale));
    }

    Move(mouse){
        let arr = this.current_node.val;
        let value = 0;
        let touched_element = null;
        for(let i =0;i<arr.length;i++){
        if(arr[i].hovering_over(mouse.current.x,mouse.current.y)){
            if(arr[i].val >= value){
            touched_element = arr[i];
            value = arr[i].val
            }
        }
        }
        if(touched_element){
        touched_element.drag = true;
        }
    }

    
}