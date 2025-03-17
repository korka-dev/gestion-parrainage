const { execSync } = require('child_process');

try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

