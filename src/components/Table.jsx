import React, { useEffect, useState } from "react";
import { Table } from "antd";

const TableReUsable = ({ columns, data, totalCount, loading, onTableChange }) => {
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10, // Fixed page size
      total: totalCount || 0,
    },
  });

  useEffect(() => {
    setTableParams(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        total: totalCount || 0,
      },
    }));
  }, [totalCount]);

  const handleTableChange = (pagination, filters, sorter) => {
    const newParams = {
      pagination: {
        ...pagination,
        pageSize: 10, // Always keep page size fixed at 10
      },
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    };
    setTableParams(newParams);
    onTableChange && onTableChange(newParams);
  };

  return (
    <Table
      columns={columns}
      className="table-custom 00000"
      rowKey={(record) => record._id}
      dataSource={data}
      pagination={{
        ...tableParams.pagination,
        showSizeChanger: false, // This hides the page size selector
        pageSizeOptions: [], // This removes page size options
        size: "default",
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default TableReUsable;
