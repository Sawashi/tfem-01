import { Button } from "antd";
import { theme } from "constants/common";
import { styled } from "styled-components";

export const ActionButton = styled.div<{
  $justifyContent?: string;
  $gap?: string;
}>`
  display: flex;
  gap: ${(props) => props.$gap || "10px"};
  justify-content: ${(props) => props.$justifyContent || "center"};
`;

export const DeleteButton = styled(Button)`
  background: #f22128ff;
  color: #fff;
  border: none;
  // height: 36px;
  &:hover,
  &:hover:active {
    color: #ffffff !important;
    background: #ff6969 !important;
    border-color: ${theme.colors.danger} !important;
  }
  &:disabled {
    &:hover,
    &:hover:active {
      border-color: #d9d9d9 !important ;
      color: rgba(0, 0, 0, 0.25) !important ;
      background-color: rgba(0, 0, 0, 0.04) !important ;
      box-shadow: none !important ;
    }
  }
`;

export const WarningButton = styled(Button)`
  background: #ed7d2dff;
  color: #fff;
  border: none;
  min-width: 102px;
  // height: 36px;
  font-size: 16px;
  line-height: 26px;
  &:hover {
    color: #fff !important;
    background: #ff9b50 !important;
  }
  &:disabled {
    &:hover,
    &:hover:active {
      border-color: #d9d9d9 !important ;
      color: rgba(0, 0, 0, 0.25) !important ;
      background-color: rgba(0, 0, 0, 0.04) !important ;
      box-shadow: none !important ;
    }
  }
`;

export const TextLineClamp = styled.div<{ $line: number }>`
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.$line || 1};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

export const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
};

export const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
};

export const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
};

export const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
};

export const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "calc(50% - 8px)",
  maxWidth: "calc(50% - 8px)",
};
