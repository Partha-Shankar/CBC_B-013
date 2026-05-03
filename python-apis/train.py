"""
train.py — Feature 9 Fix: Redesigned with 100+ synthetic samples and 8 unified features.
Features: sleep_hours, mood_score, fatigue_level, stress_level,
          social_interaction, restlessness_level, trauma_history, mood_swings
"""
import numpy as np
import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

np.random.seed(42)
os.makedirs('models', exist_ok=True)
os.makedirs('datasets', exist_ok=True)

FEATURES = ['sleep_hours', 'mood_score', 'fatigue_level', 'stress_level',
            'social_interaction', 'restlessness_level', 'trauma_history', 'mood_swings']


def generate_depression_data(n=100):
    """Depression: poor sleep, low mood, high fatigue, high stress, low social"""
    positive = np.column_stack([
        np.random.uniform(3, 6, n),    # sleep_hours (poor)
        np.random.uniform(1, 4, n),    # mood_score (low)
        np.random.uniform(7, 10, n),   # fatigue_level (high)
        np.random.uniform(7, 10, n),   # stress_level (high)
        np.random.uniform(1, 4, n),    # social_interaction (low)
        np.random.uniform(4, 8, n),    # restlessness_level (moderate)
        np.zeros(n),                   # trauma_history
        np.random.uniform(4, 8, n),    # mood_swings (moderate)
    ])
    negative = np.column_stack([
        np.random.uniform(7, 9, n),    # sleep_hours (good)
        np.random.uniform(7, 10, n),   # mood_score (high)
        np.random.uniform(1, 4, n),    # fatigue_level (low)
        np.random.uniform(1, 4, n),    # stress_level (low)
        np.random.uniform(6, 10, n),   # social_interaction (high)
        np.random.uniform(1, 4, n),    # restlessness_level (low)
        np.zeros(n),                   # trauma_history
        np.random.uniform(1, 4, n),    # mood_swings (low)
    ])
    X = np.vstack([positive, negative])
    y = np.concatenate([np.ones(n), np.zeros(n)])
    return X, y


def generate_anxiety_data(n=100):
    """Anxiety: high restlessness, poor sleep quality, high stress"""
    positive = np.column_stack([
        np.random.uniform(4, 7, n),    # sleep_hours (disrupted)
        np.random.uniform(3, 6, n),    # mood_score (low-medium)
        np.random.uniform(5, 8, n),    # fatigue_level (moderate)
        np.random.uniform(8, 10, n),   # stress_level (very high)
        np.random.uniform(2, 5, n),    # social_interaction (low)
        np.random.uniform(7, 10, n),   # restlessness_level (very high)
        np.random.uniform(0, 0.5, n),  # trauma_history
        np.random.uniform(5, 9, n),    # mood_swings (high)
    ])
    negative = np.column_stack([
        np.random.uniform(7, 9, n),
        np.random.uniform(7, 10, n),
        np.random.uniform(1, 4, n),
        np.random.uniform(1, 4, n),
        np.random.uniform(6, 10, n),
        np.random.uniform(1, 4, n),
        np.zeros(n),
        np.random.uniform(1, 4, n),
    ])
    X = np.vstack([positive, negative])
    y = np.concatenate([np.ones(n), np.zeros(n)])
    return X, y


def generate_bipolar_data(n=100):
    """Bipolar: extreme mood swings, high energy, erratic patterns"""
    positive = np.column_stack([
        np.random.uniform(3, 8, n),    # sleep_hours (variable)
        np.random.uniform(1, 10, n),   # mood_score (very variable)
        np.random.uniform(2, 9, n),    # fatigue_level (variable)
        np.random.uniform(5, 9, n),    # stress_level (high)
        np.random.uniform(3, 8, n),    # social_interaction (variable)
        np.random.uniform(6, 10, n),   # restlessness_level (high)
        np.random.uniform(0, 0.3, n),  # trauma_history
        np.random.uniform(8, 10, n),   # mood_swings (extreme)
    ])
    negative = np.column_stack([
        np.random.uniform(7, 9, n),
        np.random.uniform(6, 9, n),
        np.random.uniform(1, 4, n),
        np.random.uniform(1, 5, n),
        np.random.uniform(5, 10, n),
        np.random.uniform(1, 4, n),
        np.zeros(n),
        np.random.uniform(1, 3, n),
    ])
    X = np.vstack([positive, negative])
    y = np.concatenate([np.ones(n), np.zeros(n)])
    return X, y


