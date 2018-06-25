const chai = require('chai');
const Future = require('fluture');
const chaiAsPromised = require('chai-as-promised');
const {
  prop,
} = require('ramda');
const {
  applySpecF,
} = require('./index');

chai.use(chaiAsPromised);

const {
  expect,
} = chai;

describe('apply-spec-f', () => {
  it('call with empty object', () => {
    const obj = {};
    const spec = {};

    expect(applySpecF(spec, obj).promise()).to.eventually.deep.equals(obj);
  });

  it('call with object without Futures', () => {
    const obj = {
      num: 123,
    };

    const spec = {
      num: prop('num'),
    };

    expect(applySpecF(spec, obj).promise()).to.eventually.deep.equals(obj);
  });

  it('call with Futures', () => {
    const obj = {
      num: 123,
    };

    const spec = {
      num: v => Future.of(v.num),
    };


    expect(applySpecF(spec, obj).promise()).to.eventually.deep.equals(obj);
  });

  it('call with Future.reject', () => {
    const obj = {
      num: 123,
    };

    const spec = {
      num: v => Future.reject(v.num),
    };


    expect(applySpecF(spec, obj).promise()).to.eventually.rejectedWith(obj);
  });
});
