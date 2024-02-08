import React, { useEffect, useState } from 'react';
import { CiLogin } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { userLogin } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import { Link } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const [imageLobby, setImageLobby] = React.useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = () => {
    axios('http://localhost:5005/login', {
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
      setError('Usuário ou senha inválidos');
      setTimeout(() => setError(''), 3000);
      // console.log(error);
    });
    // dispatch(setUser({username, password, isAdmin: false}));
    // navigate("/events")
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
 
  
  return (
    <div className='login'>
    <div className='login-form'>
      <h3 className='login-title'><CiLogin style={{scale: '2', marginRight: '10px'}}/>Login</h3>
      
      <div className='login-inputs'>
        <input className='input' type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className='input' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress}/>
      </div>
      <div className='login-buttons'>
        <Link className='start-button' to={"/"}>Voltar</Link>
        <Link className='start-button' onClick={() => handleLogin()}>Login</Link>
        <Link className='start-button' to={"/register"}>Register</Link>
      </div>
      {error && <p className='error-login'>{error}</p>}
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

export default Login;