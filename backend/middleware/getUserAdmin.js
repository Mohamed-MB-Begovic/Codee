import User from "../models/User.js"

export const getUser =async(req,res,next)=>{
    try {
        const user = await User.find({_id:req.user._id})
        req.user=user[0].createdBy
        next()
    } catch (error) {
        console.log(error)
    }
}