import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Importe os estilos do Leaflet

const MapaComponente = ({ participantes , espectadores, circuito, handleUpdateLocation}) => {
    
    const centroDoMapa = [-8.04952300684729, -34.90696498279567];
    
    const customIcon = new L.Icon({
        iconUrl: 'https://cdn2.iconfinder.com/data/icons/wsd-map-markers-2/512/wsd_markers_81-512.png',
        iconSize: [52, 52], // Tamanho do ícone
        iconAnchor: [26, 26], // Ponto do ícone ancorado nas coordenadas do marcador
        popupAnchor: [0, -26], // Posição do balão de informações em relação ao ícone
      });
    
    return (
        <MapContainer center={centroDoMapa} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
  
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {participantes && participantes.map(participante => (
    <Marker position={participante.cordenadas} icon={customIcon} key={participante._id}>
      <Popup>
        <div>
          <h3>{participante.username}</h3>
          <p>posicao:{participante.posicao}</p>

          <button onClick={() => handleUpdateLocation(participante._id)}>Atualizar localização</button>

        </div>
      </Popup>
    </Marker>
  ))}
  {/* <Marker position={coordenadasMarcador} icon={customIcon}>
            <Popup>
            <div>
              <h3>Recife</h3>
              <p>Informações adicionais sobre Recife.</p>
            </div>
          </Popup>
  </Marker> */}
  {/* <Marker position={coordenadasMarcador2} icon={customIcon}>
            <Popup>
            <div>
              <h3>Recife</h3>
              <p>Informações adicionais sobre Recife.</p>
            </div>
          </Popup>
  </Marker> */}
</MapContainer>
    );
  };
  
  export default MapaComponente;