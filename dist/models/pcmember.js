"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize) {
  const PCMember = sequelize.define("pcmember", {});

  return PCMember;
};