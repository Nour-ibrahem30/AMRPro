// ===== 3D ROBOT PARTS IN SECTIONS =====
console.log('🤖 Robot in Sections Loading...');

(function() {
    const partRenderers = {};
    const partScenes = {};
    const animationStates = {}; // Track animation state for each part
    
    function createPartScene(partName, canvas) {
        console.log('🎨 Creating scene for:', partName);
        
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        
        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0e1a);
        
        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        
        // Store initial camera position for zoom
        const initialCameraZ = 5;
        let currentZoom = 1;
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        
        // Add mouse wheel zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            currentZoom += delta;
            currentZoom = Math.max(0.5, Math.min(2, currentZoom)); // Limit zoom between 0.5x and 2x
            camera.position.z = initialCameraZ / currentZoom;
        }, { passive: false });
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x0066ff, 1);
        directionalLight.position.set(3, 5, 3);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x00d4ff, 0.8, 30);
        pointLight.position.set(-3, 3, -3);
        scene.add(pointLight);
        
        // Materials
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a3f5f, metalness: 0.7, roughness: 0.3 });
        const accentMat = new THREE.MeshStandardMaterial({ 
            color: 0x0066ff, 
            metalness: 0.8, 
            roughness: 0.2,
            emissive: 0x0066ff,
            emissiveIntensity: 0.2
        });
        const sensorMat = new THREE.MeshStandardMaterial({ 
            color: 0x00d4ff, 
            metalness: 0.9, 
            roughness: 0.1,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.3
        });
        
        // Create part based on name
        let part;
        
        if (partName === 'sensors') {
            part = new THREE.Group();
            const lidar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6, 32), sensorMat);
            lidar.castShadow = true;
            part.add(lidar);
            const cam = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.2), sensorMat);
            cam.position.set(0, -0.2, 0.5);
            part.add(cam);
            
        } else if (partName === 'controller') {
            part = new THREE.Group();
            const ctrl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 1.2), accentMat);
            ctrl.castShadow = true;
            part.add(ctrl);
            for (let i = 0; i < 4; i++) {
                const chip = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 0.25), bodyMat);
                chip.position.set((i%2)*0.35-0.175, 0.18, Math.floor(i/2)*0.35-0.175);
                part.add(chip);
            }
            
        } else if (partName === 'platform') {
            part = new THREE.Group();
            const plat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 1.5), bodyMat);
            plat.castShadow = true;
            part.add(plat);
            const edges = [
                new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 1.5), accentMat),
                new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 1.5), accentMat),
                new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.06), accentMat),
                new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.06), accentMat)
            ];
            edges[0].position.set(-1, 0, 0);
            edges[1].position.set(1, 0, 0);
            edges[2].position.set(0, 0, -0.75);
            edges[3].position.set(0, 0, 0.75);
            edges.forEach(e => part.add(e));
            
        } else if (partName === 'motors') {
            part = new THREE.Group();
            const motorPos = [[-0.8,0,0.5], [0.8,0,0.5], [-0.8,0,-0.5], [0.8,0,-0.5]];
            motorPos.forEach(pos => {
                const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16), accentMat);
                motor.rotation.z = Math.PI/2;
                motor.position.set(pos[0], pos[1], pos[2]);
                motor.castShadow = true;
                part.add(motor);
            });
            
        } else if (partName === 'wheels') {
            part = new THREE.Group();
            const motorPos = [[-0.8,0,0.5], [0.8,0,0.5], [-0.8,0,-0.5], [0.8,0,-0.5]];
            motorPos.forEach(pos => {
                const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32), bodyMat);
                wheel.rotation.z = Math.PI/2;
                wheel.position.set(pos[0], pos[1], pos[2]);
                wheel.castShadow = true;
                part.add(wheel);
                for (let i = 0; i < 8; i++) {
                    const angle = (i/8)*Math.PI*2;
                    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8), accentMat);
                    roller.position.set(pos[0], pos[1]+Math.cos(angle)*0.4, pos[2]+Math.sin(angle)*0.4);
                    roller.rotation.y = angle+Math.PI/4;
                    roller.rotation.x = Math.PI/2;
                    part.add(roller);
                }
            });
        }
        
        if (part) {
            scene.add(part);
            console.log('✅', partName, 'added to scene');
        }
        
        // Initialize animation state
        animationStates[partName] = { playing: true };
        
        return { scene, camera, renderer, part };
    }
    
    function initAllParts() {
        console.log('🎬 Initializing all parts...');
        
        const canvases = document.querySelectorAll('.part-canvas');
        console.log('📊 Found', canvases.length, 'canvases');
        
        canvases.forEach(canvas => {
            const partName = canvas.getAttribute('data-part');
            if (partName) {
                const sceneData = createPartScene(partName, canvas);
                partScenes[partName] = sceneData;
                
                // Start animation for this part
                function animate() {
                    requestAnimationFrame(animate);
                    
                    // Only animate if not paused
                    if (sceneData.part && animationStates[partName].playing) {
                        sceneData.part.rotation.y += 0.01;
                        sceneData.part.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
                    }
                    
                    sceneData.renderer.render(sceneData.scene, sceneData.camera);
                }
                animate();
            }
        });
        
        console.log('✅ All parts initialized!');
        
        // Setup pause/play buttons
        const controlButtons = document.querySelectorAll('.animation-control');
        controlButtons.forEach(button => {
            button.addEventListener('click', () => {
                const partName = button.getAttribute('data-part');
                const icon = button.querySelector('i');
                
                if (animationStates[partName]) {
                    animationStates[partName].playing = !animationStates[partName].playing;
                    
                    if (animationStates[partName].playing) {
                        icon.className = 'fas fa-pause';
                        button.classList.remove('paused');
                    } else {
                        icon.className = 'fas fa-play';
                        button.classList.add('paused');
                    }
                }
            });
        });
    }
    
    function handleScroll() {
        const sections = document.querySelectorAll('.component-section');
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if section is in view
            const isInView = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
            
            if (isInView) {
                section.classList.add('active');
                const visual = section.querySelector('.component-visual');
                if (visual) {
                    visual.style.boxShadow = '0 0 80px rgba(0, 102, 255, 0.8)';
                    visual.style.borderColor = 'rgba(0, 102, 255, 1)';
                }
            } else {
                section.classList.remove('active');
                const visual = section.querySelector('.component-visual');
                if (visual) {
                    visual.style.boxShadow = 'none';
                    visual.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                }
            }
        });
    }
    
    // Resize handler
    function handleResize() {
        Object.keys(partScenes).forEach(partName => {
            const sceneData = partScenes[partName];
            const canvas = sceneData.renderer.domElement;
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            
            if (width > 0 && height > 0) {
                sceneData.camera.aspect = width / height;
                sceneData.camera.updateProjectionMatrix();
                sceneData.renderer.setSize(width, height);
            }
        });
    }
    
    // Initialize when page loads
    window.addEventListener('load', () => {
        console.log('✅ Page loaded');
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                initAllParts();
                window.addEventListener('scroll', handleScroll);
                window.addEventListener('resize', handleResize);
                handleScroll(); // Initial check
                console.log('🎉 Robot parts ready in sections!');
            } else {
                console.error('❌ THREE.js not loaded');
            }
        }, 500);
    });
    
    console.log('📦 Robot in Sections module loaded');
})();
