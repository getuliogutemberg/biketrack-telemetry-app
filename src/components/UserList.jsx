import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateUserModal from './CreateUserModal';
import '../styles/UserList.css';
import { Modal, Button } from 'react-bootstrap';


const ConfirmDeleteModal = ({ show, handleClose, handleConfirmDelete }) => {
  return (
    <Modal show={show} onHide={handleClose} style={{ backgroundColor: '#1a1a1a',border: '1px solid #6c757d'}}>
      
        <Modal.Title style={{ fontWeight: 'bold' }}>Confirmar Exclusão</Modal.Title>

      <Modal.Body style={{ color: '#FFF',textAlign: 'center',fontWeight: 'bold',margin: '30px' }}>
        Tem certeza que deseja deletar esse usuário?
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-around',gap: '10px',display: 'flex', flexDirection: 'row' }}>
        <Button  onClick={handleClose} style={{ backgroundColor: '#6c757d', borderColor: '#6c757d',fontWeight: 'bold' }}>
          Cancelar
        </Button>
        <Button  onClick={handleConfirmDelete} style={{ backgroundColor: '#d32f2f', borderColor: '#d32f2f',fontWeight: 'bold' }}>
          Excluir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
const UserCard = ({ user,deleteUser }) => {

  const [admin, setAdmin] = useState(false);
  const isAdmin = admin.isAdmin;

  useEffect(()=>{
    axios.get('http://localhost:5005/users', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': JSON.parse(localStorage.getItem('user')).token,
      },
    })
    .then((response) => {
      setAdmin(response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0]);
    })
  },[])

  
  return (
    <div className="user-card-container">
      <Link className='user'  to={`/users/${user._id}`}>
        <div className={`user-card ${user.username === JSON.parse(localStorage.getItem('user')).username && 'user-card-highlight'}`}>
          <img className="user-image" src={user.image} alt={`Imagem de ${user.username}`} />
          <div className="user-info">
            <h4 className="user-name">{user.isAdmin && "@"}{user.username}</h4>
            <p>{user.email}</p>
            <p>Modalidade: {user.modal}</p>
          </div>
        </div>
      </Link>
      {isAdmin && <button className="delete-user-button" onClick={() => deleteUser()}>Del</button>}

      
     
    </div>
  );
};

const UserList = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const handleOpenCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
  };

  const handleCloseCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5005/users', userData, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      });
      // console.log(response.data);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      handleCloseCreateUserModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    
    localStorage.removeItem('user');
    
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios('http://localhost:5005/users', {
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

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5005/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowDeleteModal = (eventId) => {
    setUserToDelete(eventId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5005/users/${userToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete));
      handleCloseDeleteModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='users-list'>
       <div className='users-header'>
      
       <Link className='lobby-title'  to={'/'}>BikeTrack</Link>
      <div className='lobby-menu'>
      {user ? <Link className="start-button" to={`/events`}><span>Eventos</span></Link> : <Link className="start-button" to={"/login"}><span>Entrar</span></Link>}
      {user && <Link className="start-button" to={`/users/`}><span>Usuarios</span></Link>}
      
      {user && <Link className="start-button" to="/" onClick={() => handleLogout()}><span>Sair</span></Link>}
      </div>
    </div>
    <div className='users-body'>
      <h3 className='users-title'>Usuários</h3>
      {error && <p className='error'>{error}</p>}
      {!localStorage.getItem('user') && <p className='error'>Faça o login para ver os usuários</p>}
      <div className="user-cards-container">
      {localStorage.getItem('user') && isAdmin && <button className='create-user' onClick={handleOpenCreateUserModal}>Criar Novo Usuário</button> }
        {users.sort((a, b) => {
          if (a.isAdmin && !b.isAdmin) {
            return -1;
          } else if (!a.isAdmin && b.isAdmin) {
            return 1;
          }
          return a.username.localeCompare(b.username);
        }).map((user) => (
          <UserCard key={user._id} user={user} deleteUser={()=>handleShowDeleteModal(user._id)} />
        ))}
      </div>
      

      {localStorage.getItem('user') && <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onRequestClose={() => handleCloseCreateUserModal()}
        onCreateUser={(e) => handleCreateUser(e)}
      />}
      </div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default UserList;
