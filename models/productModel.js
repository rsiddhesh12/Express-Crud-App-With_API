module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("products", {
        pid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        pname: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE, 
        },
    })

    return Product

}