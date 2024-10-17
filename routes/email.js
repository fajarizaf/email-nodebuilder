const EMAIL = require("../controllers/email")

const email = app => {

    app.post('/email/send', async (req, res) => {
        try {

            getTemplate = await EMAIL.queryTemplate(req.body.action)

            if (getTemplate != '') {

                let send = await EMAIL.SEND(req.body, getTemplate[0].template_body, getTemplate[0].template_subject)

                res.json(send)

            } else {
                res.json({ respond: { status: 'failed', response: 'template email tidak ditemukan' } })

            }
        } catch (error) {
            res.json({ respond: { status: 'error', response: 'err msg :' + error.message } })
        }
    })

}

module.exports = email