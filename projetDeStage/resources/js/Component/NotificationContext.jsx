import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [newTasks, setNewTasks] = useState([]);

  useEffect(() => {
    const fetchTaches = async () => {
      try {
        const response = await axios.get('/Taches');
        // Filtrez ici les nouvelles tâches si nécessaire
        setNewTasks(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
      }
    };
    fetchTaches();
  }, []);

  return (
    <NotificationContext.Provider value={{ newTasks, setNewTasks }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
