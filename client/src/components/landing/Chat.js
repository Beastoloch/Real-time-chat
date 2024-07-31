import React, {useEffect, useState} from "react";
import '../styles/Header.css'
import '../styles/Chat.css'
import sendIcon from '../../images/send.svg'
import {Link, useParams} from "react-router-dom";

function Chat(props) {

    const [value, setValue] = useState('');
    const [scrollNum, setScrollNum] = useState(100);
    let {id} = useParams();

    useEffect(() => {
        props.getInfo(id);
        console.log(props.messages);
    }, [])

    useEffect(() => {
        const messages = document.getElementById('messages');
        messages.scroll({
            top: scrollNum,
            behavior: "smooth",
        })
        setScrollNum(scrollNum+100);
        console.log(scrollNum);
    }, [props.messages])

    function sendMessage (e)  {
        e.preventDefault();
        const message = {
            owner: props.currentUser.name,
            userId: props.currentUser._id,
            roomId: id,
            text: value,
            id: Date.now(),
            event: 'message'
        }
        console.log(message);
        props.sendMessage(message);
        setValue('');
    }

    return(
        <div className="center">
            <div className="main-block">
                <div className='chat-info'>
                    <p className='chat-title'>{props.chatInfo.name}</p>
                    <p className='chat-counter' onClick={() => props.handlePopupClick()}>{props.users ?
                        props.users.length : 0} участников</p>
                </div>
                <div className="messages" id='messages'>
                    {props.messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                    Пользователь {mess.username} подключился
                                </div> : mess.roomId === id ?
                                    <div className="message">
                                        <span className='message-user'>{mess.owner}:</span>{mess.text}
                                    </div> : <></>
                            }
                        </div>
                    ).reverse()}
                </div>
                <form className="form form-input" onSubmit={sendMessage}>
                    <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                    <img className='button-send' onClick={sendMessage} src={sendIcon}/>
                </form>
            </div>
        </div>
    );

}

export default Chat