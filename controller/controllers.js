const jwt = require('jsonwebtoken')
const config = require('./../confix')
const expressJwt = require('express-jwt');


exports.signin = (req, res, next) => {
    var {
        body
    } = req;

    var email = body.email;
    var password = body.password;

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT*FROM `sila-lawer`.`user-sila` WHERE email=? ;"
        connection.query(sql, [email], (err, results) => {
            if (err) {
                return next(err)
            }

            if (!results.length) {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "ไม่พบบัญชีผู้ใช้"
                })
            }
            if (results[0].password !== password) {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "รหัสผ่านไม่ถูกต้อง"
                })
            } else {
                const token = jwt.sign({
                    id: results.id
                }, config.secret)
                res.cookie('t', token, {
                    expire: new Date() + 9999
                })
                res.json({
                    success: "success",
                    message: results,
                    message_th: "login success",
                    token: token
                })
            }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({
        success: "success",
        message: "Signout Success"
    });
}

exports.requireSignin = expressJwt({
    secret: config.secret,
    userProperty: "auth"
});

exports.fetchAdmin = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT*FROM `sila-lawer`.`user-sila` WHERE status = 1"
        connection.query(sql, [], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: ""
                })
            }
        })
    })
}

exports.isAuthorAdmin = (req, res, next) => {

    var {
        body
    } = req
    var email = body.email

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT `user-sila`.status FROM `sila-lawer`.`user-sila` \
        WHERE `user-sila`.email = ? ;"

        connection.query(sql, [email], (err, results) => {
            if (err) {
                return next(err)
            }

            if (results[0].status == 1) {
                res.json({
                    success: "success",
                    message: "Admin",
                    message_th: "Admin"
                })
            } else if (results[0].status == 0) {
                res.json({
                    success: "success",
                    message: "Auth",
                    message_th: "Auth"
                })
            } else {
                res.json({
                    success: "error",
                    message: "error",
                    message_th: "error"
                })
            }
        })
    })
}

exports.regisIndex = (req, res, next) => {

    var {
        body
    } = req;

    var idUser = body.idUser;
    var date = body.date;
    var time = body.time;
    var clientName = body.clientName;
    var partner = body.partner;
    var matterCode = body.matterCode;
    var descriptions = body.descriptions;
    var status = body.status
    let today = new Date();
    console.log(today)

    req.getConnection((err, connection) => {
        if (err) return next(err)

        if (date.length > 0) {
            if (time.length > 0) {
                if (clientName.length > 0) {
                    if (partner.length > 0) {
                        if (status.length > 0) {
                            if (descriptions.length > 0) {
                                var sql = "INSERT INTO `sila-lawer`.`work` \
                                ( idUser, date, time, clientName, partner, matterCode, descriptions, status, timestamp ) VALUES \
                                (?, ?, ?, ?, ?, ?, ?, ?, ?); "

                                connection.query(sql, [idUser, date, time, clientName, partner, matterCode, descriptions, status, today], (err, results) => {
                                    if (err) {
                                        return next(err)
                                    } else {
                                        res.json({
                                            success: "success",
                                            message: results,
                                            message_th: "บันทึกข้อมูลเรียบร้อย"
                                        })
                                    }

                                })

                            } else {
                                res.json({
                                    success: "error",
                                    message: null,
                                    message_th: "กรุณากรอกรายละเอียด"
                                })
                            }
                        } else {
                            res.json({
                                success: "error",
                                message: null,
                                message_th: "กรุณากรอกสถานะ"
                            })
                        }
                    } else {
                        res.json({
                            success: "error",
                            message: null,
                            message_th: "กรุณากรอกชื่อ Partner"
                        })
                    }
                } else {
                    res.json({
                        success: "error",
                        message: null,
                        message_th: "กรุณากรอกชื่อลูกความ"
                    })
                }
            } else {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "กรุณาลงเวลาในกรทำงาน"
                })
            }
        } else {
            res.json({
                success: "error",
                message: null,
                message_th: "กรุณากรอกวันที่"
            })
        }

    })
}

exports.register = (req, res, next) => {
    var {
        body
    } = req;

    var email = body.email;
    var password = body.password;
    var name = body.name;

    req.getConnection((err, connection) => {
        if (err) return next(err)

        if (name.length > 0) {
            console.log(name.length)
            if (email.length > 0) {
                if (password.length > 0) {
                    var sql = "SELECT email FROM `sila-lawer`.`user-sila` WHERE email=? ;"
                    connection.query(sql, [email], (err, results) => {
                        if (err) {
                            return next(err)
                        }
                        if (results.length > 0) {
                            res.json({
                                success: "error",
                                message: null,
                                message_th: "อีเมล์นี้มีผู้ใช้งานแล้ว"
                            });
                        } else {
                            var sql = "INSERT INTO `sila-lawer`.`user-sila` ( email, password, name) \
                            VALUES (?, ?, ?);"
                            connection.query(sql, [email, password, name], (err, results) => {
                                if (err) {
                                    return next(err)
                                } else {
                                    res.json({
                                        success: "success",
                                        message: results,
                                        message_th: "สร้างบัญชีผู้ใช้งานเสร็จเรียบร้อย"
                                    })
                                }
                            })
                        }
                    })

                } else {
                    res.json({
                        success: "error",
                        message: null,
                        message_th: "password ไม่ถูกต้อง"
                    })
                }
            } else {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "email ไม่ถูกต้อง"
                })
            }

        } else {
            res.json({
                success: "error",
                message: null,
                message_th: "กรุณากรอกชื่อผู้ใช้"
            })
        }
    })
}

