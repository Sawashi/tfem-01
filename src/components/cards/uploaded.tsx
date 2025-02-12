import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Table, Typography } from "antd";
import { useEffect } from "react";

const { Title } = Typography;

interface UploadedStructureProps {
	excelData: any[];
	fileUploaded: boolean;
	handleRemoveFile: () => void;
}

const UploadedStructure: React.FC<UploadedStructureProps> = (props) => {
	const columns =
		props.excelData.length > 0
			? props.excelData[0].map((col: string, index: number) => ({
					title: col,
					dataIndex: index.toString(),
					key: index.toString(),
			  }))
			: [];
	//useEffect printout excelData

	return (
		<Card
			style={{
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow for a modern look
				borderRadius: "8px", // Optional: Add border-radius for rounded corners
			}}
		>
			<Title level={3}>Structure uploaded</Title>
			{props.fileUploaded && (
				<Button
					type="primary"
					danger
					icon={<DeleteOutlined />}
					onClick={props.handleRemoveFile}
					style={{ marginBottom: "16px" }}
				>
					Remove Uploaded File
				</Button>
			)}
			<Table dataSource={props.excelData.slice(1)} columns={columns} />
		</Card>
	);
};

export default UploadedStructure;
