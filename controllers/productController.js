const db = require('../models');


const Product = db.Product


const addProduct = async (req, res) => {

    let info = {
        pname: req.body.pname,
        price: req.body.price,
        description: req.body.description,
    }

    const product = await Product.create(info)
    res.status(200).send(product)
    console.log(product)

}

const getAllProducts = async (req, res) => {

    let products = await Product.findAll({})
    res.status(200).send(products)

}

const getlimitedProducts = async (req, res) => {
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

    let products = await Product.findAll({
        limit:size,
        offset:page * size
    })
    res.status(200).send(products)

}


const getOneProduct = async (req, res) => {
    console.log('id',req.params.id)
    let pid = req.params.id
    let product = await Product.findOne({ where: { pid: pid }})
    res.status(200).send(product)

}

const updateProduct = async (req, res) => {
    console.log("pid",req.params)
    let pid = req.params.id

    const product = await Product.update(req.body, { where: { pid: pid }})

    res.status(200).send(product)
   

}

// 5. delete product by id

const deleteProduct = async (req, res) => {

    let pid = req.params.id
    
    await Product.destroy({ where: { pid: pid }} )

    res.status(200).send('Product is deleted !')

}


module.exports = {
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    getlimitedProducts,
    
}