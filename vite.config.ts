import { ConfigEnv, UserConfigExport, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// SVG
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  // 获取各种环境下对应的变量
  const env = loadEnv(mode, process.cwd())
  return {
    base: './',
    plugins: [
      vue(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', '@vueuse/core', 'pinia', 'vue-router'],
        // 自动导入类型定义文件路径
        dts: './auto-imports.d.ts',
      }),
      VueSetupExtend(),
      DefineOptions(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: { alias: { '@': path.resolve('./src') } },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        '@vueuse/core',
        'vue-i18n',
        'element-plus/dist/locale/zh-cn.mjs',
        'element-plus/dist/locale/en.mjs',
        'element-plus/es/components/form/style/css',
        'element-plus/es/components/form-item/style/css',
        'element-plus/es/components/button/style/css',
        'element-plus/es/components/input/style/css',
        'element-plus/es/components/input-number/style/css',
        'element-plus/es/components/switch/style/css',
        'element-plus/es/components/upload/style/css',
        'element-plus/es/components/menu/style/css',
        'element-plus/es/components/col/style/css',
        'element-plus/es/components/icon/style/css',
        'element-plus/es/components/row/style/css',
        'element-plus/es/components/tag/style/css',
        'element-plus/es/components/dialog/style/css',
        'element-plus/es/components/loading/style/css',
        'element-plus/es/components/radio/style/css',
        'element-plus/es/components/radio-group/style/css',
        'element-plus/es/components/popover/style/css',
        'element-plus/es/components/scrollbar/style/css',
        'element-plus/es/components/tooltip/style/css',
        'element-plus/es/components/dropdown/style/css',
        'element-plus/es/components/dropdown-menu/style/css',
        'element-plus/es/components/dropdown-item/style/css',
        'element-plus/es/components/sub-menu/style/css',
        'element-plus/es/components/menu-item/style/css',
        'element-plus/es/components/divider/style/css',
        'element-plus/es/components/card/style/css',
        'element-plus/es/components/link/style/css',
        'element-plus/es/components/breadcrumb/style/css',
        'element-plus/es/components/breadcrumb-item/style/css',
        'element-plus/es/components/table/style/css',
        'element-plus/es/components/tree-select/style/css',
        'element-plus/es/components/table-column/style/css',
        'element-plus/es/components/select/style/css',
        'element-plus/es/components/option/style/css',
        'element-plus/es/components/pagination/style/css',
        'element-plus/es/components/tree/style/css',
        'element-plus/es/components/alert/style/css',
        'element-plus/es/components/radio-button/style/css',
        'element-plus/es/components/checkbox-group/style/css',
        'element-plus/es/components/checkbox/style/css',
        'element-plus/es/components/tabs/style/css',
        'element-plus/es/components/tab-pane/style/css',
        'element-plus/es/components/rate/style/css',
        'element-plus/es/components/date-picker/style/css',
        'element-plus/es/components/notification/style/css',
        'element-plus/es/components/image/style/css',
        'element-plus/es/components/statistic/style/css',
        'element-plus/es/components/watermark/style/css',
        'element-plus/es/components/config-provider/style/css',
        'element-plus/es/components/container/style/css',
        'element-plus/es/components/main/style/css',
        'element-plus/es/components/aside/style/css',
        'element-plus/es/components/header/style/css',
        'element-plus/es/components/autocomplete/style/css',
        'element-plus/es/components/drawer/style/css',
        'element-plus/es/components/color-picker/style/css',
        'element-plus/es/components/cascader/style/css',
        'lodash-es',
        'echarts-liquidfill',
        'echarts',
        'stompjs',
        'nprogress',
        'crypto-js',
        'moment',
        'js-cookie',
        'json-bigint',
        'file-saver',
        'vuedraggable',
      ],
    },
    // 代理跨域
    server: {
      host: '0.0.0.0', // 服务器地址
      port: Number(env.VITE_APP_BASE_PORT), // 服务器端口号
      open: true, // 运行是否自动打开浏览器
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_BASE_SERVER,
          // 需要代理跨域
          changeOrigin: true,
          // 允许websocket代理
          ws: true,
          // 将api替换为空
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
          bypass(req, res, options: any) {
            const proxyURL = options.target + options.rewrite(req.url)
            console.log('proxyURL', proxyURL)
            res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
          },
        },
      },
    },
    build: {
      outDir: 'dist', // 打包输出目录
      chunkSizeWarningLimit: 2000, // 代码分包阈值
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false, // 删除注释
        },
      },
      sourcemap: false, //生产环境一定要关闭，不然打包的产物会很大
      rollupOptions: {
        plugins: [
          // build.rollupOptions.plugins[]
          viteCompression({
            verbose: true, // 是否在控制台中输出压缩结果
            disable: false,
            threshold: 2000, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
            algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
            ext: '.gz',
            deleteOriginFile: true, // 源文件压缩后是否删除
          }),
        ],
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              // 让每个插件都打包成独立的文件
              return 'vendor'
            }
          },
        },
      },
    },
  }
}
