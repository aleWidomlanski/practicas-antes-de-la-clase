const { json } = require('express');
const fs = require('fs');
const path = require('path')
const bcrypt = require('bcryptjs')

const filepath = path.join(__dirname, '..', 'data', 'users.json')

var {check, validationResult, body} = require('express-validator')

let user = fs.readFileSync(filepath, {encoding: 'utf-8'})

user = JSON.parse(user);



let usersControllers = {
  rootLogin: function (req, res, next) {
    res.render('login');
  },
  rootRegister: function (req, res, next) {
    res.render('register');
  },
  behindLogin: function (req, res, next) {
 
    let errors = validationResult(req)
    
    let usuarioLogueadoConExito;

    if(errors.isEmpty()) {
      user.forEach(element => {
        if(element.email == req.body.email) {
          if(bcrypt.compareSync(req.body.password, element.password)) {
             usuarioLogueadoConExito = element;
           }
        }
       });


       req.session.usuarioLogueado = usuarioLogueadoConExito;
     
             console.log(req.session.usuarioLogueado)
             

       if (usuarioLogueadoConExito == undefined) {
        res.render('login', {errors: [{msg:'Credenciales Invalidas'}]})
      }

 
     

      
    

       if (req.body.check != undefined) {
        res.cookie("recordame", usuarioLogueadoConExito.email, {maxAge: 60000})
       }

       res.send('Succes')

    
    }

    else {
      res.render("login", {errors: errors.array()})
    }

  },



  behindRegister: function (req, res, next) {

    let errors = validationResult(req)


    if(errors.isEmpty()) {
      let usuario = {
        nombre: req.body.name,
        apellido: req.body.lastName,
        email: req.body.email,
        edad: req.body.age,
        password: bcrypt.hashSync(req.body.password, 10),
        image: req.files[0].filename
  } 
      
      user.push(usuario);
  
      console.log(user)
  
      user = JSON.stringify(user);
  
      fs.writeFileSync(filepath, user)

      res.redirect('/users/login')
    }

    else {
      res.render("register", {errors: errors.array()})
    }




  }
}

module.exports = usersControllers;