// Windows NTFS / Defender transient EPERM/EBUSY retry wrapper for Next.js & Webpack builds
const fs = require('fs');

const origMkdir = fs.mkdir.bind(fs);
const origMkdirSync = fs.mkdirSync.bind(fs);
const origPromisesMkdir = fs.promises && fs.promises.mkdir ? fs.promises.mkdir.bind(fs.promises) : null;

const RETRY_CODES = new Set(['EPERM', 'EACCES', 'EBUSY', 'ENOTEMPTY']);

function sleepSync(ms) {
  try {
    const sab = new SharedArrayBuffer(4);
    const view = new Int32Array(sab);
    Atomics.wait(view, 0, 0, ms);
  } catch {
    const end = Date.now() + ms;
    while (Date.now() < end) {}
  }
}

fs.mkdirSync = function patchedMkdirSync(dirPath, options) {
  let lastErr;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      return origMkdirSync(dirPath, options);
    } catch (err) {
      lastErr = err;
      if (err && err.code === 'EEXIST' && options && (options === true || options.recursive)) {
        return undefined;
      }
      if (err && RETRY_CODES.has(err.code)) {
        sleepSync(40 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
};

fs.mkdir = function patchedMkdir(dirPath, options, callback) {
  let cb = callback;
  let opts = options;
  if (typeof opts === 'function') {
    cb = opts;
    opts = undefined;
  }

  let attempt = 0;
  function run() {
    origMkdir(dirPath, opts, (err, result) => {
      if (!err) return cb && cb(null, result);
      if (err.code === 'EEXIST' && opts && (opts === true || opts.recursive)) {
        return cb && cb(null, undefined);
      }
      if (RETRY_CODES.has(err.code) && attempt < 8) {
        attempt++;
        return setTimeout(run, 40 * attempt);
      }
      return cb && cb(err);
    });
  }
  run();
};

if (origPromisesMkdir) {
  fs.promises.mkdir = async function patchedPromisesMkdir(dirPath, options) {
    let lastErr;
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        return await origPromisesMkdir(dirPath, options);
      } catch (err) {
        lastErr = err;
        if (err && err.code === 'EEXIST' && options && (options === true || options.recursive)) {
          return undefined;
        }
        if (err && RETRY_CODES.has(err.code)) {
          await new Promise((r) => setTimeout(r, 40 * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }
    throw lastErr;
  };
}

