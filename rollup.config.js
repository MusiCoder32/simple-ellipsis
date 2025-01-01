import { uglify } from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss'
export default [
    {
        input: './src/vue/index.js',
        output: [
            {
                file: './dist/vue/index.js', // 输出文件路径
                format: 'es', // 输出格式为 ES 模块
            },
        ],
        plugins: [
            uglify({
                compress: {
                    drop_console: true, //注释console
                    drop_debugger: true, //注释debugger
                    pure_funcs: ['console.log'], //移除console.log
                },
            }),
            postcss({
                inject: true, // 提取 CSS 文件
                minimize: true, // 压缩 CSS 文件
            }),
        ],
    },
    {
        input: './src/react/index.js',
        output: [
            {
                file: './dist/react/index.js', // 输出文件路径
                format: 'es', // 输出格式为 ES 模块
            },
        ],
        plugins: [
            uglify({
                compress: {
                    drop_console: true, //注释console
                    drop_debugger: true, //注释debugger
                    pure_funcs: ['console.log'], //移除console.log
                },
            }),
            postcss({
                inject: true, // 提取 CSS 文件
                minimize: true, // 压缩 CSS 文件
            }),
        ],
    },
]
