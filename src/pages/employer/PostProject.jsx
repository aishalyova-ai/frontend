import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Clock,
    Briefcase,
    Calendar,
    MapPin,
    Hash,
    BookOpen,
    ListChecks,
    Send
} from 'lucide-react';

export default function PostProject() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        projectType: 'Fixed Price',
        budgetMin: '',
        budgetMax: '',
        hourlyRate: '',
        duration: '',
        experienceLevel: '',
        deadline: '',
        isRemote: false,
        location: '',
        additionalRequirements: '',
        screeningQuestions: [],
        skills: [],
    });

    const [newSkill, setNewSkill] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove),
        }));
    };

    const addQuestion = () => {
        if (newQuestion.trim() && !formData.screeningQuestions.includes(newQuestion.trim())) {
            setFormData(prev => ({
                ...prev,
                screeningQuestions: [...prev.screeningQuestions, newQuestion.trim()],
            }));
            setNewQuestion('');
        }
    };

    const removeQuestion = (questionToRemove) => {
        setFormData(prev => ({
            ...prev,
            screeningQuestions: prev.screeningQuestions.filter(q => q !== questionToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        const token = localStorage.getItem('jwtToken');

        if (!token) {
            setError("You are not logged in. Please log in to post a project.");
            setLoading(false);
            navigate("/signin");
            return;
        }

        const payload = { ...formData };

        if (payload.projectType === 'Fixed Price') {
            payload.hourlyRate = null;
            payload.budgetMin = parseFloat(payload.budgetMin) || 0;
            payload.budgetMax = parseFloat(payload.budgetMax) || 0;
        } else if (payload.projectType === 'Hourly') {
            payload.budgetMin = null;
            payload.budgetMax = null;
            payload.hourlyRate = parseFloat(payload.hourlyRate) || 0;
        }

        payload.skills = Array.isArray(payload.skills) ? payload.skills : [];
        payload.screeningQuestions = Array.isArray(payload.screeningQuestions) ? payload.screeningQuestions : [];

        Object.keys(payload).forEach(key => {
            if (payload[key] === '') {
                payload[key] = null;
            }
        });

        console.log("Sending project payload:", payload);
        console.log("Authorization Token:", token);

        try {
            const response = await fetch("http://localhost:8080/api/employer/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = "Failed to submit project. An unknown error occurred.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    if (response.status === 403) {
                        errorMessage = "Access Denied: You do not have permission to post projects. Ensure you are logged in as an Employer.";
                    } else if (response.status === 401) {
                        errorMessage = "Authentication Required: Your session may have expired. Please log in again.";
                        localStorage.removeItem('jwtToken');
                        navigate("/signin");
                    } else {
                        errorMessage = `Error submitting project: Server responded with status ${response.status}.`;
                    }
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setSuccessMessage('Project posted successfully!');
            console.log('Project submitted:', data);

            setFormData({
                title: '', description: '', category: '', projectType: 'Fixed Price',
                budgetMin: '', budgetMax: '', hourlyRate: '', duration: '',
                experienceLevel: '', deadline: '', isRemote: false, location: '',
                additionalRequirements: '', screeningQuestions: [], skills: [],
            });
            setNewSkill('');
            setNewQuestion('');

            setTimeout(() => {
                navigate('/dashboard/employer/my-projects');
            }, 1500);

        } catch (err) {
            console.error('Error submitting project:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Post a New Project</h1>
                    <p className="text-gray-600 mt-2">Describe your project to attract the right talent</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                        {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

                        {/* Project Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                    placeholder="e.g., Build a responsive e-commerce website"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                <textarea
                                    name="description"
                                    id="description"
                                    rows="5"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                    placeholder="Provide a detailed description of your project, including goals, deliverables, and any specific requirements."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="e.g., Web Development, Graphic Design, Marketing"
                                required
                            />
                        </div>

                        {/* Project Type (Fixed/Hourly) */}
                        <div>
                            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">Project Type</label>
                            <select
                                name="projectType"
                                id="projectType"
                                value={formData.projectType}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="Fixed Price">Fixed Price</option>
                                <option value="Hourly">Hourly Rate</option>
                            </select>
                        </div>

                        {/* Conditional Budget Inputs */}
                        {formData.projectType === 'Fixed Price' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700">Min Budget (Tsh)</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Tsh</div>
                                        <input
                                            type="number"
                                            name="budgetMin"
                                            id="budgetMin"
                                            value={formData.budgetMin}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-12"
                                            placeholder="e.g., 500000"
                                            required={formData.projectType === 'Fixed Price'}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700">Max Budget (Tsh)</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Tsh</div>
                                        <input
                                            type="number"
                                            name="budgetMax"
                                            id="budgetMax"
                                            value={formData.budgetMax}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-12"
                                            placeholder="e.g., 1000000"
                                            required={formData.projectType === 'Fixed Price'}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData.projectType === 'Hourly' && (
                            <div>
                                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate (Tsh)</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Tsh</div>
                                    <input
                                        type="number"
                                        name="hourlyRate"
                                        id="hourlyRate"
                                        value={formData.hourlyRate}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-12"
                                        placeholder="e.g., 25000"
                                        required={formData.projectType === 'Hourly'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Duration */}
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (e.g., "1-3 months")</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    name="duration"
                                    id="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                    placeholder="e.g., 1-3 months, 2 weeks"
                                    required
                                />
                            </div>
                        </div>

                        {/* Experience Level */}
                        <div>
                            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">Experience Level</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <select
                                    name="experienceLevel"
                                    id="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                    required
                                >
                                    <option value="">Select an experience level</option>
                                    <option value="Entry Level">Entry Level</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="date"
                                    name="deadline"
                                    id="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                    required
                                    min={today} // This is the key change to prevent past dates
                                />
                            </div>
                        </div>

                        {/* Remote Option and Location */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isRemote"
                                id="isRemote"
                                checked={formData.isRemote}
                                onChange={handleInputChange}
                                className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <label htmlFor="isRemote" className="text-sm font-medium text-gray-700">Remote Project</label>
                        </div>
                        {!formData.isRemote && (
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (City, State/Country)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                        placeholder="e.g., New York, NY"
                                        required={!formData.isRemote}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Additional Requirements */}
                        <div>
                            <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700">Additional Requirements (Optional)</label>
                            <div className="relative">
                                <ListChecks className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                <textarea
                                    name="additionalRequirements"
                                    id="additionalRequirements"
                                    rows="3"
                                    value={formData.additionalRequirements}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                    placeholder="Any other specific details or requirements for the project."
                                ></textarea>
                            </div>
                        </div>

                        {/* Required Skills */}
                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Required Skills</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.skills.map((skill, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="ml-2 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 focus:outline-none focus:bg-indigo-200">
                                            <span className="sr-only">Remove skill</span>
                                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex">
                                <div className="relative flex-grow">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                        className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                        placeholder="Add a skill (e.g., React, SEO)"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Screening Questions */}
                        <div>
                            <label htmlFor="screeningQuestions" className="block text-sm font-medium text-gray-700">Screening Questions (Optional)</label>
                            <p className="mt-1 text-sm text-gray-500">Add questions applicants must answer (e.g., "What is your experience with X?")</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.screeningQuestions.map((question, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        {question}
                                        <button type="button" onClick={() => removeQuestion(question)} className="ml-2 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 focus:outline-none focus:bg-gray-200">
                                            <span className="sr-only">Remove question</span>
                                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex">
                                <div className="relative flex-grow">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addQuestion();
                                            }
                                        }}
                                        className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                                        placeholder="Add a question"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Posting Project...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" /> Post Project
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}