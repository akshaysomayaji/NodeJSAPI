const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const category = db.categoryDetail;
const subcategory = db.subcategoryDetail;

exports.categoryAdd = async function(req, res, next){
    var body = req.body;
    category.create(body).then(data => {
        return res.send({ categories: data, success: true, response_message: "Category Created Successfully." });
    }).catch(err => {
        res.status(500).send({ categories :[], success: false, response_message: err.message });
    });
}

exports.categoryUpdate = async function (req,res,next) {
    var body = req.body;
    category.update(body, { where: { categoryId: req.params.id } }).then(result => { 
      return res.send({ categories: result, success: true, msg: "Category Updated."});
    }).catch(err => {
      res.status(500).send({ categories: {}, success: false, msg: err.message });
    });
}

exports.getcategory = async function (req, res, next) {
    category.findAll().then(result =>{
        return res.send({ categories: result, success: true, msg: ""});
    }).catch(err => {
      res.status(500).send({ categories: [], success: false, msg: err.message });
    });
}

exports.getcategorybyId = async function (req, res, next) {
    category.findAll({where:{categoryId: req.params.id}}).then(result =>{
        return res.send({ categories: result, success: true, msg: ""});
    }).catch(err => {
      res.status(500).send({ categories: [], success: false, msg: err.message });
    });
}


exports.subcategoryAdd = async function(req, res, next){
    var body = req.body;
    subcategory.create(body).then(data => {
        return res.send({ categories: data, success: true, response_message: "Category Created Successfully." });
    }).catch(err => {
        res.status(500).send({ categories :[], success: false, response_message: err.message });
    });
}

exports.subcategoryUpdate = async function (req,res,next) {
    var body = req.body;
    subcategory.update(body, { where: { categoryId: req.params.id } }).then(result => { 
      return res.send({ categories: result, success: true, msg: "Category Updated."});
    }).catch(err => {
      res.status(500).send({ categories: {}, success: false, msg: err.message });
    });
}

exports.subgetcategory = async function (req, res, next) {
    subcategory.findAll({ where:{parentCategoryId : req.params.id}}).then(result =>{
        return res.send({ categories: result, success: true, msg: ""});
    }).catch(err => {
      res.status(500).send({ categories: [], success: false, msg: err.message });
    });
}