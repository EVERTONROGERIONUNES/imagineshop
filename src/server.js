import 'dotenv/config';
import express from 'express';
import UserService from '../src/services/user.service.js';
import authMiddleware from './middlewares/auth.middleware.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ImagineShop API');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userService = new UserService();
  try {
    const token = await userService.login(email, password);
    return res.status(200).json({ access_token: token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// C - CREATE
app.post('/users', authMiddleware, async (req, res) => {
  const { name, email, password } = req.body;
  const userService = new UserService();
  await userService.add(name, email, password);
  return res.status(201).json({ message: 'success' });
});

// R - READ
app.get('/users', authMiddleware, async (req, res) => {
  const userService = new UserService();
  const users = await userService.findAll();
  return res.status(200).json(users);
});

app.get('/users/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const userService = new UserService();
  const user = await userService.findById(id);
  return res.status(200).json(user);
});

// U - UPDATE
app.put('/users/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  const user = { name, email, password };
  const userService = new UserService();
  try {
    await userService.update(id, user);
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return res.status(404).json({ message: error.message })
  }
});

// D - DELETE
app.delete('/users/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const userService = new UserService();
  try {
    await userService.delete(id);
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});