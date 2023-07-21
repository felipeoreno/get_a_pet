//image-upload.js
const multer = require('multer') //gerenciar imagens
const path = require('path') //gerenciar o caminho dos arquivos

//Aqui será definido onde os arquivos serão salvos
//O destino da imagens será definido aqui

const imageStorage = multer.diskStorage({ //diskStorage salva no armazenamento local
    destination: function(req, file, cb){
        let folder = '' //a pasta onde será salvo

        if(req.baseUrl.includes('users')){
            folder = 'users'
        } else if(req.baseUrl.includes('pets')){
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('Por favor, envie apenas png, jpg ou jpeg'))
        }
        cb(null, true)
    }
})

module.exports = imageUpload
