const AudioBuffer = require('audio-buffer');

module.exports.dataView = (ab) => {
  return new DataView(ab);
}

module.exports.audioBuffer = (conf) => {
  return new AudioBuffer(conf);
}

module.exports.arrayBuffer = (conf) => {
  let ab = new ArrayBuffer(
    16 /** 4 * 4 **/
    + (4 * conf.length * conf.numberOfChannels)
  );
  return ab;
}

module.exports.f32 = function () {
  let ret = new Float32Array(arguments.length);
  for (let i = 0; i < arguments.length; i++) {
    ret[i] = arguments[i];
  }
  return ret;
}