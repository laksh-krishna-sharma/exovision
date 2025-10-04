import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors
  static const Color primary = Color(0xFF0066FF);
  static const Color primaryDark = Color(0xFF0052CC);
  static const Color primaryLight = Color(0xFF4D94FF);

  // Secondary Colors
  static const Color secondary = Color(0xFF6C757D);
  static const Color secondaryDark = Color(0xFF545B62);
  static const Color secondaryLight = Color(0xFF8A9399);

  // Background Colors
  static const Color background = Color(0xFF0A0E17);
  static const Color surface = Color(0xFF1E232F);
  static const Color card = Color(0xFF2A2F3D);

  // Accent Colors
  static const Color cyan = Color(0xFF00D4FF);
  static const Color purple = Color(0xFF9D4EDD);
  static const Color pink = Color(0xFFFF0080);

  // Status Colors
  static const Color success = Color(0xFF28A745);
  static const Color warning = Color(0xFFFFC107);
  static const Color error = Color(0xFFDC3545);
  static const Color info = Color(0xFF17A2B8);

  // Text Colors
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFB0B8C5);
  static const Color textTertiary = Color(0xFF8A9399);

  // Border Colors
  static const Color border = Color(0xFF3A3F4D);
  static const Color borderLight = Color(0xFF4A4F5D);

  // Gradient Colors
  static const LinearGradient spaceGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFF0A0E17),
      Color(0xFF1A1F2E),
      Color(0xFF2A2F3D),
    ],
  );

  static const LinearGradient buttonGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [
      Color(0xFF0066FF),
      Color(0xFF00D4FF),
    ],
  );
}