const mongoose = require('mongoose');
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'});
const app = require('./app')


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

const tourSchema =new  mongoose.Schema({
    name:{
        type:String,
        required:[true,`A tour must have the name`],
        unique:true
    },
    rating:{
        type:Number,
        default:4.5
    },
    price:{
        type:Number,
        required:[true,`A tour must have the price`]
    }
});

const Tour = mongoose.model('Tour',tourSchema);  //here Tour is like a class wih the use of schema


const testTour = new Tour({    //testtour is the instance of tour model
    name:"The Park campor",
    price:997
    
});

testTour.save().then(doc=>{
    console.log(doc);
}).catch(err=>{
    console.log('ERROR:  ',err);
});//this save the doucumt to the db nd it will return promise then we can consume that promise 



const port =process.env.PORT || 3000;
app.listen(port ,()=>{
    console.log(`App running on port ${port}`);
});