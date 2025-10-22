// 📁 middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // بررسی وجود پروژه‌ها
  const projectPaths = ['/chess', '/writer', '/quantum', '/security', '/speech'];
  
  if (projectPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    // اعتبارسنجی پروژه
    const projectId = request.nextUrl.pathname.split('/')[1];
    if (!isValidProject(projectId)) {
      return NextResponse.redirect(new URL('/404', request.url));
    }
  }

  return NextResponse.next();
}

function isValidProject(projectId) {
  const validProjects = ['chess', 'writer', 'quantum', 'security', 'speech'];
  return validProjects.includes(projectId);
}
