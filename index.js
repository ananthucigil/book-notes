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

function dateFinder (insertedDate){
    let year = new Date(insertedDate).getFullYear();
    let month = new Date(insertedDate).getMonth() + 1;
    let date = new Date(insertedDate).getDate();
    month = String(month).padStart(2,'0');
    date = String(date).padStart(2,'0');
    return `${year}-${month}-${date}`;
}

function dateYesterday (){
    let d = new Date();
    d.setDate(new Date().getDate() - 1);
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let date = d.getDate();
    month = String(month).padStart(2,'0');
    date = String(date).padStart(2,'0');
    return `${year}-${month}-${date}`;
}
app.get('/',async(req,res)=>{
    const data = await db.query('SELECT * FROM books');
    let dateToday = dateFinder(new Date());
    let yesterday = dateYesterday();
    console.log(data.rows);
    res.render('index.ejs',{data: data.rows, today: dateToday, yesterday: yesterday});
});

app.get('/add',(req,res)=>{
    res.render('add.ejs');
});

app.get('/sort/date',(req, res)=>{

})

app.get('sort/rating',(req,res)=>{

})

app.post('/add',async(req,res)=>{
    let title = req.body.title.split(' ').join('+');
    let shortNote = req.body.short_note;
    let rating = parseInt(req.body.rating);
    let fullDate = dateFinder(new Date());
    try{
      const response = await axios.get(`https://openlibrary.org/search.json?q=${title}`);
      let coverKey = response.data.docs[0].cover_edition_key;
      let authorName = response.data.docs[0].author_name[0];
      let newTitle = response.data.docs[0].title;
      await db.query('INSERT INTO books (title, short_note, title_date, rating, author_name, cover_key) VALUES ($1, $2, $3, $4, $5, $6)',
          [newTitle, shortNote, fullDate, rating, authorName, coverKey]);
      res.redirect('/'); 
    }catch(err){
      console.log(err);
      res.render('add.ejs',{error:'Sorry, no book found!'});
    }
});

app.get('/edit/:id',async(req,res)=>{
    const id = parseInt(req.params.id);
    const data = await db.query('SELECT * FROM books WHERE id = $1',[id])
    res.render('edit.ejs',{data: data.rows});
})

app.post('/edit',async(req,res)=>{
  const id = parseInt(req.body.editId);
  let rating = parseInt(req.body.rating);
  await db.query('UPDATE books SET short_note = $1, rating = $2 WHERE id = $3',[req.body.short_note, rating, id]);
  res.redirect('/');
});

app.post('/delete',async(req,res)=>{
 const id = parseInt(req.body.deleteId);
 await db.query('DELETE FROM books WHERE id = $1',[id]);
 res.redirect('/');
});




app.listen(port,()=>{
    console.log(`Server is running on port ${port}.`);
});