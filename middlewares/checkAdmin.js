function checkAdmin(req,res,next){
    if (req.user.role!=="ADMIN") {
        return res.status(400).send("Bu")
    }
    next()
}

export default checkAdmin