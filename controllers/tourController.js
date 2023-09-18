const { throws } = require('assert');
const fs = require('fs');
const Tour=require('./../models/tourModel');

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

class APIFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    //req.query=queryStr

    filter(){
    /////////////////////////////////////
    //  const X = await Tour.find()
    //  .where('duration')
    //  .equals(5)
    //  .where('difficulty')
    //  .equals('easy');
     ///////////////////////////////////
    //  const X = await Tour.find({
    //     duration:5,
    //     difficulty:'easy'
    // });
    //////////////////////////////////
    //built a query
    //Filtering 
    const queryObj = {...this.queryStr};
    const excludedFields =['page','sort','limit','fields'];
    
    

    excludedFields.forEach(el=>delete queryObj[el]);
    // console.log(req.query,queryObj);
    // {
    //     { duration: '5', difficulty: 'easy', sort: '1' } { duration: '5', difficulty: 'easy' }
    // }
    ////////////////////////////
    //2>Advance filtering 
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match =>`$${match}`);
    // console.log(JSON.parse(queryStr));
    // //{ duration: '5', difficulty: {gte:'easy'} }{
    //     127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy&sort=1
    // }
    //yeahi mila hai req.query me 
    //{ duration: { gte: '5' }, difficulty: 'easy', sort: '1' }
    // const query = Tour.find(queryObj);
      this.query.find(JSON.parse(queryStr));
    //let query = Tour.find(JSON.parse(queryStr));
     //console.log(req.query);
    ////////////////////////////////
    return this;
    }

    sort(){
        if(this.queryStr.sort){
            //sort the result
            const sortBy = req.query.sort.split(',').join(' ');
            // console.log(sortBy)
            this.query= this.query.sort(sortBy);
           //query= query.sort(req.query.sort);
           //sort('price ratingsAverage')
           //127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy&sort=price,ratingsAverage
           //replce , with space 
        }else{
            this.query= this.query.sort('-createdAt');
        }
        return this;
    }
}

exports.getAllTours=async (req,res)=>{
    /*// console.log(req.query);{127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy
    // {
    //     duration=5&difficulty=easy

    // }}*/
    // console.log(req.requestTime);
    //we have to sens all the data 
   try{
    
    
    
   //3> field limiting 
   if(req.query.fields){
       const fields = req.query.fields.split(',').join(' ');
       //    query=query.select('name duration price');
       //selecting certain fields name is called projecting
       query=query.select(fields);
       //-name means we are excluding the field 

   }else{
       query=query.select('-__v');
   }
   //NOTE-> here in this either we take all +ve or all -ve fields 
   //ya toh ham include ka fxn laga skte ya exclude ka fxn laga skte 
   ///////////////////////////////////////////
   /////////////////
   //4-> pagenation 
   //* 1 convert string into int 
   const page = req.query.page * 1 || 1; //we use || for default value
   const limit = req.query.limit * 1 || 100;
   const skip = (page - 1) * limit;
   //page=2&limit10 , 1-10 -> page 1 ,11-20 -> page 2, 21-30 ->page 3
   //if we demand page 3 then we have to skip 20 result so query will be -! 
   //query = query.skip(20).limit(10);
   //    query = query.skip(10).limit(10);
    

   query = query.skip(skip).limit(limit);
   
   if(req.query.page){
       const numTours = await Tour.countDocuments();
       if(skip >= numTours ){
           throw new Error('This page does not exit');
           //here we find an error in code look into this 
       }
   }
    
    
    
    
    //Execute the query

     const features = new APIFeatures(Tour.find(),req.query).filter().sort();
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