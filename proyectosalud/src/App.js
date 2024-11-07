import React from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoginRegisterComponent from './components/parents/LoginRegisterComponet';
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