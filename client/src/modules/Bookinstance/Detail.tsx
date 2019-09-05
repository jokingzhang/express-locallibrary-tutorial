import React, {FC} from 'react';
import {PageHeader, message, Card, Descriptions} from 'antd';
import {RouteComponentProps, Link} from 'react-router-dom';
import moment from 'moment';
import {useAsync} from 'react-use';
import API from '../../utils/API';
import http from '../../utils/http';

interface IProps extends RouteComponentProps < any > {
    className?: string;
}

const apiGetDateil = (id) => {
    if (!id) {
        return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
        http
            .get(API.All.bookinstance.detail(id))
            .then(resp => {
                resolve(resp.data.bookinstance);
            })
            .catch(error => {
                message.error(error.message);
                reject(error.message);
            })
    })
}

const BookInstanceDetail : FC < IProps > = props => {
    const bookInstanceState = useAsync < any > (() => apiGetDateil(props.match.params.id));

    console.info(bookInstanceState.value);

    return (
        <div>
            <PageHeader onBack={() => props.history.goBack()} title="实例详情"/>
            <Card loading={bookInstanceState.loading}>
                {bookInstanceState.value &&
                    <Descriptions column={1}>
                        <Descriptions.Item label="ID">{bookInstanceState.value._id}</Descriptions.Item>
                        <Descriptions.Item label="标题">
                            <Link to={`/book/${bookInstanceState.value.book._id}`}>
                                {bookInstanceState.value.book.title}
                            </Link>
                        </Descriptions.Item>
                        <Descriptions.Item label="出版信息">{bookInstanceState.value.imprint}</Descriptions.Item>
                        <Descriptions.Item label="状态">{bookInstanceState.value.status}</Descriptions.Item>
                        <Descriptions.Item label="可借日期">{moment(bookInstanceState.value.due_back).format('YYYY-MM-DD')}</Descriptions.Item>
                    </Descriptions>
                }
            </Card>
        </div>
    )
}

export default BookInstanceDetail;