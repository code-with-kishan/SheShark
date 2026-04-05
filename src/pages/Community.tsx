import React, { useMemo, useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { MessageCircle, Heart, Share2, Plus, Image as ImageIcon, Send } from 'lucide-react';
import { useStore } from '@/store/useStore';

type FeedPost = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  liked?: boolean;
  commentsList: Array<{ id: string; author: string; text: string; time: string }>;
};

const seedPosts: FeedPost[] = [
  {
    id: '1',
    author: 'Elena Gilbert',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Gilbert',
    content: 'Just installed my first 5kW solar system! The energy savings are incredible. Thanks to the SheShark community for the guidance. ⚡🌱',
    image: 'https://picsum.photos/seed/post1/600/400',
    likes: 124,
    comments: 18,
    time: '2 hours ago',
    liked: false,
    commentsList: [
      { id: 'c1', author: 'Bonnie', text: 'This is amazing. Proud of you!', time: '1h ago' },
    ],
  },
  {
    id: '2',
    author: 'Bonnie Bennett',
    avatar: 'https://ui-avatars.com/api/?name=Bonnie+Bennett',
    content: 'Looking for partners for a community solar project in Nairobi. Anyone interested in collaborating? #WomenInSolar #CleanEnergy',
    likes: 85,
    comments: 32,
    time: '5 hours ago',
    liked: false,
    commentsList: [],
  },
];

const Community = () => {
  const { user } = useStore();
  const [posts, setPosts] = useState<FeedPost[]>(seedPosts);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState('');
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const currentUserName = useMemo(() => user?.displayName || 'SheShark Member', [user?.displayName]);
  const currentUserAvatar = useMemo(
    () => user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}`,
    [currentUserName, user?.photoURL]
  );

  const onPickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPostImage(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const onCreatePost = () => {
    const content = postText.trim();
    if (!content) {
      return;
    }
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      author: currentUserName,
      avatar: currentUserAvatar,
      content,
      image: postImage || undefined,
      likes: 0,
      comments: 0,
      time: 'Just now',
      liked: false,
      commentsList: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setPostText('');
    setPostImage('');
  };

  const onToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) {
          return post;
        }
        const liked = !post.liked;
        return {
          ...post,
          liked,
          likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      })
    );
  };

  const onSendComment = (postId: string) => {
    const text = (commentDrafts[postId] || '').trim();
    if (!text) {
      return;
    }
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) {
          return post;
        }
        const nextComment = {
          id: `comment-${Date.now()}`,
          author: currentUserName,
          text,
          time: 'Now',
        };
        return {
          ...post,
          comments: post.comments + 1,
          commentsList: [...post.commentsList, nextComment],
        };
      })
    );
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
  };

  const onShare = async (post: FeedPost) => {
    const shareText = `${post.author}: ${post.content}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SheShark Community', text: shareText, url: window.location.href });
        return;
      } catch {
        // Ignore cancelled share flow.
      }
    }
    await navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Community Feed</h1>
          <p className="text-slate-500">Connect with fellow women entrepreneurs.</p>
        </div>
        <Button className="w-full sm:w-auto" icon={Plus}>New Post</Button>
      </div>

      {/* Create Post */}
      <GlassCard className="flex gap-3 sm:gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
          <img src={currentUserAvatar} alt="Me" />
        </div>
        <div className="flex-1 space-y-4">
          <textarea 
            placeholder="Share your solar journey..." 
            className="w-full bg-transparent border-none focus:ring-0 text-base sm:text-lg resize-none"
            rows={2}
            value={postText}
            onChange={(event) => setPostText(event.target.value)}
          />
          {postImage && (
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <img src={postImage} alt="Selected for post" className="w-full max-h-72 object-cover" />
            </div>
          )}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100">
            <div className="flex gap-4 text-slate-400">
              <label className="cursor-pointer hover:text-primary transition-colors">
                <ImageIcon size={20} />
                <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
              </label>
              <button className="hover:text-primary transition-colors" type="button"><MessageCircle size={20} /></button>
            </div>
            <Button className="py-2 px-6 text-sm" onClick={onCreatePost}>Post</Button>
          </div>
        </div>
      </GlassCard>

      {/* Feed */}
      <div className="space-y-4 sm:space-y-6">
        {posts.map((post) => (
          <GlassCard key={post.id} className="space-y-3 sm:space-y-4">
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
              <Button variant="ghost" className="p-2" onClick={() => onShare(post)}><Share2 size={18} /></Button>
            </div>
            
            <p className="text-slate-700 leading-relaxed">{post.content}</p>
            
            {post.image && (
              <div className="rounded-2xl overflow-hidden">
                <img src={post.image} alt="Post" className="w-full h-auto" />
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onToggleLike(post.id)}
                className={post.liked ? 'flex items-center gap-2 text-primary transition-colors' : 'flex items-center gap-2 text-slate-500 hover:text-primary transition-colors'}
              >
                <Heart size={20} className={post.liked ? 'fill-primary' : ''} /> <span className="font-bold">{post.likes}</span>
              </button>
              <button type="button" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                <MessageCircle size={20} /> <span className="font-bold">{post.comments}</span>
              </button>
            </div>

            {post.commentsList.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                {post.commentsList.slice(-3).map((item) => (
                  <div key={item.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-700">{item.author}: </span>
                    <span className="text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
              <input
                value={commentDrafts[post.id] || ''}
                onChange={(event) => setCommentDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onSendComment(post.id);
                  }
                }}
                placeholder="Write a comment..."
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => onSendComment(post.id)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white hover:brightness-105"
                aria-label="Send comment"
                title="Send"
              >
                <Send size={16} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Community;
