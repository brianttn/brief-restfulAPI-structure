const express = require('express')
const app = express()
const port = process.env.PORT || 3000

/* - - - Create a 「router(路由器)：userMgrAPI」 - - - */
const userMgrAPI = express.Router()

/* - - - - - - 授權使用者 - - - - - - */
const authUsers = [
    {
        name: 'Daniel',
        age: 28,
        country: 'Malaysia'
    },
    {
        name: 'Yoko',
        age: 35,
        country: 'Japan'
    },
    {
        name: 'Claire',
        age: 12,
        country: 'Taiwan',
    }
]

/* - - - Apply the「Middleware：userMgrAPI」 on 「route => /apis/admin」 - - - */
app.use(
    '/apis/admin',
    userMgrAPI
)

/* - - - Middleware =>「檢查：是否為授權使用者」，並套用在「所有的：HTTP Verbs(Methods)」 - - - */
userMgrAPI.use(
    '/user/:username',
    (req, res, next) => {
        const result = authUsers.find(
            elem => elem.name.toUpperCase() == req.params.username.toUpperCase()
        )

        if (req.method == 'POST') {
            if (result == undefined) {
                req.userObj = result
                next()
            } else {
                res.end(`重覆註冊使用者!!`)
            }
        }else{
            if (result == undefined) {
                res.end(`非授權使用者!!`)
            } else {
                req.userObj = result
                next()
            }
        }
    }
)

/* - - - 指定「Handle：HTTP Verbs(Methods)」的「route => /user/:username」 - - - */
userMgrAPI.route('/user/:username').get(
    (req, res) => {
        console.log(`已成功讀取使用者${req.params.username}的資料!!`)
        res.end(`${req.params.username}的資料如下：\n${JSON.stringify(req.userObj)}`)
    }
).post(
    (req, res) => {

        console.log(`已成功新增使用者${req.params.username}!!`)
        res.end(`Create a new user：${req.params.username}`)
    }
).put(
    (req, res) => {
        console.log(`已成功更新使用者${req.params.username}的資料!!`)
        res.end(`Update ${req.params.username}'s profile.`)
    }
).delete(
    (req, res) => {
        console.log(`已成功刪除使用者${req.params.username}!!`)
        res.end(`Delete user：${req.params.username}`)
    }
)

app.listen(
    port,
    err => err ? console.log("Server error!!") : console.log(`Server is running at http://127.0.0.1:${port}/`)
)