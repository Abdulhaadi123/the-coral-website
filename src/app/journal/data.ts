export interface BlogPost {
  id: string;
  badge: string;
  category: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  slug: string;
  content?: {
    paragraphs: string[];
    subheading?: string;
    subheadingParagraphs?: string[];
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    badge: 'Marketing',
    category: 'Digital Marketing',
    date: 'Apr 16, 2026',
    title: 'Create a Social Media Content Strategy in 2026',
    subtitle: 'Digital tips and tricks to help you improve efficiency, be more productive and grow your business.',
    description:
      'Learn how a social media agency in Dubai builds a modern content strategy using AI, creators, and scalable systems to produce and optimise content in 2026.',
    image: '/images/journal/post1.webp',
    slug: 'create-a-social-media-content-strategy-in-2026',
    content: {
      paragraphs: [
        'For years, the search strategy had a simple centre of gravity: the keyword. People typed a query into Google, scanned a page of results, compared a few links, and clicked through to the website that looked most relevant. Businesses built entire marketing systems around that behaviour. Ranking position mattered because visibility was largely arranged in a list, and the closer your brand appeared to the top of that list, the more likely you were to win the click.',
        'That version of search is not disappearing overnight, but it is becoming less dominant. Google has not announced that it is removing the search bar, and it would be misleading to claim that classic search is being switched off. What is clear, however, is that Google is steadily moving search towards AI-led experiences where users ask fuller questions, receive summarised answers, continue with follow-up prompts, and rely on AI to compare information before they ever visit a website. That shift changes the meaning of visibility. In the traditional search model, the question was, "Where do we rank?" In the AI search model, the question becomes, "Are we mentioned, trusted, cited, and understood well enough to be included in the answer?" For a business working with a digital marketing agency, this is not a small tactical adjustment. It changes how websites are structured, how content is written, how authority is built, and how brands measure search performance.',
        'The uncomfortable truth is that many businesses are still preparing for the search environment that made sense five years ago. They are chasing keyword positions while AI systems are beginning to evaluate broader signals: brand mentions, entity consistency, expert content, third-party validation, structured information, customer proof, and the ability to answer complex questions with confidence. The brands that adapt early will not simply be "ranking" in the old sense. They will become the names AI systems repeatedly surface when customers ask who to trust, compare, shortlist, or buy from.'
      ],
      subheading: 'The Search Bar Is Not Vanishing Yet, but the Search Journey Is Already Changing',
      subheadingParagraphs: [
        'The search bar used to represent a very specific behaviour: the user knew roughly what they wanted, compressed that need into a few words, and waited for Google to return a ranked set of links. That behaviour still exists, especially for navigational searches, local intent, quick facts, and product research. The change is that Google is increasingly allowing users to ask more complex, layered questions in one go, then receive an organised AI-generated response rather than a simple list of pages.',
        'Google describes AI Mode as its most powerful AI search experience, capable of handling complex questions, supporting follow-up prompts, and using a "query fan-out" technique that breaks a question into subtopics and searches across them simultaneously. That matters because it means Google is no longer only matching a page to a keyword. It is trying to understand a task, divide that task into smaller information needs, retrieve supporting material, and assemble a useful response from multiple sources.'
      ]
    }
  },
  {
    id: 'post-2',
    badge: 'Marketing',
    category: 'Digital Marketing',
    date: 'Apr 8, 2026',
    title: 'Digital Marketing Agency Guide To Turn Website Traffic into Leads in 2026',
    subtitle: 'Digital tips and tricks to help you improve efficiency, be more productive and grow your business.',
    description:
      'Learn how a digital marketing agency in Dubai uses AI, content systems, and modern strategies to turn website traffic into consistent lead generation.',
    image: '/images/journal/post2.webp',
    slug: 'digital-marketing-agency-guide-to-turn-website-traffic-into-leads-in-2026',
    content: {
      paragraphs: [
        'Turning website traffic into qualified leads in 2026 requires more than a simple contact form. Today’s buyers expect interactive experiences, immediate value, and tailored pathways based on their specific challenges and intent.',
        'High-performing digital brands align their content, UX, and conversion architecture so every visitor finds a natural next step that moves them seamlessly from curiosity to commitment.'
      ],
      subheading: 'Building Intent-Driven Conversion Funnels',
      subheadingParagraphs: [
        'By analyzing real-time user behavior, intent signals, and drop-off points, modern agencies create frictionless conversion touchpoints that turn passive pageviews into high-intent inbound opportunities.'
      ]
    }
  },
  {
    id: 'post-3',
    badge: 'Website Production',
    category: 'Website Production',
    date: 'Mar 20, 2026',
    title: 'Best Font Pairings for Website Design in 2026',
    subtitle: 'Digital tips and tricks to help you improve efficiency, be more productive and grow your business.',
    description:
      'The right font pairing in 2026 enhances readability, strengthens brand perception, and optimises website performance across desktop and mobile devices.',
    image: '/images/journal/post3.webp',
    slug: 'best-font-pairings-for-website-design-in-2026',
    content: {
      paragraphs: [
        'Typography is the voice of your digital interface. The right typeface choices communicate authority, elegance, innovation, or friendliness before a single paragraph is read.',
        'In 2026, modern web design prioritizes ultra-clean variable fonts, responsive kerning, and distinct pairings between bold geometric headings and highly legible body typefaces.'
      ],
      subheading: 'Balancing Aesthetics with Web Performance',
      subheadingParagraphs: [
        'Optimizing font delivery with modern formats like WOFF2, subsets, and local caching ensures that beautiful typography elevates your brand without compromising core web vitals or page load speeds.'
      ]
    }
  },
];
