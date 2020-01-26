"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _swaggerUiExpress = require("swagger-ui-express");

var _yamljs = _interopRequireDefault(require("yamljs"));

var _usersRouter = _interopRequireDefault(require("./users/usersRouter"));

var app = (0, _express["default"])();
var port = 3000; // Setup docs

app.use('/api/docs/v1', _swaggerUiExpress.serve, (0, _swaggerUiExpress.setup)(_yamljs["default"].load('./docs/swagger/api.v1.yml'))); // Setup routes

app.use('/api/v1/users', _usersRouter["default"]);
app.listen(port, function () {
  /* eslint-disable no-console */
  console.log("Server running on ".concat(port));
});