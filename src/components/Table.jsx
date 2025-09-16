import React from "react";
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
      },
      filters,
      sortOrder: sorter.order, // This will be "ascend" or "descend"
      sortField: sorter.field,
    };

    console.log("Table change params:", newParams);
    onTableChange && onTableChange(newParams);
  };

  return (
    <Table
      columns={columns}
      className="table-custom"
      rowKey={(record) => record.key}
      dataSource={data}
      pagination={{
        ...tableParams?.pagination,
        total: totalCount,
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
