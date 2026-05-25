import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as THREE from 'three'
import { lessonsAPI } from '../services/api'

export default function ThreeDSimulation() {
  const containerRef = useRef(null)
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const sceneRef = useRef(null)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const response = await lessonsAPI.get(lessonId)
      setLesson(response.data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Create a demo cube
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshPhongMaterial({ color: 0x3b82f6 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 5, 5)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    sceneRef.current = scene

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.005
      cube.rotation.y += 0.005
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  if (isLoading) return <div className="p-8 text-center">Loading 3D model...</div>

  return (
    <div className="flex h-screen">
      <div className="flex-1" ref={containerRef}></div>
      <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{lesson?.title}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Controls</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>📍 The object will rotate automatically</li>
              <li>🖱️ Drag to rotate manually</li>
              <li>🔍 Scroll to zoom</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{lesson?.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
