import React, { useState } from 'react';
import { CiLogin } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { userLogin } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import { Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
  
    // const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
  
    const handleRegister = () => {
      axios('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          username,
          password
        }
      }).then((response) => {
        const token = response.data;
        dispatch(userLogin({username, token}));
        localStorage.setItem('user', JSON.stringify({username, token}));
        navigate("/")
      }).catch((error) => {
        setError('');
        setTimeout(() => setError(''), 3000);
        // console.log(error);
      });
      // dispatch(setUser({username, password, isAdmin: false}));
      // navigate("/events")
    }
   
    
    return (<>
      <div className='login'>
        <h3 className='login-title'><CiLogin style={{scale: '2', marginRight: '10px'}}/>Registrar</h3>
        
        <div className='login-inputs'>
          <input type="text" placeholder="Nome" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirme a senha" value={password2} onChange={(e) => setPassword2(e.target.value)} />
        
        </div>
        <div className='login-buttons'>
          <Link className='login-button' to={"/login"}>Login</Link>
          <Link className='register-button' to={"/register"} onClick={handleRegister}>Register</Link>
        </div>
      <Link className='start-button' to={"/"}>Voltar</Link>
  
  
        {error && <p className='error'>{error}</p>}
      </div></>
    );
  };

export default Register