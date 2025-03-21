import { useCities } from '../context/CitiesProvider';
import PropTypes from 'prop-types';
import CityItem from './CityItem';
import Spinner from './Spinner';
import styles from './CityList.module.css';

function CityList() {
  const { isLoading } = useCities();
  if (isLoading) return <Spinner />;

  return (
    <ul className={styles.cityList}>
      <CityItem />
    </ul>
  );
}
CityList.propTypes = {
  isLoading: PropTypes.bool,
  cities: PropTypes.array,
};
export default CityList;
