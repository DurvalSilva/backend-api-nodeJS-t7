const express = require('express')

module.exports = function(server) {
    const protectApi = express.Router();
    server.use("/api", protectApi);

    server.use("status", (req,res) =>
        res.send(`BACKEND is runner.`)
        );

        const register = require('../api/registerService');
        register.register(protectApi, 'register');

        server.use(express.static(require("path").join(__dirname, "../public")))
}

