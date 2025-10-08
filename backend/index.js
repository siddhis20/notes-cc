import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));

app.get('/health', (req, res) => {
	res.json({ success: true, message: 'OK' });
});

app.use('/notes', notesRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`My Notes backend running on port ${port}`);
});
