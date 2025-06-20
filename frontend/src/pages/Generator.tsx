import React, { useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

const MODELS = ["dpgan", "ctgan", "privbayes"];

export default function Generator() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[][]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [model, setModel] = useState(MODELS[0]);
  const [loading, setLoading] = useState(false);
  const [genPath, setGenPath] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);

  // Handle file upload and preprocess
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview([]);
    setSummary(null);
    setGenPath("");
    setEvaluation(null);
    if (!f) return;
    const formData = new FormData();
    formData.append("file", f);
    setLoading(true);
    toast.loading("Uploading & preprocessing...");
    try {
      const res = await axios.post("/preprocess/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreview(res.data.preview || []);
      setSummary(res.data.summary || null);
      toast.success("Preprocessing done!");
    } catch (e: any) {
      if (e.response?.status === 401) toast.error("Unauthorized. Please log in again.");
      else toast.error("Preprocess failed: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  // Generate synthetic data
  const handleGenerate = async () => {
    if (!file) return toast.error("Upload a CSV first");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_name", model);
    setLoading(true);
    toast.loading("Generating synthetic data...");
    try {
      const res = await axios.post("/generate/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGenPath(res.data.path);
      toast.success("Synthetic data generated!");
    } catch (e: any) {
      if (e.response?.status === 401) toast.error("Unauthorized. Please log in again.");
      else toast.error("Generation failed: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  // Evaluate synthetic data
  const handleEvaluate = async () => {
    if (!file || !genPath) return toast.error("Upload and generate first");
    setLoading(true);
    toast.loading("Evaluating...");
    try {
      const synBlob = await fetch(`http://localhost:8000/download/?path=${encodeURIComponent(genPath)}`).then(r => r.blob());
      const formData = new FormData();
      formData.append("real", file);
      formData.append("synthetic", new File([synBlob], "synthetic.csv"));
      const res = await axios.post("/evaluate/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEvaluation(res.data);
      toast.success("Evaluation complete!");
    } catch (e: any) {
      if (e.response?.status === 401) toast.error("Unauthorized. Please log in again.");
      else toast.error("Evaluation failed: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  // Download synthetic CSV
  const handleDownload = () => {
    if (!genPath) return toast.error("Nothing to download");
    window.open(`http://localhost:8000/download/?path=${encodeURIComponent(genPath)}`, "_blank");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">🧠 Synthetic Data Generator</h1>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="border rounded p-2"
          disabled={loading}
        />
        <select
          value={model}
          onChange={e => setModel(e.target.value)}
          className="border rounded p-2"
          disabled={loading}
        >
          {MODELS.map(m => (
            <option key={m} value={m}>{m.toUpperCase()}</option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !file}
        >
          {loading ? "Processing..." : "Generate"}
        </button>
      </div>

      {preview.length > 0 && (
        <div className="overflow-x-auto border rounded bg-white shadow p-4">
          <h2 className="font-semibold mb-2">CSV Preview</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {preview[0].map((col: any, idx: number) => (
                  <th key={idx} className="px-2 py-1 border-b font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.slice(1, 6).map((row, i) => (
                <tr key={i}>
                  {row.map((cell: any, j: number) => (
                    <td key={j} className="px-2 py-1 border-b">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {summary && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Preprocessing Summary</h2>
          <pre className="text-xs overflow-x-auto">{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !file}
        >
          {loading ? "Processing..." : "Generate"}
        </button>
        <button
          onClick={handleEvaluate}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
          disabled={loading || !genPath}
        >
          {loading ? "Processing..." : "Evaluate"}
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={!genPath}
        >
          Download Synthetic CSV
        </button>
      </div>

      {evaluation && (
        <div className="bg-glass p-6 mt-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Evaluation Metrics</h2>
          {Object.entries(evaluation).map(([key, value]) => (
            <p key={key} className="text-sm text-muted-foreground">
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value ?? 'N/A'}
            </p>
          ))}
        </div>
      )}
    </div>
  );
} 