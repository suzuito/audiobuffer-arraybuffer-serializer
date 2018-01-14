export default {
  input: 'src/audiobuffer-arraybuffer-serializer.js',
  output: [
    {
      file: 'main.js',
      format: 'cjs',
    },
    {
      file: 'aas.js',
      format: 'iife',
      name: 'aas',
    }
  ]
}