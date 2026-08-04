import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface JournalPost {
  id: string;
  badge: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

const posts: JournalPost[] = [
  {
    id: 'post-1',
    badge: 'Marketing',
    date: 'Apr 16, 2026',
    title: 'Create a Social Media Content Strategy in 2026',
    description: 'Learn how a social media agency in Dubai builds a modern content strategy using AI, creators, and scalable systems to produce and optimise content in 2026.',
    image: '/images/journal/post1.webp',
  },
  {
    id: 'post-2',
    badge: 'Marketing',
    date: 'Apr 3, 2026',
    title: 'Digital Marketing Agency Guide To Turn Website Traffic into Leads in 2026',
    description: 'Learn how a digital marketing agency in Dubai uses AI, content systems, and modern strategies to turn website traffic into consistent lead generation.',
    image: '/images/journal/post2.webp',
  },
  {
    id: 'post-3',
    badge: 'Website Production',
    date: 'Mar 20, 2026',
    title: 'Best Font Pairings for Website Design in 2026',
    description: 'The right font pairing in 2026 enhances readability, strengthens brand perception, and optimises website performance across desktop and mobile devices.',
    image: '/images/journal/post3.webp',
  },
];

export const JournalSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F9FAFB] py-20 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          {/* Section Title with Gradient Branding */}
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111827]">
            <span className="text-[#85E868]">The </span>
            <span className="text-[#9FE66F]">Coral </span>
            <span className="text-[#32CEC6]">Room </span>
            <span className="text-[#111827]">: Journal</span>
          </h2>

          {/* View All Posts Button */}
          <Link href="/marketing" className="px-6 py-2.5 rounded-full border border-gray-400 text-gray-700 hover:text-black hover:border-black text-xs sm:text-sm font-semibold transition-all duration-300">
            View all posts
          </Link>
        </div>

        {/* 3 Journal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="bg-gray-100/70 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
            >
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  {/* Badge & Date */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-[11px] font-semibold">
                      {post.badge}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#111827] leading-snug mb-3 group-hover:text-[#21A0A3] transition-colors duration-200">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {post.description}
                  </p>
                </div>

                {/* Read More Link */}
                <Link 
                  href="/marketing" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-black group-hover:translate-x-1 transition-all duration-200"
                >
                  <span>Read more</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default JournalSection;
