import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Users, MessageCircle, Heart, Share2, Plus, Image as ImageIcon } from 'lucide-react';
import { useStore } from '@/store/useStore';

const posts = [
  {
    id: '1',
    author: 'Elena Gilbert',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Gilbert',
    content: 'Just installed my first 5kW solar system! The energy savings are incredible. Thanks to the SheShark community for the guidance. ⚡🌱',
    image: 'https://picsum.photos/seed/post1/600/400',
    likes: 124,
    comments: 18,
    time: '2 hours ago'
  },
  {
    id: '2',
    author: 'Bonnie Bennett',
    avatar: 'https://ui-avatars.com/api/?name=Bonnie+Bennett',
    content: 'Looking for partners for a community solar project in Nairobi. Anyone interested in collaborating? #WomenInSolar #CleanEnergy',
    likes: 85,
    comments: 32,
    time: '5 hours ago'
  }
];

const Community = () => {
  const { user } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Feed</h1>
          <p className="text-slate-500">Connect with fellow women entrepreneurs.</p>
        </div>
        <Button icon={Plus}>New Post</Button>
      </div>

      {/* Create Post */}
      <GlassCard className="flex gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
          <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} alt="Me" />
        </div>
        <div className="flex-1 space-y-4">
          <textarea 
            placeholder="Share your solar journey..." 
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none"
            rows={2}
          />
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex gap-4 text-slate-400">
              <button className="hover:text-primary transition-colors"><ImageIcon size={20} /></button>
              <button className="hover:text-primary transition-colors"><MessageCircle size={20} /></button>
            </div>
            <Button className="py-2 px-6 text-sm">Post</Button>
          </div>
        </div>
      </GlassCard>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <GlassCard key={post.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={post.avatar} alt={post.author} />
                </div>
                <div>
                  <div className="font-bold">{post.author}</div>
                  <div className="text-xs text-slate-400">{post.time}</div>
                </div>
              </div>
              <Button variant="ghost" className="p-2"><Share2 size={18} /></Button>
            </div>
            
            <p className="text-slate-700 leading-relaxed">{post.content}</p>
            
            {post.image && (
              <div className="rounded-2xl overflow-hidden">
                <img src={post.image} alt="Post" className="w-full h-auto" />
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                <Heart size={20} /> <span className="font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                <MessageCircle size={20} /> <span className="font-bold">{post.comments}</span>
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Community;
