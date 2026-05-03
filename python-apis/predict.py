"""
predict.py — Bug 10 Fix: Updated to use unified 8-feature input matching the frontend.
Features: sleep_hours, mood_score, fatigue_level, stress_level,
          social_interaction, restlessness_level, trauma_history, mood_swings
"""
import joblib
import numpy as np
import os

# Unified feature set — matches train.py and frontend inputData
FEATURES = ['sleep_hours', 'mood_score', 'fatigue_level', 'stress_level',
            'social_interaction', 'restlessness_level', 'trauma_history', 'mood_swings']

DISEASES = ['depression', 'anxiety', 'bipolar', 'schizophrenia', 'ptsd']


def predict_mental_health(data):
    """
    data: dict with keys matching FEATURES
    Returns: { 'predictions': { disease: 0/1, ... }, 'raw_scores': { disease: float, ... } }
    """
    # Check if all required features are present
    missing = [f for f in FEATURES if f not in data]
    if missing:
        return {
            'error': f'Missing required features: {missing}',
            'predictions': {},
            'raw_scores': {}
        }

    try:
        # Build feature vector
        X = np.array([[float(data[f]) for f in FEATURES]])

        predictions = {}
        raw_scores = {}
        prediction_labels = {}

        for disease in DISEASES:
            model_path = f'models/{disease}_model.pkl'
            if not os.path.exists(model_path):
                predictions[disease] = -1  # Model not trained
                raw_scores[disease] = 0.0
                continue

            model = joblib.load(model_path)
            pred = int(model.predict(X)[0])
            predictions[disease] = pred

            # Get probability if supported
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(X)[0]
                # Probability of positive class (index 1)
                raw_scores[disease] = round(float(proba[1]) * 100, 1)
            else:
                raw_scores[disease] = float(pred) * 100

            prediction_labels[disease] = "Likely" if pred == 1 else "Unlikely"

        # Compute overall risk
        positive_count = sum(1 for v in predictions.values() if v == 1)
        if positive_count == 0:
            overall_risk = "low"
        elif positive_count <= 2:
            overall_risk = "moderate"
        else:
            overall_risk = "high"

        # Create a human-readable summary
        flagged = [d for d, v in predictions.items() if v == 1]
        if flagged:
            prediction_text = f"Based on your inputs, you may show signs of: {', '.join([d.capitalize() for d in flagged])}. Please consult a mental health professional for a proper diagnosis."
        else:
            prediction_text = "Based on your inputs, no significant signs of the assessed conditions were detected. Continue maintaining healthy habits!"

        return {
            'predictions': predictions,
            'prediction_labels': prediction_labels,
            'raw_scores': raw_scores,
            'overall_risk': overall_risk,
            'prediction': prediction_text,
            'flagged_conditions': flagged,
        }

    except Exception as e:
        return {'error': str(e), 'predictions': {}, 'raw_scores': {}}
