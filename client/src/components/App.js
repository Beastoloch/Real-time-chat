/* eslint-disable */
import React, {useEffect, useRef, useState} from 'react';
import './App.css'
import Chat from "./landing/Chat";
import Header from "./landing/Header";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import MainPage from "./landing/MainPage";
import ChatList from "./landing/ChatList";
import {initialChats} from "../utils/initialChats";
import Register from "./landing/Register";
import Login from "./landing/Login";
import {registerUser, loginUser, refreshToken} from "../utils/auth";
import UsersPopup from "./landing/UsersPopup";
import InfoTooltip from "./landing/InfoTooltip";
import {authMessageFailure, authMessageSuccess, saveBtnDefault} from "../utils/constants";
import api from "../utils/Api";
import ProtectedRouteElement from "./landing/ProtectedRoute";
import AddRoomPopup from "./landing/AddRoomPopup";

function App() {
    const [messages, setMessages] = useState([]);

    const socket = useRef()
    const [connected, setConnected] = useState(true);
    const [isAnyPopupOpen, setAnyPopupState] = useState(false);
    const [isUsersPopupOpen, setUsersPopupState] = useState(false);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [isAddRoomPopupOpen, setAddRoomPopupState] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [authMessage, setAuthMessage] = useState({});
    const [chatNames, setChatNames] = useState([]);
    const [isInfoTooltipPopupOpen, setInfoTooltipPopupState] = useState(false);
    const [selectedChatUsers, setSelectedChatUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState({});
    const navigate = useNavigate();
    let UserName;

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')
        socket.current.onopen = () => {
            console.log('Socket открыт')
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const getToken = () => {
        return localStorage.getItem('jwt');
    }

    useEffect(() => {
        if(getToken()){
            if(connected) {
                api.getUserInfo(getToken())
                    .then((data) => {
                        setCurrentUser(data.data);
                        UserName = data.data.name;
                        connect();
                        api.getRooms(getToken(), data.data._id)
                            .then((rooms) => {
                                setChatNames(rooms.data.reverse());
                                console.log(rooms.data);
                            })
                        api.getMessages(getToken())
                            .then((messages) => {
                                console.log(messages.data);
                                setMessages(messages.data.reverse());
                            });

                    })
                    .catch((err)=>{
                        console.log(`Ошибка...: ${err}`);
                        setConnected(false);
                    })
            }
        }
        else {
            setConnected(false);
        }
    }, [connected]);

    const handleRegisterSubmit = (authInfo) => {
        registerUser(authInfo)
            .then((data) => {
                data ? setAuthMessage(authMessageSuccess) : setAuthMessage(authMessageFailure);
                setInfoTooltipPopupState(true);
                setAnyPopupState(true);
                navigate('/sign-in', {replace: true})
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
                setAuthMessage(authMessageFailure);
                setInfoTooltipPopupState(true);
                setAnyPopupState(true);
            });
    }

    const handleLoginSubmit = async (authInfo) => {
        await loginUser(authInfo)
            .then((data) => {
                localStorage.setItem('jwt', data.token);
                setConnected(true);
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
                setAuthMessage(authMessageFailure);
                setInfoTooltipPopupState(true);
                setAnyPopupState(true);
            })
    }

    const handleLogOut = () => {
        localStorage.clear();
        setConnected(false);
        navigate('/sign-in', {replace: true});
        setCurrentUser({});
        setSelectedChat({});
        socket.current.close();
    }

    async function handleGetRoomInfo (roomId) {
        await api.getCurrentRoom(roomId, getToken())
            .then((data) => {
                console.log(data.data.users);
                setSelectedChat(data.data);
                api.getNames(getToken() ,data.data.users)
                    .then((data) => {
                        setCurrentUsers(data.names);
                        console.log(data.names);
                    })
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
            })
    }

    function handleCreateRoom (room) {
        api.createRoom(room.name, currentUser._id, getToken())
            .then(() => {
                api.getRooms(getToken(), currentUser._id)
                    .then((data) => {
                        setChatNames(data.data);
                    })
                    .catch(err => {
                        console.log(`Ошибка...: ${err}`);
                    })
                    .finally(() => {
                        closeAllPopups();
                    })
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
            })
    }

    async function handleAddUserToRoom (roomId) {
        console.log(currentUser._id);
        await api.addUser(roomId, currentUser._id, getToken())
            .then(() => {
                api.getRooms(getToken(), currentUser._id)
                    .then((data) => {
                        setChatNames(data.data.reverse())
                    })
                    .catch(err => {
                        console.log(`Ошибка...: ${err}`);
                    })
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
            })
    }

    async function handleKickUser (roomId, userId) {
        console.log(currentUser._id);
        await api.kickUser(roomId, userId, getToken())
            .then(() => {
                api.getRooms(getToken(), currentUser._id)
                    .then((data) => {
                        setChatNames(data.data.reverse());
                        handleGetRoomInfo(roomId);
                    })
                    .catch(err => {
                        console.log(`Ошибка...: ${err}`);
                    })
            })
            .catch(err => {
                console.log(`Ошибка...: ${err}`);
            })
    }

    async function sendMessage  (message)  {
        socket.current.send(JSON.stringify(message));
    }

    const handleUsersListClick = (isOrg) => {
        setUsersPopupState(true);
        setAnyPopupState(true);
        setSelectedChatUsers(selectedChat.users);
    }

    const handleAddRoomClick = () => {
        setAddRoomPopupState(true);
        setUsersPopupState(true);
    }

    const handleOverlayClose = (evt) => {
        if(evt.target === evt.currentTarget)
            closeAllPopups();
    }

    const closeAllPopups = () => {
        setUsersPopupState(false);
        setInfoTooltipPopupState(false);
        setAddRoomPopupState(false);
        setAnyPopupState(false);
    }

    return (
        <div className='page'>
            <Header loggedIn={connected} handleLogOut={handleLogOut}/>
            <main className='content'>
                <Routes>
                    <Route path='/home' element={<MainPage/>}/>
                    <Route path='/sign-up' element={(!connected) ? <Register onSubmit={handleRegisterSubmit}/> : <Navigate to='/profile' replace />}/>
                    <Route path='/sign-in' element={(!connected) ? <Login onSubmit={handleLoginSubmit}/>  :
                        <Navigate to='/profile' replace/>}/>
                    <Route path='/chat/:id' element={<ProtectedRouteElement element={Chat} currentUser={currentUser}
                         messages={messages} sendMessage={sendMessage} getInfo={handleGetRoomInfo}
                         chatInfo={selectedChat} users={currentUsers}
                         handlePopupClick={handleUsersListClick} loggedIn={connected}/>}/>
                    <Route path='/chat-list' element={<ProtectedRouteElement element={ChatList} rooms={chatNames}
                         loggedIn={connected} onAddClick={handleAddRoomClick} onChatClick={handleAddUserToRoom}/>}/>
                    <Route path='/*' element={<Navigate to='/home'/>}/>
                </Routes>
            </main>
            <UsersPopup isOpen={isUsersPopupOpen} onClose={closeAllPopups} onOverlayClose={handleOverlayClose}
                         users={currentUsers} currentUser={currentUser} chat={selectedChat} onKick={handleKickUser}/>
            <InfoTooltip authMessage={authMessage} isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups}
                         onOverlayClose={handleOverlayClose}/>
            <AddRoomPopup isOpen={isAddRoomPopupOpen} onClose={closeAllPopups} onOverlayClose={handleOverlayClose}
                         btnMessage={saveBtnDefault} onSubmit={handleCreateRoom}/>
        </div>
);
}


export default App;
