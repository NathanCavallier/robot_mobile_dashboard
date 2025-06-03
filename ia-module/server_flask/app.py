import os, sys
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from celery import Celery

# pour charger ton module inference
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# import de ton prédicteur local
from inference.predict import load_model_from_path, predict_trash

# import OpenAI
import openai
from dotenv import load_dotenv
load_dotenv()  # charge les variables d'environnement depuis .env

api_key=os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("La clé API OpenAI n'est pas définie dans les variables d'environnement.")
openai.api_key = api_key

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "uploads"

# charger modèle local
MODEL_PATH  = os.getenv("MODEL_PATH", "./training/mobilenet_trained.h5")
CLASS_NAMES = os.getenv("CLASS_NAMES", "papier plastique verre metal autres").split()
IMG_SIZE    = int(os.getenv("IMG_SIZE", 224))
THRESHOLD   = float(os.getenv("MIN_CONFIDENCE", 0.6))  # seuil minimal

model = load_model_from_path(MODEL_PATH)

# config OpenAI

def allowed_file(fn):
    return '.' in fn and fn.rsplit('.',1)[1].lower() in {'png','jpg','jpeg'}


def fallback_openai(image_path: str):
    import base64
    b64 = base64.b64encode(open(image_path, 'rb').read()).decode()
    prompt = (
        "Tu es un modèle capable de reconnaître le type de déchet "
        "(papier, plastique, verre, métal ou autre).\n"
        "Voici une image encodée en base64 :\n"
        f"{b64}\n"
        "Quel est le type de déchets et pourquoi ? Réponds en un seul mot."
    )
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-4",  # ou gpt-3.5-turbo
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        label = completion['choices'][0]['message']['content'].strip().lower()
        return label, None  # pas de confiance chiffrée
    except Exception as e:
        print(f"Erreur OpenAI : {e}")
        return "erreur", None


# Configuration de Celery
celery = Celery(app.name, broker='redis://localhost:6379/0')

@celery.task
def async_predict_trash(image_path: str):
    """
    Tâche asynchrone pour prédire le type de déchet.
    """
    try:
        label, confidence = predict_trash(image_path, model, CLASS_NAMES, IMG_SIZE)
        return label, confidence
    except Exception as e:
        print(f"Erreur prédiction locale : {e}")
        return fallback_openai(image_path)

@app.route('/predict', methods=['POST'])
def predict_route():
    # 1. réception du fichier
    if 'file' not in request.files:
        return jsonify(error="Aucun fichier envoyé"), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify(error="Fichier non valide"), 400

    # 2. sauvegarde temporaire
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    fname = secure_filename(file.filename)
    fpath = os.path.join(app.config['UPLOAD_FOLDER'], fname)
    file.save(fpath)

    # 3. lancer la tâche asynchrone
    task = async_predict_trash.apply_async(args=[fpath])

    # 4. réponse immédiate avec l'ID de la tâche
    return jsonify(task_id=task.id), 202

# ... (votre code Flask existant) ...

@app.route('/predict/status/<task_id>', methods=['GET'])
def task_status(task_id):
    task = async_predict_trash.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'status': 'Pending...'
        }
    elif task.state == 'SUCCESS':
        label, confidence = task.result  # Récupérer le résultat
        response = {
            'state': task.state,
            'result': {
                'className': label,
                'confidence': confidence if confidence is not None else 'N/A (OpenAI)'
            }
        }
    elif task.state == 'FAILURE':
        response = {
            'state': task.state,
            'error': str(task.info)  # Récupérer l'erreur
        }
    else:
        response = {
            'state': task.state,
            'status': task.info  # Autres états
        }
    return jsonify(response)
# app.py - Serveur Flask pour la prédiction de déchets

    
        

# ... (le reste de votre code Flask) ...

if __name__ == '__main__':
    port = int(os.getenv("FLASK_PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
# Note : pour le déploiement, il faudra ajouter un serveur WSGI (ex: gunicorn) et un reverse proxy (ex: nginx)