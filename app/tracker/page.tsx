"use client";

import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { SubredditCard } from "@/components/SubredditCard";
import { useRedditSearch } from "@/hooks/useRedditSearch";
import { MessageSquare, TrendingUp, Search as SearchIcon } from "lucide-react";

const TrackerPage = () => {
  const { subreddits, isLoading, hasSearched, searchSubreddits } =
    useRedditSearch();

  return (
    <div className="min-h-screen bg-pink-100 text-foreground font-sans">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto p-6">
          {/* Title with icon */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 text-center sm:text-left">
            <div className="p-3 rounded-full shadow-lg bg-gradient-to-br from-red-500 to-red-700">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Reddit Sub Finder
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover subreddits by searching keywords
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={searchSubreddits} isLoading={isLoading} />

          {/* Home Button */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-block rounded-md bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-8">
        {!hasSearched && (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <div className="bg-card border border-border rounded-xl shadow-md p-8 mb-8">
                <SearchIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Find Your Community
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Search for subreddits using keywords related to your
                  interests. Find communities discussing topics you care about,
                  from technology and gaming to hobbies and lifestyle.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                    <span>Popular communities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-red-600" />
                    <span>Real Reddit data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results section */}
        {hasSearched && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {isLoading
                  ? "Searching subreddits..."
                  : subreddits.length > 0
                  ? `Found ${subreddits.length} subreddit${
                      subreddits.length !== 1 ? "s" : ""
                    }`
                  : "No subreddits found"}
              </h2>
            </div>

            {subreddits.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {subreddits.map((subreddit) => (
                  <div
                    key={subreddit.display_name}
                    className="bg-card border border-border rounded-xl shadow-sm p-4"
                  >
                    <SubredditCard subreddit={subreddit} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackerPage;
