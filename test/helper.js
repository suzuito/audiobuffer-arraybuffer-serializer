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

module.exports.f32 = (elems) => {
  let ret = new Float32Array(elems.length);
  for (let i = 0; i < elems.length; i++) {
    ret[i] = elems[i];
  }
  return ret;
}