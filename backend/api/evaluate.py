from fastapi import APIRouter, UploadFile, File
import pandas as pd
from tempfile import NamedTemporaryFile
import os
import numpy as np
from sklearn.metrics import mean_squared_error
from scipy.stats import ks_2samp, chi2_contingency, entropy
from sklearn.neighbors import NearestNeighbors
from scipy.spatial.distance import cdist

router = APIRouter()

def sanitize_json(obj):
    if isinstance(obj, dict):
        return {k: sanitize_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_json(x) for x in obj]
    elif isinstance(obj, float):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return obj
    return obj

def evaluate_synthetic_data(real_df, synthetic_df):
    # 🔧 Coerce column types to avoid merge errors
    for col in real_df.columns:
        if col in synthetic_df.columns:
            try:
                synthetic_df[col] = synthetic_df[col].astype(real_df[col].dtype)
            except:
                real_df[col] = real_df[col].astype(str)
                synthetic_df[col] = synthetic_df[col].astype(str)

    def data_mismatch():
        try:
            return float(sum(real_df.dtypes != synthetic_df.dtypes) / len(real_df.columns))
        except:
            return None

    def common_rows_proportion():
        try:
            common_cols = [col for col in real_df.columns if col in synthetic_df.columns]
            if not common_cols:
                return None
            common = pd.merge(real_df[common_cols], synthetic_df[common_cols])
            return float(len(common) / len(real_df)) if len(real_df) > 0 else 0.0
        except:
            return None

    def nearest_syn_neighbor_distance():
        try:
            real_num = real_df.select_dtypes(include=[np.number])
            synth_num = synthetic_df.select_dtypes(include=[np.number])
            if real_num.shape[1] == 0 or synth_num.shape[1] == 0:
                return None
            nbrs = NearestNeighbors(n_neighbors=1).fit(synth_num)
            distances, _ = nbrs.kneighbors(real_num)
            distances = np.asarray(distances).ravel()
            return float(np.mean(distances))
        except:
            return None

    def close_values_probability():
        try:
            real_num = real_df.select_dtypes(include=[np.number])
            synth_num = synthetic_df.select_dtypes(include=[np.number])
            if real_num.shape[1] == 0 or synth_num.shape[1] == 0:
                return None
            count = 0
            for i in range(len(real_num)):
                diffs = (synth_num - real_num.iloc[i]).abs().sum(axis=1).to_numpy().ravel()
                if diffs.shape == ():
                    continue
                if any(diffs < 1e-3):
                    count += 1
            return float(count / len(real_num)) if len(real_num) > 0 else None
        except:
            return None

    def distant_values_probability():
        try:
            real_num = real_df.select_dtypes(include=[np.number])
            synth_num = synthetic_df.select_dtypes(include=[np.number])
            if real_num.shape[1] == 0 or synth_num.shape[1] == 0:
                return None
            dists = cdist(real_num.to_numpy(), synth_num.to_numpy())
            if dists.shape[1] == 0 or dists.shape[0] == 0:
                return None
            avg_min_dist = np.mean(np.min(dists, axis=1).ravel())
            return float(avg_min_dist)
        except:
            return None

    def inverse_kl_divergence():
        try:
            scores = []
            for col in real_df.columns:
                if real_df[col].dtype == "object":
                    continue
                p = np.histogram(real_df[col], bins=20, density=True)[0] + 1e-8
                q = np.histogram(synthetic_df[col], bins=20, density=True)[0] + 1e-8
                p = p.ravel()
                q = q.ravel()
                if p.shape != q.shape or p.shape == ():
                    continue
                scores.append(1 / (entropy(p, q) + 1e-8))
            return float(np.mean(scores)) if scores else None
        except:
            return None

    def ks_test():
        try:
            scores = []
            for col in real_df.columns:
                if real_df[col].dtype != "object":
                    if len(real_df[col]) == 0 or len(synthetic_df[col]) == 0:
                        continue
                    stat, _ = ks_2samp(real_df[col], synthetic_df[col])
                    scores.append(1 - float(stat))
            return float(np.mean(scores)) if scores else None
        except:
            return None

    def chi_squared_test():
        try:
            scores = []
            for col in real_df.columns:
                if real_df[col].dtype == "object":
                    contingency = pd.crosstab(real_df[col], synthetic_df[col])
                    if contingency.shape[0] > 1 and contingency.shape[1] > 1:
                        chi2, p, _, _ = chi2_contingency(contingency, correction=False)
                        scores.append(float(p) > 0.05)
            return float(np.mean(scores)) if scores else None
        except:
            return None

    def max_mean_discrepancy():
        try:
            common_cols = [col for col in real_df.columns if col in synthetic_df.columns]
            real_num = real_df[common_cols].select_dtypes(include=[np.number])
            synth_num = synthetic_df[common_cols].select_dtypes(include=[np.number])
            if real_num.shape[1] == 0 or synth_num.shape[1] == 0:
                return None
            real_mean = real_num.mean().to_numpy().ravel()
            synth_mean = synth_num.mean().to_numpy().ravel()
            real_std = real_num.std().to_numpy().ravel()
            synth_std = synth_num.std().to_numpy().ravel()
            if real_mean.shape != synth_mean.shape or real_std.shape != synth_std.shape:
                return None
            return float(np.linalg.norm(real_mean - synth_mean) + np.linalg.norm(real_std - synth_std))
        except:
            return None

    raw_metrics = {
        "data_mismatch": data_mismatch(),
        "common_rows_proportion": common_rows_proportion(),
        "nearest_syn_neighbor_distance": nearest_syn_neighbor_distance(),
        "close_values_probability": close_values_probability(),
        "distant_values_probability": distant_values_probability(),
        "inverse_kl_divergence": inverse_kl_divergence(),
        "ks_test": ks_test(),
        "chi_squared_test": chi_squared_test(),
        "max_mean_discrepancy": max_mean_discrepancy(),
    }
    metrics = {}
    for k, v in raw_metrics.items():
        if isinstance(v, tuple):
            metrics[k] = None
        elif isinstance(v, (np.floating, np.integer)):
            metrics[k] = float(v)
        elif isinstance(v, (np.ndarray, list)):
            arr = np.asarray(v)
            if arr.size == 1:
                item = arr.item()
                if isinstance(item, tuple):
                    metrics[k] = None
                else:
                    metrics[k] = float(item)
            else:
                metrics[k] = None
        elif v is not None and not isinstance(v, float):
            if not isinstance(v, (tuple, list, np.ndarray)):
                try:
                    metrics[k] = float(v)
                except:
                    metrics[k] = None
            else:
                metrics[k] = None
        else:
            metrics[k] = v
    return metrics

@router.post("/evaluate/")
async def evaluate(real: UploadFile = File(...), synthetic: UploadFile = File(...)):
    # Save real file temporarily
    temp_real = NamedTemporaryFile(delete=False, suffix='.csv')
    real_contents = await real.read()
    temp_real.write(real_contents)
    temp_real.close()
    
    # Save synthetic file temporarily
    temp_synth = NamedTemporaryFile(delete=False, suffix='.csv')
    synth_contents = await synthetic.read()
    temp_synth.write(synth_contents)
    temp_synth.close()
    
    # Read dataframes
    df_real = pd.read_csv(temp_real.name)
    df_synth = pd.read_csv(temp_synth.name)

    # Evaluate using the new function
    results = evaluate_synthetic_data(df_real, df_synth)

    # Clean up temp files
    os.unlink(temp_real.name)
    os.unlink(temp_synth.name)
    
    return sanitize_json(results) 