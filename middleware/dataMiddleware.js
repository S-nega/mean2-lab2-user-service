module.exports = function(req, res, next) {
  
  const email = req.body.email;
  const password = req.body.password;

  console.log('dataMidleware: ' + email + password)
  if (!email || !password) {
    console.log('no data');
    return res.status(400).json({ message: 'no data' });
    // return;
  }
  else if(  
            email.length < 5 ||
            email[0] == '.' || 
            email[0] == '@' || 
            email.indexOf('@') == -1 || 
            email.indexOf('@') == email.length-1 || 
            email.indexOf('.') == email.length-1 || 
            email.indexOf('@') > email.lastIndexOf('.') || 
            email.indexOf('@')+1 == email.lastIndexOf('.')
        ){
    console.log('incorrect email');
    return res.status(400).json({ message: 'incorrect email' });
    // return;
  }
  
  else if(  
            password.length < 8 
            //||
            // !hasUppercase(password) || 
            // !/[a-z]/.test(password) ||
            // !/[^\w\s]/.test(password)
        ){
    console.log('incorrect password');
    return res.status(400).json({ message: 'incorrect password' });
    // return;
  }
    next();
};

