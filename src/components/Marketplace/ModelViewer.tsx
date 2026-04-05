import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import * as THREE from 'three';

interface ModelViewerProps {
  modelUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

/**
 * 3D Model Viewer Component
 * Uses HTML model-viewer web component for displaying .glb files
 * Falls back to Three.js if needed
 */
export const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl, isOpen, onClose, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLargeModel, setIsLargeModel] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    setLoadError(null);
    setProgress(0);
    setIsLargeModel(false);

    // Warn users on very large files since they can load slower on mid/low devices.
    if (modelUrl) {
      fetch(modelUrl, { method: 'HEAD' })
        .then((res) => {
          const size = Number(res.headers.get('content-length') || 0);
          if (size > 35 * 1024 * 1024) {
            setIsLargeModel(true);
          }
        })
        .catch(() => {
          // Ignore HEAD failures; model-viewer will still attempt the main load.
        });
    }

    const container = canvasHostRef.current;
    if (!container) {
      return;
    }

    try {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const initialWidth = Math.max(container.clientWidth, 640);
    const initialHeight = Math.max(container.clientHeight, 420);

    const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 2000);
    camera.position.set(0, 1.3, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(initialWidth, initialHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(4, 6, 5);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-4, 2, -3);
    scene.add(ambient, key, fill);

    let controls: any;
    let model: THREE.Object3D | null = null;
    let rafId = 0;

    const onResize = () => {
      if (!containerRef.current) {
        return;
      }
      const width = Math.max(containerRef.current.clientWidth, 640);
      const height = Math.max(containerRef.current.clientHeight, 420);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const loadTimeout = window.setTimeout(() => {
      setLoadError('3D model is taking too long to load. Please retry or open the model file directly.');
      setIsLoading(false);
    }, 20000);

    Promise.all([
      import('three/examples/jsm/controls/OrbitControls.js') as Promise<any>,
      import('three/examples/jsm/loaders/GLTFLoader.js') as Promise<any>,
    ])
      .then(([controlsModule, loaderModule]) => {
        const OrbitControlsCtor = controlsModule.OrbitControls;
        const GLTFLoaderCtor = loaderModule.GLTFLoader;

        controls = new OrbitControlsCtor(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.9;

        const loader = new GLTFLoaderCtor();
        loader.load(
          modelUrl,
          (gltf: any) => {
            const loadedModel = gltf.scene as THREE.Object3D;
            model = loadedModel;
            scene.add(loadedModel);

            const box = new THREE.Box3().setFromObject(loadedModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            loadedModel.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z, 1);
            const cameraZ = maxDim * 1.8;
            camera.position.set(maxDim * 0.25, maxDim * 0.18, cameraZ);
            camera.near = Math.max(0.01, maxDim / 1000);
            camera.far = maxDim * 40;
            camera.updateProjectionMatrix();
            controls.target.set(0, 0, 0);
            controls.update();

            window.clearTimeout(loadTimeout);
            setProgress(100);
            setIsLoading(false);
          },
          (event: ProgressEvent<EventTarget>) => {
            if (!event.total) {
              return;
            }
            const ratio = Math.max(0, Math.min(1, event.loaded / event.total));
            setProgress(Math.round(ratio * 100));
          },
          () => {
            window.clearTimeout(loadTimeout);
            setLoadError('Failed to load 3D model. Please check the model file and try again.');
            setIsLoading(false);
          }
        );
      })
      .catch(() => {
        window.clearTimeout(loadTimeout);
        setLoadError('Failed to initialize 3D viewer modules. Please refresh and try again.');
        setIsLoading(false);
      });

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls?.update?.();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(loadTimeout);
      window.removeEventListener('resize', onResize);
      controls?.dispose?.();
      if (model) {
        model.traverse((obj: THREE.Object3D) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
          const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material?.dispose();
          }
        });
      }
      renderer.dispose();
      if (canvasHostRef.current) {
        canvasHostRef.current.innerHTML = '';
      }
    };
    } catch (error) {
      console.error('3D viewer initialization failed:', error);
      setLoadError('3D viewer failed to initialize on this device/browser.');
      setIsLoading(false);
      return;
    }
  }, [isOpen, modelUrl]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg max-w-2xl w-full h-[85vh] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-lg font-semibold">{title || '3D Product View'}</h2>
        </div>

        {/* Viewer */}
        <div
          ref={containerRef}
          className="relative flex-1 min-h-0 bg-gray-50 overflow-hidden"
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            type="button"
            className="absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow hover:bg-white"
            aria-label="Close 3D viewer"
            title="Close"
          >
            <X size={18} />
          </button>

          {loadError ? (
            <div className="text-center p-4">
              <p className="text-red-600 mb-2">{loadError}</p>
              <a
                href={modelUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Open model file directly
              </a>
            </div>
          ) : (
            <>
              <div ref={canvasHostRef} className="absolute inset-0" />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/85">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
                    <p className="text-sm text-gray-600">Loading 3D model... {progress}%</p>
                    {isLargeModel && (
                      <p className="mt-2 text-xs text-amber-600">Large model detected. First load may take a few extra seconds.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls Info */}
        <div className="bg-gray-50 border-t p-3 text-xs text-gray-600">
          <p>Tip: Drag to rotate - Scroll to zoom - Right-click to pan</p>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;
