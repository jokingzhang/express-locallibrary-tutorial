import React, { useRef, useEffect } from "react";
import { useAsync } from "react-use";
import API from "../../utils/API";
import http from "../../utils/http";
import { Spin, Row, Col, Button, Form, message, Input, Select, Checkbox } from "antd";
import { FormComponentProps } from "antd/lib/form";

const { Option } = Select;

interface IProps extends FormComponentProps {
  id?: number;
  close?: any;
  dismiss?: any;
}

const apiGetAuthors = new Promise((resolve, reject) => {
  http
    .get(API.All.author.list())
    .then(resp => {
      const options = resp.data.author_list
        ? resp.data.author_list.map(authorItem => {
            return { label: `${authorItem.family_name}，${authorItem.first_name}`, value: authorItem._id };
          })
        : [];

      resolve(options);
    })
    .catch(error => {
      // message.error(error.message);
      reject(error.message);
    });
});

const apiGetGenres = new Promise((resolve, reject) => {
  http
    .get(API.All.genre.list())
    .then(resp => {
      resolve(resp.data.genre_list || []);
    })
    .catch(error => {
      // message.error(error.message);
      reject(error.message);
    });
});

const apiGetCache = () => Promise.all([apiGetAuthors, apiGetGenres]);

const apiGetBook = id => {
  if (!id) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    http
      .get(API.All.book.detail(id))
      .then(resp => {
        const bookData = {
          ...resp.data.book,
          author: resp.data.book.author._id,
          genre: resp.data.book.genre.map(genreItem => {
            return genreItem._id;
          })
        };
        resolve(bookData);
      })
      .catch(error => {
        message.error(error.message);
        reject(error.message);
      });
  });
};

const BookModal = (props: IProps) => {
  const cacheState = useAsync<any>(apiGetCache);
  const bookState = useAsync<any>(() => apiGetBook(props.id));
  const isSetForm = useRef(false);

  useEffect(() => {
    isSetForm.current = true;
    props.form.setFieldsValue(bookState.value);
  }, [!isSetForm.current, !!bookState.value]);

  const authorOptions = cacheState.value ? cacheState.value[0] : [];
  const genreGroups = cacheState.value ? cacheState.value[1] : [];

  const handleSubmit = () => {
    props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          if (props.id) {
            await http.post(API.All.book.update(props.id), values, {
              useJson: true
            });

            message.success("修改成功");
          } else {
            await http.post(API.All.book.create(), values, {
              useJson: true
            });

            message.success("添加成功");
          }
          props.close();
        } catch (err) {
          message.error(err.message);
        }
      }
    });
  };

  return (
    <div>
      <Spin spinning={cacheState.loading}>
        <Form>
          <Form.Item label="标题">
            {props.form.getFieldDecorator("title", {
              rules: [
                {
                  required: true,
                  message: "请输入标题"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="作者">
            {props.form.getFieldDecorator("author", {
              rules: [
                {
                  required: true,
                  message: "请选择作者"
                }
              ]
            })(
              <Select placeholder="请选择作者">
                {authorOptions.map(optionItem => {
                  return <Option value={optionItem.value}>{optionItem.label}</Option>;
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="简介">
            {props.form.getFieldDecorator("summary", {
              rules: [
                {
                  required: true,
                  message: "请输入简介"
                }
              ]
            })(<Input.TextArea />)}
          </Form.Item>
          <Form.Item label="ISBN">
            {props.form.getFieldDecorator("isbn", {
              rules: [
                {
                  required: true,
                  message: "请输入ISBN"
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="分类">
            {props.form.getFieldDecorator("genre", {
              rules: [
                {
                  required: true,
                  message: "请输入分类"
                }
              ]
            })(
              <Checkbox.Group>
                {genreGroups.map(genreItem => {
                  return <Checkbox value={genreItem._id}>{genreItem.name}</Checkbox>;
                })}
              </Checkbox.Group>
            )}
          </Form.Item>
          <Row type="flex" justify="end">
            <Col>
              <Button type="danger" onClick={() => props.dismiss()}>
                取消
              </Button>
            </Col>
            <Col
              style={{
                marginLeft: "12px"
              }}
            >
              <Button type="primary" onClick={handleSubmit}>
                确认
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </div>
  );
};

export default Form.create({ name: "book" })(BookModal);
