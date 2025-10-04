import 'dart:math';
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

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  
  // Card tilt animation states
  double _xRotation = 0;
  double _yRotation = 0;
  bool _isHovered = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleMouseMove(PointerEvent details, BuildContext context, double cardWidth) {
    if (!mounted) return;
    
    final RenderBox box = context.findRenderObject() as RenderBox;
    final offset = box.globalToLocal(details.position);
    
    final x = (offset.dx / cardWidth - 0.5) * 10; // Max 10 degrees
    final y = -(offset.dy / 500 - 0.5) * 10; // Fixed height of 500
    
    setState(() {
      _xRotation = x;
      _yRotation = y;
    });
  }

  void _handleMouseEnter() {
    setState(() => _isHovered = true);
  }

  void _handleMouseLeave() {
    setState(() {
      _isHovered = false;
      _xRotation = 0;
      _yRotation = 0;
    });
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    try {
      await authProvider.login(email, password);
      if (authProvider.isAuthenticated) {
        context.go('/home');
      }
    } catch (error) {
      _showErrorDialog('Login failed. Please try again.');
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

          // Login Content
          Center(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(isMobile ? 20 : 32),
              child: _buildLoginCard(isMobile, isTablet, screenSize),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoginCard(bool isMobile, bool isTablet, Size screenSize) {
    final double cardWidth = isMobile
        ? screenSize.width * 0.9
        : (isTablet ? screenSize.width * 0.6 : 400.0);

    return MouseRegion(
      onEnter: (_) => _handleMouseEnter(),
      onHover: (event) => _handleMouseMove(event, context, cardWidth),
      onExit: (_) => _handleMouseLeave(),
      child: AnimatedContainer(
        duration: 300.ms,
        curve: Curves.easeOut,
        width: cardWidth,
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
              color: AppColors.cyan.withOpacity(_isHovered ? 0.2 : 0.1),
              blurRadius: 30,
              spreadRadius: 2,
            ),
          ],
        ),
        transform: Matrix4.identity()
          ..setEntry(3, 2, 0.001) // Perspective
          ..rotateX(_xRotation * 0.0174533) // Convert to radians
          ..rotateY(_yRotation * 0.0174533),
        child: _buildLoginForm(isMobile),
      ).animate(delay: 300.ms).scale().fadeIn(),
    );
  }

  Widget _buildLoginForm(bool isMobile) {
    final authProvider = context.watch<AuthProvider>();

    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // App Logo and Title
          _buildHeader(isMobile),
          SizedBox(height: isMobile ? 24 : 32),

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
          SizedBox(height: isMobile ? 24 : 32),

          // Login Button
          if (authProvider.isLoading)
            _buildLoadingIndicator(isMobile)
          else
            _buildLoginButton(isMobile),

          SizedBox(height: isMobile ? 20 : 24),

          // Sign Up Link
          _buildSignUpLink(isMobile),

          SizedBox(height: isMobile ? 8 : 12),

          // Footer Fun Fact
          _buildFooter(isMobile),
        ],
      ),
    );
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

        // Login Title
        Text(
          'Login',
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

  Widget _buildLoginButton(bool isMobile) {
    return GlowButton(
      onPressed: _handleLogin,
      text: 'Login',
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
            'Logging in...',
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

  Widget _buildSignUpLink(bool isMobile) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Don\'t have an account? ',
          style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
              .copyWith(
            color: Colors.white.withOpacity(0.7),
          ),
        ),
        GestureDetector(
          onTap: () => context.go('/signup'),
          child: MouseRegion(
            cursor: SystemMouseCursors.click,
            child: Text(
              'Sign up',
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

  Widget _buildFooter(bool isMobile) {
    return Text(
      '“Over 5,000 exoplanets discovered... maybe you\'ll find the next one 🌌”',
      style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium).copyWith(
        color: Colors.white.withOpacity(0.5),
        fontStyle: FontStyle.italic,
      ),
      textAlign: TextAlign.center,
    );
  }
}