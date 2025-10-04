import 'package:go_router/go_router.dart';

class NavigationService {
  final GoRouter router;

  NavigationService(this.router);

  void goTo(String path) {
    router.go(path);
  }

  void push(String path) {
    router.push(path);
  }

  void pop() {
    router.pop();
  }

  void goHome() {
    router.go('/home');
  }

  void goLogin() {
    router.go('/login');
  }
}