import React from 'react';
import './App.css';
import LoginRegisterComponent from './components/login-register/LoginRegisterComponet';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <LoginRegisterComponent />
      </div>
    </AuthProvider>
  );
}

export default App;