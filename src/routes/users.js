var express = require('express');
var router = express.Router();
var usersControllers = require('../controllers/usersControllers')
const multer = require('multer')
const path = require('path');

var {check, validationResult, body} = require('express-validator')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
 
      cb(null, path.join(__dirname, '..', 'tmp'))
    },
    filename: function (req, file, cb) {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })

 

var upload = multer({ storage: storage })

/* GET users listing. */
router.get('/login', usersControllers.rootLogin);
router.get('/register', usersControllers.rootRegister);
router.post('/login', [
  check('email').isEmail().withMessage("El campo debe ser un email"),
  check('password').isAlphanumeric().withMessage("El campo debe ser alfanúmerico")
] ,usersControllers.behindLogin);




router.get('/check', function (req,res) {
  if(req.session.usuarioLogueado == undefined) {
    console.log(req.session.usuarioLogueado)
    res.send('No estas logueado')
  } 
  else {
    
    res.send('El usuario logueado es ' + req.session.usuarioLogueado.email)
  }
})



router.post('/register', upload.any(), [
  check('name').isLength({min:4}).withMessage('El nombre debe contener 4 letras minimamente'),
  check('lastName').isLength({min:4}).withMessage('El apellido debe contener 4 letras minimamente'),
  check('email').isEmail().withMessage('El campo debe ser un email'),
  check('age').isInt().withMessage('El campo debe ser un número'),
  // check('password').withMessage('El campo debe ser una contraseña')
], usersControllers.behindRegister);


router.get('/pruebasession',function(req,res) {
  if (req.session.visitas == undefined) {
    req.session.visitas = 0;
  }

  req.session.visitas++

  res.send('Session ' + req.session.visitas)

})

router.get('/mostrarsession',function(req,res) {
  
  res.send('Session ' + req.session.visitas)

})




module.exports = router;


