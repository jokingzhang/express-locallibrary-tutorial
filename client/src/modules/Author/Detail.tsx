import React, {FC} from 'react';
import {PageHeader, message, Card, Descriptions} from 'antd';
import {RouteComponentProps, Link} from 'react-router-dom';
import {useAsync} from 'react-use';
import moment from 'moment';
import API from '../../utils/API';
import http from '../../utils/http';

interface IProps extends RouteComponentProps < any > {
    className?: string;
}

const apiGetAuthor = (id) => {
    if (!id) {
        return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
        http
            .get(API.All.author.detail(id))
            .then(resp => {
                resolve(resp.data);
            })
            .catch(error => {
                message.error(error.message);
                reject(error.message);
            })
    })
}

const AuthorDetail : FC < IProps > = props => {
    const authorState = useAsync < any > (() => apiGetAuthor(props.match.params.id));

    const authorData = authorState.value
        ? authorState.value.author
        : null;
    const bookData = authorState.value
        ? authorState.value.author_books
        : [];

    return (
        <div>
            <PageHeader onBack={() => props.history.goBack()} title="作者详情"/>
            <Card loading={authorState.loading}>
                {authorData && <Descriptions column={1} title={bookData.title}>
                    <Descriptions.Item label="姓名">{`${authorData.family_name}，${authorData.first_name}`}</Descriptions.Item>
                    <Descriptions.Item label="出生日期">{moment(authorData.date_of_birth).format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label="死亡日期">{moment(authorData.date_of_death).format('YYYY-MM-DD')}</Descriptions.Item>
                </Descriptions>}

                <hr/> 
                
                {bookData && bookData.map((bookItem, bookIndex) => {
                    return (
                        <Card
                            style={{
                            marginTop: 20
                        }}
                            type="inner"
                            title={`图书：${bookIndex + 1}`}>
                            <Descriptions column={1}>
                                <Descriptions.Item label="标题">
                                    <Link to={`/book/${bookItem._id}`}>{bookItem.title}</Link>
                                </Descriptions.Item>
                                <Descriptions.Item label="简介">{bookItem.summary}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    )
                })}
                {bookData.length === 0 && <div>暂无图书</div>}

            </Card>
        </div>
    )
}

export default AuthorDetail;