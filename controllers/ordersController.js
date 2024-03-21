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

exports.getById = async (req, res) => {
    const orders = await Order.findByPk(req.params.id)
    res.send(orders)
}

exports.createNew = async (req, res) => {
    let order
    try {
      order = await Order.create(req.body)
    } catch (error) {
        if (error instanceof db.Sequelize.ValidationError) {
            console.log(error)
            res.status(400).send({"error":error.errors.map((item)=> item.message)})
        } else {
            console.log("OrderCreate: ", error)
            res.status(500).send({"error":"Something has gone wrong"})
        }
        return
    }
    res
    .status(201)
    .location(`${getBaseUrl(req)}/orders/${order.id}`)
    .json(order);
    console.log(order)
  }

  exports.updateById = async (req, res) => {
    let result;
    delete req.body.id;
    
    try {
      result = await Order.update(req.body, { where: { id: req.params.id } });
    } catch (error) {
      console.log("OrderUpdate: ", error);
      res.status(500).send({ error: "Something has gone wrong" });
      return;
    }
  
    if (result[0] === 0) {
      res.status(404).send({ error: "Order not found" });
      return;
    }
  
    try {
      const order = await Order.findByPk(req.params.id);
      res
        .status(200)
        .location(`${getBaseUrl(req)}/orders/${order.id}`)
        .json(order);
    } catch (error) {
      console.log("OrderFindByPk: ", error);
      res.status(500).send({ error: "Something has gone wrong" });
    }
  };

  