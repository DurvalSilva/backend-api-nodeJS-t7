const express = require('express')

module.exports = function (server) {
    const protectedApi = express.Router();
    server.use("/api", protectedApi);

    server.use("/status", (req, res) =>
        res.send(`BACKEND is runner esta rodando 19hrs55.`)
    );

    const register = require('../api/registerService');
    register.register(protectedApi, '/register');

    server.use(express.static(require('path').join(__dirname, '../public')));
}