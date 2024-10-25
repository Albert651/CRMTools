import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrashAlt, FaPenAlt } from 'react-icons/fa';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import './Contact.css';

const alertStyle = {
  position: 'fixed',
  top: '6.8rem',
  right: '20px',
  width: '300px',
  zIndex: 9999,
  padding: '-2px',
  height: '2vh',
};

export default function Prospection() {
  const [prospections, setProspections] = useState([]);
  const [filters, setFilters] = useState({
    etat: '',
    intervenant: '',
    date_prospection: '',
    date_prochaine_action: '',
    
  });


  const [contacts, setContacts] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false); // pour contrôler l'affichage du formulaire contact
  const [modalPage, setModalPage] = useState(1); 
  const [modalMode, setModalMode] = useState('add');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prospectionToDelete, setProspectionToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [newProspection, setNewProspection] = useState({
    etat: '',
    intitule: '',
    intervenant: '',
    client: '',
    entreprise: '',
    type_action: '',
    montant: '',
    unite: '',
    date_prospection: '',
    date_realisation:'',
    source_contact: '',
    prochaine_action: '',
    date_prochaine_action: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [prospectionsPerPage] = useState(5);

  const fetchProspections = async () => {
    try {
      const response = await axios.get('/Prospections');
      setProspections(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prospections:", error);
      setAlert({ show: true, message: 'Erreur lors de la récupération des prospections.', variant: 'danger' });
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
    }
  };

  useEffect(() => {
    fetchProspections();
    fetchContacts();
  }, []);

  const handleFilterChange = ({ target: { name, value } }) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      etat: '',
      intervenant: '',
      date_prospection: '',
      date_prochaine_action: '',
    });
  };

  const filteredProspections = prospections.filter((prospection) => {
    return (
      (filters.etat === '' || prospection.etat === filters.etat) &&
      (filters.intervenant === '' || prospection.intervenant === filters.intervenant) &&
      (filters.date_prospection === '' || prospection.date_prospection === filters.date_prospection) &&
      (filters.date_prochaine_action === '' || prospection.date_prochaine_action === filters.date_prochaine_action)
    );
  });

  const handleNextPage = () => {
    setModalPage(prev => Math.min(prev + 1, 2));
  };
  
  const handlePreviousPage = () => {
    setModalPage(prev => Math.max(prev - 1, 1));
  };

  const uniqueEtat = [...new Set(prospections.map((prospections) => prospections.etat))];
  const uniqueIntervenant = [...new Set(prospections.map((prospections) => prospections.intervenant))];
  const uniqueDatePrevus = [...new Set(prospections.map((prospections) => prospections.date_prospection))];
  const uniqueDateDeRealisation = [...new Set(prospections.map((prospections) => prospections.date_prochaine_action))];

  const indexOfLastProspection = currentPage * prospectionsPerPage;
  const indexOfFirstProspection = indexOfLastProspection - prospectionsPerPage;
  const currentProspections = filteredProspections.slice(indexOfFirstProspection, indexOfLastProspection);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleShow = (mode, prospection = null) => {
    setModalMode(mode);
    if (mode === 'edit' && prospection) {
      setNewProspection({ ...prospection });
    } else {
      setNewProspection({
        etat: '',
        intitule: '',
        intervenant: '',
        client: '',
        entreprise: '',
        type_action: '',
        montant: '',
        unite: '',
        date_prospection: '',
        date_realisation:'',
        source_contact: '',
        prochaine_action: '',
        date_prochaine_action: '',
      });
    }
    setShowModal(true);
    setModalPage(1);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProspection({
      ...newProspection,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isChecked = !!newProspection.intervenant;
      if (modalMode === 'add') {
        // Vérification des champs requis
        const requiredFields = [
          'intitule',
          'client',
          'entreprise',
          'type_action',
          'montant',
          'unite',
          'date_prospection',
          'source_contact',
          'prochaine_action',
          'date_prochaine_action'
        ];

        const missingFields = requiredFields.filter(field => !newProspection[field]);
        if (missingFields.length > 0) {
          setAlert({
            show: true,
            message: `Veuillez remplir les champs suivants : ${missingFields.join(', ')}`,
            variant: 'danger'
          });
          return;
        }

        const prospectToSubmit = {
          ...newProspection,
          intervenant: isChecked ? newProspection.intervenant : 'Monsieur',
          etat: isChecked ? 'En cours' : 'À faire',
          // Conversion du montant en string comme attendu par le backend
          montant: String(newProspection.montant)
        };

        const response = await axios.post('/Prospections', prospectToSubmit);
        
        if (response.data) {
          setAlert({ 
            show: true, 
            message: 'Prospection ajoutée avec succès.', 
            variant: 'success' 
          });
          fetchProspections();
          handleClose();
        }
      } else {
        if (newProspection.etat === 'Réalisé') {
          newProspection.date_realisation = newProspection.date_realisation || new Date().toISOString().split('T')[0];
        }
        
        const updatedProspection = { 
          ...newProspection,
          etat: newProspection.etat || 'En cours',
          montant: String(newProspection.montant)
        };

        const response = await axios.put(`/Prospections/${updatedProspection.id}`, updatedProspection);
        
        if (response.data) {
          setAlert({ 
            show: true, 
            message: 'Prospection mise à jour avec succès.', 
            variant: 'success' 
          });
          fetchProspections();
          handleClose();
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de la Prospection:", error);
      
      let errorMessage = "Une erreur est survenue lors de l'ajout/modification de la Prospection.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setAlert({ 
        show: true, 
        message: errorMessage, 
        variant: 'danger' 
      });
    }
};

  const confirmDelete = (prospection) => {
    setProspectionToDelete(prospection);
    setShowConfirmModal(true);
  };

  const deleteProspection = async () => {
    try {
      await axios.delete(`/Prospections/${prospectionToDelete.id}`);
      fetchProspections();
      setShowConfirmModal(false);
      setAlert({ show: true, message: 'Prospection supprimée avec succès.', variant: 'success' });
    } catch (error) {
      console.error("Erreur lors de la suppression de la prospection:", error);
      setAlert({ show: true, message: 'Erreur lors de la suppression de la prospection.', variant: 'danger' });
    }
  };

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

      <div className="card mb-4 mt-5">
        <div className="card-header bg-primary text-white">
          <h5>Suivie prospections client</h5>
        </div>
        <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="etat" className="form-label">
                  Etat
                </label>
                <select
                  id="etat"
                  name="etat"
                  className="form-select"
                  value={filters.etat}
                  onChange={handleFilterChange}
                >
                  <option value="">Veuillez choisir l'etat</option>
                  {uniqueEtat.map((etat, index) => (
                    <option key={index} value={etat}>
                      {etat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="intervenant" className="form-label">
                  Intervenant
                </label>
                <select
                  id="intervenant"
                  name="intervenant"
                  className="form-select"
                  value={filters.intervenant}
                  onChange={handleFilterChange}
                >
                  <option value="">Veuillez choisir l'intervenant</option>
                  {uniqueIntervenant.map((intervenant, index) => (
                    <option key={index} value={intervenant}>
                      {intervenant}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="date_prospection" className="form-label" type="date">
                  Date debut
                </label>
                <select
                  type="date"
                  id="date_prospection"
                  name="date_prospection"
                  className="form-select"
                  value={filters.date_prospection}
                  onChange={handleFilterChange}
                >
                  <option value="" type='date'>Veuiller choisir le date de debut prospection</option>
                  {uniqueDatePrevus.map((date_prospection, index) => (
                    <option key={index} value={date_prospection}>
                      {date_prospection}
                    </option>
                  ))}
                </select>
              </div>
               <div className="col-md-6">
                <label htmlFor="date_prochaine_action" className="form-label">
                  Date fin 
                </label>
                <select
                  id="date_prochaine_action"
                  name="date_prochaine_action"
                  className="form-select"
                  value={filters.date_prochaine_action}
                  onChange={handleFilterChange}
                >
                  <option value="">Veuiller choisir le date de fin prospection</option>
                  {uniqueDateDeRealisation.map((date_prochaine_action, index) => (
                    <option key={index} value={date_prochaine_action}>
                      {date_prochaine_action}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 d-flex align-items-end mt-3">
                <button className="btn btn-primary me-2">Appliquer les filtres</button>
                <button className="btn btn-secondary" onClick={handleResetFilters}>
                  Réinitialiser filtres
                </button>
              </div>
            </div>
          </div>
      </div>

      <div className="liste card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-info" onClick={() => handleShow('add')}>+ Nouvelle prospection</button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped contact-table">
              <thead>
                <tr>
                  <th>Etat</th>
                  <th>Intitulé</th>
                  <th>Intervenant</th>
                  <th>Client</th>
                  <th>Entreprise</th>
                  <th>Type d'action</th>
                  <th>Montant</th>
                  <th>Uniter</th>
                  <th>Date de prospection</th>
                  <th>Date de realisation</th>
                  <th>Source contact</th>
                  <th>Prochaine action</th>
                  <th>Date de prochaine action</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                  {currentProspections.length > 0 ? (
                    currentProspections.map(prospection => (
                      <tr key={prospection.id} className={prospection.etat === 'Réalisé' ? 'table-success' : prospection.etat === 'En retard' ? 'table-danger' : ''}>
                      <td>{prospection.etat}</td>
                      <td>{prospection.intitule}</td>
                      <td>
                          {prospection.intervenant} 
                          {prospection.intervenant === 'Monsieur' && (
                            <span style={{ color: 'red' }}></span>
                          )}
                        </td>
                      <td>{prospection.client}</td>
                      <td>{prospection.entreprise}</td>
                      <td>{prospection.type_action}</td>
                      <td>{prospection.montant}</td>
                      <td>{prospection.unite}</td>
                      <td>{prospection.date_prospection}</td>
                      <td>{prospection.date_realisation}</td>
                      <td>{prospection.source_contact}</td>
                      <td>{prospection.prochaine_action}</td>
                      <td>{prospection.date_prochaine_action}</td>
                <td className="d-flex justify-content-between" style={{fontSize:'5px'}}>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleShow('edit', prospection)}>
                    <FaPenAlt />
                  </button>
                  <button className="btn btn-sm btn-outline-danger ms-1" onClick={() => confirmDelete(prospection)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">Aucun contact trouvé.</td>
            </tr>
            )}
            
              </tbody>
            </table>
          </div>
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: Math.ceil(filteredProspections.length / prospectionsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Ajouter une prospection' : 'Modifier une prospection'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
              {modalPage === 1 && (
                <>
                  <Form.Group controlId="intitule">
                    <Form.Label>Intitulé</Form.Label>
                    <Form.Control
                      type="text"
                      name="intitule"
                      value={newProspection.intitule}
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
                       value={newProspection.client}
                       onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionnez Client</option>
                      {contacts && contacts.map((contact) => (
                        <option key={contact.nom} value={contact.nom}>
                          {contact.nom}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="entreprise">
                    <Form.Label>Entreprise</Form.Label>
                    <Form.Select
                       type='text'
                       id="contactSelect"
                       name="entreprise"
                       className="form-select"
                       value={newProspection.entreprise}
                       onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionnez l'entreprise</option>
                      {contacts && contacts.map((contact) => (
                      <option key={contact.entreprise} value={contact.entreprise}>
                        {contact.entreprise}
                      </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="type_action">
                    <Form.Label>Type d'action</Form.Label>
                    <Form.Control
                      type='text'
                      name="type_action"
                      value={newProspection.type_action}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group>
                  <Form.Group controlId="montant">
                    <Form.Label>Montant</Form.Label>
                    <Form.Control
                      type="number"
                      name="montant"
                      value={newProspection.montant}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
            <Form.Check
              type="checkbox"
              label="Affecter l'intervenant"
              onChange={(e) => {
                const isChecked = e.target.checked;
                setShowContactForm(isChecked); // Met à jour l'état d'affichage du formulaire contact
                setNewProspection({ ...newProspection, etat: isChecked ? 'En cours' : '' });
              }}
            />
          </Form.Group>
          
          {showContactForm && (
            <Form.Group controlId="intervenant">
              <Form.Label>Intervenant</Form.Label>
              <Form.Control
                as="select"
                name="intervenant"
                value={newProspection.intervenant || ''}
                onChange={handleInputChange}
              >
                <option value="">-- Sélectionnez un intervenant --</option>
                {contacts.map((contacts) => (
                  <option key={contacts.nom} value={contacts.nom}>
                    {contacts.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
                  
                </>
              )}
              {modalPage === 2 && (
                <>
                  <Form.Group controlId="unite">
                  <Form.Label>Uniter</Form.Label>
                  <Form.Select
                    name="unite"
                    value={newProspection.unite}
                    onChange={handleInputChange}
                    required
                  >
                  <option value="">-- Sélectionnez l'Uniter --</option>
                  <option value="£" className='text-success'>£</option>
                  <option value="$" className='text-warning'>$</option>
                  <option value="Ar" className='text-primary'>Ar</option>
                  </Form.Select>

                  </Form.Group>
                  <Form.Group controlId="date_prospection">
                    <Form.Label>Date de prospection</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_prospection"
                      value={newProspection.date_prospection}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="source_contact">
                    <Form.Label>Source de contact</Form.Label>
                    <Form.Control
                      type="text"
                      name="source_contact"
                      value={newProspection.source_contact}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="prochaine_action">
                    <Form.Label>Prochaine action</Form.Label>
                    <Form.Control
                      type="text"
                      name="prochaine_action"
                      value={newProspection.prochaine_action}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="date_prochaine_action">
                    <Form.Label>Date de prochaine action</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_prochaine_action"
                      value={newProspection.date_prochaine_action}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  {/* Affichage conditionnel pour le champ "État" */}
                    {modalMode === 'edit' && (
                    <Form.Group controlId="etat">
                      <Form.Label>État</Form.Label>
                      <Form.Control
                        as="select"
                        name="etat"
                        value={newProspection.etat}
                        onChange={handleInputChange}
                        required
                      >
                      <option value="">Sélectionnez un état</option>
                      <option value="À faire">À faire</option>
                      <option value="En cours">En cours</option>
                      <option value="Réalisé">Réalisé</option>
                      <option value="En retard">En retard</option>
                    </Form.Control>
                  </Form.Group>
                  )}

                  {/* Affichage de la date de réalisation si l'état est "Réalisé" */}
                  {modalMode === 'edit' && newProspection.etat === 'Réalisé' && (
                    <Form.Group controlId="date_realisation">
                    <Form.Label>Date de réalisation</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_realisation"
                      value={newProspection.date_realisation || new Date().toISOString().split('T')[0]}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                )}   

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
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cette prospection ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>Annuler</Button>
          <Button variant="danger" onClick={deleteProspection}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}