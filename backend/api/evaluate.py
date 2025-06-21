from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from tempfile import NamedTemporaryFile
import os
import numpy as np
import logging
from scipy.spatial.distance import cdist
from sklearn.preprocessing import MinMaxScaler
from scipy.stats import ks_2samp, wasserstein_distance

router = APIRouter()
logger = logging.getLogger(__name__)

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
            mismatch_count = sum(real_df.dtypes != synthetic_df.dtypes)
            score = float(mismatch_count / len(real_df.columns))
            return max(0.0, min(1.0, score))
        except Exception as e:
            logger.warning(f"Metric 'data_mismatch' failed: {e}. Returning 0.0.")
            return 0.0

    def common_rows_proportion():
        try:
            common_cols = [col for col in real_df.columns if col in synthetic_df.columns]
            if not common_cols or len(real_df) == 0:
                return 0.0
            common = pd.merge(real_df[common_cols], synthetic_df[common_cols], on=common_cols)
            score = float(len(common) / len(real_df))
            return max(0.0, min(1.0, score))
        except Exception as e:
            logger.warning(f"Metric 'common_rows_proportion' failed: {e}. Returning 0.0.")
            return 0.0

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
        except Exception as e:
            logger.warning(f"Distance calculation failed: {e}. Some metrics may default to 0.0.")

    def nearest_syn_neighbor_distance():
        try:
            if min_dists_rs is None: return 0.0
            scaler = MinMaxScaler()
            scaled_distances = scaler.fit_transform(min_dists_rs.reshape(-1, 1))
            score = float(np.mean(scaled_distances))
            return max(0.0, min(1.0, score))
        except Exception as e:
            logger.warning(f"Metric 'nearest_syn_neighbor_distance' failed: {e}. Returning 0.0.")
            return 0.0

    def close_values_probability():
        try:
            if min_dists_sr is None or mean_dist_rr is None or len(synth_num) == 0:
                return 0.0
            threshold = 0.1 * mean_dist_rr
            close_count = np.sum(min_dists_sr < threshold)
            score = float(close_count / len(synth_num))
            return max(0.0, min(1.0, score))
        except Exception as e:
            logger.warning(f"Metric 'close_values_probability' failed: {e}. Returning 0.0.")
            return 0.0

    def distant_values_probability():
        try:
            if min_dists_sr is None or mean_dist_rr is None or len(synth_num) == 0:
                return 0.0
            threshold = 2 * mean_dist_rr
            distant_count = np.sum(min_dists_sr > threshold)
            score = float(distant_count / len(synth_num))
            return max(0.0, min(1.0, score))
        except Exception as e:
            logger.warning(f"Metric 'distant_values_probability' failed: {e}. Returning 0.0.")
            return 0.0
            
    def feature_distribution_similarity():
        try:
            distances = []
            for col in real_num.columns:
                if col in synth_num.columns:
                    real_col, synth_col = real_df[col].dropna(), synthetic_df[col].dropna()
                    if len(real_col) > 1 and len(synth_col) > 1:
                        scaler = MinMaxScaler()
                        all_data = pd.concat([real_col, synth_col]).to_numpy().reshape(-1, 1)
                        scaler.fit(all_data)
                        norm_real = scaler.transform(real_col.to_numpy().reshape(-1, 1)).flatten()
                        norm_synth = scaler.transform(synth_col.to_numpy().reshape(-1, 1)).flatten()
                        distances.append(wasserstein_distance(norm_real, norm_synth))
            
            if not distances: return 0.0
            avg_dist = np.mean(distances)
            score = 1 / (1 + avg_dist)
            return max(0.0, min(1.0, score))
        except Exception as e:
            logger.warning(f"Metric 'feature_distribution_similarity' failed: {e}. Returning 0.0.")
            return 0.0

    return {
        "data_mismatch": data_mismatch(),
        "common_rows_proportion": common_rows_proportion(),
        "nearest_syn_neighbor_distance": nearest_syn_neighbor_distance(),
        "close_values_probability": close_values_probability(),
        "distant_values_probability": distant_values_probability(),
        "feature_distribution_similarity": feature_distribution_similarity(),
    }

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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed during file processing: {e}")
    finally:
        os.unlink(temp_real.name)
        os.unlink(temp_synth.name)
    
    return sanitize_json(results) 