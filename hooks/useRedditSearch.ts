import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Subreddit } from "@/components/SubredditCard";
import { REDDIT_CONFIG } from "@/config/reddit";

export const useRedditSearch = () => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const searchSubreddits = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    // ⭐️ Fix: Clear previous results at the start of the search
    setSubreddits([]); 
    
    try {
      // Try multiple approaches for better reliability
      let data;
      let userData;
      
      // Search subreddits
      const redditUrl = `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(query)}&limit=10&sort=relevance`;
      // Search users  
      const userUrl = `https://www.reddit.com/users/search.json?q=${encodeURIComponent(query)}&limit=5&sort=relevance`;
      // Get active users from popular subreddits
      const activeUsersUrl = `https://www.reddit.com/r/popular/comments.json?limit=10`;
      
      const corsProxies = [
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://api.allorigins.win/get?url='
      ];
      
      let subredditData = null;
      let userSearchData = null;
      let activeUsersData = null;
      
      // Try to fetch subreddit data
      for (const proxy of corsProxies) {
        try {
          const proxyUrl = proxy + encodeURIComponent(redditUrl);
          const response = await fetch(proxyUrl);
          
          if (!response.ok) continue;
          
          const responseText = await response.text();
          
          if (proxy.includes('allorigins.win')) {
            const proxyResponse = JSON.parse(responseText);
            subredditData = JSON.parse(proxyResponse.contents);
          } else {
            subredditData = JSON.parse(responseText);
          }
          break;
        } catch (error) {
          console.warn(`Subreddit search failed with proxy: ${proxy}`, error);
          continue;
        }
      }
      
      // Try to fetch user data
      for (const proxy of corsProxies) {
        try {
          const proxyUrl = proxy + encodeURIComponent(userUrl);
          const response = await fetch(proxyUrl);
          
          if (!response.ok) continue;
          
          const responseText = await response.text();
          
          if (proxy.includes('allorigins.win')) {
            const proxyResponse = JSON.parse(responseText);
            userSearchData = JSON.parse(proxyResponse.contents);
          } else {
            userSearchData = JSON.parse(responseText);
          }
          break;
        } catch (error) {
          console.warn(`User search failed with proxy: ${proxy}`, error);
          continue;
        }
      }
      
      // Try to fetch active users data
      for (const proxy of corsProxies) {
        try {
          const proxyUrl = proxy + encodeURIComponent(activeUsersUrl);
          const response = await fetch(proxyUrl);
          
          if (!response.ok) continue;
          
          const responseText = await response.text();
          
          if (proxy.includes('allorigins.win')) {
            const proxyResponse = JSON.parse(responseText);
            activeUsersData = JSON.parse(proxyResponse.contents);
          } else {
            activeUsersData = JSON.parse(responseText);
          }
          break;
        } catch (error) {
          console.warn(`Active users search failed with proxy: ${proxy}`, error);
          continue;
        }
      }
      
      data = subredditData;
      
      let allResults: Subreddit[] = [];
      
      // Process subreddit results
      if (data?.data?.children) {
        const subredditData = data.data.children.map((child: any) => ({
          display_name: child.data.display_name,
          public_description: child.data.public_description || child.data.title || "",
          subscribers: child.data.subscribers || 0,
          over18: child.data.over18 || false,
          created_utc: child.data.created_utc || 0,
          icon_img: child.data.icon_img || child.data.community_icon || "",
          url: child.data.url || `/r/${child.data.display_name}`,
          type: 'subreddit'
        }));
        allResults = [...allResults, ...subredditData];
      }
      
      // Process user results
      if (userSearchData?.data?.children) {
        const userData = userSearchData.data.children.map((child: any) => ({
          display_name: child.data.name,
          public_description: `User • ${child.data.link_karma || 0} karma • Active since ${new Date(child.data.created_utc * 1000).getFullYear()}`,
          subscribers: child.data.link_karma || 0,
          over18: false,
          created_utc: child.data.created_utc || 0,
          icon_img: child.data.icon_img || child.data.snoovatar_img || "",
          url: `/user/${child.data.name}`,
          type: 'user'
        }));
        allResults = [...allResults, ...userData];
      }
      
      // Process active users from recent comments
      if (activeUsersData?.data?.children) {
        const activeUsers = new Map();
        
        activeUsersData.data.children.forEach((child: any) => {
          const author = child.data.author;
          const karma = child.data.author_flair_text || child.data.ups || 0;
          
          if (author && author !== '[deleted]' && !activeUsers.has(author) && 
              author.toLowerCase().includes(query.toLowerCase())) {
            activeUsers.set(author, {
              display_name: author,
              public_description: `Active User • Recently commented • ${karma} comment karma`,
              subscribers: typeof karma === 'number' ? karma : 0,
              over18: false,
              created_utc: Date.now() / 1000,
              icon_img: "",
              url: `/user/${author}`,
              type: 'active-user'
            });
          }
        });
        
        allResults = [...allResults, ...Array.from(activeUsers.values()).slice(0, 3)];
      }
      
      if (allResults.length > 0) {
        setSubreddits(allResults);
      } else {
        setSubreddits([]);
        toast({
          title: "No results found",
          description: `No results found for "${query}". Try different keywords.`,
        });
      }
    } catch (error) {
      console.error("Error searching subreddits:", error);
      setSubreddits([]);
      toast({
        title: "Search failed",
        description: "Unable to search subreddits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subreddits,
    isLoading,
    hasSearched,
    searchSubreddits,
  };
};
