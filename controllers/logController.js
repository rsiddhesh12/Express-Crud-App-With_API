const db = require('../models/index.js');


const LogTable = db.LogTable

const createLog = async (req, res) => {
    let info = {
        LogName: req.body.LogName,
    };
    console.log("info",info)
    const Log = await LogTable.create(info);
    res.status(200).send(Log);
    console.log(Log);

}


const getLog = async (req, res) => {

    let LogData = await LogTable.findAll({})
    res.status(200).send(LogData)

}


module.exports = {
    createLog,
    getLog
}