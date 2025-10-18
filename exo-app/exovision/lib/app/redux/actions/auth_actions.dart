import 'package:meta/meta.dart';

@immutable
class LoginRequestAction {
  const LoginRequestAction();
}

@immutable
class LoginSuccessAction {
  final String token;
  final String userEmail;

  const LoginSuccessAction({
    required this.token,
    required this.userEmail,
  });
}

@immutable
class LoginFailureAction {
  final String error;

  const LoginFailureAction({required this.error});
}

@immutable
class LogoutAction {
  const LogoutAction();
}