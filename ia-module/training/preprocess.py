import os
import shutil
import random
import argparse

def split_dataset(source_dir, train_dir, val_dir, val_split=0.2, seed=42):
    """
    Répartit les images de chaque classe en dossiers train et validation
    :param source_dir: dossier source contenant sous-dossiers pour chaque classe
    :param train_dir: dossier de sortie pour les images d'entraînement
    :param val_dir: dossier de sortie pour les images de validation
    :param val_split: fraction des images à utiliser pour la validation
    """
    random.seed(seed)
    classes = [d for d in os.listdir(source_dir)
               if os.path.isdir(os.path.join(source_dir, d))]
    for cls in classes:
        cls_src = os.path.join(source_dir, cls)
        images = [os.path.join(cls_src, f) for f in os.listdir(cls_src)
                  if os.path.isfile(os.path.join(cls_src, f))]
        random.shuffle(images)
        split_idx = int(len(images) * (1 - val_split))
        train_imgs = images[:split_idx]
        val_imgs   = images[split_idx:]

        # Création des dossiers
        os.makedirs(os.path.join(train_dir, cls), exist_ok=True)
        os.makedirs(os.path.join(val_dir, cls), exist_ok=True)

        # Copie des images
        for img_path in train_imgs:
            shutil.copy(img_path,
                        os.path.join(train_dir, cls, os.path.basename(img_path)))
        for img_path in val_imgs:
            shutil.copy(img_path,
                        os.path.join(val_dir,   cls, os.path.basename(img_path)))

    print("Split terminé : environ",
          split_idx, "images d'entraînement et",
          len(images) - split_idx, "images de validation par classe.")

def main():
    parser = argparse.ArgumentParser(
        description="Prépare les dossiers train/validation pour l'entraînement IA")
    parser.add_argument("--source",    type=str,
                        default="../data/dataset",
                        help="Dossier source des images classées par sous-dossiers")
    parser.add_argument("--output",    type=str,
                        default="../data/processed",
                        help="Dossier de sortie pour train/val")
    parser.add_argument("--val_split", type=float,
                        default=0.2,
                        help="Fraction pour validation")
    args = parser.parse_args()

    train_dir = os.path.join(args.output, "train")
    val_dir   = os.path.join(args.output, "val")
    split_dataset(args.source, train_dir, val_dir, args.val_split)

if __name__ == "__main__":
    main()
