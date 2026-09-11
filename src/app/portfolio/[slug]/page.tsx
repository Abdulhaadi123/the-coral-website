import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import { ProjectDetailViewer } from '@/components/ProjectDetailViewer';
import { projects as staticProjects } from '../data';
import prisma from '@/lib/db';
import { assetUrl } from '@/lib/assets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function findProject(slug: string) {
  let dbProject = null;
  try {
    dbProject = await prisma.project.findUnique({ where: { slug } });
  } catch (err) {
    console.error('Error querying project from DB:', err);
  }
  const staticProject = staticProjects.find((p) => p.slug === slug);
  return dbProject || staticProject || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await findProject(params.slug);
  if (!project) return {};

  const description = `${project.title} — a ${project.category} project by The Coral Room${
    project.tags?.length ? `, covering ${project.tags.slice(0, 3).join(', ')}` : ''
  }.`;

  return {
    title: `${project.title} | The Coral Room Portfolio`,
    description,
    openGraph: {
      title: project.title,
      description,
      images: project.image ? [{ url: assetUrl(project.image) }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const project = await findProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-[#111827] flex flex-col w-full overflow-x-clip select-none">
      {/* Top Navbar */}
      <Header />

      {/* Full Screen Showcase Image / Details */}
      <ProjectDetailViewer project={project} />

      {/* Bottom Footer */}
      <FooterSection />
    </main>
  );
}
