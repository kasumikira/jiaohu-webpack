import path from 'path';
import { fileURLToPath } from 'url';
import { UserscriptPlugin } from 'webpack-userscript';
import JavaScriptObfuscator from 'webpack-obfuscator';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jiaohu.js'
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname,'src')
    }),
    new JavaScriptObfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['rc4', 'base64'],
      stringArrayThreshold: 1,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      unicodeEscapeSequence: false,
      debugProtection: true,
      selfDefending: true,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      renameGlobals: false,
      transformObjectKeys: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.7,
      splitStrings: true,
      splitStringsChunkLength: 5
    }),
    new UserscriptPlugin({
      headers: {
        name: '清华社英语一键填写答案',
        namespace: 'https://qingyexicheng.top/',
        version: '1.8.0',
        description: '清华社英语一键填写答案',
        author: 'qingyexicheng',
        match: ['https://www.tsinghuaelt.com/course-study-student/*'],
        icon: 'https://file.qingyexicheng.top/tsinghuaelt-script/faviconV2.png',
        updateURL: 'https://file.qingyexicheng.top/tsinghuaelt-script/script.user.js',
        downloadURL: 'https://file.qingyexicheng.top/tsinghuaelt-script/script.user.js',
        grant: ['unsafeWindow'],
        'run-at': 'document-start',
      }
    })
  ],
  mode: 'production'
};