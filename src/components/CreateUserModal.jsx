import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/CreateEventModal.css';
import { now } from 'mongoose';

const CreateUserModal = ({ isOpen, onRequestClose, onCreateUser }) => {

  
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const [userLocation, setUserLocation] = useState('');
  
 
  const [userModal, setUserModal] = useState('');
  
  
  const [userImage, setUserImage] = useState('');
  

  const handleCreateEvent = () => {
    // Valide os dados, se necessário
    onCreateUser({
        username: userName,
        password: password,
        email: email,
        location: userLocation,
        isAdmin: false, 
        image: userImage,
        dateCreated: now,
        modal: userModal,   
      
      // Adicione outros campos conforme necessário
    });

    // Limpe o estado do modal após a criação do evento
    setUserName('');
    setEmail('');
    setPassword('');
    setUserLocation('');
    setUserImage('');
    setUserModal('');
   
    // Feche o modal
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel='Criar Evento'
      className='modal'
      overlayClassName='overlay'
    >
      <h2 className='modal-title'>Criar Novo Usuario</h2>

      <label htmlFor='userName'>Nome: <input
        type='text'
        id='userName'
        value={userName}
        placeholder='Nome do Usuario'
        
        onChange={(e) => setUserName(e.target.value)}
      /></label><br/>
      

      <label htmlFor='email'>Email: <input
        type='text'
        id='email'
        value={email}
        placeholder='Email do Usuario'
        onChange={(e) => setEmail(e.target.value)}
      /></label><br/>

      <label htmlFor='password'>Senha: <input
        type='text'
        id='password'
        value={password}
        placeholder='Senha do Usuario'
        onChange={(e) => setPassword(e.target.value)}
      /></label><br/>

      {/* <label htmlFor='eventCircuit'>Circuito:
      <select id='eventCircuit' value={eventCircuit} onChange={(e) => setEventCircuit(e.target.value)}>
        <option value=''>Selecione</option>
        <option value='Circuito 1'>Circuito 1</option>
        <option value='Circuito 2'>Circuito 2</option>
        <option value='Circuito 3'>Circuito 3</option>
      </select>
      </label><br/> */}

      {/* <label htmlFor='eventDate'>Data:
      <input
        type='date'
        id='eventDate'
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value["$date"])}
      /></label><br/> */}

      <label htmlFor='userModal'>Modalidade:
      <select id='userModal' value={userModal} onChange={(e) => setUserModal(e.target.value)}>
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

     <label className='user-image-label' htmlFor='userImage'>Imagem:
      <input
        type='text'
        id='userImage'
        value={userImage}
        placeholder='URL da imagem'
        onChange={(e) => setUserImage(e.target.value)}
      />
      <img className='user-image' src={userImage} alt='Imagem do Usuário' />
      </label><br/>

      {/* <label htmlFor='eventOrganizer'>Criador:
      <select id='eventOrganizer' value={eventOrganizer} onChange={(e) => setEventOrganizer(e.target.value)}>
        <option value=''>Selecione</option>
        <option value={JSON.parse(localStorage.getItem('user'))}>{JSON.parse(localStorage.getItem('user')).username}</option>
        
      </select> 
      </label><br/> */}

      

      {/* <label htmlFor='eventEspects'>Espectadores:
      <input
        type='text'
        id='eventEspects'
        value={eventEspects}
        onChange={(e) => setEventEspects(e.target.value)}
      /></label><br/> */}
     <div className='actions'>
      <button className='cancel' onClick={()=>onRequestClose()}>Cancelar</button>
      <button className='create' onClick={()=>handleCreateEvent()}>Criar Usuario</button>

     </div>

    </Modal>
  );
};

export default CreateUserModal;
