import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaTrashAlt, FaPenAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Contact.css';

const alertStyle = {
  position: 'fixed',
  top: '6.8rem',
  right: '20px',
  width: '300px',
  zIndex: 9999,
  padding: '-2px',
  height:'2vh'
};


const Resumer = () => {
  const [resumers, setResumer] = useState([]);
  const [contact, setContacts] = useState([]);
  const [filteredResumer, setFilteredResumer] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [resumerToDelete, setResumerToDelete] = useState(null);
  const [modalPage, setModalPage] = useState(1);
  const [newResumer, setNewResumer] = useState({
    intituler:'',
    resumer:'',
    client:'',
    email_client:'',
    source:'',
    date_resumer:'',
    
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [resumerPerPage] = useState(5);


  useEffect(() => {
    fetchResumer();
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/contacts'); // Remplacez par votre URL d'API
        setContacts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des personnes:', error);
      }
    };
    fetchContacts();
  }, []);

  

  const fetchResumer = async () => {
    try {
      const response = await axios.get('/Resumer');
      setResumer(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
    }
  };


  const handleShow = (mode, resumers = null) => {
    setModalMode(mode);
    if (mode === 'edit' && resumers) {
      setNewResumer(resumers);
    } else {
      setNewResumer({
        intituler:'',
        resumer:'',
        client:'',
        email_client:'',
        source:'',
        date_resumer:'',

      });
    }
    setShowModal(true);
    setModalPage(1);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResumer({
      ...newResumer,
      [name]: value
    });
  };

 


  // ajouter le donner au table devis
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post('/Resumer', newResumer);
        setAlert({ show: true, message: 'Resumé ajouté avec succès.', variant: 'success' });
      } else {
        await axios.put(`/Resumer/${newResumer.id}`, newResumer);
        setAlert({ show: true, message: 'Resumé mis à jour avec succès.', variant: 'success' });
      }
      fetchResumer();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de resumé:", error);
      setAlert({ show: true, message: `Échec de l'opération: ${modalMode === 'add' ? 'ajout' : 'mise à jour'} dz resumé.`, variant: 'danger' });
    }
  };

  //modifier le donner au table devis
  const editResumer = (Resumer) => {
    setSelectedResumer(Resumer);
    setNewResumer({
      intituler: Resumer.intituler,
      resumer: Resumer.resumer,
      client: Resumer.client,
      email_client: Resumer.email_client,
      source: Resumer.source,
      date_resumer: Resumer.date_resumer
      
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/Resumer/${setSelectedResumer.id}`, newResumer);
      fetchResumer();
      setAlert({ show: true, message: 'Offre mis à jour avec succès.', variant: 'success' });
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'offre:", error);
      setAlert({ show: true, message: "Échec de la mise à jour d'offre.", variant: 'danger' });
    }
  };

  // Fonction pour ouvrir la boîte de confirmation avant suppression
  const confirmDelete = (resumer) => {
    setResumerToDelete(resumer);
    setShowConfirmModal(true); // Afficher la boîte de confirmation
  };

  const deleteResumer = async () => {
    try {
      await axios.delete(`/Resumer/${resumerToDelete.id}`);
      fetchResumer();  // Rafraîchir la liste des contacts après suppression
      setShowConfirmModal(false); // Fermer la boîte de confirmation
    } catch (error) {
      console.error("Erreur lors de la suppression d'offres:", error);
    }
  };
  const indexOfLastResumer = currentPage * resumerPerPage;
  const indexOfFirsResumer = indexOfLastResumer - resumerPerPage;
  const currentResumer = filteredResumer.slice(indexOfFirsResumer, indexOfLastResumer);

  const handleNextPage = () => {
    setModalPage(2);
  };

  const handlePreviousPage = () => {
    setModalPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  return (
    <div className="contact-container container">
      {alert.show && (
        <div style={alertStyle}>
          <Alert 
            variant={alert.variant} 
            onClose={() => setAlert({ show: false })} 
            dismissible
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <div className='mt-3'>
        <div className='mt-3'>
          <Link to='/SuivieInteraction' className="btn btn-outline-primary">
          <i class="bi bi-bank2"> Gestion de resumer</i>
          </Link>{' '}
          <Link to='/HistoriqueAppel' className='ms-2 btn btn-outline-primary'>
          <i class="bi bi-telephone-fill"> Historique d'appel</i>
          </Link>{' '}
          <Link to='/HistoriqueEmail'  className='ms-2 btn btn-outline-primary'>
          <i class="bi bi-envelope-at"> Historique email</i>
          </Link>
        </div>
      </div>
      <div className="card mb-4 mt-4">
        <div className="card-header bg-primary text-white">
          <h5>Suivie interaction</h5>
        </div>
        

      {/* Offre Table */}
    <div className="liste card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-info" onClick={() => handleShow('add')}>+ AJOUT RESUME</button>
          <input type="text" className="form-control w-25" placeholder="Rechercher" />
        </div>
        <div className='align-items-center justify-content-center bg-dark'>
          <h4 className='text-light'>Liste des résumes</h4>
        </div>
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Intitulé</th>
              <th>Resumé</th>
              <th>Client</th>
              <th>Email client</th>
              <th>Source </th>
              <th>Date resumé</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {resumers.map(resumer => (
              <tr key={resumer.id}>
                <td>{resumer.intituler}</td>
                <td>{resumer.resumer}</td>
                <td>{resumer.client}</td>
                <td>{resumer.email_client}</td>
                <td>{resumer.source}</td>
                <td>{resumer.date_resumer}</td>
                <td className='d-flex ms-1'>
                  <Button variant="outline-primary  " size="sm" onClick={() => handleShow('edit', resumer)}>
                  <FaPenAlt />
                  </Button>
                  <Button variant="outline-danger ms-1" size="sm"  onClick={() => confirmDelete(resumer)}>
                  <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredResumer.length / resumerPerPage) }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </div>

      {/* Modal for adding/editing offers */}
      
      <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton className='bg-dark'>
            <Modal.Title className='text-light'>{modalMode === 'add' ? 'Ajout Resumé' : 'Modifier Resumé'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {modalPage === 1 && (
                <>
                  <Form.Group controlId="intituler">
                    <Form.Label>Intitulé</Form.Label>
                    <Form.Control
                      type="text"
                      name="intituler"
                      value={newResumer.intituler}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="resumer">
                    <Form.Label>Resumé</Form.Label>
                    <Form.Control
                      type="text"
                      name="resumer"
                      value={newResumer.resumer}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="client">
                    <Form.Label>Client</Form.Label>
                    <Form.Select
                       id="contactSelect"
                       name="client"
                       className="form-select"
                       value={newResumer.client}
                       onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionnez le client</option>
                      {contact.map((contact) => (
                        <option key={contact.nom} value={contact.nom}>
                      {contact.nom}
                      </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                </>
              )}

              {modalPage === 2 && (
                <>
                <Form.Group controlId="email_client">
                    <Form.Label>Email client</Form.Label>
                    <Form.Select
                       id="contactSelect"
                       name="email_client"
                       className="form-select"
                       value={newResumer.email_client}
                       onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionnez l'email client</option>
                      {contact.map((contact) => (
                        <option key={contact.email} value={contact.email}>
                      {contact.email}
                      </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="source">
                  <Form.Label>Source</Form.Label>
                  <Form.Select
                    name="source"
                    value={newResumer.source}
                    onChange={handleInputChange}
                    required
                  >
                  <option value="">-- Veuillez choisir la source --</option>
                  <option value="email">Email</option>
                  <option value="appel">Appel</option>
                  </Form.Select>

                  </Form.Group>
                  <Form.Group controlId="date_resumer">
                    <Form.Label>Date resumer</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_resumer"
                      value={newResumer.date_resumer}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                
                  <Button variant="primary" type="submit" className="mt-3">
                    {modalMode === 'add' ? 'Ajouter' : 'Mettre à jour'}
                  </Button>
                </>
              )}
            </Form>

            <div className="d-flex justify-content-between mt-3">
              {modalPage > 1 && (
                <Button variant="secondary" onClick={handlePreviousPage}>
                  Précédent
                </Button>
              )}
              {modalPage < 2 && (
                <Button variant="primary" onClick={handleNextPage}>
                  Suivant
                </Button>
              )}
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation de suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer la tâche "{resumerToDelete?.client}" ?
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteResumer}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
    </div>
  );
};

export default Resumer;
