import React, { useState, useEffect } from 'react';
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

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [newDocument, setNewDocument] = useState({
    file_path:'',
    type: '',
    client_proprietaire: '',
    date_document: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(5);
 

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/Document');
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
    }
  };

  const handleShow = (mode, document = null) => {
    setModalMode(mode);
    if (mode === 'edit' && document) {
      setNewDocument(document);
    } else {
      setNewDocument({
        file_path:'',
        type: '',
        client_proprietaire: '',
        date_document: '',
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in newDocument) {
        formData.append(key, newDocument[key]);
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
  
      if (modalMode === 'add') {
        await axios.post('/Document', formData, config);
        setAlert({ show: true, message: 'Document ajouté avec succès.', variant: 'success' });
      } else {
        // Utiliser PUT au lieu de POST pour la mise à jour
        await axios.put(`/Document/${newDocument.id}`, formData, config);
        setAlert({ show: true, message: 'Document mis à jour avec succès.', variant: 'success' });
      }
      fetchDocuments();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de document:", error);
      setAlert({ show: true, message: `Échec de l'opération: ${error.response?.data?.error || 'Une erreur est survenue'}`, variant: 'danger' });
    }
  };

 
  const confirmDelete = (document) => {
    setDocumentToDelete(document);
    setShowConfirmModal(true);
  };

  const deleteDocument = async () => {
    try {
      await axios.delete(`/Document/${documentToDelete.id}`);
      fetchDocuments();
      setShowConfirmModal(false);
      setAlert({ show: true, message: 'Document supprimé avec succès.', variant: 'success' });
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      setAlert({ show: true, message: "Échec de la suppression du document.", variant: 'danger' });
    }
  };

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);

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

      <div className="card mb-4 mt-4">
        <div className="card-header bg-primary text-white">
          <h5>Gestion de document</h5>
        </div>
        
        <div className="liste card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <button className="btn btn-info" onClick={() => handleShow('add')}>+ Nouveau document</button>
              <input type="text" className="form-control w-25" placeholder="Rechercher" />
            </div>
            <div className='align-items-center justify-content-center bg-dark'>
              <h4 className='text-light'>Liste des documents</h4>
            </div>
            <div className="table-responsive mt-4">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nom du document</th>
                    <th>Type</th>
                    <th>Client propriétaire</th>
                    <th>Date du document</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDocuments.map(document => (
                    <tr key={document.id}>
                      <td>{document.file_path}</td>
                      <td>{document.type}</td>
                      <td>{document.client_proprietaire}</td>
                      <td>{document.date_document}</td>
                      <td className='d-flex ms-1'>
                        <Button variant="outline-primary" size="sm" onClick={() => handleShow('edit', document)}>
                          <FaPenAlt />
                        </Button>
                        <Button variant="outline-danger ms-1" size="sm" onClick={() => confirmDelete(document)}>
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
                  {Array.from({ length: Math.ceil(filteredDocuments.length / documentsPerPage) }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Modal for adding/editing documents */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton className='bg-dark'>
              <Modal.Title className='text-light'>{modalMode === 'add' ? 'Ajouter un document' : 'Modifier un document'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="file_path">
                    <Form.Label>Nom de document</Form.Label>
                    <Form.Control
                    type="file"
                    name="file_path"
                    onChange={handleFileChange}
                    />
                </Form.Group>
                <Form.Group controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="type"
                    value={newDocument.type}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="client_proprietaire">
                  <Form.Label>Client propriétaire</Form.Label>
                  <Form.Control
                    type="text"
                    name="client_proprietaire"
                    value={newDocument.client_proprietaire}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="date_document">
                  <Form.Label>Date du document</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_document"
                    value={newDocument.date_document}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  {modalMode === 'add' ? 'Ajouter' : 'Mettre à jour'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Confirmation Modal */}
          <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation de suppression</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Êtes-vous sûr de vouloir supprimer le document "{documentToDelete?.nom_document}" ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmModal}>
                Annuler
              </Button>
              <Button variant="danger" onClick={deleteDocument}>
                Supprimer
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Document;