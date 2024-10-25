import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous d'importer axios
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './Headers.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNotifications } from '../NotificationContext';

import logoAdmine from './R.png'; 

function Headers({ toggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [taches, setTaches] = useState([]);
  const { newTasks } = useNotifications();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };


  useEffect(() => {
    const fetchTaches = async () => {
      try {
        const response = await axios.get('/Taches'); // URL de l'API
        setTaches(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des personnes:', error);
      }
    };
    fetchTaches();
  }, []);

  return (
    <header className='header fixed-top d-flex align-items-center justify-content-between px-3 bg-primary' id='header'
      style={{height: '13vh'}}>
      <div className="logo d-flex align-items-center" style={{gap: 1.5}}>
        <a href="">
          <img src={logoAdmine} alt="Logo" style={{width: 50, height: 40, borderRadius: 55}} />
          <span className='text-light ms-2'>Super Admine</span>
        </a>
        <i className='bi bi-list toggle-sidebar-btn color-light' style={{cursor: 'pointer'}} onClick={toggleSidebar}></i> 
      </div>

      <nav className="header-nav">
        <ul className="liste d-flex align-items-center">
          <li className="nav-item dropdown">
            <a href="" className="nav-link nav-icon" onClick={toggleNotifications}>
              <i className="bi bi-bell" style={{marginRight: 5, transition: 'color 0.3s ease', fontWeight: 700}}></i>
              {newTasks.length > 0 && (
                <span className="badge bg-danger badge-number">{newTasks.length}</span>
              )}
            </a>
            {showNotifications && newTasks.length > 0 && (
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <div className="dropdown-header">
                  Vous avez {newTasks.length} nouvelle(s) tâche(s)
                </div>
                {taches.map((tache, index) => (
                  <div key={tache} className="dropdown-item">
                      <h4>{tache.intitule}</h4>
                      <p>État: {tache.etat}</p>
                      <p>Date prévue: {tache.date_prevus}</p>
                  </div>
                ))}
              </div>
            )}
          </li>
          <li className="nav-item p-3">
            <Link to='/' className="nav-link collapsed btn w-100 m-2 btn btn-danger">
              <FaSignOutAlt /> Deconnecter
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Headers;
