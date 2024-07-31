import React from "react";
import '../styles/UsersList.css'
import '../styles/Popup.css'


function UsersPopup(props) {

    return(
        <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`} id={`${props.name}-popup`}
             onMouseDown={props.onOverlayClose}>
            <div className="popup__container popup__form-container popup__users-list">
                <button className="popup__exit-button" type="button" onClick={props.onClose}></button>
                {props.users.length ?
                        <div className='users-list'>
                            <h2 className="popup__title">Участники чата:</h2>
                            {props.users.map((user) => (
                                <div className='user' key={user._id}>
                                    <p className='user__info user__info-popup'>{user.name} </p>
                                    {(props.chat.owner === props.currentUser._id) && (props.chat.owner !== user._id) ?
                                        <button className='kick-button' onClick={() => props.onKick(props.chat._id ,user._id)}/> : <></>
                                    }
                                </div>
                            ))}
                        </div> : <></>}
            </div>
        </div>
    )
}

export default UsersPopup