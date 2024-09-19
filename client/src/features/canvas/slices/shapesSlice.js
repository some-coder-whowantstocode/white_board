import { createSlice, current } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

export const shapesSlice =createSlice({
    name:'canvasShapes',
    initialState:{
        linewidth:10,
        store:new Object(),
        color:'black',
        size:30,
        lineid:null,
        currentPage:1,
        maxpages:1,
        minpages:1,
        select:null,
        pages:[[]]
    },
    reducers:{
        clearshape(state){
            state.linewidth=10,
            state.store=new Object(),
            state.color='black',
            state.size=30,
            state.lineid=null,
            state.currentPage=1,
            state.maxpages=1,
            state.minpages=1,
            state.select=null,
            state.pages=[[]]
        },
        addshape(state,action){
            const { pages, color, currentPage, minpages, maxpages, size, store } = action.payload;
            pages && (state.pages = pages);
            color && (state.color = color);
            currentPage && (state.currentPage = Number(currentPage));
            minpages && (state.minpages = Number(minpages));
            maxpages && (state.maxpages = Number(maxpages));
            size && (state.size = size);
            store && (state.store = store);
        },
        addCircle(state, action){
            const { x, y} = action.payload;
            const id = uuidv4();
            state.store[id] = {
                x,
                y,
                radius:state.size,
                color:state.color,
                linewidth:state.linewidth,
                shape:'circle'
            }
        },
        updateCircle(state, action){
            const {x, y, id} = action.payload;
            const data = state.store[id];
            data.x = x;
            data.y = y;
            state.store[id] =data;
        },
        deleteShape(state,action){
            delete state.store[action.payload]
        },
        addLine(state, action){
            const { prev, border } = action.payload;
            let Line;
                Line = {
                    prev,
                    color:state.color,
                    linewidth:state.linewidth,
                    shape:'line',
                    id:uuidv4(),
                    border
                }
                if(state.currentPage < state.maxpages){
                    state.pages.splice(state.currentPage);
                    state.maxpages = state.pages.length ;
                }
                    state.pages.push([...state.pages[state.pages.length-1],Line.id]);
                    state.currentPage +=1 ;
                    state.maxpages+=1;
                state.store[Line.id] = Line;

        },
        endLine(state,action){
            if(!state.lineid) return;
            const line = state.store[state.lineid];
            if(line){
            line.border.w = line.border.w - line.border.x;
            line.border.h = line.border.h - line.border.y;
            // line.img = action.payload;
            line.scale = 1;

            }
            state.lineid = null;

        },
        updateLine(state, action){
            const { i, j } = action.payload;
            let Line = state.store[state.select.id];
            console.log(i,j)
            Line.prev = Line.prev.map(({x,y}) => {
                x += i;
                y += j;
                return {x,y}
            })
            Line.border.x += i;
            Line.border.y += j;
            Line.border.w += i;
            Line.border.h += j;
            state.store[state.select.id] = Line;
            state.select = Line;

        },
        changeLinewidth(state, action){
            state.linewidth = action.payload;
        },
        changeColor(state,action){
            state.color = action.payload;
        },
        select(state,action){
            const { x, y } = action.payload;
            state.select = null;
            state.pages[state.currentPage-1].map((id)=>{
                const element = state.store[id];
                const {border} = element;
                if((x >= border.x && x <= border.w) &&( y <= border.h && y >= border.y) ){
                    state.select = element;
                }
            })
        },
        move(state,action){
            const {x,y} = action.payload;
            switch(state.select.shape){
                case 'line':
                    state.select.prev.forEach((elem) => {
                        elem.x += x;
                        elem.y += y;
                    });
                break;
            }
            state.select.border.x += x;
            state.select.border.y += y;
        },
        release(state){
            if(state.select){
                state.select = null;
            }
        },
        undo(state){
            if(state.minpages < state.currentPage){
                state.currentPage = state.currentPage - 1;
            }
        },
        redo(state){
            if(state.maxpages > state.currentPage){
                state.currentPage += 1;
            }
        }
    }
}) 

export const { addCircle, addLine, endLine, updateCircle, deleteShape, changeLinewidth, changeColor, select, updateLine, undo, redo, addshape, clearshape } = shapesSlice.actions;

export default shapesSlice.reducer;