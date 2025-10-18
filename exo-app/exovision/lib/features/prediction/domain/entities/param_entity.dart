import 'package:equatable/equatable.dart';

class ParamEntity extends Equatable {
  final String name;
  final String displayName;
  final String unit;
  final double minValue;
  final double maxValue;
  final double defaultValue;
  final String description;
  final bool isRequired;

  const ParamEntity({
    required this.name,
    required this.displayName,
    required this.unit,
    required this.minValue,
    required this.maxValue,
    required this.defaultValue,
    required this.description,
    this.isRequired = true,
  });

  factory ParamEntity.fromJson(Map<String, dynamic> json) {
    return ParamEntity(
      name: json['name'] ?? '',
      displayName: json['display_name'] ?? '',
      unit: json['unit'] ?? '',
      minValue: json['min_value']?.toDouble() ?? 0.0,
      maxValue: json['max_value']?.toDouble() ?? 100.0,
      defaultValue: json['default_value']?.toDouble() ?? 0.0,
      description: json['description'] ?? '',
      isRequired: json['is_required'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'display_name': displayName,
      'unit': unit,
      'min_value': minValue,
      'max_value': maxValue,
      'default_value': defaultValue,
      'description': description,
      'is_required': isRequired,
    };
  }

  ParamEntity copyWith({
    String? name,
    String? displayName,
    String? unit,
    double? minValue,
    double? maxValue,
    double? defaultValue,
    String? description,
    bool? isRequired,
  }) {
    return ParamEntity(
      name: name ?? this.name,
      displayName: displayName ?? this.displayName,
      unit: unit ?? this.unit,
      minValue: minValue ?? this.minValue,
      maxValue: maxValue ?? this.maxValue,
      defaultValue: defaultValue ?? this.defaultValue,
      description: description ?? this.description,
      isRequired: isRequired ?? this.isRequired,
    );
  }

  @override
  List<Object?> get props => [
        name,
        displayName,
        unit,
        minValue,
        maxValue,
        defaultValue,
        description,
        isRequired,
      ];
}