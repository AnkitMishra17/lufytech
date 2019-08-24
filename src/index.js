const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const viewsPath = path.join(__dirname, "/views");

//Database
const mongoURI = "mongodb://test:test123@ds019806.mlab.com:019806/lufytech";

mongoose.connect(mongoURI, {useNewUrlParser: true },()=>{
    console.log("Connected to database successful.");
});

let employeeschema = new mongoose.Schema({
    Name: String,
    Email: String,
    Phone: Number,
    Age: Number,
    Address: String
  });
  
let Employee = mongoose.model('Employee', employeeschema);

app.set('view engine', 'ejs')
app.set("views", viewsPath)

app.use('/public',express.static(path.join(__dirname, "../public")));

app.get('/', (req,res) =>{
     res.render('employee');
});

app.get('/viewemployee', (req,res) =>{
     Employee.find({}, (err,data)=>{
         if (err) throw err;
         res.render('viewemployee',{employee : data});
      }); 
});

app.post('/', (req,res) =>{
    let newemployee = Employee(req.body).save((err,data)=>{
        if (err) throw err;
        res.render('employee');
    })
});

app.get('/delete/:id', (req,res) =>{
    Employee.findByIdAndRemove(req.params.id,(err,data)=>{
        if (err) throw err;
        res.redirect('/viewemployee');
    });
});

app.get('/delete/:id', (req,res) =>{
    Employee.findByIdAndRemove(req.params.id,(err,data)=>{
        if (err) throw err;
        res.redirect('/viewemployee');
    });
});

const server = app.listen(port, (req, res) => {
    console.log(`Server started at port ${port}..`)
  });