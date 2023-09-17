const fs = require('fs');
const Tour=require('./../models/tourModel')

//const X = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));//converting to the array of js object 
//routers
// exports.checkID = (req,res,next,val)=>{
//     console.log(`Tour is is ${val}`);
//     if(req.params.id*1 > X.length){
//         return res.status(404).json({
//             staus:"fail",
//             message:"Invalid id"
//         })
//     }
//     next();
// };

// exports.checkBody = (req,res,next) =>{
//   if(!req.body.name || !req.body.price){
//       return res.status(400).json({
//           status:'fail',
//           messgae:'Missing name or peice'
//       })
//   }
//   next();
// };

//2.>> rout handlers
exports.getAllTours=async (req,res)=>{
    // console.log(req.requestTime);
    //we have to sens all the data 
   try{
    const X = await Tour.find();
    res.status(200).json({
        status:'success',
        requestedat: req.requestTime,
        results:X.length,
        data:{
            tours:X
        }
    });
   }catch(err){
    res.status(404).json({
        staus:'fail',
        message:err
    })
   }
   
};
    
exports.getTour =  async (req,res)=>{
//     console.log(req.params);
//    const id = req.params.id * 1;//coverting it into int 
 
 
//    const tour = X.find(el => el.id  === id);
//     //we have to sens all the data 
//     res.status(200).json({
//         status:'success',
//         data:{
//             tour
//         }
//     });
try{
    const tour =  await Tour.findById(req.params.id);
    //Tour.findOne({_id:req.params.id})


    res.status(200).json({
        status:'success',
        requestedat: req.requestTime,
        results:tour.length,
        data:{
            tours:tour
        }
    })
}catch(err){
    res.status(404).json({
        staus:'fail',
        message:err
    })
}
};

exports.createTour = async (req,res)=>{
    //    console.log(req.body);
    //    const newId = X[X.length -1].id +1;
    //    const newTour = Object.assign({id:newId},req.body);//converting to json file
    
    //    X.push(newTour);
    
    //    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(X),err =>{
    //          res.status(201).json({
    //              staus:"success",
    //              data:{
    //                  tour:newTour
    //              }
    //          });
    //    });
    ////////////////////////////

     //Tour.create({}).then()
     try{
        const newTour= await Tour.create(req.body);
        res.status(201).json({
            staus:"success",
            data:{
                tour:newTour
            }
        });
     }catch(err){
         res.status(400).json({
             staus:'fail',
             message:err
         })
     }
     
    
};
exports.upadteTour = async (req,res)=>{
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
       
        res.status(200).json({
            status:"success",
            data:{
                tour:tour
            }
        })

    }catch(err){
        res.status(400).json({
            staus:'fail',
            message:err
        })
    }
    
    
};

exports.deleteTour = async (req,res)=>{
        
    try{
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({  //204->no content 
        status:"success",
        data:null
    })
    }catch(err){
        res.status(404).json({
            staus:'fail',
            message:err
        })
    }
};