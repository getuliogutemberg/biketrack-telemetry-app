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

const io = socketIo(server,{
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5005;


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

const messageSchema = new mongoose.Schema({
  username: String,
  messagem: String,
});

const positionSchema = new mongoose.Schema({
  username: String,
  x: Number,
  y: Number,
  date: Date,
});

// modelo de Usuário


const Event = mongoose.model('Event', eventSchema);

const User = mongoose.model('User', userSchema);

const Message = mongoose.model('Message', messageSchema);

const Position = mongoose.model('Position', positionSchema);


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
  // console.log(event)
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

    // console.log(updatedEvent);
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

    // console.log(updatedEvent);
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


io.on('connection', async (socket) => {
  
  console.log('Novo cliente conectado' + socket.id);
  io.emit('historicChat', await Message.find());
  io.emit('positions', await Position.find());
  

  socket.on('getChatHistory', async () => {
    // Emita o histórico de mensagens para o cliente que solicitou
    socket.emit('historicChat', await Message.find());
  });

  socket.on('deleteMessage', async (data) => {
    await Message.findByIdAndDelete(data);    
    io.emit('historicChat', await Message.find());
  })

  socket.on('messagem', (data) => {
    console.log( data.username + ' enviou:', data.messagem,);
    Message.create({ username: data.username, messagem: data.messagem });
    io.emit('messagens', { username: data.username, messagem: data.messagem });
  });

  socket.on('enterLobby', async (data) => {
    
    const isInLobby = await Position.findOne({ username: data.username });

    !isInLobby && await Position.create({ username: data.username, x: data.x, y: data.y, date: new Date() });
    io.emit('positions', await Position.find());
  });

  socket.on('getUser', async (data) => {
    const user = await User.findById(data);
    socket.emit('user', user);
  });

  socket.on('getUsers', async () => {
    socket.emit('users', await User.find());
  });

  socket.on('getPositions', async () => {
    socket.emit('positions', await Position.find());
  });

  socket.on('moveUser', async (data) => {
    console.log( 'O cliente ' + data.username + ' moveu para:', data.x, data.y);
    const oldPosition = await Position.findOne({ username: data.username });
    await Position.updateOne({ username: data.username }, { $set: { x: oldPosition.x + data.x, y: oldPosition.y + data.y, date: new Date() } }, { upsert: true });
    io.emit('positions', await Position.find());
  });

  socket.on('removeUser', async (data) => {
    console.log('User disconnected:', data);
    // Remover a posição do usuário
    await Position.deleteOne({ username: data.username });
    // Enviar posições atualizadas para todos os clientes
    io.emit('positions', await Position.find());
  });

  socket.on('disconnect', async () => {
    // Quando o socket é desconectado, emitimos um evento para remover a posição do usuário do servidor
    console.log('Cliente desconectado');
    // const username = await Position.findOne({ socketId: socket.id }).select('username');
    // if (username) {
    //   socket.emit('removeUser', { username: username });
    // }
  });

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
