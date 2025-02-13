import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Select, Typography } from "antd";
import sampleData from "../../sample_data.json";

// Types for 2D and 3D Points
type Point2D = {
	vertex: [number, number];
};

type Point3D = {
	vertex: [number, number, number];
};

// Types for Polygons
type Polygon = {
	symbol: string;
	symbolDescription: string;
	color: string;
	points2D: Point2D[];
	points3D: Point3D[];
};
type Borehole = {
	boreholeId: string;
	name: string;
	x: number;
	elevation: number;
	depth: number;
	waterDepth: number | null;
};

// Types for Sections
type Section = {
	sectionId: string;
	sectionName: string;
	polygons: Polygon[];
	boreholes: Borehole[]; // Add boreholes
};

type SampleData = {
	polygonsBySection: Section[];
};

const { Title } = Typography;
const { Option } = Select;

const HomeList = () => {
	// State with types
	const [data, setData] = useState<Section[]>(
		sampleData.polygonsBySection as unknown as Section[]
	);

	const [selectedSection, setSelectedSection] = useState<string>(
		sampleData.polygonsBySection[0].sectionId
	);
	const d3Ref = useRef<HTMLDivElement>(null);
	const threeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!data || !selectedSection || !d3Ref.current) return;

		const section = data.find((sec) => sec.sectionId === selectedSection);
		if (!section) return;

		const margin = { top: 20, right: 20, bottom: 40, left: 40 };
		const width = 1000 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		const svg = d3
			.select(d3Ref.current)
			.html("") // Clear previous content
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		// Create a group for the zoomable content
		const contentGroup = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Create a separate group for the fixed axes
		const axesGroup = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		const allPoints = section.polygons.flatMap((p) => p.points2D);

		const xValues = allPoints.map((d) => d.vertex[0]);
		const yValues = allPoints.map((d) => d.vertex[1]);

		// Create scales
		const xScale = d3
			.scaleLinear()
			.domain([d3.min(xValues) ?? 0, d3.max(xValues) ?? 0])
			.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([d3.min(yValues) ?? 0, d3.max(yValues) ?? 0])
			.range([height, 0]);

		// Create axes
		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		// Append axes (fixed position)
		axesGroup
			.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(xAxis)
			.attr("class", "x-axis");

		axesGroup.append("g").call(yAxis).attr("class", "y-axis");

		// Define zoom behavior
		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.5, 5]) // Limit zoom scale
			.on("zoom", (event) => {
				const newXScale = event.transform.rescaleX(xScale);
				const newYScale = event.transform.rescaleY(yScale);

				// Update the transformed scales for the content group
				contentGroup
					.selectAll<SVGCircleElement, Borehole>("circle")
					.attr("cx", (d) => newXScale(d.x))
					.attr("cy", (d) => newYScale(d.elevation));

				contentGroup
					.selectAll<SVGPolygonElement, Polygon>("polygon")
					.attr("points", (d) =>
						d.points2D
							.map((p) => `${newXScale(p.vertex[0])},${newYScale(p.vertex[1])}`)
							.join(" ")
					);

				// Update axes' numbers but NOT their position
				axesGroup.select<SVGGElement>(".x-axis").call(xAxis.scale(newXScale));
				axesGroup.select<SVGGElement>(".y-axis").call(yAxis.scale(newYScale));
			});

		// Apply zoom to the entire SVG
		svg.call(zoom);

		// Render boreholes
		section.boreholes.forEach((borehole) => {
			contentGroup
				.append("circle")
				.datum(borehole)
				.attr("cx", xScale(borehole.x))
				.attr("cy", yScale(borehole.elevation)) // Use elevation for y-coordinate
				.attr("r", 5)
				.attr("fill", "red")
				.on("click", function () {
					d3.select(this).attr("fill", "blue"); // Change color on click
				});

			contentGroup
				.append("text")
				.attr("x", xScale(borehole.x))
				.attr("y", yScale(borehole.elevation) - 10)
				.attr("text-anchor", "middle")
				.text(borehole.name);
		});

		// Render polygons
		section.polygons.forEach((polygon) => {
			contentGroup
				.append("polygon")
				.datum(polygon)
				.attr(
					"points",
					polygon.points2D
						.map((p) => `${xScale(p.vertex[0])},${yScale(p.vertex[1])}`)
						.join(" ")
				)
				.attr("fill", `#${polygon.color}`)
				.attr("stroke", "black")
				.attr("stroke-width", 1)
				.on("click", function () {
					d3.select(this).attr("stroke", "red"); // Highlight polygon on click
				});
		});
	}, [data, selectedSection]);

	useEffect(() => {
		if (!data || !threeRef.current) return;

		const section = data.find((sec) => sec.sectionId === selectedSection);
		if (!section) return;

		// Scene setup
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff); // White background

		// Camera setup (Position it for a top-right-down view)
		const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 5000);
		camera.position.set(100, 100, 100); // Initial camera position

		camera.lookAt(0, 0, 0); // Look at the center

		// Renderer setup
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(1000, 500);
		threeRef.current.innerHTML = ""; // Clear previous content
		threeRef.current.appendChild(renderer.domElement);

		// Orbit controls for camera interaction (disable panning)
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true; // Smooth damping for smoother movement
		controls.dampingFactor = 0.25;
		controls.screenSpacePanning = false; // Disable screen space panning
		controls.maxPolarAngle = Math.PI / 2;
		controls.enableZoom = true; // Enable zooming

		// Movement variables
		const moveSpeed = 2; // Speed of camera movement (you can adjust)
		let moveForward = false;
		let moveBackward = false;
		let moveLeft = false;
		let moveRight = false;

		// Keyboard event listeners for WASD keys
		function handleKeyDown(event: { key: any }) {
			switch (event.key) {
				case "w":
					moveForward = true;
					break;
				case "s":
					moveBackward = true;
					break;
				case "a":
					moveLeft = true;
					break;
				case "d":
					moveRight = true;
					break;
				default:
					break;
			}
		}

		function handleKeyUp(event: { key: any }) {
			switch (event.key) {
				case "w":
					moveForward = false;
					break;
				case "s":
					moveBackward = false;
					break;
				case "a":
					moveLeft = false;
					break;
				case "d":
					moveRight = false;
					break;
				default:
					break;
			}
		}

		// Add event listeners
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		// Determine the min and max values for x and z coordinates across all polygons
		let minX = Infinity,
			maxX = -Infinity,
			minZ = Infinity,
			maxZ = -Infinity;

		section.polygons.forEach((polygon) => {
			polygon.points3D.forEach((point) => {
				const [x, , z] = point.vertex;
				minX = Math.min(minX, x);
				maxX = Math.max(maxX, x);
				minZ = Math.min(minZ, z);
				maxZ = Math.max(maxZ, z);
			});
		});

		// Now create the grid helper based on min and max values
		const gridSize = Math.max(maxX - minX, maxZ - minZ); // Choose the larger of the two ranges
		const gridHelper = new THREE.GridHelper(gridSize, 50); // 50 divisions

		// Rotate the grid to make it horizontal, on the floor (lying flat)
		gridHelper.rotation.y = Math.PI / 2; // Rotate 90 degrees along the X-axis to make it horizontal
		scene.add(gridHelper);

		// Add polygons (as before)
		section.polygons.forEach((polygon) => {
			const vertices: number[] = []; // Array to store vertex positions
			const indices: number[] = []; // Array to store face indices (triangles)

			// Apply scaling factor to control the size of the objects
			const scaleFactor = 0.3; // Adjust this factor as needed for proper scaling

			polygon.points3D.forEach((point) => {
				const [x, y, z] = point.vertex;
				// Apply scaling to the x, y, z coordinates
				vertices.push(x * scaleFactor, z * scaleFactor, y * scaleFactor);
			});

			// Create faces (triangles) based on the vertex positions
			// Here we are assuming the polygon is made up of a triangle fan, you might need to adjust the logic based on your data
			for (let i = 1; i < polygon.points3D.length - 1; i++) {
				indices.push(0, i, i + 1); // Creates a triangle fan
			}

			const geometry = new THREE.BufferGeometry(); // Use BufferGeometry

			// Add the vertices as a BufferAttribute (positions)
			geometry.setAttribute(
				"position",
				new THREE.BufferAttribute(new Float32Array(vertices), 3) // 3 components per vertex
			);

			// Add the indices as a BufferAttribute (faces)
			geometry.setIndex(indices);

			// Use MeshBasicMaterial with DoubleSide for both front and back faces
			const material = new THREE.MeshBasicMaterial({
				color: `#${polygon.color}`,
				side: THREE.DoubleSide, // Ensure both sides are rendered
				wireframe: false, // Set to true if you want wireframe mode, false for solid fill
			});

			// Render boreholes
			section.boreholes.forEach((borehole) => {
				// Find the matching 3D point based on x coordinate of the borehole
				const matchingPoint = section.polygons
					.flatMap((polygon) => polygon.points3D) // Flatten the array of 3D points from all polygons
					.find((point) => point.vertex[0] === borehole.x); // Find point where x matches the borehole

				if (matchingPoint) {
					// Create a sphere geometry to represent the borehole
					const geometry = new THREE.SphereGeometry(2, 32, 32); // Size and detail of the sphere
					const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Color of the sphere (Red)

					const boreholeMesh = new THREE.Mesh(geometry, material);

					// Set the position of the borehole in 3D space using the matching point's y and z coordinates
					boreholeMesh.position.set(
						matchingPoint.vertex[0],
						borehole.depth,
						matchingPoint.vertex[2]
					);

					// Add the borehole mesh to the scene
					scene.add(boreholeMesh);
				}
			});

			const mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);
		});

		// Animation loop
		function animate() {
			requestAnimationFrame(animate);

			// WASD movement logic
			if (moveForward) camera.position.z -= moveSpeed;
			if (moveBackward) camera.position.z += moveSpeed;
			if (moveLeft) camera.position.x -= moveSpeed;
			if (moveRight) camera.position.x += moveSpeed;

			controls.update(); // Update the controls (important for damping)
			renderer.render(scene, camera);
		}
		animate();

		// Clean up when the component is unmounted
		return () => {
			renderer.dispose();
			controls.dispose();
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [data, selectedSection]);

	return (
		<>
			<Title level={2}>Polygon Viewer</Title>
			<Select
				value={selectedSection}
				onChange={setSelectedSection}
				style={{ width: 200 }}
			>
				{data &&
					data.map((section) => (
						<Option key={section.sectionId} value={section.sectionId}>
							{section.sectionName}
						</Option>
					))}
			</Select>
			<div>
				<Title level={4}>2D Viewer (D3.js)</Title>
				<div ref={d3Ref}></div>
			</div>
			<div>
				<Title level={4}>3D Viewer (Three.js)</Title>
				<div ref={threeRef}></div>
			</div>
		</>
	);
};

export default HomeList;
