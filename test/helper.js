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
  global.Encoder = require('../main').Encoder;
  global.Decoder = require('../main').Decoder;
  global.InvalidParameterError = require('../main').InvalidParameterError;
  global.InvalidAudioBufferLengthError = require('../main').InvalidAudioBufferLengthError;
  global.InvalidSampleRateError = require('../main').InvalidSampleRateError;
  global.InvalidNumberOfChannelsError = require('../main').InvalidNumberOfChannelsError;
  global.InvalidParameterError = require('../main').InvalidParameterError;
  global.InvalidBufferLengthError = require('../main').InvalidBufferLengthError;
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