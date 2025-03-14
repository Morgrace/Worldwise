import PropTypes from 'prop-types';

import CountryItem from './CountryItem';
import Spinner from './Spinner';
import Message from './Message';
import styles from './CountryList.module.css';
import { useCities } from '../context/CitiesProvider';

function CountryList() {
  const { isLoading, cities } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message>Add your first city by clicking on a city on the map</Message>
    );

  const country = cities.reduce((acc, curr) => {
    if (acc.find(el => el.country === curr.country)) return acc;
    return [...acc, { country: curr.country, emoji: curr.emoji, id: curr.id }];
  }, []);

  return (
    <ul className={styles.countryList}>
      <CountryItem country={country} />
    </ul>
  );
}

CountryList.propTypes = {
  isLoading: PropTypes.bool,
  cities: PropTypes.array,
};
export default CountryList;
