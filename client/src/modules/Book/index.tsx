import React, { FC } from "react";
import { useAsyncRetry } from "react-use";
import { Button, message, Table, Row } from "antd";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import API from "../../utils/API";
import http from "../../utils/http";
import AddModal from "./AddModal";

interface IProps {
  className?: string;
}

const apiGetList = () =>
  new Promise((resolve, reject) => {
    http
      .get(API.All.book.list())
      .then(resp => {
        const bookList =
          resp.data.book_list &&
          resp.data.book_list.map(bookItem => {
            return {
              ...bookItem,
              authorName: `${bookItem.author.family_name}，${bookItem.author.first_name}`
            };
          });

        resolve(bookList);
      })
      .catch(error => {
        // message.error(error.message);
        reject(error.message);
      });
  });

const columns = [
  {
    title: "书名",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "作者",
    dataIndex: "authorName",
    key: "authorName"
  },
  {
    title: "操作",
    dataIndex: "options",
    align: "right" as "right",
    key: "options"
  }
];

const Book: FC<IProps> = props => {
  const { loading, value, error, retry } = useAsyncRetry<any>(apiGetList);

  function handleAdd() {
    Modal.open({
      component: <AddModal />,
      width: 900,
      maskClosable: false,
      footer: null
    }).result.then(() => {
      retry();
    });
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
    });
  }

  const handleDelete = async (record: any) => {
    try {
      await http.post(
        API.All.book.delete(record._id),
        {},
        {
          useJson: true
        }
      );

      message.success("删除成功");
      retry();
    } catch (err) {
      message.error("请先删除所有图书实例");
    }
  };

  function renderColumns() {
    return columns.map(col => {
      if (col.key === "options") {
        return {
          ...col,
          render: (text, record) => {
            return (
              <>
                <Button type="link" onClick={() => handleUpdate(record)}>
                  更新
                </Button>
                <Button type="link" onClick={() => handleDelete(record)}>
                  删除
                </Button>
              </>
            );
          }
        };
      }

      if (col.key === "title") {
        return {
          ...col,
          render: (text, record) => {
            return (
              <>
                <Link to={`/book/${record._id}`}>{text}</Link>
              </>
            );
          }
        };
      }

      return col;
    });
  }

  return (
    <div>
      <h1> 图书列表 </h1>
      <Row type="flex" justify="end">
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          添加图书
        </Button>
      </Row>
      <Table bordered rowKey="_id" columns={renderColumns()} dataSource={value} loading={loading} />
    </div>
  );
};

export default Book;
