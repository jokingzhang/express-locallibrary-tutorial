# 前言

从事前端的工作已经一年半了，平时的工作主要使用 `React` 写写前端组件，但是自己却不具备独立部署上线网站的能力。
就找了一篇靠谱的 [Express Web Framework (Node.js/JavaScript)](https://developer.mozilla.org/zh-CN/docs/Learn/Server-side/Express_Nodejs) 教程，
将它改写为前后端分离，前端使用 React + Antd 实现，最后部署上线。

# 功能

就是上面 Demo 中的内容

- [x] 登录功能 (admin|password)
- [x] 首页
- [x] 书籍 CRUD
- [x] 作者 CRUD
- [x] 分类 CRUD
- [x] 书籍实例 CRUD

# 项目结构

```
├── api                 - 后端代码目录
│   ├── config          - 数据库配置目录
│   ├── controllers     - 业务逻辑，包含模板渲染业务逻辑，以及API改写之后的业务逻辑
│   ├── models          - 数据库模型目录
│   ├── routes          - 路由目录
│   └── views           - 渲染模板逻辑
├── client              - 前端代码目录
│   ├── src
│   │   ├── store       - 存放 Context API，全局共享数据
|   │   ├── modules     - 业务组件目录
|   │   ├── components  - 公共组件目录
|   │   └── utils       - 工具类方法函数目录
```

# 项目启动

```
// api
cd api
// 安装依赖
npm install
// 启动
npm start
// 线上 推荐使用 pm2 来管理进程
pm2 start ./bin/www

// client
cd client
// 安装依赖
npm install
// 启动
npm start
// 构建
npm run build
```

# 项目中常见问题

## api

这部分功能在实现的时候主要参考教程实现，把 `res.render` 函数换成 `RESTful API` 即可

### 跨域

在 `api/app.js` 中添加如下代码即可

```
var cors = require("cors");
...
app.use(cors());
```

推荐阅读：
[【译】如何连接 React 和 Node，Express](https://segmentfault.com/a/1190000019759418#articleHeader5)
[【译】你应该了解的 CORS](https://segmentfault.com/a/1190000019824580)

### 连接数据库

本示例中采用的是`MongoDB`，访问 [MongoDB atlas](https://www.mongodb.com/cloud/atlas) ，会为我们提供一个免费的 `500MB` 的 `MongoDB` 云端数据库。
这样在使用，部署的时候会比较方便。具体操作可以参考：
[【译】使用 MongoDB，React，Node 和 Express（MERN）构建一个全栈应用](https://segmentfault.com/a/1190000020086440#articleHeader1)

## client

这部分功能基于 `creat-react-app` + `antd` + `ts` + `use-hooks` 来实现的

### API 请求

- 「axios 封装」这部分代码主要参考之前公司的实现，在拦截器中增加了一些超时的处理，以及 `post` 请求数据格式的处理，这部分还有待改进，主要是对 `Error` 的补充处理。
- 「api 管理」通过 `process.env.NODE_ENV` 来区分测试，线上环境
- 「业务模块引用」代码采用 `hooks` 实现，需要将一个 `promise` 对象传递到 `useAsync` 来实现。

## 部署 Nginx

我是采用不同子域名的方式部署前后端的，也可以采用不同 host 来部署。

```
    server {
        listen       80;
        server_name  api.jokingzhang.com;
        # root         /usr/share/nginix/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        # 主API
        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_pass http://<your-host>:4001/;
        }

        # 主API
        location /demo-library/ {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_pass http://<your-host>:5001/;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

    server {
        listen       80;
        server_name  demo-library.jokingzhang.com;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;
        # index index.html index.htim;

        location / {
                root /develop/express-locallibrary-tutorial/client/build;
                index index.html;
                try_files $uri $uri/ @router;
                autoindex on;
        }

        location @router{
            rewrite ^.*$ /index.html last;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```
