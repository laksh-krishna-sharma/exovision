import 'package:meta/meta.dart';

@immutable
class SetLoadingAction {
  final bool isLoading;

  const SetLoadingAction({required this.isLoading});
}

@immutable
class SetErrorAction {
  final String? error;

  const SetErrorAction({this.error});
}

@immutable
class ClearErrorAction {}