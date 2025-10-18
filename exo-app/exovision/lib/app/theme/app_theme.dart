import 'package:flutter/material.dart';
import 'colors.dart';
import 'text_styles.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.background,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: AppColors.textPrimary),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyles.headlineLarge,
      displayMedium: TextStyles.headlineMedium,
      displaySmall: TextStyles.headlineSmall,
      titleLarge: TextStyles.titleLarge,
      titleMedium: TextStyles.titleMedium,
      titleSmall: TextStyles.titleSmall,
      bodyLarge: TextStyles.bodyLarge,
      bodyMedium: TextStyles.bodyMedium,
      bodySmall: TextStyles.bodySmall,
      labelLarge: TextStyles.labelLarge,
      labelMedium: TextStyles.labelMedium,
      labelSmall: TextStyles.labelSmall,
    ),
    colorScheme: const ColorScheme.light(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      background: AppColors.background,
      surface: AppColors.surface,
    ),
  );

  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.background,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: AppColors.textPrimary),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyles.headlineLarge,
      displayMedium: TextStyles.headlineMedium,
      displaySmall: TextStyles.headlineSmall,
      titleLarge: TextStyles.titleLarge,
      titleMedium: TextStyles.titleMedium,
      titleSmall: TextStyles.titleSmall,
      bodyLarge: TextStyles.bodyLarge,
      bodyMedium: TextStyles.bodyMedium,
      bodySmall: TextStyles.bodySmall,
      labelLarge: TextStyles.labelLarge,
      labelMedium: TextStyles.labelMedium,
      labelSmall: TextStyles.labelSmall,
    ),
    colorScheme: const ColorScheme.dark(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      background: AppColors.background,
      surface: AppColors.surface,
    ),
  );
}
