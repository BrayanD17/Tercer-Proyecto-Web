import React from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoginRegisterComponent from './components/parents/LoginRegisterComponet';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <LoginRegisterComponent />
      </div>
    </AuthProvider>
  );
}

export default App;
