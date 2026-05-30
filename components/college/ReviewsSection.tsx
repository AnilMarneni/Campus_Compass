'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquarePlus, User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface ReviewsSectionProps {
  collegeId: string;
  reviews: Review[];
}

export default function ReviewsSection({ collegeId, reviews: initialReviews }: ReviewsSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error('Please log in to submit a review.');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Review comment must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/colleges/${collegeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');
      
      // Update local reviews list
      const newReview: Review = data.data;
      setReviews((prev) => [newReview, ...prev]);
      
      // Clear form
      setComment('');
      setRating(5);
      
      // Refresh page data
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while posting your review.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left 2 Cols: Reviews list */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-bold text-lg text-gray-900 flex items-center">
          Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-500">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border border-gray-150 shadow-2xs">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-full bg-slate-100 text-slate-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-800">
                          {review.userName}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex bg-slate-50 px-2 py-1 border border-slate-100 rounded-md items-center">
                      <span className="text-xs font-bold text-gray-700 mr-1">{review.rating}</span>
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-1">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right Col: Write a review form */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-gray-900 flex items-center border-b border-gray-100 pb-3">
            <MessageSquarePlus className="h-4.5 w-4.5 text-indigo-600 mr-2" />
            Write a Review
          </h3>

          {session ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-all hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-200 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-gray-500">
                    {rating} out of 5
                  </span>
                </div>
              </div>

              {/* Comment text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Your Experience</label>
                <textarea
                  placeholder="Share details of your college experience (faculty, facilities, placements, campus life)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-gray-200 focus:border-indigo-500 rounded-lg text-sm bg-gray-50/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <p className="text-[10px] text-gray-400">
                  Minimum 10 characters. Please be honest and respectful.
                </p>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2"
              >
                Submit Review
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 px-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
              <p className="text-xs text-gray-500 leading-normal">
                You must be logged in to share your review and rate this institution.
              </p>
              <Button
                onClick={() => window.location.href = '/login'}
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold"
              >
                Log In to Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
