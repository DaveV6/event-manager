import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your React app
  credentials: true, // Allow cookies (if needed)
}));

// Mock data
const events = [
  {
    id: 1,
    name: 'Event 1',
    description: 'This is event 1',
    from: new Date('2023-10-01'),
    to: new Date('2023-10-02'),
  },
  {
    id: 2,
    name: 'Event 2',
    description: 'This is event 2',
    from: new Date('2023-10-03'),
    to: new Date('2023-10-04'),
  },
];

// API endpoint to fetch events
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
