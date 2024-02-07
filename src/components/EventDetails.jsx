import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Map from './Map';
import '../styles/EventDetails.css'; // Adicione um arquivo de estilo para personalizar ainda mais
import io from 'socket.io-client'; 
import EditEventModal from './EditEventModal';
import { Link } from 'react-router-dom';

const socket = io('http://localhost:5000');
const EventDetails = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const [event, setEvent] = useState({});
  const [coordinates, setCoordinates] = useState([0, 0]);
  const isParticipantRegistered = event.attendees && event.attendees.some(existingUser => existingUser.username === JSON.parse(localStorage.getItem('user')).username);
  const isEspectatorRegistered = event.espects && event.espects.some(existingUser => existingUser.username === JSON.parse(localStorage.getItem('user')).username);
  const isEventOrganizer = event.organizer && JSON.parse(event.organizer).username === JSON.parse(localStorage.getItem('user')).username;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleEditEvent = () => {
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const modifyEvent = (event) => {
    axios
      .put(`http://localhost:5000/events/${id}`, event, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      })
      .then((response) => {
        console.log(JSON.parse(response.config.data));
        setEvent(JSON.parse(response.config.data));
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  const handleUpdateLocation = (id) => {
    // console.log('handleUpdateLocation called', id);
    // Simule novas coordenadas (substitua por suas coordenadas reais)
    const newCoordinates = [-0.118092682, 51.509865];
    
    // Emita as novas coordenadas para o servidor
    socket.emit('updateCoordinates', { id, newCoordinates });
  };

  useEffect(() => {
    // console.log(id);
    axios
      .get(`http://localhost:5000/events/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      })
      .then((response) => {
        
        setEvent(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  useEffect(() => {
    console.log('event', event);
  }, [event]);

  useEffect(()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
    
          // Agora você pode usar essas coordenadas como necessário
          setCoordinates([latitude, longitude]);
          // console.log('Coordenadas do usuário:', userCoordinates);
    
          // Faça algo com as coordenadas, por exemplo, registrá-las no evento
          // ou usar em outras partes do seu aplicativo
        },
        (error) => {
          setCoordinates([0, 0]);
          console.error('Erro ao obter a localização:', error);
        }
      );
    } else {
      console.error('Geolocalização não é suportada pelo navegador.');
    }
  }, [event]);

  useEffect(() => {
    // Conectar o socket ao servidor
    
    // Corrija o evento para 'updateLocation' (um evento personalizado)
    socket.on('updateLocation', (updatedCoordinates) => {
      console.log('Received coordinates:', updatedCoordinates);
      // Atualize o estado do componente com as novas coordenadas
      setEvent((prevEvent) => ({
        ...prevEvent,
        attendees: prevEvent.attendees.map((participant) =>
          participant.id === updatedCoordinates.id
            ? { ...participant, coordinates: updatedCoordinates.coordinates }
            : participant
        ),
      }));
    });

    return () => {
      // Desconectar o socket quando o componente for desmontado
      socket.disconnect();
    };
  }, [ event ]);

  const handleBack = () => {
    window.history.back();
  };

  const participantRegister = () => {
    axios.get(`http://localhost:5000/users`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': JSON.parse(localStorage.getItem('user')).token,
      },
    }).then((response) => {
      const user = response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0];
  
      // Verifica se o usuário já está na lista de espects
      const isAlreadyRegistered = event.attendees && event.attendees.some(existingUser => existingUser._id === user._id);
  
      if (!isAlreadyRegistered) {
        

        axios.post(`http://localhost:5000/registerParticipant/${event._id}`,
        {
          user: {...user,posicao: 0 , cordenadas: coordinates },
        }, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      }).then((registerResponse) => {
        // Lida com a resposta da requisição de registro no banco de dados se necessário
        console.log('Participante registrado no banco de dados:', registerResponse.data);
      }).catch((registerError) => {
        console.error('Erro ao registrar participante no banco de dados:', registerError);
      });
        // Adiciona o usuário à lista de espects apenas se não estiver registrado
        setEvent({
          ...event,
          attendees: event.attendees ? [...event.attendees, {...user,posicao: 0 , cordenadas: coordinates }] : [user],
        });
      }
    });
  };

  const participantUnregister = () => {
    axios.get(`http://localhost:5000/users`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': JSON.parse(localStorage.getItem('user')).token,
      },
    }).then((response) => {
      const user = response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0];
    

  // Verifica se o usuário está na lista de participantes
  const isRegistered = event.attendees && event.attendees.some(existingUser => existingUser._id === user._id);

  if (isRegistered) {
    // Remove o participante da lista no backend
    axios.post(`http://localhost:5000/removeParticipant/${event._id}`,{
      user: user,
    },{
      headers: {
        'Content-Type': 'application/json',
        'authorization': JSON.parse(localStorage.getItem('user')).token,
      },
     
    }).then((removeResponse) => {
      // Lida com a resposta da requisição de remoção no banco de dados se necessário
      console.log('Participante removido do banco de dados:', removeResponse.data);
    }).catch((removeError) => {
      console.error('Erro ao remover participante do banco de dados:', removeError);
    });

    // Remove o participante da lista no estado local
    const updatedAttendees = event.attendees.filter(existingUser => existingUser._id !== user._id);
    setEvent({
      ...event,
      attendees: updatedAttendees,
    });
    
  } else {
    console.warn('Usuário não está registrado como participante neste evento.');
  }

})};

  const participantUpdate = (participantId, updatedParticipant) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      attendees: prevEvent.attendees.map((participant) =>
        participant.id === participantId ? updatedParticipant : participant
      ),
    }));
  };

  const participantDelete = (participantId) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      attendees: prevEvent.attendees.filter((participant) => participant.id !== participantId),
    }));
  };

  const participantUpdateCoordinates = (participantId, updatedCoordinates) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      attendees: prevEvent.attendees.map((participant) =>
        participant.id === participantId
          ? { ...participant, coordinates: updatedCoordinates }
          : participant
      ),
    }));
  };

  const spectatorRegister = () => {
    axios.get(`http://localhost:5000/users`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': JSON.parse(localStorage.getItem('user')).token,
      },
    }).then((response) => {
      const user = response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0];
  
      // Verifica se o usuário já está na lista de espects
      const isAlreadyRegistered = event.espects && event.espects.some(existingUser => existingUser._id === user._id);
  
      if (!isAlreadyRegistered) {

        axios.post(`http://localhost:5000/registerEspect/${event._id}`, {
        user: user,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': JSON.parse(localStorage.getItem('user')).token,
        },
      }).then((registerResponse) => {
        // Lida com a resposta da requisição de registro no banco de dados se necessário
        console.log('Usuário registrado no banco de dados:', registerResponse.data);
      }).catch((registerError) => {
        console.error('Erro ao registrar usuário no banco de dados:', registerError);
      });
        // Adiciona o usuário à lista de espects apenas se não estiver registrado
        setEvent({
          ...event,
          espects: event.espects ? [...event.espects, user] : [user],
        });
      }
    });
  };

  const spectatorUnregister = () => {
    axios.get(`http://localhost:5000/users`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': JSON.parse(localStorage.getItem('user')).token,
      },
    }).then((response) => {
      const user = response.data.filter((user) => user.username === JSON.parse(localStorage.getItem('user')).username)[0];
    

  // Verifica se o usuário está na lista de participantes
  const isRegistered = event.espects && event.espects.some(existingUser => existingUser._id === user._id);

  if (isRegistered) {
    // Remove o participante da lista no backend
    axios.post(`http://localhost:5000/removeEspect/${event._id}`,{
      user: user,
    },{
      headers: {
        'Content-Type': 'application/json',
        'authorization': JSON.parse(localStorage.getItem('user')).token,
      },
     
    }).then((removeResponse) => {
      // Lida com a resposta da requisição de remoção no banco de dados se necessário
      console.log('Espectador removido do banco de dados:', removeResponse.data);
    }).catch((removeError) => {
      console.error('Erro ao remover espectador do banco de dados:', removeError);
    });

    // Remove o participante da lista no estado local
    const updatedEspects = event.espects.filter(existingUser => existingUser._id !== user._id);
    setEvent({
      ...event,
      espects: updatedEspects,
    });
    
  } else {
    console.warn('Usuário não está registrado como espectador neste evento.');
  }

})};

  const spectatorUpdate = (spectatorId, updatedSpectator) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      espect: prevEvent.espect.map((spectator) =>
        spectator.id === spectatorId ? updatedSpectator : spectator
      ),
    }));
  };

  const spectatorDelete = (spectatorId) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      espect: prevEvent.espect.filter((spectator) => spectator.id !== spectatorId),
    }));
  };

 const handleLogout = () => {
  localStorage.removeItem('user');
  
 }


  return (
    <div className='event-details-container'>
      <div className='lobby-header'>
      
      <Link className='lobby-title'  to={'/'}>BikeTrack</Link>
      <div className='lobby-menu'>
      {user ? <Link className="start-button" to={`/events`}><span>Eventos</span></Link> : <Link className="start-button" to={"/login"}><span>Entrar</span></Link>}
      {user && <Link className="start-button" to={`/users/`}><span>Usuarios</span></Link>}
      
      {user && <Link className="start-button" to="/" onClick={() => handleLogout()}><span>Sair</span></Link>}
      </div>
      </div>

      <div className="event-details-container">

      <div className='event-map'>
        <Map participantes={event.attendees} espectadores={event.espects} circuito={event.circuito} handleUpdateLocation={handleUpdateLocation}/>
      </div>

      <div className='event-info'>
        <div className='event-title'>
          <h1>{event.name}</h1>
          {/* <span>{id}</span> */}
        </div>
        <div className='event-image'>
          <img src={event.image} alt={event.name} />
        </div>
        <div className='event-details-info'>
        <div className='event-description'>
          <p>{event.description}</p>
        </div>
        <div className='event-date'>
          <p>{new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}</p>
        </div>
        <div className='event-modal'>
          <p>Modalidade: {event.modal}</p>
        </div>
        <div className='event-organizer'>
          <p>Autor: {event.organizer && JSON.parse(event.organizer).username}</p>
        </div>
        
        <div className='event-attendees'>
          <p>Colocação:</p>
          <ol>
            {event.attendees &&
              event.attendees.sort((a, b) => a.posicao - b.posicao).map((participante) => {
                // event.attendees.map((participante) => {
                  // console.log('participante')
                  return <li key={participante._id}>{participante.username}</li>
            })}
          </ol>
        {isParticipantRegistered ? (
        <button className='cancel-participant' onClick={() => participantUnregister()}>Cancelar inscrição como participante</button>
      ) : (
        <button className='register-participant' onClick={() => participantRegister()}>Se inscrever como participante</button>
      )}
        </div>
        <div className='event-espects'>
          <p>Espectadores: {event.espects && event.espects.length} </p>
          <ul>
            {event.espects &&
              event.espects.map((espectador) => (
                <li key={espectador._id}>{espectador.username}</li>
              ))}
               {isEspectatorRegistered ? (
        <button className='cancel-spectator' onClick={() => spectatorUnregister()}>Cancelar inscrição como espectador</button>
        ) : (
        <button className='register-spectator' onClick={() => spectatorRegister()}>Se inscrever como espectador</button> )}
          </ul>
         
        </div>
        {/* <button onClick={()=>handleUpdateLocation()}>Atualizar Localização</button> */}

        </div>
       
        
        

      <div className='event-actions'>


      <button className='back-to-events' onClick={() => handleBack()}>Voltar</button>
      {isEventOrganizer && <button className='edit-button' onClick={() => handleEditEvent()}>Editar Evento</button>}
      </div>
      </div>
      <EditEventModal onRequestClose={handleCloseEditModal} isOpen={isEditModalOpen} onEditEvent={modifyEvent} event={event}/>
      </div>
       
       
    </div>
  );
};

export default EventDetails;