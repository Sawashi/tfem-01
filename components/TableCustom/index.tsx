/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined } from "@ant-design/icons";
import { Button, Empty, Table, Tooltip } from "antd";
import {
  ColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from "antd/es/table/interface";
import { theme } from "constants/common";
import { useEffect, useState } from "react";
import { TableWrapperStyled } from "./TableCustom.style";

type P_Props<T extends Record<string, any>> = {
  columns: ColumnsType<T>;
  data: T[];
  rowSelection?: TableRowSelection<T>;
  pagination?: TablePaginationConfig | false;
  emptyDescription?: string;
  loading?: boolean;
  scrollH?: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
  disableEditCondition?: (value: any) => boolean;
  disableReason?: string;
  onEdit?: (value: any) => void;
  onSelectedRow?: (rowKeys: React.Key[]) => void;
  onRow?: any;
  onChange?: any;
};

function TableCustom<T extends Record<string, any>>({
  columns,
  data = [],
  rowSelection,
  pagination,
  emptyDescription,
  loading,
  scrollH,
  hasEdit,
  disableEditCondition,
  disableReason,
  hasDelete,
  onEdit,
  onSelectedRow,
  onRow,
  onChange = () => {},
}: P_Props<T>) {
  const [tableHeight, setTableHeight] = useState<number>(0);

  const editColumn = [
    Table.SELECTION_COLUMN,
    {
      title: "",
      align: "left",
      fixed: "left",
      width: 65,
      render: (value: any, record: any) => {
        if (disableReason)
          return (
            <Tooltip title={disableReason}>
              <Button
                disabled={disableEditCondition && disableEditCondition(record)}
                style={{
                  width: "33px",
                }}
                // onClick={() => OtherUtil.loadCallback(onEdit, value)}
                icon={<EditOutlined style={{ color: theme.colors.primary }} />}
              />
            </Tooltip>
          );
        return (
          <Button
            disabled={disableEditCondition && disableEditCondition(record)}
            style={{
              width: "33px",
            }}
            // onClick={() => OtherUtil.loadCallback(onEdit, value)}
            icon={<EditOutlined style={{ color: theme.colors.primary }} />}
          ></Button>
        );
      },
    },
  ];

  useEffect(() => {
    const outSideTableHeight =
      theme.adminHeaderHeight + 12 + 16 * 3 + 32 * 2 + 62 + 16;

    if (typeof window !== "undefined") {
      setTableHeight(window.innerHeight - outSideTableHeight);

      window.addEventListener("resize", () => {
        setTableHeight(window.innerHeight - outSideTableHeight);
      });
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", () => {});
      }
    };
  }, []);

  return (
    <TableWrapperStyled>
      <Table
        onChange={onChange}
        onRow={onRow}
        columns={hasEdit ? [...editColumn, ...columns] : columns}
        dataSource={data}
        rowSelection={
          hasDelete
            ? {
                ...rowSelection,
                columnWidth: 48,
                onChange: (selectedRowKeys: React.Key[]) => {
                  // OtherUtil.loadCallback(onSelectedRow, selectedRowKeys);
                },
              }
            : rowSelection
        }
        scroll={{
          y: tableHeight,
          x: scrollH == false ? "" : "100vw",
        }}
        pagination={pagination}
        style={{
          border: "1px solid #eee",
          borderRadius: 6,
        }}
        locale={{
          emptyText: (
            <Empty
              description={emptyDescription ?? "No data found"}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        loading={loading}
      />
    </TableWrapperStyled>
  );
}

export default TableCustom;