exports.fetchWorkforUser = (req, res, next) => {
    var {
        body
    } = req
    var userId = body.userId
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT `user-sila`.name, `work`.id ,`work`.idUser, `work`.date, `work`.time, \
              `work`.clientName, `work`.partner, `work`.matterCode, `work`.descriptions, `work`.status ,`work`.timestamp \
               FROM `user-sila`, `work`  WHERE `work`.idUser = `user-sila`.id  AND `work`.idUser=? ORDER BY `work`.timestamp DESC;"
        connection.query(sql, [userId], (err, results) => {
            if (err) {
                return next(err)
                //return console.log(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
                next
            }
        })
    })
}

exports.fetchAllforAdmin = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT `work`.id , `user-sila`.name, `user-sila`.email, `work`.date, `work`.time, \
        `work`.clientName, `work`.partner,\
        `work`.matterCode, `work`.descriptions,  `work`.status, `work`.timestamp\
        FROM `sila-lawer`.`work`, `sila-lawer`.`user-sila` \
        WHERE `work`.idUser = `user-sila`.id  ORDER BY `work`.timestamp DESC;"
        connection.query(sql, [], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ข้อมูลโดยรวม"
                })
            }
        })
    })
}

exports.fetchAllforAdminWorksheet = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT `work`.clientName,\
        `work`.descriptions,  `work`.status\
        FROM `sila-lawer`.`work`, `sila-lawer`.`user-sila` \
        WHERE `work`.idUser = `user-sila`.id  ORDER BY `work`.timestamp DESC;"
        connection.query(sql, [], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: "ข้อมูลโดยรวม"
                })
            }
        })
    })
}


exports.fetchUserForAdmin = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT*FROM `sila-lawer`.`user-sila` WHERE `user-sila`.status = 0 ;"
        connection.query(sql, [], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
            }
        })
    })
}

exports.fetchByIdForAdmin = (req, res, next) => {
    var {
        body
    } = req
    var id = body.id
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT  `user-sila`.id,`user-sila`.name, `user-sila`.email, `work`.date, `work`.time, \
        `work`.clientName, `work`.partner,\
        `work`.matterCode, `work`.descriptions , `work`.timestamp\
        FROM `sila-lawer`.`work`, `sila-lawer`.`user-sila` \
        WHERE `work`.idUser = `user-sila`.id AND  `user-sila`.id = ? ORDER BY `work`.timestamp DESC;"
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
            }
        })
    })
}

exports.updateIndex = (req, res, next) => {
    var {
        body
    } = req
    var idUser = body.idUser
    var date = body.date
    var time = body.time
    var clientName = body.clientName
    var partner = body.partner
    var matterCode = body.matterCode
    var descriptions = body.descriptions
    var status = body.status
    var workId = body.workId
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "UPDATE work SET idUser = ? , \
        date = ? , time = ? , clientName = ? , \
        partner = ? , matterCode = ? , descriptions = ?, status = ? WHERE work.id = ? ;"
        connection.query(sql, [idUser, date, time, clientName, partner, matterCode, descriptions, status, workId], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
            }
        })
    })
}

exports.DailyWork = (req, res, next) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT work.idUser, `user-sila`.name, work.date, work.time,\
        work.clientName, work.partner, work.matterCode, work.descriptions,\
        work.timestamp  FROM `sila-lawer`.`user-sila`, `sila-lawer`.work \
        WHERE `work`.idUser = `user-sila`.id AND work.date = ? ORDER BY work.timestamp DESC"
        connection.query(sql, [today], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
            }
        })
    })
}

exports.WorkByOptions = (req, res, next) => {
    var {
        body
    } = req
    var datef = body.datef
    var datet = body.datet
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT work.idUser, `user-sila`.name, work.date, work.time,\
        work.clientName, work.partner, work.matterCode, work.descriptions,\
        work.timestamp  FROM `sila-lawer`.`user-sila`, `sila-lawer`.work \
        WHERE `work`.idUser = `user-sila`.id AND `work`.date BETWEEN \
        ? AND ? ORDER BY work.timestamp DESC"
        connection.query(sql, [datef, datet], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
            }
        })
    })
}

exports.fetchDivision = (req, res, next) => {
    var {
        body
    } = req
    var partner = body.partner
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT work.idUser, `user-sila`.name, work.date, work.time,\
        work.clientName, work.partner, work.matterCode, work.descriptions,\
        work.timestamp  FROM `sila-lawer`.`user-sila`, `sila-lawer`.work \
        WHERE `work`.idUser = `user-sila`.id AND `work`.partner=? \
        ORDER BY work.timestamp DESC ;"
        connection.query(sql, [partner], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
            }
        })
    })
}

exports.fetchByIdWork = (req, res, next) => {
    var {
        body
    } = req

    var id = body.id

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT  `work`.id ,`user-sila`.name ,`work`.idUser, `work`.date, `work`.time, \
        `work`.clientName, `work`.partner, `work`.matterCode, `work`.descriptions, `work`.status, `work`.timestamp \
        FROM `user-sila`, `work`  WHERE `work`.idUser = `user-sila`.id  AND `work`.id=? ;"
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
            }
        })
    })
}

//DELETE FROM `sila-lawer`.`work` WHERE (`id` = '32');

exports.deleteWork = (req, res, next) => {

    var {
        body
    } = req

    var id = body.id

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "DELETE FROM `sila-lawer`.`work` WHERE `work`.id=?;"
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    message_th: null
                })
            }
        })
    })
}