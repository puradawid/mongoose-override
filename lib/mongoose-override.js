"use strict";
var mongoose = require('mongoose');

// ALGORITHM:
// 1. create new scheme with ' at the end of scheme name
// 2. load all properties to it
// 3. add new ref field to reference to other object
// 4. change this scheme to input scheme

module.exports = function Override(schema, options) {
  schema.pre('validate', function (done) {
    var self = this;
    console.log(self);
    done();
  });

  schema.pre('save', function (done) {
    console.log(this);
    done();
  });
};
