import 'package:equatable/equatable.dart';

class PredictionEntity extends Equatable {
  final String id;
  final String modelName;
  final Map<String, double> inputParameters;
  final double confidence;
  final bool isPlanetDetected;
  final String result;
  final DateTime createdAt;
  final String? description;

  const PredictionEntity({
    required this.id,
    required this.modelName,
    required this.inputParameters,
    required this.confidence,
    required this.isPlanetDetected,
    required this.result,
    required this.createdAt,
    this.description,
  });

  factory PredictionEntity.fromJson(Map<String, dynamic> json) {
    return PredictionEntity(
      id: json['id'] ?? '',
      modelName: json['model_name'] ?? '',
      inputParameters: Map<String, double>.from(
        json['input_parameters']?.map((key, value) => 
          MapEntry(key, value?.toDouble() ?? 0.0)) ?? {}
      ),
      confidence: json['confidence']?.toDouble() ?? 0.0,
      isPlanetDetected: json['is_planet_detected'] ?? false,
      result: json['result'] ?? '',
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'model_name': modelName,
      'input_parameters': inputParameters,
      'confidence': confidence,
      'is_planet_detected': isPlanetDetected,
      'result': result,
      'created_at': createdAt.toIso8601String(),
      'description': description,
    };
  }

  PredictionEntity copyWith({
    String? id,
    String? modelName,
    Map<String, double>? inputParameters,
    double? confidence,
    bool? isPlanetDetected,
    String? result,
    DateTime? createdAt,
    String? description,
  }) {
    return PredictionEntity(
      id: id ?? this.id,
      modelName: modelName ?? this.modelName,
      inputParameters: inputParameters ?? this.inputParameters,
      confidence: confidence ?? this.confidence,
      isPlanetDetected: isPlanetDetected ?? this.isPlanetDetected,
      result: result ?? this.result,
      createdAt: createdAt ?? this.createdAt,
      description: description ?? this.description,
    );
  }

  @override
  List<Object?> get props => [
        id,
        modelName,
        inputParameters,
        confidence,
        isPlanetDetected,
        result,
        createdAt,
        description,
      ];
}