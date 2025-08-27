import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Subreddit {
  display_name: string;
  public_description: string;
  subscribers: number;
  over18: boolean;
  created_utc: number;
  icon_img?: string;
  url: string;
  type?: 'subreddit' | 'user' | 'active-user';
}

interface SubredditCardProps {
  subreddit: Subreddit;
}

export const SubredditCard = ({ subreddit }: SubredditCardProps) => {
  const formatSubscribers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.getFullYear().toString();
  };

  const handleVisitSubreddit = () => {
    window.open(`https://reddit.com${subreddit.url}`, '_blank');
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] bg-gradient-card border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {subreddit.icon_img && (
              <img
                src={subreddit.icon_img}
                alt={`r/${subreddit.display_name} icon`}
                className="w-10 h-10 rounded-full bg-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {subreddit.type === 'user' || subreddit.type === 'active-user' ? 'u/' : 'r/'}{subreddit.display_name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {subreddit.type === 'active-user' && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                    Active Now
                  </Badge>
                )}
                {subreddit.type === 'user' && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    <Users className="w-3 h-3 mr-1" />
                    User
                  </Badge>
                )}
                {subreddit.over18 && (
                  <Badge variant="destructive" className="text-xs px-2 py-0.5">
                    <Shield className="w-3 h-3 mr-1" />
                    NSFW
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleVisitSubreddit}
            className="shrink-0 transition-colors bg-red-600 text-white hover:bg-red-700"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Visit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {subreddit.public_description || "No description available."}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span className="font-medium">{formatSubscribers(subreddit.subscribers)}</span>
              <span>
                {subreddit.type === 'user' || subreddit.type === 'active-user' ? 'karma' : 'members'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Created {formatDate(subreddit.created_utc)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
