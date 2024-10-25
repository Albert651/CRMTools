import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Logine from './Logine';
import Acceuil from './Acceuil'
function Main (){
    return (
        <BrowserRouter basename='/projetDeStage/'>
            <Routes>
                <Route path="/" element={<Logine />} />
                <Route path="/Acceuil" element={<Acceuil />} />
            </Routes>
        </BrowserRouter>
    );
}
ReactDOM.createRoot(document.getElementById('app')).render(<Main/>);


