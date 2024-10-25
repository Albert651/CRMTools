import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './Sidebar.css';
import { Link } from 'react-router-dom';

function Sidebar({ isVisible }) {
  return (
    <aside id='sidebar' className={`sidebar bg-primary  ${isVisible ? '' : 'd-none'}`} style={{width: '230px', position: 'fixed', marginTop:'4rem',background:'rgb(109, 109, 236)'}}>
      <ul className="sidebar-nav list-unstyled p-3" id='sidebar-nav'>
        <li className="nav-item p-3">
          <span className='text-light d-flex'>Acceuil</span>
          <Link to='/Accueil' type="button" className="nav-link collapsed btn  w-95 m-2 btn btn-outline-primary">
            <i class="bi bi-bank2">  Acceuil</i>
          </Link>
        </li>
        <span className='text-light d-flex font'>SUIVIE</span>
        <li className="nav-item p-1">
          <Link to='/GestionDeTache' className="nav-link collapsed btn w-95 m-2 btn btn-outline-primary">
            <i className="bi bi-list-task color-light">  Gestion de tache</i>
          </Link>
        </li>
        <li className="nav-item ">
          <Link to='/GestionProspection' href="#" className="nav-link collapsed btn w-95 m-2 btn btn-outline-primary">
          <i class="bi bi-arrow-left-right"> Gestion des prospections</i>
          </Link>
        </li>
        <li className="nav-item p-1">
          <Link to='/GestionOffre' href="#" className="nav-link collapsed btn w-95 m-2 btn btn-outline-primary">
          <i class="bi bi-coin"> Gestion devis/offres</i>
          </Link>
        </li>
        <li className="nav-item p-1">
          <Link to='/GestionDeDocument' href="#" className="nav-link collapsed btn w-95 m-2 btn btn-outline-primary">
          <i class="bi bi-filetype-doc"> Gestion des document</i>
          </Link>
        </li>
        <li className="nav-item p-1">
          <Link to='/SuivieInteraction' className="nav-link collapsed btn w-95 m-2 btn btn-outline-primary">
          <i class="bi bi-crosshair"> Suivie interaction</i>
          </Link>
        </li>
        <li className="nav-item p-1">
          <Link variant="outline-primary" href="#" className="nav-link collapsed btn w-95 m-2 btn btn-outline-primary">
          <i class="bi bi-graph-up-arrow"> Rapport</i>
          </Link>
        </li>
        <span className='text-light d-flex p-2'>DONNER RH</span>
        <li className="nav-item p-1">
          <Link to='/GestionDeTache' className="nav-link collapsed btn w-95 m-2 btn btn-outline-primary">
          <i class="bi bi-file-person color-light">  Gestion employées</i>
          </Link>
        </li>
        <span className='text-light d-flex p-2'>ADMINISTRATION</span>
        <li className="nav-item p-1">
          <Link to='/GestionDeTache' className="nav-link collapsed btn w-95 m-2 btn btn-outline-primary">
            <i className="bi bi-people color-light w-20">  Gestion Utilisateur</i>
          </Link>
        </li>
        
        
      
      </ul>
      
    </aside>
  );
}

export default Sidebar;
