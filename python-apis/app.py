"""
app.py — Bug 9 Fix: Added /suggestions route using gemini_client.
"""
from flask import Flask, request, jsonify
from predict import predict_mental_health
from flask_cors import CORS
import json
import subprocess

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin requests


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Missing input data'}), 400

        prediction = predict_mental_health(data)
        return jsonify(prediction)

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


# Bug 9 Fix: Added /suggestions route
@app.route('/suggestions', methods=['POST'])
def suggestions():
    """
    Accepts JSON with user_data and returns Gemini AI suggestions.
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Missing input data'}), 400

        # Run generate_suggestions.py as subprocess to isolate Gemini calls
        result = subprocess.run(
            ['python', 'generate_suggestions.py', json.dumps(data)],
            capture_output=True,
            text=True,
            cwd='.',
            timeout=30
        )

        if result.returncode != 0:
            return jsonify({'error': result.stderr or 'Suggestion generation failed'}), 500

        output = result.stdout.strip()
        if not output:
            return jsonify({'suggestions': []}), 200

        suggestions_list = json.loads(output)
        return jsonify({'suggestions': suggestions_list})

    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Gemini API timed out'}), 504
    except json.JSONDecodeError as e:
        return jsonify({'error': f'JSON parse error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'MindBridge ML API'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
