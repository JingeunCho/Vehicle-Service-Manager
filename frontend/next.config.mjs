import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      root: __dirname, // Turbopack이 상위 폴더(개인 프로젝트)까지 스캔하지 않도록 명시
    },
    // 외부 IP를 통한 내부 리소스 접근 허용 (폰트 403 오류 해결)
    allowedOrigins: ['localhost:3000'],
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
