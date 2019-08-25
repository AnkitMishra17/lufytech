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
     res.render('employee', {employee: " "});
});

app.get('/viewemployee', (req,res) =>{
     Employee.find({}, (err,data)=>{
         if (err) throw err;
         res.render('viewemployee',{employee : data});
      }); 
});

app.post('/', (req,res) =>{
    console.log(req.body);
    if (req.body._id != ''){
        updateRecord(req, res);
    }
    else{
        
    var employee = new Employee();
    employee.Name = req.body.Name;
    employee.Email = req.body.Email;
    employee.Phone = req.body.Phone;
    employee.Age = req.body.Age;
    employee.Address = req.body.Address;
        employee.save((err,data)=>{
            if (err) throw err;
            res.render('employee', {employee: " "});    
        })
    }
    });

    function updateRecord(req, res) {
        Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
            if (!err) { res.redirect('viewemployee'); }
            else {
                    res.render("employee", {
                        viewTitle: 'Update Employee',
                        employee: req.body
                    });
            }
        });
    }    

app.get('/delete/:id', (req,res) =>{
    Employee.findByIdAndRemove(req.params.id,(err,data)=>{
        if (err) throw err;
        res.redirect('/viewemployee');
    });
});

app.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, data) => {
        if (!err) {
            res.render("employee", {
                viewTitle: "Update Employee",
                employee: data
            });
        }
    });
});

const server = app.listen(port, (req, res) => {
    console.log(`Server started at port ${port}..`)
  });