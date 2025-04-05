import path from 'path';
import { fileURLToPath } from 'url';
import { UserscriptPlugin } from 'webpack-userscript';
// import JavaScriptObfuscator from 'webpack-obfuscator';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jiaohu.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname,'src')
    }),
    // new JavaScriptObfuscator({
    //   rotateStringArray: true,
    //   stringArray: true,
    //   stringArrayEncoding: ['rc4', 'base64'],
    //   stringArrayThreshold: 1,
    //   deadCodeInjection: true,
    //   deadCodeInjectionThreshold: 0.4,
    //   unicodeEscapeSequence: false,
    //   debugProtection: true,
    //   selfDefending: true,
    //   disableConsoleOutput: true,
    //   identifierNamesGenerator: 'hexadecimal',
    //   renameGlobals: false,
    //   transformObjectKeys: true,
    //   controlFlowFlattening: true,
    //   controlFlowFlatteningThreshold: 0.7,
    //   splitStrings: true,
    //   splitStringsChunkLength: 5
    // }),
    new UserscriptPlugin({
      headers: {
        name: '清华社英语一键填写答案',
        version: '2.0.0',
        description: '利用清华社英语提供的答案，进行一键填写。',
        license: 'GPL-3.0-only',
        author: 'qingyexicheng',
        namespace: 'https://qingyexicheng.top',
        match: ['https://www.tsinghuaelt.com/*'],
        grant: ['unsafeWindow'],
        'run-at': 'document-start',
        require: [
          'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.runtime.global.prod.min.js'
        ],
      }
    })
  ],
  mode: 'production',
  externals: {
    vue: 'Vue',

  },
  optimization: {
    minimize: false
  }
};
