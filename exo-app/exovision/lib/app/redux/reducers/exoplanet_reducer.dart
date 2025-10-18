import '../app_state.dart';
import '../actions/exoplanet_actions.dart';

AppState exoplanetReducer(AppState state, dynamic action) {
  if (action is LoadExoplanetsAction) {
    return state.copyWith(
      exoplanetState: state.exoplanetState.copyWith(
        isLoading: true,
        error: null,
      ),
    );
  }


  

  if (action is LoadExoplanetsSuccessAction) {
    return state.copyWith(
      exoplanetState: state.exoplanetState.copyWith(
        isLoading: false,
        exoplanets: action.exoplanets,
        error: null,
      ),
    );
  }

  if (action is LoadExoplanetsFailureAction) {
    return state.copyWith(
      exoplanetState: state.exoplanetState.copyWith(
        isLoading: false,
        error: action.error,
      ),
    );
  }

  if (action is ToggleFavoriteAction) {
    final List<String> favorites = List.from(state.exoplanetState.favorites);
    if (favorites.contains(action.exoplanetId)) {
      favorites.remove(action.exoplanetId);
    } else {
      favorites.add(action.exoplanetId);
    }
    
    return state.copyWith(
      exoplanetState: state.exoplanetState.copyWith(favorites: favorites),
    );
  }

  return state;
}