const Express=require('express')
var bodyParser=require('body-parser')
var app=new Express()
var request=require('request')
const Mongoose=require('mongoose');
//  const viewall="http://localhost:3000/viewall"
 var viewall="https://dashboard.heroku.com/apps/recipie-fsd/viewall";

app.set('view engine','ejs')
app.use(Express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



///////

const   EmployeeModel=Mongoose.model("empdetails",{
    name:String,
    email:String,
    // des:String,
    text:String,
    phone:String
    
});
// Mongoose.connect("mongodb://localhost:27017/empdb");
 Mongoose.connect("mongodb+srv://sharmi1998:sharmi1998@cluster0-rwxfj.mongodb.net/test?retryWrites=true&w=majority")

app.get('/',(req,res)=>{
    res.render('home')
    
})
app.post('/read',(req,res)=>{

    //console.log('test')
    console.log(req.body)
    var employee=new EmployeeModel(req.body);
    var result=employee.save((error,data)=>{
        if(error){
            throw error;
         // res.send(error)
        }
        else{
            res.send(data)
            //res.send("<script>alert('added')</script><script> window.location.href='/' </script> ");
        }
    })

})
app.post('/delete',(req,res)=>
{
    EmployeeModel.remove({_id:req.body[0]._id},(error,response)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(response);
        }
    });
});
app.post('/update',(req,res)=>{

    console.log(req.body)
    EmployeeModel.findOneAndUpdate({_id:req.body._id},
    req.body,(error,response)=>{
        if(error){
            throw error;
        }
        else{
            res.send(response)
        }
    })
})


app.get('/viewall',(req,res)=>{

result=EmployeeModel.find((error,data)=>{
    if(error){
        throw error;
    }
    else{
        res.send(data);
    }
})

})
app.get('/view',(req,res)=>{
request(viewall,(error,response,body)=>{
    var data=JSON.parse(body);
    console.log(data)
    res.render('view',{'data':data})
})
    //res.render('view',)



})
// app.get('/del',(req,res)=>{
//     request(viewall,(error,response,body)=>{
//         var data=JSON.parse(body);
//         console.log(data)
//         res.render('delete',{'data':data})
//     })
// })
app.get('/readmore/:id',(req,res)=>{

    const x=req.params.id;
    // const read="http://localhost:3000/getAempApi/"+x;
    var read="https://dashboard.heroku.com/apps/recipie-fsd/getAempApi/" +x;

    request(read,(error,response,body)=>
{
   var data=JSON.parse(body);
   console.log(data);
   res.render('readmore',{data:data[0]});

})
    
});

app.get('/search/:phone',(req,res)=>{
    var ph=req.params.phone;
    //var phonenum=new EmployeeModel(req.body);
    EmployeeModel.find({phone:ph},(error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data)
        }
    })
})

app.get('/getAempApi/:id',(req,res)=>{
    var id=req.params.id;
    EmployeeModel.find({_id:id},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(data);
        }
    });
});

// app.get('/searchapi/ename',(req,res)=>{
//     var id=req.params.ename;
// })
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running")
})
