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
      stringArrayEncoding: ['base64'],
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      unicodeEscapeSequence: false
    }),
    new UserscriptPlugin({
      headers: {
        name: '清华社英语一键填写答案',
        namespace: 'https://qingyexicheng.top/',
        version: '1.6.1',
        description: '清华社英语一键填写答案',
        author: 'qingyexicheng',
        match: ['https://www.tsinghuaelt.com/course-study-student/*'],
        icon: 'https://file.qingyexicheng.top/tsinghuaelt-script/faviconV2.png',
        updateURL: 'https://file.qingyexicheng.top/tsinghuaelt-script/script.user.js',
        downloadURL: 'https://file.qingyexicheng.top/tsinghuaelt-script/script.user.js',
        grant: ['none']
      }
    })
  ],
  mode: 'production'
};