const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000 ;

const app = express();




// Middleware
app.use(cors())
app.use(express.json())


app.get('/' , (req, res) => {
    res.send('Welcome to Our Queen Toy Server')
})

app.get('/about' , (req, res) => {
    res.send('This is our About Route')
})



app.listen(port , () => {
    console.log(`Our Awesome Queen Toy is running On the PORT:${port}`);
})