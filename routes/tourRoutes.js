const express = require('express');
const tourcontrollers = require('./../controllers/tourController');
///////////////////
const router = express.Router();//its  a middleware

// router.param('id',(req,res,next,val) => {
//     console.log(`Tour is is ${val}`);
//     next();
// })

////////////////////////////
router.param('id',tourcontrollers.checkID);

//creatye check body 
// check if a body contains the name and price property 
//if not , then send back 400 (bad request )
//add it to the post handler stack
router
.route('/')
.get(tourcontrollers.getAllTours)
.post(tourcontrollers.checkBody, tourcontrollers.createTour);
//router.get('/api/v1/tours',getAllTours);//to get all the tours   ---->> choose alternative method given below 
router.get('/:id',tourcontrollers.getTour); //get a perticular tour 


//now post request 
//router.post('/api/v1/tours',createTour);//create perticular tour 

router.patch('/:id',tourcontrollers.upadteTour);

router.delete('/:id',tourcontrollers.deleteTour);


module.exports = router;