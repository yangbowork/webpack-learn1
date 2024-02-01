# 1.模块Id和代码块Id的区别

- 模块ID moduleId 相对于根目录的相对路径
 title.js
 绝对路径 c:/Users/ctzduser41/Desktop/learn-webpack/lesson33/src/title.js
 根目录 c:/Users/ctzduser41/Desktop/learn-webpack/lesson33/
 此模块的绝ui路径相对于根目录的相对路径 ./src/title.js 就是模块ID
- 代码块ID chunkId
 import('./title.js');
 分割出一个代码块，代码块名字 ./src/title.js => src_title_js
