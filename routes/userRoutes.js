const express = require('express');
const userControllers = require('./../controllers/userController');
const router = express.Router();


router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

  
//   app.use('/api/v1/users',router);//its a mounting the router 

  module.exports=router;