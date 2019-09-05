import React, {FC} from 'react';
import {PageHeader, message, Card, Descriptions, Spin} from 'antd';
import {RouteComponentProps, Link} from 'react-router-dom';
import {useAsync} from 'react-use';
import API from '../../utils/API';
import http from '../../utils/http';

interface IProps extends RouteComponentProps < any > {
    className?: string;
}

const apiGetGenre = (id) => {
    if (!id) {
        return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
        http
            .get(API.All.genre.detail(id))
            .then(resp => {
                resolve(resp.data);
            })
            .catch(error => {
                message.error(error.message);
                reject(error.message);
            })
    })
}

const GenreDetail : FC < IProps > = props => {
    const genreState = useAsync < any > (() => apiGetGenre(props.match.params.id));
    const genreData = genreState.value
        ? genreState.value.genre
        : {};
    const bookData = genreState.value
        ? genreState.value.genre_books
        : [];

    return (
        <div>
            <PageHeader onBack={() => props.history.goBack()} title="分类详情"/>

            <Spin spinning={genreState.loading}>
                <h1>
                    分类名称：{genreData.name}
                </h1>
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
            </Spin>

        </div>
    )
}

export default GenreDetail;