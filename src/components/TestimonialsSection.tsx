import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "California, USA",
      amount: "$2,400",
      text: "I've been playing for 3 months and already cashed out over $2,400! The games are fair and payouts are instant.",
      rating: 5,
      verified: true
    },
    {
      name: "Mike R.",
      location: "Texas, USA",
      amount: "$1,850",
      text: "Best bingo site I've ever used. Won my first jackpot within a week! Customer support is amazing too.",
      rating: 5,
      verified: true
    },
    {
      name: "Jennifer L.",
      location: "Florida, USA",
      amount: "$3,200",
      text: "The VIP program is incredible. I get special bonuses and access to exclusive high-stakes rooms.",
      rating: 5,
      verified: true
    },
    {
      name: "David K.",
      location: "New York, USA",
      amount: "$950",
      text: "Mobile app works perfectly. I can play during my commute and have already won several times!",
      rating: 5,
      verified: true
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">
            💬 What Our Winners Say
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied players who are winning real money every day!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:border-green-500 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <span className="text-green-400 text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">{testimonial.amount}</div>
                      <div className="text-gray-500 text-xs">Total Won</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 inline-block">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-green-400 mb-1">4.9/5</div>
                <div className="text-gray-300 text-sm">Average Rating</div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-400 mb-1">15K+</div>
                <div className="text-gray-300 text-sm">Reviews</div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-400 mb-1">98%</div>
                <div className="text-gray-300 text-sm">Recommend</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;