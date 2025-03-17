import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import styles from './Map.module.css';
import { useCities } from '../context/CitiesProvider';
import Button from './Button';
import { useGeolocation } from '../hooks/useGeolocation';
import { useURL } from '../hooks/useURL';
function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const { isLoading, position: userPosition, getPosition } = useGeolocation();
  const [lat, lng] = useURL();

  useEffect(
    function () {
      if (!userPosition.lat || !userPosition.lng) return;
      setMapPosition([userPosition.lat, userPosition.lng]);
    },
    [userPosition]
  );
  useEffect(
    function () {
      if (!Number.isFinite(lat) && !Number.isFinite(lng)) return;
      const position = [lat, lng];
      setMapPosition(position);
    },
    [lat, lng]
  );

  return (
    <div className={styles.mapContainer}>
      {!userPosition.lat && !userPosition.lng && (
        <Button type="position" onClick={() => getPosition()}>
          {isLoading ? 'Loading...' : 'Use Your Postion'}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={[51.505, -0.09]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(city => {
          // Ensure city.position exists before trying to access lat/lng
          if (!city.position) return null;

          return (
            <Marker
              key={city.id}
              position={[
                Number(city.position?.lat), // Convert to number
                Number(city.position?.lng), // Convert to number
              ]}
            >
              <Popup>
                {city.emoji} {city.cityName}
              </Popup>
            </Marker>
          );
        })}
        <Recenter position={mapPosition} />

        <DetectClick />
      </MapContainer>
    </div>
  );
}
function Recenter({ position }) {
  const map = useMap();
  map.setView(position, 8);
  return null;
}
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: e => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}
Recenter.propTypes = {
  position: PropTypes.array,
};
export default Map;
