const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import Routes
const taskRoutes = require('./routes/tasks');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Initialize Data Files ---
const initFiles = () => {
    const files = ['tasks.json', 'cart.json', 'products.json'];
    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            const initialContent = file === 'products.json' ? '[]' : '[]';
            fs.writeFileSync(filePath, initialContent);
            console.log(`[Init] Created missing file: ${file}`);
        }
    });
};

const fs = require('fs');
initFiles();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Static Files for All Projects
app.use(express.static(path.join(__dirname, 'public')));

// --- Front-End Routes (SPA Style / Page Routing) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/task-manager', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'task-manager', 'index.html'));
});

app.get('/ecommerce', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ecommerce', 'index.html'));
});

app.get('/ai-chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-chatbot', 'index.html'));
});

// --- API Routes ---
app.use('/api/tasks', taskRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);

// --- Contact Form (Portfolio) ---
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`[Contact] ${name} (${email}): ${message}`);
    res.json({ success: true, message: 'Message received!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`- Portfolio: http://localhost:${PORT}`);
    console.log(`- Tasks App: http://localhost:${PORT}/task-manager`);
    console.log(`- E-commerce: http://localhost:${PORT}/ecommerce`);
    console.log(`- AI Chatbot: http://localhost:${PORT}/ai-chatbot`);
});
