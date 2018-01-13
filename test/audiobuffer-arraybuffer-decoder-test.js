'use strict';
const helper = require('./helper');

const sinon = require('sinon');
const expect = require('chai').expect;

const AudioBuffer = require('audio-buffer');
const Decoder = require('../dist/main.cjs').Decoder;

const InvalidParameterError = require('../dist/main.cjs').InvalidParameterError;
const InvalidBufferLengthError = require('../dist/main.cjs').InvalidBufferLengthError;

describe('audiobuffer-decoder', () => {
  let decoder = null;
  before((done) => {
    decoder = new Decoder();
    done();
  });
  it('Channel:0 should be success', (done) => {
    let conf = {
      length: 2, numberOfChannels: 0, sampleRate: 12000,
    };
    let src = helper.arrayBuffer(conf);
    let dv = new DataView(src);
    dv.setFloat32( 0, conf.sampleRate, true);
    dv.setFloat32( 4, 0, true); // duration
    dv.setUint32 ( 8, conf.length, true);
    dv.setUint32 (12, conf.numberOfChannels, true);
    let dst = decoder.decode(src);
    expect(dst.length).to.equal(conf.length);
    expect(dst.numberOfChannels).to.equal(conf.numberOfChannels);
    expect(dst.sampleRate).to.equal(conf.sampleRate);
    // expect(dst.duration).to.equal(conf.duration);
    done();
  });
  it('Channel:1 should be success', (done) => {
    let conf = {
      length: 2, numberOfChannels: 1, sampleRate: 12000,
    };
    let src = helper.arrayBuffer(conf);
    let dv = new DataView(src);
    dv.setFloat32( 0, conf.sampleRate, true);
    dv.setFloat32( 4, 0, true); // duration
    dv.setUint32 ( 8, conf.length, true);
    dv.setUint32 (12, conf.numberOfChannels, true);
    dv.setFloat32(16, 1.0, true);
    dv.setFloat32(20, 2.0, true);
    let dst = decoder.decode(src);
    expect(dst.length).to.equal(conf.length);
    expect(dst.numberOfChannels).to.equal(conf.numberOfChannels);
    expect(dst.sampleRate).to.equal(conf.sampleRate);
    // expect(dst.duration).to.equal(conf.duration);
    let ch = dst.getChannelData(0);
    expect(ch[0], 1.0);
    expect(ch[1], 2.0);
    done();
  });
  it('Channel:2 should be success', (done) => {
    let conf = {
      length: 2, numberOfChannels: 2, sampleRate: 12000,
    };
    let src = helper.arrayBuffer(conf);
    let dv = new DataView(src);
    dv.setFloat32( 0, conf.sampleRate, true);
    dv.setFloat32( 4, 0, true); // duration
    dv.setUint32 ( 8, conf.length, true);
    dv.setUint32 (12, conf.numberOfChannels, true);
    dv.setFloat32(16, 1.0, true);
    dv.setFloat32(20, 2.0, true);
    dv.setFloat32(24, 3.0, true);
    dv.setFloat32(28, 4.0, true);
    let dst = decoder.decode(src);
    expect(dst.length).to.equal(conf.length);
    expect(dst.numberOfChannels).to.equal(conf.numberOfChannels);
    expect(dst.sampleRate).to.equal(conf.sampleRate);
    // expect(dst.duration).to.equal(conf.duration);
    let ch = dst.getChannelData(0);
    expect(ch[0], 1.0);
    expect(ch[1], 2.0);
    ch = dst.getChannelData(1);
    expect(ch[0], 3.0);
    expect(ch[1], 4.0);
    done();
  });
  it('Channel:3 should be success', (done) => {
    let conf = {
      length: 2, numberOfChannels: 3, sampleRate: 12000,
    };
    let src = helper.arrayBuffer(conf);
    let dv = new DataView(src);
    dv.setFloat32( 0, conf.sampleRate, true);
    dv.setFloat32( 4, 0, true); // duration
    dv.setUint32 ( 8, conf.length, true);
    dv.setUint32 (12, conf.numberOfChannels, true);
    dv.setFloat32(16, 1.0, true);
    dv.setFloat32(20, 2.0, true);
    dv.setFloat32(24, 3.0, true);
    dv.setFloat32(28, 4.0, true);
    dv.setFloat32(32, 5.0, true);
    dv.setFloat32(36, 6.0, true);
    let dst = decoder.decode(src);
    expect(dst.length).to.equal(conf.length);
    expect(dst.numberOfChannels).to.equal(conf.numberOfChannels);
    expect(dst.sampleRate).to.equal(conf.sampleRate);
    // expect(dst.duration).to.equal(conf.duration);
    let ch = dst.getChannelData(0);
    expect(ch[0], 1.0);
    expect(ch[1], 2.0);
    ch = dst.getChannelData(1);
    expect(ch[0], 3.0);
    expect(ch[1], 4.0);
    ch = dst.getChannelData(2);
    expect(ch[1], 5.0);
    expect(ch[1], 6.0);
    done();
  });
  it('Should be parameter error', (done) => {
    expect(() => decoder.decode(1)).to.throw(InvalidParameterError);
    expect(() => decoder.decode()).to.throw(InvalidParameterError);
    expect(() => decoder.decode(new ArrayBuffer(), 2)).to.throw(InvalidParameterError);
    expect(() => decoder.decode(new ArrayBuffer(), null)).to.throw(InvalidParameterError);
    done();
  });
  it('Should be invalid buffer error', (done) => {
    let conf = {
      length: 2, numberOfChannels: 3, sampleRate: 12000,
    };
    let src = helper.arrayBuffer(conf);
    expect(() => decoder.decode(src, new AudioBuffer())).to.throw(InvalidBufferLengthError);
    done();
  });
});