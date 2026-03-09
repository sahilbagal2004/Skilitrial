const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

  code:String,
  discount:Number,
  active:Boolean

});

module.exports = mongoose.model("Coupon", couponSchema);
router.post("/apply-coupon", async(req,res)=>{

const coupon = await Coupon.findOne({
 code:req.body.code,
 active:true
})

if(!coupon) return res.status(400).json({message:"Invalid Coupon"})

res.json(coupon)

})