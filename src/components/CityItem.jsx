import PropTypes from 'prop-types';
// import { useRef } from 'react';
import styles from './CityItem.module.css';
import { Link } from 'react-router-dom';

const formatDate = date =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

function CityItem({ cities, currentCity }) {
  return cities.map(city => {
    const { cityName, date, emoji, position } = city;
    return (
      <li onClick={() => (currentCity.current = city.id)} key={city.id}>
        <Link
          className={`${styles.cityItem} ${
            city.id === currentCity.current ? styles['cityItem--active'] : ''
          }`}
          to={`${city.id}?lat=${position.lat}&lng=${position.lng}`}
        >
          <span className={styles.emoji}>{emoji}</span>
          <h3 className={styles.name}>{cityName}</h3>
          <time className={styles.date}>({formatDate(date)})</time>
          <button className={styles.deleteBtn}>&times;</button>
        </Link>
      </li>
    );
  });
}
CityItem.propTypes = {
  cities: PropTypes.array,
};
export default CityItem;
