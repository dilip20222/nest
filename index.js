const express = require('express')
const event = require('events')
const db = require('./db');
const app = express();

db();
app.use(express.json())

const cors = require("cors");

app.get("/" , (req , res) => {
    res.send("Hello , Get the data")
})

app.use("/api" , require("./allinvite"))

const customEvent = new event.EventEmitter();

customEvent.on('start' , () => {
    console.log("Working Event Emittter------")
})

customEvent.emit('start')

app.listen(5000 , () => {
    console.log("Server running on 5000");  
});

