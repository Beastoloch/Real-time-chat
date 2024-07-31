import React, {useEffect, useRef} from "react";
import PopupWithForm from "./PopupWithForm";

function AddRoomPopup(props) {

    const nameRef = useRef();

    useEffect(() => {
        nameRef.current.value = '';
    }, [props.isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        props.onSubmit({
            name: nameRef.current.value
        });
    }

    return(
        <PopupWithForm title="Создание комнаты" name="room" button={props.btnMessage} isOpen={props.isOpen}
                       onClose={props.onClose} onSubmit={handleSubmit} onOverlayClose={props.onOverlayClose}>
            <input className="form__input form__input_type_avatar" type="text" placeholder="Название комнаты"
                   id="room-name" name="room-name" required ref={nameRef}/>
        </PopupWithForm>
    );
}

export default AddRoomPopup;