import 'package:meta/meta.dart';

@immutable
class LoadExoplanetsAction {
  const LoadExoplanetsAction();
}

@immutable
class LoadExoplanetsSuccessAction {
  final List<dynamic> exoplanets; // Use dynamic for now

  const LoadExoplanetsSuccessAction({required this.exoplanets});
}

@immutable
class LoadExoplanetsFailureAction {
  final String error;

  const LoadExoplanetsFailureAction({required this.error});
}

@immutable
class ToggleFavoriteAction {
  final String exoplanetId;

  const ToggleFavoriteAction({required this.exoplanetId});
}