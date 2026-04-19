import multer from "multer"
import paht from "path"


const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "upload/")
    },

    filename: (req, file, cd) => {

        const ext = paht.extname(file.originalname)


        cd(null, Date.now() + ext)
    }

})

const upload = multer({ storage })

export default upload