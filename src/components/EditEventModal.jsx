import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../styles/EditEventModal.css';
import axios from 'axios';

const EditEventModal = ({ isOpen, onRequestClose, onEditEvent, event }) => {

  
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCircuit, setEventCircuit] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventModal, setEventModal] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState({});
  const [eventAttendees, setEventAttendees] = useState([]);
  const [eventEspects, setEventEspects] = useState([]);
  const [user, setUser] = useState({});
  const handleEditEvent = () => {
    // Valide os dados, se necessário
    onEditEvent({
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

  useEffect(() => {
    setEventName(event.name);
    setEventDescription(event.description);
    setEventLocation(event.location);
    setEventCircuit(event.circuito);
    setEventDate(event.date);
    setEventModal(event.modal);
    setEventImage(event.image);
    setEventOrganizer(event.organizer);
    setEventAttendees(event.attendees);
    setEventEspects(event.espects);
  }, [event]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel='Criar Evento'
      className='modal'
      overlayClassName='overlay'
    >
      <h2 className='modal-title'>Editar Evento</h2>

      <label htmlFor='eventName'>Nome do Evento: <input
        type='text'
        id='eventName'
        value={eventName}
        placeholder='Nome do Evento'
        
        onChange={(e) => setEventName(e.target.value)}
      /></label><br/>

<label className="event-image-label" htmlFor='eventImage'>Imagem:
     <img className="event-image-modal" src={eventImage} alt={`Imagem de ${eventImage}`} />
      <input
        type='text'
        id='eventImage'
        value={eventImage}
        placeholder='URL da imagem'
        onChange={(e) => setEventImage(e.target.value)}
      />
      </label><br/>
      

      <label htmlFor='eventDescription'>Descrição:
      <textarea
        id='eventDescription'
        value={eventDescription}
        placeholder='Descricão do Evento'
        onChange={(e) => setEventDescription(e.target.value)}
      /></label><br/>

<label htmlFor='eventDate'>Data:
      <input
        type='date'
        id='eventDate'
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      /></label><br/>

      <label htmlFor='eventLocation'>Localização:
      <select id='eventLocation' value={eventLocation} onChange={(e) => setEventLocation(e.target.value)}>
        <option value=''>Selecione</option>
        <option value='Recife'>Recife</option>
        <option value='Online'>Online</option>
      </select>
      </label><br/>

      <label htmlFor='eventModal'>Modalidade:
      <select id='eventModal' value={eventModal} onChange={(e) => setEventModal(e.target.value)}>
        <option value=''>Selecione</option>
        <option value='Speed'>Speed</option>
        <option value='MTB'>MTB</option>
        <option value='Todas'>Todas</option>
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

      

      

      {/* <label htmlFor='eventAttendees'>Participantes:
      <input
        type='text'
        id='eventAttendees'
        value={eventAttendees}
        onChange={(e) => setEventAttendees(e.target.value)}
      /></label><br/> */}

      <label htmlFor='eventOrganizer'>Organizador:
      <select disabled id='eventOrganizer' value={eventOrganizer} onChange={(e) => setEventOrganizer(e.target.value)}>
        <option value=''>Selecione</option>
        <option value={JSON.stringify(user)}>{user.username}</option>
        
      </select> 
      </label><br/>
     



      

      {/* <label htmlFor='eventEspects'>Espectadores:
      <input
        type='text'
        id='eventEspects'
        value={eventEspects}
        onChange={(e) => setEventEspects(e.target.value)}
      /></label><br/> */}
     <div className='actions'>
      <button className='cancel' onClick={()=>onRequestClose()}>Cancelar</button>
      <button className='edit' onClick={()=>handleEditEvent()}>Salvar</button>

     </div>

    </Modal>
  );
};

export default EditEventModal;
