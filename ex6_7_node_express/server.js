const express = require('express');
const fs = require('fs');

const app = express();  
const port = 3000;

const FILE = "data.json";  

app.use(express.json());

// function readData() {
//     const data = fs.readFileSync(FILE, "utf8");
//     return JSON.parse(data);
// }
// function writeData(data) {
//     fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
// }

app.get('/data', (req, res) => {
    const data = fs.readFileSync(FILE, 'utf8');
    res.status(200).json(JSON.parse(data));
});

app.post('/update', (req, res) => {
    const { message } = req.body;
    const newData = { message: message };
    fs.writeFileSync(FILE, JSON.stringify(newData, null, 2));
    res.status(200).json({ message: 'The data has been updated' });
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});