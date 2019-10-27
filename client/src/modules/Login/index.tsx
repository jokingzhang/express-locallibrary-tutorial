import React, { FC, useContext } from "react";
import { useAsync } from "react-use";
import { Spin, message, Form, Input, Icon, Button } from "antd";
import { RouteComponentProps, Link } from "react-router-dom";
import API from "../../utils/API";
import { AuthContext } from "../../store/Auth";
import http from "../../utils/http";
import { FormComponentProps } from "antd/lib/form";
import "./style.scss";

interface IProps extends FormComponentProps {
  className?: string;
}

// const apiGetList = () =>
//   new Promise((resolve, reject) => {
//     http
//       .get(API.Auth.login())
//       .then(resp => {
//         resolve(resp.data);
//       })
//       .catch(error => {
//         message.error(error.message);
//         reject(error.message);
//       });
//   });

const Login = (props: IProps & RouteComponentProps) => {
  // const {loading, value, error} = useAsync < any > (apiGetList);
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;
  const { dispatch } = React.useContext(AuthContext);

  const handleSubmit = () => {
    props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const resp = await http.post(API.Auth.login(), values, { useJson: true });
          message.success("登录成功");
          dispatch({
            type: "LOGIN",
            payload: {
              user: values.username,
              token: resp.data.token
            }
          });
          props.history.push("/");
        } catch (err) {
          message.error(err.message);
        }
      }
    });
  };

  function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  const usernameError = isFieldTouched("username") && getFieldError("username");
  const passwordError = isFieldTouched("password") && getFieldError("password");

  return (
    <div className="p-login">
      <h1> MDN 本地图书馆网站 </h1>
      <Form className="p-login-form">
        <Form.Item validateStatus={usernameError ? "error" : ""} help={usernameError || ""}>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(<Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Username" />)}
        </Form.Item>
        <Form.Item validateStatus={passwordError ? "error" : ""} help={passwordError || ""}>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            onClick={handleSubmit}
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form.create({ name: "login" })(Login);
