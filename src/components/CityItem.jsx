import PropTypes from 'prop-types';
// import { useRef } from 'react';
import styles from './CityItem.module.css';
import { Link } from 'react-router-dom';
import { useCities } from '../context/CitiesProvider';

const formatDate = date => {
  if (!date) return 'Unknown Date'; // Fallback for missing date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return 'Invalid Date'; // Handle invalid date strings

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
};

function CityItem() {
  const { deleteCity, currentCity, cities } = useCities();
  return cities.map(city => {
    const { cityName, date, emoji, position } = city;
    return (
      <li key={city.id}>
        <Link
          className={`${styles.cityItem} ${
            city.id === currentCity.id ? styles['cityItem--active'] : ''
          }`}
          to={`${city?.id}?lat=${position?.lat}&lng=${position?.lng}`}
        >
          <span className={styles.emoji}>{emoji}</span>
          <h3 className={styles.name}>{cityName}</h3>
          <time className={styles.date}>({formatDate(date)})</time>
          <button
            onClick={e => {
              e.preventDefault();
              deleteCity(city.id);
            }}
            className={styles.deleteBtn}
          >
            &times;
          </button>
        </Link>
      </li>
    );
  });
}
CityItem.propTypes = {
  cities: PropTypes.array,
};
export default CityItem;
