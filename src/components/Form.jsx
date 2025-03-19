import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import { useURL } from '../hooks/useURL';
import Spinner from './Spinner';
import Button from './Button';
import styles from './Form.module.css';
import { useCities } from '../context/CitiesProvider';
import Message from './Message';

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [isLoadingGeoLocation, setIsLoadingGeoLocation] = useState(false);
  const [emoji, setEmoji] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const [lat, lng] = useURL();
  const { createCity, isLoading } = useCities();
  useEffect(() => {
    (async function () {
      try {
        setIsLoadingGeoLocation(true);
        if (!lat && !lng) return;
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();
        setCityName(data.city || data.locality);
        setEmoji(convertToEmoji(data.countryCode));
        setCountry(data.countryName);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoadingGeoLocation(false);
      }
    })();
  }, [lat, lng]);
  if (isLoadingGeoLocation) return <Spinner />;
  if (!lat || !lng) return <Message message="Click on the map to add city" />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={date => setDate(date)}
          dateFormat="dd/MM/yy"
          showIcon
          closeOnScroll={true}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          onClick={e => {
            e.preventDefault();
            navigate(-1);
          }}
          type="back"
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(country);
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await createCity(newCity);
    navigate('/app/cities');
  }
}

export default Form;
