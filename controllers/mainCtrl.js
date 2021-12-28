class MainCtrl {
  constructor(name, db) {
    this.name = name;
    this.db = db;
  }

  getMain (req, res) {
    console.log(`Running ${this.name} controller`);
    res.status(200).render('main');
    // return res.status(200).json({success: `This is my getMain function`});
  }
}

module.exports = MainCtrl;