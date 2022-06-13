import React from 'react';
import {Routes, Route} from "react-router-dom";
import { HomePage, NotFoundPage, SignUpPage } from './pages/index';
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/'} element={<HomePage/>}/>
        <Route path={'/signUp'} element={<SignUpPage/>}/>
        <Route path={'/*'} element={<NotFoundPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
