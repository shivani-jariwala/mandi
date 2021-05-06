
const { MongoClient,ObjectId } = require('mongodb');
require('dotenv').config()


const DB_URI = process.env.URI;
const client = new MongoClient(DB_URI, { useUnifiedTopology: true,keepAlive:true });



const postReportHandler = async (req, res) => {
    const {
        userID,
        marketID,
        cmdtyID,
        marketName,
        marketType,
        cmdtyName,
        priceUnit,
        convFctr,
        price: xPrice
    } = req.body;

    await client.connect();
    
    const result = await client.db("mandi").collection("market").findOne({ marketID,cmdtyID });
    
    

    if (result) {
        try {
        const { _id, price } = result;
        const newPrice = ( price + ( xPrice/convFctr ) ) / 2;
        await client.db("mandi").collection("market").updateOne(
            { cmdtyName },
            {
                $set: { price: newPrice },
                $push: { users: userID }
            }
        );
        res.send({
            status: "success",
            reportID: _id
        });
        } catch(err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }
        
    } else {
    const newPrice = xPrice/convFctr;
    const obj = {
        cmdtyName,
        cmdtyID,
        marketID,
        marketName,
        users : [userID],
        timestamp: Date.now(),
        priceUnit: 'kg',
        price: newPrice
    };
    const { insertedId } = await client.db("mandi").collection("market").insertOne(obj);

    const resp = {
        status: 'success',
        reportID: insertedId
    }
    res.send(resp);
}
}

const getReportHandler = async (req, res) => {
    
    const reportID = req.query.reportID;
    await client.connect();
    try {
        const result = await client.db("mandi").collection("market").findOne({ _id: ObjectId(reportID) });
        res.send(result);
    } catch (error) {
        console.log(error);
    }


}


module.exports = {
    postReportHandler,
    getReportHandler
};
