'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from 'react';
import db from "@/lib/db";

// Update types to focus on Reddit accounts
type UserWithRedditAccounts = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  RedditAccount: Array<{
    id: string;
    redditUsername: string;
    karmaCount: number;
    createdAt: Date;
  }>;
};

async function getUsers() {
  const users = await db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      RedditAccount: {
        select: {
          id: true,
          redditUsername: true,
          karmaCount: true,
          createdAt: true,
        },
        orderBy: {
          karmaCount: 'desc'
        }
      }
    },
    // Only get users who have Reddit accounts
    where: {
      RedditAccount: {
        some: {}
      }
    }
  });
  return users;
}

const UsersPage = async () => {
  const users = await getUsers();
  
  return (
    <div className="container mx-auto py-10">
    <Card>
    <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Reddit Account Analytics</CardTitle>
    <div className="text-sm text-muted-foreground">
    Total Accounts: {users.reduce((acc, user) => acc + user.RedditAccount.length, 0)}
    </div>
    </CardHeader>
    <CardContent>
    <Table>
    <TableHeader>
    <TableRow>
    <TableHead>Expand</TableHead>
    <TableHead>User</TableHead>
    <TableHead>Account Count</TableHead>
    <TableHead>Total Karma</TableHead>
    </TableRow>
    </TableHeader>
    <TableBody>
    {users.map((user) => (
      <ExpandableRow key={user.id} user={user} />
    ))}
    </TableBody>
    </Table>
    </CardContent>
    </Card>
    </div>
  );
};

const ExpandableRow = ({ user }: { user: UserWithRedditAccounts }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalKarma = user.RedditAccount.reduce((acc, account) => acc + account.karmaCount, 0);
  
  // Function to get color based on karma count
  const getKarmaColor = (karma: number) => {
    if (karma > 100000) return "text-green-500";
    if (karma > 50000) return "text-blue-500";
    if (karma > 10000) return "text-yellow-500";
    return "text-gray-500";
  };
  
  // Function to format karma count
  const formatKarma = (karma: number) => {
    if (karma > 1000000) return `${(karma / 1000000).toFixed(1)}M`;
    if (karma > 1000) return `${(karma / 1000).toFixed(1)}K`;
    return karma.toString();
  };
  
  return (
    <>
    <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
    <TableCell>
    <Button
    variant="ghost"
    size="sm"
    >
    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
    </TableCell>
    <TableCell className="font-medium">
    {user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.email || "Anonymous User"}
      </TableCell>
      <TableCell>
      <Badge variant="outline">
      {user.RedditAccount.length} {user.RedditAccount.length === 1 ? 'account' : 'accounts'}
      </Badge>
      </TableCell>
      <TableCell>
      <span className={`font-bold ${getKarmaColor(totalKarma)}`}>
      {formatKarma(totalKarma)}
      </span>
      </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
        <TableCell colSpan={4}>
        <div className="p-4 bg-muted/50 rounded-lg">
        <Table>
        <TableHeader>
        <TableRow>
        <TableHead>Reddit Username</TableHead>
        <TableHead>Karma</TableHead>
        <TableHead>Account Age</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {user.RedditAccount.map((account) => (
          <TableRow key={account.id}>
          <TableCell className="font-mono">
          u/{account.redditUsername}
          </TableCell>
          <TableCell>
          <span className={`font-bold ${getKarmaColor(account.karmaCount)}`}>
          {formatKarma(account.karmaCount)}
          </span>
          </TableCell>
          <TableCell>
          {new Date(account.createdAt).toLocaleDateString()}
          </TableCell>
          </TableRow>
        ))}
        </TableBody>
        </Table>
        </div>
        </TableCell>
        </TableRow>
      )}
      </>
    );
  };
  
  export default UsersPage;