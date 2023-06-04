import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../Dashboard/styles.module.css';

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activity, setActivity] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events'));
    if (storedEvents) {
      setEvents(storedEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const selectedEvent = events.find(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );

    setSelectedEvent(selectedEvent);
  };

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handleAddActivity = () => {
    if (!selectedDate || activity === '') {
      return; // No permite agregar actividades sin fecha o descripción
    }

    const newEvent = {
      date: selectedDate,
      activity: activity,
    };

    setEvents([...events, newEvent]);
    setActivity('');
  };

  const isEventDate = (date) => {
    return events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const tileContent = ({ date }) => {
    if (isEventDate(date)) {
      return <div className={styles.eventMarker}></div>;
    }
    return null;
  };

  return (
    <div>
      <h1>Agenda</h1>
      <div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
        />
        <input
          type="text"
          placeholder="Actividad"
          value={activity}
          onChange={handleActivityChange}
        />
        <button onClick={handleAddActivity}>Agregar</button>
      </div>
      {selectedEvent && (
        <div>
          <h3>Detalles del Evento</h3>
          <p>Fecha: {selectedEvent.date.toLocaleDateString()}</p>
          <p>Actividad: {selectedEvent.activity}</p>
        </div>
      )}
    </div>
  );
};

export default Calendario;
