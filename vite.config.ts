import { ConfigEnv, UserConfigExport, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import DefineOptions from 'unplugin-vue-define-options/vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import path from 'path'
// SVG
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // 获取各种环境下对应的变量
  const env = loadEnv(mode, process.cwd())
  return {
    base: './',
    plugins: [
      vue(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', '@vueuse/core'],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        // 指定自定义组件位置(默认:src/components)
        dirs: ['src/components', 'src/**/components'],
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
      include: ['element-plus/dist/locale/zh-cn.mjs', 'element-plus/dist/locale/en.mjs'],
    },
    // 代理跨域
    server: {
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
  }
}
