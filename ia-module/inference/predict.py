#!/usr/bin/env python3
import argparse
import numpy as np
from PIL import Image
import tensorflow as tf
# Import correct de preprocess_input pour MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import load_model

def load_model_from_path(model_path: str):
    """Charge et renvoie un modèle Keras depuis un fichier .h5."""
    return load_model(model_path)

def preprocess_image(img_path: str, img_size: int):
    """
    Ouvre une image, la redimensionne et applique le preprocess_input
    spécifique à MobileNetV2.
    """
    img = Image.open(img_path).convert('RGB')
    img = img.resize((img_size, img_size))
    arr = np.array(img)
    arr = preprocess_input(arr)       # normalisation MobileNetV2
    return np.expand_dims(arr, axis=0)

def predict_trash(image_path: str, model, class_names: list, img_size: int):
    """
    Prédit la classe de déchet sur une image donnée.
    Retourne (label, confiance).
    """
    tensor = preprocess_image(image_path, img_size)
    preds = model.predict(tensor)
    idx = int(np.argmax(preds, axis=1)[0])
    return class_names[idx], float(preds[0][idx])

def main():
    parser = argparse.ArgumentParser(
        description="Prédiction IA pour tri des déchets (MobileNetV2 fine-tuned)")
    parser.add_argument("image_path", type=str,
                        help="Chemin de l'image à classifier")
    parser.add_argument("--model", type=str,
                        default="../training/mobilenet_trained.h5",
                        help="Chemin du modèle .h5 à charger")
    parser.add_argument("--classes", nargs="+",
                        default=['papier', 'plastique', 'verre', 'metal', 'autres'],
                        help="Liste des classes dans l'ordre du training")
    parser.add_argument("--img_size", type=int, default=224,
                        help="Taille (largeur=hauteur) des images pour MobileNetV2")
    args = parser.parse_args()

    # Chargement du modèle
    model = load_model_from_path(args.model)

    # Prédiction
    label, confidence = predict_trash(
        args.image_path,
        model,
        args.classes,
        args.img_size
    )

    # Affichage du résultat
    print({ "label": label, "confidence": round(confidence, 4) })

if __name__ == "__main__":
    main()
