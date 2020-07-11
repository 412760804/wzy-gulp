const { src, dest, series, parallel, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins') // 通过此依赖加载所以安装的依赖

const plugins = loadPlugins() // 输出所有依赖的对象  如果依赖为 gulp-a-b 会自动驼峰命名 plugins.aB

const bs = browserSync.create()

const cwd = process.cwd() // 返回当前命令行的工作目录
let config = {
  // default config
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  }
}

try {
  const loadConfig = require(`${cwd}/pages.config.js`) // 倘若获取不到将报错
  config = Object.assign({}, config, loadConfig)
} catch (e) { }

// 删除temp
const clean = () => {
  return del([config.build.dist, config.build.temp])
}

const style = () => {
  return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src }) // base规范输出路径和输入路径一样 // cwd将与任何相对路径相结合以形成绝对路径的目录。 
    .pipe(plugins.sass({ outputStyle: 'expanded' })) // 代码展开
    .pipe(dest(config.build.temp))
  // .pipe(bs.reload({ stream: true })) // bs.reload:刷新浏览器 用法:watch监听改变后执行当前方法刷新
}


// 脚本编译
const script = () => {
  // 安装@babel/core , @babel/preset-env, @babel/preset-env会将所有es新特性进行转换
  return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')] })) // require()会从当前文件一层层向上找
    .pipe(dest(config.build.temp))
}

// 模板编译
const page = () => {
  // src下任意子目录
  return src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.swig({ data: config.data, defaults: { cache: false } })) // data 模板变量, defaults防止模板缓存导致页面不能及时更新
    .pipe(dest(config.build.temp))
}

const image = () => {
  return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const font = () => {
  return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const extra = () => {
  return src('**', { base: config.build.public, cwd: config.build.public })
    .pipe(dest(config.build.dist))
}

const serve = () => {
  watch(config.build.paths.styles, { cwd: config.build.src }, style)
  watch(config.build.paths.scripts, { cwd: config.build.src }, script)
  watch(config.build.paths.pages, { cwd: config.build.src }, page)

  watch([
    config.build.paths.images,
    config.build.paths.fonts
  ], { cwd: config.build.src }, bs.reload) // 当静态资源更新后刷新浏览器

  watch('**', { cwd: config.build.public }, bs.reload)

  bs.init({
    notify: false, // 关闭右上角启动提示
    port: 2080,// 端口
    // open: false,  // 自动打开浏览器
    files: config.build.temp + '/**', // 监听temp下所有文件热更新
    server: {
      baseDir: [config.build.temp, config.build.src, 'public'], // 运行文件地址
      routes: { // 优先于baseDir运行先走routes配置
        '/node_modules': 'node_modules'
      }
    }
  })
}


const useref = () => {
  return src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.temp })
    .pipe(plugins.useref({ searchPath: [config.build.temp, '.'] }))
    // html js css 判断是否以这三个结尾
    .pipe(plugins.if(/\.js$/, plugins.uglify())) // 压缩js
    .pipe(plugins.if(/\.css$/, plugins.cleanCss())) // 压缩css
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({ // 压缩html
      collapseWhitespace: true, // 压缩html中所有折行
      minifyCSS: true, // 压缩html中所有css
      minifyJS: true // 压缩html中所有js
      // 官网: 删除所有注释...
    })))
    .pipe(dest(config.build.dist))
}

const compile = parallel(style, script, page)

// 上线之前执行的任务
const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra
  )
)


const develop = series(clean, compile, serve)

module.exports = {
  clean,
  build,
  develop
}