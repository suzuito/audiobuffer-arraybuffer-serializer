'use strict';
const helper = require('./helper');

const sinon = require('sinon');
const expect = require('chai').expect;
const assert = require('chai').assert;

const AudioBuffer = require('audio-buffer');
const Decoder = require('../dist/main.cjs').Decoder;

const InvalidParameterError = require('../dist/main.cjs').InvalidParameterError;
const InvalidAudioBufferLengthError = require('../dist/main.cjs').InvalidAudioBufferLengthError;
const InvalidSampleRateError = require('../dist/main.cjs').InvalidSampleRateError;
const InvalidNumberOfChannelsError = require('../dist/main.cjs').InvalidNumberOfChannelsError;

function shouldSuccess(conf, decoder, channels, done) {
  let src = helper.arrayBuffer(conf);
  let dv = new DataView(src);
  dv.setFloat32( 0, conf.sampleRate, decoder.littleEndian);
  dv.setFloat32( 4, conf.length / conf.sampleRate, decoder.littleEndian); // duration
  dv.setUint32 ( 8, conf.length, decoder.littleEndian);
  dv.setUint32 (12, conf.numberOfChannels, decoder.littleEndian);
  for (let c = 0; c < channels.length; c++) {
    for (let i = 0; i < channels[c].length; i++) {
      dv.setFloat32(16 + (c * conf.length) + (i * 4), channels[c][i], decoder.littleEndian);
    }
  }
  let dst = decoder.execute(src);
  expect(dst.length).to.equal(conf.length);
  expect(dst.numberOfChannels).to.equal(conf.numberOfChannels);
  expect(dst.sampleRate).to.equal(conf.sampleRate);
  // expect(dst.duration).to.equal(conf.duration);
  for (let c = 0; c < channels.length; c++) {
    let ch = dst.getChannelData(0);
    for (let i = 0; i < channels[c].length; i++) {
      dv.setFloat32(16 + (c * conf.length) + (i * 4), channels[c][i], decoder.littleEndian);
      expect(ch[i], channels[c][i]);
    }
  }
  done();
}

describe('audiobuffer-decoder', () => {
  describe('Channel:0 should be success', () => {
    let conf = null, channels = null;
    before(() => {
      conf = { length: 2, numberOfChannels: 0, sampleRate: 12, };
      channels = [];
    });
    it('Little endian', done => {
      shouldSuccess(conf, new Decoder({ littleEndian: true, }), channels, done);
    });
    it('Big endian', done => {
      shouldSuccess(conf, new Decoder({ littleEndian: false, }), channels, done);
    });
  });
  describe('Channel:1 should be success', () => {
    let conf = null, channels = null;
    before(() => {
      conf = { length: 2, numberOfChannels: 1, sampleRate: 12, };
      channels = [ helper.f32(1.0, 2.0), ];
    });
    it('Little endian', done => {
      shouldSuccess(conf, new Decoder({ littleEndian: true, }), channels, done);
    });
    it('Big endian', done => {
      shouldSuccess(conf, new Decoder({ littleEndian: false, }), channels, done);
    });
  });
  describe('Channel:2 should be success', () => {
    let conf = null, channels = null;
    before(() => {
      conf = { length: 2, numberOfChannels: 2, sampleRate: 12, };
      channels = [ helper.f32(1.0, 2.0), helper.f32(3.0, 4.0), ];
    });
    it('Little endian', done => {
      shouldSuccess(conf, new Decoder({ littleEndian: true, }), channels, done);
    });
    it('Big endian', done => {
      shouldSuccess(conf, new Decoder({ littleEndian: false, }), channels, done);
    });
  });
  describe('Channel:3 should be success', () => {
    let conf = null, channels = null;
    before(() => {
      conf = { length: 2, numberOfChannels: 3, sampleRate: 12000, };
      channels = [ helper.f32(1.0, 2.0), helper.f32(3.0, 4.0), helper.f32(5.0, 6.0), ];
    });
    it('Little endian', done => {
      shouldSuccess(conf, new Decoder({ littleEndian: true, }), channels, done);
    });
    it('Big endian', done => {
      shouldSuccess(conf, new Decoder({ littleEndian: false, }), channels, done);
    });
  });
  it('Should be parameter error', done => {
    let decoder = new Decoder();
    assert.throws(() => decoder.execute(1), TypeError, `'src' must be instance of ArrayBuffer`);
    assert.throws(() => decoder.execute(new ArrayBuffer(), 1), TypeError, `'dst' must be instance of AudioBuffer`);
    done();
  });
  describe('Should be invalid error', () => {
    let decoder = null, src = null;
    before(() => {
      decoder = new Decoder({littleEndian: true});
      src = helper.arrayBuffer({length: 5, numberOfChannels: 3, sampleRate: 12000});
      let dv = new DataView(src);
      dv.setFloat32(0, 12000, true);
      dv.setUint32(8, 5, true);
      dv.setUint32(12, 3, true);
    });
    it('Too short buffer length', done => {
      let dst = new AudioBuffer({length: 3, numberOfChannels: 3, sampleRate: 12000});
      assert.throws(() => decoder.execute(src, dst), InvalidAudioBufferLengthError, `Expected audio buffer length is '5' but real is '3'`);
      done();
    });
    it('Too long buffer length', done => {
      let dst = new AudioBuffer({length: 300, numberOfChannels: 3, sampleRate: 12000});
      assert.throws(() => decoder.execute(src, dst), InvalidAudioBufferLengthError, `Expected audio buffer length is '5' but real is '300'`);
      done();
    });
    it('Different sampleRate', done => {
      let dst = new AudioBuffer({length: 5, numberOfChannels: 3, sampleRate: 3});
      assert.throws(() => decoder.execute(src, dst), InvalidSampleRateError, `Expected audio buffer sampleRate is '12000' but real is '3'`);
      done();
    });
    it('Different numberOfChannels', done => {
      let dst = new AudioBuffer({length: 5, numberOfChannels: 1, sampleRate: 12000});
      assert.throws(() => decoder.execute(src, dst), InvalidNumberOfChannelsError, `Expected audio buffer numberOfChannels is '3' but real is '1'`);
      done();
    });
  });
});