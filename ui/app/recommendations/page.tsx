"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTY_OPTIONS } from "@/constants/filter-options"
import { ApiError, apiPost } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { RecommendationResult } from "@/types/api"
import {
  ArrowLeft01Icon, ArrowRight01Icon, Book01Icon, Building03Icon,
  Chart03Icon,
  CheckmarkCircle01Icon,
  FavouriteIcon,
  GlobalIcon,
  Idea01Icon,
  InformationCircleIcon,
  Location01Icon,
  PaintBoardIcon, Plant01Icon,
  RouteIcon,
  Search01Icon,
  Settings01Icon,
  Share01Icon,
  Task01Icon,
  TestTube01Icon, UserGroupIcon,
  Wrench01Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from 'next/link'
import { useState } from "react"

const SUBJECTS = [
  { id: "biology", label: "Biology", icon: Plant01Icon, color: "text-green-600 border-green-200", bg: "bg-green-50" },
  { id: "chemistry", label: "Chemistry", icon: TestTube01Icon, color: "text-blue-600 border-blue-200", bg: "bg-blue-50" },
  { id: "physics", label: "Physics", icon: Idea01Icon, color: "text-orange-500 border-orange-200", bg: "bg-orange-50" },
  { id: "mathematics", label: "Mathematics", icon: Task01Icon, color: "text-emerald-600 border-emerald-200", bg: "bg-emerald-50" },
  { id: "english", label: "English", icon: Book01Icon, color: "text-purple-600 border-purple-200", bg: "bg-purple-50" },
  { id: "kiswahili", label: "Kiswahili", icon: InformationCircleIcon, color: "text-yellow-600 border-yellow-200", bg: "bg-yellow-50" },
  { id: "history", label: "History", icon: Building03Icon, color: "text-amber-700 border-amber-200", bg: "bg-amber-50" },
  { id: "geography", label: "Geography", icon: GlobalIcon, color: "text-blue-500 border-blue-200", bg: "bg-blue-50" },
  { id: "cre", label: "CRE", icon: FavouriteIcon, color: "text-rose-500 border-rose-200", bg: "bg-rose-50" },
  { id: "business", label: "Business Studies", icon: Chart03Icon, color: "text-teal-600 border-teal-200", bg: "bg-teal-50" },
  { id: "agriculture", label: "Agriculture", icon: Plant01Icon, color: "text-lime-600 border-lime-200", bg: "bg-lime-50" },
  { id: "computer", label: "Computer Studies", icon: Settings01Icon, color: "text-indigo-600 border-indigo-200", bg: "bg-indigo-50" }
];

const INTERESTS = [
  { id: "science_health", label: "Science & Health", icon: FavouriteIcon, color: "text-blue-600" },
  { id: "tech_innovation", label: "Technology & Innovation", icon: Settings01Icon, color: "text-slate-600" },
  { id: "business", label: "Business & Entrepreneurship", icon: Chart03Icon, color: "text-purple-600" },
  { id: "arts", label: "Arts & Creativity", icon: PaintBoardIcon, color: "text-rose-600" },
  { id: "social", label: "Social Impact & Humanities", icon: UserGroupIcon, color: "text-orange-600" },
  { id: "environment", label: "Environment & Sustainability", icon: Plant01Icon, color: "text-green-600" },
  { id: "engineering", label: "Engineering & Design", icon: Wrench01Icon, color: "text-blue-600" }
];

export default function RecommendationsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    location: "",
    environment: "Co-ed",
    accommodation: "Any",
    classSize: "Medium (31 - 45 students)",
    schoolType: "Any",
    budget: "Any budget"
  });

  // API state
  const [recResults, setRecResults] = useState<RecommendationResult | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const setPref = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const fetchRecommendations = async () => {
    setRecLoading(true);
    setRecError(null);
    try {
      // Map lowercase subject IDs to uppercase for the API
      const subjectMap: Record<string, string> = {
        biology: "BIOLOGY", chemistry: "CHEMISTRY", physics: "PHYSICS",
        mathematics: "MATHEMATICS", english: "ENGLISH", kiswahili: "KISWAHILI",
        history: "HISTORY", geography: "GEOGRAPHY", cre: "CRE",
        business: "BUSINESS STUDIES", agriculture: "AGRICULTURE", computer: "COMPUTER STUDIES",
      };
      const preferredSubjects = selectedSubjects.map(s => subjectMap[s] ?? s.toUpperCase());
      const countyOption = COUNTY_OPTIONS.find(c => c.label === preferences.location);
      const body: Record<string, unknown> = { preferredSubjects };
      if (countyOption) body.preferredCounty = countyOption.value;

      const res = await apiPost<{ status: string; data: RecommendationResult }>(
        "/recommendations",
        body
      );
      setRecResults(res.data);
    } catch (err) {
      setRecError(err instanceof ApiError ? err.message : "Failed to get recommendations.");
    } finally {
      setRecLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      setCurrentStep(4);
      fetchRecommendations();
    } else {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };
  const handleBack = () => setCurrentStep(prev => Math.max(1, prev - 1));
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedSubjects([]);
    setSelectedInterests([]);
    setRecResults(null);
    setRecError(null);
    setPreferences({
      location: "",
      environment: "Co-ed",
      accommodation: "Any",
      classSize: "Medium (31 - 45 students)",
      schoolType: "Any",
      budget: "Any budget"
    });
  };

  const renderStepIcon = (stepNum: number, label: string) => {
    const isActive = currentStep === stepNum;
    const isCompleted = currentStep > stepNum;
    
    return (
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
          isActive || isCompleted ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
        )}>
          {stepNum}
        </div>
        <span className={cn(
          "text-sm font-semibold transition-colors hidden md:block",
          isActive || isCompleted ? "text-slate-900" : "text-slate-500"
        )}>
          {label}
        </span>
      </div>
    );
  };

  const renderProgressSidebar = () => {
    return (
      <Card className="flex flex-col p-6 rounded-2xl border-slate-100 shadow-sm h-fit">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-900">Your Progress</h3>
          <Badge variant="secondary" className="bg-blue-50 text-blue-600 font-bold border-none">
            {currentStep}/4
          </Badge>
        </div>
        
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className={currentStep > 1 || selectedSubjects.length > 0 ? "text-blue-600" : "text-slate-300"} />
              <span className={cn("font-semibold", currentStep === 1 ? "text-blue-600" : "text-slate-700")}>Subjects</span>
            </div>
            <span className={cn("font-medium", selectedSubjects.length > 0 ? "text-slate-500" : "text-slate-400")}>
              {selectedSubjects.length > 0 ? `${selectedSubjects.length} selected` : "Not selected"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className={currentStep > 2 || selectedInterests.length > 0 ? "text-blue-600" : "text-slate-300"} />
              <span className={cn("font-semibold", currentStep === 2 ? "text-blue-600" : "text-slate-700")}>Interests</span>
            </div>
            <span className={cn("font-medium", selectedInterests.length > 0 ? "text-slate-500" : "text-slate-400")}>
               {selectedInterests.length > 0 ? `${selectedInterests.length} selected` : "Not selected"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className={currentStep > 3 ? "text-blue-600" : "text-slate-300"} />
              <span className={cn("font-semibold", currentStep === 3 ? "text-blue-600" : "text-slate-700")}>Preferences</span>
            </div>
            <span className={cn("font-medium", currentStep > 3 ? "text-slate-500" : "text-slate-400")}>
              {currentStep > 3 ? "Completed" : "Pending"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className={currentStep === 4 ? "text-blue-600" : "text-slate-300"} />
              <span className={cn("font-semibold", currentStep === 4 ? "text-blue-600" : "text-slate-700")}>Results</span>
            </div>
            <span className={cn("font-medium", currentStep === 4 ? "text-slate-500" : "text-slate-400")}>
              {currentStep === 4 ? "Completed" : "Pending"}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  const renderResultsSidebar = () => {
    return (
      <div className="flex flex-col gap-6">
        <Card className="flex flex-col p-6 rounded-2xl border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Your Selections</h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-sm font-semibold text-slate-700 mb-2 block">Subjects</span>
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map(id => {
                  const subject = SUBJECTS.find(s => s.id === id);
                  return <Badge key={id} variant="secondary" className="bg-blue-50 text-blue-600 border-none font-medium">{subject?.label}</Badge>
                })}
              </div>
            </div>
            
            <div>
              <span className="text-sm font-semibold text-slate-700 mb-2 block">Interests</span>
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map(id => {
                  const interest = INTERESTS.find(i => i.id === id);
                  return <Badge key={id} variant="secondary" className="bg-green-50 text-green-700 border-none font-medium">{interest?.label}</Badge>
                })}
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-slate-700 mb-2 block">Preferences</span>
              <div className="flex flex-col gap-2 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2"><HugeiconsIcon icon={Location01Icon} size={16} /> {preferences.location}</div>
                <div className="flex items-center gap-2"><HugeiconsIcon icon={Building03Icon} size={16} /> {preferences.classSize}</div>
                <div className="flex items-center gap-2"><HugeiconsIcon icon={UserGroupIcon} size={16} /> {preferences.environment}</div>
                <div className="flex items-center gap-2"><HugeiconsIcon icon={RouteIcon} size={16} /> {preferences.accommodation}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col p-6 rounded-2xl border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">Possible Career Pathways</h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">See all</button>
          </div>
          <div className="flex flex-col gap-3">
             {["Medical Doctor", "Pharmacist", "Biomedical Scientist", "Environmental Scientist", "Nutritionist", "Data Scientist"].map((career, i) => (
               <div key={i} className="flex items-center justify-between text-sm group cursor-pointer">
                 <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={Task01Icon} size={18} className="text-green-600" />
                    <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{career}</span>
                 </div>
                 <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
               </div>
             ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col items-center">
      <NavBar />
      
      {/* Stepper Header Container */}
      <div className="w-full bg-white border-b border-slate-200 py-4 px-6 flex justify-center sticky top-0 z-30 shadow-sm">
        <div className="w-full max-w-[1400px] flex items-center justify-between">
          
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
               <HugeiconsIcon icon={Idea01Icon} size={20} className="text-blue-600" />
             </div>
             <span className="text-sm font-bold text-slate-700 tracking-wide hidden lg:block">RECOMMENDATION FLOW (GUIDED)</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {renderStepIcon(1, "Subjects")}
            <div className={cn("h-px w-8 md:w-12 transition-colors", currentStep > 1 ? "bg-blue-600" : "bg-slate-200")} />
            {renderStepIcon(2, "Interests")}
            <div className={cn("h-px w-8 md:w-12 transition-colors", currentStep > 2 ? "bg-blue-600" : "bg-slate-200")} />
            {renderStepIcon(3, "Preferences")}
            <div className={cn("h-px w-8 md:w-12 transition-colors", currentStep > 3 ? "bg-blue-600" : "bg-slate-200")} />
            {renderStepIcon(4, "Results")}
          </div>

          <Button onClick={handleReset} variant="outline" className="hidden md:flex bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 font-semibold rounded-xl">
            <HugeiconsIcon icon={RouteIcon} size={16} className="mr-2" />
            Start New
          </Button>

        </div>
      </div>
      
      <main className="w-full max-w-[1400px] px-4 md:px-6 py-4 md:py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 pb-24">
        
        {/* Left Content Area */}
        <div className="flex flex-col">
          
          {/* STEP 1: SUBJECTS */}
          {currentStep === 1 && (
            <div className="flex flex-col h-full">
              <span className="text-sm font-bold text-slate-500 mb-2">Step 1 of 4</span>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">What subjects do you enjoy most?</h1>
              <p className="text-sm font-medium text-slate-500 mb-8">Select the subjects you like and perform well in.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                {SUBJECTS.map((subject) => {
                  const isSelected = selectedSubjects.includes(subject.id);
                  return (
                    <div 
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        isSelected 
                          ? "border-blue-600 bg-white shadow-sm" 
                          : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                         <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", subject.bg, subject.color)}>
                            <HugeiconsIcon icon={subject.icon} size={20} />
                         </div>
                         <span className={cn("text-sm font-bold", isSelected ? "text-slate-900" : "text-slate-600")}>
                           {subject.label}
                         </span>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0",
                        isSelected ? "bg-blue-600 text-white" : "border-2 border-slate-200"
                      )}>
                        {isSelected && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="fill-current" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-200">
                <Button variant="ghost" className="text-slate-500 font-semibold hover:bg-slate-100 rounded-xl h-11 px-6 invisible">
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="mr-2" /> Back
                </Button>
                <Button onClick={handleNext} disabled={selectedSubjects.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-8 shadow-sm">
                  Continue <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: INTERESTS */}
          {currentStep === 2 && (
            <div className="flex flex-col h-full">
              <span className="text-sm font-bold text-slate-500 mb-2">Step 2 of 4</span>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">What are you most interested in?</h1>
              <p className="text-sm font-medium text-slate-500 mb-8">Choose the areas that excite you and you see yourself working in.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                {INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <div 
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        "group flex flex-col items-center justify-center p-6 rounded-2xl rounded-br-none border-2 cursor-pointer transition-all text-center relative mb-4",
                        isSelected 
                          ? "border-blue-600 bg-white shadow-sm" 
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <HugeiconsIcon icon={interest.icon} size={32} className={cn("mb-4", interest.color)} />
                      <span className={cn("text-sm font-bold leading-snug", isSelected ? "text-slate-900" : "text-slate-600")}>
                        {interest.label}
                      </span>
                      
                      {/* Protruding Tab */}
                      <div className={cn(
                        "absolute top-full right-[-2px] -mt-[2px] w-9 h-7 border-x-2 border-b-2 border-t-0 rounded-b-lg flex items-center justify-center transition-colors z-10",
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white" 
                          : "bg-white border-slate-200 text-slate-300 group-hover:border-slate-300"
                      )}>
                        {isSelected ? (
                           <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="fill-current" />
                        ) : (
                           <div className="w-3.5 h-3.5 border-2 border-slate-200 rounded-[4px] group-hover:border-slate-300 transition-colors" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-200">
                <Button onClick={handleBack} variant="ghost" className="text-slate-500 font-semibold hover:bg-slate-100 rounded-xl h-11 px-6">
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="mr-2" /> Back
                </Button>
                <Button onClick={handleNext} disabled={selectedInterests.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-8 shadow-sm">
                  Continue <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERENCES */}
          {currentStep === 3 && (
            <div className="flex flex-col h-full">
              <span className="text-sm font-bold text-slate-500 mb-2">Step 3 of 4</span>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Tell us your learning preferences</h1>
              <p className="text-sm font-medium text-slate-500 mb-8">Help us recommend schools and combinations that fit you best.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mb-10 max-w-4xl">
                
                {/* Preferred School Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                    <HugeiconsIcon icon={Location01Icon} size={20} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-bold text-slate-900 mb-1">Preferred School Location</label>
                    <span className="text-xs text-slate-500 font-medium mb-3">Where would you like to study?</span>
                    <Select value={preferences.location} onValueChange={(val) => setPref('location', val)}>
                      <SelectTrigger className="w-full h-11 rounded-xl bg-white border-slate-200 text-sm font-semibold text-slate-700 focus:ring-blue-600">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Nairobi County">Nairobi County</SelectItem>
                        <SelectItem value="Kiambu County">Kiambu County</SelectItem>
                        <SelectItem value="Nakuru County">Nakuru County</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Class Size Preference */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                    <HugeiconsIcon icon={UserGroupIcon} size={20} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-bold text-slate-900 mb-1">Class Size Preference</label>
                    <span className="text-xs text-slate-500 font-medium mb-3">What class size helps you learn best?</span>
                    <Select value={preferences.classSize} onValueChange={(val) => setPref('classSize', val)}>
                      <SelectTrigger className="w-full h-11 rounded-xl bg-white border-slate-200 text-sm font-semibold text-slate-700 focus:ring-blue-600">
                        <SelectValue placeholder="Select class size" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Small (under 30 students)">Small (under 30 students)</SelectItem>
                        <SelectItem value="Medium (31 - 45 students)">Medium (31 - 45 students)</SelectItem>
                        <SelectItem value="Large (45+ students)">Large (45+ students)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Learning Environment */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                    <HugeiconsIcon icon={Building03Icon} size={20} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-bold text-slate-900 mb-1">Learning Environment</label>
                    <span className="text-xs text-slate-500 font-medium mb-3">What kind of environment do you thrive in?</span>
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full h-11">
                       {['Boys', 'Girls', 'Co-ed'].map(env => (
                         <button 
                           key={env}
                           onClick={() => setPref('environment', env)}
                           className={cn(
                             "flex-1 rounded-lg text-sm font-semibold transition-all",
                             preferences.environment === env ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"
                           )}
                         >
                           {env}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                {/* School Type */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                    <HugeiconsIcon icon={Building03Icon} size={20} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-bold text-slate-900 mb-1">School Type</label>
                    <span className="text-xs text-slate-500 font-medium mb-3">What type of school do you prefer?</span>
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full h-11">
                       {['Public', 'Private', 'Any'].map(type => (
                         <button 
                           key={type}
                           onClick={() => setPref('schoolType', type)}
                           className={cn(
                             "flex-1 rounded-lg text-sm font-semibold transition-all",
                             preferences.schoolType === type ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"
                           )}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Accommodation Preference */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                    <HugeiconsIcon icon={Building03Icon} size={20} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-bold text-slate-900 mb-1">Accommodation Preference</label>
                    <span className="text-xs text-slate-500 font-medium mb-3">What type of accommodation do you prefer?</span>
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full h-11">
                       {['Day', 'Boarding', 'Any'].map(type => (
                         <button 
                           key={type}
                           onClick={() => setPref('accommodation', type)}
                           className={cn(
                             "flex-1 rounded-lg text-sm font-semibold transition-all",
                             preferences.accommodation === type ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"
                           )}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Budget Consideration */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                    <HugeiconsIcon icon={RouteIcon} size={20} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-sm font-bold text-slate-900 mb-1">Budget Consideration</label>
                    <span className="text-xs text-slate-500 font-medium mb-3">What is your budget range?</span>
                    <Select value={preferences.budget} onValueChange={(val) => setPref('budget', val)}>
                      <SelectTrigger className="w-full h-11 rounded-xl bg-white border-slate-200 text-sm font-semibold text-slate-700 focus:ring-blue-600">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Any budget">Any budget</SelectItem>
                        <SelectItem value="Below 50,000 KES">Below 50,000 KES</SelectItem>
                        <SelectItem value="50,000 - 100,000 KES">50,000 - 100,000 KES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-200">
                <Button onClick={handleBack} variant="ghost" className="text-slate-500 font-semibold hover:bg-slate-100 rounded-xl h-11 px-6">
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="mr-2" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-8 shadow-sm">
                  Continue <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: RESULTS */}
          {currentStep === 4 && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Here are your recommendations! 🎉</h1>
                <p className="text-lg font-medium text-slate-600">Based on your selected subjects and preferences.</p>
              </div>

              {recLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <p className="text-sm font-medium text-slate-500">Finding your best matches…</p>
                </div>
              )}

              {!recLoading && recError && (
                <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-2xl border border-red-100 text-center mb-8">
                  <HugeiconsIcon icon={InformationCircleIcon} size={32} className="text-red-400 mb-3" />
                  <p className="font-bold text-red-700 mb-1">Could not load recommendations</p>
                  <p className="text-sm text-red-500 mb-4">{recError}</p>
                  <Button onClick={fetchRecommendations} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold h-10 px-6">Retry</Button>
                </div>
              )}

              {!recLoading && !recError && recResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="flex flex-col p-6 rounded-2xl border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Recommended Combinations</h3>
                    <div className="flex flex-col gap-3">
                      {recResults.pathwayRecommendations.length === 0 && (
                        <p className="text-sm text-slate-500">No combinations found for your subjects.</p>
                      )}
                      {recResults.pathwayRecommendations.map((combo, idx) => (
                        <Link key={combo.id} href={`/combination/${combo.id}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                          <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">{idx + 1}</div>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex-1 min-w-0 truncate">
                            {combo.Subjects.map(s => s.name).join(", ")}
                          </span>
                          {idx === 0 && <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 font-bold border-none shrink-0">Best Match</Badge>}
                          <span className="text-sm font-bold text-emerald-600 shrink-0">{combo.matchScore}%</span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/explore-tracks" className="mt-6">
                      <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold rounded-xl h-11">
                        Explore combinations <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </Card>

                  <Card className="flex flex-col p-6 rounded-2xl border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Top Matching Schools</h3>
                    <div className="flex flex-col gap-3">
                      {recResults.schoolOptions.length === 0 && (
                        <p className="text-sm text-slate-500">No schools found matching your filters.</p>
                      )}
                      {recResults.schoolOptions.slice(0, 5).map((school, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 shrink-0 flex items-center justify-center border border-slate-100">
                            <span className="text-sm font-extrabold text-blue-400">{school.name.slice(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-bold text-slate-900 truncate">{school.name}</span>
                            <span className="text-xs text-slate-500 font-medium">{school.county}{school.category ? ` • ${school.category}` : ""}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/find-schools" className="mt-6">
                      <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold rounded-xl h-11">
                        View all schools <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </Card>
                </div>
              )}

              {!recLoading && !recError && !recResults && (
                <div className="flex flex-col items-center justify-center py-16 text-center mb-8">
                  <p className="text-slate-500 text-sm">No results yet.</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-auto">
                <Button variant="outline" className="w-full sm:w-auto bg-white text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold rounded-xl h-11 px-8">
                  <HugeiconsIcon icon={FavouriteIcon} size={18} className="mr-2" /> Save Results
                </Button>
                <Button variant="outline" className="w-full sm:w-auto bg-white text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold rounded-xl h-11 px-8">
                  <HugeiconsIcon icon={Share01Icon} size={18} className="mr-2" /> Share Results
                </Button>
                <Button onClick={handleReset} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-8 shadow-sm">
                  <HugeiconsIcon icon={Search01Icon} size={18} className="mr-2" /> Start New Search
                </Button>
              </div>

            </div>
          )}

        </div>

        {/* Right Sidebar Area */}
        <div className="w-full lg:w-auto mt-6 lg:mt-0">
          <div className="sticky top-[100px]">
            {currentStep < 4 ? renderProgressSidebar() : renderResultsSidebar()}
          </div>
        </div>

      </main>
    </div>
  )
}
