const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../modules/user')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Auth',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    } 
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Invalid password')
                res.redirect('/auth/login')
            }

        } else {
            req.flash('loginError', 'This user does not exist')
            res.redirect('/auth/login')
        }

    } catch (e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {
            req.flash('registerError', 'User with this email address already exists')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email, name, password: hashPassword, card: {items: []}
            })
            await user.save()
            res.redirect('/auth/login')
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = router