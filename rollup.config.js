export default {
  input: 'src/audiobuffer-arraybuffer-serializer.js',
  output: [
    {
      file: 'dist/main.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/main.iife.js',
      format: 'iife',
      name: 'aas',
    }
  ]
}