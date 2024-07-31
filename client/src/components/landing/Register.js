import React, {useRef} from "react";
import '../styles/Auth.css'
import {Link} from "react-router-dom";

function Register(props) {

    const loginRef = useRef();
    const passwordRef = useRef();
    const passwordRptRef = useRef();

    function handleSubmit(e){
        e.preventDefault();
        if(passwordRef.current.value === passwordRptRef.current.value)
            props.onSubmit({
                name: loginRef.current.value,
                password: passwordRef.current.value
            })
    }

    return(
        <div className='auth'>
            <h2 className='auth__title'>Регистрация</h2>
            <form className='form-auth' onSubmit={handleSubmit}>
                <input className='form-auth__input' type='text' placeholder='Логин' id='login-input' name='login'
                       required minLength="2" maxLength="40" ref={loginRef}/>
                <input className='form-auth__input' type='password' placeholder='Пароль' id='password-input'
                       name='password'
                       required minLength="2" maxLength="40" ref={passwordRef}/>
                <input className='form-auth__input' type='password' placeholder='Повторите пароль'
                       id='password-repeat-input' name='password' required minLength="2" maxLength="40"
                       ref={passwordRptRef}/>
                <button className='auth__admit-button' type="submit">Зарегистрироваться</button>
            </form>
            <div className='auth__switch'>
                <p className='auth__link-text'>Уже зарегестрированы?
                    <Link to='/sign-in' className='auth__switch-link'> Войти</Link>
                </p>
            </div>
        </div>
    );
}

export default Register