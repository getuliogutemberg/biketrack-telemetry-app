import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store'
import { Provider } from 'react-redux'
import {
  BrowserRouter, 
  Routes, 
  Route
} from "react-router-dom";
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import Login from './components/Login';
import UserList from './components/UserList';

// import ErrorPage from "./error-page";

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <React.StrictMode>
     <Provider store={store}>
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<App children={<EventList />}/>} />
          <Route path="/login" element={<App children={<Login />}/>} />
          <Route path="/events" element={<App children={<EventList />}/>} />
          <Route path="/events/:id" element={<App children={<EventDetails />}/>} />
          <Route path="/users" element={<App children={<UserList />}/>} />

        </Routes>   
     </BrowserRouter>
     </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
