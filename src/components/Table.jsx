import React, { useEffect, useState } from "react";
import { Table } from "antd";

const TableReUsable = ({
  columns,
  data,
  totalCount,
  loading,
  onTableChange,
  tableParams,
}) => {
  const handleTableChange = (pagination, filters, sorter) => {
    const newParams = {
      pagination: {
        ...pagination,
        pageSize: 10,
      },
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    };
    onTableChange && onTableChange(newParams);
  };


  return (
    <Table
      columns={columns}
      className="table-custom 00000"
      rowKey={(record) => record._id}
      dataSource={data}
      pagination={{
        ...tableParams?.pagination,
        showSizeChanger: false,
        pageSizeOptions: [],
        size: "default",
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default TableReUsable;
