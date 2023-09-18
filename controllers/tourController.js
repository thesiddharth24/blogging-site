const { throws } = require('assert');
const fs = require('fs');
const Tour=require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req,res,next) =>{
    req.query.limit='5';
    req.query.sort ='-ratingsAverage,price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    next()

} ;

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
    // console.log(typeof req.query);
    //it will return an object 
    //{127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy
    // {
    //     duration=5&difficulty=easy

    // }}*/
    // console.log(req.requestTime);
    //we have to sens all the data 
   try{
    
    
    
   
   
    
    
    
    
    //Execute the query

     const features = new APIFeatures(Tour.find(),req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();
    //  const X = await query;
    const X = await features.query;
     //query.sort().select().skip().limit() 
     //its called chaining 

    //send response 
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

exports.createTour = async (req,res) =>{
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
        // console.log(err);
         res.status(404).json({
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

exports.getTourStats = async (req,res) =>{
    try{
        const stats =await Tour.aggregate([
            {
                $match:{
                    ratingsAverage:{$gte:4.5}
                }
            },
            {
                $group:{
                    // _id:null, null means grp by all 
                    _id:{
                        $toUpper:'$difficulty'
                    },
                    numTours:{
                        $sum:1
                    },
                    numRatings:{
                        $sum: '$ratingsAverage'
                    },
                    avgRating: {
                        $avg:'$ratingsAverage'
                    },
                    avgPrice:{
                        $avg:'$price'
                    },
                    minPrice:{
                        $min:'$price'
                    },
                    maxPrice:{
                        $max: '$price'
                    }
                }
            },
            {
                $sort:{
                    avgPrice:1
                    //1 for assending 
                }
            },
            // {
            //     $match:{
            //         _id:{
            //             $ne: 'EASY'
            //         },
            //     }
            // }

        ]);

        res.status(200).json({
            status:"success",
            data:{
                stats
            }
        });
    }catch(err){
        res.status(404).json({
            staus:'fail',
            message:err
        })
    }
};


exports.getMonthlyPlan = async (req,res) =>{
    try{
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind:'$startDates' //we are jst destructuring 
            },
            {
                $match:{
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id:{
                        $month:'$startDates'
                    },
                    numTourStarts:{
                        $sum:1
                    },
                    tours:{
                        $push:'$name'
                    }
                }
            },
            {
                $addFields:{
                    month:'$_id'
                }
            },
            {
                $project:{
                    _id : 0
                    // 0 means it will not sows up and 1 means it will sows up 
                }
            },
            {
                $sort:{
                    numTourStarts:-1
                    //-1 for descending 
                }
            },
            {
                $limit:12
                //it will allow us to limit upto 6 output only 
            }
        ]);
        
        res.status(200).json({
            status:"success",
            data:{
                plan
            }
        });

    }catch(err){
        res.status(404).json({
            staus:'fail',
            message:err
        })
    }
}