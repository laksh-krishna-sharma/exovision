import 'package:equatable/equatable.dart';

class ExoplanetEntity extends Equatable {
  final String id;
  final String name;
  final String discoveryMethod;
  final int discoveryYear;
  final double? orbitalPeriod;
  final double? planetRadius;
  final double? planetMass;
  final double? equilibriumTemperature;
  final String? hostStar;
  final double? distanceFromEarth;
  final bool isHabitable;
  final String description;
  final String imageUrl;
  final double rating;
  final bool isFavorite;

  const ExoplanetEntity({
    required this.id,
    required this.name,
    required this.discoveryMethod,
    required this.discoveryYear,
    this.orbitalPeriod,
    this.planetRadius,
    this.planetMass,
    this.equilibriumTemperature,
    this.hostStar,
    this.distanceFromEarth,
    this.isHabitable = false,
    required this.description,
    required this.imageUrl,
    this.rating = 0.0,
    this.isFavorite = false,
  });

  factory ExoplanetEntity.fromJson(Map<String, dynamic> json) {
    return ExoplanetEntity(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      discoveryMethod: json['discovery_method'] ?? '',
      discoveryYear: json['discovery_year'] ?? 0,
      orbitalPeriod: json['orbital_period']?.toDouble(),
      planetRadius: json['planet_radius']?.toDouble(),
      planetMass: json['planet_mass']?.toDouble(),
      equilibriumTemperature: json['equilibrium_temperature']?.toDouble(),
      hostStar: json['host_star'],
      distanceFromEarth: json['distance_from_earth']?.toDouble(),
      isHabitable: json['is_habitable'] ?? false,
      description: json['description'] ?? '',
      imageUrl: json['image_url'] ?? '',
      rating: json['rating']?.toDouble() ?? 0.0,
      isFavorite: json['is_favorite'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'discovery_method': discoveryMethod,
      'discovery_year': discoveryYear,
      'orbital_period': orbitalPeriod,
      'planet_radius': planetRadius,
      'planet_mass': planetMass,
      'equilibrium_temperature': equilibriumTemperature,
      'host_star': hostStar,
      'distance_from_earth': distanceFromEarth,
      'is_habitable': isHabitable,
      'description': description,
      'image_url': imageUrl,
      'rating': rating,
      'is_favorite': isFavorite,
    };
  }

  ExoplanetEntity copyWith({
    String? id,
    String? name,
    String? discoveryMethod,
    int? discoveryYear,
    double? orbitalPeriod,
    double? planetRadius,
    double? planetMass,
    double? equilibriumTemperature,
    String? hostStar,
    double? distanceFromEarth,
    bool? isHabitable,
    String? description,
    String? imageUrl,
    double? rating,
    bool? isFavorite,
  }) {
    return ExoplanetEntity(
      id: id ?? this.id,
      name: name ?? this.name,
      discoveryMethod: discoveryMethod ?? this.discoveryMethod,
      discoveryYear: discoveryYear ?? this.discoveryYear,
      orbitalPeriod: orbitalPeriod ?? this.orbitalPeriod,
      planetRadius: planetRadius ?? this.planetRadius,
      planetMass: planetMass ?? this.planetMass,
      equilibriumTemperature: equilibriumTemperature ?? this.equilibriumTemperature,
      hostStar: hostStar ?? this.hostStar,
      distanceFromEarth: distanceFromEarth ?? this.distanceFromEarth,
      isHabitable: isHabitable ?? this.isHabitable,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      rating: rating ?? this.rating,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }

  @override
  List<Object?> get props => [
        id,
        name,
        discoveryMethod,
        discoveryYear,
        orbitalPeriod,
        planetRadius,
        planetMass,
        equilibriumTemperature,
        hostStar,
        distanceFromEarth,
        isHabitable,
        description,
        imageUrl,
        rating,
        isFavorite,
      ];
}