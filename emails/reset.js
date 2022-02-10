const keys = require('../keys')

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Access recovery',
        html: `
            <h1>Have you forgotten your password?</h1>
            <p>If not, please ignore this email.</p>
            <p>Otherwise click on the link:</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">${keys.BASE_URL}/auth/password/${token}</p>
            <hr/>
            <p>Your Email: ${email}</p>
            <p>Site: <a href="${keys.BASE_URL}">shkarin-andrey.ru</p>
        `
    }
}