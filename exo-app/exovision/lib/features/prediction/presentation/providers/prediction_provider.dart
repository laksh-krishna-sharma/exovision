import 'package:flutter/material.dart';
import '../../domain/entities/prediction_entity.dart';

class PredictionProvider extends ChangeNotifier {
  List<PredictionEntity> _predictions = [];
  bool _isLoading = false;
  String? _error;
  String _selectedModel = 'Random Forest';

  List<PredictionEntity> get predictions => _predictions;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get selectedModel => _selectedModel;

  final List<String> availableModels = [
    'Random Forest',
    'Neural Network',
    'Support Vector Machine',
    'Gradient Boosting',
  ];

  void setSelectedModel(String model) {
    _selectedModel = model;
    notifyListeners();
  }

  Future<void> loadPredictions() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Mock data for now
      await Future.delayed(const Duration(seconds: 1));
      _predictions = [
        PredictionEntity(
          id: '1',
          modelName: 'Random Forest',
          inputParameters: {
            'period': 3.5,
            'radius': 1.2,
            'temperature': 1200.0,
          },
          confidence: 0.85,
          isPlanetDetected: true,
          result: 'Planet Detected',
          createdAt: DateTime.now().subtract(const Duration(hours: 2)),
          description: 'High confidence detection',
        ),
        PredictionEntity(
          id: '2',
          modelName: 'Neural Network',
          inputParameters: {
            'period': 15.2,
            'radius': 0.8,
            'temperature': 800.0,
          },
          confidence: 0.92,
          isPlanetDetected: true,
          result: 'Planet Detected',
          createdAt: DateTime.now().subtract(const Duration(hours: 5)),
          description: 'Very high confidence detection',
        ),
      ];
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> makePrediction(Map<String, double> parameters) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await Future.delayed(const Duration(seconds: 2));
      
      // Mock prediction logic
      final confidence = 0.7 + (parameters.values.reduce((a, b) => a + b) % 0.3);
      final isPlanetDetected = confidence > 0.75;
      
      final newPrediction = PredictionEntity(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        modelName: _selectedModel,
        inputParameters: parameters,
        confidence: confidence,
        isPlanetDetected: isPlanetDetected,
        result: isPlanetDetected ? 'Planet Detected' : 'No Planet Detected',
        createdAt: DateTime.now(),
        description: 'AI prediction result',
      );

      _predictions.insert(0, newPrediction);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void deletePrediction(String id) {
    _predictions.removeWhere((prediction) => prediction.id == id);
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}