import React, {FC} from 'react';
import {useAsyncRetry} from 'react-use';
import {Button, message, Table, Row} from 'antd';
import {Link} from 'react-router-dom';
import Modal from '../../components/Modal';
import moment from 'moment';
import API from '../../utils/API';
import http from '../../utils/http';
import AddModal from './AddModal';

interface IProps {
    className?: string;
}

const apiGetList = () => new Promise((resolve, reject) => {
    http
        .get(API.All.author.list())
        .then(resp => {

            const bookList = resp.data.author_list && resp.data.author_list.map((authorItem) => {
                return {
                    ...authorItem,
                    authorName: `${authorItem.family_name}，${authorItem.first_name}`,
                    birth: moment(authorItem.date_of_birth).format('YYYY-MM-DD'),
                    death: moment(authorItem.date_of_death).format('YYYY-MM-DD'),
                }
            })

            resolve(bookList);
        })
        .catch(error => {
            message.error(error.message);
            reject(error.message);
        });
});

const columns = [{
    title: '作者名称',
    dataIndex: 'authorName',
    key: 'authorName'
},{
    title: '出生日期',
    dataIndex: 'birth',
    key: 'birth'
},{
    title: '死亡日期',
    dataIndex: 'death',
    key: 'death'
},{
    title: '操作',
    dataIndex: 'options',
    align: 'right' as 'right',
    key: 'options'
}]

const Author: FC<IProps> = props => {
    const {loading, value, error, retry} = useAsyncRetry<any>(apiGetList);

    function handleAdd() {
        Modal.open({
            component: <AddModal />,
            width: 900,
            maskClosable: false,
            footer: null
        }).result.then(() => {
            retry();
        })
    }

    function handleUpdate(record: any) {
        Modal.open({
            // @ts-ignore
            component: <AddModal id={record._id} />,
            width: 900,
            maskClosable: false,
            footer: null
        }).result.then(() => {
            retry();
        })
    }
    
    const handleDelete = async (record: any) => {
        try {
            await http.post(API.All.author.delete(record._id), {}, {
                useJson: true
            });

            message.success('删除成功');
            retry();
        } catch (err) {
            message.error('请先删除所有作者有关的书籍');
        }
    }

    function renderColumns() {
        return columns.map((col) => {
            if (col.key === 'options') {
                return {
                    ...col,
                    render: (text, record) => {
                        return (
                            <>
                                <Button type="link" onClick={() => handleUpdate(record)}>更新</Button>
                                <Button type="link" onClick={() => handleDelete(record)}>删除</Button>
                            </>
                        )
                    }
                };
            }

            if (col.key === 'authorName') {
                return {
                    ...col,
                    render: (text, record) => {
                        return (
                            <>
                                <Link to={`/author/${record._id}`}>{text}</Link>
                            </>
                        )
                    }
                }
            }

            return col;
        })
    }

    return (
        <div>
            <h1> 作者列表 </h1>
            <Row type="flex" justify="end">
                <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    添加作者
                </Button>
            </Row>
            <Table
                bordered
                rowKey="_id"
                columns={renderColumns()}
                dataSource={value}
                loading={loading}
            />
        </div>
    )
}

export default Author;