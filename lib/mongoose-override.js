"use strict";
var mongoose = require('mongoose');

var createModelOverrideName = function (name) {
  return name + '_override';
};

var registerOverrideModel = function (modelName) {

};

// ALGORITHM:
// 1. create new scheme with ' at the end of scheme name
// 2. load all properties to it
// 3. add new ref field to reference to other object
// 4. change this scheme to input scheme

module.exports = function Override(schema, options) {
  var fields = options.overrides;

  schema.pre('validate', function (done) {
    var self = this;
    fields.forEach((field) => {
      var modelName = schema.path(field).options.ref;
      try {
        var overrideModel = self.model(createModelOverrideName(modelName));
      } catch (e) {
        if(e.name === "MissingSchemaError") {
          register
        } else {
          throw e;
        }
      }
      if(overrideModel) {
        console.log('no need to create model');
      } else {
        console.log('has to create ' + createModelOverrideName(modelName));
      }
    });
    done();
  });

  schema.pre('save', function (done) {
    console.log(this);
    done();
  });
};
