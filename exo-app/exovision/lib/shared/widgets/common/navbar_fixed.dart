import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../features/auth/presentations/providers/auth_provider.dart';

class NavbarFixed extends StatefulWidget {
  final bool showBackButton;
  final VoidCallback? onBackPressed;
  final String? title;

  const NavbarFixed({
    super.key,
    this.showBackButton = false,
    this.onBackPressed,
    this.title,
  });

  @override
  State<NavbarFixed> createState() => _NavbarFixedState();
}

class _NavbarFixedState extends State<NavbarFixed> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;

    return Container(
      height: isMobile ? 70 : 80,
      decoration: BoxDecoration(
        color: Colors.transparent,
        border: Border(
          bottom: BorderSide(
            color: Colors.white.withOpacity(0.1),
            width: 1,
          ),
        ),
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: isMobile ? 16 : 32,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Logo and Title
            _buildLogoSection(isMobile),
            
            // Navigation Items
            if (!isMobile) _buildDesktopNavigation(),
            
            // Mobile Menu Button
            if (isMobile) _buildMobileMenuButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoSection(bool isMobile) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: () => context.go('/home'),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // App Logo/Icon
            Container(
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              decoration: BoxDecoration(
                gradient: AppColors.buttonGradient,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.rocket_launch,
                color: Colors.white,
                size: isMobile ? 18 : 22,
              ),
            ),
            const SizedBox(width: 12),
            // App Name
            Text(
              'Exovision',
              style: isMobile
                  ? TextStyles.titleMedium.copyWith(
                      fontWeight: FontWeight.w700,
                    )
                  : TextStyles.titleLarge.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
            ),
            if (widget.title != null) ...[
              const SizedBox(width: 8),
              Text(
                '•',
                style: TextStyles.bodyMedium.copyWith(
                  color: Colors.white.withOpacity(0.5),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                widget.title!,
                style: isMobile
                    ? TextStyles.bodyMedium.copyWith(
                        color: Colors.white.withOpacity(0.7),
                      )
                    : TextStyles.bodyLarge.copyWith(
                        color: Colors.white.withOpacity(0.7),
                      ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDesktopNavigation() {
    final authProvider = context.watch<AuthProvider>();
    final isAuthenticated = authProvider.isAuthenticated;

    return Row(
      children: [
        // Navigation Links
        _buildNavItem('Home', '/home'),
        _buildNavItem('Prediction', '/prediction'),
        _buildNavItem('About', '/about'),
        
        const SizedBox(width: 24),
        
        // Auth Section
        if (isAuthenticated) ...[
          _buildUserSection(authProvider),
          const SizedBox(width: 16),
          _buildLogoutButton(),
        ] else ...[
          _buildAuthButtons(),
        ],
      ],
    );
  }

  Widget _buildNavItem(String text, String route) {
    final currentRoute = GoRouterState.of(context).uri.toString();
    final isActive = currentRoute == route;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          onTap: () => context.go(route),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: isActive ? Colors.white.withOpacity(0.1) : Colors.transparent,
            ),
            child: Text(
              text,
              style: TextStyles.bodyMedium.copyWith(
                color: isActive ? AppColors.cyan : Colors.white.withOpacity(0.8),
                fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUserSection(AuthProvider authProvider) {
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: AppColors.buttonGradient,
          ),
          child: Icon(
            Icons.person,
            color: Colors.white,
            size: 18,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          authProvider.user?.username ?? 'User',
          style: TextStyles.bodyMedium.copyWith(
            color: Colors.white.withOpacity(0.9),
          ),
        ),
      ],
    );
  }

  Widget _buildLogoutButton() {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () {
          context.read<AuthProvider>().logout();
          context.go('/');
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: Colors.red.withOpacity(0.3),
            ),
            color: Colors.red.withOpacity(0.1),
          ),
          child: Row(
            children: [
              Icon(
                Icons.logout,
                color: Colors.red.withOpacity(0.8),
                size: 16,
              ),
              const SizedBox(width: 6),
              Text(
                'Logout',
                style: TextStyles.bodyMedium.copyWith(
                  color: Colors.red.withOpacity(0.8),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAuthButtons() {
    return Row(
      children: [
        _buildAuthButton('Login', '/login', false),
        const SizedBox(width: 12),
        _buildAuthButton('Sign Up', '/signup', true),
      ],
    );
  }

  Widget _buildAuthButton(String text, String route, bool isPrimary) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => context.go(route),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            gradient: isPrimary ? AppColors.buttonGradient : null,
            color: isPrimary ? null : Colors.transparent,
            border: isPrimary
                ? null
                : Border.all(
                    color: Colors.white.withOpacity(0.3),
                  ),
          ),
          child: Text(
            text,
            style: TextStyles.bodyMedium.copyWith(
              color: isPrimary ? Colors.white : Colors.white.withOpacity(0.9),
              fontWeight: isPrimary ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMobileMenuButton() {
    return PopupMenuButton<String>(
      icon: Icon(
        Icons.menu,
        color: Colors.white,
        size: 24,
      ),
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: Colors.white.withOpacity(0.1),
        ),
      ),
      onSelected: (value) {
        if (value == 'logout') {
          context.read<AuthProvider>().logout();
          context.go('/');
        } else {
          context.go(value);
        }
      },
      itemBuilder: (BuildContext context) {
        final authProvider = context.read<AuthProvider>();
        final isAuthenticated = authProvider.isAuthenticated;

        return [
          if (isAuthenticated) ...[
            PopupMenuItem(
              value: '/home',
              child: Row(
                children: [
                  Icon(Icons.home, color: Colors.white.withOpacity(0.8)),
                  const SizedBox(width: 8),
                  Text('Home', style: TextStyles.bodyMedium),
                ],
              ),
            ),
            PopupMenuItem(
              value: '/prediction',
              child: Row(
                children: [
                  Icon(Icons.analytics, color: Colors.white.withOpacity(0.8)),
                  const SizedBox(width: 8),
                  Text('Prediction', style: TextStyles.bodyMedium),
                ],
              ),
            ),
            const PopupMenuDivider(),
            PopupMenuItem(
              value: 'logout',
              child: Row(
                children: [
                  Icon(Icons.logout, color: Colors.red.withOpacity(0.8)),
                  const SizedBox(width: 8),
                  Text('Logout', style: TextStyles.bodyMedium.copyWith(
                    color: Colors.red.withOpacity(0.8),
                  )),
                ],
              ),
            ),
          ] else ...[
            PopupMenuItem(
              value: '/login',
              child: Row(
                children: [
                  Icon(Icons.login, color: Colors.white.withOpacity(0.8)),
                  const SizedBox(width: 8),
                  Text('Login', style: TextStyles.bodyMedium),
                ],
              ),
            ),
            PopupMenuItem(
              value: '/signup',
              child: Row(
                children: [
                  Icon(Icons.person_add, color: Colors.white.withOpacity(0.8)),
                  const SizedBox(width: 8),
                  Text('Sign Up', style: TextStyles.bodyMedium),
                ],
              ),
            ),
          ],
        ];
      },
    );
  }
}