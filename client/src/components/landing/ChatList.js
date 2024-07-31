import React, {useEffect} from "react";
import '../styles/ChatList.css'
import {useNavigate} from "react-router-dom";

function ChatList(props) {

    const navigate = useNavigate();

    // useEffect(() => {
    //     props.getUsers();
    // }, []);

    function handleRoomClick(room) {
        navigate(`/chat/${room.id}`)
    }

    return (
        <div className='users-list'>
            <div className='info-section'>
                <h2 className='user-list__title'>Список комнат</h2>
                <button className="add-button" type="button" onClick={() => props.onAddClick()}></button>
            </div>
            {props.rooms.map((room) => (
                <div className= {`user user-list ${room.isGoing ? 'user-list-going' : 'user-list-not-going'}`} key={room._id}
                     onClick={() => room.isGoing ? handleRoomClick(
                         {
                             id: room._id,
                             name: room.name
                         }) : {} }>
                    <p className='user__info'>{room.name}</p>
                    {room.isGoing ? <></> :
                        <button className="add-button button-chat" type="button" onClick={() => props.onChatClick(room._id)}></button>}
                </div>
            ))}
        </div>
    );
}

export default ChatList