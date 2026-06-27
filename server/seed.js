import mongoose from 'mongoose';
import { Admin } from './models/Admin.js';
import { Creator } from './models/Creator.js';
import { Campaign } from './models/Campaign.js';
import { Submission } from './models/Submission.js';
import { env } from './config/env.js';

const seed = async () => {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Admin.deleteMany({});
  await Creator.deleteMany({});
  await Campaign.deleteMany({});
  await Submission.deleteMany({});

  const admin = await Admin.create({
    name: 'Admin User',
    email: 'admin@creatorsmela.com',
    password: 'admin123',
    role: 'admin',
  });

  const moderator = await Admin.create({
    name: 'Alex Moderator',
    email: 'alex@creatorsmela.com',
    password: 'mod123',
    role: 'moderator',
  });

  const creators = await Creator.insertMany([
    { name: 'Sarah Johnson', email: 'sarah@example.com', category: 'Fitness & Lifestyle', followers: 245000, platforms: ['Instagram', 'YouTube'], isVerified: true, riskScore: 25 },
    { name: 'Mike Chen', email: 'mike@example.com', category: 'Tech', followers: 180000, platforms: ['YouTube', 'Twitter'], isVerified: true, riskScore: 15 },
    { name: 'Emma Wilson', email: 'emma@example.com', category: 'Fashion', followers: 320000, platforms: ['Instagram', 'TikTok'], isVerified: false, riskScore: 40 },
    { name: 'James Lee', email: 'james@example.com', category: 'Food & Travel', followers: 95000, platforms: ['Instagram'], isVerified: false, riskScore: 30 },
    { name: 'Sofia Rodriguez', email: 'sofia@example.com', category: 'Art & Design', followers: 150000, platforms: ['Instagram', 'Behance'], isVerified: true, riskScore: 10 },
  ]);

  const campaigns = await Campaign.insertMany([
    { title: 'Nike Summer 2024', description: 'Summer athletic wear campaign', brand: 'Nike', creator: creators[0]._id, budget: 25000, startDate: new Date('2024-06-01'), endDate: new Date('2024-08-31'), status: 'active', category: 'Sports', tags: ['summer', 'athletic'] },
    { title: 'TechGadget Pro', description: 'New gadget review campaign', brand: 'TechGadget', creator: creators[1]._id, budget: 15000, startDate: new Date('2024-03-01'), endDate: new Date('2024-05-31'), status: 'active', category: 'Technology', tags: ['gadgets', 'review'] },
  ]);

  await Submission.insertMany([
    { title: 'Nike Summer Campaign', description: 'Comprehensive summer campaign partnership', type: 'campaign', status: 'pending', priority: 'high', creator: creators[0]._id, campaign: campaigns[0]._id, submittedBy: admin._id, assignedTo: moderator._id, content: { text: 'Excited to partner with Nike!', mediaUrls: [], links: [] }, tags: ['brand', 'urgent'], riskScore: 25 },
    { title: 'Creator Profile Update', description: 'Updated bio and portfolio', type: 'creator_profile', status: 'pending', priority: 'medium', creator: creators[1]._id, submittedBy: admin._id, content: { text: 'Updated professional profile', mediaUrls: [], links: [] }, tags: ['profile'], riskScore: 15 },
    { title: 'Product Review Content', description: 'TechGadget review submission', type: 'content', status: 'under_review', priority: 'low', creator: creators[2]._id, campaign: campaigns[1]._id, submittedBy: admin._id, assignedTo: moderator._id, content: { text: 'Detailed product review', mediaUrls: [], links: [] }, tags: ['review', 'tech'], riskScore: 40 },
    { title: 'Bio Update Request', description: 'New professional bio', type: 'bio_update', status: 'pending', priority: 'low', creator: creators[3]._id, submittedBy: admin._id, content: { text: 'Updated bio for food niche', mediaUrls: [], links: [] }, tags: ['bio'], riskScore: 30 },
    { title: 'Portfolio Submission', description: 'New portfolio pieces', type: 'portfolio', status: 'changes_requested', priority: 'urgent', creator: creators[4]._id, submittedBy: admin._id, assignedTo: moderator._id, content: { text: 'New art portfolio', mediaUrls: [], links: [] }, tags: ['portfolio', 'creative'], riskScore: 10 },
  ]);

  console.log('Seed completed!');
  console.log('Admin: admin@creatorsmela.com / admin123');
  console.log('Moderator: alex@creatorsmela.com / mod123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
