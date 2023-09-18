const mongoose = require('mongoose');
const slugify= require('slugify');


const tourSchema =new  mongoose.Schema({
    name:{
        type:String,
        required:[true,`A tour must have the name`],
        unique:true,
        trim:true
    },
    slug:String,
    duration:{
        type:Number,
        required:[true,`A tour must have the duration`]
    },
    maxGroupSize:{
        type:Number,
        required:[true,`A tour must have the group size`]
    },
    difficulty:{
        type:String,
        required:[true,`A tour must have a difficulty`]
    },
    ratingsAverage:{
        type:Number,
        default:4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,`A tour must have the price`]
    },
    priceDiscount:{
        type:Number
    },
    summary:{
        type:String, 
        trim:true,
        required:[true,`A tour must have the description`]
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,`A tour must have the cover image`]
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false //this will hide this column from the client 
    },
    startDates:[Date]

},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
});


//virtual properties
//it does not take space in the memory 
//we cant apply query on the virtual property because it is not present in the database 

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7 ;
    //this here pointing to the current document
});

//Documrnt middleware RUNS BEFORE .SAVE() AND BEFORE  .CREATE()

tourSchema.pre('save',function(next){
    //console.log(this);
    this.slug = slugify(this.name,{ lower:true });
    next();
});
//here this points to the current document which we have currently saved 

// tourSchema.pre('save',function(next){
//     //console.log(this);
//     console.log(`we will save the document`);
//     next();
// });
// //here save is the hook
// tourSchema.post('save',function(doc,next){
//     console.log(doc)
//     next();
// })

const Tour = mongoose.model('Tour',tourSchema);  //here Tour is like a class wih the use of schema

module.exports = Tour;