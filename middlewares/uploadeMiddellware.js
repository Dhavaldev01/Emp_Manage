
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        if(!fs.existsSync('public/img')){
            fs.mkdirSync('public/img');
        }
        cb(null , 'public/img')
    },
    filename : (req , file , cb) => {
        const filename = Date.now() + Math.floor(Math.random()*100) + file.originalname.replace(/ /g,"");
        cb(null , filename)
    }
});

const upload = multer({storage});

module.exports = upload;