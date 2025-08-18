import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ApplyProjectForm = ({ projectId, employerId, questions, onSuccess }) => {

  const { token } = useAuth(); // Get token from auth context

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [proposedTimeline, setProposedTimeline] = useState("");
  const [answers, setAnswers] = useState(
  questions && questions.length > 0 ? Array(questions.length).fill("") : [""]
);
  const [skills, setSkills] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const addAnswerField = () => {
    setAnswers([...answers, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!coverLetter.trim()) {
      setError("Cover letter is required.");
      setLoading(false);
      return;
    }
    if (!proposedBudget || isNaN(proposedBudget) || Number(proposedBudget) <= 0) {
      setError("Please enter a valid proposed budget.");
      setLoading(false);
      return;
    }
    if (!proposedTimeline.trim()) {
      setError("Proposed timeline is required.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        projectId,
        coverLetter,
        proposedBudget: parseFloat(proposedBudget),
        proposedTimeline,
        answersToQuestions: answers.filter((a) => a.trim() !== ""),
        skillsOffered: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await axios.post(
        "http://localhost:8080/api/applications/apply",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);
      alert("Application submitted successfully!");
      if (onSuccess) onSuccess();

      // Reset form
      setCoverLetter("");
      setProposedBudget("");
      setProposedTimeline("");
      setAnswers([""]);
      setSkills("");
    } catch (err) {
      setLoading(false);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to submit application.";
      setError(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6"
      noValidate
    >
      <h2 className="text-xl font-semibold text-gray-900">
        Apply for this Project
      </h2>

      {employerId && (
        <p className="text-gray-600 text-sm mb-2">
          Employer ID: <span className="font-mono">{employerId}</span>
        </p>
      )}

      <div>
        <label className="block font-medium mb-1" htmlFor="coverLetter">
          Cover Letter <span className="text-red-500">*</span>
        </label>
        <textarea
          id="coverLetter"
          required
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write your cover letter here..."
        />
      </div>

      <div>
        <label className="block font-medium mb-1" htmlFor="proposedBudget">
          Proposed Budget ($) <span className="text-red-500">*</span>
        </label>
        <input
          id="proposedBudget"
          type="number"
          min="0"
          step="0.01"
          required
          value={proposedBudget}
          onChange={(e) => setProposedBudget(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 1500"
        />
      </div>

      <div>
        <label className="block font-medium mb-1" htmlFor="proposedTimeline">
          Proposed Timeline <span className="text-red-500">*</span>
        </label>
        <input
          id="proposedTimeline"
          type="text"
          required
          value={proposedTimeline}
          onChange={(e) => setProposedTimeline(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 3 months"
        />
      </div>

      {questions && questions.length > 0 ? (
  questions.map((question, idx) => (
    <div key={idx} className="mb-2">
      <label className="block font-medium mb-1">{question}</label>
      <input
        type="text"
        value={answers[idx]}
        onChange={(e) => handleAnswerChange(idx, e.target.value)}
        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={`Your answer`}
      />
    </div>
  ))
) : (
  <>
    {/* fallback if no questions */}
    {answers.map((answer, idx) => (
      <input
        key={idx}
        type="text"
        value={answer}
        onChange={(e) => handleAnswerChange(idx, e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={`Answer #${idx + 1}`}
      />
    ))}
    <button
      type="button"
      onClick={addAnswerField}
      className="text-indigo-600 hover:underline focus:outline-none"
    >
      + Add another answer
    </button>
  </>
)}


      <div>
        <label className="block font-medium mb-1" htmlFor="skills">
          Skills Offered (comma separated)
        </label>
        <input
          id="skills"
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. React, Node.js, Design"
        />
      </div>

      {error && <p className="text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};

export default ApplyProjectForm;
