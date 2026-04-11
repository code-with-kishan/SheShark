import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Eye, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface HealthModule {
  id: string;
  title: string;
  category: 'periods' | 'pcos' | 'hygiene' | 'mental_health';
  content: string;
  imageUrl?: string;
  order: number;
}

interface HealthModuleResponse {
  id: string;
  title: string;
  category: 'periods' | 'pcos' | 'hygiene' | 'mental_health';
  content: string;
  imageUrl?: string;
  order: number;
}

/**
 * Health Education Component
 * Provides accessible health information for women
 * Multi-language support with stigma-free framing
 */
export const HealthEducation: React.FC = () => {
  const [modules, setModules] = useState<HealthModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<HealthModule | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categoryIcons: Record<string, React.ReactNode> = {
    periods: '🩸',
    pcos: '⚕️',
    hygiene: '🧼',
    mental_health: '🧠',
  };

  const categoryNames: Record<string, string> = {
    periods: 'Menstrual Health',
    pcos: 'PCOS Awareness',
    hygiene: 'Hygiene & Wellness',
    mental_health: 'Mental Health',
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<HealthModuleResponse[]>('/api/health/modules');
      setModules(response.data);

      // Get unique categories
      const uniqueCategories = [...new Set(response.data.map((module) => module.category))] as string[];
      setCategories(uniqueCategories);
      setActiveCategory(uniqueCategories[0] ?? null);
    } catch (error) {
      console.error('Error fetching health modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredModules = activeCategory
    ? modules.filter((m) => m.category === activeCategory)
    : modules;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
          <p className="text-gray-600">Loading health information...</p>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
       <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => setSelectedModule(null)}
          className="text-pink-500 hover:text-pink-600 mb-4 font-medium"
        >
          ← Back to Modules
        </button>

        {selectedModule.imageUrl && (
          <img
            src={selectedModule.imageUrl}
            alt={selectedModule.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedModule.title}</h2>

        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedModule.content}</p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📚 Tip:</strong> This information is educational. Always consult a healthcare professional for medical concerns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Women's Health Education</h2>
        <p className="text-gray-700">
          Learn about your body, health, and wellness in a supportive, judgment-free environment.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              activeCategory === category
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="mr-2">{categoryIcons[category]}</span>
            {categoryNames[category]}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredModules.map((module) => (
          <div
            key={module.id}
            onClick={() => setSelectedModule(module)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
          >
            {module.imageUrl && (
              <img
                src={module.imageUrl}
                alt={module.title}
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 flex-1">{module.title}</h3>
                <span className="text-2xl">{categoryIcons[module.category]}</span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{module.content}</p>

              <button className="text-pink-500 hover:text-pink-600 font-medium text-sm font-sm">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-gray-800 mb-2">Have Questions?</h3>
        <p className="text-gray-700 mb-4">
          Our AI Health Assistant is here 24/7 to answer your questions confidentially.
        </p>
        <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition">
          Chat with AI Assistant
        </button>
      </div>
    </div>
  );
};

export default HealthEducation;
 
