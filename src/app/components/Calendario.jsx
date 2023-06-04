import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../estilos/Calendario.module.css';

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activity, setActivity] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events'));
    if (storedEvents && storedEvents.length > 0) {
      setEvents(storedEvents.map(event => ({ ...event, date: new Date(event.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events.map(event => ({ ...event, date: event.date.toISOString() }))));
  }, [events]);

  useEffect(() => {
    const filteredEvent = events.find(
      (event) =>
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
    );
    if (filteredEvent) {
      setActivity(filteredEvent.activity);
    } else {
      setActivity('');
    }
  }, [selectedDate, events]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setActivity('');
  };

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handleAddActivity = () => {
    if (!selectedDate || activity === '') {
      return;
    }

    const newEvent = {
      date: selectedDate,
      activity: activity,
    };

    setEvents([...events, newEvent]);
    setActivity('');
  };

  const handleDeleteEvent = (event) => {
    const updatedEvents = events.filter((e) => e !== event);
    setEvents(updatedEvents);
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
        <Calendar onChange={handleDateChange} value={selectedDate} tileContent={tileContent} />
        <input type="text" placeholder="Actividad" value={activity} onChange={handleActivityChange} />
        <button onClick={handleAddActivity}>Agregar</button>
      </div>
     
      {selectedDate && (
        <div>
          <h3>Eventos del Día</h3>
          {events
            .filter(
              (event) =>
                event.date.getDate() === selectedDate.getDate() &&
                event.date.getMonth() === selectedDate.getMonth() &&
                event.date.getFullYear() === selectedDate.getFullYear()
            )
            .map((event, index) => (
              <div key={index}>
                <p>{event.activity}</p>
                <button onClick={() => handleDeleteEvent(event)}>Eliminar</button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Calendario;
