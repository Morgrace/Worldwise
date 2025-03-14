import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
function Map() {
  const id = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  return (
    <div onClick={() => navigate('form')} className={styles.mapContainer}>
      <h1>id: {id.id}</h1>
      <h2>latitude:{lat}</h2>
      <h3>longitude:{lng}</h3>
      <p>map</p>
      <button onClick={() => setSearchParams({ lat: 1234, lng: 5453 })}>
        set Param
      </button>
    </div>
  );
}

export default Map;
