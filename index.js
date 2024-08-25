import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
const db = pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'book_notes',
    password: 'Ananthu@123!',
    port : 5432
});
db.connect();

app.get('/',(req,res)=>{
});

app.post('/add',(req,res)=>{
});

app.patch('/edit',(req,res)=>{

});

app.delete('/delete',(req,res)=>{
});




app.listen(port,()=>{
    console.log(`Server is running on port ${port}.`);
});