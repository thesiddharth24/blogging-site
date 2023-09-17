
const fs=require('fs')
const mongoose = require('mongoose');
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'});
const Tour=require('./../../models/tourModel')


// console.log(app.get('env'))
// console.log(process.env)
//4>.. strater server
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false //this method is gonna return a promise
}).then(con =>{
     // console.log(con.connections);
    console.log(`DB Connection succesful`);
});

//Reading json file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

//import data into db
const importData = async ()=>{
    try{
        await Tour.create(tours);
        console.log(`Data sussesfully loaded`);
        
    }catch(err){
        console.log(err);
    }
    process.exit();
}

// Delete all data from collection
const deleteData = async()=>{
    try{
        await Tour.deleteMany(); //it will delete all of document in certain collection 
        console.log('Data deleted succesfully!');
        

    }catch(err){
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === `--import`){
    importData();
}else if (process.argv[2] === `--delete`){
    deleteData();
}

// console.log(process.argv);