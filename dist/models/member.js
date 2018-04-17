"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, Datatypes) {
  var Member = sequelize.define("member", {
    admin: {
      type: Datatypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Member;
};