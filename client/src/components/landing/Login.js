import React, {useRef} from "react";
import '../styles/Auth.css'
import {Link} from "react-router-dom";

function Login(props) {

    const loginRef = useRef();
    const passwordRef = useRef();

    function handleSubmit(e){
        e.preventDefault();
        props.onSubmit({
            name: loginRef.current.value,
            password: passwordRef.current.value
        })
    }

    return(
        <div className='auth'>
            <h2 className='auth__title'>Авторизация</h2>
            <form className='form-auth' onSubmit={handleSubmit}>
                <input className='form-auth__input' type='text' placeholder='Логин' id='login-input' name='login'
                       required minLength="2" maxLength="40" ref={loginRef}/>
                <input className='form-auth__input' type='password' placeholder='Пароль' id='password-input' name='password'
                       required minLength="2" maxLength="40" ref={passwordRef}/>
                <button className='auth__admit-button' type="submit">Войти</button>
            </form>
            <div className='auth__switch'>
                <p className='auth__link-text'>Ещё не зарегистрированы? <Link to='/sign-up' className='auth__switch-link'>Зарегистрироваться</Link></p>
            </div>
        </div>
    );
}

export default Login