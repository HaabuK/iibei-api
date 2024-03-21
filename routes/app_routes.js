const jobsController = require("../controllers/jobsController");
const professionsController = require("../controllers/professionsController");
const workersController = require("../controllers/workersController");
const clientsController = require("../controllers/clientsController");
const workersInProfessionController = require("../controllers/workersInProfessionController");
const ordersController = require("../controllers/ordersController");

module.exports = (app) => {
    app.route("/jobs")
        .get(jobsController.getAll)
        .post(jobsController.createNew)

    app.route("/jobs/:id")
        .get(jobsController.getById)
        .put(jobsController.updateById)
        .delete(jobsController.deleteById)

    app.route("/professions")
        .get(professionsController.getAll)
        .post(professionsController.createNew)

    app.route("/professions/:id")
        .get(professionsController.getById)
        .put(professionsController.updateById)
        .delete(professionsController.deleteById)

    app.route("/workersInProfession")
        .get(workersInProfessionController.getAll)
        .post(workersInProfessionController.createNew)

    app.route("/workersInProfession/:id")
        .get(workersInProfessionController.getById)
        .put(workersInProfessionController.updateById)
        .delete(workersInProfessionController.deleteById)

    app.route("/workers")
        .get(workersController.getAll)
        .post(workersController.createNew)
        

    app.route("/workers/:id")
        .get(workersController.getById)
        .put(workersController.updateById)
        .delete(workersController.deleteById)

    app.route("/clients")
        .get(clientsController.getAll)
        .post(clientsController.createNew)

    app.route("/clients/:id")
        .get(clientsController.getById)
        .put(clientsController.updateById)
        .delete(clientsController.deleteById)

    app.route("/orders")
        .get(ordersController.getAll)
        .post(ordersController.createNew)
    
    app.route("/orders/:id")
        .get(ordersController.getById)
        .put(ordersController.updateById)
        .delete(ordersController.deleteById)
        
        
}