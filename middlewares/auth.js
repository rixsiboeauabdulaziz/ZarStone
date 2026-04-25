import jwt from "jsonwebtoken"

let auth = (req, res, next) => {
    const header = req.headers.authorization
    if (!header) {
        return res.send("No token")
    }
    
    let tokin = header.split(" ")[1];
    try {

        let decode = jwt.verify(tokin, process.env.JWT_SECRET)
        console.log("decoded user:", decode)
        req.user = decode
        next()
    } catch (err) {
        console.log(err.message);
    }

}

export default auth