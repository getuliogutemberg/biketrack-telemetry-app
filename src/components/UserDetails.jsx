import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserDetails.css'

const UserDetails = () => {
    const [user, setUser] = useState({});
    const { id } = useParams();

    useEffect(() => {
        // console.log(id);
        axios
          .get(`http://localhost:5000/users/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'authorization': JSON.parse(localStorage.getItem('user')).token,
            },
          })
          .then((response) => {
            
            setUser(response.data);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }, []);

    return (
        <div className='user-details'>
            <div className='lobby-header'>
      
            <Link className='lobby-title'  to={'/'}>BikeTrack</Link>
            <div className='lobby-menu'>
            {user ? <Link className="start-button" to={`/events`}><span>Eventos</span></Link> : <Link className="start-button" to={"/login"}><span>Entrar</span></Link>}
            {user && <Link className="start-button" to={`/users/`}><span>Usuarios</span></Link>}
            
            {user && <Link className="start-button" to="/" onClick={() => handleLogout()}><span>Sair</span></Link>}
            </div>
            </div>
            <div className="user-details-container">
                
            
            <h3 className="user-details-title">Detalhes do Usuário, {user.username}</h3>
            <img className="user-details-image" src={user.image} alt={`Imagem de ${user.username}`} />
            {/* <img src={user.image} alt={`Imagem de ${user.username}`} /> */}
            <div className="user-details-info">
            <span>{user.username}</span>
            <span>{user.email}</span>
            <span>{user.modal}</span>
            </div>
            <Link className="back-to-users" to={`/users/`}><span>Voltar</span></Link>
            </div>
        </div>
    )
}

export default UserDetails