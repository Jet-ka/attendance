import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyparser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import {student, record} from './module/info.js';
//import record from './module/record.js';
const app=express();

app.set('view engine','ejs');
 app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));

//datbase
//mongoose.connect('mongodb://127.0.0.1:27017/tuitiondb');
mongoose.connect(process.env.MONGODB_URL);
//signin
//login
//app.post('/', async function(req,res){
 //try{
//const name=
//const password=
//const result= await user.findOne({name:name});
//if(result){
   // if(result.password==password){
       // res.render('home.ejs',{infos:result});
   // }
//}
//}catch(err){
  //  console.log(err)
//}
//})
app.get('/',function(req,res){
    res.render('login.ejs')
});

app.post('/login', async function(req,res){
    try {
      const name=req.body.name ;
      const password=req.body.password;
      if(name==process.env.NAME && password==process.env.PASSWORD){
        const response = await student.find({});
        res.render('home.ejs',{infos:response});
      }
    } catch (error) {
      //  console.log(error)
      res.send("error")
    }
})


 
app.get('/create',function(req,res){
   // const id=req.params.id;
  res.render('create.ejs');
})

app.post('/post', async function(req,res){
try {
// const id=req.params.id;
 const {name, clas,phone,fees,daysmonth}=req.body;
 //same same name hole problem hoi ex: student=student
const students = new student({

name:name,
clas:clas,
phone:phone,
fees:fees,
daysmonth:daysmonth

});
const result =await students.save();
//console.log(result);
const response= await student.find({});
res.render('home.ejs',{infos:response});

} catch (error) {
 //console.error(error)  
 res.send('error') ;
}

});

// Handle attendance submission
app.post('/result', async (req, res) => {
    try {
        const { attendance, id } = req.body; // Get attendance and student ID
       // console.log('Attendance:', attendance);
       // console.log('Student ID:', id);

        const studentRecord = await student.findById(id);
        if (!studentRecord) {
            return res.status(404).send('Student not found');
        }

        // Update attendance count based on the submitted value
        if (attendance === 'present') {
            studentRecord.presentDays += 1;
        } else if (attendance === 'absent') {
            studentRecord.absentDays += 1;
        }

        // Save the updated student record
        const result = await studentRecord.save();
       const response = await student.find({});
        res.render('home.ejs',{infos:response});

      //  res.redirect('/home'); // Redirect to the desired page after saving
    } catch (error) {
        //console.error(error);
        res.status(500).send('Error updating attendance');
    }
});
//edit id tu lolu
app.get('/edit/:id',async function(req,res){
try {
    const id=req.params.id;
    const result= await student.findById(id);
   // console.log(result)
    if(result._id==id ){
        res.render('update.ejs', {infos:result});
      
    }else{
        return res.status(404).send('Student not found'); 
    }
} catch (error) {
  console.error(error)  
}

});

app.post('/update/:id', async function(req,res){
try {
   const id=req.params.id;
   const {name,clas,phone,fees,daysmonth, presentDays,absentDays}=req.body;
   const result =await student.findByIdAndUpdate({_id:id},{$set:{name:name,clas:clas,phone:phone,fees:fees,daysmonth:daysmonth, presentDays:presentDays,absentDays:absentDays}});
  const response = await student.find({});
   res.render('home.ejs',{infos:response});
 //res.redirect('/home');
   // res.render('home.ejs',{infos:result});
}catch(error) {
   // console.error(error)
    res.send('error')
}

});

app.get('/delete/:id',async (req,res)=>{
try {
  const id= req.params.id;
  const result= await student.findByIdAndDelete(id);
 const response = await student.find({});
 res.render('home.ejs',{infos:response});
// res.redirect('/home');
} catch (error) {
  //console.error(error)  
  res.send('error')
}    
});

//after every month student record store;
app.post('/record',async function(req,res){
    try{
    const {month,name,cls,attendance,fees,amount}=req.body;
   const records= new record({
    month:month,
    name:name,
    cls:cls,
    attendance:attendance,
    fees:fees,
    amount:amount
   });
   const result= await records.save();
   const response = await student.find({});
  res.render('home.ejs',{infos:response});
  // res.redirect('/home');


    }catch(err){
           res.status(500).send('Internal Server Error');
       // console.log(err);
    }
});

//find student by their name
app.post('/find', async function(req,res){
    try{
    const {name,cls}=req.body;
    const result= await record.find({
        name:name,
        cls:cls
    });
   // console.log(result);
    res.render('find.ejs',{infos:result});
    }catch(err){
       // console.log(err);
       res.send('error')
    }
});

//record.js update koribo hole jot month r data vohrua ase
app.get('/findup/:id', async function(req,res){
    try {
     const id=req.params.id;
     const one= await record.findById(id);
     if(one._id==id){
        res.render('findup.ejs',{info:one})
     } else{
        res.send('404')
     }
    } catch (error) {
      //  console.log(error)
      res.send('error')
    }
});
app.post('/submit/:id', async function(req,res){
    try {
        const id=req.params.id;
       const{attendance,fees}=req.body;
       const result= await record.findByIdAndUpdate({_id:id},{$set:{attendance:attendance,fees:fees}});
      // console.log(result);
    
      const response = await student.find({});
     res.render('home.ejs',{infos:response});
     //  res.redirect('/home');
    } catch (error) {                                            
       //console.log(error) 
       res.send('error')
    }
});

//app.get
app.get('/finddel/:id', async function(req,res){
    try {
       const id=req.params.id;
      
       const result= await record.findByIdAndDelete(id);
       const response = await student.find({});
       res.render('home.ejs',{infos:response});
      
   
       
    } catch (error) {
     // console.log(error)  
     res.send("error")
    }

});

//student login page
app.get('/student',async (req,res)=>{
    res.render('studentlogin.ejs')
})

app.post('/studentlogin', async function(req, res) {
    try{
const name=req.body.name;
const password=req.body.password;

const nam= await student.findOne({name:name})
if(name===nam.name && password==="JET20"){
    const result= await record.find({
                 name:name
  })

  const attend= await student.findOne({
                           name:name
                         })


   res.render('studentdetails.ejs', {
    infos: result,
    aten: attend
  });


  // i can use below one also

// if(name==="Bib" && password==="123"){
//     const result= await record.find({
//         name:"Bibhab"
//     })

// //if i use find() then value goes in array even if single document so in ejs we need use attend[0].name

// //     const attend= await student.find({
// //         name:"Bibhab"
// //     })
// //    console.log(attend)

// //give single document so no need use attend[0].name like
// const attend= await student.findOne({
//             name:"Bibhab"
//         })

//    res.render('studentdetails.ejs', {
//     infos: result,
//     aten: attend
//   });
// } else if(name==="Vow" && password==="123"){
//     const result= await record.find({
//         name:"Vowel"
//     })
//     const attend= await student.findOne({
//         name:"Vowel"
//     })
//    // console.log(result)
//     res.render('studentdetails.ejs',{infos:result,aten:attend})
 }else(
    res.render('error.ejs')
//    // res.send('invaild details')
 )




    }catch{
        res.render('error.ejs')
    }
});







let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}



app.listen(3000,function(){
    console.log('server is running bro')
})