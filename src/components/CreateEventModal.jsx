import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../styles/CreateEventModal.css';
import axios from 'axios';

const CreateEventModal = ({ isOpen, onRequestClose, onCreateEvent }) => {

  
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCircuit, setEventCircuit] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventModal, setEventModal] = useState('');
  const [eventAttendees, setEventAttendees] = useState([]);
  const [eventOrganizer, setEventOrganizer] = useState({});
  const [eventImage, setEventImage] = useState('');
  const [eventEspects, setEventEspects] = useState([]);
  const [user, setUser] = useState('');
  const handleCreateEvent = () => {
    // Valide os dados, se necessário
    onCreateEvent({
      name: eventName,
      description: eventDescription,
      espects: eventEspects,
      location: eventLocation,
      organizer: eventOrganizer, 
      image: eventImage,
      date: eventDate,
      modal: eventModal,
      attendees: eventAttendees,   
      circuito: eventCircuit,

      // Adicione outros campos conforme necessário
    });

    // Limpe o estado do modal após a criação do evento
    setEventName('');
    setEventDescription('');
    setEventLocation('');
    setEventCircuit('');
    setEventDate('');
    setEventModal('');
    setEventAttendees([]);
    setEventOrganizer({});
    setEventImage('');
    setEventEspects([]);

    // Feche o modal
    onRequestClose();
  };

  useEffect(() => {
    try {
    axios.get(`http://localhost:5000/users/`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': JSON.parse(localStorage.getItem('user')).token,
      },
    }).then((response) => {
      const user = response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0];
      setUser(user);
    })} catch (error) {
      console.log(error);
    }
    
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel='Criar Evento'
      className='modal'
      overlayClassName='overlay'
    >
      <h2 className='modal-title'>Criar Novo Evento</h2>

      <label htmlFor='eventName'>Nome do Evento: <input
        type='text'
        id='eventName'
        value={eventName}
        placeholder='Nome do Evento'
        
        onChange={(e) => setEventName(e.target.value)}
      /></label><br/>

<label className='event-image-create-label' htmlFor='eventImage'>Imagem:
      <input
        type='text'
        id='eventImage'
        value={eventImage}
        placeholder='URL da imagem'
        onChange={(e) => setEventImage(e.target.value)}
      />
     <img className='event-image-create' src={eventImage} alt='Imagem do Evento' />
      </label><br/>
      

      <label htmlFor='eventDescription'>Descrição:
      <textarea
        id='eventDescription'
        value={eventDescription}
        placeholder='Descricão do Evento'
        onChange={(e) => setEventDescription(e.target.value)}
      /></label><br/>

      <label htmlFor='eventLocation'>Localização:
      <select id='eventLocation' value={eventLocation} onChange={(e) => setEventLocation(e.target.value)}>
        <option value=''>Selecione</option>
        <option value='Recife'>Recife</option>
        <option value='Online'>Online</option>
      </select>
      </label><br/>

      <label htmlFor='eventCircuit'>Circuito:
      <select id='eventCircuit' value={eventCircuit} onChange={(e) => setEventCircuit(e.target.value)}>
        <option value=''>Selecione</option>
        <option value='Circuito 1'>Circuito 1</option>
        <option value='Circuito 2'>Circuito 2</option>
        <option value='Circuito 3'>Circuito 3</option>
      </select>
      </label><br/>

      <label htmlFor='eventDate'>Data:
      <input
        type='date'
        id='eventDate'
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      /></label><br/>

      <label htmlFor='eventModal'>Modalidade:
      <select id='eventModal' value={eventModal} onChange={(e) => setEventModal(e.target.value)}>
        <option value=''>Selecione</option>
        <option value='Speed'>Speed</option>
        <option value='MTB'>MTB</option>
        <option value='Todas'>Todas</option>
      </select>
      </label><br/>

      {/* <label htmlFor='eventAttendees'>Participantes:
      <input
        type='text'
        id='eventAttendees'
        value={eventAttendees}
        onChange={(e) => setEventAttendees(e.target.value)}
      /></label><br/> */}

     

      {user && <><label htmlFor='eventOrganizer'>Organizador:
      <select id='eventOrganizer' value={eventOrganizer} onChange={(e) => setEventOrganizer(e.target.value)}>
        <option value=''>Selecione</option>
        <option value={JSON.stringify(user)}>{user.username}</option>
        
      </select> 
      </label><br/></>}

      

      {/* <label htmlFor='eventEspects'>Espectadores:
      <input
        type='text'
        id='eventEspects'
        value={eventEspects}
        onChange={(e) => setEventEspects(e.target.value)}
      /></label><br/> */}
     <div className='actions'>
      <button className='cancel' onClick={()=>onRequestClose()}>Cancelar</button>
      <button className='create' onClick={()=>handleCreateEvent()}>Criar Evento</button>

     </div>

    </Modal>
  );
};

export default CreateEventModal;
