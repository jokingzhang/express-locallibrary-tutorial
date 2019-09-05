import React, {useRef, useEffect} from 'react';
import {useAsync} from 'react-use';
import API from '../../utils/API';
import http from '../../utils/http';
import {
    Row,
    Col,
    Button,
    Form,
    message,
    Input
} from 'antd';
import {FormComponentProps} from 'antd/lib/form';

interface IProps extends FormComponentProps {
    id?: number;
    close?: any;
    dismiss?: any;
}

const apiGetGenre = (id) => {
    if (!id) {
        return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
        http
            .get(API.All.genre.detail(id))
            .then(resp => {
                resolve({
                    name: resp.data.genre.name
                });
            })
            .catch(error => {
                message.error(error.message);
                reject(error.message);
            })
    })
}

const GenreModal = (props : IProps) => {
    const genreState = useAsync < any > (() => apiGetGenre(props.id));
    const isSetForm = useRef(false);

    useEffect(() => {
        isSetForm.current = true;
        props
            .form
            .setFieldsValue(genreState.value);
    }, [
        !isSetForm.current,
        !!genreState.value
    ])

    const handleSubmit = () => {
        props
            .form
            .validateFields(async(err, values) => {
                if (!err) {
                    try {
                        if (props.id) {
                            await http.post(API.All.genre.update(props.id), values, {useJson: true});

                            message.success('修改成功');
                        } else {
                            await http.post(API.All.genre.create(), values, {useJson: true});

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
                <Form.Item label="分类名称">
                    {props
                        .form
                        .getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入分类名称'
                                }
                            ]
                        })(<Input/>)}
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

export default Form.create({name: 'genre'})(GenreModal);