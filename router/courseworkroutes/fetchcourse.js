const router=require('express').Router();
const {coursecreator}=require('../../controllers/coursecontroller');

router.post('/',coursecreator);


module.exports=router;