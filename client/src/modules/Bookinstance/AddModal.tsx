import React, {useRef, useEffect} from 'react';
import {useAsync} from 'react-use';
import API from '../../utils/API';
import http from '../../utils/http';
import moment from 'moment';
import {
    Spin,
    Row,
    Col,
    Button,
    Form,
    message,
    Input,
    Select,
    DatePicker
} from 'antd';
import {FormComponentProps} from 'antd/lib/form';

const {Option} = Select;

interface IProps extends FormComponentProps {
    id?: number;
    close?: any;
    dismiss?: any;
}

const statusOptions = [{
    label: '可供借阅',
    value: '可供借阅'
},{
    label: '已借出',
    value: '已借出'
},{
    label: '馆藏维护',
    value: '馆藏维护'
}]

const apiGetBookList = () => {
    return new Promise((resolve, reject) => {
        http
            .get(API.All.book.list())
            .then(resp => {
                const bookOptions = resp.data.book_list.map((bookItem) => {
                    return {
                        label: bookItem.title,
                        value: bookItem._id,
                    }
                })
                resolve(bookOptions);
            })
            .catch(error => {
                message.error(error.message);
                reject(error.message);
            })
    })    
}

const apiGetBookInstance = (id) => {
    if (!id) {
        return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
        http
            .get(API.All.bookinstance.detail(id))
            .then(resp => {
                const result = {
                    book: resp.data.bookinstance.book._id,
                    imprint: resp.data.bookinstance.imprint,
                    status: resp.data.bookinstance.status,
                    due_back: moment(resp.data.bookinstance.due_back)
                }
                resolve(result);
            })
            .catch(error => {
                message.error(error.message);
                reject(error.message);
            })
    })    
}


const BookInstanceModal = (props : IProps) => {
    const cacheState = useAsync<any>(apiGetBookList);
    const bookInstanceState = useAsync<any>(() => apiGetBookInstance(props.id));
    const isSetForm = useRef(false);

    useEffect(() => {
        isSetForm.current = true;
        props.form.setFieldsValue(bookInstanceState.value);
    }, [!isSetForm.current, !!bookInstanceState.value])

    const bookOptions = cacheState.value || [];

    const handleSubmit = () => {
        props
            .form
            .validateFields(async (err, values) => {
                if (!err) {
                    try {
                        if (props.id) {
                            await http.post(API.All.bookinstance.update(props.id), values, {
                                useJson: true
                            });
    
                            message.success('修改成功');
                        } else {
                            await http.post(API.All.bookinstance.create(), values, {
                                useJson: true
                            });
    
                            message.success('添加成功');
                        }
                        props.close();
                    } catch (err) {
                        message.error(err.message);
                    }
                }
            });
    }

    return (
        <div>
            <Spin spinning={cacheState.loading}>
                <Form>
                    <Form.Item label="图书名称">
                        {props
                            .form
                            .getFieldDecorator('book', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择图书名称'
                                    }
                                ]
                            })(
                                <Select placeholder="请选择图书名称">
                                    {bookOptions.map((optionItem) => {
                                        return (
                                            <Option value={optionItem.value}>
                                                {optionItem.label}
                                            </Option>
                                        )
                                    })}   
                                </Select>
                            )}
                    </Form.Item>
                    <Form.Item label="出版信息">
                        {props
                            .form
                            .getFieldDecorator('imprint', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入出版信息'
                                    }
                                ]
                            })(<Input/>)}
                    </Form.Item>
   
                    <Form.Item label="图书可借日期">
                        {props
                            .form
                            .getFieldDecorator('due_back', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入图书可借日期'
                                    }
                                ]
                            })(<DatePicker/>)}
                    </Form.Item>


                    <Form.Item label="借阅状态">
                        {props
                            .form
                            .getFieldDecorator('status', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入借阅状态'
                                    }
                                ]
                            })(
                                <Select placeholder="请选择状态">
                                    {
                                        statusOptions.map((optionItem) => {
                                            return (
                                                <Option key={optionItem.value} value={optionItem.value}>
                                                    {optionItem.label}
                                                </Option>
                                            )
                                        })
                                    }
                                </Select>
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
                            marginLeft: '12px'
                        }}>
                            <Button type="primary" onClick={handleSubmit}>
                                确认
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </div>
    );

}

export default Form.create({name: 'bookinstance'})(BookInstanceModal);