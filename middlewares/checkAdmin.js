// checkAdmin.js
const checkAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json("Токен не передан или недействителен")
    }
    if (req.user.role !== "ADMIN") { // ← было "admin", должно быть "ADMIN"
      return res.status(403).json("Нет доступа")
    }
    next()
  }
  
  export default checkAdmin