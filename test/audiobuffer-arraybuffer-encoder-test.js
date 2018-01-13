'use strict';
const helper = require('./helper');

const sinon = require('sinon');
const expect = require('chai').expect;
const assert = require('chai').assert;

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
  it('Should be parameter error', done => {
    let encoder = new Encoder();
    assert.throws(() => encoder.execute(1), TypeError, `'src' must be instance of AudioBuffer`);
    assert.throws(() => encoder.execute(new AudioBuffer(), 1), TypeError, `'dst' must be instance of ArrayBuffer`);
    done();
  });
  describe('Should be invalid buffer length error', (done) => {
    let conf = null, encoder = null, src = null;
    before(() => {
      conf = {length: 2, numberOfChannels: 3, sampleRate: 12};
      encoder = new Encoder();
      src = helper.audioBuffer(conf);
    });
    it('Too short', done => {
      assert.throws(() => encoder.execute(src, new ArrayBuffer(1)), InvalidBufferLengthError, `Expected buffer length is '40' but real is '1'`);
      done();
    });
    it('Too large', done => {
      assert.throws(() => encoder.execute(src, new ArrayBuffer(1000)), InvalidBufferLengthError, `Expected buffer length is '40' but real is '1000'`);
      done();
    });
  });
});