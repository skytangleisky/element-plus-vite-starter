import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inject from '@rollup/plugin-inject'
import { visualizer } from 'rollup-plugin-visualizer'
import { mock } from './packages/plugin-vite-mock'

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const fs = require('fs')

import Unocss from 'unocss/vite'

import vueJsx from "@vitejs/plugin-vue-jsx";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const lifecycle = process.env.npm_lifecycle_event;

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
    __USE_DEVTOOLS__: false,
  },
  resolve: {
    alias: {
      '~/': `${__dirname}/src/`,
      pinia: `${__dirname}/packages/pinia/src/index.ts`,
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    mock(),
    vueJsx(),
    inject({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true,
        }),
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
      ]
    }),
    lifecycle === 'report'? visualizer({ open: true, brotliSize: true, filename: 'report.html' }): null
  ],
  server:{
    https:{
      cert: fs.readFileSync('dev.tanglei.top.pem'),
      key: fs.readFileSync('dev.tanglei.top.key')
    },
    host:'::',
    // open:'http://localhost:5173',
    open:'https://dev.tanglei.top',
    port:5173,
    proxy:{
      // '/guangheng':{
      //   target:'http://tanglei.top:8000',//替换的服务端地址
      //   changeOrigin:true,//开启代理，允许跨域
      //   rewrite:path=>path.replace(/^\/guangheng/,''), // 设置重写的路径
      // },
      '/api':{
        target:'https://main.emgo-tech.com',//替换的服务端地址
        changeOrigin:true,//开启代理，允许跨域
      },
      '/backend':{
        target:'http://websocket.tanglei.top',//替换的服务端地址
        changeOrigin:true,//开启代理，允许跨域
        rewrite:path=>path.replace(/^\/backend/,''), // 设置重写的路径
        ws:true,
      },
      '/tanglei':{
        target:'http://tanglei.top',//替换的服务端地址
        changeOrigin:true,//开启代理，允许跨域
        rewrite:path=>path.replace(/^\/tanglei/,'') // 设置重写的路径
      },
      '/qqAuth':{
        target:'https://graph.qq.com',//替换的服务端地址
        changeOrigin:true,//开启代理，允许跨域
        rewrite:path=>path.replace(/^\/qqAuth/,'') // 设置重写的路径
      },
      '/ArcGIS':{
        target:'https://map.geoq.cn',//替换的服务端地址
        changeOrigin:true,//开启代理，允许跨域
      }
    }
  }
})
