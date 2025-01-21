"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { POINTS } from "@/lib/points";
import type { LeetCodeUser } from "@/lib/types";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LeaderboardProps {
  users: LeetCodeUser[];
}

export default function Leaderboard({ users: initialUsers }: LeaderboardProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/cron");
      if (response.ok) {
        const updatedUsersResponse = await fetch("/api/users");
        if (updatedUsersResponse.ok) {
          const updatedUsers = await updatedUsersResponse.json();
          setUsers(updatedUsers);
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setIsRefreshing(false);
    setTimeLeft(5 * 60); // Reset timer to 5 minutes
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  const formattedTime = `${Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;

  const sortedUsers = [...users].sort((a, b) => b.score - a.score);

  if (!mounted) {
    return null;
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <div className="flex items-center space-x-4">
            \\ <Button onClick={refreshData} disabled={isRefreshing}>
             \\ <RefreshCw className="mr-2 h-4 w-4" />
              \\Refresh
           \\ </Button>
            <div className="text-sm text-gray-600">
              Next update in: <span className="font-bold">{formattedTime}</span>
            </div>
          </div>
        </div>
        <div className="mb-4 flex space-x-6">
          <div>
            <strong>EASY</strong> = {POINTS.EASY} points
          </div>
          <div>
            <strong>MEDIUM</strong> = {POINTS.MEDIUM} points
          </div>
          <div>
            <strong>HARD</strong> = {POINTS.HARD} points
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] md:w-[100px]">Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Easy</TableHead>
                <TableHead className="text-right">Medium</TableHead>
                <TableHead className="text-right">Hard</TableHead>
                <TableHead className="text-right">Total Solved</TableHead>
                <TableHead className="text-right">Submissions</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => (
                <TableRow key={user.username}>
                  <TableCell className="font-medium select-none">
                    {index === 0 ? (
                      <Badge className="bg-yellow-500">1st</Badge>
                    ) : index === 1 ? (
                      <Badge className="bg-gray-400">2nd</Badge>
                    ) : index === 2 ? (
                      <Badge className="bg-amber-600">3rd</Badge>
                    ) : (
                      `${index + 1}th`
                    )}
                  </TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center">
                      <img
                        src={user.profileUrl}
                        alt="P"
                        className="w-8 h-8 rounded-md"
                      />
                    </div>
                    <Link
                      href={`https://leetcode.com/u/${user.username}`}
                      target="_blank"
                      className="hover:text-blue-400 hover:underline"
                    >
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-600">{user.easySolved}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-yellow-600">{user.mediumSolved}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600">{user.hardSolved}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.totalSolved}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.totalSubmissions}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {user.score}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}