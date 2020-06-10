const controller = require('./controller/controllers');
const passport = require('passport')
const passportService = require('./service/passport')
const {requireSignin, isAuthorAdmin, fetchWorkforUser} = require('./controller/controllers');
// const requireSignin = passport.authenticate('local', { session: false })

module.exports = function(app) {

    //----------------- User -------------------//

    app.post('/login', controller.signin)
    app.post('/register', controller.register)
    app.post('/regisIndex', requireSignin, controller.regisIndex)
    app.post('/fetchPartner', requireSignin, controller.fetchAdmin)
    app.post('/checkStatus', isAuthorAdmin)
    app.post('/signout', controller.signout)
    app.post('/fetchworkByIdForUser', requireSignin, controller.fetchWorkforUser)
    app.post('/editIndex',  controller.updateIndex)
    app.post('/fetchIdWork', controller.fetchByIdWork)
    app.post('/deleteWork', controller.deleteWork)

    //----------------- Admin -------------------//

    app.post('/fetchAllForAdmin', requireSignin, controller.fetchAllforAdmin)
    app.post('/fetchAllforAdminWorksheet', requireSignin , controller.fetchAllforAdminWorksheet)
    app.post('/fetchUserForAdmin', requireSignin, controller.fetchUserForAdmin)
    app.post('/fetchByIdForAdmin', requireSignin, controller.fetchByIdForAdmin)
    app.post('/DailyWork', requireSignin, controller.DailyWork)
    // app.post('/WorkByName', controller.DailyWork)
    app.post('/AdmminOptions', requireSignin, controller.WorkByOptions) 
    // app.post('/fetchAuth', controller.DailyWork)
    app.post('/Division', requireSignin, controller.fetchDivision)
} 