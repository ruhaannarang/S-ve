var jwt = require("jsonwebtoken");
const fetchuser = (req, res, next) => {
    //getting the user from the jwt token and adding id to req object
    const token=req.header("auth-token");
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
    const data=jwt.verify(token,process.env.JWT_SECRET);
    req.user=data.user;
    next();
}
module.exports=fetchuser;