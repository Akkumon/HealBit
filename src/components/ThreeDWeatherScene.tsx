
import React, { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec3 } from 'ogl';
import { EmotionScale } from '@/types/sentiment';
import { MoodType } from '@/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface ThreeDWeatherSceneProps {
  emotionScale: EmotionScale;
  mood?: MoodType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ThreeDWeatherScene: React.FC<ThreeDWeatherSceneProps> = ({
  emotionScale,
  mood = 'neutral',
  size = 'md',
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize OGL renderer
    const renderer = new Renderer({
      canvas: canvasRef.current,
      alpha: true,
      premultipliedAlpha: false,
      antialias: true
    });
    
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Vertex shader for full-screen quad
    const vertex = /* glsl */ `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader for weather effects
    const fragment = /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uEmotionScale;
      uniform float uIsDark;
      uniform vec3 uMoodColor;
      varying vec2 vUv;

      // Noise functions
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      // Cloud generation
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      // Rain effect
      float rain(vec2 uv, float time) {
        vec2 st = uv * vec2(20.0, 10.0);
        st.y += time * 2.0;
        return smoothstep(0.95, 1.0, noise(st));
      }

      // Lightning effect
      float lightning(vec2 uv, float time) {
        float flash = sin(time * 10.0) * 0.5 + 0.5;
        flash = pow(flash, 8.0);
        return flash * smoothstep(0.3, 0.7, random(vec2(floor(time * 2.0))));
      }

      // Sun rays effect
      float sunRays(vec2 uv, float time) {
        vec2 center = vec2(0.5, 0.3);
        vec2 dir = normalize(uv - center);
        float angle = atan(dir.y, dir.x);
        float rays = sin(angle * 8.0 + time) * 0.5 + 0.5;
        float dist = distance(uv, center);
        return rays * smoothstep(0.8, 0.2, dist) * 0.3;
      }

      // Particle effects
      float particles(vec2 uv, float time, float density) {
        vec2 st = uv * density;
        st.y += time * 0.5;
        float particle = smoothstep(0.98, 1.0, noise(st));
        return particle;
      }

      void main() {
        vec2 uv = vUv;
        vec3 color = vec3(0.0);
        
        // Base atmosphere color based on emotion scale
        vec3 atmosphereColor;
        if (uEmotionScale <= 1.5) {
          // Storm - dark, turbulent
          atmosphereColor = mix(vec3(0.1, 0.1, 0.2), vec3(0.2, 0.2, 0.3), uIsDark);
        } else if (uEmotionScale <= 2.5) {
          // Heavy rain - blue-gray
          atmosphereColor = mix(vec3(0.2, 0.3, 0.5), vec3(0.3, 0.4, 0.6), uIsDark);
        } else if (uEmotionScale <= 3.5) {
          // Cloudy - neutral gray
          atmosphereColor = mix(vec3(0.4, 0.4, 0.5), vec3(0.5, 0.5, 0.6), uIsDark);
        } else if (uEmotionScale <= 4.5) {
          // Partly sunny - warm with blue
          atmosphereColor = mix(vec3(0.6, 0.7, 0.8), vec3(0.7, 0.8, 0.9), uIsDark);
        } else {
          // Sunny - warm golden
          atmosphereColor = mix(vec3(0.9, 0.8, 0.6), vec3(1.0, 0.9, 0.7), uIsDark);
        }

        // Apply mood color influence
        color = mix(atmosphereColor, uMoodColor, 0.3);

        // Add weather effects based on emotion scale
        if (uEmotionScale <= 1.5) {
          // Storm effects
          float storm = fbm(uv * 3.0 + uTime * 0.5);
          color += storm * 0.2;
          
          // Lightning
          float flash = lightning(uv, uTime);
          color += flash * vec3(0.8, 0.9, 1.0);
          
          // Heavy rain
          float rainEffect = rain(uv, uTime);
          color += rainEffect * vec3(0.3, 0.4, 0.6);
          
        } else if (uEmotionScale <= 2.5) {
          // Rain effects
          float rainEffect = rain(uv, uTime) * 0.7;
          color += rainEffect * vec3(0.4, 0.5, 0.7);
          
          // Gentle clouds
          float clouds = fbm(uv * 2.0 + uTime * 0.2);
          color = mix(color, color + vec3(0.2), clouds * 0.5);
          
        } else if (uEmotionScale <= 3.5) {
          // Cloudy effects
          float clouds = fbm(uv * 1.5 + uTime * 0.1);
          color = mix(color, color + vec3(0.1), clouds * 0.6);
          
        } else if (uEmotionScale <= 4.5) {
          // Partly sunny effects
          float clouds = fbm(uv * 1.2 + uTime * 0.1);
          color = mix(color, color + vec3(0.2, 0.2, 0.1), clouds * 0.4);
          
          // Gentle sun rays
          float rays = sunRays(uv, uTime);
          color += rays * vec3(1.0, 0.9, 0.6);
          
          // Sparkle particles
          float sparkles = particles(uv, uTime, 15.0);
          color += sparkles * vec3(1.0, 1.0, 0.8) * 0.5;
          
        } else {
          // Sunny effects
          float rays = sunRays(uv, uTime);
          color += rays * vec3(1.0, 0.9, 0.6);
          
          // Bright particles
          float sparkles = particles(uv, uTime, 20.0);
          color += sparkles * vec3(1.0, 1.0, 0.8);
          
          // Warm glow
          vec2 center = vec2(0.5, 0.3);
          float dist = distance(uv, center);
          float glow = smoothstep(0.8, 0.2, dist) * 0.3;
          color += glow * vec3(1.0, 0.8, 0.4);
        }

        // Breathing animation - subtle scale variance
        float breathe = sin(uTime * 2.0) * 0.02 + 1.0;
        vec2 centeredUv = (uv - 0.5) * breathe + 0.5;
        
        // Vignette effect for depth
        float vignette = smoothstep(0.8, 0.2, distance(uv, vec2(0.5)));
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create geometry and program
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec3(1, 1, 1) },
        uEmotionScale: { value: emotionScale },
        uIsDark: { value: isDark ? 1.0 : 0.0 },
        uMoodColor: { value: new Vec3(0.5, 0.5, 0.5) }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Resize handler
    const resize = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      renderer.setSize(rect.width * dpr, rect.height * dpr);
      canvasRef.current.style.width = rect.width + 'px';
      canvasRef.current.style.height = rect.height + 'px';
      
      program.uniforms.uResolution.value.set(rect.width, rect.height, 1);
    };

    // Animation loop
    let animationId: number;
    const animate = (time: number) => {
      program.uniforms.uTime.value = time * 0.001;
      program.uniforms.uEmotionScale.value = emotionScale;
      program.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
      
      // Set mood color based on mood type with proper type safety
      const moodColors: Record<MoodType, Vec3> = {
        joy: new Vec3(1.0, 0.8, 0.2),
        calm: new Vec3(0.2, 0.6, 0.8),
        hope: new Vec3(0.4, 0.8, 0.4),
        neutral: new Vec3(0.5, 0.5, 0.5),
        sadness: new Vec3(0.3, 0.4, 0.7),
        anger: new Vec3(0.8, 0.3, 0.3)
      };
      
      program.uniforms.uMoodColor.value = moodColors[mood];
      
      renderer.render({ scene: mesh });
      animationId = requestAnimationFrame(animate);
    };

    // Initialize
    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      if (rendererRef.current) {
        const context = rendererRef.current.gl.getExtension('WEBGL_lose_context');
        if (context) context.loseContext();
      }
    };
  }, [emotionScale, mood, isDark]);

  return (
    <div className={cn('relative overflow-hidden rounded-lg', sizeClasses[size], className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Overlay for additional UI elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-center">
          {/* Weather description */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
            {emotionScale === 1 && "Weathering the Storm"}
            {emotionScale === 2 && "Gentle Rain"}
            {emotionScale === 3 && "Cloudy Reflection"}
            {emotionScale === 4 && "Hope Breaking Through"}
            {emotionScale === 5 && "Bright & Beautiful"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDWeatherScene;
