# Building Animation Landing Page

A Next.js project featuring a 3D building animation that disassembles as the user scrolls down the page and reassembles when scrolling back up.

## Overview

This project implements a scroll-controlled 3D animation of a building breaking apart into pieces. The animation is created in Blender, exported as a glTF file, and integrated into a Next.js application using Three.js and GSAP's ScrollTrigger.

## Features

- 3D building model with animation as pieces fly away
- Scroll-based animation control
- Smooth playback in both directions (disassembling when scrolling down, reassembling when scrolling up)
- Responsive design

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- A 3D model of a building with animation exported from Blender as a glTF file

## Installation

1. Clone the repository or create a new Next.js project:

```bash
npx create-next-app@latest animation-prototype
cd animation-prototype
```

2. Install the required dependencies:

```bash
npm install three @react-three/fiber @react-three/drei gsap
```

3. Create the required directories:

```bash
mkdir -p public/models
mkdir -p src/components
```

4. Place your glTF model in the `public/models/` directory (name it `building.glb` or update the path in the component)

## Project Structure

```
building-animation-prototype/
├── public/
│   └── models/
│       └── building.gltf       # Your exported Blender animation
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Home page
│   │   └── globals.css        # Global styles
│   └── components/
│       └── BuildingAnimation.js
├── .gitignore
├── next.config.js
└── package.json
```

## Key Components

### BuildingAnimation.js

This is the core component that:
- Loads the glTF model with Three.js
- Sets up animation mixers for all animations in the model
- Creates a ScrollTrigger that controls animation playback based on scroll position

### Animations

The component plays all animations in the glTF file simultaneously, which is crucial when different pieces of the building have separate animation tracks. When the user scrolls:

- Scrolling down advances the animation (building disassembles)
- Scrolling up reverses the animation (building reassembles)

## Creating the 3D Model in Blender

### Requirements for the Blender File

1. **Model Structure**: 
   - The building should be composed of separate pieces/objects
   - Each piece that will fly away should be its own object

2. **Animation**: 
   - Create keyframes for the initial position (building intact)
   - Add keyframes for the movement/rotation of each piece as it separates
   - Make sure all pieces have animation tracks

3. **Export Settings**:
   - Export as glTF (.glb) format
   - Enable "Include Animations" option
   - If using a camera animation, enable "Include Cameras"

### Animation Tips

- Stagger the animation of different pieces for a more natural effect
- Add rotation to pieces as they fly away
- Consider using Blender's physics engine for more dynamic movement
- Make sure the animation plays well in reverse (for scrolling back up)

## Implementation Details

The project uses:
- **Next.js App Router**: Modern file-based routing system
- **React Three Fiber**: React renderer for Three.js
- **GSAP ScrollTrigger**: For tying scroll position to animation progress
- **GLTFLoader**: For loading the 3D model and animations

## Customization

### Camera Position

Adjust the camera settings in the Canvas component for different viewing angles:

```jsx
<Canvas 
  camera={{ 
    position: [x, y, z], 
    fov: 45 
  }}
>
```

### Animation Timing

Modify the ScrollTrigger configuration to change how the animation responds to scrolling:

```jsx
ScrollTrigger.create({
  trigger: scrollRef.current,
  start: "top top",
  end: "bottom bottom",
  scrub: 1, // Add smoothing (higher = more delay)
  // Other options...
});
```

### Content Sections

Customize the content in the scroll sections to match your website's narrative:

```jsx
<div className="scroll-content">
  <div className="section" style={{ height: '100vh' }}>
    <h1>Your Custom Content</h1>
  </div>
  {/* More sections... */}
</div>
```

## Troubleshooting

### Common Issues

1. **Model Not Visible**: 
   - Check the model's scale and position
   - Adjust the camera position to ensure it's in view

2. **Animation Not Playing**: 
   - Verify the model contains animations (check console logs)
   - Ensure all pieces have animation tracks in Blender

3. **Performance Issues**: 
   - Reduce the complexity of the 3D model
   - Optimize the number of animation tracks
   - Consider disabling React's strict mode

### Debugging Tools

The development version includes:
- Console logging of model structure and animations
- Visual helpers (grid, axes) to understand orientation
- A debug panel with status information

## Performance Optimization

For better performance:
- Use compressed textures
- Implement level-of-detail (LOD) for complex models
- Consider using instanced geometry for repeated elements
- Implement frustum culling for off-screen elements

