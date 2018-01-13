'use strict';
const helper = require('./helper');

const sinon = require('sinon');
const expect = require('chai').expect;

const AudioBuffer = require('audio-buffer');
const Encoder = require('../dist/main.cjs').Encoder;

const InvalidParameterError = require('../dist/main.cjs').InvalidParameterError;
const InvalidBufferLengthError = require('../dist/main.cjs').InvalidBufferLengthError;

describe('audiobuffer-encoder', () => {
  let encoder = null;
  before((done) => {
    encoder = new Encoder();
    done();
  });
  it('Channel:0 should be success', (done) => {
    let conf = {
      length: 2, numberOfChannels: 0, sampleRate: 12000,
    };
    let src = helper.audioBuffer(conf);
    let dst = encoder.encode(src);
    expect(dst.byteLength).to.equal(
      16 // header len
      + (4 * conf.length * conf.numberOfChannels)
    );
    let dv = helper.dataView(dst);
    expect(dv.getFloat32(0, true), conf.sampleRate);
    // expect(dv.getFloat32(4, true), duration??);
    expect(dv.getUint32(8, true), conf.length);
    expect(dv.getUint32(12, true), conf.numberOfChannels);
    done();
  });
  it('Channel:1 should be success', (done) => {
    let conf = {
      length: 2, numberOfChannels: 1, sampleRate: 12000,
    };
    let src = helper.audioBuffer(conf);
    src.copyToChannel(0, helper.f32([1.0, 2.0]), 0);
    let dst = encoder.encode(src);
    expect(dst.byteLength).to.equal(
      16 // header len
      + (4 * conf.length * conf.numberOfChannels)
    );
    let dv = helper.dataView(dst);
    expect(dv.getFloat32(0, true), conf.sampleRate);
    // expect(dv.getFloat32(4, true), duration??);
    expect(dv.getUint32(8, true), conf.length);
    expect(dv.getUint32(12, true), conf.numberOfChannels);
    expect(dv.getFloat32(16, true), 1.0);
    expect(dv.getFloat32(20, true), 2.0);
    done();
  });
  it('Channel:2 should be success', (done) => {
    let conf = {
      length: 2, numberOfChannels: 2, sampleRate: 12000,
    };
    let src = helper.audioBuffer(conf);
    src.copyToChannel(0, helper.f32([1.0, 2.0]), 0);
    src.copyToChannel(1, helper.f32([3.0, 4.0]), 0);
    let dst = encoder.encode(src);
    expect(dst.byteLength).to.equal(
      16 // header len
      + (4 * conf.length * conf.numberOfChannels)
    );
    let dv = helper.dataView(dst);
    expect(dv.getFloat32(0, true), conf.sampleRate);
    // expect(dv.getFloat32(4, true), duration??);
    expect(dv.getUint32(8, true), conf.length);
    expect(dv.getUint32(12, true), conf.numberOfChannels);
    expect(dv.getFloat32(16, true), 1.0);
    expect(dv.getFloat32(20, true), 2.0);
    expect(dv.getFloat32(24, true), 3.0);
    expect(dv.getFloat32(28, true), 4.0);
    done();
  });
  it('Channel:3 should be success', (done) => {
    let conf = {
      length: 2, numberOfChannels: 3, sampleRate: 12000,
    };
    let src = helper.audioBuffer(conf);
    src.copyToChannel(0, helper.f32([1.0, 2.0]), 0);
    src.copyToChannel(1, helper.f32([3.0, 4.0]), 0);
    src.copyToChannel(1, helper.f32([5.0, 6.0]), 0);
    let dst = encoder.encode(src);
    expect(dst.byteLength).to.equal(
      16 // header len
      + (4 * conf.length * conf.numberOfChannels)
    );
    let dv = helper.dataView(dst);
    expect(dv.getFloat32(0, true), conf.sampleRate);
    // expect(dv.getFloat32(4, true), duration??);
    expect(dv.getUint32(8, true), conf.length);
    expect(dv.getUint32(12, true), conf.numberOfChannels);
    expect(dv.getFloat32(16, true), 1.0);
    expect(dv.getFloat32(20, true), 2.0);
    expect(dv.getFloat32(24, true), 3.0);
    expect(dv.getFloat32(28, true), 4.0);
    expect(dv.getFloat32(32, true), 5.0);
    expect(dv.getFloat32(36, true), 6.0);
    done();
  });
  it('Should be parameter error', (done) => {
    expect(() => encoder.encode(1)).to.throw(InvalidParameterError);
    expect(() => encoder.encode()).to.throw(InvalidParameterError);
    expect(() => encoder.encode(new AudioBuffer(), 2)).to.throw(InvalidParameterError);
    expect(() => encoder.encode(new AudioBuffer(), null)).to.throw(InvalidParameterError);
    done();
  });
  it('Should be invalid buffer error', (done) => {
    let src = helper.audioBuffer({length: 2, numberOfChannels: 3, sampleRate: 12000});
    expect(() => encoder.encode(src, new ArrayBuffer(1))).to.throw(InvalidBufferLengthError);
    expect(() => encoder.encode(src, new ArrayBuffer(10000))).to.throw(InvalidBufferLengthError);
    done();
  });
});