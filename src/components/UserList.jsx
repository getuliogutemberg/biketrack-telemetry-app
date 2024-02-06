import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateUserModal from './CreateUserModal';
import '../styles/UserList.css';

const UserCard = ({ user }) => {
  return (
    <div className={`user-card ${user.username === JSON.parse(localStorage.getItem('user')).username && 'user-card-highlight'}`}>
      <img  className="user-image" src={user.image} alt={`Imagem de ${user.username}`} />
      <div className="user-info">

      <h4 className="user-name">{user.isAdmin && "@"}{user.username}</h4>
      <p>{user.email}</p>
      <p>Modalidade: {user.modal}</p>
      <Link to={`/users/${user._id}`}>Detalhes</Link>
      </div>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleOpenCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
  };

  const handleCloseCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/users', userData, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      });

      setUsers((prevUsers) => [...prevUsers, response.data]);
      handleCloseCreateUserModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios('http://localhost:5000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': JSON.parse(localStorage.getItem('user')).token,
          },
        });

        setUsers(response.data);
        setIsAdmin(response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0].isAdmin);
      } catch (error) {
        console.log(error);
        setError('Erro ao obter usuários: ' + error.message);
        setTimeout(() => setError(''), 3000);
      }
    };

    localStorage.getItem('user') && getUsers();
  }, []);

  return (
    <div className='user-list'>
      <h3>Lista de usuários</h3>
      {error && <p className='error'>{error}</p>}
      {!localStorage.getItem('user') && <p className='error'>Faça o login para ver os usuários</p>}
      <div className="user-cards-container">
        {users.sort((a, b) => {
          if (a.isAdmin && !b.isAdmin) {
            return -1;
          } else if (!a.isAdmin && b.isAdmin) {
            return 1;
          }
          return a.username.localeCompare(b.username);
        }).map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
      {localStorage.getItem('user') && isAdmin && <button onClick={handleOpenCreateUserModal}>Criar Novo Usuário</button> }

      {localStorage.getItem('user') && <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onRequestClose={() => handleCloseCreateUserModal()}
        onCreateUser={(e) => handleCreateUser(e)}
      />}
    </div>
  );
};

export default UserList;
