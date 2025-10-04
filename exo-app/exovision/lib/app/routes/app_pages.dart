import 'package:go_router/go_router.dart';
import '../../features/auth/presentations/pages/landing_page.dart';
import '../../features/auth/presentations/pages/login_page.dart';
import '../../features/auth/presentations/pages/signup_page.dart';
import '../../features/home/presentations/pages/home_page.dart';

class AppPages {
  static const String initial = '/';

  static final GoRouter router = GoRouter(
    initialLocation: initial,
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const LandingPage(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupPage(),
      ),
    ],
  );
}