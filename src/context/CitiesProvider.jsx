import { createContext, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const citiesContext = createContext();
const URL_BASE = 'http://localhost:9000';

function CitiesProvider({ children }) {
  const currentCity = useRef(null);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${URL_BASE}/cities`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);
  return (
    <citiesContext.Provider value={{ isLoading, cities, currentCity }}>
      {children}
    </citiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(citiesContext);
  if (!context)
    throw new Error('useCities must be used within the CitiesProvider');
  return context;
}
CitiesProvider.propTypes = {
  children: PropTypes.node,
};

export { useCities, CitiesProvider };
