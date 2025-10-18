import 'package:meta/meta.dart';
import '../../features/auth/domain/entities/user_entity.dart';
import '../../features/exoplanets/domain/entities/exoplanet_entity.dart';


// Add AuthState class
class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final String? token;
  final String? userEmail;
  final String? error;
  final UserEntity? user;

  const AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.token,
    this.userEmail,
    this.error,
    this.user,
  });

  factory AuthState.initial() {
    return const AuthState(
      isLoading: false,
      isAuthenticated: false,
      token: null,
      userEmail: null,
      error: null,
      user: null,
    );
  }

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    String? token,
    String? userEmail,
    String? error,
    UserEntity? user,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      token: token ?? this.token,
      userEmail: userEmail ?? this.userEmail,
      error: error ?? this.error,
      user: user ?? this.user,
    );
  }
}

// Add UIState class
class UIState {
  final bool isLoading;
  final String? globalError;

  const UIState({
    this.isLoading = false,
    this.globalError,
  });

  factory UIState.initial() {
    return const UIState(
      isLoading: false,
      globalError: null,
    );
  }

  UIState copyWith({
    bool? isLoading,
    String? globalError,
  }) {
    return UIState(
      isLoading: isLoading ?? this.isLoading,
      globalError: globalError ?? this.globalError,
    );
  }
}


// Add ExoplanetState class
class ExoplanetState {
  final bool isLoading;
  final List<ExoplanetEntity> exoplanets;
  final List<String> favorites;
  final String? error;

  const ExoplanetState({
    this.isLoading = false,
    this.exoplanets = const [],
    this.favorites = const [],
    this.error,
  });

  factory ExoplanetState.initial() {
    return const ExoplanetState(
      isLoading: false,
      exoplanets: [],
      favorites: [],
      error: null,
    );
  }

  ExoplanetState copyWith({
    bool? isLoading,
    List<ExoplanetEntity>? exoplanets,
    List<String>? favorites,
    String? error,
  }) {
    return ExoplanetState(
      isLoading: isLoading ?? this.isLoading,
      exoplanets: exoplanets ?? this.exoplanets,
      favorites: favorites ?? this.favorites,
      error: error ?? this.error,
    );
  }
}

@immutable
class AppState {
  final AuthState authState;
  final UIState uiState;
  final ExoplanetState exoplanetState;

  const AppState({
    required this.authState,
    required this.uiState,
    required this.exoplanetState,
  });

  factory AppState.initial() {
    return AppState(
      authState: AuthState.initial(),
      uiState: UIState.initial(),
      exoplanetState: ExoplanetState.initial(),
    );
  }

  AppState copyWith({
    AuthState? authState,
    UIState? uiState,
    ExoplanetState? exoplanetState,
  }) {
    return AppState(
      authState: authState ?? this.authState,
      uiState: uiState ?? this.uiState,
      exoplanetState: exoplanetState ?? this.exoplanetState,
    );
  }
}