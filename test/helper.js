function dataView(ab) {
  return new DataView(ab);
}
function audioBuffer(conf) {
  if (typeof AudioBuffer === 'undefined') {
    return new require('audio-buffer')(conf);
  }
  let a = new AudioBuffer(conf);
  return a;
}
function arrayBuffer(conf) {
  let ab = new ArrayBuffer(
    16 /** 4 * 4 **/
    + (4 * conf.length * conf.numberOfChannels)
  );
  return ab;
}
function f32 () {
  let ret = new Float32Array(arguments.length);
  for (let i = 0; i < arguments.length; i++) {
    ret[i] = arguments[i];
  }
  return ret;
}

if (typeof module !== 'undefined') {
  module.exports.dataView = dataView;
  module.exports.audioBuffer = audioBuffer;
  module.exports.arrayBuffer = arrayBuffer;
  module.exports.f32 = f32;
  global.expect = require('chai').expect;
  global.assert = require('chai').assert;
  global.Encoder = require('../dist/main.cjs').Encoder;
  global.Decoder = require('../dist/main.cjs').Decoder;
  global.InvalidParameterError = require('../dist/main.cjs').InvalidParameterError;
  global.InvalidAudioBufferLengthError = require('../dist/main.cjs').InvalidAudioBufferLengthError;
  global.InvalidSampleRateError = require('../dist/main.cjs').InvalidSampleRateError;
  global.InvalidNumberOfChannelsError = require('../dist/main.cjs').InvalidNumberOfChannelsError;
  global.InvalidParameterError = require('../dist/main.cjs').InvalidParameterError;
  global.InvalidBufferLengthError = require('../dist/main.cjs').InvalidBufferLengthError;
} else {
  var helper = {
    dataView: dataView,
    audioBuffer: audioBuffer,
    arrayBuffer: arrayBuffer,
    f32: f32,
  };
  var Encoder = aas.Encoder;
  var Decoder = aas.Decoder;
  var assert = chai.assert;
  var expect = chai.expect;
  var InvalidParameterError = aas.InvalidParameterError;
  var InvalidAudioBufferLengthError = aas.InvalidAudioBufferLengthError;
  var InvalidSampleRateError = aas.InvalidSampleRateError;
  var InvalidNumberOfChannelsError = aas.InvalidNumberOfChannelsError;
  var InvalidParameterError = aas.InvalidParameterError;
  var InvalidBufferLengthError = aas.InvalidBufferLengthError;
}