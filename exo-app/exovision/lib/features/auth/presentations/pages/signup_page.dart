import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../shared/widgets/common/space_background.dart';
import '../../../../shared/widgets/inputs/glow_text_field.dart';
import '../../../../shared/widgets/buttons/glow_button.dart';
import '../providers/auth_provider.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (password != confirmPassword) {
      _showErrorDialog('Passwords do not match');
      return;
    }

    try {
      await authProvider.signup(name, email, password);
      if (authProvider.isAuthenticated) {
        context.go('/home');
      }
    } catch (error) {
      _showErrorDialog('Signup failed. Please try again.');
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: Text(
          'Error',
          style: TextStyles.titleMedium.copyWith(color: Colors.white),
        ),
        content: Text(
          message,
          style: TextStyles.bodyMedium.copyWith(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'OK',
              style: TextStyles.bodyMedium.copyWith(color: AppColors.cyan),
            ),
          ),
        ],
      ),
    );
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

          // Signup Content
          if (isMobile)
            _buildMobileLayout()
          else
            _buildDesktopTabletLayout(isTablet, screenSize),
        ],
      ),
    );
  }

  Widget _buildMobileLayout() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.05),
          _buildSignupCard(true),
          SizedBox(height: 40),
          _buildExoplanetInfo(true),
        ],
      ),
    );
  }

  Widget _buildDesktopTabletLayout(bool isTablet, Size screenSize) {
    return Row(
      children: [
        // Left: Signup Card
        Expanded(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(isTablet ? 40 : 60),
            child: Center(
              child: ConstrainedBox(
                constraints: BoxConstraints(maxWidth: 500),
                child: _buildSignupCard(false),
              ),
            ),
          ),
        ),

        // Right: Exoplanet Info
        Expanded(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(isTablet ? 40 : 60),
            child: _buildExoplanetInfo(false),
          ),
        ),
      ],
    );
  }

  Widget _buildSignupCard(bool isMobile) {
    final authProvider = context.watch<AuthProvider>();

    return Container(
      padding: EdgeInsets.all(isMobile ? 24 : 32),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 5,
          ),
          BoxShadow(
            color: AppColors.cyan.withOpacity(0.1),
            blurRadius: 30,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // App Logo and Title
            _buildHeader(isMobile),
            SizedBox(height: isMobile ? 24 : 32),

            // Name Field
            GlowTextField(
              controller: _nameController,
              labelText: 'Full Name',
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your name';
                }
                if (value.length < 2) {
                  return 'Name must be at least 2 characters';
                }
                return null;
              },
              isMobile: isMobile,
            ),
            SizedBox(height: isMobile ? 16 : 20),

            // Email Field
            GlowTextField(
              controller: _emailController,
              labelText: 'Email',
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your email';
                }
                if (!value.contains('@')) {
                  return 'Please enter a valid email';
                }
                return null;
              },
              isMobile: isMobile,
            ),
            SizedBox(height: isMobile ? 16 : 20),

            // Password Field
            GlowTextField(
              controller: _passwordController,
              labelText: 'Password',
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your password';
                }
                if (value.length < 6) {
                  return 'Password must be at least 6 characters';
                }
                return null;
              },
              isMobile: isMobile,
            ),
            SizedBox(height: isMobile ? 16 : 20),

            // Confirm Password Field
            GlowTextField(
              controller: _confirmPasswordController,
              labelText: 'Confirm Password',
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please confirm your password';
                }
                if (value != _passwordController.text) {
                  return 'Passwords do not match';
                }
                return null;
              },
              isMobile: isMobile,
            ),
            SizedBox(height: isMobile ? 24 : 32),

            // Signup Button
            if (authProvider.isLoading)
              _buildLoadingIndicator(isMobile)
            else
              _buildSignupButton(isMobile),

            SizedBox(height: isMobile ? 20 : 24),

            // Login Link
            _buildLoginLink(isMobile),
          ],
        ),
      ),
    ).animate(delay: 300.ms).scale().fadeIn();
  }

  Widget _buildHeader(bool isMobile) {
    return Column(
      children: [
        // App Icon
        Container(
          width: isMobile ? 60 : 80,
          height: isMobile ? 60 : 80,
          decoration: BoxDecoration(
            gradient: AppColors.buttonGradient,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: AppColors.cyan.withOpacity(0.4),
                blurRadius: 20,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Icon(
            Icons.rocket_launch,
            color: Colors.white,
            size: isMobile ? 30 : 40,
          ),
        ),
        SizedBox(height: isMobile ? 16 : 20),

        // App Name
        Text(
          'Exovision',
          style: isMobile
              ? TextStyles.headlineMedium.copyWith(
                  fontWeight: FontWeight.w800,
                )
              : TextStyles.headlineLarge.copyWith(
                  fontWeight: FontWeight.w800,
                ),
        ),
        SizedBox(height: isMobile ? 4 : 8),

        // Subtitle
        Text(
          'Explore the universe of exoplanets 🚀',
          style: isMobile
              ? TextStyles.bodyMedium.copyWith(
                  color: Colors.white.withOpacity(0.6),
                )
              : TextStyles.bodyLarge.copyWith(
                  color: Colors.white.withOpacity(0.6),
                ),
          textAlign: TextAlign.center,
        ),
        SizedBox(height: isMobile ? 8 : 12),

        // Signup Title
        Text(
          'Create Account',
          style: isMobile
              ? TextStyles.titleLarge.copyWith(
                  fontWeight: FontWeight.w600,
                )
              : TextStyles.headlineSmall.copyWith(
                  fontWeight: FontWeight.w600,
                ),
        ),
      ],
    ).animate(delay: 500.ms).slideY(begin: -0.5).fadeIn();
  }

  Widget _buildSignupButton(bool isMobile) {
    return GlowButton(
      onPressed: _handleSignup,
      text: 'Sign Up',
      isPrimary: true,
      isMobile: isMobile,
    );
  }

  Widget _buildLoadingIndicator(bool isMobile) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 32 : 40,
        vertical: isMobile ? 14 : 16,
      ),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: isMobile ? 16 : 20,
            height: isMobile ? 16 : 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: Colors.white,
            ),
          ),
          SizedBox(width: isMobile ? 12 : 16),
          Text(
            'Creating account...',
            style: (isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
                .copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoginLink(bool isMobile) {
    return Row(
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
              'Login',
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
    );
  }

  Widget _buildExoplanetInfo(bool isMobile) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section 1: Exoplanets Introduction
        _buildInfoSection(
          title: 'Exoplanets',
          content: 'An exoplanet is any planet beyond our solar system. Most of them '
              'orbit other stars, but some free-floating exoplanets, called rogue '
              'planets, are untethered to any star. We\'ve confirmed nearly 6,000 '
              'exoplanets, out of the billions that we believe exist.',
          isMobile: isMobile,
        ),
        SizedBox(height: isMobile ? 30 : 40),

        // Section 2: Types of Exoplanets
        _buildInfoSection(
          title: 'Types of Exoplanets',
          content: '',
          isMobile: isMobile,
          hasImage: true,
        ),
        SizedBox(height: isMobile ? 30 : 40),

        // Section 3: Detailed Types
        _buildDetailedTypes(isMobile),
      ],
    ).animate(delay: 700.ms).slideX(begin: 0.5).fadeIn();
  }

  Widget _buildInfoSection({
    required String title,
    required String content,
    required bool isMobile,
    bool hasImage = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: isMobile
              ? TextStyles.headlineSmall.copyWith(
                  fontWeight: FontWeight.bold,
                )
              : TextStyles.headlineMedium.copyWith(
                  fontWeight: FontWeight.bold,
                ),
        ),
        SizedBox(height: isMobile ? 12 : 16),
        if (content.isNotEmpty)
          Text(
            content,
            style: (isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
                .copyWith(
              color: Colors.white.withOpacity(0.8),
              height: 1.6,
            ),
          ),
        if (hasImage)
          Container(
            margin: EdgeInsets.only(top: isMobile ? 16 : 20),
            child: Image.asset(
              'assets/images/exoplanet_types.png',
              width: double.infinity,
              height: isMobile ? 200 : 300,
              fit: BoxFit.contain,
            ),
          ),
      ],
    );
  }

  Widget _buildDetailedTypes(bool isMobile) {
    final types = [
      {
        'title': 'Gas Giants',
        'description': 'Planets the size of Saturn or Jupiter, or much larger. '
            'Some are "hot Jupiters" orbiting very close to their stars, '
            'reaching scorching temperatures.',
      },
      {
        'title': 'Neptunian Planets',
        'description': 'Similar in size to Neptune or Uranus, with atmospheres '
            'dominated by hydrogen and helium and rocky cores.',
      },
      {
        'title': 'Super-Earths',
        'description': 'Rocky worlds, more massive than Earth but lighter than '
            'Neptune, with or without atmospheres.',
      },
      {
        'title': 'Terrestrial Planets',
        'description': 'Earth-sized or smaller rocky planets, made of silicate, '
            'water, or carbon. Some may host atmospheres, oceans, or even '
            'conditions suitable for life.',
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Exoplanet Classification',
          style: isMobile
              ? TextStyles.headlineSmall.copyWith(
                  fontWeight: FontWeight.bold,
                )
              : TextStyles.headlineMedium.copyWith(
                  fontWeight: FontWeight.bold,
                ),
        ),
        SizedBox(height: isMobile ? 16 : 20),
        ...types.map((type) => _buildTypeItem(
              title: type['title']!,
              description: type['description']!,
              isMobile: isMobile,
            )),
      ],
    );
  }

  Widget _buildTypeItem({
    required String title,
    required String description,
    required bool isMobile,
  }) {
    return Container(
      margin: EdgeInsets.only(bottom: isMobile ? 12 : 16),
      padding: EdgeInsets.all(isMobile ? 16 : 20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: (isMobile ? TextStyles.titleSmall : TextStyles.titleMedium)
                .copyWith(
              color: AppColors.cyan,
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: isMobile ? 8 : 12),
          Text(
            description,
            style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
                .copyWith(
              color: Colors.white.withOpacity(0.8),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}