from fastapi import APIRouter, UploadFile, File
import pandas as pd
from tempfile import NamedTemporaryFile
import os
import numpy as np
from scipy.spatial.distance import cdist
from sklearn.preprocessing import MinMaxScaler
from scipy.stats import ks_2samp

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
    for col in real_df.columns:
        if col in synthetic_df.columns:
            try:
                if real_df[col].dtype != synthetic_df[col].dtype:
                    synthetic_df[col] = synthetic_df[col].astype(real_df[col].dtype)
            except Exception:
                real_df[col] = real_df[col].astype(str)
                synthetic_df[col] = synthetic_df[col].astype(str)

    real_num = real_df.select_dtypes(include=np.number)
    synth_num = synthetic_df.select_dtypes(include=np.number)

    def data_mismatch():
        try:
            mismatch = sum(real_df.dtypes != synthetic_df.dtypes)
            return float(mismatch / len(real_df.columns))
        except Exception:
            return None

    def common_rows_proportion():
        try:
            common_cols = [col for col in real_df.columns if col in synthetic_df.columns]
            if not common_cols: return 0.0
            common = pd.merge(real_df[common_cols], synthetic_df[common_cols], on=common_cols)
            return float(len(common) / len(real_df)) if len(real_df) > 0 else 0.0
        except Exception:
            return None

    min_dists_rs, min_dists_sr, mean_dist_rr = None, None, None
    if not real_num.empty and not synth_num.empty:
        try:
            dists_rs = cdist(real_num, synth_num)
            min_dists_rs = np.min(dists_rs, axis=1)

            dists_sr = cdist(synth_num, real_num)
            min_dists_sr = np.min(dists_sr, axis=1)

            dists_rr = cdist(real_num, real_num)
            np.fill_diagonal(dists_rr, np.inf)
            mean_dist_rr = np.mean(np.min(dists_rr, axis=1))
        except Exception:
            pass

    def nearest_syn_neighbor_distance():
        try:
            if min_dists_rs is None: return None
            scaler = MinMaxScaler()
            scaled_distances = scaler.fit_transform(min_dists_rs.reshape(-1, 1))
            return float(np.mean(scaled_distances))
        except Exception:
            return None

    def close_values_probability():
        try:
            if min_dists_sr is None or mean_dist_rr is None: return None
            threshold = 0.1 * mean_dist_rr
            close_count = np.sum(min_dists_sr < threshold)
            return float(close_count / len(synth_num)) if len(synth_num) > 0 else 0.0
        except Exception:
            return None

    def distant_values_probability():
        try:
            if min_dists_sr is None or mean_dist_rr is None: return None
            threshold = 2 * mean_dist_rr
            distant_count = np.sum(min_dists_sr > threshold)
            return float(distant_count / len(synth_num)) if len(synth_num) > 0 else 0.0
        except Exception:
            return None
            
    def feature_distribution_similarity():
        try:
            p_values = []
            for col in real_num.columns:
                if col in synth_num.columns:
                    real_col, synth_col = real_df[col].dropna(), synthetic_df[col].dropna()
                    if len(real_col) > 1 and len(synth_col) > 1:
                        _, p_val = ks_2samp(real_col, synth_col)
                        p_values.append(p_val)
            return 1.0 - float(np.mean(p_values)) if p_values else None
        except Exception:
            return None

    raw_metrics = {
        "data_mismatch": data_mismatch(),
        "common_rows_proportion": common_rows_proportion(),
        "nearest_syn_neighbor_distance": nearest_syn_neighbor_distance(),
        "close_values_probability": close_values_probability(),
        "distant_values_probability": distant_values_probability(),
        "feature_distribution_similarity": feature_distribution_similarity(),
    }

    metrics = {}
    for k, v in raw_metrics.items():
        if v is None: metrics[k] = None
        else: metrics[k] = float(v) if not (np.isnan(v) or np.isinf(v)) else None
            
    return metrics

@router.post("/evaluate/")
async def evaluate(real: UploadFile = File(...), synthetic: UploadFile = File(...)):
    temp_real = NamedTemporaryFile(delete=False, suffix='.csv')
    real_contents = await real.read()
    temp_real.write(real_contents)
    temp_real.close()
    
    temp_synth = NamedTemporaryFile(delete=False, suffix='.csv')
    synth_contents = await synthetic.read()
    temp_synth.write(synth_contents)
    temp_synth.close()
    
    try:
        df_real = pd.read_csv(temp_real.name)
        df_synth = pd.read_csv(temp_synth.name)
        results = evaluate_synthetic_data(df_real, df_synth)
    finally:
        os.unlink(temp_real.name)
        os.unlink(temp_synth.name)
    
    return sanitize_json(results) 