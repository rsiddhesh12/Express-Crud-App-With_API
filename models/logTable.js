module.exports = (sequelize, DataTypes) => {

    const LogTable = sequelize.define("logtables", {
        lid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        LogName: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE, 
        },
    })

    return LogTable

}