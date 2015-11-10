var mongooseOverride = require('../dist/mongoose-override'),
    mongoose = require('mongoose'),
    assert = require('assert');

describe('mongoose-override', () => {
  it('can be applied', () => {
    var modelScheme = new mongoose.Schema({
      'referenceObject' : {'type' : 'String', ref : 'otherModel'}
    });
    modelScheme.plugin(mongooseOverride, {'overrides' : ['referenceObject']});
  });

  it('should save element with overriding', (done) => {
    var aModel = new mongoose.Schema({
      'property' : {'type' : String}
    })
    var A = mongoose.model('A', aModel);
    var bModel = new mongoose.Schema({
      'a' : {'type' : String, 'ref' : 'A'}
    });
    bModel.plugin(mongooseOverride, {'overrides' : ['a']});
    var B = mongoose.model('B', bModel);
    var aInstance = new A({
      'property' : 'Mine property'
    });
    aInstance.save((err, aInstance) => {
      if(err) {
        return done(err);
      }
      var bInstance = new B({
        'a' : {'_id' : aInstance._id, 'property' : 'Overriden'}
      });
      bInstance.save((err, bInstance) => {
        if(err) {
          return done(err);
        }
        bInstance.populate('a', (err, bInstance) => {
          if(err) {
            return done(err);
          }
          assert.equal(bInstance.a.property, 'Overriden');
          done();
        });
      });
    })
  })
});
