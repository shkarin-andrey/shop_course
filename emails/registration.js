const keys = require('../keys')

module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account created',
        html: `
            <h1>Hello, my friend!</h1>
            <p>You have successfully registered on the store page</p>
            <hr/>
            <p>Your Email: ${email}</p>
            <p>Site: <a href="${keys.BASE_URL}">shkarin-andrey.ru</p>
        `
    }
}