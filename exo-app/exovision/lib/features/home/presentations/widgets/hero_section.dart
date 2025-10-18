import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../presentations/providers/home_providers.dart';

class HeroSection extends StatelessWidget {
  final bool isMobile;
  final bool isTablet;

  const HeroSection({
    super.key,
    required this.isMobile,
    required this.isTablet,
  });

  @override
  Widget build(BuildContext context) {
    final homeProvider = context.watch<HomeProvider>();
    final username = homeProvider.user?.username ?? 'Explorer';

    return Container(
      width: double.infinity,
      height: MediaQuery.of(context).size.height,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 20 : (isTablet ? 40 : 60),
        vertical: 100,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // About the Project
          _buildAboutSection(context, isMobile),
          const Spacer(),
          // Main Hero Content
          _buildMainHero(context, username, isMobile),
        ],
      ),
    );
  }

  Widget _buildAboutSection(BuildContext context, bool isMobile) {
    return _buildAnimatedContainer(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Unveiling New Worlds',
            style: isMobile
                ? TextStyles.headlineMedium.copyWith(
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  )
                : TextStyles.headlineLarge.copyWith(
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
          ),
          SizedBox(height: isMobile ? 16 : 24),
          Text(
            'The universe is teeming with countless stars, many with planets of their own. '
            'Sifting through this cosmic data has been a slow, manual process prone to error. '
            'Our project leverages cutting-edge AI to automate the search, making the discovery '
            'of distant worlds faster and more accurate than ever.',
            style: isMobile
                ? TextStyles.bodyMedium.copyWith(
                    color: Colors.white.withOpacity(0.8),
                    height: 1.6,
                  )
                : TextStyles.bodyLarge.copyWith(
                    color: Colors.white.withOpacity(0.8),
                    height: 1.6,
                  ),
          ),
        ],
      ),
    ).animate(delay: 200.ms).slideX(begin: -0.3).fadeIn();
  }

  Widget _buildMainHero(BuildContext context, String username, bool isMobile) {
    return _buildAnimatedContainer(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // UFO Image with working scale animation
          _buildAnimatedUfo(isMobile),
          SizedBox(height: isMobile ? 20 : 32),
          
          // Welcome Text
          _buildWelcomeText(context, username, isMobile),
          SizedBox(height: isMobile ? 12 : 16),
          
          // Subtitle
          _buildSubtitle(isMobile),
          SizedBox(height: isMobile ? 20 : 32),
          
          // Start Prediction Button
          _buildPredictionButton(context, isMobile),
        ],
      ),
    ).animate(delay: 400.ms).slideX(begin: 0.3).fadeIn();
  }

  Widget _buildAnimatedUfo(bool isMobile) {
    // Use a StatefulWidget for the UFO animation to avoid the scale issue
    return _UfoAnimation(
      isMobile: isMobile,
    );
  }

  Widget _buildWelcomeText(BuildContext context, String username, bool isMobile) {
    return RichText(
      text: TextSpan(
        text: 'Welcome, ',
        style: isMobile
            ? TextStyles.headlineSmall.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              )
            : TextStyles.headlineLarge.copyWith(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
        children: [
          TextSpan(
            text: username,
            style: isMobile
                ? TextStyles.headlineSmall.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.cyan,
                  )
                : TextStyles.headlineLarge.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.cyan,
                  ),
          ),
        ],
      ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildSubtitle(bool isMobile) {
    return Text(
      'Ready to discover the unknown?',
      style: isMobile
          ? TextStyles.bodyMedium.copyWith(
              color: Colors.white.withOpacity(0.7),
            )
          : TextStyles.bodyLarge.copyWith(
              color: Colors.white.withOpacity(0.7),
            ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildPredictionButton(BuildContext context, bool isMobile) {
    return ElevatedButton(
      onPressed: () => context.go('/prediction'),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
        side: BorderSide(
          color: Colors.white.withOpacity(0.4),
          width: 2,
        ),
        padding: EdgeInsets.symmetric(
          horizontal: isMobile ? 24 : 32,
          vertical: isMobile ? 12 : 16,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ).copyWith(
        overlayColor: MaterialStateProperty.resolveWith<Color?>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.hovered)) {
              return Colors.white.withOpacity(0.1);
            }
            return null;
          },
        ),
      ),
      child: Text(
        'Start Prediction',
        style: isMobile
            ? TextStyles.bodyLarge.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              )
            : TextStyles.titleMedium.copyWith(
                color: Colors.white,
              ),
      ),
    );
  }

  Widget _buildAnimatedContainer({required Widget child}) {
    return child;
  }
}

// Separate widget for UFO animation to avoid the scale issue
class _UfoAnimation extends StatefulWidget {
  final bool isMobile;

  const _UfoAnimation({required this.isMobile});

  @override
  State<_UfoAnimation> createState() => _UfoAnimationState();
}

class _UfoAnimationState extends State<_UfoAnimation> 
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _animation = Tween<double>(
      begin: 0.9,
      end: 1.1,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.scale(
          scale: _animation.value,
          child: child,
        );
      },
      child: Image.asset(
        'assets/images/ufo.png',
        width: widget.isMobile ? 80 : 120,
        height: widget.isMobile ? 80 : 120,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}