import React, {useRef, useEffect} from 'react';
import {useAsync} from 'react-use';
import API from '../../utils/API';
import http from '../../utils/http';
import moment from 'moment';
import {
    Row,
    Col,
    Button,
    Form,
    message,
    Input,
    DatePicker
} from 'antd';
import {FormComponentProps} from 'antd/lib/form';

interface IProps extends FormComponentProps {
    id?: number;
    close?: any;
    dismiss?: any;
}

const apiGetAuthor = (id) => {
    if (!id) {
        return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
        http
            .get(API.All.author.detail(id))
            .then(resp => {
                resolve({
                    first_name: resp.data.author.first_name,
                    family_name: resp.data.author.family_name,
                    date_of_birth: moment(resp.data.author.date_of_birth),
                    date_of_death: moment(resp.data.author.date_of_death),
                });
            })
            .catch(error => {
                message.error(error.message);
                reject(error.message);
            })
    })
}

const AuthorModal = (props : IProps) => {
    const authorState = useAsync < any > (() => apiGetAuthor(props.id));
    const isSetForm = useRef(false);

    useEffect(() => {
        isSetForm.current = true;
        props
            .form
            .setFieldsValue(authorState.value);
    }, [
        !isSetForm.current,
        !!authorState.value
    ])

    const handleSubmit = () => {
        props
            .form
            .validateFields(async(err, values) => {
                if (!err) {
                    try {
                        if (props.id) {
                            await http.post(API.All.author.update(props.id), values, {useJson: true});

                            message.success('修改成功');
                        } else {
                            await http.post(API.All.author.create(), values, {useJson: true});

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
            <Form>
                <Form.Item label="姓的拼音">
                    {props
                        .form
                        .getFieldDecorator('first_name', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入姓的拼音'
                                }
                            ]
                        })(<Input/>)}
                </Form.Item>
                <Form.Item label="姓的拼音">
                    {props
                        .form
                        .getFieldDecorator('family_name', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入姓的拼音'
                                }
                            ]
                        })(<Input/>)}
                </Form.Item>
                <Form.Item label="出生日期">
                    {props
                        .form
                        .getFieldDecorator('date_of_birth', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入出生日期'
                                }
                            ]
                        })(<DatePicker/>)}
                </Form.Item>
                <Form.Item label="死亡日期">
                    {props
                        .form
                        .getFieldDecorator('date_of_death', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入死亡日期'
                                }
                            ]
                        })(<DatePicker/>)}
                </Form.Item>
                <Row type="flex" justify="end">
                    <Col>
                        <Button type="danger" onClick={() => props.dismiss()}>
                            取消
                        </Button>
                    </Col>
                    <Col style={{
                        marginLeft: '12px'
                    }}>
                        <Button type="primary" onClick={handleSubmit}>
                            确认
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );

}

export default Form.create({name: 'author'})(AuthorModal);