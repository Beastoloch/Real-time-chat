import React from "react";
import NavBar from "./NavBar";
import '../styles/Header.css'
import {Link} from "react-router-dom";

function Header(props) {

    return(
        <header className='header'>
            <Link to='/home' className='header__title'>Real Time Chat</Link>
            <NavBar loggedIn={props.loggedIn} loaded={true} logOut={props.handleLogOut}/>
        </header>
    );

}

export default Header