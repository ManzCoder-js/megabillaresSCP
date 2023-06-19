import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../estilos/Calendario.module.css';
import { db } from './firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const CalendarHeader = ({ year, month, onPreviousMonth, onNextMonth }) => {
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  return (
    <div className={styles.header}>
      <button onClick={onPreviousMonth}>{'<'}</button>
      <h2>{`${monthNames[month]} ${year}`}</h2>
      <button onClick={onNextMonth}>{'>'}</button>
    </div>
  );
};

const CalendarGrid = ({ year, month, events, selectedDate, onDateChange, onDeleteEvent }) => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];

  // Render day labels
  days.forEach((day) => {
    cells.push(
      <div key={`label-${day}`} className={styles.cell}>
        <div className={styles.dayLabel}>{day}</div>
      </div>
    );
  });

  // Render empty cells before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className={styles.cell}></div>);
  }

  // Render day cells
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const isEvent = events.some(
      (event) =>
        event.date &&
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
    const isSelected =
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month;

    const eventForDay = events.find(
      (event) =>
        event.date &&
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );

    cells.push(
      <div
        key={day}
        className={`${styles.cell} ${isEvent ? styles.event : ''} ${
          isSelected ? styles.selected : ''
        }`}
        onClick={() => onDateChange(date)}
      >
        <div className={styles.day}>{day}</div>
        {eventForDay && <div className={styles.eventData}>{eventForDay.activity}</div>}
      </div>
    );
  }

  return <div className={styles.grid}>{cells}</div>;
};

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activity, setActivity] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'eventos'));
        const storedEvents = querySnapshot.docs.map((doc) => {
          const eventData = doc.data();
          const date = eventData.date ? eventData.date.toDate() : null;
          return {
            id: doc.id,
            ...eventData,
            date: date,
          };
        });
        setEvents(storedEvents);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError('Error al cargar los eventos');
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const today = new Date();
    setYear(selectedDate ? selectedDate.getFullYear() : today.getFullYear());
    setMonth(selectedDate ? selectedDate.getMonth() : today.getMonth());
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setActivity('');
  };

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handlePreviousMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };

  const handleAddActivity = async () => {
    if (!selectedDate || activity === '') {
      return;
    }

    try {
      const newEvent = {
        date: selectedDate,
        activity: activity,
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'eventos'), newEvent);
      const createdEvent = {
        id: docRef.id,
        ...newEvent,
      };

      setEvents([...events, createdEvent]);
      setActivity('');
    } catch (error) {
      console.log(error);
      setError('Error al agregar la actividad');
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      await deleteDoc(doc(db, 'eventos', event.id));
      setEvents(events.filter((e) => e.id !== event.id));
    } catch (error) {
      console.log(error);
      setError('Error al eliminar el evento');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.Contenedor}>
      <div className={styles.Calendario}>
        <div className={styles.DatePicker}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Seleccione una fecha"
          />
          <input
            type="text"
            className={styles.inputText}
            placeholder="Actividad"
            value={activity}
            onChange={handleActivityChange}
          />
          <button onClick={handleAddActivity}>Agregar</button>
        </div>

        {error && <div>Error: {error}</div>}

        <CalendarHeader
          year={year}
          month={month}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        <CalendarGrid
          year={year}
          month={month}
          events={events}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      {selectedDate && (
        <div className={styles.eventosDelDia}>
          <h3>Eventos del Día</h3>
          {events
            .filter(
              (event) =>
                event.date &&
                event.date.getDate() === selectedDate.getDate() &&
                event.date.getMonth() === selectedDate.getMonth() &&
                event.date.getFullYear() === selectedDate.getFullYear()
            )
            .map((event, index) => (
              <div key={index} className={styles.evento}>
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
