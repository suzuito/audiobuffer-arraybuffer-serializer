'use strict';
const helper = require('./helper');

const sinon = require('sinon');
const expect = require('chai').expect;

const AudioBuffer = require('audio-buffer');
const Decoder = require('../dist/main.cjs').Decoder;

const InvalidParameterError = require('../dist/main.cjs').InvalidParameterError;
const InvalidBufferLengthError = require('../dist/main.cjs').InvalidBufferLengthError;

function shouldSuccess(conf, decoder, channels, done) {
  let src = helper.arrayBuffer(conf);
  let dv = new DataView(src);
  dv.setFloat32( 0, conf.sampleRate, decoder.littleEndian);
  dv.setFloat32( 4, 0, decoder.littleEndian); // duration
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
      conf = { length: 2, numberOfChannels: 0, sampleRate: 12000, };
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
      conf = { length: 2, numberOfChannels: 1, sampleRate: 12000, };
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
      conf = { length: 2, numberOfChannels: 2, sampleRate: 12000, };
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
  it('Should be parameter error', (done) => {
    let decoder = new Decoder();
    expect(() => decoder.execute(1)).to.throw(InvalidParameterError);
    expect(() => decoder.execute()).to.throw(InvalidParameterError);
    expect(() => decoder.execute(new ArrayBuffer(), 2)).to.throw(InvalidParameterError);
    expect(() => decoder.execute(new ArrayBuffer(), null)).to.throw(InvalidParameterError);
    done();
  });
  it('Should be invalid buffer error', (done) => {
    let decoder = new Decoder();
    let conf = {
      length: 2, numberOfChannels: 3, sampleRate: 12000,
    };
    let src = helper.arrayBuffer(conf);
    expect(() => decoder.execute(src, new AudioBuffer())).to.throw(InvalidBufferLengthError);
    done();
  });
});