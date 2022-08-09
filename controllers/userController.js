const db = require('../models');


const User = db.User


const addUser = async (req, res) => {

    let info = {
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        Password: req.body.Password
    }

    const user = await User.create(info)
    res.status(200).send(user)
    console.log(user)

}

const getAllUsers = async (req, res) => {
    console.log("req",req.params);
    let user = await User.findAll({})
    res.status(200).send(user)

}

const getlimitedUsers = async (req, res) => {
    const pageAsNumber = Number.parseInt(req.params.offset);
    const sizeAsNumber = Number.parseInt(req.params.limit);

    let page = 0 ;
    if(!Number.isNaN(pageAsNumber && sizeAsNumber > 0)){
        page = pageAsNumber;
    }

    let size = 5;
    if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber< 10){
        size =sizeAsNumber;
    }
    console.log("limit",size,"offset",page*size)
    console.log("req============>",req.params.limit,req.params.offset);
    let user = await User.findAll({
        limit:size,
        offset:page * size})
    res.status(200).send(user)

}


const getOneUser = async (req, res) => {

    let id = req.params.id
    let user = await User.findOne({ where: { id: id }})
    res.status(200).send(user)

}

const updateUser = async (req, res) => {

    let id = req.params.id

    const user = await User.update(req.body, { where: { id: id }})

    res.status(200).send(user)
   

}

// 5. delete product by id

const deleteUser = async (req, res) => {

    let id = req.params.id
    
    await User.destroy({ where: { id: id }} )

    res.status(200).send('User is deleted !')

}


module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
    getlimitedUsers
    
}