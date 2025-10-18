import '../app_state.dart';
import '../actions/ui_actions.dart';

AppState uiReducer(AppState state, dynamic action) {
  if (action is SetLoadingAction) {
    return state.copyWith(
      uiState: state.uiState.copyWith(isLoading: action.isLoading),
    );
  }

  if (action is SetErrorAction) {
    return state.copyWith(
      uiState: state.uiState.copyWith(globalError: action.error),
    );
  }

  if (action is ClearErrorAction) {
    return state.copyWith(
      uiState: state.uiState.copyWith(globalError: null),
    );
  }

  return state;
}