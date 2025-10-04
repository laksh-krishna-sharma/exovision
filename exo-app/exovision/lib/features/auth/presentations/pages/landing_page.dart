import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../shared/widgets/common/planet_scene.dart';
import '../providers/auth_provider.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;
    final isTablet = screenSize.width >= 600 && screenSize.width < 1200;

    return Scaffold(
      body: Stack(
        children: [
          // 3D Planet Background
          const PlanetScene(),

          // Overlay Content
          _buildContent(context, isMobile, isTablet),
        ],
      ),
    );
  }

  Widget _buildContent(BuildContext context, bool isMobile, bool isTablet) {
    final authProvider = context.watch<AuthProvider>();
    final isAuthenticated = authProvider.isAuthenticated;

    return Container(
      width: double.infinity,
      height: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // App Title
          _buildAppTitle(isMobile),
          SizedBox(height: isMobile ? 24 : 32),

          // Buttons based on authentication state
          if (isAuthenticated) 
            _buildAuthenticatedButtons(context, isMobile)
          else 
            _buildUnauthenticatedButtons(context, isMobile),
        ],
      ),
    );
  }

  Widget _buildAppTitle(bool isMobile) {
    return Text(
      'Exovision',
      style: isMobile
          ? TextStyles.headlineLarge.copyWith(
              fontSize: 48,
              fontWeight: FontWeight.w800,
            )
          : TextStyles.headlineLarge.copyWith(
              fontSize: 64,
              fontWeight: FontWeight.w800,
            ),
      textAlign: TextAlign.center,
    ).animate(delay: 300.ms).scale().fadeIn();
  }

  Widget _buildAuthenticatedButtons(BuildContext context, bool isMobile) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        _buildButton(
          text: 'Go to Home',
          onPressed: () => context.go('/home'),
          isPrimary: true,
          isMobile: isMobile,
        ),
        SizedBox(height: isMobile ? 12 : 16),
        _buildButton(
          text: 'Logout',
          onPressed: () {
            context.read<AuthProvider>().logout();
            context.go('/');
          },
          isPrimary: false,
          isMobile: isMobile,
          isDestructive: true,
        ),
      ],
    ).animate(delay: 500.ms).slideY(begin: 0.5).fadeIn();
  }

  Widget _buildUnauthenticatedButtons(BuildContext context, bool isMobile) {
    return _buildButton(
      text: 'Start Now',
      onPressed: () => context.go('/login'),
      isPrimary: true,
      isMobile: isMobile,
    ).animate(delay: 500.ms).slideY(begin: 0.5).fadeIn();
  }

  Widget _buildButton({
    required String text,
    required VoidCallback onPressed,
    required bool isPrimary,
    required bool isMobile,
    bool isDestructive = false,
  }) {
    final buttonColor = isDestructive 
        ? Colors.red 
        : (isPrimary ? null : Colors.transparent);

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onPressed,
        child: Container(
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 24 : 32,
            vertical: isMobile ? 14 : 16,
          ),
          decoration: BoxDecoration(
            gradient: isPrimary && !isDestructive 
                ? AppColors.buttonGradient 
                : null,
            color: buttonColor?.withOpacity(isDestructive ? 0.2 : 1.0),
            borderRadius: BorderRadius.circular(12),
            border: isPrimary && !isDestructive 
                ? null 
                : Border.all(
                    color: isDestructive 
                        ? Colors.red.withOpacity(0.5)
                        : Colors.white.withOpacity(0.3),
                    width: 2,
                  ),
            boxShadow: isPrimary 
                ? [
                    BoxShadow(
                      color: AppColors.cyan.withOpacity(0.4),
                      blurRadius: 20,
                      spreadRadius: 2,
                    ),
                  ]
                : null,
          ),
          child: Text(
            text,
            style: (isMobile ? TextStyles.bodyLarge : TextStyles.titleMedium)
                .copyWith(
              color: isDestructive 
                  ? Colors.red.withOpacity(0.9)
                  : (isPrimary ? Colors.white : Colors.white.withOpacity(0.9)),
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}