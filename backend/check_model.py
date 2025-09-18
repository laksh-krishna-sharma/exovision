#!/usr/bin/env python3

import os
import tensorflow as tf
from tensorflow import keras
import numpy as np

# Test different model files
model_files = [
    "models/kepler_ann.keras",
    "models/kepler_ann.h5",
    "models/kepler_ann_savedmodel"
]

for model_file in model_files:
    print(f"\n=== Testing {model_file} ===")
    if os.path.exists(model_file):
        try:
            model = keras.models.load_model(model_file)
            print(f"Model loaded successfully!")
            print(f"Input shape: {model.input_shape}")
            print(f"Output shape: {model.output_shape}")
            print(f"Model summary:")
            model.summary()
            
            # Test with different input sizes
            for n_features in [20, 42]:
                try:
                    test_input = np.random.random((1, n_features)).astype(np.float32)
                    prediction = model.predict(test_input, verbose=0)
                    print(f"  ✅ Works with {n_features} features: {prediction}")
                except Exception as e:
                    print(f"  ❌ Fails with {n_features} features: {e}")
                    
        except Exception as e:
            print(f"Failed to load: {e}")
    else:
        print(f"File not found: {model_file}")