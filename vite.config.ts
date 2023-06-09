import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inject from '@rollup/plugin-inject'
import { visualizer } from 'rollup-plugin-visualizer'

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const pathSrc = path.resolve(__dirname, 'src')
const lifecycle = process.env.npm_lifecycle_event;

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
    },
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
    inject({
      $: "jquery",
      jQuery: "jquery",
      "windows.jQuery": "jquery"
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
    host:'0.0.0.0',
    proxy:{
      '/api':{
        target:'http://websocket.tanglei.top',//替换的服务端地址
        changeOrigin:true,//开启代理，允许跨域
        rewrite:path=>path.replace(/^\/api/,'') // 设置重写的路径
      },
      '/tanglei':{
        target:'http://tanglei.top:5101',//替换的服务端地址
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
