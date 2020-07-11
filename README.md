# 基于gulp的一款Html 工程化包

- 安装后可按照需求定义文件结构

```
// pages.config.js
module.exports = {
  build: {
    src: 'src',
    dist: 'release',
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
- 运行方式
```
// package.json
 "scripts": {
    "clean": "wzy-gulp clean",
    "build": "wzy-gulp build",
    "start": "wzy-gulp develop"
  }
```

