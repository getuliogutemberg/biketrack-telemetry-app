const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// const events = [
//   { 
//     id: 1, 
//     name: 'Giro de Mtb',
//     espects: [
//       { id: 1, name: 'fulano', age: 23, gender: 'M',categoria: 'Adulto',modalidade: 'Speed',},
//       { id: 2,name: 'beltrano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed',},
//       { id: 3,name: 'ciclano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed',},
//       { id: 4,name: 'miculano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed',},
//     ],
//     description: 'Descrição do evento',
//     map: 'http://www.google.com.br',
//     organizer: {
//       name: 'Getulio',
//       email: 'getulio.dev@gmail',
//     },
//     image: 'https://www.pedal.com.br/fotos/noticias/11953001f.jpg',
//     date: new Date(),
//     modal: 'mtb',
//     attendees: [
//       { id: 1, name: 'fulano', age: 23, gender: 'M',categoria: 'Adulto',modalidade: 'Speed',posicao: 1,cordenadas: [-8.047562, -34.877044],},
//       { id: 2,name: 'beltrano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed', posicao: 2,cordenadas: [-8.046562, -34.877044],},
//       { id: 3,name: 'ciclano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed', posicao: 3,cordenadas: [-8.045562, -34.877044],},
//       { id: 4,name: 'miculano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed', posicao: 4,cordenadas: [-8.044562, -34.877044],},
    
//     ],   
//     circuito: 'http://www.google.com.br',
//   },
//   { 
//     id: 2, 
//     name: 'Giro de Speed',
//     espects: [
//       { id: 1, name: 'Jorge', age: 23 },
//       { id: 2, name: 'Maria', age: 22 },
//     ],
//     description: 'Descrição do evento',
//     map: 'http://www.google.com.br',
//     organizer: {
//       name: 'Getulio',
//       email: 'getulio.dev@gmail',
//     },
//     image: 'https://www.opopularjm.com.br/wp-content/uploads/2019/09/DSC_1959.jpg',
//     date: new Date(),
//     modal: 'Speed',
//     attendees: [
//       { id: 1, name: 'fulano', age: 23, gender: 'M',categoria: 'Adulto',modalidade: 'Speed',posicao: 1,cordenadas: [-8.047562, -34.877044],},
//       { id: 2,name: 'beltrano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed', posicao: 2,cordenadas: [-8.046562, -34.877044],},
//       { id: 3,name: 'ciclano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed', posicao: 3,cordenadas: [-8.045562, -34.877044],},
//       { id: 4,name: 'miculano', age: 22, gender: 'M',categoria: 'Adulto',modalidade: 'Speed', posicao: 4,cordenadas: [-8.044562, -34.877044],},
    
//     ],
//     circuito: 'http://www.google.com.br',
//   },
// ];

mongoose.connect('mongodb://localhost:27017/biketrack-telemetry');
mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  location: [ Number, Number ],
  isAdmin: Boolean,
  image: String,
  dateCreated: Date,
  modal: String,
});
// Modelo de Evento
const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  espects: Array,
  location: String,
  organizer: String,
  image: String,
  date: String,
  modal: String,
  attendees: Array,
  circuito: String,
});

// modelo de Usuário


const Event = mongoose.model('Event', eventSchema);

const User = mongoose.model('User', userSchema);


// Middleware para autenticação
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  jwt.verify(token, 'btt', (err, user) => {
    // console.log(err)
    if (err) return res.status(403);
    req.user = user;
    next();
  });
};

// Rotas
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  
  if (user) {
    // console.log(user)
    const token = jwt.sign({ username, password }, 'btt');
    res.json(token);
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.get('/events',authenticateToken,  async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/events', authenticateToken, async (req, res) => {
  const event = req.body;
  // console.log(event)
  try {
    const newEvent = await Event.create(event);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/events/:id', authenticateToken, async (req, res) => {
  const event = req.body;
  const { id } = req.params;
  console.log(event)
  try {
    const newEvent = await Event.updateOne({ _id: id }, event);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    res.json(deletedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  const user = req.body;
  
  try {
    // Verifique se já existe um usuário com o mesmo email
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      return res.status(400).json({ error: 'Este email já está sendo usado por outro usuário.' });
    }

    // Se não houver um usuário com o mesmo email, crie o novo usuário
    const newUser = await User.create(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  
app.get('/users',authenticateToken, async (req, res) => {

  // console.log(req.user)
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


app.get('/events/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const eventFromDatabase = await Event.findById(id);
    if (!eventFromDatabase) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(eventFromDatabase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/registerEspect/:id', authenticateToken, async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, { $push: { espects: user } }, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/removeEspect/:id',authenticateToken, async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;
 
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $pull: { espects: user } },
      { new: true }
    );

    console.log(updatedEvent);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/registerParticipant/:id', authenticateToken, async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, { $push: { attendees: user } }, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/removeParticipant/:id',authenticateToken, async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;
 
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $pull: { attendees: user } },
      { new: true }
    );

    console.log(updatedEvent);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Adicione mais rotas conforme necessário

// Socket.io para comunicação em tempo real

app.post('/updateCoordinates', (req, res) => {
  const { participantId, newCoordinates } = req.body;
  console.log(participantId, newCoordinates);
  // Atualizar as coordenadas no servidor

  // Enviar a atualização para todos os clientes conectados
  io.emit('updateLocation', { id: participantId, coordinates: newCoordinates });

  res.status(200).send('Coordenadas atualizadas com sucesso');
});



io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  
  // Lógica para receber dados de geolocalização dos corredores e transmitir para os espectadores
  socket.on('updateCoordinates', (data) => {
    console.log('Received coordinates:', data);
    io.emit('updateLocation', data);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
