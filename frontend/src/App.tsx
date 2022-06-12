import React from 'react';
import {Routes, Route} from "react-router-dom";
import { HomePage } from './pages/index';
import './App.css';
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";

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
