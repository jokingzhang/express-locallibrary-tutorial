// 文档查看：https://github.com/mzabriskie/axios
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Router } from "react-router-dom";
import { Modal } from "antd";
// import cookies from 'utils/cookie';
import history from "./history";
import qs from "qs";
import { message as AntdMessage } from "antd";
// import * as constants from 'config/constant';

declare module "axios" {
  // tslint:disable-next-line
  interface AxiosRequestConfig {
    useJson?: boolean;
    noToken?: boolean;
    verifytoken?: boolean;
    // 默认支持token过期提醒，如果不需要该功能，则传false值
    expiredWarning?: boolean;
  }

  // tslint:disable-next-line
  interface AxiosResponse {
    [key: string]: any;
  }
}

export default axios;

type ErrorCode = number | string;
type ErrorMsg = string;
interface IError extends Error {
  error_code: ErrorCode;
  error_msg: ErrorMsg;
  response: AxiosResponse;
}

interface IData {
  error_msg?: ErrorMsg;
  error_description?: ErrorMsg;
  error_message?: ErrorMsg;
  message?: ErrorMsg;
  description?: ErrorMsg;
  msg?: ErrorMsg;

  error_code?: ErrorCode;
  code?: ErrorCode;
}

const ERROR_MSG = {
  /* 网络类异常 */
  OFF_LINE: "抱歉，您貌似还没连接到网络，请检查网络连接",
  CANCEL: "抱歉，请求已取消",
  200: "抱歉，请求失败",
  401: "抱歉，您貌似还没有登录",
  403: "抱歉，您没有权限访问该页面",
  413: "抱歉，您上传文件太大",

  404: "抱歉，您访问的接口地址貌似不存在",
  500: "抱歉，当前服务器异常，请稍后再试",
  503: "抱歉，当前服务器异常，请稍后再试"
};

export function dataSerializer(params: object) {
  return qs.stringify(params, {
    arrayFormat: "indices",
    allowDots: true
  });
}

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config.timeout) {
    config.timeout = 60 * 1000;
  }

  // 增加对表单数组提交的支持
  if (!config.useJson && (config.method === "post" || config.method === "put")) {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    config.transformRequest = dataSerializer;
  }

  // 请求添加token头
  if (!config.noToken) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    let data = response.data;
    console.info(response);

    if (data && typeof data === "object") {
      if (data.success === "true") {
        return data;
      }
    }

    return response;
  },
  error => {
    console.info(error);
    if (error.response.status === 401) {
      //place your reentry code

      localStorage.removeItem("token");
      if (history.location.pathname !== "/login") {
        history.push("/login");
      }
      //   return new Promise((resolve, reject) => {
      //     Modal.confirm({
      //       title: "您的登录已失效",
      //       content: "是否立即去登录？",
      //       okText: "去登录",
      //       cancelText: "取消",
      //       onOk(close) {
      //         close();
      //         history.push("/login");
      //       },
      //       onCancel(close) {
      //         close();
      //         reject(error);
      //       }
      //     });
      //   });
    }
    return error;
  }
);
