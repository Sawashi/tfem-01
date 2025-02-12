import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Point3D {
	vertex: [number, number, number];
}

interface Point2D {
	vertex: [number, number];
}

interface Polygon {
	symbol: string;
	symbolDescription: string;
	color: string;
	points3D: Point3D[];
	points2D: Point2D[];
}

interface Section {
	sectionId: string;
	sectionName: string;
	polygons: Polygon[];
}

interface PolygonData {
	DocumentType: string;
	version: string;
	pid: string;
	Unit: string;
	polygonsBySection: Section[];
}

const PolygonVisualization: React.FC = () => {
	const d3Container = useRef < HTMLDivElement > null;
	const threeContainer = useRef < HTMLDivElement > null;
	const [data, setData] = (useState < PolygonData) | (null > null);
	const [selectedSection, setSelectedSection] = useState < string > "";
	const [error, setError] = (useState < string) | (null > null);

	// Load JSON data
	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await fetch("/sample_data.json");
				const jsonData = await response.json();
				setData(jsonData);
				if (jsonData.polygonsBySection.length > 0) {
					setSelectedSection(jsonData.polygonsBySection[0].sectionName);
				}
			} catch (err) {
				setError("Error loading polygon data");
				console.error(err);
			}
		};
		loadData();
	}, []);

	// [Previous D3 and Three.js visualization code remains exactly the same]
	// ... [Insert all the visualization code from the previous version here]

	if (error) {
		return <div style={{ color: "red" }}>Error: {error}</div>;
	}

	return (
		<div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
			<div style={{ marginBottom: "2rem" }}>
				<div
					style={{
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
						padding: "20px",
						marginBottom: "2rem",
					}}
				>
					<h2
						style={{
							fontSize: "1.5rem",
							fontWeight: "bold",
							marginBottom: "1rem",
						}}
					>
						2D Section View ({data?.Unit})
					</h2>
					<div style={{ marginBottom: "1rem" }}>
						<select
							value={selectedSection}
							onChange={(e) => setSelectedSection(e.target.value)}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #e5e7eb",
								borderRadius: "4px",
								marginBottom: "1rem",
							}}
						>
							<option value="">Select a section</option>
							{data?.polygonsBySection.map((section) => (
								<option key={section.sectionId} value={section.sectionName}>
									{section.sectionName}
								</option>
							))}
						</select>
					</div>
					<div
						ref={d3Container}
						style={{
							width: "100%",
							aspectRatio: "4/3",
							border: "1px solid #e5e7eb",
							borderRadius: "4px",
						}}
					/>
				</div>

				<div
					style={{
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
						padding: "20px",
					}}
				>
					<h2
						style={{
							fontSize: "1.5rem",
							fontWeight: "bold",
							marginBottom: "1rem",
						}}
					>
						3D View ({data?.Unit})
					</h2>
					<div
						ref={threeContainer}
						style={{
							width: "100%",
							aspectRatio: "1/1",
							border: "1px solid #e5e7eb",
							borderRadius: "4px",
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default PolygonVisualization;
