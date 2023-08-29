const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});

// 用户数据
const users = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" }
];
const jwtSecretKey = "your_jwt_secret_key";

// 登录之后生成 JWT token
app.post("/user/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ error: "用户名或密码错误" });
        }

        const payload = {
            userId: user.id,
        };
        //生成token 设置过期时间为 1 小时
        const token = await jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "登录失败" });
    }
});


async function isLogin(req, res, next) {
    const tokenHeaderKey = 'Authorization';
    const token = req.header(tokenHeaderKey)

    if (!token) {
        return res.status(401).json({ error: "用户未登录" });
    }

    const verified = await jwt.verify(token, jwtSecretKey);
    if (verified) {
        next()
    } else {
        return res.status(401).json({ error: "无效的token" });
    }
}
// 获取用户信息
app.get("/user/:username", isLogin, async (req, res) => {
    const username = req.params.username;
    const user = users.map(u => ({ id: u.id, username: u.username})).find(u => u.username === username)
    res.json(user);
});
