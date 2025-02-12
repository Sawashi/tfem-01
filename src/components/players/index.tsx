// components/YouTubePlayer.tsx

import { useEffect, useState } from "react";
import { Input, Button } from "antd";

interface YouTubePlayerProps {
	url: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ url }) => {
	const [videoId, setVideoId] = useState<string | null>(null);

	// Extract video ID from YouTube URL
	const extractVideoId = (url: string): string | null => {
		const match = url.match(
			/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
		);
		return match ? match[1] : null;
	};

	// Handle Play button click
	const handlePlay = () => {
		const id = extractVideoId(url);
		if (id) {
			setVideoId(id);
		}
	};
	useEffect(() => {
		handlePlay();
	}, []);
	return (
		<div>
			{videoId && (
				<div style={{ marginTop: "1rem" }}>
					<iframe
						width="560"
						height="315"
						src={`https://www.youtube.com/embed/${videoId}`}
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				</div>
			)}
		</div>
	);
};

export default YouTubePlayer;
