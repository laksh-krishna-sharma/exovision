import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../app/theme/colors.dart';

import '../../../../app/theme/app_theme.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../shared/widgets/common/space_background.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  int _currentPage = 0;
  final PageController _pageController = PageController();

  final List<Map<String, String>> _features = [
    {
      'title': 'Explore Exoplanets',
      'description': 'Discover thousands of planets beyond our solar system',
      'icon': '🌌',
    },
    {
      'title': 'Real-time Data',
      'description': 'Access the latest exoplanet discoveries and research',
      'icon': '🛰️',
    },
    {
      'title': 'Interactive Learning',
      'description': 'Learn about space with immersive visualizations',
      'icon': '🚀',
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onPageChanged(int page) {
    setState(() {
      _currentPage = page;
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;
    final isTablet = screenSize.width >= 600 && screenSize.width < 1200;

    return Scaffold(
      body: Stack(
        children: [
          // Space Background
          const SpaceBackground(),

          // Content
          SafeArea(
            child: Padding(
              padding: EdgeInsets.all(isMobile ? 20 : 32),
              child: Column(
                children: [
                  // Header
                  _buildHeader(isMobile),
                  SizedBox(height: isMobile ? 40 : 60),

                  // Feature Carousel
                  Expanded(
                    child: _buildFeatureCarousel(isMobile, isTablet),
                  ),

                  // Navigation Dots
                  _buildPageIndicator(isMobile),
                  SizedBox(height: isMobile ? 30 : 40),

                  // Action Buttons
                  _buildActionButtons(isMobile, isTablet),
                  SizedBox(height: isMobile ? 20 : 30),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(bool isMobile) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // App Logo and Name
        Row(
          children: [
            Container(
              width: isMobile ? 40 : 50,
              height: isMobile ? 40 : 50,
              decoration: BoxDecoration(
                gradient: AppColors.buttonGradient,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                Icons.rocket_launch,
                color: Colors.white,
                size: isMobile ? 20 : 25,
              ),
            ),
            SizedBox(width: isMobile ? 12 : 16),
            Text(
              'Exovision',
              style: isMobile
                  ? TextStyles.titleLarge.copyWith(
                      fontWeight: FontWeight.w800,
                    )
                  : TextStyles.headlineSmall.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
            ),
          ],
        ),

        // Skip for now button on first page only
        if (_currentPage == 0)
          TextButton(
            onPressed: () => context.go('/login'),
            child: Text(
              'Skip',
              style: TextStyles.bodyMedium.copyWith(
                color: Colors.white.withOpacity(0.7),
              ),
            ),
          ),
      ],
    ).animate(delay: 300.ms).fadeIn().slideY(begin: -0.5);
  }

  Widget _buildFeatureCarousel(bool isMobile, bool isTablet) {
    return Column(
      children: [
        Expanded(
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: _onPageChanged,
            itemCount: _features.length,
            itemBuilder: (context, index) {
              final feature = _features[index];
              return _buildFeaturePage(
                feature['title']!,
                feature['description']!,
                feature['icon']!,
                isMobile,
                isTablet,
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFeaturePage(
    String title,
    String description,
    String icon,
    bool isMobile,
    bool isTablet,
  ) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: isMobile ? 10 : 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Feature Icon
          Container(
            width: isMobile ? 120 : 160,
            height: isMobile ? 120 : 160,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(80),
              border: Border.all(
                color: Colors.white.withOpacity(0.1),
                width: 2,
              ),
            ),
            child: Center(
              child: Text(
                icon,
                style: TextStyle(fontSize: isMobile ? 50 : 70),
              ),
            ),
          ).animate(delay: 500.ms).scale().fadeIn(),

          SizedBox(height: isMobile ? 40 : 60),

          // Feature Title
          Text(
            title,
            style: isMobile
                ? TextStyles.headlineSmall.copyWith(
                    fontWeight: FontWeight.w700,
                  )
                : TextStyles.headlineMedium.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            textAlign: TextAlign.center,
          ).animate(delay: 700.ms).fadeIn().slideY(begin: 0.5),

          SizedBox(height: isMobile ? 16 : 24),

          // Feature Description
          Text(
            description,
            style: (isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
                .copyWith(
              color: Colors.white.withOpacity(0.7),
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ).animate(delay: 900.ms).fadeIn().slideY(begin: 0.5),
        ],
      ),
    );
  }

  Widget _buildPageIndicator(bool isMobile) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        _features.length,
        (index) => Container(
          width: isMobile ? 8 : 10,
          height: isMobile ? 8 : 10,
          margin: EdgeInsets.symmetric(horizontal: isMobile ? 4 : 6),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: _currentPage == index
                ? AppColors.cyan
                : Colors.white.withOpacity(0.3),
          ),
        ).animate(delay: 1100.ms).fadeIn(),
      ),
    );
  }

  Widget _buildActionButtons(bool isMobile, bool isTablet) {
    return Column(
      children: [
        // Next/Get Started Button
        Container(
          width: isMobile ? double.infinity : (isTablet ? 400 : 300),
          decoration: BoxDecoration(
            gradient: AppColors.buttonGradient,
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: AppColors.cyan.withOpacity(0.3),
                blurRadius: 20,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                if (_currentPage < _features.length - 1) {
                  _pageController.nextPage(
                    duration: 500.ms,
                    curve: Curves.easeInOut,
                  );
                } else {
                  context.go('/login');
                }
              },
              borderRadius: BorderRadius.circular(15),
              child: Container(
                padding: EdgeInsets.symmetric(
                  vertical: isMobile ? 16 : 18,
                  horizontal: 32,
                ),
                child: Center(
                  child: Text(
                    _currentPage < _features.length - 1 ? 'Next' : 'Get Started',
                    style: (isMobile ? TextStyles.bodyLarge : TextStyles.titleMedium)
                        .copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ).animate(delay: 1300.ms).fadeIn().slideY(begin: 0.5),

        SizedBox(height: isMobile ? 16 : 20),

        // Already have account link
        if (_currentPage == _features.length - 1)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Already have an account? ',
                style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
                    .copyWith(
                  color: Colors.white.withOpacity(0.7),
                ),
              ),
              GestureDetector(
                onTap: () => context.go('/login'),
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: Text(
                    'Sign in',
                    style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
                        .copyWith(
                      color: AppColors.cyan,
                      fontWeight: FontWeight.w600,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ),
            ],
          ).animate(delay: 1500.ms).fadeIn(),
      ],
    );
  }
}