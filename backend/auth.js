import jwt from 'jsonwebtoken'
import { User } from './schema.js';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

const auth = async(req, res, next) => {
const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith('Bearer')){
   return res.status(401).json({success:false,message:"Not authorized token missing"})
}
const token = authHeader.split(' ')[1]
try {
    const payload = jwt.verify(token,JWT_SECRET)
    const user =await User.findById(payload.id).select('-password')
    if(!user){
        return res.status(401).json({success:false,message:'User not found'})
    }
    req.user = user;
    next()
} catch (error) {
    return res.status(401).json({success:false,message:"Token invalid or expired"})
}
};

export default auth;
