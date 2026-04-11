import React, { useMemo, useState } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { GraduationCap, Play, Clock, Star, BookOpen, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useStore } from '@/store/useStore';

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

const certificationQuestions = [
  {
    question: 'Which metric best tracks business health for a new service startup?',
    options: ['Only social media likes', 'Monthly recurring revenue and retention', 'Number of logo colors', 'Office wall size'],
    answer: 1,
  },
  {
    question: 'What is the strongest first step before launching a product?',
    options: ['Spend all budget on ads', 'Validate demand with target customers', 'Copy a random competitor', 'Skip pricing strategy'],
    answer: 1,
  },
  {
    question: 'Why is cash flow management critical for small businesses?',
    options: ['It avoids stock photos', 'It ensures bills and operations can be paid on time', 'It increases font quality', 'It removes taxes'],
    answer: 1,
  },
  {
    question: 'Best way to improve customer retention is to:',
    options: ['Ignore feedback', 'Offer consistent quality and responsive support', 'Change brand name every week', 'Remove follow-ups'],
    answer: 1,
  },
  {
    question: 'A practical growth strategy for women-led businesses is:',
    options: ['No planning, only trends', 'Partnerships + data-backed decision making', 'Only discounts forever', 'Avoid financial tracking'],
    answer: 1,
  },
];

const Learning = () => {
  const { user } = useStore();
  const [notice, setNotice] = useState('');
  const [quizOpen, setQuizOpen] = useState(false);
  const [answers, setAnswers] = useState<number[]>(Array(certificationQuestions.length).fill(-1));
  const [score, setScore] = useState<number | null>(null);

  const learnerName = useMemo(() => user?.displayName || 'SheShark Learner', [user?.displayName]);

  const generateCertificate = (finalScore: number) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const today = new Date().toLocaleDateString('en-IN');

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(255, 77, 148);
    doc.setLineWidth(2);
    doc.rect(8, 8, 281, 194, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(30, 41, 59);
    doc.text('Certificate of Business Excellence', 148.5, 42, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text('This certificate is proudly presented to', 148.5, 66, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 77, 148);
    doc.text(learnerName, 148.5, 82, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text('for successfully completing the SheShark Business Certification Quiz', 148.5, 98, { align: 'center' });
    doc.text(`Score: ${finalScore}/5 (Pass mark: 3/5)`, 148.5, 110, { align: 'center' });
    doc.text(`Date: ${today}`, 148.5, 122, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text('SheShark Learning Center', 148.5, 150, { align: 'center' });

    const fileSafeName = learnerName.replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`SheShark_Business_Certificate_${fileSafeName}.pdf`);
  };

  const submitQuiz = () => {
    if (answers.includes(-1)) {
      setNotice('Please answer all 5 questions before submitting.');
      return;
    }

    const total = answers.reduce((acc, answer, idx) => acc + (answer === certificationQuestions[idx].answer ? 1 : 0), 0);
    setScore(total);

    if (total >= 3) {
      setNotice(`Great work ${learnerName}! You scored ${total}/5. Certificate downloaded.`);
      generateCertificate(total);
    } else {
      setNotice(`You scored ${total}/5. Minimum 3 correct answers required. Please try again.`);
    }
  };

  const resetQuiz = () => {
    setAnswers(Array(certificationQuestions.length).fill(-1));
    setScore(null);
    setNotice('Quiz reset. You can attempt again now.');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Learning Center</h1>
          <p className="text-slate-500">Master the skills to lead the clean energy revolution.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="glass w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center gap-3">
            <Award className="text-primary" size={20} />
            <span className="font-bold">12 Certificates Earned</span>
          </div>
        </div>
      </div>

      {notice && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{notice}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {courses.map((course) => (
          <GlassCard key={course.id} className="p-0 overflow-hidden group cursor-pointer" onClick={() => setNotice(`Opened: ${course.title}`)}>
            <div className="relative h-40 sm:h-48">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-xl">
                  <Play fill="currentColor" size={20} />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                <BookOpen size={14} /> {course.duration}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{course.title}</h3>
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 p-2 sm:p-4">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold">Ready for your certification?</h3>
            <p className="text-white/80">Complete the final quiz to earn your SheShark Solar Expert certificate.</p>
          </div>
          <Button
            variant="secondary"
            className="px-10"
            onClick={() => {
              setQuizOpen(true);
              setNotice('Business certification quiz opened. Complete all 5 MCQs.');
            }}
          >
            Take Quiz Now
          </Button>
        </div>
      </GlassCard>

      {quizOpen && (
        <GlassCard className="space-y-4 sm:space-y-6 border border-primary/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl sm:text-2xl font-bold">Business Certification Quiz</h3>
            <span className="text-sm font-semibold text-slate-500">5 MCQ • Pass if 3+ correct</span>
          </div>

          <div className="space-y-5">
            {certificationQuestions.map((item, qIndex) => (
              <div key={item.question} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">Q{qIndex + 1}. {item.question}</p>
                <div className="mt-3 space-y-2">
                  {item.options.map((option, oIndex) => (
                    <label key={option} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={answers[qIndex] === oIndex}
                        onChange={() =>
                          setAnswers((prev) => {
                            const next = [...prev];
                            next[qIndex] = oIndex;
                            return next;
                          })
                        }
                      />
                      <span className="text-sm text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={submitQuiz}>Submit Quiz</Button>
            <Button variant="secondary" onClick={resetQuiz}>Reset</Button>
            <Button variant="ghost" onClick={() => setQuizOpen(false)}>Close Quiz</Button>
          </div>

          {score !== null && (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Your score: <span className="font-bold">{score}/5</span> • {score >= 3 ? 'Passed' : 'Not Passed'}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};

import { Award } from 'lucide-react';
export default Learning;
 
