import React, {FC} from 'react';
import {useAsync} from 'react-use';
import {Spin, message} from 'antd';
import API from '../../utils/API';
import http from '../../utils/http';

interface IProps {
    className?: string;
}

const apiGetList = () => new Promise((resolve, reject) => {
    http
        .get(API.All.home.getList())
        .then(resp => {
            resolve(resp.data);
        })
        .catch(error => {
            message.error(error.message);
            reject(error.message);
        });
});

const Home: FC <IProps> = props => {
    const {loading, value, error} = useAsync < any > (apiGetList);

    return (
        <div>
            <h1>图书馆首页</h1>
            <p>欢迎来到图书馆！</p>
            <h2>动态信息</h2>
            <Spin spinning={loading}>
                {value && <ul>
                    <li>
                        <b>图书：</b>
                        {value.book_count}
                    </li>
                    <li>
                        <b>图书实例：</b>
                        {value.book_instance_count}
                    </li>
                    <li>
                        <b>可借阅图书实例：</b>
                        {value.book_instance_available_count}
                    </li>
                    <li>
                        <b>作者：</b>
                        {value.author_count}
                    </li>
                    <li>
                        <b>图书分类：</b>
                        {value.genre_count}
                    </li>
                </ul>
}
            </Spin>
        </div>
    )
}

export default Home;