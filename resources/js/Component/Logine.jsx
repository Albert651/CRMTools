import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client'; 

export default function Logine() {
    return (
        <main>
            <div className="container">
                <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="d-flex justify-content-center py-4">
                                    <a href="#" className="logo d-flex align-items-center w-auto">
                                        <img src="./Image/dev3.jpg" alt="" />
                                        <span className="d-none d-lg-block">Super Admin</span>
                                    </a>
                                </div>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="pt-4 pb-2">
                                            <h5 className="card-title text-center pb-0 fs-4">Logine</h5>
                                            <p className="text-center-small">CRM</p>
                                        </div>
                                        <form action="" className="row g-3 needs-validation">
                                            <div className="col-12">
                                                <label htmlFor="nom" className="form-label">Nom</label>
                                                <input type="text" name='nom' className='form-control' id='nom' required />
                                                <div className='invalid-feedback'>Entrer votre nom</div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <div className="input-group has-validation">
                                                    <span className='input-group-text' id='inputGroupPrepend'>@</span>
                                                    <input type="text" name='email' className='form-control' id='email' required />
                                                    <div className='invalid-feedback'>Entrer votre email</div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="motdepasse" className="form-label">Mot de Passe</label>
                                                <input type="password" name='motdepasse' className='form-control' id='motdepasse' required />
                                                <div className='invalid-feedback'>Entrer votre mot de passe</div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input type="checkbox" className='form-check-input' name='remember' value="true" id='rememberMe' />
                                                    <label htmlFor="rememberMe" className='form-check-label'>Se souvenir de moi</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <Link to='/Acceuil' className='btn btn-primary w-100'> Se connecter</Link>
                                            </div>
                                            <div className="col-12">
                                                <p className="small mb-0">Vous n'avez pas de compte? <a href="#">Créer un compte</a></p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}




