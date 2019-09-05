import React, {FC} from 'react';
import {PageHeader, message, Card, Descriptions} from 'antd';
import {RouteComponentProps, Link} from 'react-router-dom';
import {useAsync} from 'react-use';
import API from '../../utils/API';
import http from '../../utils/http';

interface IProps extends RouteComponentProps < any > {
    className?: string;
}

const apiGetBook = (id) => {
    if (!id) {
        return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
        http
            .get(API.All.book.detail(id))
            .then(resp => {
                resolve(resp.data);
            })
            .catch(error => {
                message.error(error.message);
                reject(error.message);
            })
    })
}

const BookDetail : FC < IProps > = props => {

    const bookState = useAsync < any > (() => apiGetBook(props.match.params.id));

    const bookData = bookState.value
        ? bookState.value.book
        : null;
    const instancesData = bookState.value
        ? bookState.value.book_instances
        : [];

    return (
        <div>
            <PageHeader onBack={() => props.history.goBack()} title="图书详情"/>
            <Card loading={bookState.loading}>
                {bookData && <Descriptions column={1} title={bookData.title}>
                    <Descriptions.Item label="作者">{`${bookData.author.family_name}，${bookData.author.first_name}`}</Descriptions.Item>
                    <Descriptions.Item label="简介">{bookData.summary}</Descriptions.Item>
                    <Descriptions.Item label="ISBN">{bookData.isbn}</Descriptions.Item>
                    <Descriptions.Item label="分类">
                        {bookData.genre && bookData
                            .genre
                            .map((genreItem) => {
                                return <Link to={`/genre/${genreItem._id}`}>{genreItem.name}</Link>
                            })
                        }
                    </Descriptions.Item>
                </Descriptions>}

                {instancesData.length > 0 && <hr />}

                {instancesData && instancesData.map((instanceItem, instanceIndex) => {
                    return (
                        <Card style={{
                            marginTop: 20
                        }} type="inner" title={`实例：${instanceIndex + 1}`}>
                            <Descriptions column={1}>
                                <Descriptions.Item label="状态">{instanceItem.status}</Descriptions.Item>
                                <Descriptions.Item label="归还日期">{instanceItem.due_back}</Descriptions.Item>
                                <Descriptions.Item label="出版信息">{instanceItem.imprint}</Descriptions.Item>
                                <Descriptions.Item label="ID"><Link to={`/bookinstance/${instanceItem._id}`}> {instanceItem._id} </Link></Descriptions.Item>
                            </Descriptions>
                        </Card>
                    )
                })}

            </Card>
        </div>
    )
}

export default BookDetail;