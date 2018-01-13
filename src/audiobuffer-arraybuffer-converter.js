//import { AudioBuffer } from 'audio-buffer';
let AudioBuffer = require('audio-buffer');

export class InvalidBufferLengthError extends Error {
  constructor(expected, real) {
    super(`Expected buffer length is '${expected}' but real is '${real}'`);
  }
}
export class InvalidAudioBufferLengthError extends Error {
  constructor(expected, real) {
    super(`Expected audio buffer length is '${expected}' but real is '${real}'`);
  }
}
export class InvalidSampleRateError extends Error {
  constructor(expected, real) {
    super(`Expected audio buffer sampleRate is '${expected}' but real is '${real}'`);
  }
}
export class InvalidNumberOfChannelsError extends Error {
  constructor(expected, real) {
    super(`Expected audio buffer numberOfChannels is '${expected}' but real is '${real}'`);
  }
}
export class InvalidDurationError extends Error {}

class Base {
  constructor(conf) {
    if (conf.littleEndian)
      this.littleEndian = conf.littleEndian;
    else
      this.littleEndian = true;
  }
  generateDestinationBuffer(src) {
    throw new Error(`This method must be implemented: generateDestinationBuffer`);
  }
  validate(src, dst) {
    throw new Error(`This method must be implemented: generateDestinationBuffer`);
  }
  each(src, dst) {
    throw new Error(`This method must be implemented: generateDestinationBuffer`);
  }
  checkArgumentExecute(src, dst) {
    throw new Error(`This method must be implemented: generateDestinationBuffer`);
  }
  execute(src, dst) {
    this.checkSrcExecute(src);
    if (dst === undefined) {
      dst = this.generateDestinationBuffer(src);
    }
    this.checkDstExecute(dst);    
    this.validate(src, dst);
    return this.each(src, dst);
  }
}

export class Encoder extends Base {
  constructor(conf) {
    if (!conf) conf = {};
    super(conf);
  }
  generateDestinationBuffer(src) {
    return generateDestinationBufferOnEncoder(src);
  }
  checkSrcExecute(src) {
    if (src instanceof AudioBuffer === false) { throw new TypeError(`'src' must be instance of AudioBuffer`); }
  }
  checkDstExecute(dst) {
    if (dst instanceof ArrayBuffer === false) { throw new TypeError(`'dst' must be instance of ArrayBuffer`); }
  }
  each(src, dst) {
    return encode(src, dst, this.littleEndian);
  }
  validate(src, dst) {
    validateOnEncoder(src, dst);
  }
}

function generateDestinationBufferOnEncoder(src) {
  return new ArrayBuffer(16 + (src.length * src.numberOfChannels * 4));
}
function validateOnEncoder(src, dst) {
  
  const lengthArrayBuffer =
    16 /** 4 * 4 **/ +
    (4 * src.length * src.numberOfChannels)
  ;
  // console.log(lengthArrayBuffer);
  if (lengthArrayBuffer !== dst.byteLength) { throw new InvalidBufferLengthError(lengthArrayBuffer, dst.byteLength); }
}
function encode(src, dst, littleEndian) {
  let dv = new DataView(dst);
  dv.setFloat32( 0,       src.sampleRate, littleEndian);
  dv.setFloat32( 4,         src.duration, littleEndian);
  dv.setUint32 ( 8,           src.length, littleEndian);
  dv.setUint32 (12, src.numberOfChannels, littleEndian);
  for (let c = 0; c < src.numberOfChannels; c++) {
    const f64 = src.getChannelData(c);
    for (let i = 0; i < f64.length; i++) {
      let j = 16 + (c * src.length * 4) + (i * 4);
      dv.setFloat32(j, f64[i], littleEndian);
    }
  }
  return dst;
}

export class Decoder extends Base {
  constructor(conf) {
    if (!conf) conf = {};
    super(conf);
  }
  generateDestinationBuffer(src) {
    return generateDestinationBufferOnDecoder(src, this.littleEndian);
  }
  checkSrcExecute(src) {
    if (src instanceof ArrayBuffer === false) { throw new TypeError(`'src' must be instance of ArrayBuffer`); }
  }
  checkDstExecute(dst) {
    if (dst instanceof AudioBuffer === false) { throw new TypeError(`'dst' must be instance of AudioBuffer`); }
  }
  each(src, dst) {
    return decode(src, dst, this.littleEndian);
  }
  validate(src, dst) {
    validateOnDecoder(src, dst, this.littleEndian)
  }
}

function generateDestinationBufferOnDecoder(src, littleEndian) {
  let dv = new DataView(src);
  return new AudioBuffer({
    sampleRate: dv.getFloat32(0, littleEndian),
    length: dv.getUint32(8, littleEndian),
    numberOfChannels: dv.getUint32(12, littleEndian),
  })
}
function validateOnDecoder(src, dst, littleEndian) {
  const dv = new DataView(src);
  const sampleRate = dv.getFloat32(0, littleEndian);
  const duration = dv.getFloat32(4, littleEndian);
  const length = dv.getUint32(8, littleEndian);
  const numberOfChannels = dv.getUint32(12, littleEndian);
  if (length !== dst.length) { throw new InvalidAudioBufferLengthError(length, dst.length); }
  if (sampleRate !== dst.sampleRate) { throw new InvalidSampleRateError(sampleRate, dst.sampleRate); }
  if (numberOfChannels !== dst.numberOfChannels) { throw new InvalidNumberOfChannelsError(numberOfChannels, dst.numberOfChannels); }
  // if (duration !== dst.duration) { throw new InvalidDurationError(); }
}
function decode(src, dst, littleEndian) {
  const dv = new DataView(src);
  for (let c = 0; c < dst.numberOfChannels; c++) {
    let f32 = new Float32Array(dst.length);
    for (let i = 0; i < f32.length; i++) {
      let j = 16 + (c * src.length * 4) + (i * 4);
      f32[i] = dv.getFloat32(j, littleEndian);
    }
    dst.copyToChannel(f32, c);
  }
  return dst;
}