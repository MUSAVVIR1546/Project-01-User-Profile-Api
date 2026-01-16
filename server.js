import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", router);


app.get('/', (req, res) => {
    res.send("Hello from Home Page!")
});

app.listen(PORT, () => {
    console.log("Server Started on", PORT);
})