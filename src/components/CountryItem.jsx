import PropTypes from 'prop-types';

import styles from './CountryItem.module.css';

function CountryItem({ country }) {
  return country.map(country => (
    <li key={country.id} className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  ));
}
CountryItem.propTypes = {
  country: PropTypes.array,
};
export default CountryItem;
