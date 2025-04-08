"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BuildingModel = ({ scrollRef }) => {
  const gltf = useLoader(GLTFLoader, "/models/building.gltf");
  const [modelLoaded, setModelLoaded] = useState(false);
  const mixerRef = useRef(null);
  const animationsRef = useRef([]);
  const { scene } = useThree();

  // Set up the animation mixer
  useEffect(() => {
    if (!gltf) {
      console.warn("glTF model failed to load");
      return;
    }

    console.log("Model loaded successfully");
    setModelLoaded(true);

    // Log model structure
    console.log("Model structure:", gltf);

    // Log animations if they exist
    if (gltf.animations && gltf.animations.length > 0) {
      console.log("Animations found:", gltf.animations.length);
      gltf.animations.forEach((anim, index) => {
        console.log(
          `Animation ${index}: ${anim.name || "Unnamed"}, Duration: ${anim.duration}s`,
        );
      });

      const mixer = new THREE.AnimationMixer(gltf.scene);

      // Create an action for EACH animation and store them
      const actions = gltf.animations.map((animation) => {
        const action = mixer.clipAction(animation);
        action.clampWhenFinished = true;
        action.play();
        return action;
      });

      // Find the longest animation duration to use for scroll control
      const maxDuration = Math.max(
        ...gltf.animations.map((anim) => anim.duration),
      );

      mixer.setTime(0); // Start all animations at beginning

      mixerRef.current = {
        mixer,
        actions,
        duration: maxDuration,
      };
      animationsRef.current = gltf.animations;

      // Set up scroll trigger to control animation
      if (typeof window !== "undefined" && scrollRef.current) {
        ScrollTrigger.create({
          trigger: scrollRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            if (mixerRef.current) {
              // Set animation time based on scroll progress (0 to 1)
              const newTime = self.progress * mixerRef.current.duration;
              mixerRef.current.mixer.setTime(newTime);
            }
          },
        });
      }
    } else {
      console.warn("No animations found in the model");
    }

    // Add model to scene
    if (gltf.scene) {
      scene.add(gltf.scene);

      // Center and scale the model if needed
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      console.log("Model size:", size);
      console.log("Model center:", center);

      // If model is not centered or very small/large, adjust it
      if (
        Math.max(size.x, size.y, size.z) > 100 ||
        Math.max(size.x, size.y, size.z) < 0.1
      ) {
        const scale = 10 / Math.max(size.x, size.y, size.z);
        gltf.scene.scale.set(scale, scale, scale);
        console.log("Adjusted model scale:", scale);
      }

      // Log all objects in the scene to help with debugging
      console.log("Scene objects:");
      gltf.scene.traverse((object) => {
        if (object.isMesh) {
          console.log(`Mesh: ${object.name}`);
        } else if (object.isCamera) {
          console.log(`Camera: ${object.name}`);
        } else if (object.isLight) {
          console.log(`Light: ${object.name}`);
        } else if (object.name) {
          console.log(`Other object: ${object.name}, type: ${object.type}`);
        }
      });
    }

    return () => {
      // Cleanup
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (gltf.scene) {
        scene.remove(gltf.scene);
      }
    };
  }, [gltf, scrollRef, scene]);

  return (
    <group>
      {/* We're adding the gltf scene directly to the Three.js scene, but we'll render a status message */}
      {!modelLoaded && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </group>
  );
};

export default function BuildingAnimation() {
  const scrollRef = useRef();

  return (
    <div className="building-animation-container" ref={scrollRef}>
      <div className="canvas-container">
        <Canvas
          camera={{
            position: [20, 20, 20], // Still zoomed out but not as extreme
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
          <Suspense fallback={null}>
            <BuildingModel scrollRef={scrollRef} />
          </Suspense>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />
          <gridHelper args={[100, 100]} />
          <axesHelper args={[5]} />
        </Canvas>
      </div>

      {/* Debug controls */}
      <div className="debug-panel">
        <h3>Debug Panel</h3>
        <p>Check the console for model information</p>
        <p>Scroll to control all animations simultaneously</p>
      </div>

      {/* Scrollable content */}
      <div className="scroll-content">
        <div className="section" style={{ height: "100vh" }}>
          <h1>Scroll Down to Animate All Parts</h1>
        </div>
        <div className="section" style={{ height: "100vh" }}>
          <h2>Keep Scrolling...</h2>
        </div>
        <div className="section" style={{ height: "100vh" }}>
          <h2>Continue Scrolling...</h2>
        </div>
        <div className="section" style={{ height: "100vh" }}>
          <h2>Bottom of Animation</h2>
        </div>
      </div>
    </div>
  );
}
