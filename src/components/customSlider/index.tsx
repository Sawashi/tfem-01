import { useState } from "react";
import { Button, Image, Layout, Menu, Avatar } from "antd";
import {
	HomeOutlined,
	UserOutlined,
	SolutionOutlined,
	BookOutlined,
	AppstoreOutlined,
	EnvironmentOutlined,
	StarOutlined,
	QuestionCircleOutlined,
	AudioOutlined,
	YoutubeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Typography } from "antd";

const { Title } = Typography;
const { Sider } = Layout;

interface SliderProps {
	selectedKey: string;
	setSelectedKey: (key: string) => void;
}

const CustomSlider: React.FC<SliderProps> = (props) => {
	const [collapsed, setCollapsed] = useState(false);

	const onCollapse = (collapsed: boolean) => {
		setCollapsed(collapsed);
	};

	const handleMenuSelect = ({ key }: { key: string }) => {
		props.setSelectedKey(key);
	};

	return (
		<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "64px",
				}}
			>
				<Title
					style={{
						color: "#1890ff",
						marginBottom: 0,
						fontSize: "24px",
						fontWeight: "bold",
					}}
				>
					Test app
				</Title>
			</div>
			<Avatar
				size={40}
				style={{
					backgroundColor: "#87d068",
					margin: "10px auto",
					display: "block",
				}}
				icon={<UserOutlined />}
			/>
			<Menu
				theme="dark"
				selectedKeys={[props.selectedKey]}
				onSelect={handleMenuSelect}
				mode="inline"
			>
				<Menu.Item key="home" icon={<HomeOutlined />}>
					<Link href="/home">Home</Link>
				</Menu.Item>
				{/* <Menu.Item key="transcribe" icon={<AudioOutlined />}>
					<Link href="/transcribe-for-mp3">MP3 transcribe</Link>
				</Menu.Item>
				<Menu.Item key="youtube" icon={<YoutubeOutlined />}>
					<Link href="/transcribe-for-youtube">Youtube transcribe</Link>
				</Menu.Item>
				<Menu.Item key="help" icon={<QuestionCircleOutlined />}>
					<Link href="/help">Help</Link>
				</Menu.Item> */}
			</Menu>
		</Sider>
	);
};

export default CustomSlider;
