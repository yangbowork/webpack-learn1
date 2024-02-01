## 1.命令行和模块内相同配置那个优先级更高（以mode为例子）
- 配置项 一个来自于webpack.config.js的mode，一个来自于命令行的mode
- 因为命令行传参优先级更高，所以mode最终的值就是命令行的mode，然后此mode会传递给模块内

## 2.hooks的触发顺序与什么有关
- 不同hooks，触发的顺序就是hooks触发的顺序
- 同一个hook，就是注册是顺序