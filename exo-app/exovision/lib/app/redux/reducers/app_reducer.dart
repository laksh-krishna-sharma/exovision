import '../app_state.dart';

AppState appReducer(AppState state, dynamic action) {
  return state.copyWith(
    authState: _authReducer(state.authState, action),
    uiState: _uiReducer(state.uiState, action),
    exoplanetState: _exoplanetReducer(state.exoplanetState, action),
  );
}

AuthState _authReducer(AuthState state, dynamic action) {
  // Simple implementation for now
  return state;
}

UIState _uiReducer(UIState state, dynamic action) {
  // Simple implementation for now
  return state;
}

ExoplanetState _exoplanetReducer(ExoplanetState state, dynamic action) {
  // Simple implementation for now
  return state;
}