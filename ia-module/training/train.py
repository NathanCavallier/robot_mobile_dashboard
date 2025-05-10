#!/usr/bin/env python3
import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models
import argparse

def build_and_train(train_dir, val_dir, img_size=224, batch_size=32, epochs=10, output_model="mobilenet_trained.h5"):
    # Préparation des générateurs
    datagen = ImageDataGenerator(rescale=1./255)
    train_data = datagen.flow_from_directory(
        train_dir, target_size=(img_size, img_size),
        batch_size=batch_size, class_mode='categorical'
    )
    val_data = datagen.flow_from_directory(
        val_dir, target_size=(img_size, img_size),
        batch_size=batch_size, class_mode='categorical'
    )

    # Transfer learning avec MobileNetV2
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(img_size, img_size, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False  # geler les couches de base

    inputs = tf.keras.Input(shape=(img_size, img_size, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(train_data.num_classes, activation='softmax')(x)

    model = models.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Entraînement
    model.fit(train_data, validation_data=val_data, epochs=epochs)

    # Sauvegarde
    model.save(output_model)
    print(f"Modèle sauvegardé sous {output_model}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Entraînement du modèle IA")
    parser.add_argument("--train_dir",    type=str, default="../data/processed/train")
    parser.add_argument("--val_dir",      type=str, default="../data/processed/val")
    parser.add_argument("--img_size",     type=int, default=224)
    parser.add_argument("--batch_size",   type=int, default=32)
    parser.add_argument("--epochs",       type=int, default=10)
    parser.add_argument("--output_model", type=str, default="mobilenet_trained.h5")
    args = parser.parse_args()

    build_and_train(
        train_dir=args.train_dir,
        val_dir=args.val_dir,
        img_size=args.img_size,
        batch_size=args.batch_size,
        epochs=args.epochs,
        output_model=args.output_model
    )
