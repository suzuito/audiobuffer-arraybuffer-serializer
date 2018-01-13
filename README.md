audiobuffer-arraybuffer-serializer.md
====

# Development

### Build environment

```bash
npm install
```

### Build distributed javascript file(Run unit test)

```bash
npm run test-report
```

Show coverage report
```bash
npm run test-browser
open ./coverage/lcov-report/index.html
```

|For|Built file|
|---|---|
|node.js|./dist/main.cjs.js|
|browser|./dist/main.iife.js|

### Browser test

```bash
npm run test-report
open test/index.html
```

# Support

|Chrome|Firefox|
