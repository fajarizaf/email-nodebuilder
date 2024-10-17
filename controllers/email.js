// load models
const models = require('../models')
const tmp_email = models.template_email
const log_email = models.emaillog

// include libary
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const path = require('path')
const fs = require('fs')

const { Op, QueryTypes } = require("sequelize");

// global envi variable

const filePath = path.join(__dirname, '../emails/template.html');
const source = fs.readFileSync(filePath, 'utf-8').toString();
const templated = handlebars.compile(source);

const filePath_invocies = path.join(__dirname, '../emails/template_invoices.html');
const source_invoices = fs.readFileSync(filePath_invocies, 'utf-8').toString();
const templated_invoices = handlebars.compile(source_invoices);


var transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: '7e1866001@smtp-brevo.com',
        pass: 'TAq4PCZnBt7hD1jK'
    }
})


exports.subjectTemplate = (action) => new Promise((resolve, reject) => {

    tmp_email.findOne({
        where: { template_name: action },
    })
        .then((respond) => {
            resolve(convertToJson(respond.template_subject))
        })
        .catch((e) => {
            reject(
                convertToJson(
                    { status: 'failed', response: 'subject tidak ditemukan' }
                )
            )
        })

})


exports.LIST = () => new Promise((resolve, reject) => {

    tmp_email.findAll({
        attributes: ['id', 'template_name', 'template_desc', 'template_group']
    })
        .then((respond) => {
            resolve(convertToJson({ respond: { status: 'success', data: respond } }))
        })
        .catch((e) => {
            reject(
                convertToJson(
                    { status: 'failed', response: 'subject tidak ditemukan' }
                )
            )
        })

})


exports.DETAIL = (idtemplate) => new Promise((resolve, reject) => {

    tmp_email.findOne({
        where: {
            id: idtemplate
        }
    })
        .then((respond) => {
            resolve(convertToJson({ respond: { status: 'success', data: respond } }))
        })
        .catch((e) => {
            reject(
                convertToJson(
                    { status: 'failed', response: 'subject tidak ditemukan' }
                )
            )
        })

})



exports.SEND = (data, templates, subject) => new Promise((resolve, reject) => {

    try {

        var mailOptions = {
            from: 'Nodebuilder <info@nodebuilder.id>',
            to: data.send_to,
            subject: subject,
            html: getTemplate(templates, data)
        }

        transporter.sendMail(mailOptions, (err, info) => {

            //gagal send email
            if (err) {
                resolve(
                    convertToJson({
                        respond: {
                            status: 'failed',
                            response: 'error sent: ' + err,
                        }
                    })
                )
            } else {
                resolve(
                    convertToJson({
                        respond: {
                            status: 'success',
                            response: 'Email sent: ' + info.response,
                        }
                    })
                )
            }

        }, (err, info) => {
            console.log(info.envelope);
            console.log(info.messageId);
        })

    } catch (e) {
        resolve(
            convertToJson({
                respond: {
                    status: 'failed',
                    response: 'Email sent: ' + e.message,
                }
            })
        )
    }

})


exports.SEND_ATTACHMENT = (data, templates, subject, attachment) => new Promise((resolve, reject) => {

    try {

        var mailOptions = {
            from: 'MettaDC <sanii@mettadc.com>',
            to: data.send_to,
            subject: subject,
            html: getTemplate(templates, data),
            attachments: [attachment]
        }

        console.log(mailOptions)

        transporter.sendMail(mailOptions, (err, info) => {

            //gagal send email
            if (err) {
                resolve(
                    convertToJson({
                        respond: {
                            status: 'failed',
                            response: 'error sent: ' + err,
                        }
                    })
                )
            } else {
                resolve(
                    convertToJson({
                        respond: {
                            status: 'success',
                            response: 'Email sent: ' + info.response,
                        }
                    })
                )
            }

        }, (err, info) => {
            console.log(info.envelope);
            console.log(info.messageId);
        })

    } catch (e) {
        resolve(
            convertToJson({
                respond: {
                    status: 'failed',
                    response: 'Email sent: ' + e,
                }
            })
        )
    }

})


function getTemplate(template, context) {

    const template_bodys = handlebars.compile(template)

    const body_template = template_bodys(context)

    const section = {
        body: body_template
    }
    return templated(section)

}

function getTemplate_invoices(template, context) {

    const template_bodys = handlebars.compile(template)

    const body_template = template_bodys(context)

    const section = {
        body: body_template
    }
    return templated_invoices(section)

}


exports.queryTemplate = (action) => new Promise((resolve, reject) => {
    tmp_email.findAll({
        where: { template_name: action },
    })
        .then((respond) => {
            if (respond != '') {
                resolve(convertToJson(respond))
            } else {
                resolve(convertToJson({ status: 'failed', response: 'template tidak ditemukan' }))
            }
        })
        .catch((e) => {
            reject(
                convertToJson(
                    { status: 'failed', response: 'ada kesalahan pada proses penarikan' }
                )
            )
        })
})


//controller update template email
exports.ADD = (data) => new Promise((resolve, reject) => {
    tmp_email.create({
        template_name: data.template_name,
        template_desc: data.template_desc,
        template_group: data.template_group,
        template_body: data.template_body,
    })
        .then((respond) => {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'create template email telah berhasil',
                        id: respond.id,
                    }
                })
            )
        })
        .catch((e) => {
            resolve(
                convertToJson(
                    { status: 'failed' }
                )
            )
        })
})


//controller update template email
exports.UPDATE = (data) => new Promise((resolve, reject) => {
    tmp_email.update({
        template_subject: data.template_subject,
        template_body: data.template_body,
    }, {
        where: {
            id: data.idtemplate
        }
    })
        .then((respond) => {
            if (respond != '') {
                resolve(
                    convertToJson({
                        respond: {
                            status: 'success',
                            response: 'update template email telah berhasil',
                        }
                    })
                )
            } else {
                convertToJson({
                    respond: {
                        status: 'failed',
                        response: 'update template email gagal dilakukan',
                    }
                })
            }
        })
        .catch((e) => {
            resolve(
                convertToJson(
                    { status: 'error', response: e.message }
                )
            )
        })
})


//controller update template email
exports.DELETE = (data) => new Promise((resolve, reject) => {
    tmp_email.destroy({
        where: {
            id: data.id
        }
    })
        .then((respond) => {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'delete template email telah berhasil',
                    }
                })
            )
        })
        .catch((e) => {
            resolve(
                convertToJson(
                    { status: 'failed' }
                )
            )
            console.log(e)
        })
})




exports.Log = (pageNumber, pageSize, order, stream, where) => new Promise((resolve, reject) => {
    console.log(where)

    const paginate = (query, { pageNumber, pageSize }) => {
        const offset = pageNumber * pageSize;
        const limit = pageSize;
        return {
            ...query,
            offset,
            limit,
        }
    }

    log_email.findAndCountAll(
        paginate(
            {
                attributes: ['id', 'to', 'subject', 'req', 'res'],
                order: [[order, stream]],
                where: where,
                raw: false
            }, { pageNumber, pageSize })
    )
        .then((respond) => {

            if (respond != '') {

                resolve(
                    convertToJson({
                        respond: {
                            status: 'success',
                            response: 'Record Found',
                            data: respond
                        }
                    })
                )

            } else {

                resolve(
                    convertToJson({
                        respond: {
                            status: 'failed',
                            response: 'Record Not Found'
                        }
                    })
                )

            }

        })
        .catch((e) => {

            resolve(
                convertToJson({
                    respond: {
                        status: 'error',
                        response: e.message
                    }
                })
            )

        })

})


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}