import { theme } from 'constants/common';
import { styled } from 'styled-components';

export const TableWrapperStyled = styled.div`
  .ant-table-wrapper .ant-table-body > tr.ant-table-row-selected > th,
  .ant-table-wrapper .ant-table-body > tr.ant-table-row-selected > td {
    background-color: #e6f7ff;
  }

  .ant-pagination {
    .ant-pagination-item-active {
      border-radius: 50%;
      background: ${theme.colors.primary};
      border-color: transparent;
      &:hover {
        border-radius: 50%;
      }
      > a {
        color: #fff;
      }
    }
    .ant-pagination-item {
      &:hover {
        border-radius: 50%;
      }
    }
    .ant-pagination-pre {
      &:hover {
        border-radius: 50%;
      }
    }
  }
`;

