
const express = require('express');
const morgan = require('morgan');
const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');




const app = express();
console.log(process.env.NODE_ENV);
//1-->>> Middlewares
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev')); //give info about the request in terminal 
}


app.use(express.json());//its a middleware 
//serev static file 
app.use(express.static(`${__dirname}/public`));

//CREATE OUUR OWN MIDDLEWARE 
app.use((req,res,next)=>{
    console.log(`Hello from the middleware `);
    next();
});
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
   // console.log(`Hello from the middleware `);
    next();
});

// app.get('/',(request,response)=>{
//     // response.status(200).send(`hello from the server side`);
//     response
//      .status(200).json
//     ({message:`hello from the server side`,
// app:'Norotus' });
// });

// app.post('/',(req,res) => {
//   res.send('You can post thi send point ');
// }); 
//////////////////////////////////////////////////////////////////

/////////////////////////



////////////////////////
//3-->> all routs





////////////
app.use('/api/v1/users',userRouter);//its a mounting the router 
app.use('/api/v1/tours',tourRouter);//its a mounting the router 

module.exports=app; 

