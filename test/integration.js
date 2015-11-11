var mongooseOverride = require('../dist/mongoose-override'),
    mongoose = require('mongoose'),
    assert = require('assert');

describe('mongoose-override', () => {

  beforeEach((done) => {
    mongoose.connect('mongodb://localhost/test', (err) => {
      done(err);
    });
  });
  
  afterEach((done) => {
    mongoose.disconnect(() => {
      done();
    });
  });
 
  it('can be applied', (done) => {

    var modelScheme = new mongoose.Schema({
      'referenceObject' : {'type' : 'String', 'ref' : 'otherModel'}
    });

    modelScheme.plugin(mongooseOverride, {'overrides' : ['referenceObject']});
    var model = mongoose.model('model', modelScheme);
    var instance = new model({'referenceObject' : 'ABC12345ABC' });
    instance.save((err) => {
      if(err) {
         assert(!err);
      }
      done();
    });
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
        'a' : {'ref' : aInstance._id, 'property' : 'Overriden'}
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
    });
  });
});
