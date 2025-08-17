'use client';

import React from 'react';
import { 
  Medal, 
  Trophy, 
  Star,
  Crown,
  User
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  address: string;
  score: number;
  eventsWon: number;
  totalRewards: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'BuildMaster',
    address: 'ST1ABC...DEF',
    score: 2450,
    eventsWon: 12,
    totalRewards: 1250
  },
  {
    rank: 2,
    username: 'LandLord',
    address: 'ST2GHI...JKL',
    score: 2180,
    eventsWon: 8,
    totalRewards: 890
  },
  {
    rank: 3,
    username: 'ResourceKing',
    address: 'ST3MNO...PQR',
    score: 1920,
    eventsWon: 6,
    totalRewards: 675
  },
  {
    rank: 4,
    username: 'ArchitectPro',
    address: 'ST4STU...VWX',
    score: 1750,
    eventsWon: 5,
    totalRewards: 520
  },
  {
    rank: 5,
    username: 'CityBuilder',
    address: 'ST5YZA...BCD',
    score: 1580,
    eventsWon: 4,
    totalRewards: 445
  }
];

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Medal className="w-4 h-4 text-orange-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-2">
      {mockLeaderboard.map((entry) => (
        <div 
          key={entry.rank}
          className={`rounded-lg p-3 transition-all duration-200 hover:shadow-sm ${
            entry.rank <= 3 ? 'border-2 border-opacity-50' : 'bg-gray-50'
          } ${
            entry.rank === 1 ? 'border-yellow-300' :
            entry.rank === 2 ? 'border-gray-300' :
            entry.rank === 3 ? 'border-orange-300' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            {/* Rank */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(entry.rank)}`}>
              {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900 text-sm truncate">
                  {entry.username}
                </h4>
                {entry.rank === 1 && <Crown className="w-3 h-3 text-yellow-500" />}
              </div>
              <p className="text-xs text-gray-500 truncate">{entry.address}</p>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">
                {entry.score.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Events Won:</span>
              <span className="font-medium text-gray-900">{entry.eventsWon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rewards:</span>
              <span className="font-medium text-gray-900">{entry.totalRewards} STX</span>
            </div>
          </div>
        </div>
      ))}

      {/* View More */}
      <div className="text-center pt-2">
        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
}
