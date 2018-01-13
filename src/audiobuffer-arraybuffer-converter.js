//import { AudioBuffer } from 'audio-buffer';
let AudioBuffer = require('audio-buffer');

export class InvalidParameterError extends Error {}
export class InvalidBufferLengthError extends Error {}

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
  execute(src, dst) {
    if (dst === undefined) {
      dst = this.generateDestinationBuffer(src);
    }
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
  each(src, dst) {
    return encode(src, dst, this.littleEndian);
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
function encode(src, dst, littleEndian) {
  if (src instanceof AudioBuffer === false) { throw new InvalidParameterError(); }
  if (dst instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
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
  each(src, dst) {
    return decode(src, dst, this.littleEndian);
  }
  validate(src, dst) {
    validateOnDecoder(src, dst, this.littleEndian)
  }
}

function generateDestinationBufferOnDecoder(src, littleEndian) {
  if (src instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
  let dv = new DataView(src);
  return new AudioBuffer({
    sampleRate: dv.getFloat32(0, littleEndian),
    length: dv.getUint32(8, littleEndian),
    numberOfChannels: dv.getUint32(12, littleEndian),
  })
}
function validateOnDecoder(src, dst, littleEndian) {
  if (src instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
  if (dst instanceof AudioBuffer === false) { throw new InvalidParameterError(); }
  const dv = new DataView(src);
  const sampleRate = dv.getFloat32(0, littleEndian);
  const duration = dv.getFloat32(4, littleEndian);
  const lengthAudioBuffer =
    16 /** 8 * 4 **/ +
    (4 * dv.getUint32(8, littleEndian) * dv.getUint32(12, littleEndian))
  ;
  if (lengthAudioBuffer !== src.byteLength) { throw new InvalidBufferLengthError(); }
}
function decode(src, dst, littleEndian) {
  if (src instanceof ArrayBuffer === false) { throw new InvalidParameterError(); }
  if (dst instanceof AudioBuffer === false) { throw new InvalidParameterError(); }
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