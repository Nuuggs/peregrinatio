require('dotenv').config();
const bcrypt = require('bcrypt');
const { PW_SALT_ROUNDS, JWT_SALT } = process.env;
const jwt = require('jsonwebtoken');
console.log(PW_SALT_ROUNDS, JWT_SALT);

class MainCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  getMain (req, res) {
    console.log(`GET Request: /main`);
    console.log(`Running ${this.name} controller`);
    res.status(200).sendFile('index.html');
    // return res.status(200).json({success: `This is my getMain function`});
  }

  async postRegister (req, res) {
    console.log(`POST Request: /main/register`);
    console.log(req.body);
    const { username, email, password } = req.body;
    if ( !username || !email || !password ) {
      return res.status(500).json({ msg: `registration error`});
    }
    const hash = await bcrypt.hash(password, Number(PW_SALT_ROUNDS));
    const newUser = await this.model.create({ username, email, password: hash });
    const payload = {id: newUser.id, email: newUser.email};
    const token = jwt.sign(payload, JWT_SALT, {expiresIn:'1h'});
    return res.status(200).json({newUser, token});
  }

  async postLogin (req, res) {
    console.log(`POST Request: /main/login`);
    console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) { return res.status(500).json({ msg: `login error` }) }
    const user = await this.model.findOne({where: {username}});
    if(!user){ return res.status(404).json({ msg: `user not found` })}
    const compare = await bcrypt.compare(password, user.password);
    if(compare){
      const payload = {id: user.id, username: user.username};
      const token = jwt.sign(payload, JWT_SALT, {expiresIn:'1h'});
      return res.status(200).json({success: true, token, id: user.id});
    }
    return res.status(401).json({ msg: `error: wrong password!` });
  }
 }

module.exports = MainCtrl;