const mongoose = require('mongoose');


const tourSchema =new  mongoose.Schema({
    name:{
        type:String,
        required:[true,`A tour must have the name`],
        unique:true,
        trim:true
    },
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

});

const Tour = mongoose.model('Tour',tourSchema);  //here Tour is like a class wih the use of schema

module.exports = Tour;