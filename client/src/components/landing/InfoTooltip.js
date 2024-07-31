import React from "react";
import failure from "../../images/auth-message-fail.svg";
import success from '../../images/auth-message-success.svg';


function InfoTooltip(props) {

    return(
        <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`} id={`${props.name}-popup`}
             onMouseDown={props.onOverlayClose}>
            <div className="popup__container popup__form-container">
                <button className="popup__exit-button" type="button" onClick={props.onClose}></button>
                <div className='popup__auth'>
                    <img className="popup__auth-image" alt={props.authMessage.title}
                         src={(props.authMessage.img === 'failure') ? failure : success}/>
                    <h2 className="popup__title">{props.authMessage.title}</h2>
                </div>
            </div>
        </div>
    )
}

export default InfoTooltip