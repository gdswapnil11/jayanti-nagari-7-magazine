export interface Story {
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
}

export interface EventItem {
  title: string;
  date: string;
  location: string;
  description: string;
}

export type CommunityCategory =
  | 'Doctors'
  | 'IT Professionals'
  | 'Health & Wellness'
  | 'Cooking & Nutrition'
  | 'Yoga & Fitness'
  | 'Home Services'
  | 'Other Professionals';

export interface CommunityItem {
  vendor: string;
  service: string;
  category: CommunityCategory;
  description: string;
  detail: string;
  contact: string;
  phone: string;
  icon: string;
}

export interface Article {
  id: number | string;
  title: string;
  author: string;
  authorImage?: string;
  category: 'Community & Society Updates' | 'Maintenance & Eco-Living' | 'Sports, Youth & Events' | 'Culture, Arts & Literature' | 'Health, Fitness & Wellness' | 'Recipes & Culinary Corner' | 'Senior Citizens & Wisdom' | 'Kids & Student Achievements' | 'General & Opinion';
  excerpt: string;
  content: string;
  date: string;
  month: string;
  image?: string;
}

export interface GalleryPhoto {
  title: string;
  category: string;
  url: string;
}

export interface Announcement {
  title: string;
  date: string;
  body: string;
}

export interface Advertisement {
  title: string;
  image: string;
  href: string;
  description: string;
}

export interface EditionSummary {
  id: string;
  title: string;
  quarter: string;
  year: number;
  published: boolean;
}

export interface MagazineManifest {
  currentEdition: string;
  editions: EditionSummary[];
}

export interface MoveInListing {
  id: number;
  title: string;
  type: 'For Sale' | 'For Rent';
  price: string;
  location: string;
  area: string;
  bedrooms: string;
  description: string;
  contact: string;
  postedBy: string;
}

export interface MagazineEdition extends EditionSummary {
  stories: Story[];
  events: EventItem[];
  community: CommunityItem[];
  moveInCorner: MoveInListing[];
  articles: Article[];
  gallery: GalleryPhoto[];
  announcements: Announcement[];
  advertisements: Advertisement[];
}
