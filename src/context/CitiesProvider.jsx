import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

const citiesContext = createContext();
const URL_BASE = 'http://localhost:9000';
const initialState = {
  currentCity: {},
  cities: [],
  isLoading: false,
  error: '',
};
function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/added':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload),
      };
    case 'error/abort':
      return { ...state, isLoading: false, error: action.payload };
    case 'error/message':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Unknown Action Type');
  }
}
function CitiesProvider({ children }) {
  const [{ currentCity, cities, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchCities() {
      dispatch({ type: 'loading' });
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

        dispatch({ type: 'cities/loaded', payload: data });
      } catch (error) {
        if (error.name === 'AbortError') {
          dispatch({
            type: 'error/abort',
            payload: 'Fetch aborted due to component unmounting.',
          });
        } else {
          dispatch({
            type: 'error/message',
            payload: `Error fetching cities:, ${error.message}`,
          });
        }
      }
    }
    fetchCities();
    return () => controller.abort(); // Cleanup function to abort fetch if component unmounts
  }, []);

  const loadCurrentCity = useCallback(async id => {
    dispatch({ type: 'loading' });
    try {
      const response = await fetch(`${URL_BASE}/cities/${id}`);
      if (!response.ok) throw new Error('failed to load city');
      const data = await response.json();
      dispatch({ type: 'city/loaded', payload: data });
    } catch (error) {
      dispatch({ type: 'error/message', payload: error.message });
    }
  }, []);

  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const response = await fetch(`${URL_BASE}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });
      if (!response.ok) throw new Error('failed to add city');
      const data = await response.json();
      dispatch({ type: 'city/added', payload: data });
    } catch (error) {
      dispatch({ type: 'error/message', payload: error.message });
    }
  }

  async function deleteCity(cityId) {
    dispatch({ type: 'loading' });
    try {
      const response = await fetch(`${URL_BASE}/cities/${cityId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('failed to DELETE city');
      dispatch({ type: 'city/deleted', payload: cityId });
    } catch (error) {
      dispatch({ type: 'error/message', payload: error.message });
    }
  }
  return (
    <citiesContext.Provider
      value={{
        isLoading,
        cities,
        loadCurrentCity,
        currentCity,
        createCity,
        deleteCity,
      }}
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
