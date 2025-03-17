import { createContext, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const citiesContext = createContext();
const URL_BASE = 'http://localhost:9000';

function CitiesProvider({ children }) {
  const currentCity = useRef(null);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchCities() {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/cities`, { signal });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch cities: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: Expected an array');
        }

        setCities(data);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted due to component unmounting.');
        } else {
          console.error('Error fetching cities:', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();

    return () => controller.abort(); // Cleanup function to abort fetch if component unmounts
  }, []);

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL_BASE}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });
      if (!response.ok) throw new Error('failed to add city');
      const data = await response.json();
      setCities(city => [...city, data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(cityID) {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL_BASE}/cities/${cityID}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('failed to DELETE city');
      setCities(prevCities => prevCities.filter(city => city.id !== cityID));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <citiesContext.Provider
      value={{ isLoading, cities, currentCity, createCity, deleteCity }}
    >
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
