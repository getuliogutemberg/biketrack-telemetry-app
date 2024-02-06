import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateEventModal from './CreateEventModal';
import { Modal, Button } from 'react-bootstrap';
import '../styles/EventList.css';

const ConfirmDeleteModal = ({ show, handleClose, handleConfirmDelete }) => {
  return (
    <Modal show={show} onHide={handleClose} style={{ color: '#721c24' }}>
      <Modal.Header closeButton style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
        <Modal.Title style={{ fontWeight: 'bold' }}>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: '#721c24' }}>
        Tem certeza que deseja deletar esse evento?
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between', borderTop: '0' }}>
        <Button variant="secondary" onClick={handleClose} style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete}>
          Confirmar
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
  <div className='event-list-container'>
    <div className='event-list'>
     {localStorage.getItem('user') && <h3>Lista de eventos</h3>}

      {error && <p className='error'>{error}</p>}
      
      {!localStorage.getItem('user') && <p className='error'>Faça o login para ver os eventos</p>}
      
      {localStorage.getItem('user') && <table className="event-table">
        <tr>
          <th>Nome</th>
          <th>Data</th>
          <th>Descrição</th>
          <th>Espectadores</th>
          <th>Participantes</th>
          <th>Organizador</th>
          <th>Opções</th>
          
        </tr>

        {events.map((event) => (
          <tr key={event._id}>
            <td>{event.name}</td>
            <td>{event.date}</td>
            <td>{event.description}</td>
            <td>{event.espects && event.espects.length}</td>
            <td>{event.attendees && event.attendees.length}</td>
            <td>{event.organizer && JSON.parse(event.organizer).username}</td>
            <td>
              <Link to={`/events/${event._id}`}>Detalhes</Link>
              {user.isAdmin && <button className="delete-button" onClick={() => handleShowDeleteModal(event._id)}>Deletar</button>}
            </td>
           
          </tr>
        ))}
      </table>}

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
    {localStorage.getItem('user') && user.isAdmin && <button onClick={handleOpenCreateEventModal}>Criar Novo Evento</button> }
  </div>
    );
};

export default EventList;