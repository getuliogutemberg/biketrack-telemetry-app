import React, { useState, useEffect } from 'react';
import { CiLogin } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { userLogin } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';
import { Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [imageLobby, setImageLobby] = React.useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
  
    useEffect(()=>
  {
  const fetchImage = async () => {
    axios.get('https://picsum.photos/1920/1080').then(
      (response) => {
        setImageLobby(response.request.responseURL);
      },
      (error) => {
        setError(error);
      }
    )
  };
  fetchImage();
  const interval = setInterval(() => {
    fetchImage();
  }, 5000);

  return () => clearInterval(interval);

  },[])
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
        setError('Registro desabilitado, tente novamente mais tarde');
        setTimeout(() => {
          setError('')
          // navigate("/")
        }, 3000);
        
        // console.log(error);
      });
      // dispatch(setUser({username, password, isAdmin: false}));
      
    }
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleRegister();
      }
    };
    
    return (
    <div className='register'>
    <div className='register-form'>
      <h3 className='register-title'><CiLogin style={{scale: '2', marginRight: '10px'}}/>Registro</h3>
      
      <div className='register-inputs'>
        <input className='input' type="text" placeholder="Nome" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className='input' type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress}/>
        <input className='input' type="password" placeholder="Confirme a senha" value={password2} onChange={(e) => setPassword2(e.target.value)} onKeyPress={handleKeyPress}/>
      </div>
      <div className='register-buttons'>
        <Link className='start-button' to={"/"}>Voltar</Link>
        <Link className='start-button' to={"/login"}>Login</Link>
        <Link className='start-button' onClick={handleRegister}>Register</Link>
      </div>
      {error && <p className='error-register'>{error}</p>}
      </div>
      <img
        className='image-carousel fade-image'
          src={imageLobby ? imageLobby : '/mulher-ciclista-profissional.jpg'} // Propriedade imageSrc passada para o componente
          alt={'Imagem aleatória'} // Propriedade altText passada para o componente
        /> 
        <div className='degraded-overlay' /> 
      </div>
    );
  };

export default Register