import User from "../models/User.js"

export const getUser =async(req,res,next)=>{
    try {
        const user = await User.find({_id:req.user._id})
        req.user= user[0].createdBy.toString() === '690063811d90a6653db27ac3' ? req.user._id :user[0].createdBy
        next() 
    } catch (error) {
        console.log(error)
    }
}