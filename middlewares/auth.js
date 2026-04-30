import jwt from "jsonwebtoken"

let auth = (req, res, next) => {
    const header = req.headers.authorization
    if (!header) {
        return res.status(401).json({ message: "No token" })
    }
    
    let token = header.split(" ")[1];
    try {
        let decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" }) // ✅ добавь return
    }
}

export default auth