import React from "react";
import '../styles/NavBar.css'
import {NavLink, useLocation} from "react-router-dom";

function NavBar(props) {

    const location = useLocation();

    const authPath = () => {
        return location.pathname === '/sign-in' ?
            <NavLink to='/sign-up' className={({isActive}) => `menu__link 
                ${isActive ? "menu__link_active" : ""}`}>Регистрация</NavLink> :
            <NavLink to='/sign-in' className={({isActive}) => `menu__link 
                ${isActive ? "menu__link_active" : ""}`}>Войти</NavLink>
    }

    return(
        <nav className={`menu`}>
            {props.loggedIn ?
                <>
                    <NavLink to='/chat-list' className={({isActive}) => `menu__link 
                    ${isActive ? "menu__link_active" : ""}`}>Список комнат</NavLink>
                    <NavLink to='/sign-in' onClick={() => props.logOut()} className={({isActive}) => `menu__link 
                    ${isActive ? "menu__link_active" : ""}`}>Выйти</NavLink>
                </> : ''}
            {!props.loggedIn ? authPath() : ''}
        </nav>
    );
}

export default NavBar