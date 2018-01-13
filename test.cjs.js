const AudioBuffer = require('audio-buffer');
const Encoder = require('./main').Encoder;

function printf64(f64, offset) {
  for (let i = offset; i < f64.length; i += 1) {
    console.log(`${i}:${f64[i]}`);
  }
}

let audioBuffer = new AudioBuffer({
  length: 2,
  numberOfChannels: 2,
  sampleRate: 12000,
});
let ch1 = new Float32Array(2),
    ch2 = new Float32Array(2)
;
console.log(`AudioBuffer.length: ${audioBuffer.length}`);
ch1[0] = 1.0;
ch1[1] = 2.0;
ch2[0] = 3.0;
ch2[1] = 4.0;
audioBuffer.copyToChannel(ch1, 0, 0);
audioBuffer.copyToChannel(ch2, 1, 0);

let arrayBuffer = new ArrayBuffer(
  16 +
  (4 * audioBuffer.length * audioBuffer.numberOfChannels)
);
let encoder = new Encoder();
encoder.encode(
  audioBuffer,
  arrayBuffer
);

let dv = new DataView(arrayBuffer);
console.log(`0:${dv.getFloat32(0, true)}`);
console.log(`4:${dv.getFloat32(4, true)}`);
console.log(`8:${dv.getUint32(8, true)}`);
console.log(`12:${dv.getUint32(12, true)}`);
console.log('----');
for (let i = 16; i < dv.byteLength; i += 1) {
  console.log(`${i}:${dv.getUint8(i).toString(16)}`);
}
console.log('----');
for (let i = 16; i < dv.byteLength; i += 4) {
  console.log(`${i}:${dv.getFloat32(i, true)}`);
}