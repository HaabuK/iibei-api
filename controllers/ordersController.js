const {db} = require('../db')
const Order = db.orders

//xh POST http://localhost:7070/orders workerId=5 professionId=5
//xh get http://localhost:7070/orders
//xh put http://localhost:7070/orders/6 professionId=5
//xh delete http://localhost:7070/orders/5

exports.getAll = async (req,res) => {
    const orders = await Order.findAll({attributes:["id", "workerId", "clientId", "duration", "status", "info"]})
    res.send(orders)
}

  