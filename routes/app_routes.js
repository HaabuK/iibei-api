const jobsController = require("../controllers/jobsController");
const professionsController = require("../controllers/professionsController");

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
}