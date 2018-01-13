'use strict';
const helper = require('./helper');

const sinon = require('sinon');
const expect = require('chai').expect;

const AudioBuffer = require('audio-buffer');
const Encoder = require('../dist/main.cjs').Encoder;

const InvalidParameterError = require('../dist/main.cjs').InvalidParameterError;
const InvalidBufferLengthError = require('../dist/main.cjs').InvalidBufferLengthError;

function shouldSuccess(conf, encoder, channels, done) {
  let src = helper.audioBuffer(conf);
  for (let c = 0; c < channels.length; c++) {
    src.copyFromChannel(c, channels[c], 0);
  }
  let dst = encoder.execute(src);
  expect(dst.byteLength).to.equal(
    16 // header len
    + (4 * conf.length * conf.numberOfChannels)
  );
  let dv = helper.dataView(dst);
  expect(dv.getFloat32(0, encoder.littleEndian), conf.sampleRate);
  // expect(dv.getFloat32(4, true), duration??);
  expect(dv.getUint32(8, encoder.littleEndian), conf.length);
  expect(dv.getUint32(12, encoder.littleEndian), conf.numberOfChannels);
  for (let c = 0; c < channels.length; c++) {
    for (let i = 0; i < channels[c].length; i++)
    expect(dv.getFloat32(16 + (i * 4), encoder.littleEndian), channels[c][i]);
  }
  done();
}

describe('audiobuffer-encoder', () => {
  let encoder = null;
  let confEncoder = {};
  before((done) => {
    confEncoder.littleEndian = true;
    encoder = new Encoder(confEncoder);
    done();
  });
  describe('Channel:0 should be success', () => {
    let conf = null, channels = null;
    before(() => {
      conf = { length: 2, numberOfChannels: 0, sampleRate: 12000 };
      channels = [];
    });
    it('Little endian', done => {
      shouldSuccess(conf, new Encoder({ littleEndian: true, }), channels, done);
    });
    it('Big endian', done => {
      shouldSuccess(conf, new Encoder({ littleEndian: false, }), channels, done);
    });
  });
  describe('Channel:1 should be success', () => {
    let conf = null, channels = null;
    before(() => {
      conf = { length: 2, numberOfChannels: 1, sampleRate: 12000 };
      channels = [ helper.f32(1.0, 2.0), ];
    });
    it('Little endian', done => {
      shouldSuccess(conf, new Encoder({ littleEndian: true, }), channels, done);
    });
    it('Big endian', done => {
      shouldSuccess(conf, new Encoder({ littleEndian: false, }), channels, done);
    });
  });
  describe('Channel:2 should be success', () => {
    let conf = null, channels = null;
    before(() => {
      conf = { length: 2, numberOfChannels: 2, sampleRate: 12000, };
      channels = [ helper.f32(1.0, 2.0), helper.f32(3.0, 4.0), ];
    });
    it('Little endian', done => {
      shouldSuccess(conf, new Encoder({ littleEndian: true, }), channels, done);
    });
    it('Big endian', done => {
      shouldSuccess(conf, new Encoder({ littleEndian: false, }), channels, done);
    });
  });
  describe('Channel:3 should be success', () => {
    let conf = null, channels = null;
    before(() => {
      conf = { length: 2, numberOfChannels: 3, sampleRate: 12000, };
      channels = [ helper.f32(1.0, 2.0), helper.f32(3.0, 4.0), helper.f32(5.0, 6.0), ];
    });
    it('Little endian', done => {
      shouldSuccess(conf, new Encoder({ littleEndian: true, }), channels, done);
    });
    it('Big endian', done => {
      shouldSuccess(conf, new Encoder({ littleEndian: false, }), channels, done);
    });
  });
  it('Should be parameter error', (done) => {
    expect(() => encoder.execute(1)).to.throw(InvalidParameterError);
    expect(() => encoder.execute()).to.throw(InvalidParameterError);
    expect(() => encoder.execute(new AudioBuffer(), 2)).to.throw(InvalidParameterError);
    expect(() => encoder.execute(new AudioBuffer(), null)).to.throw(InvalidParameterError);
    done();
  });
  it('Should be invalid buffer error', (done) => {
    let src = helper.audioBuffer({length: 2, numberOfChannels: 3, sampleRate: 12000});
    expect(() => encoder.execute(src, new ArrayBuffer(1))).to.throw(InvalidBufferLengthError);
    expect(() => encoder.execute(src, new ArrayBuffer(10000))).to.throw(InvalidBufferLengthError);
    done();
  });
});