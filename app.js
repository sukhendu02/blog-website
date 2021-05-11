const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const hbs = require('hbs');




// MULTER FOR IMAGE UPLOADS

var multer  = require('multer')
// var upload = multer({ dest: 'public/uploads' })
const storage = multer.diskStorage({
    destination : './public/uploads/',
    filename : function (req,file,cb){
        cb(null,file.fieldname+'-'+ Date.now()+
        path.extname(file.originalname));
    }
})
const uploads = multer({
    storage: storage
}).array('image');


// CONNECTION TO DATA-BASE OR MONGODB THROUGH MONGOOSE
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogwebsite",{useNewUrlParser:true, useUnifiedTopology:true})
 .then( () => console.log("successful"))
 .catch((err) => console.log(err));


//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())





// SCHEMA FOR CONTACT FORM
 const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    com: String,
    
  })

 const contact = mongoose.model('contact', contactSchema);

 // SCHEMA FOR ASKED QUESTION FORM
 const asknowSchema = new mongoose.Schema({
     name : String,
     question : String,
     select : String,
    
    
  })

 const asknow = mongoose.model('asknow', asknowSchema);

// FOR WRITTING BLOG


const blogSchema = new mongoose.Schema({
    title: String,
    Auther: String,
    Date : String,
    min: String,
    select : String,
    short_description : String,
    // image :  {Data: Buffer ,contentType:String},
    blog : String,

})
const blog = mongoose.model('blog', blogSchema);
module.exports = blog;

// // FOR LATEST BLOG (HOME-PAGE)
const latestblogSchema = new mongoose.Schema({
    title: String,
    Auther: String,
    Date : String,
    min: String,
    select : String,
    short_description : String,
    image :  {Data: Buffer ,contentType:String},
    blog : String,

})
const latestblog = mongoose.model('latestblog', latestblogSchema);
module.exports = latestblog;





//  FOR TEMPLETE ENGINE (HANDALBAR)
app.set("view engine","hbs");
app.set('views', __dirname + '/views');

   
// DYNAMIC DATA FROM DATA-BASE FOR BLOG

app.get('/', async (req, res) => {
    const latestblogs = await latestblog.find({})
     res.render('index.hbs', {
        latestblogs
    
         })
 });
 app.get('/latest/:id', async (req, res) => {
    const latestblogs = await latestblog.findById(req.params.id)
    res.render('fullblog.hbs', {
        latestblogs
    })
});


app.get('/blog', async (req, res) => {
   const blogs = await blog.find({})
    res.render('blog.hbs', {
       blogs
   
        })
});

// DYNAMIC DATA FOR FULL BLOG
app.get('/blog/:id', async (req, res) => {
    const blogs = await blog.findById(req.params.id)
    res.render('fullblog.hbs', {
        blogs
    })
});

       

// FOR DISPLAYING STATIC FILES
const staticPath = path.join(__dirname,"/public");
app.use(express.static(staticPath));



// FOR THE HTML DOCUMENTS OR STATIC FILES
// app.get('/',(req,res) => {
//     res.sendFile(path.resolve(__dirname,'../index.html'));
// });


app.get('/asknow',(req,res) => {
    res.sendFile(path.resolve(__dirname ,'./public/asknow.html'
        
    ));
});

app.get('/newblog',(req,res) => {
    res.sendFile(path.resolve(__dirname ,'./public/newblog.html'
    ));
});

app.get('/contact',(req,res) => {
    res.sendFile(path.resolve(__dirname ,'./public/contact.html'));
});

app.get('/about',(req,res) => {
    res.sendFile(path.resolve(__dirname ,'./public/about.html'));
});

 


// FOR CONTACT FORM (FILLED BY USESR )
app.post('/contact',(req,res) => {
    var myData = new contact(req.body);
myData.save().then(() => {
    
    res.sendFile(path.resolve(__dirname ,'./public/contact.html'));

        // res.status(200).json({status:"sucesss"});
        // res.send("success");
    }).catch(() =>{
        res.send("error")
    });


});

// QUESTION FORM
app.post('/asknow',(req,res) => {
    var myData = new asknow(req.body);
    myData.save().then(() =>{
        
        // res.sendStatus
        // res.send("save successfullly")
        res.sendFile(path.resolve(__dirname ,'./public/asknow.html'));

    }).catch(() =>{
        res.send("error")
        
    });


});

// WRITING BLOG

app.post('/newblog',(req,res) => {
    var myData = new blog(req.body);
    myData.save().then(() =>{
        // res.send('sucess')
        res.sendFile(path.resolve(__dirname ,'./public/newblog.html'
        ));
    }).catch(() =>{
        res.send("error")
    });


});



// LISTENING TO A PORT
app.listen(port, ()=>{
    console.log( `the app has started at ${port}` );
});
                        

                        //   THE - END