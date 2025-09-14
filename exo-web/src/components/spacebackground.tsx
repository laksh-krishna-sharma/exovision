import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];

    let mouseX = 0;
    let mouseY = 0;

    const generateStars = () => {
      stars = [];
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.2,
          alpha: Math.random() * 0.5 + 0.5,
        });
      }
    };

    generateStars();

    const drawStars = () => {
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.globalAlpha = star.alpha;

        const offsetX = (mouseX / window.innerWidth - 0.5) * 20;
        const offsetY = (mouseY / window.innerHeight - 0.5) * 20;

        ctx.fillRect(star.x + offsetX, star.y + offsetY, star.size, star.size);
      });
      ctx.globalAlpha = 1;
    };

    const updateStars = () => {
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        star.alpha += (Math.random() - 0.5) * 0.05;
        star.alpha = Math.min(1, Math.max(0.2, star.alpha));
      });
    };

    const spawnShootingStar = () => {
      if (Math.random() < 0.02) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 2),
          length: Math.random() * 80 + 50,
          speed: Math.random() * 10 + 6,
          opacity: 1,
        });
      }
    };

    const drawShootingStars = () => {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        ctx.strokeStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length, star.y + star.length);
        ctx.stroke();

        star.x += star.speed;
        star.y -= star.speed;
        star.opacity -= 0.02;

        if (star.opacity <= 0) {
          shootingStars.splice(i, 1);
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateStars();
      drawStars();
      spawnShootingStar();
      drawShootingStars();

      animationId = requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars();
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ display: "block", width: "100vw", height: "100vh" }}
    />
  );
}