import { updateNode } from "../../../database/services/indexedDB";
import Circle from "./circle";
import Line from "./line";
import Rectangle from "./rectangle";

export class Node{
    constructor(){
        this.prev = null;
        this.next = null;
        this.val =[];
    }
}

export class Node_cache{
    constructor(){
        this.prev = null;
        this.next = null;
        this.cache = [];
        this.visited = false;
    }
}

export class CanvasTree{
    constructor(canvas){
        this.root = root;
        this.current_node = new Node();
        this.current_cache = new Node_cache();
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.animate = false;
        this.scale = 1;
        this.step = 0.1;
        this.canvas_color = 'white';
        this.screensize = {min:.2,max:2};
        this.x = 0;
        this.y = 0;
        this.saved = false;
        this.uptodate = false;
    }

    async save(){
        await updateNode(localStorage.getItem('whiteboard'),this.current_cache,this.screenshot());
        return;
    }

    storecache(element){
        let newcache = new Node_cache();
        newcache.cache = [...this.current_cache.cache,element.cache()];
        newcache.prev = this.current_cache;
        this.current_cache.next = newcache;
        this.current_cache = newcache;
    }

    screenshot(){
        return this.canvas.toDataURL('image/png');
    }

    convertcache(node,cache,cur_cache){
        let newval = [];
        cache.cache.map((e)=>{

            if(e.shape === "line"){
                let shape = new Line(this.canvas);
                shape.Border = e.Border;
                shape.linewidth = e.linewidth;
                shape.prev = e.prev;
                shape.borderwidth = e.borderwidth;
                shape.canvasPos = e.canvasPos;
                newval.push(shape);
            }else{
                let shape ; 
                if(e.shape === 'circle'){
                    shape = new Circle(this.canvas);
                }else{
                    shape = new Rectangle(this.canvas);
                }
                shape.Border = e.Border;
                shape.linewidth = e.linewidth;
                shape.borderwidth = e.borderwidth;
                shape.canvasPos = e.canvasPos;
                shape.det = e.det;
                newval.push(shape);
            }
        })
        node.val = newval;
        cur_cache.cache = cache.cache;
        cache.visited = true;
        if( cache.next != null && !cache.next.visited ){
            node.next = new Node();
            cur_cache.next = new Node_cache();
            node.next.prev = node;
            cur_cache.next.prev = cur_cache;
            this.convertcache(node.next,cache.next,cur_cache.next);
        }

        if( cache.prev != null && !cache.prev.visited ){
            node.prev = new Node();
            cur_cache.prev = new Node_cache();
            node.prev.next = node;
            cur_cache.prev.next = cur_cache;
            this.convertcache(node.prev,cache.prev,cur_cache.prev);
        }

        return;
    }

    add(element){
        if(this.current_node.next !== null) this.current_node.next = null; 
        let newnode = new Node();
        newnode.val = [...this.current_node.val,element] ;
        newnode.prev = this.current_node;
        this.current_node.next = newnode;
        this.current_node = newnode;
        this.storecache(element);
        this.save();
    }

    back(){
        if(this.current_node.prev !== null){
            this.current_node = this.current_node.prev;
            this.current_cache = this.current_cache.prev;
            this.draw();
        this.save();
        }
    }

    next(){
        if(this.current_node.next !== null){
            this.current_node = this.current_node.next;
            this.current_cache = this.current_cache.next;
            this.draw();
        this.save();

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
        this.current_node.val.forEach(element => element.resize(this.scale,this.x,this.y));
        this.save();
    }

    Move(mouse){
        let arr = this.current_node.val;
        let value = 0;
        let touched_element = null;
        for(let i =0;i<arr.length;i++){
        if(arr[i].isHoveringOver(mouse.current.x,mouse.current.y)){
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