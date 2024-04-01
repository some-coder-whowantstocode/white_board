import React, { useEffect, useRef } from "react";

import {
    Bottom,
    Sidebar,
    Logo,
    Middle,
    Nav,
    Top,
    Element,
    NavBox,
    App_logo,
    Menu,
} from "../styles/filenav";
import { useFile } from "../context/FileContext";
import { useNavigate } from "react-router-dom";
import { pagelocation } from "../../../pages/pagesheet";
import home from '../../../assets/white board logo.png'

const FileNav = () => {
    const { FILE_CONTROL, width, setwidth, width_limit, BurgerMenu, selected } =
    useFile();

    const navref = useRef(null);
    const resizeref = useRef(null);
    const time = useRef({ last: 0, limit: 50 });

    const handlemousemove = (e) => {
    let now = new Date().getTime();
    if (now - time.current.last > time.current.limit) {
      time.current.last = now;
      setwidth((curstate) => {
        let newstate = curstate + e.movementX;
        if (newstate > width_limit.max) {
          return width_limit.max;
        } else if (curstate === width_limit.logo) {
          if (e.movementX <= 0) return width_limit.logo;
          else return width_limit.min;
        } else if (newstate < width_limit.min) {
          return width_limit.logo;
        } else {
          return newstate;
        }
      });
    }
    };

    useEffect(() => {
    const resizer = resizeref.current;

    const handlemousedown = (e) => {
      e.preventDefault();
      window.addEventListener("mousemove", handlemousemove);
    };

    const handlemouseup = (e) => {
      window.removeEventListener("mousemove", handlemousemove);
    };

    resizer.addEventListener("mousedown", handlemousedown);
    window.addEventListener("mouseup", handlemouseup);

    return () => {
      resizer.removeEventListener("mousedown", handlemousedown);
      window.removeEventListener("mouseup", handlemouseup);
    };
    }, []);

    const navigate = useNavigate();

    return (
    <NavBox>
        <Nav ref={navref} style={{ width: `${width}px`, transition: "all 0.2s" }}>
        <Top width={`${width === width_limit.logo}`}>
            <Menu width={`${width === width_limit.logo}`}
            onClick={ () => {
              BurgerMenu.func();
          }}
            >
            <Logo >
                {React.createElement(BurgerMenu.icon, {
                
                })}
            </Logo>
            </Menu>
            <App_logo 
            width={`${width === width_limit.logo}`}>
            <Logo
            onClick={()=>navigate(pagelocation.canvas)}
            >  
                <img src={home} alt=""   />
            </Logo>
            <p>name</p>
            </App_logo>
        </Top>
        <Middle>
            {FILE_CONTROL.map((f,i) => (
            <Element
            key={i+"th file element"}
                width={`${width === width_limit.logo}`}
                onClick={() => f.func()}
                selected={selected === f.name }
            >
                <Logo>{React.createElement(f.icon, {})}</Logo>
                <p>{f.name}</p>
            </Element>
            ))}
        </Middle>
        <Bottom></Bottom>
        </Nav>
        <Sidebar ref={resizeref}></Sidebar>
    </NavBox>
    );
};

export default FileNav;
