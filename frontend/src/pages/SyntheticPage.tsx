import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import toast from "react-hot-toast";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const API_URL = "http://localhost:8000";

const SyntheticPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dataPreview, setDataPreview] = useState<any[][]>([]);
  const [model, setModel] = useState("dpgan");
  const [summary, setSummary] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [downloadPath, setDownloadPath] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      Papa.parse(selectedFile, {
        complete: (results) => {
          const rows = results.data as any[][];
          setDataPreview(rows.slice(0, 5)); // Preview first 5 rows
        },
        skipEmptyLines: true,
      });
    }
  };

  const handlePreprocess = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    toast.loading("Preprocessing data...");
    try {
      const res = await axios.post(`${API_URL}/preprocess/`, formData);
      toast.dismiss();
      setSummary(res.data.summary);
      toast.success("Preprocessing complete!");
    } catch (e) {
      toast.dismiss();
      toast.error("Preprocessing failed.");
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_name", model);
    toast.loading("Generating synthetic data...");
    try {
      const res = await axios.post(`${API_URL}/generate/`, formData);
      toast.dismiss();
      setDownloadPath(res.data.path);
      toast.success("Synthetic data generated!");
    } catch (e) {
      toast.dismiss();
      toast.error("Generation failed.");
    }
  };

  const handleEvaluate = async () => {
    if (!file || !downloadPath) return;
    const formData = new FormData();
    formData.append("real", file);
    const syntheticBlob = await fetch(downloadPath).then((r) => r.blob());
    formData.append("synthetic", new File([syntheticBlob], "synthetic.csv"));
    toast.loading("Evaluating data...");
    try {
      const res = await axios.post(`${API_URL}/evaluate/`, formData);
      toast.dismiss();
      setEvaluation(res.data.mse);
      toast.success("Evaluation complete!");
    } catch (e) {
      toast.dismiss();
      toast.error("Evaluation failed.");
    }
  };

  const handleDownload = () => {
    window.open(`${API_URL}/download/?path=${encodeURIComponent(downloadPath)}`, "_blank");
  };

  const evaluationChart = evaluation
    ? {
        labels: Object.keys(evaluation),
        datasets: [
          {
            label: "MSE per column",
            data: Object.values(evaluation),
            backgroundColor: "rgba(53, 162, 235, 0.6)",
          },
        ],
      }
    : null;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800">Synthetic Data Generator</h1>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="p-2 border rounded w-full sm:w-auto"
        />
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="dpgan">DPGAN</option>
          <option value="privbayes">PrivBayes</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-white text-center">
        <button onClick={handlePreprocess} className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
          Preprocess
        </button>
        <button onClick={handleGenerate} className="bg-green-600 hover:bg-green-700 p-2 rounded">
          Generate
        </button>
        <button onClick={handleEvaluate} className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded text-black">
          Evaluate
        </button>
        <button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 p-2 rounded">
          Download
        </button>
      </div>

      {dataPreview.length > 0 && (
        <div className="overflow-auto border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-2">CSV Preview</h2>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 font-bold">
              <tr>
                {dataPreview[0].map((col: any, idx: number) => (
                  <th key={idx} className="px-2 py-1">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataPreview.slice(1).map((row, i) => (
                <tr key={i} className="border-t">
                  {row.map((cell, j) => (
                    <td key={j} className="px-2 py-1">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {summary && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Preprocessing Summary</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}

      {evaluationChart && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Evaluation Chart (MSE)</h2>
          <Bar data={evaluationChart} />
        </div>
      )}
    </div>
  );
};

export default SyntheticPage; 