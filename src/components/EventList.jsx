import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateEventModal from './CreateEventModal';
import { Modal, Button } from 'react-bootstrap';
import '../styles/EventList.css';
import { HiOutlineUsers } from "react-icons/hi2";
import { MdDirectionsBike } from "react-icons/md";

const ConfirmDeleteModal = ({ show, handleClose, handleConfirmDelete }) => {
  return (
    <Modal show={show} onHide={handleClose} style={{ backgroundColor: '#1a1a1a',border: '1px solid #6c757d'}}>
      
        <Modal.Title style={{ fontWeight: 'bold' }}>Confirmar Exclusão</Modal.Title>

      <Modal.Body style={{ color: '#FFF',textAlign: 'center',fontWeight: 'bold',margin: '30px' }}>
        Tem certeza que deseja deletar esse evento?
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

const EventList = () => {
  // Aqui você pode obter a lista de eventos da API e renderizá-los
  const [events, setEvents] = useState([]); 
  const [error, setError] = useState('');
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleLogout = () => {
    
    localStorage.removeItem('user');
    
  }

  const handleShowDeleteModal = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const [user , setUser] = useState({})

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios('http://localhost:5000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': JSON.parse(localStorage.getItem('user')).token,
          },
        });
        console.log(response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0]);
        setUser(response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);
  
  const handleOpenCreateEventModal = () => {
    setIsCreateEventModalOpen(true);
  };
  const handleCloseCreateEventModal = () => {
    setIsCreateEventModalOpen(false);
  };

  const handleCreateEvent = async (eventData) => {
    // console.log(eventData)
    try {
      // Envie os dados do novo evento para a API
      const response = await axios.post('http://localhost:5000/events', eventData, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      });

      // Adicione o novo evento à lista de eventos local
      setEvents((prevEvents) => [...prevEvents, response.data]);

      // Feche o modal
      handleCloseCreateEventModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getEvents = async () => {
      try {
      const response = await axios('http://localhost:5000/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      });
      // console.log(response.data);
      setEvents(response.data);
    } catch (error) {
      console.log(error);
      setError('Erro ao obter eventos: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
    };
    localStorage.getItem('user') && getEvents();
    // Aqui você pode adicionar a lógica para obter a lista de eventos da API
   
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/events/${eventToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      });
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventToDelete));
      handleCloseDeleteModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className='events-list'>
    <div className='events-header'>
      
      <h1 className='lobby-title'>BikeTrack</h1>
      <div className='lobby-menu'>
      {user ? <Link className="start-button" to={`/events`}><span>Eventos</span></Link> : <Link className="start-button" to={"/login"}><span>Entrar</span></Link>}
      {user && <Link className="start-button" to={`/users/`}><span>Usuarios</span></Link>}
      {user && <Link className="start-button" to="/" onClick={() => handleLogout()}><span>Sair</span></Link>}
      </div>
    </div>

    <div className='events-body'>
      {localStorage.getItem('user') && <h3 className='event-list-title'>Eventos</h3>}

      {error && <p className='error'>{error}</p>}
      
      {!localStorage.getItem('user') && <p className='error'>Faça o login para ver os eventos</p>}
      
      <div className='event-card-container'>
    {localStorage.getItem('user') && user.isAdmin && <button className='create-event' onClick={handleOpenCreateEventModal}>Novo Evento</button> }

      {localStorage.getItem('user') && 
      
      
      events.map((event) => (
            <div key={event._id} className='event-card'>
              
              {event.image && (<Link className='event-image-container' to={`/events/${event._id}`}>
                <img className='event-image' src={event.image} alt={JSON.parse(event.organizer).username}/>
                <div className='gradient-overlay'></div>
                <div className="event-link" >{event.name}</div>
              </Link>)}

              <div className="event-info">
              <span>{event.date}</span>
              <span>{event.description}</span>
              <div className='event-participants'> 
              <span><HiOutlineUsers /> {event.espects && event.espects.length}</span>
                <span><MdDirectionsBike /> {event.attendees && event.attendees.length}</span>
              </div>
              </div>
              
              {user.isAdmin && <button className="delete-button" onClick={() => handleShowDeleteModal(event._id)}>Deletar</button>}
                
                
              
              {/* <button ><Link className="event-details" to={`/events/${event._id}`}>Detalhes</Link> </button> */}
              
                </div>
            
          ))
      }

      </div>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
      />
      

      {localStorage.getItem('user') && <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onRequestClose={()=>handleCloseCreateEventModal()}
        onCreateEvent={(e)=>handleCreateEvent(e)}
      />}
    </div>

    <div className='event-list-footer'>

    </div>
  </div>
    );
};

export default EventList;