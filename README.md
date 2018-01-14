audiobuffer-arraybuffer-serializer
====

[![npm](https://img.shields.io/npm/v/audiobuffer-arraybuffer-serializer.svg?style=social)](https://www.npmjs.com/package/audiobuffer-arraybuffer-serializer)

[![](./img/GitHub-Mark-32px.png)](https://github.com/suzuito/audiobuffer-arraybuffer-serializer)

AudioBuffer serializer.
Provide a serializer between AudioBuffer and ArrayBuffer.

About ArrayBuffer representation of AudioBuffer [see]().

# Installation

### Node.js

```bash
npm install audiobuffer-arraybuffer-serializer
```

```javascript
const Encoder = require('audiobuffer-arraybuffer-serializer').Encoder;
const Decoder = require('audiobuffer-arraybuffer-serializer').Decoder;
```

### Browser

```html
<script src="aas.js"></script>
<script>
  let encoder = new aas.Encoder();
</script>
```

# Usage

[API Reference](https://suzuito.github.io/audiobuffer-arraybuffer-serializer/index.html)

### Classes

- Encoder
  - Serialize [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) to [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).
- Decoder
  - Deserialize [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) to [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer).

### Constructor

Set ```littleEndian``` If you want to use specified byte order
```javascript
// Little endian(default)
let encoder = new Encoder();
let decoder = new Decoder();
// Little endian
let encoder = new Encoder({ littleEndian: true });
let decoder = new Decoder({ littleEndian: true });
// Big endian
let encoder = new Encoder({ littleEndian: false });
let decoder = new Decoder({ littleEndian: false });
```

### Encode/Docode AudioBuffer/ArrayBuffer to ArrayBuffer/AudioBuffer

Simple encode/decode
```javascript
let arrayBuffer = encoder.execute(audioBuffer);
let audioBuffer = decoder.execute(arrayBuffer);
```

Set decoded result into destination buffer.
```javascript
encoder.execute(audioBuffer, arrayBuffer);
decoder.execute(arrayBuffer, audioBuffer);
```

# Examples

# Development

### Build environment

```bash
npm install
```

### Build distributed javascript file(Run unit test)

```bash
npm run test-report-dev
```

Show coverage report
```bash
npm run test-browser-dev
open ./coverage/lcov-report/index.html
```

|For|Built file|
|---|---|
|node.js|./main.js|
|browser|./aas.js|

Version up
```bash
npm version patch
git push origin --tags
```

### Browser test

```bash
npm run test-report-dev
open test/index.html
```

# Supported browser

|Chrome|Firefox|
