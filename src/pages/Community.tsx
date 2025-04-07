
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import ShravanBot from '@/components/ShravanBot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageSquare, Calendar, Users } from 'lucide-react';

// Mock data
const initialPosts = [
  {
    id: 1,
    author: {
      name: "Raj Sharma",
      avatar: "/avatar-parent.png",
      initials: "RS"
    },
    content: "Just completed my first set of exercises using the Physio Assistant! My knees feel much better already. Anyone else trying the Sit & Reach exercise?",
    likes: 12,
    comments: 3,
    time: "2 hours ago"
  },
  {
    id: 2,
    author: {
      name: "Anita Desai",
      avatar: "/avatar-parent2.png",
      initials: "AD"
    },
    content: "Good morning everyone! I just learned a new healthy recipe that helps with blood pressure control. Would anyone be interested if I share it here?",
    likes: 24,
    comments: 5,
    time: "5 hours ago"
  },
  {
    id: 3,
    author: {
      name: "Vikram Patel",
      avatar: "/avatar-parent3.png",
      initials: "VP"
    },
    content: "Has anyone tried meditation for better sleep? I've been having trouble sleeping lately and would appreciate any tips from this wonderful community.",
    likes: 15,
    comments: 8,
    time: "Yesterday"
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Virtual Yoga Session",
    host: "Meera Sharma",
    time: "Tomorrow, 10:00 AM",
    participants: 12
  },
  {
    id: 2,
    title: "Healthy Cooking Demo",
    host: "Anita Desai",
    time: "Apr 10, 2:00 PM",
    participants: 8
  },
  {
    id: 3,
    title: "Memory Games Workshop",
    host: "Dr. Vikram Singh",
    time: "Apr 12, 11:00 AM",
    participants: 15
  }
];

export default function Community() {
  const { user, isAuthenticated, userRole } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 } 
        : post
    ));
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    const newPostObj = {
      id: posts.length + 1,
      author: {
        name: user?.name || "User",
        avatar: user?.avatar || "",
        initials: user?.name?.split(' ').map(n => n[0]).join('') || "U"
      },
      content: newPost,
      likes: 0,
      comments: 0,
      time: "Just now"
    };
    
    setPosts([newPostObj, ...posts]);
    setNewPost('');
    
    toast({
      title: "Post Shared",
      description: "Your post has been shared with the community."
    });
  };

  const joinEvent = (eventId: number) => {
    toast({
      title: "Event Joined",
      description: "You've successfully joined the event. We'll remind you when it's time."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">SHRAVAN Community</h1>
            <p className="text-muted-foreground">Connect with others, share experiences, and attend virtual events</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creator */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-shravan-mint text-primary-foreground">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts with the community..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="resize-none mb-3"
                    />
                    <Button 
                      onClick={handleSubmitPost}
                      className="bg-shravan-mint text-primary-foreground hover:bg-shravan-darkMint"
                    >
                      Share Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Posts */}
            {posts.map(post => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback className="bg-shravan-lavender text-accent-foreground">
                        {post.author.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{post.author.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-1"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className="h-4 w-4" /> {post.likes}
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> {post.comments}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">Hosted by {event.host}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm">{event.time}</p>
                      <div className="flex items-center text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {event.participants}
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-3 bg-shravan-blue text-white hover:bg-shravan-darkBlue"
                      size="sm"
                      onClick={() => joinEvent(event.id)}
                    >
                      Join Event
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Active Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["RS", "AD", "VP", "MS", "SK", "RK", "BG", "PT"].map((initials, i) => (
                    <Avatar key={i}>
                      <AvatarFallback className={`
                        ${i % 4 === 0 ? 'bg-shravan-mint text-primary-foreground' : ''}
                        ${i % 4 === 1 ? 'bg-shravan-peach text-secondary-foreground' : ''}
                        ${i % 4 === 2 ? 'bg-shravan-blue text-white' : ''}
                        ${i % 4 === 3 ? 'bg-shravan-lavender text-accent-foreground' : ''}
                      `}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    View All Members
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Be respectful and kind to all members</li>
                  <li>Avoid sharing personal medical advice</li>
                  <li>Respect others' privacy and confidentiality</li>
                  <li>Focus on supportive and positive interactions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {userRole === 'parent' && <ShravanBot />}
    </div>
  );
}
