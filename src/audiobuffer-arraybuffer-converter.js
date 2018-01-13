//import { AudioBuffer } from 'audio-buffer';
let AudioBuffer = require('audio-buffer');

export class InvalidParameterError extends Error {}
export class InvalidBufferLengthError extends Error {}

export class Encoder {
  constructor() {
  }
  generateDestinationBuffer(src) {
    return generateDestinationBufferOnEncoder(src);
  }
  encode(src, dst) {
    if (dst === undefined) {
      dst = this.generateDestinationBuffer(src);
    }
    this.validate(src, dst);
    return encode(src, dst);
  }
  validate(src, dst) {
    validateOnEncoder(src, dst);
  }
}

function generateDestinationBufferOnEncoder(src) {
  if (src instanceof AudioBuffer === false) { throw new InvalidParameterError(); }
  return new ArrayBuffer(16 + (src.length * src.numberOfChannels * 4));
}
function validateOnEncoder(src, dst) {
  if (src instanceof AudioBuffer === false) { throw new InvalidParameterError(); }
  if (dst instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
  const lengthArrayBuffer =
    16 /** 4 * 4 **/ +
    (4 * src.length * src.numberOfChannels)
  ;
  // console.log(lengthArrayBuffer);
  if (lengthArrayBuffer !== dst.byteLength) { throw new InvalidBufferLengthError(); }
}
function encode(src, dst) {
  if (src instanceof AudioBuffer === false) { throw new InvalidParameterError(); }
  if (dst instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
  let dv = new DataView(dst);
  dv.setFloat32( 0,       src.sampleRate, true);
  dv.setFloat32( 4,         src.duration, true);
  dv.setUint32 ( 8,           src.length, true);
  dv.setUint32 (12, src.numberOfChannels, true);
  for (let c = 0; c < src.numberOfChannels; c++) {
    const f64 = src.getChannelData(c);
    for (let i = 0; i < f64.length; i++) {
      let j = 16 + (c * src.length * 4) + (i * 4);
      dv.setFloat32(j, f64[i], true);
    }
  }
  return dst;
}

export class Decoder {
  constructor() {
  }
  generateDestinationBuffer(src) {
    return generateDestinationBufferOnDecoder(src);
  }
  decode(src, dst) {
    if (dst === undefined) {
      dst = this.generateDestinationBuffer(src);
    }
    this.validate(src, dst);
    return decode(src, dst);
  }
  validate(src, dst) {
    validateOnDecoder(src, dst)
  }
}

function generateDestinationBufferOnDecoder(src) {
  if (src instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
  let dv = new DataView(src);
  return new AudioBuffer({
    sampleRate: dv.getFloat32(0, true),
    length: dv.getUint32(8, true),
    numberOfChannels: dv.getUint32(12, true),
  })
}
function validateOnDecoder(src, dst) {
  if (src instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
  if (dst instanceof AudioBuffer === false) { throw new InvalidParameterError(); }
  const dv = new DataView(src);
  const sampleRate = dv.getFloat32(0, true);
  const duration = dv.getFloat32(4, true);
  const lengthAudioBuffer =
    16 /** 8 * 4 **/ +
    (4 * dv.getUint32(8, true) * dv.getUint32(12, true))
  ;
  if (lengthAudioBuffer !== src.byteLength) { throw new InvalidBufferLengthError(); }
}
function decode(src, dst) {
  if (src instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
  if (dst instanceof AudioBuffer === false) { throw new InvalidParameterError(); }
  const dv = new DataView(src);
  for (let c = 0; c < dst.numberOfChannels; c++) {
    let f32 = new Float32Array(dst.length);
    for (let i = 0; i < f32.length; i++) {
      let j = 16 + (c * src.length * 4) + (i * 4);
      f32[i] = dv.getFloat32(j, true);
    }
    dst.copyToChannel(f32, c);
  }
  return dst;
}