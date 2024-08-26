import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'book_notes',
    password: 'Ananthu@123!',
    port : 5432
});
db.connect();

app.get('/',(req,res)=>{
    res.render('index.ejs');
});

app.get('/add',(req,res)=>{
    res.render('add.ejs');
})

app.post('/add',async(req,res)=>{
    let title = req.body.title.split(' ').join('+');
    let shortNote = req.body.short_note;
    let rating = parseInt(req.body.rating);
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();
    month = String(month).padStart(2,'0');
    date = String(date).padStart(2,'0');
    let fullDate = `${year}-${month}-${date}`;
    try{
      const response = await axios.get(`https://openlibrary.org/search.json?q=${title}`);
      let coverKey = response.data.docs[0].cover_edition_key;
      let authorName = response.data.docs[0].author_name[0];
      let newTitle = response.data.docs[0].title;
      await db.query('INSERT INTO book_notes (title, short_note, title_date, rating, author_name, cover_key) VALUES ($1, $2, $3, $4, $5, $6)',
          [newTitle, shortNote, fullDate, rating, authorName, coverKey]);
      res.redirect('/'); 
    }catch(err){
      console.log(err);
      res.render('add.ejs',{error:'Sorry, no book found!'});
    }
});

app.patch('/edit',(req,res)=>{
  
});

app.delete('/delete',(req,res)=>{

});




app.listen(port,()=>{
    console.log(`Server is running on port ${port}.`);
});