const chai = require('chai');
const Future = require('fluture');
const chaiAsPromised = require('chai-as-promised');
const applySpecF = require('./index');

chai.use(chaiAsPromised);

const {
  expect,
} = chai;


// For tests
// const obj = {
//   fffa: Future.of(10),
//   fffb: Future.of({ e: 20 }),
//   c: 13,
//   nested: {
//     fffe: Future.of({ z: 2000 }),
//     zzccc: 123,
//   },
//   nested1: {
//     xxx: 123,
//     nested2: {
//       zzz: Future.of(10),
//       vvv: 12,
//     },
//   },
// };

describe('apply-spec-f', () => {
  it('call with empty object', async () => {
    const obj = {};

    expect(await applySpecF(obj).promise()).to.deep.equals(obj);
  });

  it('call with object without Futures', async () => {
    const obj = {
      num: 123,
      str: 'abc',
      bool: true,
      arr: ['val', 'val'],
    };

    expect(await applySpecF(obj).promise()).to.deep.equals(obj);
  });

  it('call with Futures', async () => {
    const obj = {
      num: 123,
      str: 'abc',
      bool: true,
      arr: ['val', 'val'],
      future: Future.of(123),
    };

    const result = {
      ...obj,
      future: 123,
    };

    expect(await applySpecF(obj).promise()).to.deep.equals(result);
  });

  it('call with Future.reject', async () => {
    const errData = { isErr: true };
    const obj = {
      future: Future.reject(errData),
    };

    expect(applySpecF(obj).promise()).to.eventually.be.rejectedWith(errData);
  });
});
