import React from 'react';
import { GlassCard, Button } from '@/components/UI';
import { GraduationCap, Play, Clock, Star, BookOpen, CheckCircle } from 'lucide-react';

const courses = [
  {
    id: '1',
    title: 'Solar Entrepreneurship 101',
    instructor: 'Dr. Sarah Chen',
    duration: '6 hours',
    rating: 4.9,
    students: 1200,
    image: 'https://picsum.photos/seed/learn1/400/250'
  },
  {
    id: '2',
    title: 'Advanced Photovoltaics',
    instructor: 'Emma Watson',
    duration: '12 hours',
    rating: 4.8,
    students: 850,
    image: 'https://picsum.photos/seed/learn2/400/250'
  },
  {
    id: '3',
    title: 'Sustainable Business Models',
    instructor: 'Maria Garcia',
    duration: '8 hours',
    rating: 5.0,
    students: 2100,
    image: 'https://picsum.photos/seed/learn3/400/250'
  }
];

const Learning = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Center</h1>
          <p className="text-slate-500">Master the skills to lead the clean energy revolution.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <Award className="text-primary" size={20} />
            <span className="font-bold">12 Certificates Earned</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <GlassCard key={course.id} className="p-0 overflow-hidden group">
            <div className="relative h-48">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-xl">
                  <Play fill="currentColor" size={20} />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                <BookOpen size={14} /> {course.duration}
              </div>
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-4">Instructor: {course.instructor}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                  <Star size={16} fill="currentColor" /> {course.rating}
                </div>
                <div className="text-sm text-slate-400 font-medium">{course.students} students</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="bg-primary text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Ready for your certification?</h3>
            <p className="text-white/80">Complete the final quiz to earn your SheShark Solar Expert certificate.</p>
          </div>
          <Button variant="secondary" className="px-10">Take Quiz Now</Button>
        </div>
      </GlassCard>
    </div>
  );
};

import { Award } from 'lucide-react';
export default Learning;
