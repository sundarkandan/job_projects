const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_123";


app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { error: "Too many requests from this IP. Please try again later." }
});
app.use('/api/', limiter);

const USERS_MOCK = [
    { id: 1, name: "Anand", email: "anand@mail.com", role: "Admin", passwordHash: "xyz123" },
    { id: 2, name: "Kumar", email: "kumar@mail.com", role: "User", passwordHash: "abc456" }
];


const loginSchema = z.object({
    email: z.string().trim().email("Please provide a valid email address"),
    password: z.string().min(6, "Password length must be at least 6 characters")
});

app.post('/api/login', (req, res) => {
    try {
        const payload = loginSchema.parse(req.body);
        
        const user = USERS_MOCK.find(u => u.email === payload.email);
        if (!user || user.passwordHash !== payload.password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        return res.json({ 
            token, 
            user: { name: user.name, role: user.role } 
        });

    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors[0].message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});


function checkRole(...allowedRoles) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access denied. Authentication token missing." });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Session expired or invalid token." });
            }
            
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ error: "Access forbidden. Insufficient permissions." });
            }
            
            req.user = decoded;
            next();
        });
    };
}


app.get('/api/admin/dashboard', checkRole('Admin'), (req, res) => {
    try {

        const sanitizedUsers = USERS_MOCK.map(({ passwordHash, ...safeFields }) => safeFields);
        
        return res.json({
            message: "Admin metrics fetched successfully",
            users: sanitizedUsers
        });
    } catch (err) {
        return res.status(500).json({ error: "Failed to retrieve dashboard metrics" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server securely bound to port ${PORT}`));