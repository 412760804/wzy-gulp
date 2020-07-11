# 基于gulp的一款Html 工程化包

- 安装后可按照需求定义文件结构

```
// pages.config.js
module.exports = {
  build: {
    src: 'src',
    dist: 'dist',
    temp: '.tmp',
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
```
- 静态资源打包需要添加userref注释
```
<!-- build:css css/combined.css -->
  <link rel="stylesheet" href="s1.css">
  <link rel="stylesheet" href="s2.css">
<!-- endbuild -->

<!-- build:js scripts/combined.js -->
  <script type="text/javascript" src="scripts/one.js"></script>
  <script type="text/javascript" src="scripts/two.js"></script>
<!-- endbuild -->
```
- 运行方式
```
// package.json
 "scripts": {
    "clean": "wzy-gulp clean",
    "build": "wzy-gulp build",
    "start": "wzy-gulp develop"
  }
```

