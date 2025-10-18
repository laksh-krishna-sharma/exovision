class AppConstants {
  // App Information
  static const String appName = 'Exovision';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'AI-Powered Exoplanet Discovery';

  // API Constants
  static const String baseUrl = 'https://api.exovision.com';
  static const int apiTimeout = 30000;

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'app_theme';

  // Animation Durations
  static const Duration pageTransitionDuration = Duration(milliseconds: 300);
  static const Duration buttonAnimationDuration = Duration(milliseconds: 200);
  static const Duration shimmerDuration = Duration(milliseconds: 1500);

  // Responsive Breakpoints
  static const double mobileBreakpoint = 600;
  static const double tabletBreakpoint = 1200;

  // Padding/Margin Constants
  static const double smallPadding = 8.0;
  static const double mediumPadding = 16.0;
  static const double largePadding = 24.0;
  static const double extraLargePadding = 32.0;

  // Border Radius
  static const double smallBorderRadius = 8.0;
  static const double mediumBorderRadius = 12.0;
  static const double largeBorderRadius = 16.0;
  static const double extraLargeBorderRadius = 20.0;
}