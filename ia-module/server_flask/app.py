from flask import Flask, request, jsonify
import os, sys
import uuid
from inference.predict import load_model, predict
from werkzeug.utils import secure_filename

# Configuration
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = os.environ.get("MODEL_PATH", "../training/mobilenet_trained.h5")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Le modèle n'existe pas à l'emplacement : {MODEL_PATH}")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
# Initialiser Flask
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Charger le modèle au démarrage
MODEL_PATH = os.environ.get("MODEL_PATH", "ia-module/training/model.h5")
CLASS_NAMES = os.environ.get("CLASS_NAMES", "papier plast​ique verre metal autres").split()
IMG_SIZE = int(os.environ.get("IMG_SIZE", 128))
model = load_model(MODEL_PATH)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/predict', methods=['POST'])
def predict_route():
    # Vérifier qu'un fichier a été envoyé
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier envoyé'}), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Fichier non valide'}), 400

    # Sauvegarder temporairement
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    filename = secure_filename(str(uuid.uuid4()) + "_" + file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Prédiction
    label, confidence = predict(
        filepath,
        model,
        CLASS_NAMES,
        IMG_SIZE
    )

    # Nettoyer le fichier
    os.remove(filepath)

    return jsonify({
        'label': label,
        'confidence': confidence
    })

if __name__ == '__main__':
    port = int(os.environ.get("FLASK_PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
