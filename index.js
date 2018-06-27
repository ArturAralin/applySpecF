const Future = require('fluture');
const dottie = require('dottie');
const {
  mergeAll,
  pick,
  values,
  curryN,
  applySpec,
  type,
} = require('ramda');

const getUnnestedVals = (o, parentPath) => {
  // eslint-disable-next-line no-param-reassign
  parentPath = parentPath || [];
  let vals = [];

  const keys = Object.keys(o);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = o[key];
    const currentParentPath = parentPath.concat([key]);
    const isNotFuture = !Future.isFuture(value);
    const isNestedVal = type(value) === 'Object';

    if (isNotFuture && isNestedVal) {
      vals = [...vals, ...getUnnestedVals(value, currentParentPath)];
    } else {
      const isFuture = Future.isFuture(value);
      const joinedPath = currentParentPath.join('.');
      const val = isFuture
        ? value.map(v => ({ [joinedPath]: v }))
        : value;

      vals.push({
        [joinedPath]: val,
      });
    }
  }

  return vals;
};

const filterFutures = (vals) => {
  const keys = Object
    .keys(vals)
    .filter(key => Future.isFuture(vals[key]));

  return values(pick(keys, vals));
};

const mergeAsyncResults = curryN(2, (results, vals) => ({
  ...results,
  ...mergeAll(vals),
}));

function applySpecFn(n, spec, o) {
  const data = applySpec(spec)(o);
  const vals = mergeAll(getUnnestedVals(data));
  const furutes = filterFutures(vals);
  const parallelsCount = n || Infinity;

  return Future
    .parallel(parallelsCount, furutes)
    .map(mergeAsyncResults(vals))
    .map(dottie.transform);
}

const applySpecF = curryN(2, (spec, o) => applySpecFn(Infinity, spec, o));
const applySpecFLimit = curryN(3, (n, spec, o) => applySpecFn(n, spec, o));

module.exports = {
  default: applySpecF,
  applySpecF,
  applySpecFLimit,
};
