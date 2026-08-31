import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { ProjectDetailViewer } from '@/components/ProjectDetailViewer';
import { projects as staticProjects } from '../data';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 1. Fetch from Database
  let dbProject = null;
  try {
    dbProject = await prisma.project.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.error('Error querying project from DB:', err);
  }

  // 2. Fallback to static data
  const staticProject = staticProjects.find((p) => p.slug === slug);

  const project = dbProject || staticProject;

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col w-full overflow-x-hidden select-none">
      {/* Top Navbar */}
      <Header />

      {/* Full Screen Showcase Image / Details */}
      <ProjectDetailViewer project={project} />

      {/* Bottom Footer */}
      <FooterSection />
    </main>
  );
}
