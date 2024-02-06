import React from 'react';

import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

function App({ children }) {


  return (
    
      <div className="App">
        <Header />
        <div className="container">
        <Sidebar/>
        <Content children={children}/>
        </div>
      </div>
    
  );
}

export default App;
