import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventsList.css'; 

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'UTC'
  });
};

const EventsList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    
    const fetchEvents = () => {
      axios.get('http://localhost:5000/webhook/events')
        .then(response => {
          setEvents(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the events!', error);
        });
    };

    fetchEvents();

    const intervalId = setInterval(fetchEvents, 15000); 


    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div>
      <h1>GitHub Events</h1>
      <ul className="events-list">
        {events.map((event, index) => {
          let message;
          if (event.action === 'push') {
            message = `${event.author} pushed to ${event.to_branch} on ${formatDate(event.timestamp)}`;
          } else if (event.action === 'pull_request') {
            message = `${event.author} submitted a pull request from ${event.from_branch} to ${event.to_branch} on ${formatDate(event.timestamp)}`;
          } else if (event.action === 'merge') {
            message = `${event.author} merged branch ${event.from_branch} to ${event.to_branch} on ${formatDate(event.timestamp)}`;
          }
          
          return <li key={index}>{message}</li>;
        })}
      </ul>
    </div>
  );
};

export default EventsList;