def generate_schizophrenia_data(n=100):
    """Schizophrenia: severe sleep issues, very disorganized, trauma history"""
    positive = np.column_stack([
        np.random.uniform(2, 5, n),    # sleep_hours (very poor)
        np.random.uniform(1, 4, n),    # mood_score (low)
        np.random.uniform(7, 10, n),   # fatigue_level (high)
        np.random.uniform(7, 10, n),   # stress_level (high)
        np.random.uniform(1, 3, n),    # social_interaction (very low)
        np.random.uniform(5, 9, n),    # restlessness_level (high)
        np.ones(n),                    # trauma_history (present)
        np.random.uniform(6, 10, n),   # mood_swings (high)
    ])
    negative = np.column_stack([
        np.random.uniform(7, 9, n),
        np.random.uniform(6, 10, n),
        np.random.uniform(1, 4, n),
        np.random.uniform(1, 4, n),
        np.random.uniform(5, 10, n),
        np.random.uniform(1, 4, n),
        np.zeros(n),
        np.random.uniform(1, 4, n),
    ])
    X = np.vstack([positive, negative])
    y = np.concatenate([np.ones(n), np.zeros(n)])
    return X, y


def generate_ptsd_data(n=100):
    """PTSD: trauma history, flashbacks, sleep disturbances, high stress"""
    positive = np.column_stack([
        np.random.uniform(3, 6, n),    # sleep_hours (poor - nightmares)
        np.random.uniform(2, 5, n),    # mood_score (low)
        np.random.uniform(6, 9, n),    # fatigue_level (high)
        np.random.uniform(7, 10, n),   # stress_level (very high)
        np.random.uniform(1, 4, n),    # social_interaction (low - avoidance)
        np.random.uniform(6, 10, n),   # restlessness_level (high - hypervigilance)
        np.ones(n),                    # trauma_history (always present in PTSD)
        np.random.uniform(5, 9, n),    # mood_swings (high)
    ])
    negative = np.column_stack([
        np.random.uniform(7, 9, n),
        np.random.uniform(6, 10, n),
        np.random.uniform(1, 4, n),
        np.random.uniform(1, 4, n),
        np.random.uniform(5, 10, n),
        np.random.uniform(1, 4, n),
        np.zeros(n),
        np.random.uniform(1, 4, n),
    ])
    X = np.vstack([positive, negative])
    y = np.concatenate([np.ones(n), np.zeros(n)])
    return X, y


def train_model(disease, X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"✅ {disease.capitalize()} model — Accuracy: {acc * 100:.1f}%")

    # Save model
    joblib.dump(model, f'models/{disease}_model.pkl')

    # Save training data as CSV
    df = pd.DataFrame(X, columns=FEATURES)
    df[disease] = y.astype(int)
    df.to_csv(f'datasets/{disease}.csv', index=False)

    return model


def train_all_models():
    generators = {
        'depression': generate_depression_data,
        'anxiety': generate_anxiety_data,
        'bipolar': generate_bipolar_data,
        'schizophrenia': generate_schizophrenia_data,
        'ptsd': generate_ptsd_data,
    }

    for disease, generator in generators.items():
        X, y = generator(n=100)
        train_model(disease, X, y)

    print("\n✅ All 5 mental health models trained and saved with 200 samples each.")
    print(f"   Features: {FEATURES}")


if __name__ == "__main__":
    train_all_models()
